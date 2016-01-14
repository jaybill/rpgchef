import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db, { conn } from '../db';
import Sequelize from 'sequelize';
import Stripe from 'stripe';

const Payment = {};

const stripe = Stripe(process.env.STRIPE_SK);

const assignPlan = (customerId, plan) => {

  return new Promise((resolve, reject) => {
    stripe.customers.createSubscription(customerId, {
      plan: plan
    }, (err, subscription) => {
      if (err) {
        reject(err);
      } else {
        resolve(subscription);
      }
    });

  });

};

const deleteCustomer = (customerId) => {

  return new Promise((resolve, reject) => {
    stripe.customers.del(customerId, (err, confirmation) => {
      if (err) {
        reject(err);
      } else {
        resolve(confirmation);
      }
    });
  });
};


const createCustomer = (userId, tokenId) => {

  return new Promise((resolve, reject) => {
    stripe.customers.create({
      source: tokenId,
      metadata: {
        userId: userId
      }
    }, (err, customer) => {
      if (err) {
        reject(err);
      } else {
        resolve(customer);
      }

    });
  });

};


Payment.handlers = {

  subscribe: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      payload: {
        plan: Joi.string().required(),
        token: Joi.object().required()
      }
    },

    handler: (request, reply) => {
      const userId = request.auth.credentials.id;
      const stripeData = {
        userId: userId
      };

      Db.StripeUsers.findOne({
        where: {
          userId: userId
        }
      }).then((existingCustomer) => {
        if (existingCustomer) {
          throw new Error("user " + userId + " already has customer data");
        }
        return createCustomer(userId, request.payload.token.id);
      }).then((customer) => {
        stripeData.customer = customer;
        return assignPlan(customer.id, request.payload.plan);
      }).then((subscription) => {
        stripeData.subscription = subscription;
        return Db.StripeUsers.create(stripeData);
      }).then((sR) => {
        reply(sR);
      }).catch(err => {
        log.error(err);
        reply(Boom.create(500, err.message));
      });


    }
  },
  cancel: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (request, reply) => {
      const userId = request.auth.credentials.id;

      let dbCustomer;
      let sConfirmation;
      Db.StripeUsers.findOne({
        where: {
          userId: userId
        }
      }).then((customer) => {
        if (!customer) {
          throw new Error("No subscription for user " + userId);
        } else {
          dbCustomer = customer;
        }
        return deleteCustomer(customer.customer.id);
      }).then((confirmation) => {
        sConfirmation = confirmation;
        return dbCustomer.destroy();
      }).then((del) => {
        reply(sConfirmation);
      }).catch(err => {
        log.error(err);
        reply(Boom.create(500, err.message));
      });
    }
  },
  details: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (request, reply) => {
      const userId = request.auth.credentials.id;

      Db.StripeUsers.findOne({
        where: {
          userId: userId
        }
      }).then((customer) => {
        reply(customer || false);
      }).catch(err => {
        log.error(err);
        reply(Boom.create(500, err.message));
      });


    }
  }
}

export default Payment;

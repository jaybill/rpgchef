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

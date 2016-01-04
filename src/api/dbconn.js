import Sequelize from 'sequelize';

var sequelize = new Sequelize(process.env.POSTGRES, {
  //  logging: false,
  pool: {
    min: 2,
    max: 10,
    idle: 10000
  }
});
;

export default sequelize;

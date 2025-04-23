const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Node_SM', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;

const sequelize = require('../config/db')
const DataTypes = require('sequelize');

const Like = sequelize.define('like', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    forPost: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['forPost', 'createdBy'],
            name: 'unique_post_user_like'
        }
    ]
});

module.exports = Like;

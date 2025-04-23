const sequelize = require('../config/db')
const DataTypes = require('sequelize');

const postImages = sequelize.define('post_images', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = postImages;
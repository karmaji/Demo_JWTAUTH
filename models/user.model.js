var Sequelize = require('sequelize');
var DataTypes = Sequelize;
module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("users", {    
    username: {
        type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
  },
    password: {
        type: DataTypes.STRING
    },
    code : {
      type: DataTypes.STRING
    },
    isActive: {
      type: DataTypes.BOOLEAN
    }
   
  });    
    
    return user;
};
    
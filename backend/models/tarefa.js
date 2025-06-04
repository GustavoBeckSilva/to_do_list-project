'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tarefa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tarefa.init({
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    concluida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    prazo: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Tarefa',
  });
  return Tarefa;
};
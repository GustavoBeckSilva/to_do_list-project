'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class Tarefa extends Model {
    static associate(models) {}
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
    },
    createdAt: { 
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: { 
      type: DataTypes.DATE,
      allowNull: false
    }
  },{
    sequelize,
    modelName: 'Tarefa',
    tableName: 'tb_tarefas',
    timestamps: true
  }
  );
  return Tarefa;
};
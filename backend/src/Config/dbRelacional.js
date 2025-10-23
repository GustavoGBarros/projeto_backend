const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('portfolio_db', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres'
});

const conectarDbRelacional = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL conectado com sucesso.');
    } catch (error) {
        console.error('Não foi possível conectar ao PostgreSQL:', error);
    }
};

module.exports = { sequelize, conectarDbRelacional };
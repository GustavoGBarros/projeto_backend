require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const conectarBancoDeDados = require('./src/Config/bancoDeDados');
const { conectarDbRelacional } = require('./src/Config/dbRelacional');
const errosMiddleware = require('./src/Middlewares/errosMiddleware');

const autenticacaoRoutes = require('./src/routes/autenticacaoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const projetoRoutes = require('./src/routes/projetoRoutes');
const publicoRoutes = require('./src/routes/publicoRoutes');
const setupRoutes = require('./src/routes/setupRoutes');
const publicoController = require('./src/controllers/publicoController');

conectarBancoDeDados();
conectarDbRelacional();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', publicoController.renderizarPaginaPrincipal);

app.use('/api/auth', autenticacaoRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projetos', projetoRoutes);

app.use('/api/publico', publicoRoutes);

app.use(errosMiddleware);

const PORTA = process.env.PORTA || 5000;
app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));
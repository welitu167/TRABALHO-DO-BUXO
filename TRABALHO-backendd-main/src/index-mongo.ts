import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rotasAutenticadas from './rotas/rotas-autenticadas.js';
import rotasNaoAutenticadas from './rotas/rotas-nao-autenticadas.js';
import Auth from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(rotasNaoAutenticadas);
app.use(Auth);
app.use(rotasAutenticadas);

// Middleware de tratamento de erros (DEVE ser o ÚLTIMO)
app.use(errorHandler);

const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';
app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}/`);
});


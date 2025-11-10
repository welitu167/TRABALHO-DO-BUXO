import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rotasAutenticadas from './rotas/rotas-autenticadas.js';
import rotasNaoAutenticadas from './rotas/rotas-nao-autenticadas.js';
import Auth from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(rotasNaoAutenticadas);
app.use(Auth);
app.use(rotasAutenticadas);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


import express from "express";
import cors from "cors";
import usersRoutes from "./Routes/users.js"; // Pode manter 'users' se preferir
import { authenticate, authRoutes} from "./middleware/auth.js"; //
import commentsRoutes from "./Routes/comments.js"; // Importando as rotas de comentários
import yahooFinanceRoutes from "./Routes/yahoo.js"; // Importando as rotas de Yahoo Finance
import axios from "axios"; // Importando axios para fazer requisições HTTP

const app = express();

app.use(express.json());
app.use(cors());

// Montar rotas de usuários sob um prefixo /api para evitar conflitos e melhor organização
app.use('/api/user', usersRoutes); // Agora as rotas de users.js estarão em /api/users/*
app.use('/api/auth', authRoutes);   // Rotas de autenticação em /api/auth/*
app.use('/api/comments', authenticate, commentsRoutes); // Rotas de comentários em /api/comments/*

const BRAPI_TOKEN = '6bJnvRHPvWoYdSmgtX18Ly'; // Seu token com Bearer

app.get('/api/yahoo/:ticker', async (req, res) => {
  const { ticker } = req.params;

  try {
    const response = await axios.get(`https://brapi.dev/api/quote/${ticker}`, {
      params: {
        range: '3mo',                 // 1 ano
        interval: '1d',             // intervalo mensal (ideal para gráfico)
        fundamental: true,
        dividends: false,
        modules: 'summaryProfile'
      },
      headers: {
        Authorization: `Bearer ${BRAPI_TOKEN}`,
      }
    });

    const resultado = response.data.results?.[0];

    if (!resultado) {
      return res.status(404).json({ erro: 'Ticker não encontrado' });
    }

    res.json({
      dadosCompletos: resultado,
      graficoMensal: resultado.historicalDataPrice || [],
    });

  } catch (error) {
    if (error.response) {
      console.error('Erro na resposta:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Erro:', error.message);
      res.status(500).json({ erro: 'Erro desconhecido ao acessar a BRAPI' });
    }
  }
});




app.listen(8801, () => { //
    console.log("Backend server is running on port 8801");
});

/* 
TODO

- [ ] Criar o CRUD de usuários
- [ ] Criar as rotas de autenticação
- [ ] Criar autenticação
- [ ] Verificar como popular o banco de dados com dados da empresa
- [ ] Adicionar as rotas restantes(Ler em seguir)
*/


/* 
Quais são as rotas restantes?

criar usuário correto
modificar senha de usuário
puxar notícias por empresa
puxar dados de cada empresa

Algumas coisas a mais que eu esqueci de adicionar
*/

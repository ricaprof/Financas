import express from "express";
import cors from "cors";
import usersRoutes from "./Routes/users.js"; // Pode manter 'users' se preferir
import { authenticate, authRoutes} from "./middleware/auth.js"; //
import commentsRoutes from "./Routes/comments.js"; // Importando as rotas de comentários

const app = express();

app.use(express.json());
app.use(cors());

// Montar rotas de usuários sob um prefixo /api para evitar conflitos e melhor organização
app.use('/api/user', usersRoutes); // Agora as rotas de users.js estarão em /api/users/*
app.use('/api/auth', authRoutes);   // Rotas de autenticação em /api/auth/*
app.use('/api/comments', authenticate,commentsRoutes); // Rotas de comentários em /api/comments/*


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

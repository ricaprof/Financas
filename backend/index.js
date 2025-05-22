import express from "express";
import cors from "cors";
import users from "./Routes/users.js";
import { authenticate, authRoutes} from "./middleware/auth.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', users);


app.use('/auth', authRoutes); // Login: POST /auth/login

//Exemplo de uso após autenticação
// app.use('/rotaAutenticada', authenticate, Rota aqui);


app.listen(8801);


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

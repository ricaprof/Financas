// Routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { register , login} from "../Controllers/auth.js";


const router = express.Router();

const SECRET = "sua_chave_supersecreta";

// Simulação de "banco de dados"
const users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("admin123", 8), role: "admin" },
  { id: 2, username: "usuariox", password: bcrypt.hashSync("user123", 8), role: "user" }
];



// Criar usuário
router.post("/register", register);
router.post("/login", login)



export const authRoutes = router;

// Middleware
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token recebido:", token);

  if (!token) return res.status(401).json({ message: "Token não enviado" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    req.user = user;
    next();
  });
};

  
// Role check (opcional)
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Acesso negado" });
  next();
};

// middlewares/paginacao.js
export const paginacaoMiddleware = (maxLimit = 100) => {
  return (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, maxLimit);
    const offset = (page - 1) * limit;

    req.paginacao = { page, limit, offset };
    next();
  };
};

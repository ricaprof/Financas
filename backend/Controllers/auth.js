import {db} from '../db.js';

// Routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const router = express.Router();

//Arrumar isso aqui
const SECRET = "sua_chave_supersecreta";



// Criar usuário
export const register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(req.body)

    //Verificar os campos
    if (!name || !password || !email ) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }
    

    //Verificar se as Senhas coincidem
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "As senhas não coincidem" });
    }
    
    //Hash da Senha
    const hashedPassword = await bcrypt.hash(password, 8);

    
    try {

        //Verifica se o Usuário já existe
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        const existingUser = rows[0];
        if (existingUser) {
            return res.status(409).json({ message: "Usuário com este email já existe" });
        }

        const result = await db.query("INSERT INTO users (username, password_hash, email, created_at) VALUES (?, ?, ?, ?)",
           [name, hashedPassword, email, new Date()]);
       

        const newUser = {
            id: result.insertId,
            name,
        };

        res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};



export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
  
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  
      if (rows.length === 0) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }
  
      const user = rows[0];
      const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Senha incorreta" });
      }
  
      const token = jwt.sign(
        {
          id: user.idusers,
          name: user.name,
        },
        SECRET,
        { expiresIn: "8h" }
      );
  
      res.status(200).json({
        message: "Login bem-sucedido",
        token,
        user: {
          id: user.idusers,
          name: user.name,
          email: user.email,
        }
      });
    } catch (error) {
      console.error("Erro ao processar login:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };
  



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

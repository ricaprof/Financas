import express from "express";
import { register } from "../Controllers/auth.js";

const router = express.Router();

// Rota existente para buscar todos os usuários (pode ser restrita a admin no futuro)


router.get("/register", register)


export default router;
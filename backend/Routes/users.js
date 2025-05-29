import express from "express";
import {
    getUsers,            // Função existente
    getUserProfile,      // NOVO
    updateUserProfile,   // NOVO
    updateUserPassword,  // NOVO
    updateUserPreferences// NOVO
} from "../Controllers/users.js";
import { authenticate } from "../middleware/auth.js"; //

const router = express.Router();

// Rota existente para buscar todos os usuários (pode ser restrita a admin no futuro)
router.get("/", getUsers); //

// Novas rotas para o perfil do usuário logado
// Assumindo que este router será montado em /api/users no backend/index.js
router.get("/me", authenticate, getUserProfile);
router.put("/me", authenticate, updateUserProfile);
router.put("/me/password", authenticate, updateUserPassword);
router.put("/me/preferences", authenticate, updateUserPreferences);

export default router;
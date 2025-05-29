import { db } from '../db.js'; //
import bcrypt from "bcryptjs"; //

export const getUsers = async (req, res) => { // Função existente
  try {
    // Selecionar apenas campos não sensíveis e não a senha
    const [rows] = await db.query('SELECT idusers, name, email FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

export const getUserProfile = async (req, res) => {
    const userId = req.user.id; // Vem do token JWT via middleware 'authenticate'
    try {
        // Certifique-se de que sua tabela 'users' tenha as colunas theme_preference e notifications_enabled
        const [rows] = await db.query(
            "SELECT idusers, name, email, theme_preference, notifications_enabled FROM users WHERE idusers = ?", 
            [userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        
        // Preparar o objeto de resposta, tratando valores nulos das preferências
        const userProfileData = rows[0];
        const profileResponse = {
            id: userProfileData.idusers,
            nome: userProfileData.name,
            email: userProfileData.email,
            theme: userProfileData.theme_preference === null ? 'system' : userProfileData.theme_preference,
            notificationsEnabled: userProfileData.notifications_enabled === null ? true : Boolean(userProfileData.notifications_enabled)
        };
        
        res.status(200).json(profileResponse);
    } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor ao buscar perfil." });
    }
};

export const updateUserProfile = async (req, res) => {
    const userId = req.user.id; //
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ message: "Nome e email são obrigatórios." });
    }
    // Adicionar validações mais robustas para nome (ex: tamanho) e email (formato)

    try {
        const [existingEmail] = await db.query("SELECT idusers FROM users WHERE email = ? AND idusers <> ?", [email, userId]);
        if (existingEmail.length > 0) {
            return res.status(409).json({ message: "Este email já está em uso por outra conta." });
        }

        const [result] = await db.query("UPDATE users SET name = ?, email = ? WHERE idusers = ?", [nome, email, userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado para atualização." });
        }
        const updatedUser = { id: userId, name: nome, email: email };
        res.status(200).json({ message: "Perfil atualizado com sucesso!", user: updatedUser });
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        res.status(500).json({ message: "Erro interno do servidor ao atualizar perfil." });
    }
};

export const updateUserPassword = async (req, res) => {
    const userId = req.user.id; //
    const { senhaAtual, novaSenha, confirmarNovaSenha } = req.body;

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
        return res.status(400).json({ message: "Todos os campos de senha são obrigatórios." });
    }
    if (novaSenha !== confirmarNovaSenha) {
        return res.status(400).json({ message: "As novas senhas não coincidem." });
    }
    if (novaSenha.length < 6) { 
        return res.status(400).json({ message: "A nova senha deve ter pelo menos 6 caracteres." });
    }
    if (novaSenha === senhaAtual) {
        return res.status(400).json({ message: "A nova senha não pode ser igual à senha atual." });
    }

    try {
        const [userRows] = await db.query("SELECT password FROM users WHERE idusers = ?", [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        const user = userRows[0];

        const isPasswordCorrect = await bcrypt.compare(senhaAtual, user.password); //
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Senha atual incorreta." });
        }

        const hashedNewPassword = await bcrypt.hash(novaSenha, 8); //
        await db.query("UPDATE users SET password = ? WHERE idusers = ?", [hashedNewPassword, userId]);

        res.status(200).json({ message: "Senha alterada com sucesso!" });
    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        res.status(500).json({ message: "Erro interno do servidor ao alterar senha." });
    }
};

export const updateUserPreferences = async (req, res) => {
    const userId = req.user.id; //
    const { theme, notificationsEnabled } = req.body;

    const fieldsToUpdate = {};
    let validUpdate = false;

    if (theme !== undefined) {
        if (['system', 'light', 'dark'].includes(theme)) {
            fieldsToUpdate.theme_preference = theme;
            validUpdate = true;
        } else {
            return res.status(400).json({ message: "Valor de tema inválido." });
        }
    }
    if (notificationsEnabled !== undefined) {
        if (typeof notificationsEnabled === 'boolean') {
            fieldsToUpdate.notifications_enabled = notificationsEnabled;
            validUpdate = true;
        } else {
            return res.status(400).json({ message: "Valor para notificações deve ser booleano." });
        }
    }

    if (!validUpdate) {
        return res.status(400).json({ message: "Nenhuma preferência válida para atualizar." });
    }

    try {
        const [result] = await db.query("UPDATE users SET ? WHERE idusers = ?", [fieldsToUpdate, userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado para atualizar preferências." });
        }
        res.status(200).json({ message: "Preferências atualizadas com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar preferências:", error);
        res.status(500).json({ message: "Erro interno do servidor ao atualizar preferências." });
    }
};
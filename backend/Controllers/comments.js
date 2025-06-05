import { db } from '../db.js'; // Certifique-se de importar seu módulo de conexão com o banco
import express from 'express';

export const getCommentsByCompany = async (req, res) => {
    const { companyId } = req.params;

    try {
        const [rows] = await db.execute(
            `SELECT comments.id, users.username, comments.content, comments.created_at
             FROM comments
             JOIN users ON comments.user_id = users.id
             WHERE comments.company_id = ?
             ORDER BY comments.created_at ASC`,
            [companyId]
        );

        return res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar comentários:', err);
        return res.status(500).json({ error: 'Erro interno ao buscar comentários.' });
    }
};


export const addComment = async (req, res) => {

    console.log(req.params)
    const companyId = req.params.companyId;
    const { content } = req.body;
    const user_id = req.user.id; // Assumindo que o ID do usuário está no token JWT

    console.log(req.params)

    console.log(req.body)
    console.log(req.user)

    console.log("ID da empresa:", companyId);
    console.log("ID do usuário:", user_id);
    console.log("Conteúdo do comentário:", content);

    if (!user_id || !content) {
        return res.status(400).json({ error: 'user_id e content são obrigatórios.' });
    }


    try {
        // Insere o comentário
        await db.execute(
            `INSERT INTO comments (user_id, company_id, content) VALUES (?, ?, ?)`,
            [user_id, companyId, content]
        );

        // Retorna o comentário com username
        const [result] = await db.execute(`
      SELECT users.username, comments.content
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.user_id = ? AND comments.company_id = ?
      ORDER BY comments.created_at DESC
      LIMIT 1
    `, [user_id, companyId]);

        res.status(201).json(result[0]);
    } catch (err) {
        console.error('Erro ao inserir comentário:', err);
        res.status(500).json({ error: 'Erro ao salvar o comentário.' });
    }
}
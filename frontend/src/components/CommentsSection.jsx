import React, { useState, useEffect } from 'react';
import { API_URL , token} from '../const/const';

import { useParams } from 'react-router-dom';

const CommentsSection = ({ userId }) => {
  const { empresa } = useParams(); // ← Pegando companyempresa da URL
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresa) return;
    
    fetch(`${API_URL}/comments/get/${empresa}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Erro ao carregar comentários');
        }
        return res.json();
      })
      .then(data => {
        setComments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar comentários:', err);
        setLoading(false);
      });
  }, [empresa]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    const commentData = {
      user_id: userId,
      content: newComment
    };

    try {
      const response = await fetch(`${API_URL}/comments/post/${empresa}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });

      if (!response.ok) throw new Error('Erro ao comentar');

      const savedComment = await response.json();
      setComments([...comments, savedComment]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar comentário');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comentários dos Usuários</h3>
      <form onSubmit={handleAddComment} className="mb-4 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Deixe seu comentário sobre a empresa..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Comentar
        </button>
      </form>

      {loading ? (
        <div className="text-gray-500 text-sm">Carregando comentários...</div>
      ) : (
        <div className="space-y-3">
          {comments.length === 0 && (
            <div className="text-gray-500 text-sm">Nenhum comentário ainda. Seja o primeiro!</div>
          )}
          {comments.map((c, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-2">
              <span className="font-semibold text-blue-700">{c.username}:</span> <span>{c.content}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;

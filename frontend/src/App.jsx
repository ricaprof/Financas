// App.js corrigido
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import Empresa from './pages/Acao'; //
import Login from './pages/Login'; //
import Inicio from './pages/Inicio'; //
import Empresas from './pages/Empresas'; //
import PerfilUsuario from './pages/PerfilUsuario'; // Nova importação

function App() {
  const token = localStorage.getItem("accessToken"); //

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/acao/:empresa" element={token ? <Empresa /> : <Navigate to="/login" replace />} /> {/* Protegendo rota de ação */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/empresas" replace />} /> {/* Se logado, redireciona do login */}
          <Route path="/empresas" element={token ? <Empresas /> : <Navigate to="/login" replace />} /> {/* Protegendo rota de empresas */}
          <Route 
            path="/perfil" 
            element={token ? <PerfilUsuario /> : <Navigate to="/login" replace />} 
          /> {/* Nova rota protegida */}
          {/* Adicionar uma rota para lidar com 404 ou redirecionar para Início */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
  );
}

export default App;

//TODO:

/* 
Passar o ticker da empresa pela URL para fazer a requisição na API
Adicionar o token de autenticação no header da requisição
Colocar mais páginas


Colocar uma página para o Usuário conseguir ver as ações que ele está acompanhando
Como fazer isso?
-> Usuário acompanha N ações
-> Ações tem N usuários

Relação de N:N -> Criar tabela acoes_usuario com chave estrangeira para cada um



*/ 
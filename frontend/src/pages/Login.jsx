import { useState } from 'react';
import { API_URL } from '../const/const';

const Alert = ({ message, type }) => {
  if (!message) return null;

  const alertStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className={`p-4 rounded-md mb-4 ${alertStyles[type] || alertStyles.info}`}>
      {message}
    </div>
  );
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit foi chamado'); // Verifica se a função é chamada
    setIsSubmitting(true);

    try {
      if (isLogin) {
        console.log('Tentando login'); // Verifica se o bloco de login é executado
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Login inválido");
        }

        const data = await res.json();
        
        localStorage.setItem("accessToken", data.token);
        console.log("Dados antes de salvar:", data.empresas);
        localStorage.setItem("empresas", JSON.stringify(data.empresas));

        alert("Login bem-sucedido!");
        window.location.href = "/processo";
      } else {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem");
        }

        console.log('Tentando cadastro'); // Verifica se o bloco de cadastro é executado
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password,
            confirmPassword
          })
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erro ao cadastrar usuário");
        }

        const data = await res.json();
        console.log(data);
        setServerMessage("Usuário criado com sucesso! Você já pode fazer login.");
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setServerMessage(err.message); // Atualiza a mensagem do servidor
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset dos campos ao alternar entre modos
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setServerMessage('');
  };

  // Verificar se o botão deve estar habilitado
  const isFormValid = () => {
    if (isLogin) {
      return email && password;
    } else {
      return email && password && name && confirmPassword && password === confirmPassword;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="text-4xl text-blue-500">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
          </div>
        </div>

        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`cursor-pointer flex-1 py-2 text-center font-medium ${isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setIsLogin(true)}
            disabled={isSubmitting}
          >
            Login
          </button>
          <button
            className={`cursor-pointer flex-1 py-2 text-center font-medium ${!isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setIsLogin(false)}
            disabled={isSubmitting}
          >
            Cadastrar
          </button>
        </div>

        {serverMessage && (
          <Alert
            message={serverMessage}
            type={
              serverMessage.includes("sucesso") ? "success" :
              serverMessage.includes("erro") || serverMessage.includes("inválido") ? "error" :
              "info"
            }
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome completo"
                required={!isLogin}
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              disabled={isSubmitting}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required={!isLogin}
                disabled={isSubmitting}
              />
              {!isLogin && confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">As senhas não coincidem</p>
              )}
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Lembrar-me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Esqueceu a senha?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`w-full py-2 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ${isFormValid() && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                : 'bg-blue-600/50 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? 'Processando...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                type="button"
                onClick={toggleMode}
                disabled={isSubmitting}
                className="ml-1 text-blue-400 hover:text-blue-300 focus:outline-none"
              >
                {isLogin ? 'Cadastre-se' : 'Entre'}
              </button>
            </p>
          </div>
        </form>

        {isLogin && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">Ou entre com</p>
              <div className="flex justify-center space-x-4">
                <button
                  className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
                  disabled={isSubmitting}
                >
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                </button>
                <button
                  className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
                  disabled={isSubmitting}
                >
                 
                  
                    <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z" />
                                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z" />
                  </svg>



                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
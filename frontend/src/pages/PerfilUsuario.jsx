import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Edit3, Save, XCircle, Eye, EyeOff, Bell, Moon, Sun, Settings2 } from 'lucide-react';

// Mock da API - substitua por chamadas reais ao seu backend
// Lembre-se de configurar o `Authorization: Bearer ${token}` nos headers das suas chamadas reais
const mockApiService = {
  getUserProfile: async (token) => {
    console.log("Buscando perfil com token:", token);
    const storedUser = JSON.parse(localStorage.getItem('user')); // Dados salvos no login
    if (!storedUser) throw new Error("Usuário não logado ou dados não encontrados.");
    
    // No backend real, você buscaria esses dados do banco.
    // Para o mock, vamos usar localStorage para persistência básica das preferências.
    const theme = localStorage.getItem(`theme_${storedUser.id}`) || 'system';
    const notificationsEnabled = JSON.parse(localStorage.getItem(`notificationsEnabled_${storedUser.id}`)) !== null 
                                 ? JSON.parse(localStorage.getItem(`notificationsEnabled_${storedUser.id}`)) 
                                 : true;

    return {
      id: storedUser.id,
      nome: storedUser.name,
      email: storedUser.email,
      theme: theme,
      notificationsEnabled: notificationsEnabled,
    };
  },
  updateUserProfile: async (token, userId, profileData) => {
    console.log("Atualizando perfil:", userId, profileData, "com token:", token);
    // Chamada real: PUT /api/users/me (ou /api/profile/me)
    // Exemplo de atualização local:
    const currentUserData = JSON.parse(localStorage.getItem('user'));
    if (currentUserData.id !== userId) throw new Error("ID de usuário não corresponde.");

    const updatedUserData = { ...currentUserData, name: profileData.nome, email: profileData.email };
    localStorage.setItem('user', JSON.stringify(updatedUserData)); // Atualiza os dados do usuário no localStorage
    return { message: "Perfil atualizado com sucesso!", user: updatedUserData};
  },
  changePassword: async (token, userId, passwordData) => {
    console.log("Alterando senha para usuário:", userId, passwordData, "com token:", token);
    // Chamada real: PUT /api/users/me/password (ou /api/profile/me/password)
    if (passwordData.novaSenha !== passwordData.confirmarNovaSenha) {
      throw new Error("As novas senhas não coincidem.");
    }
    if (passwordData.novaSenha.length < 6) {
      throw new Error("A nova senha deve ter pelo menos 6 caracteres.");
    }
    // No backend real, você verificaria a senhaAtual antes de alterar.
    return { message: "Senha alterada com sucesso!" };
  },
  updatePreferences: async (token, userId, preferences) => {
    console.log("Atualizando preferências para usuário:", userId, preferences, "com token:", token);
    // Chamada real: PUT /api/users/me/preferences (ou /api/profile/me/preferences)
    // Persistir preferências no localStorage para o mock
    localStorage.setItem(`theme_${userId}`, preferences.theme);
    localStorage.setItem(`notificationsEnabled_${userId}`, JSON.stringify(preferences.notificationsEnabled));
    return { message: "Preferências atualizadas!" };
  }
};

// Substitua mockApiService por seu serviço real quando pronto
const apiService = mockApiService;

function PerfilUsuario() {
    const [user, setUser] = useState({ id: '', nome: '', email: '' });
    const [preferences, setPreferences] = useState({ theme: 'system', notificationsEnabled: true });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ nome: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
    
    const [showSenhaAtual, setShowSenhaAtual] = useState(false);
    const [showNovaSenha, setShowNovaSenha] = useState(false);
    const [showConfirmarNovaSenha, setShowConfirmarNovaSenha] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const token = localStorage.getItem("accessToken"); //

    const fetchUserProfile = useCallback(async () => {
        if (!token) {
            setError("Usuário não autenticado. Você será redirecionado para o login.");
            setLoading(false);
            // Ex: setTimeout(() => navigate('/login'), 3000); // Se estiver usando useNavigate do react-router-dom
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage('');
            const profileData = await apiService.getUserProfile(token);
            setUser({
                id: profileData.id,
                nome: profileData.nome,
                email: profileData.email,
            });
            setProfileForm({ nome: profileData.nome, email: profileData.email });
            setPreferences({
                theme: profileData.theme,
                notificationsEnabled: profileData.notificationsEnabled,
            });
        } catch (err) {
            setError(err.message || "Erro ao buscar perfil.");
            console.error("Erro ao buscar perfil:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        if (preferences.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (preferences.theme === 'light') {
            // A classe 'light' não é padrão no Tailwind para tema claro,
            // geralmente é a ausência da 'dark'.
            // Se você tiver uma config específica para 'light', adicione-a.
            // document.documentElement.classList.add('light');
        }
        // Para 'system', você pode adicionar lógica para verificar a preferência do SO
        // e adicionar 'dark' ou 'light' dinamicamente.
    }, [preferences.theme]);

    const handleProfileInputChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handlePasswordInputChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleToggleEditProfile = () => {
        if (isEditingProfile) {
            setProfileForm({ nome: user.nome, email: user.email });
        }
        setIsEditingProfile(!isEditingProfile);
        setSuccessMessage('');
        setError(null);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!token || !user.id) {
            setError("Não foi possível salvar. Faça login novamente.");
            return;
        }
        setSuccessMessage('');
        setError(null);
        try {
            setLoading(true);
            const response = await apiService.updateUserProfile(token, user.id, profileForm);
            // Atualiza o estado local do usuário com os dados retornados pela API (ou os dados do formulário se a API não retornar o usuário atualizado)
            const updatedUser = response.user || { ...user, ...profileForm };
            setUser(updatedUser);

            setIsEditingProfile(false);
            setSuccessMessage(response.message || "Perfil atualizado com sucesso!");
        } catch (err) {
            setError(err.message || "Erro ao atualizar perfil.");
            console.error("Erro ao atualizar perfil:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!token || !user.id) {
            setError("Não foi possível alterar a senha. Faça login novamente.");
            return;
        }
        setSuccessMessage('');
        setError(null);

        if (passwordForm.novaSenha !== passwordForm.confirmarNovaSenha) {
            setError("As novas senhas não coincidem.");
            return;
        }
        if (passwordForm.novaSenha.length < 6) {
            setError("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        try {
            setLoading(true);
            const response = await apiService.changePassword(token, user.id, passwordForm);
            setPasswordForm({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
            setSuccessMessage(response.message || "Senha alterada com sucesso!");
        } catch (err) {
            setError(err.message || "Erro ao alterar senha.");
            console.error("Erro ao alterar senha:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePreferenceChange = async (key, value) => {
        if (!token || !user.id) {
            setError("Não foi possível salvar preferências. Faça login novamente.");
            return;
        }
        setSuccessMessage('');
        setError(null);
        const newPreferences = { ...preferences, [key]: value };
        
        try {
            setLoading(true);
            await apiService.updatePreferences(token, user.id, newPreferences);
            setPreferences(newPreferences);
            setSuccessMessage("Preferências atualizadas!");
        } catch (err) {
            setError(err.message || "Erro ao atualizar preferências.");
            console.error("Erro ao atualizar preferências:", err);
            // Reverter a mudança local se a API falhar
            setPreferences(current => ({...current, [key]: preferences[key]}));
        } finally {
            setLoading(false);
        }
    };
    
    if (!token && !loading) { 
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-6">
                <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">Acesso Negado</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{error || "Você precisa estar logado para acessar esta página."}</p>
                <a href="/login" className="px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                    Ir para Login
                </a>
            </div>
        );
    }

    if (loading && !user.id) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                <p className="ml-4 text-gray-700 dark:text-gray-300">Carregando perfil...</p>
            </div>
        );
    }


    return (
        <div className="max-w-3xl mx-auto mt-8 mb-16 p-6 sm:p-8 bg-white dark:bg-slate-800 shadow-xl rounded-lg"> {/* Ajuste no bg dark */}
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-8 border-b pb-4 dark:border-slate-700">Meu Perfil</h1>

            {error && <div className="mb-6 p-3 bg-red-100 dark:bg-red-800 dark:text-red-100 text-red-700 rounded-md text-sm" role="alert">{error}</div>}
            {successMessage && <div className="mb-6 p-3 bg-green-100 dark:bg-green-800 dark:text-green-100 text-green-700 rounded-md text-sm" role="status">{successMessage}</div>}

            <section className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-200">Dados Cadastrais</h2>
                    <button
                        onClick={handleToggleEditProfile}
                        title={isEditingProfile ? "Cancelar Edição" : "Editar Perfil"}
                        className={`p-2 rounded-full transition-colors duration-150 ease-in-out ${
                            isEditingProfile 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600' 
                                : 'bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-700 dark:text-primary-100 dark:hover:bg-primary-600' // Usando primary do tailwind.config.js
                        }`}
                    >
                        {isEditingProfile ? <XCircle size={22} /> : <Edit3 size={20} />}
                    </button>
                </div>
                {!isEditingProfile ? (
                    <div className="space-y-3 text-gray-600 dark:text-slate-300">
                        <p><strong className="font-medium text-gray-800 dark:text-slate-100">Nome:</strong> {user.nome || 'Não informado'}</p>
                        <p><strong className="font-medium text-gray-800 dark:text-slate-100">Email:</strong> {user.email || 'Não informado'}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nome:</label>
                            <input
                                type="text"
                                name="nome"
                                id="nome"
                                value={profileForm.nome}
                                onChange={handleProfileInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={profileForm.email}
                                onChange={handleProfileInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            <Save size={18} className="mr-2" /> {loading && isEditingProfile ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </form>
                )}
            </section>

            <section className="mb-10 pt-6 border-t dark:border-slate-700">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-200 mb-6">Alterar Senha</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {[
                        {label: "Senha Atual:", name: "senhaAtual", value: passwordForm.senhaAtual, show: showSenhaAtual, setShow: setShowSenhaAtual},
                        {label: "Nova Senha:", name: "novaSenha", value: passwordForm.novaSenha, show: showNovaSenha, setShow: setShowNovaSenha},
                        {label: "Confirmar Nova Senha:", name: "confirmarNovaSenha", value: passwordForm.confirmarNovaSenha, show: showConfirmarNovaSenha, setShow: setShowConfirmarNovaSenha},
                    ].map(field => (
                         <div key={field.name} className="relative">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-slate-300">{field.label}</label>
                            <input
                                type={field.show ? "text" : "password"}
                                name={field.name}
                                id={field.name}
                                value={field.value}
                                onChange={handlePasswordInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                required
                                autoComplete={field.name === "senhaAtual" ? "current-password" : "new-password"}
                            />
                            <button type="button" onClick={() => field.setShow(!field.show)} title={field.show ? "Ocultar senha" : "Mostrar senha"} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
                                {field.show ? <EyeOff size={18}/> : <Eye size={18} />}
                            </button>
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center disabled:opacity-50" //
                    >
                        <ShieldCheck size={18} className="mr-2" /> {loading && passwordForm.senhaAtual ? "Alterando..." : "Alterar Senha"}
                    </button>
                </form>
            </section>

            <section className="pt-6 border-t dark:border-slate-700">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-200 mb-6 flex items-center">
                    <Settings2 size={24} className="mr-2"/> Preferências
                </h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Tema da Interface:</label>
                        <div className="flex flex-wrap gap-2">
                            {[ {value: 'light', label: 'Claro', Icon: Sun}, {value: 'dark', label: 'Escuro', Icon: Moon}, {value: 'system', label: 'Sistema', Icon: Settings2} ].map(themeOption => (
                                <button
                                    key={themeOption.value}
                                    onClick={() => handlePreferenceChange('theme', themeOption.value)}
                                    disabled={loading}
                                    title={`Mudar tema para ${themeOption.label}`}
                                    className={`px-4 py-2 rounded-md border dark:border-slate-600 transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50
                                        ${preferences.theme === themeOption.value 
                                            ? 'bg-primary-500 text-white border-primary-500 dark:bg-primary-600 dark:border-primary-600' //
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'}`}
                                >
                                   <themeOption.Icon size={16} className="mr-2"/> {themeOption.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Notificações por Email:</label>
                        <button
                            onClick={() => handlePreferenceChange('notificationsEnabled', !preferences.notificationsEnabled)}
                            disabled={loading}
                            title={preferences.notificationsEnabled ? "Desativar notificações" : "Ativar notificações"}
                            className={`w-40 px-4 py-2 rounded-md border dark:border-slate-600 transition-colors flex items-center justify-center font-medium text-sm disabled:opacity-50
                                ${preferences.notificationsEnabled 
                                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 dark:bg-green-600 dark:border-green-600' 
                                    : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600'}`}
                        >
                           <Bell size={16} className="mr-2"/> {preferences.notificationsEnabled ? 'Ativadas' : 'Desativadas'}
                        </button>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Controla o recebimento de e-mails informativos e alertas da plataforma.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PerfilUsuario;
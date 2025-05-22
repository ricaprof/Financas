import React, { useState } from "react";

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({
        cpf: "",
        email: "",
        nome: "",
        senha: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            alert("Cadastro realizado!");
        } else {
            alert("Login realizado!");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-6 text-center">{isRegister ? "Cadastro" : "Login"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                    <>
                        <div>
                            <label className="block text-gray-700 mb-1">Nome:</label>
                            <input
                                type="text"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">CPF:</label>
                            <input
                                type="text"
                                name="cpf"
                                value={form.cpf}
                                onChange={handleChange}
                                required
                                maxLength={14}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="000.000.000-00"
                            />
                        </div>
                    </>
                )}
                <div>
                    <label className="block text-gray-700 mb-1">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Senha:</label>
                    <input
                        type="password"
                        name="senha"
                        value={form.senha}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full mt-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                >
                    {isRegister ? "Cadastrar" : "Entrar"}
                </button>
            </form>
            <button
                className="w-full mt-4 text-blue-600 hover:underline focus:outline-none"
                onClick={() => setIsRegister(!isRegister)}
                type="button"
            >
                {isRegister ? "Já tem conta? Faça login" : "Não tem conta? Cadastre-se"}
            </button>
        </div>
    );
}

export default Login;
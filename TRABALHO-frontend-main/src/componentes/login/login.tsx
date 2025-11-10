import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api'

interface LoginResponse {
    token: string;
    tipo: string;
}

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setIsLoading(true);

        try {
            const response = await api.post<LoginResponse>('/login', { email, senha });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('tipo', response.data.tipo);
            // redirect to home (App.tsx handles role-based UI)
            navigate('/');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErro(error.message);
            } else if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                setErro(axiosError.response?.data?.message || 'Erro ao fazer login');
            } else {
                setErro('Ocorreu um erro inesperado');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
                <div>
                    <input 
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Senha"
                        required
                    />
                </div>
                {erro && <p>{erro}</p>}
                <button 
                    type="submit" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Carregando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}

export default Login;
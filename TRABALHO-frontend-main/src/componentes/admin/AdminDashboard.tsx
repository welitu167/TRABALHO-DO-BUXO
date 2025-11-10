import { useState, useEffect } from 'react';
import api from '../../api/api';

interface Usuario {
    _id: string;
    nome: string;
    email: string;
    tipo: string;
}

interface Carrinho {
    _id: string;
    usuarioId: string;
    usuarioNome: string;
    itens: any[];
    total: number;
    dataAtualizacao: string;
}

function AdminDashboard() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [carrinhos, setCarrinhos] = useState<Carrinho[]>([]);
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const [usuariosResp, carrinhosResp] = await Promise.all([
                api.get('/usuarios'),
                api.get('/admin/carrinhos')
            ]);
            setUsuarios(usuariosResp.data);
            setCarrinhos(carrinhosResp.data);
        } catch (error: any) {
            setErro(error.response?.data?.message || 'Erro ao carregar dados');
        }
    }

    async function removerUsuario(id: string) {
        try {
            await api.delete(`/admin/usuario/${id}`);
            setUsuarios(usuarios.filter(u => u._id !== id));
        } catch (error: any) {
            setErro(error.response?.data?.message || 'Erro ao remover usuário');
        }
    }

    async function removerCarrinho(id: string) {
        try {
            await api.delete(`/admin/carrinho/${id}`);
            setCarrinhos(carrinhos.filter(c => c._id !== id));
        } catch (error: any) {
            setErro(error.response?.data?.message || 'Erro ao remover carrinho');
        }
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            <h3>Usuários</h3>
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario._id}>
                        {usuario.nome} ({usuario.email}) - {usuario.tipo}
                        <button onClick={() => removerUsuario(usuario._id)}>Remover</button>
                    </li>
                ))}
            </ul>
            <h3>Carrinhos</h3>
            <ul>
                {carrinhos.map(carrinho => (
                    <li key={carrinho._id}>
                        {carrinho.usuarioNome} - Total: R$ {carrinho.total}
                        <button onClick={() => removerCarrinho(carrinho._id)}>Remover</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;
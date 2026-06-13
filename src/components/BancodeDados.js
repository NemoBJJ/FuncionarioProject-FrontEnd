import React, { useEffect, useState } from 'react'; 
import './BancodeDados.css';

// URL base do backend local
const API_BASE_URL = 'http://localhost:8082';

const BancodeDados = () => {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/funcionarios`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setDados(data.content);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao carregar os dados:', error);
                setErro(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading">Carregando os dados...</div>;
    }

    if (erro) {
        return <div className="error">Erro ao carregar os dados: {erro}</div>;
    }

    return (
        <div className="database-container">
            <h1 className="database-title">Banco de Dados de Funcionários</h1>
            <table className="database-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Cargo</th>
                        <th>Salário</th>
                        <th>Departamento</th>
                        <th>Data de Admissão</th>
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map((funcionario) => (
                        <tr key={funcionario.id}>
                            <td>{funcionario.id}</td>
                            <td>{funcionario.nome}</td>
                            <td>{funcionario.cargo}</td>
                            <td>R$ {funcionario.salario.toFixed(2)}</td>
                            <td>{funcionario.departamento}</td>
                            <td>{funcionario.dataAdmissao}</td>
                            <td>{funcionario.cidade}</td>
                            <td>{funcionario.estado}</td>
                            <td>{funcionario.statusEmprego}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BancodeDados;
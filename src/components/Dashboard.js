import React, { useEffect, useState } from 'react';
import api from '../api';

const Dashboard = () => {
    const [dados, setDados] = useState({});

    useEffect(() => {
        api.get('/dashboard')
            .then((response) => setDados(response.data))
            .catch((error) => console.error('Erro ao carregar dados do dashboard', error));
    }, []);

    return (
        <div>
            <h1>Dashboard de Funcionários</h1>
            <pre>{JSON.stringify(dados, null, 2)}</pre>
        </div>
    );
};

export default Dashboard;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './CRUDTransactions.css';

const CRUDTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransactionId, setSelectedTransactionId] = useState('');
    const [newTransaction, setNewTransaction] = useState({
        description: '',
        amount: '',
        date: '',
        type: '',
        transactionCategory: '',
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Erro ao buscar transações:', error);
            }
        };
        fetchTransactions();
    }, []);

    const handleAddTransaction = async () => {
        try {
            const response = await api.post('/transactions', newTransaction);
            setTransactions([...transactions, response.data]);
            resetForm();
        } catch (error) {
            console.error('Erro ao adicionar transação:', error);
        }
    };

    const handleUpdateTransaction = async () => {
        if (!selectedTransactionId) {
            alert('Informe um ID válido para atualizar.');
            return;
        }

        try {
            const response = await api.put(`/transactions/${selectedTransactionId}`, newTransaction);
            setTransactions(
                transactions.map((t) =>
                    t.id === parseInt(selectedTransactionId) ? response.data : t
                )
            );
            resetForm();
            setSelectedTransactionId('');
        } catch (error) {
            console.error('Erro ao atualizar transação:', error);
        }
    };

    const handleDeleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(transactions.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Erro ao excluir transação:', error);
        }
    };

    const handleFetchTransactionById = async () => {
        if (!selectedTransactionId) {
            alert('Informe um ID válido para buscar.');
            return;
        }

        try {
            const response = await api.get(`/transactions/${selectedTransactionId}`);
            setNewTransaction({
                description: response.data.description,
                amount: response.data.amount,
                date: response.data.date,
                type: response.data.type,
                transactionCategory: response.data.transactionCategory,
            });
        } catch (error) {
            console.error('Erro ao buscar transação:', error);
        }
    };

    const resetForm = () => {
        setNewTransaction({
            description: '',
            amount: '',
            date: '',
            type: '',
            transactionCategory: '',
        });
    };

    return (
        <div className="crud-container">
            <h1 className="crud-title">Gerenciar Transações</h1>

            <div className="crud-section">
                <h3>Adicionar ou Atualizar Transação</h3>
                <input
                    type="text"
                    placeholder="Descrição"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Valor"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                />
                <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                />
                <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                >
                    <option value="">Selecione o tipo</option>
                    <option value="RECEITA">Receita</option>
                    <option value="DESPESA">Despesa</option>
                </select>
                <input
                    type="text"
                    placeholder="Categoria"
                    value={newTransaction.transactionCategory}
                    onChange={(e) =>
                        setNewTransaction({ ...newTransaction, transactionCategory: e.target.value })
                    }
                />
                <button onClick={handleAddTransaction}>Adicionar</button>
                <button onClick={handleUpdateTransaction}>Atualizar</button>
            </div>

            <div className="crud-section">
                <h3>Buscar Transação por ID</h3>
                <input
                    type="text"
                    placeholder="Informe o ID"
                    value={selectedTransactionId}
                    onChange={(e) => setSelectedTransactionId(e.target.value)}
                />
                <button onClick={handleFetchTransactionById}>Buscar</button>
            </div>

            <div className="transactions-list crud-section">
                <h3>Lista de Transações</h3>
                <ul>
                    {transactions.map((t) => (
                        <li key={t.id}>
                            ID: {t.id} - {t.description} - R$
                            {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            <button onClick={() => handleDeleteTransaction(t.id)}>Excluir</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="back-to-menu">
                <Link to="/">
                    <button className="back-button">Voltar ao Menu</button>
                </Link>
            </div>
        </div>
    );
};

export default CRUDTransactions;

import './style.css';
import editar from '../../assets/editar.svg';
import lixo from '../../assets/lixo.svg';
import indicador from '../../assets/indicador.svg';
import setaParaBaixo from '../../assets/setaPraBaixo.svg';
import setaParaCima from '../../assets/setaPraCima.svg';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

const ListaTransacoes = ({
    transactionsData,
    setTransactionsData,
    loadTransactions,
    setTransactionInEditing,
    setModal
}) => {

    const [idDelete, setIdDelete] = useState('');
    const [crescente, setCrescente] = useState(true);
    const [idCrescente, setIdCrescente] = useState('date');

    useEffect(() => {
        loadTransactions();
    }, []);

    const abrirModalDelete = (idButton) => {
        if (idDelete === idButton) {
            return setIdDelete('');
        }
        setIdDelete(idButton);
    }

    async function handleDeletTransaction(transactionId) {

        try {
            await fetch(`http://localhost:3333/transactions/${transactionId}`, {
                method: 'DELETE'
            });

            await loadTransactions();

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (idCrescente === 'date') {
            ordenarData();
            return;
        }

        if (idCrescente === 'week-day') {
            ordenarDiaDaSemana();
            return;
        }

        if (idCrescente === 'value') {
            ordenarValor();
            return;
        }
    }, [crescente]);

    function ordenarData() {
        setTransactionsData(estado => {
            const arrayDoEstado = [...estado];
            const arrayDoEstadoOrdenado = arrayDoEstado.sort((a, b) => {
                if (crescente) {
                    return (new Date(a.date).getTime()) - (new Date(b.date).getTime());
                } else {
                    return (new Date(b.date).getTime()) - (new Date(a.date).getTime());
                }
            });
            return arrayDoEstadoOrdenado
        });
    }

    function ordenarDiaDaSemana() {
        setTransactionsData(estado => {
            const arrayDoEstado = [...estado];
            const arrayDoEstadoOrdenado = arrayDoEstado.sort((a, b) => {
                if (crescente) {
                    return (new Date(a.date).getDay()) - (new Date(b.date).getDay());
                } else {
                    return (new Date(b.date).getDay()) - (new Date(a.date).getDay());
                }
            });
            return arrayDoEstadoOrdenado
        });
    }

    function ordenarValor() {
        setTransactionsData(estado => {
            const arrayDoEstado = [...estado];
            const arrayDoEstadoOrdenado = arrayDoEstado.sort((a, b) => {
                if (crescente) {
                    return Number(a.value) - Number(b.value);
                } else {
                    return Number(b.value) - Number(a.value);
                }
            });
            return arrayDoEstadoOrdenado
        });
    }

    return (
        <div className='table'>
            <div className='table-head'>
                <div className='space'>
                    <button
                        className='column-title'
                        id='date'
                        onClick={() => {
                            setIdCrescente('date')
                            setCrescente(!crescente)
                        }}
                    >
                        Data {idCrescente === 'date' && <img src={crescente ? setaParaBaixo : setaParaCima} alt='seta' />}
                    </button>
                </div>
                <div className='space'>
                    <button
                        className='column-title'
                        id='week-day'
                        onClick={() => {
                            setIdCrescente('week-day')
                            setCrescente(!crescente)
                        }}
                    >
                        Dia da semana {idCrescente === 'week-day' && <img src={crescente ? setaParaBaixo : setaParaCima} alt='seta' />}
                    </button>
                </div>
                <div className='space'>
                    <span className='column-table'>Descrição</span>
                </div>
                <div className='space'>
                    <span className='column-table'>Categoria</span>
                </div>
                <div className='space'>
                    <button
                        className='column-title'
                        id='value'
                        onClick={() => {
                            setIdCrescente('value')
                            setCrescente(!crescente)
                        }}
                    >
                        Valor {idCrescente === 'value' && <img src={crescente ? setaParaBaixo : setaParaCima} alt='seta' />}
                    </button>
                </div>
                <div className='space'></div>
            </div>
            <div className='table-body'>
                {transactionsData.map((transaction) => (
                    <div key={transaction.id} className='table-line'>
                        <div className='space'>
                            <span className='column-table'>{format(new Date(transaction.date), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className='space'>
                            <span className='column-table'>{transaction.week_day}</span>
                        </div>
                        <div className='space'>
                            <span className='column-table'>{transaction.description}</span>
                        </div>
                        <div className='space'>
                            <span className='column-table'>{transaction.category}</span>
                        </div>
                        <div className='space'>
                            <span
                                className='column-table'
                                style={{ color: transaction.type === 'debit' ? '#FA8C10' : '#7B61FF' }}
                            >
                                {transaction.type === 'debit' ? `-${(transaction.value / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}` : (transaction.value / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                        <div className='space'>
                            <button
                                className='edit-icon'
                                onClick={() => {
                                    setTransactionInEditing(transaction)
                                    setModal(true)
                                }}
                            >
                                <img src={editar} alt='caneta' />
                            </button>
                            <button
                                className='delete-icon'
                                onClick={() => abrirModalDelete(transaction.id)}
                            ><img src={lixo} alt='lixo' /></button>
                            {idDelete === transaction.id &&
                                <div className='container-confirm-delete'>
                                    <img className='indicador' src={indicador} alt='indicaor' />
                                    <span className='action'>Apagar item?</span>
                                    <div className='btn-actions-confirm-delete'>
                                        <button
                                            className='btn-confirm'
                                            onClick={() => handleDeletTransaction(transaction.id)}
                                        >Sim</button>
                                        <button
                                            className='btn-delete'
                                            onClick={() => setIdDelete('')}
                                        >Não</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListaTransacoes;
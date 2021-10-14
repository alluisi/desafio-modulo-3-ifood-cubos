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
    const [idCrescente, setIdCrescente] = useState('');

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

    function ordenarData(idSelect) {
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
        setCrescente(estado => {
            if (crescente) {
                return false;
            } else {
                return true;
            }
        });
        setIdCrescente(idSelect);
    }

    function ordenarDiaDaSemana(idSelect) {
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
        setCrescente(estado => {
            if (crescente) {
                return false;
            } else {
                return true;
            }
        });
        setIdCrescente(idSelect);
    }

    function ordenarValor(idSelect) {
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
        setCrescente(estado => {
            if (crescente) {
                return false;
            } else {
                return true;
            }
        });
        setIdCrescente(idSelect);
    }

    return (
        <div className='table'>
            <div className='table-head'>
                <div className='space'>
                    <button
                        className='column-title'
                        id='date'
                        onClick={() => ordenarData('date')}
                    >
                        Data <img className={idCrescente === 'date' ? '' : 'hidden'} src={crescente ? setaParaBaixo : setaParaCima} alt='seta' />
                    </button>
                </div>
                <div className='space'>
                    <button
                        className='column-title'
                        id='week-day'
                        onClick={() => ordenarDiaDaSemana('week-day')}
                    >
                        Dia da semana <img className={idCrescente === 'week-day' ? '' : 'hidden'} src={crescente ? setaParaBaixo : setaParaCima} alt='seta' />
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
                        onClick={() => ordenarValor('value')}
                    >
                        Valor <img className={idCrescente === 'value' ? '' : 'hidden'} src={crescente ? setaParaBaixo : setaParaCima} alt='seta' />
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
                                style={transaction.type === 'debit' ? { color: '#FA8C10' } : { color: '#7B61FF' }}
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
                            <div className={idDelete === transaction.id ? 'container-confirm-delete' : 'container-confirm-delete hidden'}>
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListaTransacoes;
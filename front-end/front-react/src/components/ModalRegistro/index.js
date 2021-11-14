import './style.css';
import fechar from '../../assets/fechar.svg';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { format } from 'date-fns';

const ModalRegistro = ({
    setModal,
    entradaOuSaida,
    setEntradaOuSaida,
    loadTransactions,
    transactionInEditing,
    setTransactionInEditing
}) => {

    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [dataInput, setDataInput] = useState('');
    const [descricao, setDescricao] = useState('');

    const tipoDaTransação = entradaOuSaida === 'saida' ? 'debit' : 'credit';
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    async function handleRegisterTransaction() {

        if (!valor || !categoria || !dataInput || !descricao) {
            return (
                alert('Todos os campos são obrigatórios!')
            )
        }

        try {
            const dataCorrigida = dataInput.substr(3, 2) + '/' + dataInput.substr(0, 2) + '/' + dataInput.substr(6, 4);
            const dataFormatada = new Date(dataCorrigida).toISOString();
            const numeroDoDiaDaSemana = new Date(dataCorrigida).getDay();
            const diaDaSemana = diasDaSemana[numeroDoDiaDaSemana];
            const valorFormatado = valor * 100;
            const categoriaCorrigida = categoria.toLowerCase();

            const data = {
                date: dataFormatada,
                week_day: diaDaSemana,
                description: descricao,
                value: valorFormatado,
                category: categoriaCorrigida,
                type: tipoDaTransação
            };

            await fetch('http://localhost:3333/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            setValor('');
            setCategoria('');
            setDataInput('');
            setDescricao('');

            await loadTransactions();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        if (transactionInEditing) {
            setValor(transactionInEditing.value / 100);
            setCategoria(transactionInEditing.category);
            setDataInput(format(new Date(transactionInEditing.date), 'dd/MM/yyyy'));
            setDescricao(transactionInEditing.description);

            transactionInEditing.type === 'debit' ? setEntradaOuSaida('saida') : setEntradaOuSaida('entrada');
        }

    }, [transactionInEditing]);

    async function handleEditTransaction() {

        if (!valor || !categoria || !dataInput || !descricao) {
            return (
                alert('Todos os campos são obrigatórios!')
            )
        }

        try {
            const dataCorrigida = dataInput.substr(3, 2) + '/' + dataInput.substr(0, 2) + '/' + dataInput.substr(6, 4);
            const dataFormatada = new Date(`${dataCorrigida} 01:00`).toISOString();
            const numeroDoDiaDaSemana = new Date(dataCorrigida).getDay();
            const diaDaSemana = diasDaSemana[numeroDoDiaDaSemana];
            const valorFormatado = valor * 100;

            const data = {
                date: dataFormatada,
                week_day: diaDaSemana,
                description: descricao,
                value: valorFormatado,
                category: categoria,
                type: tipoDaTransação
            };

            await fetch(`http://localhost:3333/transactions/${transactionInEditing.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            setValor('');
            setCategoria('');
            setDataInput('');
            setDescricao('');

            await loadTransactions();
            setTransactionInEditing(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='backdrop'>
            <div className='modal-container'>
                <div className='modal-title'>
                    <span>{transactionInEditing ? 'Editar' : 'Adicionar'} Registro</span>
                    <img
                        className='close-icon'
                        src={fechar}
                        alt='fechar'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setTransactionInEditing(false)
                            setModal(false)
                        }}
                    />
                </div>
                <div className='modal-record'>
                    <button
                        className='credit'
                        id='credit-button'
                        onClick={() => setEntradaOuSaida('entrada')}
                        style={entradaOuSaida === 'saida' ? { background: '#B9B9B9' } : { background: 'linear-gradient(91.26deg, #05EDE3 0%, #3A9FF1 97.77%)' }}
                    >
                        Entrada
                    </button>
                    <button
                        className='debit'
                        id='debit-button'
                        onClick={() => setEntradaOuSaida('saida')}
                        style={entradaOuSaida === 'saida' ? { background: 'linear-gradient(91.66deg, #FA8C10 0%, #FF576B 90.32%)' } : { background: '#B9B9B9' }}
                    >
                        Saída
                    </button>
                </div>
                <form className='modal-form'>
                    <label className='modal-label' htmlFor='value'>Valor</label>
                    <input
                        className='modal-input'
                        id='value'
                        name='value'
                        type='number'
                        onChange={(e) => setValor(e.target.value)}
                        value={valor}
                    />
                    <label className='modal-label' htmlFor='category'>Categoria</label>
                    <input
                        className='modal-input'
                        id='category'
                        name='category'
                        type='text'
                        onChange={(e) => setCategoria(e.target.value)}
                        value={categoria}
                    />
                    <label className='modal-label' htmlFor='date'>Data</label>
                    <InputMask
                        className='modal-input'
                        id='date'
                        name='date'
                        type='text'
                        mask='99/99/9999'
                        onChange={(e) => setDataInput(e.target.value)}
                        value={dataInput}
                    />
                    <label className='modal-label' htmlFor='description'>Descrição</label>
                    <input
                        className='modal-input'
                        id='description'
                        name='description'
                        type='text'
                        onChange={(e) => setDescricao(e.target.value)}
                        value={descricao}
                    />
                </form>
                <button
                    className='btn-insert'
                    onClick={() => {
                        transactionInEditing ? handleEditTransaction() : handleRegisterTransaction()
                        setModal(false)
                    }}
                >
                    Confirmar
                </button>
            </div>
        </div>
    )
}

export default ModalRegistro;
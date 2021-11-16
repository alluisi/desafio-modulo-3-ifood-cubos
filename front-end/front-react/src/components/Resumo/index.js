import { useState, useRef, useEffect } from 'react';
import './style.css';

const Resumo = ({
    setModal,
    setEntradaOuSaida,
    transactionsData,
}) => {

    const [entradas, setEntradas] = useState(0);
    const [saidas, setSaidas] = useState(0);
    const [saldo, setSaldo] = useState(0);
    const entradaRef = useRef([]);
    const saidaRef = useRef([]);

    useEffect(() => {
        async function trazerDados() {
            let somaDasEntradas = 0;
            let somaDasSaidas = 0;
            transactionsData.map((transaction) => {

                if (transaction.type === 'credit') {
                    entradaRef.current = transaction.value;
                    somaDasEntradas = somaDasEntradas + entradaRef.current;
                } else {
                    saidaRef.current = transaction.value;
                    somaDasSaidas = somaDasSaidas + saidaRef.current;
                }
            })
            setEntradas(somaDasEntradas);
            setSaidas(somaDasSaidas);
            setSaldo(somaDasEntradas - somaDasSaidas);
        }
        trazerDados()
    }, [transactionsData]);

    return (
        <div className='resume'>
            <div className='container-resume'>
                <span className='resume-title'>Resumo</span>
                <div>
                    <div className='container-in'>
                        <span>Entradas</span>
                        <span className='in'>{(entradas / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className='container-out'>
                        <span>Saídas</span>
                        <span className='out'>{(saidas / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                </div>
                <div className='line'></div>
                <div className='container-balance'>
                    <span>Saldo</span>
                    <span className='balance'>{(saldo / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                </div>
            </div>
            <button
                className='btn-add'
                onClick={() => {
                    setEntradaOuSaida('saida')
                    setModal(true)
                }}
            >Adicionar Registro</button>
        </div>
    )
}

export default Resumo;
import './style.css';
import soma from '../../assets/soma.svg';
import { useEffect, useRef, useState } from 'react';

const Filtros = ({
    transactionsData,
    setTransactionsData,
    loadTransaction,
    loadTransactions
}) => {
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const [categorias, setCategorias] = useState([]);
    const [valorMinimo, setValorMinimo] = useState('');
    const [valorMaximo, setValorMaximo] = useState('');
    const [filtroAplicado, setFiltroAplicado] = useState(false);
    const [selecionado, setSelecionado] = useState(true);
    const [keyDiaDaSema, setKeyDiaDaSemana] = useState({ selecionar: selecionado, key: '' });
    const [keyCategoria, setKeyCategoria] = useState('');
    const categoriasRef = useRef([]);

    useEffect(() => {
        async function listarCategorias() {
            let listaDasCategorias = [];
            transactionsData.map((transaction) => {
                categoriasRef.current = transaction.category;
                listaDasCategorias = [categoriasRef.current, ...listaDasCategorias];
            });

            const semRepetidos = listaDasCategorias.filter((categoria, indice) => {
                return listaDasCategorias.indexOf(categoria) === indice;
            });

            setCategorias(semRepetidos);
        }
        listarCategorias()
    }, [loadTransaction, filtroAplicado]);

    function limparFiltros() {
        setValorMinimo('');
        setValorMaximo('');
        setKeyDiaDaSemana('');
        setKeyCategoria('');
        loadTransactions();
    }

    // FILTRO EXTRA INACABADO
    const selecionarFiltroSemana = (indice) => {

        if (keyDiaDaSema.key === indice) {
            setSelecionado(false)
        } else {
            setSelecionado(true)
        }

        setKeyDiaDaSemana({ selecionar: selecionado, key: indice });
        // console.log(keyDiaDaSema.selecionar)
    }

    // FILTRO EXTRA INACABADO
    const selecionarFiltroCategoria = (indice) => {
        setKeyCategoria(indice);
    }

    function filtrarValor() {
        if (!valorMinimo && !valorMaximo) {
            return;
        }
        setTransactionsData(estado => {
            const arrayDoEstado = [...estado];
            const arrayDoEstadoFiltrado = arrayDoEstado.filter((x) => {
                let valor = x.value;
                if (x.type === 'debit') {
                    valor = valor * -1;
                }

                if (!valorMinimo) {
                    if (valor <= (valorMaximo * 100)) {
                        return true;
                    } else {
                        return false;
                    }
                }

                if (!valorMaximo) {
                    if (valor >= (valorMinimo * 100)) {
                        return true;
                    } else {
                        return false;
                    }
                }

                if (valor >= (valorMinimo * 100) && valor <= (valorMaximo * 100)) {
                    return true;
                } else {
                    return false;
                }
            });
            return arrayDoEstadoFiltrado
        });
        setFiltroAplicado(!filtroAplicado);
    }

    return (
        <div className='container-filters'>
            <div className='week-category-value'>
                <span>Dia da semana</span>
                <div className='filters-list'>
                    {diasDaSemana.map((dia, indice) => {
                        return (
                            <button
                                className='container-chip'
                                key={indice}
                                style={keyDiaDaSema.selecionar && keyDiaDaSema.key === indice ? { background: '#7B61FF' } : { background: '#FAFAFA' }}
                                onClick={() => selecionarFiltroSemana(indice)}
                            >
                                {dia}
                                <img className='icon-filter' src={soma} alt='soma' />
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className='week-category-value'>
                <span>Categoria</span>
                <div className='filters-list'>
                    {categorias.map((categoria, indice) => {
                        return (
                            <button
                                className='container-chip'
                                key={indice}
                                style={keyCategoria === indice ? { background: '#7B61FF' } : { background: '#FAFAFA' }}
                                onClick={() => selecionarFiltroCategoria(indice)}
                            >
                                {categoria}
                                <img className='icon-filter' src={soma} alt='soma' />
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className='week-category-value'>
                <span>Valor</span>
                <div className='values'>
                    <label className='values-label' htmlFor='min-value'>Min</label><br />
                    <input
                        className='values-input'
                        id='min-value'
                        name='min-value'
                        type='number'
                        onChange={(e) => setValorMinimo(e.target.value)}
                        value={valorMinimo}
                    />
                </div>
                <div className='values'>
                    <label className='values-label' htmlFor='max-value'>Max</label><br />
                    <input
                        className='values-input'
                        id='max-value'
                        name='max-value'
                        type='number'
                        onChange={(e) => setValorMaximo(e.target.value)}
                        value={valorMaximo}
                    />
                </div>
            </div>
            <div className='btn-filters'>
                <button
                    className='btn-clear-filters'
                    onClick={() => limparFiltros()}
                >
                    Limpar Filtros
                </button>
                <button
                    className='btn-aplly-filters'
                    onClick={() => filtrarValor()}
                >Aplicar Filtros</button>
            </div>
        </div>
    )
}

export default Filtros;
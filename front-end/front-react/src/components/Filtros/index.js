import './style.css';
import acrescenta from '../../assets/acrescenta.svg';
import exclui from '../../assets/exclui.svg';
import { useEffect, useState } from 'react';

const Filtros = ({
    transactionsData,
    setTransactionsData,
    loadTransaction,
    loadTransactions
}) => {
    const diasDaSemana = [
        {
            nome: 'Domingo',
            selecionado: false
        },
        {
            nome: 'Segunda',
            selecionado: false
        },
        {
            nome: 'Terça',
            selecionado: false
        },
        {
            nome: 'Quarta',
            selecionado: false
        },
        {
            nome: 'Quinta',
            selecionado: false
        },
        {
            nome: 'Sexta',
            selecionado: false
        },
        {
            nome: 'Sábado',
            selecionado: false
        }
    ];

    const [categorias, setCategorias] = useState([]);
    const [valorMinimo, setValorMinimo] = useState('');
    const [valorMaximo, setValorMaximo] = useState('');
    const [filtroAplicado, setFiltroAplicado] = useState(false);
    const [diaDaSemana, setDiaDaSemana] = useState(diasDaSemana);
    const [transactionsDataAfterFilter, setTransactionsDataAfterFilter] = useState(transactionsData);

    const selecionarFiltroSemana = (nome) => {
        const listaDosDias = [...diaDaSemana];

        const diasSelecionados = listaDosDias.find((dia) => dia.nome === nome);
        diasSelecionados.selecionado = !diasSelecionados.selecionado;

        setDiaDaSemana(listaDosDias);
    }

    useEffect(() => {
        listarCategorias()
    }, [transactionsData, filtroAplicado]);

    async function listarCategorias() {
        const listaTodasCategorias = [];
        for (const transaction of transactionsData) {
            listaTodasCategorias.push({
                nome: transaction.category,
                selecionado: false
            })
        };

        const idCategorias = [];
        const semCategoriasRepetidas = [];

        for (const categoria of listaTodasCategorias) {
            if (idCategorias.indexOf(categoria.nome) === -1) {
                idCategorias.push(categoria.nome);
                semCategoriasRepetidas.push(categoria);
            }
        };

        setCategorias(semCategoriasRepetidas);
    }

    const selecionarFiltroCategoria = (nome) => {
        const listaDascategorias = [...categorias];

        const categoriasSelecionadas = listaDascategorias.find((categoria) => categoria.nome === nome);
        categoriasSelecionadas.selecionado = !categoriasSelecionadas.selecionado;

        setCategorias(listaDascategorias);
    }

    function limparFiltros() {
        setValorMinimo('');
        setValorMaximo('');
        setDiaDaSemana(diasDaSemana);
        setFiltroAplicado(!filtroAplicado);
        loadTransactions();
    }

    useEffect(() => {
        loadTransactionsAfterFilter();
    }, [filtroAplicado]);

    async function loadTransactionsAfterFilter() {
        try {
            const response = await fetch('http://localhost:3333/transactions', {
                method: 'GET'
            });

            const data = await response.json();

            setTransactionsDataAfterFilter(data);

        } catch (error) {
            console.log(error);
        }
    }

    function filtrarDiasDaSemana() {
        const diasSelecionados = diaDaSemana.filter((dia) => dia.selecionado);

        const diasFiltrados = [];
        for (const dia of diasSelecionados) {
            diasFiltrados.push(dia.nome);
        }

        const arrayDoEstado = [...transactionsDataAfterFilter];
        const arrayDoEstadoFiltrado = [];
        if (diasFiltrados.length > 0) {
            for (const transaction of arrayDoEstado) {
                if (diasFiltrados.includes(transaction.week_day)) {
                    arrayDoEstadoFiltrado.push(transaction);
                }
            }
        }
        return arrayDoEstadoFiltrado;
    }

    function filtrarCategorias() {
        const categoriasSelecionadas = categorias.filter((categoria) => categoria.selecionado);

        const categoriaFiltrada = [];
        for (const categoria of categoriasSelecionadas) {
            categoriaFiltrada.push(categoria.nome);
        }

        const arrayDoEstado = [...transactionsDataAfterFilter];
        const arrayDoEstadoFiltrado = [];
        if (categoriaFiltrada.length > 0) {
            for (const transaction of arrayDoEstado) {
                if (categoriaFiltrada.includes(transaction.category)) {
                    arrayDoEstadoFiltrado.push(transaction);
                }
            }
        }
        return arrayDoEstadoFiltrado;
    }

    function filtrarValor() {
        if (!valorMinimo && !valorMaximo) {
            return;
        }

        const arrayDoEstado = [...transactionsDataAfterFilter];
        const arrayDoEstadoFiltrado = arrayDoEstado.filter((x) => {
            let valor = x.value;
            if (x.type === 'debit') {
                valor = valor * -1;
            }

            if (!valorMinimo) {
                return valor <= (valorMaximo * 100) ? true : false;
            }

            if (!valorMaximo) {
                return valor >= (valorMinimo * 100) ? true : false;
            }

            return valor >= (valorMinimo * 100) && valor <= (valorMaximo * 100) ? true : false;
        });
        return arrayDoEstadoFiltrado;
    }

    function aplicarFiltros() {
        const diasSelecionados = diaDaSemana.filter((dia) => dia.selecionado);
        const categoriasSelecionadas = categorias.filter((categoria) => categoria.selecionado);

        if (diasSelecionados.length === 0 && categoriasSelecionadas.length === 0 && !valorMinimo && !valorMaximo) {
            return;
        }

        const diasFiltrados = filtrarDiasDaSemana();
        const categoriasFiltradas = filtrarCategorias();
        const valoresFiltrados = filtrarValor();

        if (diasSelecionados.length === 0 && categoriasSelecionadas.length === 0) {
            setTransactionsData(valoresFiltrados);
        }

        if (diasSelecionados.length === 0 && !valorMinimo && !valorMaximo) {
            setTransactionsData(categoriasFiltradas);
        }

        if (categoriasSelecionadas.length === 0 && !valorMinimo && !valorMaximo) {
            setTransactionsData(diasFiltrados);
        }

        const todosOsFiltros = diasFiltrados.concat(categoriasFiltradas, valoresFiltrados);
        const todosOsFiltrosSemUndefined = todosOsFiltros.filter((item) => item);

        const todosOsFiltrosID = []
        const todosOsfiltrosSemRepeticoes = [];
        for (const transaction of todosOsFiltrosSemUndefined) {
            if (todosOsFiltrosID.indexOf(transaction.id) === -1) {
                todosOsFiltrosID.push(transaction.id);
                todosOsfiltrosSemRepeticoes.push(transaction);
            }
        };

        setTransactionsData(todosOsfiltrosSemRepeticoes);
        setFiltroAplicado(!filtroAplicado);
    }

    return (
        <div className='container-filters'>
            <div className='week-category-value'>
                <span>Dia da semana</span>
                <div className='filters-list'>
                    {diaDaSemana.map((dia) => {
                        return (
                            <button
                                className='container-chip'
                                key={dia.nome}
                                style={
                                    dia.selecionado ?
                                        { background: '#7B61FF', color: '#FAFAFA' } :
                                        { background: '#FAFAFA', color: '#000000' }
                                }
                                onClick={() => selecionarFiltroSemana(dia.nome)}
                            >
                                {dia.nome}
                                <img className='icon-filter' src={dia.selecionado ? exclui : acrescenta} alt='botão' />
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className='week-category-value'>
                <span>Categoria</span>
                <div className='filters-list'>
                    {categorias.map((categoria) => {
                        return (
                            <button
                                className='container-chip'
                                key={categoria.nome}
                                style={
                                    categoria.selecionado ?
                                        { background: '#7B61FF', color: '#FAFAFA' } :
                                        { background: '#FAFAFA', color: '#000000' }
                                }
                                onClick={() => selecionarFiltroCategoria(categoria.nome)}
                            >
                                {categoria.nome}
                                <img className='icon-filter' src={categoria.selecionado ? exclui : acrescenta} alt='botão' />
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
                    onClick={() => aplicarFiltros()}
                >Aplicar Filtros</button>
            </div>
        </div>
    )
}

export default Filtros;
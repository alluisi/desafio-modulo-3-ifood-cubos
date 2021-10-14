import './style.css';
import filtroBtn from '../../assets/filtro.svg';

const ButtonFiltros = ({ filtro, setFiltro }) => {
    return (
        <button
            className='open-filters-button'
            onClick={() => setFiltro(!filtro)}
        >
            <img src={filtroBtn} alt='filtro' /> Filtrar
        </button>
    )
}

export default ButtonFiltros;
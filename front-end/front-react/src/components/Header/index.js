import './style.css';
import logo from '../../assets/logo.svg'

const Header = () => {
    return (
        <div className='container-header'>
            <div className='logo'>
                <img src={logo} alt='logo' />
                <span>Dindin</span>
            </div>
        </div>
    )
}

export default Header;
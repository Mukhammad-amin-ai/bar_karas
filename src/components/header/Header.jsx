import { Link } from 'react-router-dom';
import assets from '../../assets';
import './header.scss';
export const Header = () => {
  return (
    <header className='header'>
      <div className='container'>
        <h3 className='app-name'>Бар Карась</h3>
        <Link to='/account' className='login-btn'>
          <img src={assets.userIcon} alt='user icon' />
          <span>Войти</span>
        </Link>
      </div>
    </header>
  );
};

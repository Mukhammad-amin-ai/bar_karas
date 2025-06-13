import { Route, Routes } from 'react-router-dom';
import { Account, Home, Login } from './pages';

function App() {
  return (
    <div className='wrapper'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/account' element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;

import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Chat from './components/Chat';
import Signup from './components/Signup';

function App() {
  return (
    <div >

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>

    </div>
  );
}

export default App;

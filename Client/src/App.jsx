import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Profile from './pages/ProfilePages.jsx';

const App = () => {
  const {authUser} = useContext(AuthContext);
    console.log("App.js - Current authUser:", authUser);
  return (
    <div className="bg-[url('/image.png')] bg-contain">

      <Toaster />
      <Routes>
       <Route path='/' element={authUser ? < HomePage/> :<Navigate to="/login" /> }  />
       <Route  path='/login' element={ !authUser ? <LoginPage /> : <Navigate to="/" />} />
       <Route path='/profile' element= {authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
      
      
    </div>
  )
}

export default App

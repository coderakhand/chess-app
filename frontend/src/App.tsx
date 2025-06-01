import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Play from './pages/Play'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/signup' element={<SignUp/>}></Route>
            <Route path='/signin' element={<LogIn/>}></Route>
            <Route path='/play' element= {<Play/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

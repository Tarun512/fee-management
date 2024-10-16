import Home from './pages/Home';
import Signup from './pages/Signup'
import Login from './pages/Login'
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeeStructureForm from './pages/FeeStructure';
import FeePaymentForm from './pages/FeePayment';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Student from './pages/Student';
import EditStudent from './pages/EditStudent'
import EditFeeStructureForm from './pages/EditFeeStructure';
import EditFeePaymentForm from './pages/EditFeePayment';
function App() {

  return(
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/add-student' element={<Student/>}/>
        <Route path='/edit-student/:id' element={<EditStudent/>}/>
        <Route path='/fee-structure' element={<FeeStructureForm/>}/>
        <Route path='/edit-structure/:id' element={<EditFeeStructureForm/>}/>
        <Route path='/fee-payment' element={<FeePaymentForm/>}/>
        <Route path='/edit-payment/:id' element={<EditFeePaymentForm/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import SessionForm from './components/SessionForm';
import GestorEstudio from './components/GestorEstudio';
import TareaManager from './components/TareaManager';
import SessionDetail from './components/SessionDetail';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ fontFamily: 'Arial, sans-serif' }}>
        
       

        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/crear-sesion" element={<SessionForm />} />
            <Route path="/gestor-estudio" element={<GestorEstudio />} />
            <Route path="/tareas/:tareaId" element={<TareaManager />} />
            <Route path="/session/:id" element={<SessionDetail />} />
             <Route path="/Register" element={<Register />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;

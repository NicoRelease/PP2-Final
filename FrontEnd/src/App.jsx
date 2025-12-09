// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';   // ← este es el que creamos antes

import Home from './components/Home';
import SessionForm from './components/SessionForm';
import GestorEstudio from './components/GestorEstudio';
import TareaManager from './components/TareaManager';
import SessionDetail from './components/SessionDetail';
import Login from './components/Login';
import Register from './components/Register';

import './App.css';
import '../src/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main>
          <Routes>

            {/* ==================== RUTAS PÚBLICAS ==================== */}
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />

            {/* ==================== RUTAS PROTEGIDAS ==================== */}
            {/* Si el usuario NO está logueado → lo manda al Login automáticamente */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/crear-sesion"
              element={
                <PrivateRoute>
                  <SessionForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/gestor-estudio"
              element={
                <PrivateRoute>
                  <GestorEstudio />
                </PrivateRoute>
              }
            />
            <Route
              path="/tareas/:tareaId"
              element={
                <PrivateRoute>
                  <TareaManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/session/:id"
              element={
                <PrivateRoute>
                  <SessionDetail />
                </PrivateRoute>
              }
            />

            {/* ==================== REDIRECCIÓN POR DEFECTO ==================== */}
            {/* Cualquier ruta desconocida → al login o al home si está logueado */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
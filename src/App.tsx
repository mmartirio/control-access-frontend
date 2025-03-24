import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Header from "./components/Header";
import Home from "./pages/home/Home";
import ProtectedRoute from "./ProtectedRoute";
import ListaFuncionarios from "./pages/funcionario/ListaFuncionario";
import AreaFuncionario from "./pages/funcionario/AreaFuncionario";
import NotFound from "./pages/NotFound"; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/header" element={<Header />} />
          <Route path="/home" element={<Home />} />
          <Route path="/AreaAdministrador" element={<AreaFuncionario />} />
          <Route path="/listaFuncionarios" element={<ListaFuncionarios />} />
        </Route>
        
        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rota 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
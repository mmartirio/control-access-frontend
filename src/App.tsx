// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";  // Página de login
import Home from "./pages/home/Home";    // Página principal
import NotFound from "./pages/NotFound"; // Página de erro 404
import Header from "./components/Header"; // Cabeçalho para as páginas principais
import AreaFuncionario from "./pages/funcionario/AreaFuncionario";
import ListaFuncionarios from "./pages/funcionario/ListaFuncionario";

const App = () => {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route path="/header" element={<Header />} />
        <Route path="/home" element={<Home />} />
        <Route path="/areaAdministrador" element={<AreaFuncionario />} /> 
        <Route path="/listaFuncionario" element={<ListaFuncionarios />} /> 
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
};

export default App;

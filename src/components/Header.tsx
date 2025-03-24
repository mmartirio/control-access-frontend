import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenericModal from "../components/GenericModal";
import CadastroVisitante from "../pages/visitantes/CadastroVisitante";
import ListaVisitas from "../pages/visitas/ListaVisitas";
import ListaVisitante from "../pages/visitantes/ListaVisitante";
import Home from "../pages/home/Home";
import "./Header.css";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(<Home />);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Verificar o role do usuário no sessionStorage
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (user?.role === "ROLE_ADMIN") {
      setIsAdmin(true);
    }
  }, []);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleLinkClick = (component: React.ReactNode) => {
    setActiveComponent(component);
    setModalOpen(false);
  };

  const goToAdminArea = () => {
    navigate("/AreaAdministrador"); 
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header>
      <nav>
        <div className="title">
          <h2>Bem-vindo</h2>
        </div>
        <ul>
          <li><button onClick={() => handleLinkClick(<Home />)}>Home</button></li>
          <li><button onClick={() => openModal(<CadastroVisitante />)}>Cadastrar Visitante</button></li>
          <li><button onClick={() => handleLinkClick(<ListaVisitas />)}>Lista de Visitas</button></li>
          <li><button onClick={() => handleLinkClick(<ListaVisitante />)}>Lista de Visitantes</button></li>
          
          {/* Mostrar o botão "Área Administrador" apenas se o usuário for admin */}
          {isAdmin && (
            <li>
              <button onClick={goToAdminArea}>Área Administrador</button>
            </li>
          )}

          <li className="closed">
            <button onClick={handleLogout}>Sair</button>
          </li>
        </ul>
      </nav>

      {activeComponent}

      <GenericModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent}
      </GenericModal>
    </header>
  );
};

export default Header;
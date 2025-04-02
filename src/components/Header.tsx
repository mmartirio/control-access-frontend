import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenericModal from "../components/GenericModal";
import CadastroVisitante from "../pages/visitantes/CadastroVisitante";
import CriarVisita from "../pages/visitas/CriarVisita";
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

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    setIsAdmin(user?.role === "ROLE_ADMIN");
  }, []);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLinkClick = (component: React.ReactNode) => {
    setActiveComponent(component);
    closeModal();
  };

  const goToAdminArea = () => {
    navigate("/AreaAdministrador"); 
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleVisitorCreated = (visitorId: number) => {
    closeModal();
    openModal(
      <CriarVisita 
        visitor={{ id: visitorId, name: "", surName: "" }} 
        onClose={closeModal}
      />
    );
  };

  return (
    <header>
      <nav>
        <div className="title">
          <h2>Bem-vindo</h2>
        </div>
        <ul>
          <li><button onClick={() => handleLinkClick(<Home />)}>Home</button></li>
          <li>
            <button onClick={() => openModal(
              <CadastroVisitante 
                onClose={closeModal} 
                onCreateVisit={handleVisitorCreated} 
              />
            )}>
              Cadastrar Visitante
            </button>
          </li>
          <li><button onClick={() => handleLinkClick(<ListaVisitas />)}>Lista de Visitas</button></li>
          <li><button onClick={() => handleLinkClick(<ListaVisitante />)}>Lista de Visitantes</button></li>
          
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

      <GenericModal isOpen={modalOpen} onClose={closeModal}>
        {modalContent}
      </GenericModal>
    </header>
  );
};

export default Header;
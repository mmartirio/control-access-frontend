import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericModal from "../../components/GenericModal";
import CadastroFuncionario from "./CadastroFuncionario";
import "./AreaFuncionario.css";
import ListaFuncionarios from "./ListaFuncionario";

type Role = "ROLE_ADMIN" | "ROLE_USER"; // Usando apenas os papéis definidos

interface Funcionario {
  name: string;
  surName: string;
  rg: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  enabled: boolean;
}

const AreaFuncionario = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(<ListaFuncionarios />);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  const navigate = useNavigate();

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleLinkClick = (component: React.ReactNode) => {
    setActiveComponent(component);
    setModalOpen(false);
  };

  const handleLogout = () => {
    navigate("/header"); 
    window.location.reload();
  };

  return (
    <header>
      <nav>
        <div className="title">
          <h2>Bem-vindo</h2>
        </div>
        <ul>
          <li><button onClick={() => handleLinkClick(<ListaFuncionarios />)}></button></li>
          <li>
            <button onClick={() => openModal(<CadastroFuncionario setFuncionarios={setFuncionarios} />)}>
              Cadastrar Funcionário
            </button>
          </li>
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

export default AreaFuncionario;

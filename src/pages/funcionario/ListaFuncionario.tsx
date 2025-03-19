import React, { useEffect, useState } from "react";
import GenericModal from "../../components/GenericModal";
import "./ListaFuncionario.css";

interface Funcionario {
  id: number;
  name: string;
  surName: string;
  username: string;
  rg: string;
  phone: string;
  email: string;
  role: string;
}

const ListaFuncionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Usuário não autenticado.");
          return;
        }

        const response = await fetch("http://localhost:8080/api/employees", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFuncionarios(data);
        } else {
          alert("Erro ao buscar funcionários.");
        }
      } catch (error) {
        alert("Erro ao conectar ao servidor.");
        console.error("Erro ao conectar ao servidor: ", error);
      }
    };

    fetchFuncionarios();
  }, []);

  const openModalWithContent = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFuncionarios = funcionarios.filter((funcionario) => {
    const query = searchQuery.toLowerCase();
    const role = funcionario.role === "ROLE_ADMIN" ? "Administrador" : "Usuário";

    return [funcionario.name, funcionario.surName, funcionario.username, funcionario.rg, funcionario.phone, funcionario.email, role].some(
      (valor) => valor.toLowerCase().includes(query)
    );
  });

  const handleViewDetails = (funcionario: Funcionario) => {
    const details = (
      <div>
        <p>
          <strong>Nome:</strong> {funcionario.name} {funcionario.surName}
        </p>
        <p>
          <strong>Username:</strong> {funcionario.username}
        </p>
        <p>
          <strong>RG:</strong> {funcionario.rg}
        </p>
        <p>
          <strong>Telefone:</strong> {funcionario.phone}
        </p>
        <p>
          <strong>Email:</strong> {funcionario.email}
        </p>
        <p>
          <strong>Cargo:</strong> {funcionario.role === "ROLE_ADMIN" ? "Administrador" : "Usuário"}
        </p>
      </div>
    );
    openModalWithContent(details);
  };

  return (
    <div className="funcionario-list">
      <h2>Lista de Funcionários</h2>
      <div className="searchList">
        <input type="text" placeholder="Pesquisar Funcionários" value={searchQuery} onChange={handleSearchChange} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Username</th>
            <th>RG</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {filteredFuncionarios.map((funcionario) => (
            <tr key={funcionario.id}>
              <td>{`${funcionario.name} ${funcionario.surName}`}</td>
              <td>{funcionario.username}</td>
              <td>{funcionario.rg}</td>
              <td>{funcionario.phone}</td>
              <td>{funcionario.email}</td>
              <td>{funcionario.role === "ROLE_ADMIN" ? "Administrador" : "Usuário"}</td>
              <td>
                <button className="funcionario-detail" onClick={() => handleViewDetails(funcionario)}>
                  Ver detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <GenericModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent}
      </GenericModal>
    </div>
  );
};

export default ListaFuncionarios;

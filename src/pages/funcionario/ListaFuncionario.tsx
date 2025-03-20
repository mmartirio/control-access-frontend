import React, { useEffect, useState } from "react";
import GenericModal from "../../components/GenericModal";
import EditaFuncionario from "../../pages/funcionario/EditaFuncionario";
import DeleteFuncionario from "../../pages/funcionario/DeleteFuncionario";
import "./ListaFuncionario.css";

export interface Funcionario {
  id: number;
  name: string;
  surName: string;
  rg: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  enabled: boolean;
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

        if (!response.ok) {
          throw new Error("Erro ao buscar funcionários.");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Dados inválidos recebidos da API.");
        }
        setFuncionarios(data);
      } catch (error) {
        alert("Erro ao conectar ao servidor.");
        console.error("Erro ao conectar ao servidor: ", error);
      }
    };

    fetchFuncionarios();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFuncionarios = funcionarios.filter((funcionario) => {
    const query = searchQuery.toLowerCase();
    const role = funcionario.role === "ROLE_ADMIN" ? "Administrador" : "Usuário";

    return [
      funcionario.name,
      funcionario.surName,
      funcionario.username,
      funcionario.rg,
      funcionario.phone,
      funcionario.email,
      role,
    ].some((valor) => valor?.toLowerCase().includes(query));
  });

  const openModalWithContent = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleEditFuncionario = (funcionario: Funcionario) => {
    openModalWithContent(
      <EditaFuncionario
        selectedFuncionario={funcionario}
        setFuncionarios={setFuncionarios}
        funcionarios={funcionarios}
        closeModal={() => setModalOpen(false)}
      />
    );
  };

  const handleDeleteFuncionario = (funcionario: Funcionario) => {
    openModalWithContent(
      <DeleteFuncionario
        funcionario={funcionario}
        onConfirmDelete={(id: number) => {  // Definir explicitamente o tipo do parâmetro
          // Atualiza o estado de funcionários para refletir a exclusão
          setFuncionarios((prevFuncionarios) =>
            prevFuncionarios.filter((func) => func.id !== id)
          );
        }}
        closeModal={() => setModalOpen(false)}
      />
    );
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
            <th>Ações</th>
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
                <button className="funcionario-edit" onClick={() => handleEditFuncionario(funcionario)}>
                  Editar
                </button>
                <button className="funcionario-delete" onClick={() => handleDeleteFuncionario(funcionario)}>
                  Excluir
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

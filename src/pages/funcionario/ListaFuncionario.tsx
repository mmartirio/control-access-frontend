import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:8080/api/employees", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });

        if (response.status === 401) {
          sessionStorage.clear();
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao buscar funcionários");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Formato de dados inválido");
        }
        
        setFuncionarios(data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, [navigate]);

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

  const handleDeleteFuncionario = async (funcionario: Funcionario) => {
    openModalWithContent(
      <DeleteFuncionario
        funcionario={funcionario}
        onConfirmDelete={async (id: number) => {
          try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
              navigate("/login");
              return;
            }

            const response = await fetch(`http://localhost:8080/api/employees/${id}`, {
              method: "DELETE",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              credentials: "include"
            });

            if (response.status === 401) {
              sessionStorage.clear();
              navigate("/login");
              return;
            }

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Erro ao excluir funcionário");
            }

            setFuncionarios(prev => prev.filter(func => func.id !== id));
            setModalOpen(false);
          } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
            alert(error instanceof Error ? error.message : "Erro ao excluir funcionário");
          }
        }}
        closeModal={() => setModalOpen(false)}
      />
    );
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="funcionario-list">
      <h2>Lista de Funcionários</h2>
      <div className="searchList">
        <input
          type="text"
          placeholder="Pesquisar Funcionários"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      {filteredFuncionarios.length === 0 ? (
        <div className="no-results">Nenhum funcionário encontrado</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Username</th>
              <th>RG</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Perfil</th>
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
                  <button
                    className="funcionario-edit"
                    onClick={() => handleEditFuncionario(funcionario)}
                  >
                    Editar
                  </button>
                  <button
                    className="funcionario-delete"
                    onClick={() => handleDeleteFuncionario(funcionario)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <GenericModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent}
      </GenericModal>
    </div>
  );
};

export default ListaFuncionarios;
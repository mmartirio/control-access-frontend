import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom"; // Usado para pegar o id da URL
import "./EditaFuncionario.css";

interface Funcionario {
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

interface EditaFuncionarioProps {
  setFuncionarios: Dispatch<SetStateAction<Funcionario[]>>;
  funcionarios: Funcionario[];
}

const EditaFuncionario: React.FC<EditaFuncionarioProps> = ({ setFuncionarios, funcionarios }) => {
  const [formData, setFormData] = useState<Funcionario>({
    name: "",
    surName: "",
    rg: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    role: "ROLE_USER",
    credentialsNonExpired: true,
    accountNonLocked: true,
    accountNonExpired: true,
    enabled: true,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>(); // Pega o id da URL

  // Função para inicializar o formulário com os dados do funcionário
  const initializeFuncionario = (id: string) => {
    const funcionarioToEdit = funcionarios.find((funcionario) => funcionario.username === id);
    if (funcionarioToEdit) {
      setFormData(funcionarioToEdit);
    }
  };

  useEffect(() => {
    if (id) {
      initializeFuncionario(id); // Inicializa com os dados do funcionário com o id
    }
  }, [id, funcionarios]); // Roda novamente se id ou funcionarios mudarem

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Funcionário editado com sucesso!");
        // Atualiza a lista de funcionários no estado
        const updatedFuncionario = await response.json();
        const updatedFuncionarios = funcionarios.map((funcionario) =>
          funcionario.username === updatedFuncionario.username ? updatedFuncionario : funcionario
        );
        setFuncionarios(updatedFuncionarios);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Erro ao editar funcionário.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-container">
      <h2>Editar Funcionário</h2>
      <form onSubmit={handleSubmit}>
        {["name", "surName", "rg", "phone", "email", "username", "password"].map((field) => (
          <input
            key={field}
            type={field === "email" ? "email" : field === "password" ? "password" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field as keyof Funcionario] as string}
            onChange={handleChange}
            required
            disabled={field === "username"} // Não permite editar o username
          />
        ))}

        <div className="role-select">
          <label htmlFor="role">Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="ROLE_USER">Usuário</option>
            <option value="ROLE_ADMIN">Administrador</option>
          </select>
        </div>

        {[
          { label: "Credenciais Não Expiradas", name: "credentialsNonExpired" },
          { label: "Conta Não Bloqueada", name: "accountNonLocked" },
          { label: "Conta Não Expirada", name: "accountNonExpired" },
          { label: "Usuário Ativo", name: "enabled" },
        ].map(({ label, name }) => (
          <div key={name} className="checkbox-group">
            <label>
              <input type="checkbox" name={name} checked={formData[name as keyof Funcionario] as boolean} onChange={handleChange} />
              {label}
            </label>
          </div>
        ))}

        <div className="edit-button">
          <button type="submit" disabled={loading}>
            {loading ? "Editando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditaFuncionario;

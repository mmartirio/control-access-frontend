import React, { useState, Dispatch, SetStateAction } from "react";
import "./CadastroFuncionario.css";

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

interface CadastroFuncionarioProps {
  setFuncionarios: Dispatch<SetStateAction<Funcionario[]>>;
}

const CadastroFuncionario: React.FC<CadastroFuncionarioProps> = ({ setFuncionarios }) => {
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
      const response = await fetch("http://localhost:8080/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Funcionário cadastrado com sucesso!");
        setFormData({
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
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Erro ao cadastrar funcionário.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cad-container">
      <h2>Cadastrar Funcionário</h2>
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

        <div className="cad-button">
          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroFuncionario;
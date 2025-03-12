import React, { useState, Dispatch, SetStateAction } from "react";
import "./CadastroFuncionario.css";

interface Funcionario {
  name: string;
  surName: string;
  rg: string;
  phone: string;
  email: string;
  password: string;
}

interface CadastroFuncionarioProps {
  setFuncionarios: Dispatch<SetStateAction<Funcionario[]>>; // Propriedade para setFuncionarios
}

const CadastroFuncionario: React.FC<CadastroFuncionarioProps> = ({ setFuncionarios }) => {
  const [formData, setFormData] = useState<Funcionario>({
    name: "",
    surName: "",
    rg: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      setError("Token de autenticação não encontrado.");
      return;
    }

    setLoading(true); // Ativa o loading enquanto o cadastro é feito

    try {
      const response = await fetch("http://localhost:8080/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Funcionário cadastrado com sucesso!");
        setFuncionarios((prev) => [...prev, formData]); // Atualiza a lista de funcionários no componente pai
        setFormData({ name: "", surName: "", rg: "", phone: "", email: "", password: "" });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao cadastrar funcionário");
      }
    } catch (error) {
      setError("Erro ao cadastrar funcionário.");
    } finally {
      setLoading(false); // Desativa o loading após o processo
    }
  };

  return (
    <div className="cad-container">
      <h2>Cadastrar Funcionário</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="surName"
          placeholder="Sobrenome"
          value={formData.surName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="rg"
          placeholder="RG"
          value={formData.rg}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <div className="error-message">{error}</div>}

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

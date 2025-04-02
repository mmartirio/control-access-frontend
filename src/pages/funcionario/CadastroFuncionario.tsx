import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;

      if (usernameInput) {
        usernameInput.setAttribute("autocomplete", "off");
        usernameInput.value = "";
      }
      if (passwordInput) {
        passwordInput.setAttribute("autocomplete", "new-password");
        passwordInput.value = "";
      }
    }, 100);
  }, []);

  const validateFields = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome não pode ser vazio";
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = "O nome deve ter entre 2 e 50 caracteres";
    }

    if (!formData.surName.trim()) {
      newErrors.surName = "Sobrenome não pode ser vazio";
    } else if (formData.surName.length < 2 || formData.surName.length > 50) {
      newErrors.surName = "O sobrenome deve ter entre 2 e 50 caracteres";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Nome de usuário não pode ser vazio";
    }

    if (!formData.rg.trim()) {
      newErrors.rg = "RG não pode ser vazio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email não pode ser vazio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone não pode ser vazio";
    } else if (formData.phone.length < 10 || formData.phone.length > 15) {
      newErrors.phone = "O telefone deve ter entre 10 e 15 caracteres";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Senha não pode ser vazia";
    } else if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpar erro ao começar a digitar
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

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
        setErrors({});
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
          <div key={field} className="input-group">
            <input
              type={field === "email" ? "email" : field === "password" ? "password" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field as keyof Funcionario] as string}
              onChange={handleChange}
              autoComplete={field === "password" ? "new-password" : "off"}
              required
            />
            {errors[field] && <span className="error-message">{errors[field]}</span>}
          </div>
        ))}

        <div className="role-select">
          <label htmlFor="role">Permissão:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="ROLE_USER">Usuário</option>
            <option value="ROLE_ADMIN">Administrador</option>
          </select>
        </div>

        <div className="checkbox-container">
          {[
            { label: "Credenciais Não Expiradas", name: "credentialsNonExpired" },
            { label: "Conta Não Bloqueada", name: "accountNonLocked" },
            { label: "Conta Não Expirada", name: "accountNonExpired" },
            { label: "Usuário Ativo", name: "enabled" },
          ].map(({ label, name }) => (
            <div key={name} className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name as keyof Funcionario] as boolean}
                  onChange={handleChange}
                />
                {label}
              </label>
            </div>
          ))}
        </div>

        <div className="cadastrar-button">
          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroFuncionario;

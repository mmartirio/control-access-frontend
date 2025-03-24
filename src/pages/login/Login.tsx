import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Função de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token && data.role) {
          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("user", JSON.stringify({ 
            role: data.role,
            username: username
          }));

          navigate("/header"); 
        } else {
          setErrorMessage("Resposta inválida do servidor");
        }
      } else {
        setErrorMessage(data.error || "Usuário ou senha inválidos");
      }
    } catch (error) {
      setErrorMessage("Erro de conexão com o servidor. Tente novamente.");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <img className="image" src="/assets/image/ca.svg" alt="Icon" />
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Usuário:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Entrar</button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Login;

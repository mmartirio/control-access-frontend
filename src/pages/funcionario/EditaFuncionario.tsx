import React, { useEffect, useState } from "react";
import { Funcionario } from "./ListaFuncionario";
import "./EditaFuncionario.css";

interface EditaFuncionarioProps {
  selectedFuncionario: Funcionario | null;
  setFuncionarios: React.Dispatch<React.SetStateAction<Funcionario[]>>;
  funcionarios: Funcionario[];
  closeModal: () => void; 
}

const EditaFuncionario: React.FC<EditaFuncionarioProps> = ({
  selectedFuncionario,
  setFuncionarios,
  funcionarios,
  closeModal,
}) => {
  const [name, setName] = useState<string>("");
  const [surName, setSurName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [credentialsNonExpired, setCredentialsNonExpired] = useState<boolean>(false);
  const [accountNonLocked, setAccountNonLocked] = useState<boolean>(false);
  const [accountNonExpired, setAccountNonExpired] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (selectedFuncionario) {
      setName(selectedFuncionario.name);
      setSurName(selectedFuncionario.surName);
      setUsername(selectedFuncionario.username);
      setPassword(selectedFuncionario.password);
      setCredentialsNonExpired(selectedFuncionario.credentialsNonExpired);
      setAccountNonLocked(selectedFuncionario.accountNonLocked);
      setAccountNonExpired(selectedFuncionario.accountNonExpired);
      setEnabled(selectedFuncionario.enabled);
    }
  }, [selectedFuncionario]);

  const handleSave = () => {
    if (!selectedFuncionario) return;

    const updatedFuncionario: Funcionario = {
      ...selectedFuncionario,
      name,
      surName,
      username,
      password,
      credentialsNonExpired,
      accountNonLocked,
      accountNonExpired,
      enabled,
    };

    // Atualizar o estado de funcionários
    const updatedFuncionarios = funcionarios.map((funcionario) =>
      funcionario.username === selectedFuncionario.username ? updatedFuncionario : funcionario
    );

    setFuncionarios(updatedFuncionarios);

    // Exibir mensagem de sucesso
    alert("Funcionário atualizado com sucesso!");

    // Fechar o modal após a atualização
    closeModal();
  };

  return (
    <div>
      {selectedFuncionario ? (
        <>
        <div className="edita-funcionario-container">
          <h3>Editar Funcionário</h3>
          <h3>{selectedFuncionario.name}</h3>
          <div className="edita-funcionario-form ">
          <div>
            <label>Nome</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Sobrenome</label>
            <input type="text" value={surName} onChange={(e) => setSurName(e.target.value)} />
          </div>
          <div>
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          </div>
          <div className="edita-funcionario-checkbox">
          <div>
            <label>Credenciais Não Expiradas</label>
            <input
              type="checkbox"
              checked={credentialsNonExpired}
              onChange={(e) => setCredentialsNonExpired(e.target.checked)}
            />
          </div>
          <div>
            <label>Conta Não Bloqueada</label>
            <input
              type="checkbox"
              checked={accountNonLocked}
              onChange={(e) => setAccountNonLocked(e.target.checked)}
            />
          </div>
          <div>
            <label>Conta Não Expirada</label>
            <input
              type="checkbox"
              checked={accountNonExpired}
              onChange={(e) => setAccountNonExpired(e.target.checked)}
            />
          </div>
          <div>
            <label>Ativo</label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </div>
          </div>
          <button onClick={handleSave}>Salvar</button>

        </div>
        </>
      ) : (
        <p>Funcionário não encontrado.</p>
      )}
    </div>
  );
};

export default EditaFuncionario;

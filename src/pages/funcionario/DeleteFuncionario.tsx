import React, { useState } from "react";
import "./DeleteFuncionario.css"

interface DeleteFuncionarioProps {
  funcionario: {
    id: number;
    name: string;
    surName: string;
  };
  onConfirmDelete: (id: number) => void;
  closeModal: () => void;
}

const DeleteFuncionario: React.FC<DeleteFuncionarioProps> = ({
  funcionario,
  onConfirmDelete,
  closeModal,
}) => {
  const [message, setMessage] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = () => {
    onConfirmDelete(funcionario.id);
    setMessage("Funcionário excluído com sucesso!");
    setIsDeleted(true);

    setTimeout(() => {
      closeModal();
    }, 3000);

  };

  return (
    <div className="delete-funcionario-modal">
      <h3>Confirmar Exclusão</h3>
      {!isDeleted ? (
        <>
          <p>
            Tem certeza de que deseja excluir o funcionário{" "}
            <strong>
              {funcionario.name} {funcionario.surName}
            </strong>
            ?
          </p>
          <div className="modal-actions">
          <button className="delete-button" onClick={handleDelete}>
              Excluir
            </button>
            <button className="cancel-button" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <p className="success-message">{message}</p>
      )}
    </div>
  );
};

export default DeleteFuncionario;

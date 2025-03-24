import React from "react";

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
  return (
    <div className="delete-funcionario-modal">
      <h3>Confirmar Exclusão</h3>
      <p>
        Tem certeza de que deseja excluir o funcionário{" "}
        <strong>
          {funcionario.name} {funcionario.surName}
        </strong>
        ?
      </p>
      <div className="modal-actions">
        <button className="cancel-button" onClick={closeModal}>
          Cancelar
        </button>
        <button className="delete-button" onClick={() => onConfirmDelete(funcionario.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
};

export default DeleteFuncionario;

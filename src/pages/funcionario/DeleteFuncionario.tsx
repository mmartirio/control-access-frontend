import { Funcionario } from "./ListaFuncionario"; 

const DeleteFuncionario: React.FC<{
  funcionario: Funcionario;
  onConfirmDelete: (id: number) => void;  // Callback para a exclusão
  closeModal: () => void;
}> = ({ funcionario, onConfirmDelete, closeModal }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }
  
      const response = await fetch(`http://localhost:8080/api/employees/${funcionario.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();  // Pegando a mensagem de erro do servidor
        throw new Error(`Erro ao excluir funcionário: ${errorText || response.statusText}`);
      }
  
      alert("Funcionário excluído com sucesso!");
      onConfirmDelete(funcionario.id);  // Atualiza a lista de funcionários
      closeModal();  // Fecha o modal de confirmação
    } catch (error: unknown) {
      // Verifica se o erro é uma instância de Error
      if (error instanceof Error) {
        alert(error.message || "Erro ao conectar ao servidor.");
        console.error("Erro ao conectar ao servidor: ", error);
      } else {
        alert("Erro desconhecido ao tentar excluir o funcionário.");
      }
    }
  };
  
  return (
    <div>
      <p>Tem certeza de que deseja excluir {funcionario.name}?</p>
      <button onClick={handleDelete}>Excluir</button>
      <button onClick={closeModal}>Cancelar</button>
    </div>
  );
};

export default DeleteFuncionario;

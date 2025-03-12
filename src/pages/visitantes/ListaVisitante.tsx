import React, { useEffect, useState } from 'react';
import GenericModal from "../../components/GenericModal";
import "./ListaVisitante.css";
import CriarVisita from "../visitas/CriarVisita";

interface Visitor {
  id: number;
  name: string;
  surname: string;
  rg: string;
  phone: string;
  photoUrl?: string;
}

const ListaVisitantes: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [currentVisitor, setCurrentVisitor] = useState<Visitor | null>(null); // Estado para armazenar o visitante sendo editado

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Usuário não autenticado.");
          return;
        }

        const response = await fetch("http://localhost:8080/api/visitors/all", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVisitors(data);
        } else {
          alert("Erro ao buscar visitantes.");
        }
      } catch (error) {
        alert("Erro ao conectar ao servidor.");
        console.error("Erro ao conectar ao servidor: ", error); // Log de erro
      }
    };

    fetchVisitors();
  }, []);

  const openModalWithContent = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    visitor.surname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (visitor: Visitor) => {
    const details = (
      <div>
        <h3>{visitor.name} {visitor.surname}</h3>
        <p><strong>RG:</strong> {visitor.rg}</p>
        <p><strong>Telefone:</strong> {visitor.phone}</p>
        {visitor.photoUrl ? (
  <div className="photo-container">
    <strong>Foto:</strong> 
    <img 
      src={visitor.photoUrl.startsWith("data:image")
        ? visitor.photoUrl 
        : `data:image/jpeg;base64,${visitor.photoUrl}`
      } 
      alt={`${visitor.name} ${visitor.surname}`} 
      className="visitor-photo" 
    />
  </div>
) : (
  <p><strong>Foto:</strong> Não disponível</p>
)}

      </div>
    );
    openModalWithContent(details);
  };

  const handleCreateVisit = (visitor: Visitor) => {
    const visitForm = <CriarVisita visitor={visitor} onClose={() => setModalOpen(false)} />;
    openModalWithContent(visitForm);
  };

  const handleEditVisitor = async (visitor: Visitor) => {
    setCurrentVisitor(visitor); // Define o visitante a ser editado
    const editForm = (
      <div className='edit-modal'>
        <h3>Editar dados do visitante</h3>
        <form onSubmit={async (e) => {
          e.preventDefault();

          if (!currentVisitor) return; // Caso não haja visitante sendo editado

          // Captura os dados do formulário
          const formData = new FormData(e.target as HTMLFormElement);
          const updatedVisitor = {
            ...currentVisitor,
            name: formData.get("name") as string,
            surname: formData.get("surname") as string,
            rg: formData.get("rg") as string,
            phone: formData.get("phone") as string,
          };

          try {
            const token = localStorage.getItem("authToken");
            if (!token) {
              alert("Usuário não autenticado.");
              return;
            }

            console.log("Tentando atualizar visitante:", updatedVisitor); // Log do visitante sendo enviado para atualização

            const response = await fetch(`http://localhost:8080/api/visitors/${updatedVisitor.id}`, {
              method: "PUT",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedVisitor),
            });

            if (response.ok) {
              alert("Dados do visitante atualizados com sucesso!");
              setModalOpen(false); // Fecha o modal após a atualização
              setVisitors(prevVisitors =>
                prevVisitors.map(visitor =>
                  visitor.id === updatedVisitor.id ? updatedVisitor : visitor
                )
              ); // Atualiza a lista de visitantes
            } else {
              alert("Erro ao atualizar os dados do visitante.");
              console.error("Erro ao atualizar os dados do visitante", response.statusText); // Log do erro
            }
          } catch (error) {
            alert("Erro ao conectar ao servidor.");
            console.error("Erro ao conectar ao servidor: ", error); // Log de erro
          }
        }}>
          <input 
            type="text" 
            defaultValue={visitor.name} 
            name="name"
          />
          <input 
            type="text" 
            defaultValue={visitor.surname} 
            name="surname"
          />
          <input 
            type="text" 
            defaultValue={visitor.rg} 
            name="rg"
          />
          <input 
            type="text" 
            defaultValue={visitor.phone} 
            name="phone"
          />
          <button type="submit">Salvar alterações</button>
        </form>
      </div>
    );
    openModalWithContent(editForm);
  };

  return (
    <div className="visitor-list">
      <h2>Lista de Visitantes</h2>
      <div className='searchQuery'>
      <input 
        type="text" 
        placeholder="Pesquisar Visitantes" 
        value={searchQuery} 
        onChange={handleSearchChange} 
      />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>RG</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisitors.map((visitor) => (
            <tr key={visitor.id}>
              <td>{visitor.name} {visitor.surname}</td>
              <td>{visitor.rg}</td>
              <td>{visitor.phone}</td>
              <td>
                <button onClick={() => handleViewDetails(visitor)}>Ver detalhes</button>
                <button onClick={() => handleCreateVisit(visitor)}>Criar Visita</button>
                <button onClick={() => handleEditVisitor(visitor)}>Editar</button> {/* Chama o handleEditVisitor */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <GenericModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent}
      </GenericModal>
    </div>
  );
};

export default ListaVisitantes;

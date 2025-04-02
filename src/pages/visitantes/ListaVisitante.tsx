import React, { useEffect, useState } from 'react';
import GenericModal from "../../components/GenericModal";
import EditaVisitante from "./EditaVisitante";
import CriarVisita from "../visitas/CriarVisita";
import "./ListaVisitante.css";

interface Visitor {
  id: number;  
  name: string;
  surName: string;
  rg: string;
  phone: string;
  photo?: string;
}

const ListaVisitantes: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

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
        console.error("Erro ao conectar ao servidor: ", error);
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
    visitor.surName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditVisitor = (visitor: Visitor) => {
    openModalWithContent(
      <EditaVisitante 
        visitorId={visitor.id} 
        onClose={() => setModalOpen(false)}
        onUpdateVisit={() => console.log("Visita atualizada")}
      />
    );
  };

  const handleViewDetails = (visitor: Visitor) => {
    const details = (
      <div>
        <p><strong>Nome:</strong> {visitor.name} {visitor.surName}</p>
        <p><strong>RG:</strong> {visitor.rg}</p>
        <p><strong>Telefone:</strong> {visitor.phone}</p>
        {visitor.photo ? (
          <div className="photo-container">
            <img 
              src={visitor.photo.startsWith("data:image")
                ? visitor.photo 
                : `data:image/jpeg;base64,${visitor.photo}`
              } 
              alt={`${visitor.name} ${visitor.surName}`} 
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
    openModalWithContent(<CriarVisita visitor={visitor} onClose={() => setModalOpen(false)} />);
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
            <th className='actions'>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisitors.map((visitor) => (
            <tr key={visitor.id}>
              <td>{visitor.name} {visitor.surName}</td>
              <td>{visitor.rg}</td>
              <td>{visitor.phone}</td>
              <td>
                <button className='visitor-detail' onClick={() => handleViewDetails(visitor)}>Detalhes</button>
                <button className='visitor-create-visit' onClick={() => handleCreateVisit(visitor)}>Criar Visita</button>
                <button className='visitor-edit' onClick={() => handleEditVisitor(visitor)}>Editar</button> 
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

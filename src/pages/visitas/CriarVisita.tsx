import React, { useState, useEffect } from "react";
import './CriaVisita.css'

interface CriarVisitaProps {
  visitor: { id: number; name: string; surName: string };
  onClose: () => void;
}

const CriarVisita: React.FC<CriarVisitaProps> = ({ visitor, onClose }) => {
  const [sector, setSector] = useState("");
  const [responsibleEmployeeId, setResponsibleEmployeeId] = useState<number | string>(""); 
  const [reason, setReason] = useState("");
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          alert("Usuário não autenticado. Faça login novamente.");
          return;
        }

        const response = await fetch("http://localhost:8080/api/employees", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        } else {
          const errorText = await response.text();
          alert(`Erro ao carregar funcionários. Status: ${response.status}. ${errorText}`);
        }
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        alert("Erro ao buscar funcionários.");
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar se o nome e sobrenome do visitante não estão vazios
    if (!visitor.name || !visitor.surName) {
      alert("Nome e sobrenome do visitante são obrigatórios.");
      return;
    }

    // Dados da visita
    const visitData = {
      visitorId: visitor.id,
      visitorName: visitor.name, 
      visitorSurName: visitor.surName, 
      sector,
      responsibleEmployeeId, 
      visitReason: reason,
      visitDate: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      const response = await fetch("http://localhost:8080/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(visitData),
      });

      if (response.ok) {
        alert("Visita criada com sucesso!");
        setSector("");
        setResponsibleEmployeeId(""); 
        setReason("");
        onClose();
      } else {
        const errorText = await response.text();
        alert(`Erro ao criar visita. Status: ${response.status}. ${errorText}`);
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="cria-container">
      <h3>Criar Visita para {visitor.name} {visitor.surName}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Setor</label>
          <input 
            type="text" 
            value={sector} 
            onChange={(e) => setSector(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Funcionário Responsável</label>
          <select
            value={responsibleEmployeeId}
            onChange={(e) => setResponsibleEmployeeId(e.target.value)}
            required
          >
            <option value="">Selecione um funcionário</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Motivo da Visita</label>
          <textarea 
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Criar Visita</button>
      </form>
    </div>
  );
};

export default CriarVisita;

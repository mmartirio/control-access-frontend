import { useEffect, useState } from "react";
import "./ListaVisitas.css"; 

interface Visita {
  id: number;
  visitorId: number;
  visitorName: string;
  visitorSurName: string;
  employeeName?: string;
  sector?: string;
  visitDate?: string;
}

const ListaVisitas = () => {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [filteredVisitas, setFilteredVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setError("Token de autenticação não encontrado");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/visits/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar visitas");
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Dados inválidos da API");
        }
        setVisitas(data);
        setFilteredVisitas(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const filterVisitas = (searchTerm: string) => {
    const lowerSearch = searchTerm.toLowerCase();

    setFilteredVisitas(
      visitas.filter((visita) => {
        const fullName = `${visita.visitorName || ""} ${visita.visitorSurName || ""}`.toLowerCase();
        const employee = (visita.employeeName || "").toLowerCase();
        const sector = (visita.sector || "").toLowerCase();
        const visitTime = visita.visitDate ? new Date(visita.visitDate).toLocaleTimeString("pt-BR") : "";
        const visitDate = visita.visitDate ? new Date(visita.visitDate).toLocaleDateString("pt-BR") : "";

        return (
          fullName.includes(lowerSearch) ||
          employee.includes(lowerSearch) ||
          sector.includes(lowerSearch) ||
          visitTime.includes(lowerSearch) ||
          visitDate.includes(lowerSearch)
        );
      })
    );
  };

  useEffect(() => {
    filterVisitas(search);
  }, [search, visitas]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (filteredVisitas.length === 0) return <p>Nenhuma visita encontrada.</p>;

  return (
    <div className="lista-visitas-container">
      <h2 className="lista-visitas-title">Lista de Visitas</h2>
      
      <div className="search">
        <input
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="visitas-table">
        <thead>
          <tr>
            <th className="table-header">Visitante</th>
            <th className="table-header">Funcionário</th>
            <th className="table-header">Setor</th>
            <th className="table-header">Hora</th>
            <th className="table-header">Data</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisitas.map((visita) => {
            const fullName = `${visita.visitorName || "Nome não disponível"} ${visita.visitorSurName || "Sobrenome não disponível"}`;
            const visitTime = visita.visitDate ? new Date(visita.visitDate).toLocaleTimeString("pt-BR") : "N/A";
            const visitDate = visita.visitDate ? new Date(visita.visitDate).toLocaleDateString("pt-BR") : "N/A";

            return (
              <tr key={visita.id}>
                <td className="table-cell">{fullName}</td>
                <td className="table-cell">{visita.employeeName || "N/A"}</td>
                <td className="table-cell">{visita.sector || "N/A"}</td>
                <td className="table-cell">{visitTime}</td>
                <td className="table-cell">{visitDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListaVisitas;

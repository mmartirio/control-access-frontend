import { useEffect, useState } from "react";
import "./ListaVisitas.css";

interface Visitor {
  id: number;
  name: string;
  surName: string;
}

interface Visita {
  id: number;
  visitReason: string;
  sector: string;
  visitDate: string;
  visitorId: number;
  responsibleName: string;
  visitor?: Visitor;
}

const ListaVisitas = () => {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [filteredVisitas, setFilteredVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [visitorsDetails, setVisitorsDetails] = useState<Record<number, Visitor>>({});

  const getAuthToken = () => {
    return sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
  };

  const fetchVisitorDetails = async (visitorId: number): Promise<Visitor> => {
    const token = getAuthToken();
    try {
      const response = await fetch(`http://localhost:8080/api/visitors/${visitorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status} ao buscar visitante`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar detalhes do visitante ${visitorId}:`, error);
      return {
        id: visitorId,
        name: "Visitante não encontrado",
        surName: ""
      };
    }
  };

  const fetchAllVisitorsDetails = async (visitas: Visita[]) => {
    const uniqueVisitorIds = [...new Set(visitas.map(v => v.visitorId))];
    const visitorsData: Record<number, Visitor> = {};
    
    const results = await Promise.all(
      uniqueVisitorIds.map(id => fetchVisitorDetails(id))
    );

    results.forEach(visitor => {
      visitorsData[visitor.id] = visitor;
    });

    setVisitorsDetails(visitorsData);
  };

  useEffect(() => {
    const fetchVisitas = async () => {
      const token = getAuthToken();
    
      if (!token) {
        setError("Token de autenticação não encontrado");
        setLoading(false);
        return;
      }
    
      try {
        const response = await fetch("http://localhost:8080/api/visits", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
    
        if (!response.ok) {
          // Verifica se a resposta está vazia antes de tentar parsear JSON
          const responseText = await response.text();
          if (!responseText) {
            throw new Error(`Erro ${response.status}: Resposta vazia do servidor`);
          }
          
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
          } catch {
            throw new Error(responseText || `Erro ${response.status}: ${response.statusText}`);
          }
        }
    
        // Verifica se a resposta tem conteúdo antes de parsear
        const responseText = await response.text();
        if (!responseText) {
          setVisitas([]);
          setFilteredVisitas([]);
          return;
        }
    
        const data = JSON.parse(responseText);
        
        if (!Array.isArray(data)) {
          throw new Error("Formato de dados inválido da API");
        }
    
        const formattedVisitas = data.map((item: any) => ({
          id: item.id || 0,
          visitReason: item.visitReason || "Motivo não informado",
          sector: item.sector || "Setor não informado",
          visitDate: item.visitDate,
          visitorId: item.visitor?.id || item.visitorId || 0,
          responsibleName: item.responsibleName || "Responsável não informado"
        }));
    
        setVisitas(formattedVisitas);
        setFilteredVisitas(formattedVisitas);
        await fetchAllVisitorsDetails(formattedVisitas);
      } catch (error) {
        console.error("Erro ao buscar visitas:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        setVisitas([]);
        setFilteredVisitas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitas();
  }, []);

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      
      if (isNaN(date.getTime())) {
        console.error("Data inválida:", isoString);
        return { date: "Data inválida", time: "" };
      }

      const formattedDate = date.toLocaleDateString("pt-BR");
      const formattedTime = date.toLocaleTimeString("pt-BR", {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Recife'
      });

      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return { date: "Erro", time: "" };
    }
  };

  const filterVisitas = (searchTerm: string) => {
    const lowerSearch = searchTerm.toLowerCase().trim();

    if (!lowerSearch) {
      setFilteredVisitas(visitas);
      return;
    }

    setFilteredVisitas(
      visitas.filter((visita) => {
        const visitor = visitorsDetails[visita.visitorId] || {
          name: "Visitante não encontrado",
          surName: ""
        };
        
        const visitorFullName = `${visitor.name} ${visitor.surName}`.toLowerCase();
        const responsibleName = visita.responsibleName.toLowerCase();
        const sector = visita.sector.toLowerCase();
        const visitReason = visita.visitReason.toLowerCase();
        const { date: visitDate } = formatDateTime(visita.visitDate);

        return (
          visitorFullName.includes(lowerSearch) ||
          responsibleName.includes(lowerSearch) ||
          sector.includes(lowerSearch) ||
          visitReason.includes(lowerSearch) ||
          visitDate.includes(lowerSearch)
        );
      })
    );
  };

  useEffect(() => {
    filterVisitas(search);
  }, [search, visitas, visitorsDetails]);

  if (loading) return <div className="loading-container">Carregando...</div>;
  if (error) return <div className="error-container">Erro: {error}</div>;

  return (
    <div className="lista-visitas-container">
      <h2 className="lista-visitas-title">Lista de Visitas</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nome, setor ou motivo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {visitas.length === 0 ? (
        <div className="no-visits-message">
          Não existem visitas cadastradas.
        </div>
      ) : filteredVisitas.length === 0 ? (
        <div className="no-results">
          Nenhuma visita encontrada com o critério de busca.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="visitas-table">
            <thead>
              <tr>
                <th>Visitante</th><th>Responsável</th><th>Setor</th>
                <th>Motivo</th><th>Data</th><th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitas.map((visita) => {
                const visitor = visitorsDetails[visita.visitorId] || {
                  name: "Visitante não encontrado",
                  surName: ""
                };
                
                const { date: formattedDate, time: formattedTime } = formatDateTime(visita.visitDate);

                return (
                  <tr key={visita.id}>
                    <td>{visitor.name} {visitor.surName}</td>
                    <td>{visita.responsibleName}</td>
                    <td>{visita.sector}</td>
                    <td>{visita.visitReason}</td>
                    <td>{formattedDate}</td>
                    <td>{formattedTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaVisitas;
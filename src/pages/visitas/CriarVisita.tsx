import React, { useState, useEffect } from 'react';
import './CriaVisita.css';

// Tipos de dados
interface Employee {
  id: number;
  name: string;
  surName: string;
}

interface Visitor {
  id: number;
  name: string;
  surName: string;
}

interface VisitData {
  visitorId: number;
  visitorName: string;
  visitorSurName: string;
  sector: string;
  responsibleEmployeeId: number;
  visitReason: string;
  visitDate: string;
}

interface CriarVisitaProps {
  visitor: Visitor;
  onClose: () => void;
  onSuccess?: () => void;
}

const CriarVisita: React.FC<CriarVisitaProps> = ({ visitor, onClose, onSuccess }) => {
  // Estados do componente
  const [formData, setFormData] = useState({
    sector: '',
    responsibleEmployeeId: '',
    reason: ''
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState({
    employees: true,
    submitting: false
  });
  const [error, setError] = useState('');

  // Buscar lista de funcionários ao carregar o componente
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          throw new Error('Usuário não autenticado');
        }

        const response = await fetch('http://localhost:8080/api/employees', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao carregar funcionários');
        }

        const data: Employee[] = await response.json();
        setEmployees(data);
      } catch (err) {
        console.error('Erro ao buscar funcionários:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(prev => ({ ...prev, employees: false }));
      }
    };

    fetchEmployees();
  }, []);

  // Manipulador de mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar dados da visita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submitting: true }));
    setError('');

    try {
      // Validações
      if (!visitor.name || !visitor.surName) {
        throw new Error('Nome e sobrenome do visitante são obrigatórios');
      }

      if (!formData.responsibleEmployeeId) {
        throw new Error('Selecione um funcionário responsável');
      }

      const token = sessionStorage.getItem('authToken');
      if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      // Preparar dados para envio
      const visitData: VisitData = {
        visitorId: visitor.id,
        visitorName: visitor.name,
        visitorSurName: visitor.surName,
        sector: formData.sector,
        responsibleEmployeeId: Number(formData.responsibleEmployeeId),
        visitReason: formData.reason,
        visitDate: new Date().toISOString()
      };

      // Enviar requisição
      const response = await fetch('http://localhost:8080/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(visitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar visita');
      }

      // Sucesso - limpar formulário e fechar
      setFormData({
        sector: '',
        responsibleEmployeeId: '',
        reason: ''
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Erro ao criar visita:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar visita');
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  // Renderização condicional
  if (loading.employees) {
    return (
      <div className="loading-container">
        <p>Carregando lista de funcionários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={onClose} className="close-button">
          Fechar
        </button>
      </div>
    );
  }

  // Renderização principal
  return (
    <div className="cria-visita-container">
      <h2 className="visita-title">
        Criar Visita para {visitor.name} {visitor.surName}
      </h2>

      <form onSubmit={handleSubmit} className="visita-form">
        <div className="form-group">
          <label htmlFor="sector">Setor:</label>
          <input
            type="text"
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="responsibleEmployeeId">Funcionário Responsável:</label>
          <select
            id="responsibleEmployeeId"
            name="responsibleEmployeeId"
            value={formData.responsibleEmployeeId}
            onChange={handleInputChange}
            required
            className="form-select"
          >
            <option value="">Selecione um funcionário</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name} {employee.surName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Motivo da Visita:</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading.submitting}
            className="submit-button"
          >
            {loading.submitting ? 'Enviando...' : 'Criar Visita'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriarVisita;
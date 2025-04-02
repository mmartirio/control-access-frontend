import React, { useState } from 'react';
import './CriaVisita.css';

interface Visitor {
  id: number;
  name: string;
  surName: string;
}

interface CriarVisitaProps {
  visitor: Visitor;
  onClose: () => void;
  onSuccess?: () => void;
}

interface JwtPayload {
  exp?: number;
}

const CriarVisita: React.FC<CriarVisitaProps> = ({ visitor, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    visitReason: '',
    sector: '',
    responsibleName: ''
  });

  const [loading, setLoading] = useState({
    submitting: false
  });
  const [error, setError] = useState('');

  // Função para formatar data/hora no fuso de Sergipe (apenas para exibição)
  const getLocalDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('pt-BR', { timeZone: 'America/Recife' }),
      time: now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'America/Recife'
      })
    };
  };

  // Função para gerar data no formato correto para o backend (-03:00)
  const getCorrectVisitDate = () => {
    const now = new Date();
    // Cria uma data artificial no fuso -03:00
    const fakeLocalDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return fakeLocalDate.toISOString().slice(0, -1) + '-03:00';
  };

  const { date, time } = getLocalDateTime();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submitting: true }));
    setError('');
  
    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }

      // Verificação segura do token expirado
      try {
        const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
      } catch (e) {
        console.warn('Erro ao verificar token:', e);
      }
  
      if (!formData.responsibleName.trim()) {
        throw new Error('Informe o nome do responsável');
      }
  
      const response = await fetch('http://localhost:8080/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          visitReason: formData.visitReason,
          sector: formData.sector,
          visitDate: getCorrectVisitDate(), // Usando a função corrigida
          visitorId: visitor.id,
          responsibleName: formData.responsibleName
        })
      });
  
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Acesso negado. Verifique suas permissões.');
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erro ${response.status}: ${response.statusText}`);
      }
  
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar visita';
      setError(errorMessage);
      console.error('Erro ao criar visita:', err);
      
      if (errorMessage.includes('403') || errorMessage.includes('Sessão expirada')) {
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('authToken');
      }
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="cria-visita-container">
      <h2 className="visita-title">Criar Visita para </h2>
      <h2 className='visita-name'>{visitor.name} {visitor.surName}</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="visita-form">
        <div className="form-time">
          <div className="datetime-display">
            <label>Data:</label>
            {date}
          </div>
          <div className="datetime-display">
            <label>Hora:</label>
            {time}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sector">Setor:</label>
          <input
            type="text"
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleInputChange}
            required
            minLength={2}
            maxLength={50}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="responsibleName">Responsável:</label>
          <input
            type="text"
            id="responsibleName"
            name="responsibleName"
            value={formData.responsibleName}
            onChange={handleInputChange}
            required
            minLength={2}
            maxLength={100}
            className="form-input"
            placeholder="Nome do responsável"
          />
        </div>

        <div className="form-group">
          <label htmlFor="visitReason">Motivo da Visita:</label>
          <textarea
            id="visitReason"
            name="visitReason"
            value={formData.visitReason}
            onChange={handleInputChange}
            required
            minLength={2}
            maxLength={100}
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
        </div>
      </form>
    </div>
  );
};

export default CriarVisita;
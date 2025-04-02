import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import "./CadastroVisitante.css";

interface EditaVisitanteProps {
  visitorId: number;
  onClose: () => void;
  onUpdateVisit: () => void;
}

const EditaVisitante: React.FC<EditaVisitanteProps> = ({ visitorId, onClose, onUpdateVisit }) => {
  const [formData, setFormData] = useState({
    name: "",
    surName: "",
    rg: "",
    phone: "",
    photo: "",
  });
  const [showCamera, setShowCamera] = useState(false);
  const [buttonText, setButtonText] = useState("Foto");
  const webcamRef = useRef<Webcam | null>(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Usuário não autenticado. Faça login novamente.");
          return;
        }
        const response = await fetch(`http://localhost:8080/api/visitors/${visitorId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          alert("Erro ao buscar os dados do visitante.");
        }
      } catch (error) {
        alert("Erro de conexão com o servidor.");
      }
    };
    fetchVisitorData();
  }, [visitorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setFormData({ ...formData, photo: imageSrc });
        setShowCamera(false);
        setButtonText("Foto");
      }
    }
  };

  const handleButtonClick = () => {
    if (!showCamera) {
      setShowCamera(true);
      setButtonText("Capturar Foto");
    } else {
      capturePhoto();
    }
  };

  const cancelCapture = () => {
    setShowCamera(false); // Cancela a captura da foto
    setButtonText("Foto"); // Muda o texto do botão para "Foto"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }
      const response = await fetch(`http://localhost:8080/api/visitors/${visitorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Visitante atualizado com sucesso!");
        onClose();
        onUpdateVisit();
      } else {
        alert("Erro ao atualizar visitante.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="cad-container">
      <h2>Editar Visitante</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="surName"
          placeholder="Sobrenome"
          value={formData.surName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="rg"
          placeholder="RG"
          value={formData.rg}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {/* Exibindo a câmera ou a imagem carregada */}
        {showCamera && (
          <div className="camera-container">
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
          </div>
        )}

        {formData.photo && !showCamera && (
          <div className="photo-preview">
            <img src={formData.photo} alt="Foto do visitante" />
          </div>
        )}

        {/* Botão para alternar entre foto e câmera */}
        <button type="button" onClick={handleButtonClick}>
          {buttonText}
        </button>

        {/* Botão de cancelar, visível apenas quando a câmera está ativada */}
        {showCamera && (
          <button type="button" onClick={cancelCapture}>
            Cancelar
          </button>
        )}

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditaVisitante;

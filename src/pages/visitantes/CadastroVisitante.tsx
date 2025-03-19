import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./CadastroVisitante.css";

const CadastroVisitante: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    surName: "",
    rg: "",
    phone: "",
    photo: "", // Armazena a imagem como Base64
  });
  const [showCamera, setShowCamera] = useState(false);
  const [buttonText, setButtonText] = useState("Foto");
  const webcamRef = useRef<Webcam | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setFormData({ ...formData, photo: imageSrc }); // Armazena diretamente como Base64
        sessionStorage.setItem("visitorPhoto", imageSrc); // Opcional
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.surName.trim()) {
      alert("Sobrenome não pode ser vazio.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      const response = await fetch("http://localhost:8080/api/visitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // Envia como JSON
      });

      if (response.ok) {
        alert("Visitante cadastrado com sucesso!");
        setFormData({ name: "", surName: "", rg: "", phone: "", photo: "" });
        sessionStorage.removeItem("visitorPhoto");
      } else {
        alert("Erro ao cadastrar visitante.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="cad-container">
      <h2>Cadastrar Visitante</h2>
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

        {showCamera && (
          <div className="camera-container">
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
          </div>
        )}

        {formData.photo && (
          <div className="photo-preview">
            <img src={formData.photo} alt="Foto do visitante" />
          </div>
        )}

        <button type="button" onClick={handleButtonClick}>
          {buttonText}
        </button>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroVisitante;

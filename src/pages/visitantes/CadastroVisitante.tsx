import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./CadastroVisitante.css";

const CadastroVisitante: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    surName: "",
    rg: "",
    phone: "",
  });
  const [photo, setPhoto] = useState<File | null>(null); // Foto como File
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
        const byteArray = dataURItoBlob(imageSrc); // Função para converter dataURI para Blob
        const photoFile = new File([byteArray], "visitor-photo.jpg", { type: "image/jpeg" });

        setPhoto(photoFile); // Armazena o arquivo de foto
        sessionStorage.setItem("visitorPhoto", imageSrc); // Opcional, pode ser removido
        setShowCamera(false); // Fecha a câmera após tirar a foto
        setButtonText("Foto"); // Reseta o texto do botão
      }
    }
  };

  // Função para converter base64 (dataURI) para Blob
  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: "image/jpeg" });
  };

  const handleButtonClick = () => {
    if (!showCamera) {
      setShowCamera(true); // Exibe a câmera para tirar a foto
      setButtonText("Capturar Foto"); // Muda o texto do botão
    } else {
      capturePhoto(); // Captura a foto
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valida o campo "sobrenome"
    if (!formData.surName.trim()) {
      alert("Sobrenome não pode ser vazio.");
      return;
    }

    const visitorData = new FormData();
    visitorData.append("name", formData.name);
    visitorData.append("surName", formData.surName);
    visitorData.append("rg", formData.rg);
    visitorData.append("phone", formData.phone);

    if (photo) {
      visitorData.append("photo", photo); // Adiciona o arquivo de foto ao FormData
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
          "Authorization": `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
        body: visitorData, // Envia o FormData com os dados e a foto
      });

      if (response.ok) {
        alert("Visitante cadastrado com sucesso!");
        setFormData({ name: "", surName: "", rg: "", phone: "" });
        setPhoto(null);
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

        {photo && (
          <div className="photo-preview">
            <img src={URL.createObjectURL(photo)} alt="Foto do visitante" />
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

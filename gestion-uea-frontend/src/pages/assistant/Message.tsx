import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaClipboardList,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaPaperPlane,
} from "react-icons/fa";
import "./Message.css";

const senegalFlag =
  "https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg";

interface Message {
  id: string;
  teacherName: string;
  module: string;
  description: string;
  message: string;
  date: string;
}

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [teacherName, setTeacherName] = useState("");
  const [module, setModule] = useState("");
  const [description, setDescription] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const assistantName = localStorage.getItem("assistantName") || "Assistante";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");

    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Erreur de chargement des messages :", err);
      }
    };

    fetchMessages();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("assistantName");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSendMessage = async () => {
    if (!teacherName || !module || !newMessage) {
      alert("Veuillez remplir tous les champs requis !");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/messages",
        {
          teacherName,
          module,
          description,
          message: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, res.data.data]);
      setTeacherName("");
      setModule("");
      setDescription("");
      setNewMessage("");
      alert("✅ Message envoyé à l’enseignant !");
    } catch (err) {
      console.error("Erreur lors de l’envoi :", err);
      alert("❌ Erreur lors de l’envoi du message.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img
              src={senegalFlag}
              alt="Drapeau du Sénégal"
              className="senegal-flag"
            />
            <h1>
              Ministère de l’Enseignement Supérieur, de la Recherche et de
              l’Innovation du Sénégal
            </h1>
          </div>
          <span className="header-welcome">
            Bienvenue, <b>{assistantName}</b>
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-header">
            {!collapsed && <h2>Assistante Technique</h2>}
            <button
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              <FaBars />
            </button>
          </div>
          <nav>
            <button
              className="sidebar-btn"
              onClick={() => navigate("/assistant/home")}
            >
              <FaHome /> {!collapsed && <span>Tableau de bord</span>}
            </button>
            <button
              className="sidebar-btn"
              onClick={() => navigate("/assistant/suivi-registre")}
            >
              <FaClipboardList /> {!collapsed && <span>Suivi registres</span>}
            </button>
            <button
              className="sidebar-btn active"
              onClick={() => navigate("/assistant/messages")}
            >
              <FaEnvelope /> {!collapsed && <span>Messages</span>}
            </button>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> {!collapsed && <span>Déconnexion</span>}
          </button>
        </aside>

        {/* Main */}
        <main className="dashboard-main">
          <h2 className="message-title">📩 Réception et Envoi de message</h2>

          {/* Formulaire d'envoi */}
          <div className="message-form">
            <h3>Envoyer un message à un enseignant</h3>

            <input
              type="text"
              placeholder="Nom de l’enseignant"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Module"
              value={module}
              onChange={(e) => setModule(e.target.value)}
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <textarea
              placeholder="Votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>

            <button className="send-btn" onClick={handleSendMessage}>
              <FaPaperPlane /> Envoyer
            </button>
          </div>

          {/* Liste des messages reçus */}
          <div className="messages-list">
            <h3>📨 Messages reçus</h3>
            {messages.length === 0 ? (
              <p>Aucun message pour le moment.</p>
            ) : (
              messages
                .slice()
                .reverse()
                .map((msg) => (
                  <div key={msg.id} className="message-card">
                    <p>
                      <b>👩‍🏫 Enseignant :</b> {msg.teacherName}
                    </p>
                    <p>
                      <b>📘 Module :</b> {msg.module}
                    </p>
                    <p>
                      <b>📝 Description :</b> {msg.description}
                    </p>
                    <p>
                      <b>💬 Message :</b> {msg.message}
                    </p>
                    <p className="message-date">
                      {new Date(msg.date).toLocaleString("fr-FR")}
                    </p>
                  </div>
                ))
            )}
          </div>
        </main>
      </div>

      <footer className="dashboard-footer">
        © 2025 — Tous droits réservés ISEP-THIÈS
      </footer>
    </div>
  );
};

export default Messages;

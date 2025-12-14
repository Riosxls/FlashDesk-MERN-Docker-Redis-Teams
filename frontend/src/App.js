import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contactEmail: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await axios.get("http://localhost:3001/tickets");
    setTickets(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/tickets/${editingId}`, formData);
        alert("Chamado Atualizado com Sucesso!");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:3001/tickets", formData);
        alert("Chamado Criado! Verifique o Teams.");
      }
      setFormData({ title: "", description: "", contactEmail: "" });
      fetchTickets();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este chamado?")) {
      await axios.delete(`http://localhost:3001/tickets/${id}`);
      fetchTickets();
    }
  };

  const startEditing = (ticket) => {
    setEditingId(ticket._id);
    setFormData({
      title: ticket.title,
      description: ticket.description,
      contactEmail: ticket.contactEmail,
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">⚡ FlashDesk Suporte</h1>

      <div className="card mb-4 p-4 shadow-sm">
        <h4>{editingId ? "Editar Chamado" : "Abrir Novo Chamado"}</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Título do Problema"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Seu Email"
              required
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Descreva o problema..."
              rows="3"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          <button
            type="submit"
            className={`btn ${editingId ? "btn-warning" : "btn-success"} me-2`}
          >
            {editingId ? "Atualizar Chamado" : "Enviar Chamado"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setFormData({ title: "", description: "", contactEmail: "" });
              }}
            >
              Cancelar Edição
            </button>
          )}
        </form>
      </div>

      <h4>Chamados Recentes</h4>
      <div className="list-group">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{ticket.title}</h5>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => startEditing(ticket)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(ticket._id)}
                >
                  Excluir
                </button>
              </div>
            </div>
            <p className="mb-1">{ticket.description}</p>
            <small className="text-muted">
              Status: {ticket.status} | ID: {ticket._id}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

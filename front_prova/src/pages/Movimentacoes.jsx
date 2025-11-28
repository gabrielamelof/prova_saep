import { useEffect, useState } from "react";
import "../styles/Movimentacoes.css";

export default function Movimentacoes() {
  const [movs, setMovs] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [erro, setErro] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [movEdit, setMovEdit] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    carregarMovs();
    carregarProdutos();
  }, []);


  const carregarMovs = () => {
    fetch("http://127.0.0.1:8000/api/movimentacoes/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setMovs)
      .catch(() => setErro("Erro ao buscar movimentações."));
  };

  const carregarProdutos = () => {
    fetch("http://127.0.0.1:8000/api/produtos/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setProdutos)
      .catch(() => setErro("Erro ao carregar produtos."));
  };


  const handleCreateMovement = (e) => {
    e.preventDefault();

    const form = e.target;
    const movimento = {
      produto: form.produto.value,
      tipo: form.tipo.value,
      quantidade: form.quantidade.value,
      data_mov: form.data_mov.value,
    };

    fetch("http://127.0.0.1:8000/api/movimentacoes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(movimento),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setShowCreateModal(false);
        carregarMovs();
      })
      .catch(() => alert("Erro ao criar movimentação."));
  };


  const abrirEdicao = (mov) => {
    setMovEdit(mov);
    setShowEditModal(true);
  };


  const handleEditMovement = (e) => {
    e.preventDefault();

    const form = e.target;

    const atualizado = {
      produto: form.produto.value,
      tipo: form.tipo.value,
      quantidade: form.quantidade.value,
      data_mov: form.data_mov.value,
    };

    fetch(`http://127.0.0.1:8000/api/movimentacoes/${movEdit.id_movimentacao}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(atualizado),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setShowEditModal(false);
        setMovEdit(null);
        carregarMovs();
      })
      .catch(() => alert("Erro ao editar movimentação."));
  };

  const handleDeleteMovement = (id) => {
    if (!confirm("Deseja excluir esta movimentação?")) return;

    fetch(`http://127.0.0.1:8000/api/movimentacoes/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 204) carregarMovs();
        else throw new Error();
      })
      .catch(() => alert("Erro ao excluir movimentação."));
  };


  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="nav-logo">Sistema de Estoque</h2>

        <div className="nav-links">
          <button onClick={() => (window.location.href = "/home")} className="nav-btn">
            Produtos
          </button>

          <button className="nav-btn active">Movimentações</button>

          <button onClick={handleLogout} className="nav-logout">
            Sair
          </button>
        </div>
      </nav>

      {/* CONTEÚDO */}
      <div className="mov-container">
        <div className="mov-header">
          <h1 className="mov-title">Movimentações</h1>

          <button
            className="new-mov-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Nova Movimentação
          </button>
        </div>

        {erro && <p className="mov-error">{erro}</p>}

        <div className="mov-list">
          {movs.length > 0 ? (
            movs.map((m) => (
              <div key={m.id_movimentacao} className="mov-card">
                <h3>{m.produto_nome}</h3>

                <div className="mov-details">
                  <span>Tipo: {m.tipo}</span>
                  <span>Quantidade: {m.quantidade}</span>
                  <span>Data: {m.data_mov}</span>
                </div>

                <div className="mov-actions">
                  <button className="edit-btn" onClick={() => abrirEdicao(m)}>
                    Editar
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMovement(m.id_movimentacao)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhuma movimentação encontrada.</p>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nova Movimentação</h2>

            <form onSubmit={handleCreateMovement} className="modal-form">
              <select name="produto" required>
                <option value="">Selecione um produto</option>
                {produtos.map((p) => (
                  <option key={p.id_produto} value={p.id_produto}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <select name="tipo" required>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>

              <input type="number" name="quantidade" required placeholder="Quantidade" />
              <input type="date" name="data_mov" required />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>

                <button type="submit" className="save-btn">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && movEdit && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Movimentação</h2>

            <form onSubmit={handleEditMovement} className="modal-form">
              <select name="produto" defaultValue={movEdit.produto} required>
                {produtos.map((p) => (
                  <option key={p.id_produto} value={p.id_produto}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <select name="tipo" defaultValue={movEdit.tipo} required>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>

              <input
                type="number"
                name="quantidade"
                defaultValue={movEdit.quantidade}
                required
              />

              <input
                type="date"
                name="data_mov"
                defaultValue={movEdit.data_mov}
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="save-btn">
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

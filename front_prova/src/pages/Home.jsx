import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState(null);

  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const carregarProdutos = () => {
    fetch("http://127.0.0.1:8000/api/produtos/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro");
        return res.json();
      })
      .then(setProdutos)
      .catch(() => setErro("Erro ao buscar produtos."));
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    carregarProdutos();
  }, []);


  const handleCreateProduct = (e) => {
    e.preventDefault();

    const form = e.target;
    const novoProduto = {
      nome: form.nome.value,
      descricao: form.descricao.value,
      estoque_minimo: parseInt(form.estoque_minimo.value),
      estoque_atual: parseInt(form.estoque_atual.value),
    };

    fetch("http://127.0.0.1:8000/api/produtos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(novoProduto),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setShowCreateModal(false);
        carregarProdutos();
      })
      .catch(() => alert("Erro ao criar produto."));
  };

  const abrirEdicao = (produto) => {
    setProdutoEdit(produto);
    setShowEditModal(true);
  };

  const handleEditProduct = (e) => {
    e.preventDefault();

    const form = e.target;
    const produtoAtualizado = {
      nome: form.nome.value,
      descricao: form.descricao.value,
      estoque_minimo: parseInt(form.estoque_minimo.value),
      estoque_atual: parseInt(form.estoque_atual.value),
    };

    fetch(`http://127.0.0.1:8000/api/produtos/${produtoEdit.id_produto}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(produtoAtualizado),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setShowEditModal(false);
        setProdutoEdit(null);
        carregarProdutos();
      })
      .catch(() => alert("Erro ao editar produto."));
  };

  const handleDeleteProduct = (id_produto) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    fetch(`http://127.0.0.1:8000/api/produtos/${id_produto}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status !== 204) throw new Error();
        carregarProdutos();
      })
      .catch(() => alert("Erro ao excluir produto."));
  };

  const produtosFiltrados = produtos.filter((p) => {
    const termo = busca.toLowerCase();
    return (
      p.nome.toLowerCase().includes(termo) ||
      String(p.id_produto).includes(termo)
    );
  });

  return (
    <>
      <nav className="navbar">
        <h2 className="nav-logo">Sistema de Estoque</h2>

        <div className="nav-links">
          <button onClick={() => navigate("/home")} className="nav-btn">
            Produtos
          </button>
          <button onClick={() => navigate("/movimentacoes")} className="nav-btn">
            Movimentações
          </button>
          <button onClick={handleLogout} className="nav-logout">
            Sair
          </button>
        </div>
      </nav>

      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">Lista de Produtos</h1>
          <button
            className="new-product-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Novo Produto
          </button>
        </div>

        {erro && <p className="home-error">{erro}</p>}

        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por ID ou Nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="products-list">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((p) => (
              <div key={p.id_produto} className="product-card">
                <h3>{p.nome}</h3>
                <p>{p.descricao}</p>

                <div className="product-info">
                  <span>Estoque atual: {p.estoque_atual}</span>
                  <span>Estoque mínimo: {p.estoque_minimo}</span>
                </div>

                <div className="product-actions">
                  <button className="edit-btn" onClick={() => abrirEdicao(p)}>
                    Editar
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(p.id_produto)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Novo Produto</h2>
            <form onSubmit={handleCreateProduct} className="modal-form">
              <input type="text" name="nome" placeholder="Nome" required />
              <textarea name="descricao" placeholder="Descrição" />
              <input
                type="number"
                name="estoque_minimo"
                placeholder="Estoque mínimo"
                required
              />
              <input
                type="number"
                name="estoque_atual"
                placeholder="Estoque atual"
                required
              />

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

      {showEditModal && produtoEdit && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Produto</h2>

            <form onSubmit={handleEditProduct} className="modal-form">
              <input
                type="text"
                name="nome"
                defaultValue={produtoEdit.nome}
                required
              />
              <textarea
                name="descricao"
                defaultValue={produtoEdit.descricao}
              />
              <input
                type="number"
                name="estoque_minimo"
                defaultValue={produtoEdit.estoque_minimo}
                required
              />
              <input
                type="number"
                name="estoque_atual"
                defaultValue={produtoEdit.estoque_atual}
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
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/Home"; 
import Movimentacoes from "./pages/Movimentacoes";

function App() {
  return (
    <Routes>
      {/* Rota de login */}
      <Route path="/" element={<Login />} />

      {/* Página protegida depois de logar */}
      <Route path="/Home" element={<Home />} />

      {/* Se quiser adicionar outras rotas futuramente */}
      {/* <Route path="/produtos" element={<Produtos />} /> */}
      <Route path="/movimentacoes" element={<Movimentacoes />} />
    </Routes>
  );
}

export default App;

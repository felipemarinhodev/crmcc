import Link from "next/link";
import type { Usuario } from "../lib/acesso";
import { sair } from "./actions";

type Area = "dashboard" | "funil" | "contatos" | "usuarios";

// Moldura das telas internas: cabeçalho em cima, navegação à esquerda
// e o conteúdo da área à direita. Usuários só aparece para o administrador.
export default function Moldura({
  usuario,
  atual,
  children,
}: {
  usuario: Usuario;
  atual: Area;
  children: React.ReactNode;
}) {
  const marcarAtual = (area: Area) => (area === atual ? ("page" as const) : undefined);

  return (
    <div className="sistema">
      <header className="topo">
        <span className="marca">Meu CRM</span>
        <div className="topo-usuario">
          <span className="dado topo-nome">{usuario.usuario}</span>
          <form action={sair}>
            <button type="submit" className="botao-secundario">
              Sair
            </button>
          </form>
        </div>
      </header>

      <nav aria-label="Áreas do CRM" className="navegacao">
        <ul>
          <li>
            <Link href="/" className="nav-item" aria-current={marcarAtual("dashboard")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/funil" className="nav-item" aria-current={marcarAtual("funil")}>
              Funil
            </Link>
          </li>
          <li>
            <Link href="/contatos" className="nav-item" aria-current={marcarAtual("contatos")}>
              Contatos
            </Link>
          </li>
          {usuario.papel === "admin" && (
            <li>
              <Link
                href="/usuarios"
                className="nav-item"
                aria-current={marcarAtual("usuarios")}
              >
                Usuários
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <main className="conteudo">{children}</main>
    </div>
  );
}

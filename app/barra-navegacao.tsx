import Link from "next/link";
import type { Usuario } from "../lib/acesso";
import { sair } from "./actions";

// Barra do topo das páginas internas. A página de usuários só aparece para o administrador.
export default function BarraNavegacao({
  usuario,
  atual,
}: {
  usuario: Usuario;
  atual: "painel" | "contatos" | "usuarios";
}) {
  const marcarAtual = (pagina: typeof atual) =>
    pagina === atual ? ("page" as const) : undefined;

  return (
    <header className="barra">
      <div className="barra-conteudo">
        <span className="marca">Meu CRM</span>
        <nav aria-label="Páginas do CRM" className="barra-links">
          <Link href="/" className="barra-link" aria-current={marcarAtual("painel")}>
            Painel
          </Link>
          <Link href="/contatos" className="barra-link" aria-current={marcarAtual("contatos")}>
            Contatos
          </Link>
          {usuario.papel === "admin" && (
            <Link
              href="/usuarios"
              className="barra-link"
              aria-current={marcarAtual("usuarios")}
            >
              Usuários
            </Link>
          )}
        </nav>
        <div className="barra-usuario">
          <span className="barra-nome">{usuario.usuario}</span>
          <form action={sair}>
            <button type="submit" className="link">
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

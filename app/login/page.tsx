import Link from "next/link";
import { redirect } from "next/navigation";
import { usuarioLogado } from "../../lib/acesso";
import FormularioLogin from "./formulario-login";

export default async function PaginaLogin() {
  // Quem já entrou não precisa ver o login de novo.
  if (await usuarioLogado()) redirect("/");

  return (
    <main className="pagina-login">
      <section className="cartao">
        <h1>Meu CRM</h1>
        <p className="apoio">Entre para acessar seus contatos.</p>
        <FormularioLogin />
        <p className="troca-tela">
          Ainda não tem cadastro?{" "}
          <Link href="/cadastro" className="link">
            Cadastre-se
          </Link>
        </p>
      </section>
    </main>
  );
}

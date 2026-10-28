import { redirect } from "next/navigation";
import { usuarioLogado } from "../../lib/acesso";
import FormularioCadastro from "./formulario-cadastro";

export default async function PaginaCadastro() {
  // Quem já entrou não precisa se cadastrar.
  if (await usuarioLogado()) redirect("/");

  return (
    <main className="pagina-login">
      <section className="cartao">
        <h1>Criar cadastro</h1>
        <p className="apoio">
          Depois de enviar, o administrador precisa aprovar seu acesso.
        </p>
        <FormularioCadastro />
      </section>
    </main>
  );
}

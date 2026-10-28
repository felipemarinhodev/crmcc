import { exigirLogin } from "../../lib/acesso";
import { supabase } from "../../lib/supabase";
import BarraNavegacao from "../barra-navegacao";
import FormularioContato from "../formulario-contato";
import LinhaContato, { type Anotacao } from "../linha-contato";

// Ex.: "26 de outubro de 2026 às 18:59", sempre no horário de Brasília.
const DATA_LEGIVEL = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export default async function PaginaContatos() {
  // Sem login, vai para a tela de login. Com login, busca os contatos e as
  // anotações no banco a cada visita, para tudo estar sempre atual.
  const usuario = await exigirLogin();
  const { data: contatos, error } = await supabase
    .from("contatos")
    .select("id, nome, email, telefone, etapa")
    .order("cadastrado_em", { ascending: false })
    .order("id", { ascending: false });

  const { data: todasAnotacoes, error: erroAnotacoes } = await supabase
    .from("anotacoes")
    .select("id, contato_id, texto, criado_em")
    .order("criado_em")
    .order("id");

  // Separa as anotações de cada contato, da mais antiga para a mais recente.
  function anotacoesDo(contatoId: number): Anotacao[] | null {
    if (erroAnotacoes) return null;
    return todasAnotacoes
      .filter((anotacao) => anotacao.contato_id === contatoId)
      .map((anotacao) => ({
        id: anotacao.id,
        texto: anotacao.texto,
        criadoEm: anotacao.criado_em,
        data: DATA_LEGIVEL.format(new Date(anotacao.criado_em)),
      }));
  }

  return (
    <>
      <BarraNavegacao usuario={usuario} atual="contatos" />
      <main className="pagina">
        <header className="cabecalho">
          <h1>Contatos</h1>
          <p className="apoio">
            Seus contatos e oportunidades de negócio em um só lugar.
          </p>
        </header>

        <section className="cartao">
          <h2>Novo contato</h2>
          <FormularioContato />
        </section>

        <section className="cartao">
          <h2>Todos os contatos</h2>
          {error ? (
            <p className="apoio">Não foi possível carregar os contatos.</p>
          ) : contatos.length === 0 ? (
            <p className="apoio">Nenhum contato cadastrado ainda.</p>
          ) : (
            <div className="tabela-rolagem">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Etapa</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {contatos.map((contato) => (
                    <LinhaContato
                      key={contato.id}
                      contato={contato}
                      anotacoes={anotacoesDo(contato.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

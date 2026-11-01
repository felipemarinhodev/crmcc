import Link from "next/link";
import { exigirLogin, type Usuario } from "../../../lib/acesso";
import { supabase } from "../../../lib/supabase";
import { tempoDesde } from "../../../lib/tempo";
import FormularioAnotacao from "../../formulario-anotacao";
import ItemAnotacao from "../../item-anotacao";
import Moldura from "../../moldura";
import SeletorEtapa from "../../seletor-etapa";
import SecaoFollowUps from "./secao-follow-ups";

// Ex.: "26 de outubro de 2026 às 18:59", sempre no horário de Brasília.
const DATA_LEGIVEL = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

// Transforma o que vem do banco no formato das telas, com a data legível.
const comData = (item: { id: number; texto: string; criado_em: string }) => ({
  id: item.id,
  texto: item.texto,
  criadoEm: item.criado_em,
  data: DATA_LEGIVEL.format(new Date(item.criado_em)),
});

export default async function PaginaContato({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Sem login, vai para a tela de login. Com login, busca o contato, as anotações
  // e os follow-ups no banco a cada visita, para tudo estar sempre atual.
  const usuario = await exigirLogin();
  const id = Number((await params).id);

  // Endereço com número inválido é tratado como contato que não existe.
  if (!Number.isInteger(id) || id <= 0) {
    return <ContatoInexistente usuario={usuario} />;
  }

  const [
    { data: contato, error },
    { data: anotacoes, error: erroAnotacoes },
    { data: followUps, error: erroFollowUps },
  ] = await Promise.all([
    supabase
      .from("contatos")
      .select("id, nome, email, telefone, etapa, cadastrado_em")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("anotacoes")
      .select("id, texto, criado_em")
      .eq("contato_id", id)
      .order("criado_em")
      .order("id"),
    supabase
      .from("follow_ups")
      .select("id, texto, criado_em")
      .eq("contato_id", id)
      .order("criado_em", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  if (error) {
    return (
      <Moldura usuario={usuario} atual="contatos">
        <section className="cartao">
          <p className="apoio">Não foi possível carregar o contato.</p>
        </section>
      </Moldura>
    );
  }

  if (!contato) {
    return <ContatoInexistente usuario={usuario} />;
  }

  return (
    <Moldura usuario={usuario} atual="contatos">
      <header className="cabecalho">
        <h1>{contato.nome}</h1>
      </header>

      <section className="cartao" aria-label="Dados do contato">
        <dl className="ficha">
          <div>
            <dt>Email</dt>
            <dd>{contato.email || <span className="vazio">—</span>}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd className="dado">{contato.telefone || <span className="vazio">—</span>}</dd>
          </div>
          <div>
            <dt>Etapa</dt>
            <dd>
              <SeletorEtapa contatoId={contato.id} nome={contato.nome} etapa={contato.etapa} />
            </dd>
          </div>
          <div>
            <dt>Cadastrado</dt>
            <dd className="dado">
              <time dateTime={contato.cadastrado_em}>{tempoDesde(contato.cadastrado_em)}</time>
            </dd>
          </div>
        </dl>
      </section>

      <div className="duas-colunas">
        <section className="cartao secao-anotacoes" aria-labelledby="titulo-anotacoes">
          <h2 id="titulo-anotacoes">Anotações</h2>
          {erroAnotacoes ? (
            <p className="apoio">Não foi possível carregar as anotações.</p>
          ) : anotacoes.length === 0 ? (
            <p className="apoio">Nenhuma anotação ainda.</p>
          ) : (
            <ul className="anotacoes">
              {anotacoes.map((anotacao) => (
                <ItemAnotacao key={anotacao.id} anotacao={comData(anotacao)} />
              ))}
            </ul>
          )}
          <FormularioAnotacao contatoId={contato.id} />
        </section>

        <SecaoFollowUps
          contatoId={contato.id}
          followUps={erroFollowUps ? null : followUps.map(comData)}
        />
      </div>
    </Moldura>
  );
}

// Aviso para contato que não existe mais, com o caminho de volta ao Funil.
function ContatoInexistente({ usuario }: { usuario: Usuario }) {
  return (
    <Moldura usuario={usuario} atual="contatos">
      <section className="cartao cartao-estreito">
        <h1>Contato não encontrado</h1>
        <p className="apoio">Este contato não existe mais.</p>
        <div className="acoes">
          <Link href="/funil" className="botao">
            Voltar ao Funil
          </Link>
        </div>
      </section>
    </Moldura>
  );
}

import { Suspense } from "react";
import { exigirLogin } from "../../lib/acesso";
import { ETAPAS } from "../../lib/etapas";
import { supabase } from "../../lib/supabase";
import { tempoDesde } from "../../lib/tempo";
import EtiquetaEtapa from "../etiqueta-etapa";
import Moldura from "../moldura";
import Kanban from "./kanban";
import NovoContato from "./novo-contato";

export default async function PaginaFunil() {
  // Sem login, vai para a tela de login. A moldura aparece logo;
  // o quadro mostra "Carregando..." até os contatos chegarem do banco.
  const usuario = await exigirLogin();

  return (
    <Moldura usuario={usuario} atual="funil">
      <header className="cabecalho cabecalho-com-acao">
        <div>
          <h1>Funil</h1>
          <p className="apoio">Arraste um cartão para mudar a etapa do contato.</p>
        </div>
        <NovoContato />
      </header>

      <Suspense fallback={<QuadroCarregando />}>
        <QuadroFunil />
      </Suspense>
    </Moldura>
  );
}

// Busca os contatos no banco a cada visita, para o quadro estar sempre atual.
async function QuadroFunil() {
  const { data: contatos, error } = await supabase
    .from("contatos")
    .select("id, nome, email, etapa, cadastrado_em")
    .order("cadastrado_em", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    return (
      <section className="cartao">
        <p className="apoio">Não foi possível carregar os contatos.</p>
      </section>
    );
  }

  return (
    <Kanban
      contatos={contatos.map((contato) => ({
        id: contato.id,
        nome: contato.nome,
        email: contato.email,
        etapa: contato.etapa,
        cadastradoEm: contato.cadastrado_em,
        // Ex.: "Cadastrado há 3 dias", "Cadastrado ontem".
        cadastradoHa: `Cadastrado ${tempoDesde(contato.cadastrado_em)}`,
      }))}
    />
  );
}

// As colunas vazias com "Carregando..." enquanto os contatos não chegam.
function QuadroCarregando() {
  return (
    <div className="kanban" role="status" aria-label="Carregando o funil">
      {ETAPAS.map((etapa) => (
        <section key={etapa} className="coluna">
          <header className="coluna-topo">
            <EtiquetaEtapa etapa={etapa} />
          </header>
          <p className="coluna-aviso carregando">Carregando...</p>
        </section>
      ))}
    </div>
  );
}

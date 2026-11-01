import Link from "next/link";
import { exigirLogin } from "../lib/acesso";
import { classeEtapa, ETAPAS, ROTULO_ETAPA } from "../lib/etapas";
import { supabase } from "../lib/supabase";
import { tempoDesde } from "../lib/tempo";
import AtualizacaoAutomatica from "./atualizacao-automatica";
import EtiquetaEtapa from "./etiqueta-etapa";
import Moldura from "./moldura";

export default async function Dashboard() {
  // Sem login, vai para a tela de login. Com login, busca os contatos no banco
  // a cada visita (e a cada atualização automática), para tudo estar sempre atual.
  const usuario = await exigirLogin();
  const { data: contatos, error } = await supabase
    .from("contatos")
    .select("id, nome, etapa, cadastrado_em")
    .order("cadastrado_em", { ascending: false })
    .order("id", { ascending: false });

  const quantosEm = (etapa: string) =>
    contatos?.filter((contato) => contato.etapa === etapa).length ?? 0;

  return (
    <Moldura usuario={usuario} atual="dashboard">
      <AtualizacaoAutomatica />

      <header className="cabecalho">
        <h1>Dashboard</h1>
        <p className="apoio">Seu funil de vendas em números.</p>
      </header>

      {error ? (
        <section className="cartao">
          <p className="apoio">Não foi possível carregar os números do funil.</p>
        </section>
      ) : (
        <>
          <section className="numeros-funil" aria-label="Números do funil">
            <div className="numero">
              <span className="numero-rotulo">Total de contatos</span>
              <strong className="numero-valor">{contatos.length}</strong>
            </div>
            {ETAPAS.map((etapa) => (
              <div key={etapa} className="numero">
                <EtiquetaEtapa etapa={etapa} />
                <strong className={`numero-valor ${classeEtapa(etapa)}`}>
                  {quantosEm(etapa)}
                </strong>
              </div>
            ))}
          </section>

          <div className="duas-colunas">
            <section className="cartao" aria-labelledby="titulo-distribuicao">
              <h2 id="titulo-distribuicao">Distribuição por etapa</h2>
              {contatos.length === 0 ? (
                <p className="apoio">Nenhum contato no funil ainda.</p>
              ) : (
                <GraficoEtapas quantosEm={quantosEm} total={contatos.length} />
              )}
            </section>

            <section className="cartao" aria-labelledby="titulo-recentes">
              <h2 id="titulo-recentes">Últimos contatos cadastrados</h2>
              {contatos.length === 0 ? (
                <p className="apoio">Nenhum contato cadastrado ainda.</p>
              ) : (
                <ul className="resultados">
                  {contatos.slice(0, 5).map((contato) => (
                    <li key={contato.id}>
                      <Link href={`/contatos/${contato.id}`} className="resultado">
                        <span className="resultado-texto">
                          <span className="resultado-nome">{contato.nome}</span>
                          <time className="resultado-tempo" dateTime={contato.cadastrado_em}>
                            Cadastrado {tempoDesde(contato.cadastrado_em)}
                          </time>
                        </span>
                        <EtiquetaEtapa etapa={contato.etapa} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </Moldura>
  );
}

// Barras horizontais, uma por etapa, na cor da etapa. A maior barra ocupa
// a largura toda; cada uma mostra a quantidade e a fatia do total.
function GraficoEtapas({
  quantosEm,
  total,
}: {
  quantosEm: (etapa: string) => number;
  total: number;
}) {
  const maior = Math.max(...ETAPAS.map(quantosEm));

  return (
    <ul className="grafico">
      {ETAPAS.map((etapa) => {
        const quantidade = quantosEm(etapa);
        const porcentagem = Math.round((quantidade / total) * 100);
        return (
          <li key={etapa} className="grafico-linha">
            <span className="grafico-rotulo">{ROTULO_ETAPA[etapa]}</span>
            <span className="grafico-trilho">
              <span
                className={`grafico-barra ${classeEtapa(etapa)}`}
                style={{ "--proporcao": quantidade / maior } as React.CSSProperties}
              />
              <span className="grafico-valor">
                {quantidade} · {porcentagem}%
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

import { exigirLogin } from "../lib/acesso";
import { classeEtapa, ETAPAS } from "../lib/etapas";
import { supabase } from "../lib/supabase";
import BarraNavegacao from "./barra-navegacao";
import EtiquetaEtapa from "./etiqueta-etapa";

export default async function Painel() {
  // Sem login, vai para a tela de login. Com login, conta os contatos
  // no banco a cada visita, para os números estarem sempre atuais.
  const usuario = await exigirLogin();
  const { data: contatos, error } = await supabase.from("contatos").select("etapa");

  const quantosEm = (etapa: string) =>
    contatos?.filter((contato) => contato.etapa === etapa).length ?? 0;

  return (
    <>
      <BarraNavegacao usuario={usuario} atual="painel" />
      <main className="pagina">
        <header className="cabecalho">
          <h1>Painel</h1>
          <p className="apoio">Seu funil de vendas em números.</p>
        </header>

        {error ? (
          <section className="cartao">
            <p className="apoio">Não foi possível carregar os números do funil.</p>
          </section>
        ) : (
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
        )}
      </main>
    </>
  );
}

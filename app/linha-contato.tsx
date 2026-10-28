"use client";

import { useState, useTransition } from "react";
import { gerarFollowUp, type ResultadoFollowUp } from "./actions";
import FormularioAnotacao from "./formulario-anotacao";
import ItemAnotacao from "./item-anotacao";
import PainelFollowUp from "./painel-follow-up";
import SeletorEtapa from "./seletor-etapa";

export type Anotacao = {
  id: number;
  texto: string;
  criadoEm: string;
  data: string;
};

type Props = {
  contato: {
    id: number;
    nome: string;
    email: string | null;
    telefone: string | null;
    etapa: string;
  };
  anotacoes: Anotacao[] | null;
};

// Uma linha da lista de contatos. Logo abaixo dela abrem o follow-up escrito
// pela IA e as anotações (histórico e linha para escrever uma nova).
export default function LinhaContato({ contato, anotacoes }: Props) {
  const [aberta, setAberta] = useState(false);
  const [followUp, setFollowUp] = useState<ResultadoFollowUp | null>(null);
  const [gerando, iniciarGeracao] = useTransition();

  const mostrarFollowUp = gerando || followUp !== null;
  const expandida = aberta || mostrarFollowUp;

  function aoGerarFollowUp() {
    iniciarGeracao(async () => {
      try {
        const resultado = await gerarFollowUp(contato.id);
        if (resultado) setFollowUp(resultado);
      } catch {
        setFollowUp({
          erro: "Não foi possível gerar o follow-up agora. Confira sua conexão e tente novamente.",
        });
      }
    });
  }

  return (
    <>
      <tr className={expandida ? "aberta" : undefined}>
        <td className="nome">{contato.nome}</td>
        <td>{contato.email || <span className="vazio">—</span>}</td>
        <td>{contato.telefone || <span className="vazio">—</span>}</td>
        <td>
          <SeletorEtapa contatoId={contato.id} nome={contato.nome} etapa={contato.etapa} />
        </td>
        <td className="celula-acoes">
          <div className="acoes-contato">
            <button
              type="button"
              className="link"
              onClick={aoGerarFollowUp}
              disabled={gerando}
            >
              Gerar follow-up
            </button>
            <button
              type="button"
              className="link"
              aria-expanded={aberta}
              onClick={() => setAberta(!aberta)}
            >
              {aberta ? "Ocultar anotações" : "Anotações"}
            </button>
          </div>
        </td>
      </tr>

      {expandida && (
        <tr className="linha-anotacoes">
          <td colSpan={5}>
            <div className="paineis-contato">
              {mostrarFollowUp && (
                <PainelFollowUp
                  gerando={gerando}
                  resultado={followUp}
                  aoFechar={() => setFollowUp(null)}
                />
              )}
              {aberta && (
                <div className="painel-anotacoes">
                  {anotacoes === null ? (
                    <p className="apoio">Não foi possível carregar as anotações.</p>
                  ) : anotacoes.length === 0 ? (
                    <p className="apoio">Nenhuma anotação ainda.</p>
                  ) : (
                    <ul className="anotacoes">
                      {anotacoes.map((anotacao) => (
                        <ItemAnotacao key={anotacao.id} anotacao={anotacao} />
                      ))}
                    </ul>
                  )}
                  <FormularioAnotacao contatoId={contato.id} />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import type { ResultadoFollowUp } from "./actions";

type Props = {
  gerando: boolean;
  resultado: ResultadoFollowUp | null;
  aoFechar: () => void;
};

// Plano B para navegadores que bloqueiam a cópia moderna:
// seleciona o texto numa caixa invisível e usa o comando antigo de copiar.
function copiarDoJeitoAntigo(texto: string): boolean {
  const caixa = document.createElement("textarea");
  caixa.value = texto;
  caixa.setAttribute("readonly", "");
  caixa.style.position = "fixed";
  caixa.style.opacity = "0";
  document.body.appendChild(caixa);
  caixa.select();
  const copiou = document.execCommand("copy");
  caixa.remove();
  return copiou;
}

// Mostra o follow-up escrito pela IA, pronto para copiar com um clique.
export default function PainelFollowUp({ gerando, resultado, aoFechar }: Props) {
  const [aviso, setAviso] = useState<"copiada" | "falhou" | null>(null);

  async function aoCopiar(texto: string) {
    let copiou: boolean;
    try {
      await navigator.clipboard.writeText(texto);
      copiou = true;
    } catch {
      copiou = copiarDoJeitoAntigo(texto);
    }

    if (copiou) {
      setAviso("copiada");
      setTimeout(() => setAviso(null), 2000);
    } else {
      setAviso("falhou");
    }
  }

  const texto = resultado && "texto" in resultado ? resultado.texto : null;
  const erro = resultado && "erro" in resultado ? resultado.erro : null;

  return (
    <section className="painel-follow-up" aria-label="Follow-up sugerido pela IA">
      <p className="rotulo-painel">Follow-up sugerido pela IA</p>

      {gerando ? (
        <p className="escrevendo" role="status">
          Escrevendo a mensagem...
        </p>
      ) : erro ? (
        <>
          <p className="erro" role="alert">
            {erro}
          </p>
          <div className="acoes-edicao">
            <button type="button" className="link" onClick={aoFechar}>
              Fechar
            </button>
          </div>
        </>
      ) : texto ? (
        <>
          <p className="mensagem-follow-up">{texto}</p>
          <div className="acoes-edicao">
            <button type="button" className="botao" onClick={() => aoCopiar(texto)}>
              {aviso === "copiada" ? "Mensagem copiada" : "Copiar mensagem"}
            </button>
            <button type="button" className="link" onClick={aoFechar}>
              Fechar
            </button>
          </div>
          {aviso === "falhou" && (
            <p className="erro aviso-copia" role="alert">
              Não foi possível copiar. Selecione o texto e copie manualmente.
            </p>
          )}
        </>
      ) : null}
    </section>
  );
}

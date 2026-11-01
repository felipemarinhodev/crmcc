"use client";

import { useState, useTransition } from "react";
import { gerarFollowUp } from "../../actions";

export type FollowUp = {
  id: number;
  texto: string;
  criadoEm: string;
  data: string;
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

// Copia a mensagem com um clique e avisa por 2 segundos que copiou.
function BotaoCopiar({ texto }: { texto: string }) {
  const [aviso, setAviso] = useState<"copiada" | "falhou" | null>(null);

  async function aoCopiar() {
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

  return (
    <>
      <button type="button" className="botao-secundario" onClick={aoCopiar}>
        {aviso === "copiada" ? "Mensagem copiada" : "Copiar mensagem"}
      </button>
      {aviso === "falhou" && (
        <p className="erro aviso-copia" role="alert">
          Não foi possível copiar. Selecione o texto e copie manualmente.
        </p>
      )}
    </>
  );
}

type Props = { contatoId: number; followUps: FollowUp[] | null };

// Follow-ups do contato: gera um novo com a IA (que já fica guardado no banco)
// e lista os gerados antes, do mais recente para o mais antigo.
export default function SecaoFollowUps({ contatoId, followUps }: Props) {
  const [erro, setErro] = useState<string | null>(null);
  const [gerando, iniciarGeracao] = useTransition();

  function aoGerar() {
    setErro(null);
    iniciarGeracao(async () => {
      try {
        const resultado = await gerarFollowUp(contatoId);
        setErro(resultado.erro);
      } catch {
        setErro(
          "Não foi possível gerar o follow-up agora. Confira sua conexão e tente novamente.",
        );
      }
    });
  }

  return (
    <section className="cartao" aria-labelledby="titulo-follow-ups">
      <div className="secao-topo">
        <h2 id="titulo-follow-ups">Follow-ups</h2>
        <button type="button" className="botao" onClick={aoGerar} disabled={gerando}>
          {gerando ? "Gerando..." : "Gerar follow-up com IA"}
        </button>
      </div>

      {gerando && (
        <p className="escrevendo aviso-secao" role="status">
          Escrevendo a mensagem...
        </p>
      )}
      {erro && (
        <p className="erro aviso-secao" role="alert">
          {erro}
        </p>
      )}

      {followUps === null ? (
        <p className="apoio">Não foi possível carregar os follow-ups.</p>
      ) : followUps.length === 0 ? (
        !gerando && <p className="apoio">Nenhum follow-up gerado ainda.</p>
      ) : (
        <ul className="follow-ups">
          {followUps.map((followUp) => (
            <li key={followUp.id} className="follow-up">
              <time dateTime={followUp.criadoEm}>{followUp.data}</time>
              <p className="mensagem-follow-up">{followUp.texto}</p>
              <div className="follow-up-acoes">
                <BotaoCopiar texto={followUp.texto} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

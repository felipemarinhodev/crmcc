"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { mudarEtapa } from "../actions";
import EtiquetaEtapa from "../etiqueta-etapa";
import { ETAPAS, ROTULO_ETAPA } from "../../lib/etapas";

export type CartaoContato = {
  id: number;
  nome: string;
  email: string | null;
  etapa: string;
  cadastradoEm: string;
  cadastradoHa: string;
};

// Quadro do funil: uma coluna por etapa. Arrastar um cartão para outra
// coluna muda a etapa na tela na hora e grava no banco logo em seguida.
export default function Kanban({ contatos }: { contatos: CartaoContato[] }) {
  // Enquanto o banco grava, o cartão já aparece na coluna nova.
  // Se der erro, ele volta sozinho para a coluna de antes.
  const [quadro, moverNaTela] = useOptimistic(
    contatos,
    (atual, mudanca: { id: number; etapa: string }) =>
      atual.map((contato) =>
        contato.id === mudanca.id ? { ...contato, etapa: mudanca.etapa } : contato,
      ),
  );
  const [, iniciarMudanca] = useTransition();
  const [arrastado, setArrastado] = useState<CartaoContato | null>(null);
  const [colunaAlvo, setColunaAlvo] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function terminarArraste() {
    setArrastado(null);
    setColunaAlvo(null);
  }

  function soltarEm(etapa: string) {
    const contato = arrastado;
    terminarArraste();
    if (!contato || contato.etapa === etapa) return;

    setErro(null);
    iniciarMudanca(async () => {
      moverNaTela({ id: contato.id, etapa });
      try {
        const resultado = await mudarEtapa(contato.id, etapa);
        if (resultado.erro) setErro(resultado.erro);
      } catch {
        setErro("Não foi possível mudar a etapa. Confira sua conexão e tente novamente.");
      }
    });
  }

  return (
    <>
      {erro && (
        <p className="erro" role="alert">
          {erro}
        </p>
      )}

      <div className="kanban">
        {ETAPAS.map((etapa) => {
          const daEtapa = quadro.filter((contato) => contato.etapa === etapa);

          return (
            <section
              key={etapa}
              aria-label={ROTULO_ETAPA[etapa]}
              className={colunaAlvo === etapa ? "coluna coluna-alvo" : "coluna"}
              onDragOver={(evento) => {
                // Só aceita o cartão se ele vier de outra coluna.
                if (!arrastado || arrastado.etapa === etapa) return;
                evento.preventDefault();
                evento.dataTransfer.dropEffect = "move";
                setColunaAlvo(etapa);
              }}
              onDragLeave={(evento) => {
                if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) {
                  setColunaAlvo(null);
                }
              }}
              onDrop={(evento) => {
                evento.preventDefault();
                soltarEm(etapa);
              }}
            >
              <header className="coluna-topo">
                <EtiquetaEtapa etapa={etapa} />
                <span className="coluna-contador">{daEtapa.length}</span>
              </header>

              {daEtapa.length === 0 ? (
                <p className="coluna-aviso">Nenhum contato nesta etapa.</p>
              ) : (
                <ul className="cartoes">
                  {daEtapa.map((contato) => (
                    <li
                      key={contato.id}
                      draggable
                      className={
                        arrastado?.id === contato.id
                          ? "cartao-contato arrastando"
                          : "cartao-contato"
                      }
                      onDragStart={(evento) => {
                        evento.dataTransfer.effectAllowed = "move";
                        evento.dataTransfer.setData("text/plain", contato.nome);
                        setArrastado(contato);
                      }}
                      onDragEnd={terminarArraste}
                    >
                      {/* O link não é arrastável sozinho: quem arrasta é o cartão inteiro. */}
                      <Link
                        href={`/contatos/${contato.id}`}
                        draggable={false}
                        className="cartao-link"
                      >
                        <span className="cartao-nome">{contato.nome}</span>
                        <span className="cartao-email">{contato.email || "Sem email"}</span>
                        <time className="cartao-tempo" dateTime={contato.cadastradoEm}>
                          {contato.cadastradoHa}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

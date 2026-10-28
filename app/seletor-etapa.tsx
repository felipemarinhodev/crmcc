"use client";

import { useState, useTransition } from "react";
import { mudarEtapa } from "./actions";
import { classeEtapa, ETAPAS, ROTULO_ETAPA } from "../lib/etapas";

type Props = { contatoId: number; nome: string; etapa: string };

// Etapa do contato como uma caixa de escolha com a cor da etapa.
// Muda na tela na hora e grava no banco logo em seguida.
export default function SeletorEtapa({ contatoId, nome, etapa: etapaSalva }: Props) {
  const [etapa, setEtapa] = useState(etapaSalva);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, iniciarSalvamento] = useTransition();

  function aoMudar(evento: React.ChangeEvent<HTMLSelectElement>) {
    const anterior = etapa;
    const nova = evento.currentTarget.value;
    setEtapa(nova);
    setErro(null);
    iniciarSalvamento(async () => {
      const resultado = await mudarEtapa(contatoId, nova);
      if (resultado?.erro) {
        setEtapa(anterior);
        setErro(resultado.erro);
      }
    });
  }

  return (
    <>
      <span className={`seletor-etapa ${classeEtapa(etapa)}`}>
        <select
          aria-label={`Etapa de ${nome}`}
          value={etapa}
          onChange={aoMudar}
          disabled={salvando}
        >
          {ETAPAS.map((opcao) => (
            <option key={opcao} value={opcao}>
              {ROTULO_ETAPA[opcao]}
            </option>
          ))}
        </select>
      </span>
      {erro && <p className="erro erro-etapa">{erro}</p>}
    </>
  );
}

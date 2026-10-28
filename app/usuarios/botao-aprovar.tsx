"use client";

import { useState, useTransition } from "react";
import { aprovarUsuario } from "../actions";

export default function BotaoAprovar({ id }: { id: number }) {
  const [erro, setErro] = useState<string | null>(null);
  const [aprovando, iniciarAprovacao] = useTransition();

  function aoAprovar() {
    iniciarAprovacao(async () => {
      const resultado = await aprovarUsuario(id);
      setErro(resultado.erro);
    });
  }

  return (
    <>
      <button type="button" className="link" onClick={aoAprovar} disabled={aprovando}>
        {aprovando ? "Aprovando..." : "Aprovar"}
      </button>
      <p className="erro" aria-live="polite">
        {erro}
      </p>
    </>
  );
}

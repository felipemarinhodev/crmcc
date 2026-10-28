"use client";

import { useActionState, useState } from "react";
import { salvarContato } from "./actions";
import { mascararTelefone, validarContato, type Campo } from "../lib/validacao";

export default function FormularioContato() {
  const [estado, acao, salvando] = useActionState(salvarContato, { erro: null });
  const [erroCampo, setErroCampo] = useState<{
    campo: Campo;
    erro: string;
  } | null>(null);

  // Confere os dados antes de sair do navegador,
  // assim o que já foi digitado não se perde quando algo está errado.
  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    const formulario = evento.currentTarget;
    const resultado = validarContato(new FormData(formulario));
    if ("erro" in resultado) {
      evento.preventDefault();
      setErroCampo({ campo: resultado.campo, erro: resultado.erro });
      (formulario.elements.namedItem(resultado.campo) as HTMLInputElement)?.focus();
      return;
    }
    setErroCampo(null);
  }

  const erro = erroCampo?.erro ?? estado.erro;
  const invalido = (campo: Campo) =>
    erroCampo?.campo === campo ? true : undefined;

  return (
    <form action={acao} onSubmit={aoEnviar} noValidate className="formulario">
      <div className="campos">
        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Ex.: Ana Souza"
            autoComplete="off"
            aria-invalid={invalido("nome")}
            aria-describedby={erro ? "erro-formulario" : undefined}
          />
        </div>
        <div className="campo">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={254}
            placeholder="Ex.: nome@empresa.com.br"
            autoComplete="off"
            aria-invalid={invalido("email")}
            aria-describedby={erro ? "erro-formulario" : undefined}
          />
        </div>
        <div className="campo">
          <label htmlFor="telefone">Telefone</label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="numeric"
            placeholder="Ex.: (11) 98765-4321"
            autoComplete="off"
            onChange={(evento) => {
              evento.currentTarget.value = mascararTelefone(evento.currentTarget.value);
            }}
            aria-invalid={invalido("telefone")}
            aria-describedby={erro ? "erro-formulario" : undefined}
          />
        </div>
      </div>

      <div className="acoes">
        <button type="submit" className="botao" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar contato"}
        </button>
        <p id="erro-formulario" className="erro" aria-live="polite">
          {erro}
        </p>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { salvarContato, type EstadoContato } from "./actions";
import { mascararTelefone, validarContato, type Campo } from "../lib/validacao";

// aoSalvar e aoCancelar são usados quando o formulário abre numa janela (no Funil).
type Props = { aoSalvar?: () => void; aoCancelar?: () => void };

export default function FormularioContato({ aoSalvar, aoCancelar }: Props) {
  const [estado, acao, salvando] = useActionState(
    async (estadoAnterior: EstadoContato, formData: FormData) => {
      const resultado = await salvarContato(estadoAnterior, formData);
      if (resultado.salvo) aoSalvar?.();
      return resultado;
    },
    { erro: null, salvo: false },
  );
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
  // A confirmação some ao tentar salvar de novo ou quando aparece um erro.
  const salvo = estado.salvo && !erroCampo && !salvando;

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
        {aoCancelar && (
          <button type="button" className="link" onClick={aoCancelar}>
            Cancelar
          </button>
        )}
        <p id="erro-formulario" className="erro" aria-live="polite">
          {erro}
        </p>
        <p className="aviso" aria-live="polite">
          {salvo && (
            <>
              Contato salvo.{" "}
              <Link href="/funil" className="link">
                Ver no Funil
              </Link>
            </>
          )}
        </p>
      </div>
    </form>
  );
}

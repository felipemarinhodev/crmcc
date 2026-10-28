"use client";

import { useActionState, useState } from "react";
import { salvarAnotacao } from "./actions";
import { validarAnotacao } from "../lib/validacao";

// Faz a caixa de texto crescer conforme o texto ganha mais linhas.
export function ajustarAltura(campo: HTMLTextAreaElement) {
  campo.style.height = "auto";
  const bordas = campo.offsetHeight - campo.clientHeight;
  campo.style.height = `${campo.scrollHeight + bordas}px`;
}

export default function FormularioAnotacao({ contatoId }: { contatoId: number }) {
  const [estado, acao, salvando] = useActionState(salvarAnotacao, { erro: null });
  const [erroTexto, setErroTexto] = useState<string | null>(null);
  const idErro = `erro-anotacao-${contatoId}`;

  // Confere antes de sair do navegador,
  // assim o que já foi digitado não se perde quando algo está errado.
  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    const formulario = evento.currentTarget;
    const resultado = validarAnotacao(new FormData(formulario));
    if ("erro" in resultado) {
      evento.preventDefault();
      setErroTexto(resultado.erro);
      (formulario.elements.namedItem("texto") as HTMLTextAreaElement)?.focus();
      return;
    }
    setErroTexto(null);
  }

  // Depois de salvar, o formulário é limpo: a caixa volta a ter uma linha.
  function aoLimpar(evento: React.FormEvent<HTMLFormElement>) {
    const campo = evento.currentTarget.elements.namedItem("texto") as HTMLTextAreaElement;
    campo.style.height = "";
  }

  const erro = erroTexto ?? estado.erro;

  return (
    <form
      action={acao}
      onSubmit={aoEnviar}
      onReset={aoLimpar}
      noValidate
      className="nova-anotacao"
    >
      <input type="hidden" name="contato_id" value={contatoId} />
      <div className="linha-nova-anotacao">
        <div className="campo">
          <textarea
            name="texto"
            rows={1}
            className="cresce"
            aria-label="Nova anotação"
            placeholder="Ex.: Liguei hoje e ela pediu um retorno na sexta."
            onInput={(evento) => ajustarAltura(evento.currentTarget)}
            aria-invalid={erroTexto ? true : undefined}
            aria-describedby={erro ? idErro : undefined}
          />
        </div>
        <button type="submit" className="botao" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
      <p id={idErro} className="erro" aria-live="polite">
        {erro}
      </p>
    </form>
  );
}

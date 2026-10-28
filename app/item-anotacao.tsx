"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { editarAnotacao, excluirAnotacao } from "./actions";
import { ajustarAltura } from "./formulario-anotacao";
import type { Anotacao } from "./linha-contato";
import { validarEdicaoAnotacao } from "../lib/validacao";

// Uma anotação do histórico, com os links Editar e Excluir.
export default function ItemAnotacao({ anotacao }: { anotacao: Anotacao }) {
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindo, iniciarExclusao] = useTransition();
  const caixa = useRef<HTMLTextAreaElement>(null);

  const [, acaoEditar, salvando] = useActionState(
    async (estadoAnterior: { erro: string | null }, formData: FormData) => {
      const resultado = await editarAnotacao(estadoAnterior, formData);
      if (resultado.erro) {
        setErro(resultado.erro);
      } else {
        setEditando(false);
      }
      return resultado;
    },
    { erro: null },
  );

  // Ao entrar na edição: caixa no tamanho do texto e cursor no fim.
  useEffect(() => {
    const campo = caixa.current;
    if (editando && campo) {
      ajustarAltura(campo);
      campo.focus();
      campo.setSelectionRange(campo.value.length, campo.value.length);
    }
  }, [editando]);

  // Confere antes de sair do navegador, assim o texto editado não se perde.
  function aoSalvar(evento: React.FormEvent<HTMLFormElement>) {
    const resultado = validarEdicaoAnotacao(new FormData(evento.currentTarget));
    if ("erro" in resultado) {
      evento.preventDefault();
      setErro(resultado.erro);
      caixa.current?.focus();
      return;
    }
    setErro(null);
  }

  function aoCancelar() {
    setEditando(false);
    setErro(null);
  }

  function aoExcluir() {
    if (!window.confirm("Excluir esta anotação? Essa ação não pode ser desfeita.")) {
      return;
    }
    iniciarExclusao(async () => {
      const resultado = await excluirAnotacao(anotacao.id);
      setErro(resultado.erro);
    });
  }

  const idErro = `erro-item-anotacao-${anotacao.id}`;

  return (
    <li className="anotacao">
      <div className="anotacao-topo">
        <time dateTime={anotacao.criadoEm}>{anotacao.data}</time>
        {!editando && (
          <div className="anotacao-acoes">
            <button
              type="button"
              className="link"
              onClick={() => setEditando(true)}
              disabled={excluindo}
            >
              Editar
            </button>
            <button
              type="button"
              className="link"
              onClick={aoExcluir}
              disabled={excluindo}
            >
              {excluindo ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        )}
      </div>

      {editando ? (
        <form action={acaoEditar} onSubmit={aoSalvar} noValidate className="edicao-anotacao">
          <input type="hidden" name="id" value={anotacao.id} />
          <div className="campo">
            <textarea
              ref={caixa}
              name="texto"
              rows={1}
              className="cresce"
              aria-label="Editar anotação"
              defaultValue={anotacao.texto}
              onInput={(evento) => ajustarAltura(evento.currentTarget)}
              aria-invalid={erro ? true : undefined}
              aria-describedby={erro ? idErro : undefined}
            />
          </div>
          <div className="acoes-edicao">
            <button type="submit" className="botao" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" className="link" onClick={aoCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <p>{anotacao.texto}</p>
      )}

      <p id={idErro} className="erro" aria-live="polite">
        {erro}
      </p>
    </li>
  );
}

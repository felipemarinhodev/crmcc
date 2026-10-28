"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { cadastrar } from "../actions";
import { validarCadastro, type CampoCadastro } from "../../lib/validacao";

export default function FormularioCadastro() {
  const [estado, acao, enviando] = useActionState(cadastrar, {
    erro: null,
    usuario: "",
    enviado: false,
  });
  const [erroCampo, setErroCampo] = useState<{
    campo: CampoCadastro;
    erro: string;
  } | null>(null);

  if (estado.enviado) {
    return (
      <div role="status">
        <p>
          <strong>Cadastro enviado.</strong> Assim que o administrador aprovar,
          você já pode entrar com o usuário <strong>{estado.usuario}</strong>.
        </p>
        <p className="troca-tela">
          <Link href="/login" className="link">
            Ir para o login
          </Link>
        </p>
      </div>
    );
  }

  // Confere os dados antes de sair do navegador,
  // assim o que já foi digitado não se perde quando algo está errado.
  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    const formulario = evento.currentTarget;
    const resultado = validarCadastro(new FormData(formulario));
    if ("erro" in resultado) {
      evento.preventDefault();
      setErroCampo({ campo: resultado.campo, erro: resultado.erro });
      (formulario.elements.namedItem(resultado.campo) as HTMLInputElement)?.focus();
      return;
    }
    setErroCampo(null);
  }

  const erro = erroCampo?.erro ?? estado.erro;
  const invalido = (campo: CampoCadastro) =>
    erroCampo?.campo === campo ? true : undefined;

  return (
    <>
      <form action={acao} onSubmit={aoEnviar} noValidate>
        <div className="campos">
          <div className="campo">
            <label htmlFor="usuario">Usuário</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              maxLength={30}
              placeholder="Ex.: ana.souza"
              autoComplete="username"
              autoCapitalize="none"
              defaultValue={estado.usuario}
              aria-invalid={invalido("usuario")}
              aria-describedby={erro ? "erro-cadastro" : undefined}
            />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              maxLength={128}
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              aria-invalid={invalido("senha")}
              aria-describedby={erro ? "erro-cadastro" : undefined}
            />
          </div>
          <div className="campo">
            <label htmlFor="confirmacao">Repita a senha</label>
            <input
              id="confirmacao"
              name="confirmacao"
              type="password"
              maxLength={128}
              placeholder="Digite a mesma senha"
              autoComplete="new-password"
              aria-invalid={invalido("confirmacao")}
              aria-describedby={erro ? "erro-cadastro" : undefined}
            />
          </div>
        </div>

        <div className="acoes">
          <button type="submit" className="botao" disabled={enviando}>
            {enviando ? "Enviando..." : "Criar cadastro"}
          </button>
          <p id="erro-cadastro" className="erro" aria-live="polite">
            {erro}
          </p>
        </div>
      </form>

      <p className="troca-tela">
        Já tem cadastro?{" "}
        <Link href="/login" className="link">
          Entrar
        </Link>
      </p>
    </>
  );
}

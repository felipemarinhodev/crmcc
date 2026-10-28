"use client";

import { useActionState } from "react";
import { entrar } from "../actions";

export default function FormularioLogin() {
  const [estado, acao, entrando] = useActionState(entrar, {
    erro: null,
    usuario: "",
  });

  return (
    <form action={acao}>
      <div className="campos">
        <div className="campo">
          <label htmlFor="usuario">Usuário</label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
            defaultValue={estado.usuario}
          />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
          />
        </div>
      </div>

      <div className="acoes">
        <button type="submit" className="botao" disabled={entrando}>
          {entrando ? "Entrando..." : "Entrar"}
        </button>
        <p className="erro" aria-live="polite">
          {estado.erro}
        </p>
      </div>
    </form>
  );
}

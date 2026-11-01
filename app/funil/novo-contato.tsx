"use client";

import { useRef, useState } from "react";
import FormularioContato from "../formulario-contato";

// Botão "Novo contato" do Funil: abre o cadastro numa janela por cima da tela.
// Ao salvar, a janela fecha e o contato novo aparece no quadro.
export default function NovoContato() {
  const janela = useRef<HTMLDialogElement>(null);
  // Muda a cada fechamento, para a janela abrir sempre com o formulário limpo.
  const [vez, setVez] = useState(0);

  const fechar = () => janela.current?.close();

  return (
    <>
      <button type="button" className="botao" onClick={() => janela.current?.showModal()}>
        Novo contato
      </button>
      <dialog
        ref={janela}
        className="janela"
        aria-labelledby="titulo-novo-contato"
        onClose={() => setVez((anterior) => anterior + 1)}
      >
        <h2 id="titulo-novo-contato">Novo contato</h2>
        <FormularioContato key={vez} aoSalvar={fechar} aoCancelar={fechar} />
      </dialog>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Busca os dados da tela de novo no servidor, sem recarregar a página:
// a cada 30 segundos e sempre que a aba volta a ficar visível.
// Assim, o que mudou em outra tela (ou por outro usuário) aparece sozinho.
export default function AtualizacaoAutomatica() {
  const router = useRouter();

  useEffect(() => {
    function atualizar() {
      if (document.visibilityState === "visible") router.refresh();
    }

    const relogio = setInterval(atualizar, 30_000);
    document.addEventListener("visibilitychange", atualizar);
    return () => {
      clearInterval(relogio);
      document.removeEventListener("visibilitychange", atualizar);
    };
  }, [router]);

  return null;
}

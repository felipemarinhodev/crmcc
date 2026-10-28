import { createHmac, timingSafeEqual } from "node:crypto";

export const NOME_COOKIE = "crm_sessao";

// Quanto tempo o login vale sem usar o CRM. Cada uso renova o prazo.
export const DURACAO_SESSAO = 7 * 24 * 60 * 60; // 7 dias, em segundos

export const OPCOES_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: DURACAO_SESSAO,
};

function assinar(texto: string): string {
  return createHmac("sha256", process.env.SESSAO_SEGREDO!)
    .update(texto)
    .digest("base64url");
}

// O "crachá" do login: quem é o usuário, até quando vale
// e uma assinatura que só o servidor sabe fazer.
export function criarToken(usuarioId: number): string {
  const conteudo = `${usuarioId}.${Date.now() + DURACAO_SESSAO * 1000}`;
  return `${conteudo}.${assinar(conteudo)}`;
}

// Devolve o número do usuário dono do crachá, ou null se ele for falso ou estiver vencido.
export function lerToken(token: string | undefined): number | null {
  if (!token || !process.env.SESSAO_SEGREDO) return null;

  const [usuarioId, expiraEm, assinatura] = token.split(".");
  if (!usuarioId || !expiraEm || !assinatura || Number(expiraEm) < Date.now()) return null;

  const esperada = Buffer.from(assinar(`${usuarioId}.${expiraEm}`));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida)) return null;

  return Number(usuarioId);
}

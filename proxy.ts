import { NextResponse, type NextRequest } from "next/server";
import { criarToken, lerToken, NOME_COOKIE, OPCOES_COOKIE } from "./lib/sessao";

// Telas que abrem sem login.
const TELAS_ABERTAS = ["/login", "/cadastro"];

// Porteiro: roda antes de abrir qualquer tela.
// Sem login, tudo vai para /login. Com login, cada uso renova o prazo da sessão.
// (Cada tela e cada ação também confere no banco se o usuário existe e está aprovado.)
export function proxy(request: NextRequest) {
  if (request.method !== "GET") return NextResponse.next();

  const usuarioId = lerToken(request.cookies.get(NOME_COOKIE)?.value);
  const telaAberta = TELAS_ABERTAS.includes(request.nextUrl.pathname);

  if (!usuarioId && !telaAberta) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const resposta = NextResponse.next();
  if (usuarioId) {
    resposta.cookies.set(NOME_COOKIE, criarToken(usuarioId), OPCOES_COOKIE);
  }
  return resposta;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

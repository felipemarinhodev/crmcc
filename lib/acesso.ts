import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lerToken, NOME_COOKIE } from "./sessao";
import { supabase } from "./supabase";

export type Usuario = { id: number; usuario: string; papel: "admin" | "usuario" };

// Quem está usando o CRM agora: o dono do crachá, se ele existir e estiver aprovado.
export async function usuarioLogado(): Promise<Usuario | null> {
  const loja = await cookies();
  const id = lerToken(loja.get(NOME_COOKIE)?.value);
  if (!id) return null;

  const { data } = await supabase
    .from("usuarios")
    .select("id, usuario, papel")
    .eq("id", id)
    .eq("situacao", "aprovado")
    .maybeSingle();
  return data;
}

// Garante o login antes de mostrar ou mexer em dados. Sem login, vai para a tela de login.
export async function exigirLogin(): Promise<Usuario> {
  const usuario = await usuarioLogado();
  if (!usuario) redirect("/login");
  return usuario;
}

// Garante que é o administrador. Os demais voltam para o painel.
export async function exigirAdmin(): Promise<Usuario> {
  const usuario = await exigirLogin();
  if (usuario.papel !== "admin") redirect("/");
  return usuario;
}

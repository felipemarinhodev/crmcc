"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { exigirAdmin, exigirLogin } from "../lib/acesso";
import { escreverFollowUp } from "../lib/ia";
import { ETAPAS } from "../lib/etapas";
import { conferirSenha, embaralharSenha } from "../lib/senha";
import { criarToken, NOME_COOKIE, OPCOES_COOKIE } from "../lib/sessao";
import { supabase } from "../lib/supabase";
import {
  validarAnotacao,
  validarCadastro,
  validarContato,
  validarEdicaoAnotacao,
} from "../lib/validacao";

export type EstadoFormulario = { erro: string | null };

// Roda no servidor: confere os dados, grava no banco e atualiza a página.
export async function salvarContato(
  _estadoAnterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  await exigirLogin();

  const resultado = validarContato(formData);
  if ("erro" in resultado) {
    return { erro: resultado.erro };
  }

  const { error } = await supabase.from("contatos").insert(resultado.dados);

  if (error) {
    return { erro: "Não foi possível salvar o contato. Tente novamente." };
  }

  refresh();
  return { erro: null };
}

// Roda no servidor: confere a anotação, grava no banco e atualiza a página do contato.
export async function salvarAnotacao(
  _estadoAnterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  await exigirLogin();

  const resultado = validarAnotacao(formData);
  if ("erro" in resultado) {
    return { erro: resultado.erro };
  }

  const { error } = await supabase.from("anotacoes").insert(resultado.dados);

  if (error) {
    return { erro: "Não foi possível salvar a anotação. Tente novamente." };
  }

  refresh();
  return { erro: null };
}

// Roda no servidor: confere o novo texto, atualiza a anotação no banco e a página.
export async function editarAnotacao(
  _estadoAnterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  await exigirLogin();

  const resultado = validarEdicaoAnotacao(formData);
  if ("erro" in resultado) {
    return { erro: resultado.erro };
  }

  const { error } = await supabase
    .from("anotacoes")
    .update({ texto: resultado.dados.texto })
    .eq("id", resultado.dados.id);

  if (error) {
    return { erro: "Não foi possível salvar a alteração. Tente novamente." };
  }

  refresh();
  return { erro: null };
}

// Roda no servidor: apaga a anotação do banco e atualiza a página.
export async function excluirAnotacao(id: number): Promise<EstadoFormulario> {
  await exigirLogin();

  if (!Number.isInteger(id) || id <= 0) {
    return { erro: "Anotação inválida." };
  }

  const { error } = await supabase.from("anotacoes").delete().eq("id", id);

  if (error) {
    return { erro: "Não foi possível excluir a anotação. Tente novamente." };
  }

  refresh();
  return { erro: null };
}

// Roda no servidor: muda a etapa do contato no funil e atualiza a página.
export async function mudarEtapa(contatoId: number, etapa: string): Promise<EstadoFormulario> {
  await exigirLogin();

  if (!Number.isInteger(contatoId) || contatoId <= 0 || !ETAPAS.includes(etapa)) {
    return { erro: "Etapa inválida." };
  }

  const { error } = await supabase.from("contatos").update({ etapa }).eq("id", contatoId);

  if (error) {
    return { erro: "Não foi possível mudar a etapa. Tente novamente." };
  }

  refresh();
  return { erro: null };
}

export type ResultadoFollowUp = { texto: string } | { erro: string };

// Roda no servidor: busca no banco o contato e as anotações dele e pede à IA
// uma mensagem de follow-up. A chave da API nunca sai do servidor.
export async function gerarFollowUp(contatoId: number): Promise<ResultadoFollowUp> {
  await exigirLogin();

  if (!Number.isInteger(contatoId) || contatoId <= 0) {
    return { erro: "Contato inválido." };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { erro: "A IA ainda não foi configurada." };
  }

  const { data: contato, error: erroContato } = await supabase
    .from("contatos")
    .select("nome, etapa")
    .eq("id", contatoId)
    .maybeSingle();

  const { data: anotacoes, error: erroAnotacoes } = await supabase
    .from("anotacoes")
    .select("texto, criado_em")
    .eq("contato_id", contatoId)
    .order("criado_em")
    .order("id");

  const texto =
    contato && !erroContato && !erroAnotacoes
      ? await escreverFollowUp({
          nome: contato.nome,
          etapa: contato.etapa,
          anotacoes: anotacoes.map((anotacao) => ({
            texto: anotacao.texto,
            criadoEm: anotacao.criado_em,
          })),
        })
      : null;

  if (!texto) {
    return { erro: "Não foi possível gerar o follow-up agora. Tente novamente em instantes." };
  }

  return { texto };
}

export type EstadoLogin = { erro: string | null; usuario: string };

// Roda no servidor: confere usuário e senha no banco e, se estiverem certos
// e o cadastro já tiver sido aprovado, entrega o "crachá" do login.
export async function entrar(
  _estadoAnterior: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const usuario = String(formData.get("usuario") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!process.env.SESSAO_SEGREDO) {
    return { erro: "O acesso ainda não foi configurado.", usuario };
  }

  // Usuário ou senha maiores que o permitido no cadastro nem chegam ao banco.
  if (usuario.length > 30 || senha.length > 128) {
    return { erro: "Usuário ou senha inválidos.", usuario };
  }

  const { data: conta, error } = await supabase
    .from("usuarios")
    .select("id, senha_hash, situacao")
    .eq("usuario", usuario)
    .maybeSingle();

  if (error) {
    return { erro: "Não foi possível entrar agora. Tente novamente.", usuario };
  }

  if (!conta || !conferirSenha(senha, conta.senha_hash)) {
    return { erro: "Usuário ou senha inválidos.", usuario };
  }

  if (conta.situacao !== "aprovado") {
    return {
      erro: "Seu cadastro ainda está aguardando a aprovação do administrador.",
      usuario,
    };
  }

  const loja = await cookies();
  loja.set(NOME_COOKIE, criarToken(conta.id), OPCOES_COOKIE);
  redirect("/");
}

export type EstadoCadastro = { erro: string | null; usuario: string; enviado: boolean };

// Roda no servidor: confere os dados e cria o usuário como pendente.
// Ele só consegue entrar depois que o administrador aprovar.
export async function cadastrar(
  _estadoAnterior: EstadoCadastro,
  formData: FormData,
): Promise<EstadoCadastro> {
  const usuario = String(formData.get("usuario") ?? "").trim();

  const resultado = validarCadastro(formData);
  if ("erro" in resultado) {
    return { erro: resultado.erro, usuario, enviado: false };
  }

  const { error } = await supabase.from("usuarios").insert({
    usuario: resultado.dados.usuario,
    senha_hash: embaralharSenha(resultado.dados.senha),
    papel: "usuario",
    situacao: "pendente",
  });

  // 23505 é o aviso do banco de que esse nome de usuário já existe.
  if (error?.code === "23505") {
    return { erro: "Esse usuário já existe. Escolha outro.", usuario, enviado: false };
  }

  if (error) {
    return { erro: "Não foi possível fazer o cadastro. Tente novamente.", usuario, enviado: false };
  }

  return { erro: null, usuario: resultado.dados.usuario, enviado: true };
}

// Roda no servidor: o administrador aprova um cadastro pendente e a página é atualizada.
export async function aprovarUsuario(id: number): Promise<EstadoFormulario> {
  await exigirAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    return { erro: "Usuário inválido." };
  }

  const { error } = await supabase
    .from("usuarios")
    .update({ situacao: "aprovado" })
    .eq("id", id)
    .eq("situacao", "pendente");

  if (error) {
    return { erro: "Não foi possível aprovar o cadastro. Tente novamente." };
  }

  refresh();
  return { erro: null };
}

// Roda no servidor: apaga o "crachá" do login e volta para a tela de login.
export async function sair() {
  const loja = await cookies();
  loja.delete(NOME_COOKIE);
  redirect("/login");
}

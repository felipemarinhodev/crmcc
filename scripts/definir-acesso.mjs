// Cria um administrador do CRM, ou troca a senha de um usuário e o torna administrador.
// A senha é digitada aqui (sem aparecer na tela) e só a versão embaralhada vai para o banco.
// Uso: npm run definir-acesso

import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { embaralharSenha } from "../lib/senha.ts";
import { supabase } from "../lib/supabase.ts";
import { FORMATO_USUARIO } from "../lib/validacao.ts";

const ARQUIVO = new URL("../.env.local", import.meta.url);

// Lê a senha sem mostrar o que é digitado.
function perguntarSenha(pergunta) {
  return new Promise((resolve) => {
    process.stdout.write(pergunta);
    let senha = "";
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    function aoDigitar(teclas) {
      for (const tecla of teclas) {
        if (tecla === "\r" || tecla === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.off("data", aoDigitar);
          process.stdout.write("\n");
          resolve(senha);
          return;
        }
        if (tecla === "\u0003") {
          process.stdout.write("\n");
          process.exit(1);
        }
        if (tecla === "\u007f" || tecla === "\b") {
          senha = senha.slice(0, -1);
          continue;
        }
        senha += tecla;
      }
    }

    process.stdin.on("data", aoDigitar);
  });
}

// Troca o valor da chave no arquivo, ou acrescenta a linha se ela ainda não existir.
function gravar(conteudo, chave, valor) {
  const linha = `${chave}=${valor}`;
  const regra = new RegExp(`^${chave}=.*$`, "m");
  return regra.test(conteudo)
    ? conteudo.replace(regra, linha)
    : `${conteudo.trimEnd()}\n${linha}\n`;
}

function parar(mensagem) {
  console.log(`\n${mensagem} Nada foi alterado.`);
  process.exit(1);
}

if (!process.stdin.isTTY) parar("Rode este comando direto no terminal.");

const leitor = createInterface({ input: process.stdin, output: process.stdout });
const usuario = (await leitor.question("Usuário: ")).trim().toLowerCase();
leitor.close();

if (!FORMATO_USUARIO.test(usuario)) {
  parar("O usuário precisa ter de 3 a 30 caracteres: letras sem acento, números, ponto, hífen ou sublinhado, sem espaços.");
}

const senha = await perguntarSenha("Senha (não aparece enquanto você digita): ");
if (senha.length < 8 || senha.length > 128) parar("A senha precisa ter de 8 a 128 caracteres.");

const confirmacao = await perguntarSenha("Repita a senha: ");
if (senha !== confirmacao) parar("As senhas não são iguais.");

const { error } = await supabase
  .from("usuarios")
  .upsert(
    { usuario, senha_hash: embaralharSenha(senha), papel: "admin", situacao: "aprovado" },
    { onConflict: "usuario" },
  );
if (error) parar(`Não foi possível gravar no banco (${error.message}).`);

let conteudo = existsSync(ARQUIVO) ? readFileSync(ARQUIVO, "utf8") : "";
if (!conteudo.includes("# Acesso ao CRM")) {
  conteudo = `${conteudo.trimEnd()}\n\n# Acesso ao CRM (gerado por: npm run definir-acesso)\n`;
}
// Segredo novo a cada troca: quem estava logado precisa entrar de novo.
conteudo = gravar(conteudo, "SESSAO_SEGREDO", randomBytes(32).toString("hex"));
writeFileSync(ARQUIVO, conteudo);

console.log(`\nPronto! ${usuario} é administrador e a senha foi gravada no banco (só na versão embaralhada).`);

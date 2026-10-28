// Regras dos formulários do CRM.
// Usadas no navegador (aviso na hora) e no servidor (conferência antes de gravar).

export type Campo = "nome" | "email" | "telefone";

export type DadosContato = {
  nome: string;
  email: string | null;
  telefone: string | null;
};

export type ResultadoValidacao =
  | { dados: DadosContato }
  | { campo: Campo; erro: string };

const FORMATO_EMAIL = /^[^\s@]+@([^\s@.]+\.)+[A-Za-z]{2,}$/;

// Tamanhos máximos, para ninguém gravar textos gigantes no banco.
const MAXIMO_NOME = 120;
const MAXIMO_ANOTACAO = 5000;
const ERRO_ANOTACAO_LONGA = "A anotação pode ter no máximo 5.000 caracteres.";

// Aceita telefone brasileiro com DDD, com ou sem pontuação e com ou sem +55.
// Devolve no padrão (11) 98765-4321 (celular) ou (11) 3456-7890 (fixo).
// Devolve null se não for um telefone brasileiro válido.
export function formatarTelefone(texto: string): string | null {
  if (!/^[\d\s()+.-]+$/.test(texto)) return null;

  let numeros = texto.replace(/\D/g, "");
  if (
    (numeros.length === 12 || numeros.length === 13) &&
    numeros.startsWith("55")
  ) {
    numeros = numeros.slice(2);
  }

  const celular = /^([1-9]{2})(9\d{4})(\d{4})$/.exec(numeros);
  const fixo = /^([1-9]{2})([2-5]\d{3})(\d{4})$/.exec(numeros);
  const partes = celular ?? fixo;
  if (!partes) return null;

  return `(${partes[1]}) ${partes[2]}-${partes[3]}`;
}

// Máscara do campo de telefone enquanto a pessoa digita:
// descarta tudo que não é número, para em 11 dígitos e pontua no padrão brasileiro.
export function mascararTelefone(texto: string): string {
  const numeros = texto.replace(/\D/g, "").slice(0, 11);
  if (numeros.length === 0) return "";
  if (numeros.length <= 2) return `(${numeros}`;

  const ddd = numeros.slice(0, 2);
  const resto = numeros.slice(2);
  if (resto.length <= 4) return `(${ddd}) ${resto}`;

  const meio = resto.length === 9 ? 5 : 4;
  return `(${ddd}) ${resto.slice(0, meio)}-${resto.slice(meio)}`;
}

export function validarContato(formData: FormData): ResultadoValidacao {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();

  if (!nome) {
    return {
      campo: "nome",
      erro: "Informe o nome do contato para salvar.",
    };
  }

  if (nome.length > MAXIMO_NOME) {
    return {
      campo: "nome",
      erro: "O nome pode ter no máximo 120 caracteres.",
    };
  }

  if (email && (email.length > 254 || !FORMATO_EMAIL.test(email))) {
    return {
      campo: "email",
      erro: "Informe um email válido, como nome@empresa.com.br.",
    };
  }

  const telefoneFormatado = telefone ? formatarTelefone(telefone) : null;
  if (telefone && !telefoneFormatado) {
    return {
      campo: "telefone",
      erro: "Informe um telefone brasileiro com DDD, como (11) 98765-4321.",
    };
  }

  return { dados: { nome, email: email || null, telefone: telefoneFormatado } };
}

export type ResultadoAnotacao =
  | { dados: { contato_id: number; texto: string } }
  | { erro: string };

export function validarAnotacao(formData: FormData): ResultadoAnotacao {
  const contatoId = Number(formData.get("contato_id"));
  const texto = String(formData.get("texto") ?? "").trim();

  if (!Number.isInteger(contatoId) || contatoId <= 0) {
    return { erro: "Contato inválido." };
  }

  if (!texto) {
    return { erro: "Escreva a anotação antes de salvar." };
  }

  if (texto.length > MAXIMO_ANOTACAO) {
    return { erro: ERRO_ANOTACAO_LONGA };
  }

  return { dados: { contato_id: contatoId, texto } };
}

export type ResultadoEdicaoAnotacao =
  | { dados: { id: number; texto: string } }
  | { erro: string };

export function validarEdicaoAnotacao(formData: FormData): ResultadoEdicaoAnotacao {
  const id = Number(formData.get("id"));
  const texto = String(formData.get("texto") ?? "").trim();

  if (!Number.isInteger(id) || id <= 0) {
    return { erro: "Anotação inválida." };
  }

  if (!texto) {
    return { erro: "Escreva a anotação antes de salvar." };
  }

  if (texto.length > MAXIMO_ANOTACAO) {
    return { erro: ERRO_ANOTACAO_LONGA };
  }

  return { dados: { id, texto } };
}

export type CampoCadastro = "usuario" | "senha" | "confirmacao";

export type ResultadoCadastro =
  | { dados: { usuario: string; senha: string } }
  | { campo: CampoCadastro; erro: string };

// Usuário sempre em minúsculas, para "Ana" e "ana" serem a mesma pessoa.
export const FORMATO_USUARIO = /^[a-z0-9._-]{3,30}$/;

export function validarCadastro(formData: FormData): ResultadoCadastro {
  const usuario = String(formData.get("usuario") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (!FORMATO_USUARIO.test(usuario)) {
    return {
      campo: "usuario",
      erro: "O usuário precisa ter de 3 a 30 caracteres: letras sem acento, números, ponto, hífen ou sublinhado, sem espaços.",
    };
  }

  if (senha.length < 8 || senha.length > 128) {
    return { campo: "senha", erro: "A senha precisa ter de 8 a 128 caracteres." };
  }

  if (senha !== confirmacao) {
    return { campo: "confirmacao", erro: "As senhas não são iguais. Digite a mesma senha nos dois campos." };
  }

  return { dados: { usuario, senha } };
}

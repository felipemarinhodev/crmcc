import Anthropic from "@anthropic-ai/sdk";

// Roda só no servidor: é aqui que a chave da API é usada.

const MODELO = "claude-sonnet-4-6";

// Instruções fixas para a IA: o tom e o que ela nunca deve fazer.
const INSTRUCOES = `Você escreve mensagens de follow-up para um pequeno negócio que acompanha seus contatos em um CRM.

Regras:
- Escreva em português do Brasil, com tom profissional, caloroso e direto.
- Mensagem curta, de 2 a 4 frases, pronta para enviar por WhatsApp ou e-mail.
- Chame o contato pelo primeiro nome e soe como uma pessoa, não como propaganda.
- Use só os fatos das anotações. Quem envia é uma pessoa real, que não pode afirmar nem prometer o que não aconteceu: não invente datas, valores, produtos, nomes ou combinados.
- Se o contato pediu algo e as anotações não dizem em que pé isso está, fale do pedido sem dizer o andamento (nada de "preparei", "já tenho" ou "consegui avançar") e proponha o próximo passo.
- Você não sabe o nome de quem vai enviar a mensagem nem do negócio: não se apresente pelo nome e não cite empresa ou equipe.
- Sem anotações, escreva um primeiro contato simples, sem supor como vocês se conheceram.
- Termine com um próximo passo claro e fácil de responder.
- Responda só com o texto da mensagem: sem assunto, sem aspas, sem assinatura, sem comentários e sem campos para preencher, como [seu nome].`;

// O que a mensagem busca em cada etapa do funil.
const OBJETIVO_DA_ETAPA: Record<string, string> = {
  novo: "é um contato novo; abra a conversa de forma leve e convide para um primeiro papo.",
  "em contato": "a conversa já começou; retome o último assunto e proponha um próximo passo.",
  proposta: "uma proposta foi enviada; pergunte o que achou e ofereça ajuda com dúvidas.",
  cliente: "já é cliente; cuide do relacionamento e pergunte se precisa de algo.",
};

// Ex.: "26 de outubro de 2026", sempre no horário de Brasília.
const DATA_LEGIVEL = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "America/Sao_Paulo",
});

export type DadosFollowUp = {
  nome: string;
  etapa: string;
  anotacoes: { texto: string; criadoEm: string }[];
};

function montarPedido({ nome, etapa, anotacoes }: DadosFollowUp): string {
  const historico =
    anotacoes.length === 0
      ? "Ainda não há anotações sobre este contato."
      : "Anotações, da mais antiga para a mais recente:\n" +
        anotacoes
          .map((anotacao) => `- ${DATA_LEGIVEL.format(new Date(anotacao.criadoEm))}: ${anotacao.texto}`)
          .join("\n");

  return [
    `Hoje é ${DATA_LEGIVEL.format(new Date())}.`,
    `Contato: ${nome}`,
    `Etapa do funil: ${etapa} (${OBJETIVO_DA_ETAPA[etapa] ?? "acompanhe o contato."})`,
    historico,
    "Escreva a mensagem de follow-up.",
  ].join("\n\n");
}

// Pede à IA uma mensagem de follow-up. Devolve null se algo der errado;
// o motivo técnico fica só no terminal do servidor, nunca na tela.
export async function escreverFollowUp(dados: DadosFollowUp): Promise<string | null> {
  try {
    const cliente = new Anthropic({ timeout: 30_000 });
    const resposta = await cliente.messages.create({
      model: MODELO,
      max_tokens: 1024,
      system: INSTRUCOES,
      messages: [{ role: "user", content: montarPedido(dados) }],
    });

    if (resposta.stop_reason !== "end_turn") {
      console.error(`Follow-up: a IA parou antes de terminar (${resposta.stop_reason}).`);
      return null;
    }

    const texto = resposta.content
      .map((bloco) => (bloco.type === "text" ? bloco.text : ""))
      .join("")
      .trim();
    return texto || null;
  } catch (erro) {
    if (erro instanceof Anthropic.AuthenticationError) {
      console.error("Follow-up: a chave da API não foi aceita. Confira ANTHROPIC_API_KEY no .env.local.");
    } else if (erro instanceof Anthropic.RateLimitError) {
      console.error("Follow-up: limite de uso da API atingido. Tente de novo em instantes.");
    } else if (erro instanceof Anthropic.APIError) {
      console.error(`Follow-up: erro da API (${erro.status}): ${erro.message}`);
    } else {
      console.error("Follow-up: falha ao falar com a API.", erro);
    }
    return null;
  }
}

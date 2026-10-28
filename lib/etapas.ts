// As etapas do funil, na ordem em que o contato avança.
export const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

export const ROTULO_ETAPA: Record<string, string> = {
  novo: "Novo",
  "em contato": "Em contato",
  proposta: "Proposta",
  cliente: "Cliente",
};

// Classe com a cor da etapa, ex.: "etapa-em-contato".
export function classeEtapa(etapa: string): string {
  return `etapa-${etapa.replace(" ", "-")}`;
}

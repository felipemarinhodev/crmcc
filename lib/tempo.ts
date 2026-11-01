const TEMPO_RELATIVO = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

const UNIDADES = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
] as const;

// Há quanto tempo foi uma data. Ex.: "há 3 dias", "ontem", "agora".
export function tempoDesde(data: string): string {
  const segundos = (new Date(data).getTime() - Date.now()) / 1000;
  for (const [unidade, tamanho] of UNIDADES) {
    if (Math.abs(segundos) >= tamanho) {
      return TEMPO_RELATIVO.format(Math.trunc(segundos / tamanho), unidade);
    }
  }
  return "agora";
}

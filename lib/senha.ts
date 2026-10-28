import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// A senha nunca é guardada como texto: guardamos só a versão embaralhada (scrypt),
// no formato scrypt:<sal>:<resultado>. Não dá para desembaralhar, só conferir.

export function embaralharSenha(senha: string): string {
  const sal = randomBytes(16).toString("hex");
  const resultado = scryptSync(senha, sal, 64).toString("hex");
  return `scrypt:${sal}:${resultado}`;
}

// Embaralha a senha digitada do mesmo jeito e compara com a guardada.
export function conferirSenha(senha: string, guardada: string): boolean {
  const [tipo, sal, resultado] = guardada.split(":");
  if (tipo !== "scrypt" || !sal || !resultado) return false;

  const esperado = Buffer.from(resultado, "hex");
  if (esperado.length !== 64) return false;

  const calculado = scryptSync(senha, sal, 64);
  return timingSafeEqual(calculado, esperado);
}

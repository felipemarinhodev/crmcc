import { classeEtapa, ROTULO_ETAPA } from "../lib/etapas";

// Etiqueta colorida da etapa do funil, usada no painel.
export default function EtiquetaEtapa({ etapa }: { etapa: string }) {
  return (
    <span className={`etiqueta ${classeEtapa(etapa)}`}>
      {ROTULO_ETAPA[etapa] ?? etapa}
    </span>
  );
}

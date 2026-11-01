import Form from "next/form";
import Link from "next/link";
import { exigirLogin } from "../../lib/acesso";
import { supabase } from "../../lib/supabase";
import EtiquetaEtapa from "../etiqueta-etapa";
import FormularioContato from "../formulario-contato";
import Moldura from "../moldura";

// Nome tem até 120 caracteres e email até 254: 254 cobre qualquer busca útil.
const MAXIMO_BUSCA = 254;

// Busca por parte do nome ou do email, sem diferenciar maiúsculas de minúsculas.
// O termo vai entre aspas para a busca aceitar pontos, vírgulas e parênteses.
async function buscarContatos(termo: string) {
  const { data, error } = await supabase
    .from("contatos")
    .select("id, nome, email, etapa")
    .or(`nome.ilike."%${termo}%",email.ilike."%${termo}%"`)
    .order("nome")
    .limit(20);
  return error ? null : data;
}

export default async function PaginaContatos({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string | string[] }>;
}) {
  // Sem login, vai para a tela de login.
  const usuario = await exigirLogin();
  const { busca } = await searchParams;
  // Tira os caracteres que têm significado especial na busca do banco
  // e limita o tamanho do termo, como nos outros campos do CRM.
  const termo = (typeof busca === "string" ? busca : "")
    .replace(/[%*"\\]/g, " ")
    .trim()
    .slice(0, MAXIMO_BUSCA);
  const resultados = termo ? await buscarContatos(termo) : undefined;

  return (
    <Moldura usuario={usuario} atual="contatos">
      <header className="cabecalho">
        <h1>Contatos</h1>
        <p className="apoio">Busque um contato para abrir a página dele, ou cadastre um novo.</p>
      </header>

      <section className="cartao cartao-estreito" aria-labelledby="titulo-busca">
        <h2 id="titulo-busca">Buscar contato</h2>
        <Form action="/contatos" className="linha-busca">
          <div className="campo">
            <label htmlFor="busca">Nome ou email</label>
            <input
              id="busca"
              name="busca"
              type="search"
              maxLength={MAXIMO_BUSCA}
              placeholder="Ex.: Ana ou ana@empresa.com.br"
              autoComplete="off"
              defaultValue={termo}
            />
          </div>
          <button type="submit" className="botao">
            Buscar
          </button>
        </Form>

        {resultados === null ? (
          <p className="erro resultado-busca">Não foi possível buscar agora. Tente novamente.</p>
        ) : resultados?.length === 0 ? (
          <p className="apoio resultado-busca">Nenhum contato encontrado.</p>
        ) : resultados ? (
          <ul className="resultados">
            {resultados.map((contato) => (
              <li key={contato.id}>
                <Link href={`/contatos/${contato.id}`} className="resultado">
                  <span className="resultado-texto">
                    <span className="resultado-nome">{contato.nome}</span>
                    <span className="resultado-email">{contato.email || "Sem email"}</span>
                  </span>
                  <EtiquetaEtapa etapa={contato.etapa} />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="cartao cartao-estreito">
        <h2>Novo contato</h2>
        <FormularioContato />
      </section>
    </Moldura>
  );
}

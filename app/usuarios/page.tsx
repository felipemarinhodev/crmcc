import { exigirAdmin } from "../../lib/acesso";
import { supabase } from "../../lib/supabase";
import Moldura from "../moldura";
import BotaoAprovar from "./botao-aprovar";

// Ex.: "26 de outubro de 2026", sempre no horário de Brasília.
const DATA_LEGIVEL = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "America/Sao_Paulo",
});

const ROTULO_PAPEL = { admin: "Administrador", usuario: "Usuário" };

export default async function PaginaUsuarios() {
  // Só o administrador vê esta página. Os demais voltam para o painel.
  const admin = await exigirAdmin();
  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select("id, usuario, papel, situacao, criado_em")
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false });

  const pendentes = usuarios?.filter((usuario) => usuario.situacao === "pendente") ?? [];
  const aprovados = usuarios?.filter((usuario) => usuario.situacao === "aprovado") ?? [];

  return (
    <Moldura usuario={admin} atual="usuarios">
      <header className="cabecalho">
        <h1>Usuários</h1>
        <p className="apoio">Aprove os novos cadastros e veja quem tem acesso ao CRM.</p>
      </header>

      {error ? (
        <section className="cartao">
          <p className="apoio">Não foi possível carregar os usuários.</p>
        </section>
      ) : (
        <>
          <section className="cartao">
            <h2>Aguardando aprovação</h2>
            {pendentes.length === 0 ? (
              <p className="apoio">Nenhum cadastro aguardando aprovação.</p>
            ) : (
              <div className="tabela-rolagem">
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Cadastrado em</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendentes.map((usuario) => (
                      <tr key={usuario.id}>
                        <td className="nome">{usuario.usuario}</td>
                        <td className="dado">{DATA_LEGIVEL.format(new Date(usuario.criado_em))}</td>
                        <td>
                          <BotaoAprovar id={usuario.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="cartao">
            <h2>Usuários aprovados</h2>
            <div className="tabela-rolagem">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Papel</th>
                    <th>Cadastrado em</th>
                  </tr>
                </thead>
                <tbody>
                  {aprovados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="nome">{usuario.usuario}</td>
                      <td>{ROTULO_PAPEL[usuario.papel]}</td>
                      <td className="dado">{DATA_LEGIVEL.format(new Date(usuario.criado_em))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </Moldura>
  );
}

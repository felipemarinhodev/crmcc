# PRD — CRM

## O que é e pra quem

Um sistema web simples para organizar contatos e acompanhar oportunidades de negócio, do primeiro contato até virar cliente.
É feito para quem trabalha sozinho ou tem um negócio pequeno e hoje controla isso em planilhas, papéis soltos ou de cabeça.
Com ele, fica claro em que etapa cada oportunidade está, o que já foi conversado e quem precisa de um retorno.

## Funcionalidades da primeira versão

- [x] **Cadastro e listagem de contatos**: criar e ver todos os contatos em uma lista.
- [ ] **Edição de contatos**: corrigir nome, email e telefone de um contato já cadastrado (hoje só a etapa pode ser trocada).
- [x] **Funil com etapas**: cada contato fica em uma etapa: novo, em contato, proposta ou cliente.
- [x] **Anotações por contato**: registrar o que foi conversado com cada pessoa.
- [x] **Follow-up gerado por IA**: a IA sugere uma mensagem de retorno com base nas anotações do contato.
- [x] **Painel com os números do funil**: quantos contatos há em cada etapa.
- [x] **Publicação na internet**: o sistema no ar, acessível por um endereço na web.

## Entregue fora do plano original

- [x] **Multiusuário**: cada pessoa faz o próprio cadastro, o administrador aprova na tela de Usuários e só quem foi aprovado entra; há dois papéis, administrador (aprova cadastros) e usuário (usa o CRM).

## O que NÃO entra na primeira versão

- Equipes, contatos separados por usuário ou níveis de permissão além de administrador e usuário.
- Envio automático de mensagens: a IA só sugere o texto, quem envia é você.
- Integração com e-mail, WhatsApp, agenda ou redes sociais.
- Importar ou exportar planilhas.
- Aplicativo de celular (o sistema funciona no navegador).
- Lembretes, notificações ou automações.
- Relatórios avançados e gráficos além dos números do funil.
- Cobrança, pagamentos ou emissão de notas.

## Versão 2

- [x] **Kanban do funil**: ver e mover os contatos entre as etapas arrastando.

  Pronto quando:
  - [ ] Abro o Funil e vejo quatro colunas (Novo, Em contato, Proposta e Cliente), cada contato num cartão na coluna da sua etapa e a quantidade de contatos no topo de cada coluna.
  - [ ] Arrasto um cartão para outra coluna, solto, e ele fica lá; a quantidade das duas colunas muda na hora.
  - [ ] Recarrego a página e o contato continua na coluna para onde eu o movi.
  - [ ] Abro o Dashboard e o número da etapa de origem diminuiu e o da etapa de destino aumentou.
  - [ ] Solto um cartão fora de qualquer coluna e ele volta para onde estava, sem mudar a etapa.

- [x] **Página do contato**: tudo de um contato num lugar só (dados, etapa, anotações, follow-ups gerados), com uma busca pra chegar nela rápido.

  Pronto quando:
  - [ ] Clico num cartão do Kanban e abro a página daquele contato, com nome, email, telefone e etapa.
  - [ ] Na página do contato, troco a etapa e, ao voltar ao Kanban, o cartão está na coluna nova.
  - [ ] As anotações do contato aparecem na página, e consigo criar, editar e excluir uma anotação sem sair dela.
  - [ ] Gero um follow-up na página, recarrego, e ele continua lá, junto com os gerados antes, do mais recente para o mais antigo.
  - [ ] Na área de Contatos, busco por parte do nome ou do email e chego à página do contato; um nome que não existe mostra "Nenhum contato encontrado".

- [x] **Dashboard v2**: os números do funil apresentados como painel de sistema, com um gráfico simples da distribuição por etapa.

  Pronto quando:
  - [ ] Abro o Dashboard e vejo o total de contatos e a quantidade em cada etapa em cartões de painel.
  - [ ] Vejo um gráfico de barras com uma barra por etapa, cada uma na cor da etapa e com tamanho proporcional à quantidade de contatos.
  - [ ] Cada barra mostra a quantidade de contatos e quanto ela representa do total, em porcentagem.
  - [ ] Movo um contato de etapa no Kanban, volto ao Dashboard, e os números e o gráfico já mostram a mudança.
  - [ ] Com a janela estreita (tamanho de celular), os cartões e o gráfico se reorganizam e continuam legíveis, sem rolagem para o lado.

## Fora da v2 (fica pra v3)

- Permissões avançadas: dono por contato, metas por usuário.
- Automações e lembretes agendados.
- Integrações com outros sistemas.
- Aplicativo de celular.

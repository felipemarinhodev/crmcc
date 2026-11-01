# Identidade visual do CRM · v2 Dark Tech

Estas regras valem para **todas** as telas do sistema, incluindo login, cadastro e usuários.

## Clima

Ferramenta técnica e precisa, escura, de quem trabalha à noite.
Um produto profissional, não um template.

## Cores

| Uso | Cor |
| --- | --- |
| Fundo da página (quase-preto azulado) | `#0D1117` |
| Superfícies (cartões, cabeçalho, navegação) | `#151B24` |
| Superfícies elevadas (modais, menus) | `#1B222E` |
| Bordas visíveis | `#262F3D` |
| Texto principal (claro) | `#E6EAF2` |
| Texto de apoio (cinza-azulado) | `#94A3B8` |
| Destaque: ações e elementos ativos (azul elétrico) | `#4D8DFF` |
| Destaque no hover (mais claro) | `#6BA1FF` |
| Texto sobre o destaque (botões) | `#0D1117` |
| Erros | `#FB7171` |

O azul elétrico é a **única** cor de destaque. Nenhuma outra cor de marca.

Contraste sempre confortável: todo texto tem pelo menos 4,5:1 sobre o fundo em que está.
Por isso o texto dos botões azuis é escuro (`#0D1117`), não branco.

### Etapas do funil

Versões luminosas, legíveis no escuro. Usadas **só** nas etiquetas de etapa e nos números de cada etapa no Dashboard.

| Etapa | Cor |
| --- | --- |
| Novo | `#8B99AD` |
| Em contato | `#F5A524` |
| Proposta | `#A78BFA` |
| Cliente | `#34D399` |

## Tipografia

- **Manrope** (Google Fonts) em todo o texto.
- **JetBrains Mono** (Google Fonts) é o toque tech, usado só em:
  - números e contadores (os valores do Dashboard);
  - etiquetas de etapa;
  - rótulos técnicos: cabeçalhos de tabela e rótulos pequenos acima de números e painéis;
  - dados técnicos: telefone, datas e horas, nome do usuário logado.
- Rótulos técnicos: 12px, maiúsculas, espaçamento entre letras de 0.06em, cor de apoio.
- Números sempre com largura fixa (um embaixo do outro, alinhados).

| Elemento | Fonte | Tamanho | Peso |
| --- | --- | --- | --- |
| Título da tela | Manrope | 28px | 700 |
| Título de seção | Manrope | 18px | 700 |
| Texto | Manrope | 15px | 400 |
| Rótulo de campo | Manrope | 14px | 600 |
| Rótulo técnico | JetBrains Mono | 12px | 500 |
| Número do Dashboard | JetBrains Mono | 40px | 500 |

## Formas e espaço

- Cantos de `10px` em cartões, campos, botões e itens da navegação. Etiquetas pequenas usam `6px` para não virarem pílulas.
- Bordas visíveis (`#262F3D`) em vez de sombras. Nenhuma sombra em lugar nenhum.
- Bastante respiro: 24px entre blocos, 32px de folga dentro dos cartões, 40px nas margens da área de conteúdo.

## Componentes

- **Cartão:** superfície `#151B24`, borda de 1px, cantos de 10px.
- **Painel embutido** (follow-up e anotações abertos abaixo de um contato): fundo `#0D1117` dentro do cartão, com borda, parecendo um recorte.
- **Campo de texto:** fundo `#0D1117`, borda de 1px, texto claro, exemplo (placeholder) na cor de apoio. Com foco: borda e contorno no azul de destaque.
- **Botão principal:** fundo azul de destaque, texto escuro em peso 700. No hover, o azul mais claro.
- **Botão secundário** (ex.: Sair): fundo transparente, borda visível, texto claro. No hover, fundo elevado `#1B222E`.
- **Link de ação:** texto no azul de destaque, peso 600. No hover, o azul mais claro e sublinhado.
- **Tabela:** cabeçalho em rótulo técnico; linhas separadas por bordas; sem listras.
- **Etiqueta de etapa:** JetBrains Mono 12px em maiúsculas, texto na cor da etapa, borda na cor da etapa misturada à superfície e fundo levemente tingido da mesma cor. A caixa de troca de etapa da lista tem o mesmo visual.
- **Kanban:** colunas com borda sobre o fundo da página; cartões na cor de superfície, com o tempo de cadastro em JetBrains Mono. A coluna que vai receber o cartão arrastado ganha borda azul; coluna vazia mostra um aviso discreto em borda tracejada.
- **Gráfico de barras:** barras horizontais de 20px na cor da etapa, crescendo de uma linha de base, com a ponta arredondada em 4px e sem nenhum efeito. A maior barra ocupa a largura toda. Quantidade e porcentagem ficam na ponta da barra, em JetBrains Mono, na cor de texto (nunca na cor da etapa).
- **Janela (modal):** superfície elevada `#1B222E`, borda visível, sem sombra. O resto da tela escurece, sem desfoque.
- **Foco do teclado:** contorno de 2px no azul de destaque, sempre visível.
- **Erros:** texto em `#FB7171`, peso 600.
- Campos, caixas de escolha e barras de rolagem do navegador também no modo escuro.

## Proibido

- Gradientes.
- Efeito de vidro/desfoque.
- Emojis na interface.
- Sombras, inclusive brilho (glow) em volta do azul.
- Animações chamativas. Só o indicador discreto de "Escrevendo a mensagem..." pisca de leve, e para quando o sistema pede menos movimento.

Se parecer template de IA, está errado.

---

# Design do sistema · de página pra sistema

O CRM deixa de ser uma página com abas no topo e vira um sistema com moldura fixa (o "shell"): navegação à esquerda, cabeçalho em cima e a área de conteúdo à direita.

## Shell de aplicação

```
┌─────────────────────────────────────────────────────────────┐
│ Meu CRM                                  felipe     [ Sair ] │  cabeçalho
├────────────────┬────────────────────────────────────────────┤
│ ▌Dashboard     │                                            │
│  Funil         │  Título da tela                            │
│  Contatos      │  texto de apoio                            │
│  Usuários *    │                                            │
│                │  conteúdo da área (tela cheia)             │
│                │                                            │
│                │                                            │
└────────────────┴────────────────────────────────────────────┘
  navegação lateral fixa                * só para o administrador
```

### Cabeçalho

- Faixa de 56px no topo, de ponta a ponta, na cor de superfície com borda embaixo.
- À esquerda, o nome do CRM: **Meu CRM**, Manrope 800.
- À direita, quem está logado (nome do usuário em JetBrains Mono, cor de apoio) e o botão secundário **Sair**.

### Navegação lateral

- Coluna fixa de 240px à esquerda, na cor de superfície com borda à direita. Não rola junto com o conteúdo.
- Itens em lista vertical, um por área: **Dashboard**, **Funil**, **Contatos** e **Usuários** (este só aparece para o administrador).
- Item ativo: fundo de destaque (o azul de destaque misturado à superfície, sem transparência) e texto claro em peso 700. Fica claro, de longe, em que área você está.
- Itens inativos: texto de apoio. No hover, fundo elevado `#1B222E` e texto claro.
- Espaço para crescer: uma nova área do sistema é só mais um item na lista, sem mudar o layout.

### Área de conteúdo

- Ocupa todo o espaço à direita da navegação e abaixo do cabeçalho.
- Cada área é uma tela própria e cheia, começando por título e texto de apoio.
- Formulários ficam com no máximo 560px de largura, para não esticar demais os campos.

### Telas estreitas (até 860px)

- A navegação lateral se recolhe numa faixa horizontal logo abaixo do cabeçalho, com os mesmos itens lado a lado e o mesmo destaque no ativo.
- Se os itens não couberem, a faixa rola para o lado. Nada de menu escondido: as áreas continuam sempre à vista, a um toque.
- Até 480px, o nome do usuário logado some do cabeçalho para caber o botão Sair (como já acontece hoje).

## Áreas do sistema

Reorganização do que já existe. Nenhuma funcionalidade nova, nenhuma perdida.

| Área | Endereço | O que tem |
| --- | --- | --- |
| Dashboard | `/` | Cartões grandes com o total de contatos e a contagem por etapa (na cor da etapa); gráfico de barras com a distribuição por etapa; lista dos 5 contatos cadastrados mais recentes, cada um levando à página dele. Atualiza sozinho a cada 30 segundos e quando a aba volta a ficar visível. Sem contatos, cada bloco mostra um aviso simples de vazio. |
| Funil | `/funil` | O Kanban: uma coluna por etapa com o contador no topo; cada contato é um cartão (nome, email, há quanto tempo foi cadastrado) que muda de etapa ao ser arrastado. O botão **Novo contato** abre o cadastro numa janela, sem sair da tela. |
| Contatos | `/contatos` | Busca por nome ou email, com os resultados levando à página do contato, e o formulário **Novo contato**. |
| Página do contato | `/contatos/[id]` | Aberta pelo cartão do Kanban ou pela busca. No topo, a ficha: email, telefone, etapa (com troca na hora) e há quanto tempo foi cadastrado. Abaixo, lado a lado: **Anotações** (ler, adicionar, editar, excluir) e **Follow-ups** (gerar com IA e a lista dos guardados, com data e botão de copiar). Contato que não existe mais mostra um aviso e o botão de voltar ao Funil. |
| Usuários | `/usuarios` | Como está: cadastros aguardando aprovação (com **Aprovar**) e usuários aprovados. Só o administrador entra. |

Na tela Contatos, depois de salvar, o formulário limpa e aparece a linha "Contato salvo." com um link para o Funil.
Hoje a confirmação era ver o contato surgir na lista logo abaixo; como a lista foi para o Funil, essa linha cumpre esse papel.

## Telas fora do shell

**Login** e **Cadastro** não têm navegação nem cabeçalho: um cartão centralizado na tela, com no máximo 400px de largura, sobre o fundo escuro.
Mesmos textos, campos e botões de hoje, na identidade nova.

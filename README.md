# HolyDesign

HolyDesign é um conjunto rigoroso de diretrizes e templates para orientar agentes de IA a criar interfaces pragmáticas, legíveis e responsivas, sem os clichês visuais recorrentes em designs gerados por IA.

O repositório inclui uma skill reutilizável chamada `/holydesign`, com os templates do projeto empacotados junto das instruções.

## Instalação automática

Requer Node.js. Na raiz deste repositório, execute:

```bash
node install.js
```

O instalador procura executáveis no `PATH` e diretórios de configuração do usuário para detectar:

- Codex
- Claude Code
- Cursor
- Google Antigravity App e CLI
- Gemini CLI

Em cada harness detectado, cria ou atualiza a skill global `holydesign` e copia a pasta `templates/` para dentro dela. A instalação usa os diretórios padrão de skills de cada ferramenta. Se já houver uma pasta `holydesign` que não pareça pertencer ao HolyDesign, o instalador a preserva e informa que a ignorou.

Depois de instalar, reinicie ou recarregue o harness e invoque `/holydesign` no chat. Alguns agentes também selecionam a skill automaticamente quando o pedido envolve criação ou alteração de interfaces.

Se nenhum harness for detectado, o instalador informa isso sem criar arquivos fora do repositório.

## Instalação manual

Uma skill compatível com Agent Skills é uma pasta que contém `SKILL.md` e seus recursos. Para instalar manualmente, crie uma pasta `holydesign` em um diretório de skills reconhecido pelo seu agente, coloque nela um `SKILL.md` com metadados `name` e `description`, e copie a pasta `templates/` para o mesmo local.

## Arquivos

- `Skill.md`: diretrizes de design do HolyDesign.
- `templates/`: exemplos e recursos que acompanham a skill.
- `install.js`: instalador global para os harnesses reconhecidos.

## Desenvolvimento

Edite `Skill.md` para atualizar as regras e `templates/` para adicionar ou alterar recursos. Execute novamente `node install.js` para propagar as alterações às instalações globais detectadas.

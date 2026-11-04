# HolyDesign

HolyDesign é um framework rigoroso para orientar IAs na criação de interfaces pragmáticas, limpas e sem vícios visuais recorrentes de designs gerados por IA. As diretrizes cobrem sites, aplicações web, interfaces de mods, jogos e dashboards.

## Conteúdo

- `Skill.md`: regras obrigatórias de design para orientar a IA.
- `templates/base.css`: reset moderno e variáveis para uma base visual simples, legível e responsiva.
- `install.js`: instala as diretrizes no projeto em que for executado.

## Como usar a skill

### Uso manual

1. Abra `Skill.md` neste repositório.
2. Inclua seu conteúdo no contexto do assistente de IA ou peça que ele leia o arquivo antes de criar ou alterar uma interface.
3. Informe os requisitos específicos do projeto. As regras do HolyDesign devem orientar a solução junto com esses requisitos.

### Instalação em outro projeto

Com Node.js instalado, execute o instalador a partir do diretório do projeto que receberá as regras:

```bash
node /caminho/para/HolyDesign/install.js
```

No Windows, por exemplo:

```powershell
node C:\caminho\para\HolyDesign\install.js
```

O instalador cria `.holydesign/Skill.md` no diretório de execução e um `.cursorrules` que instrui o assistente a ler as diretrizes. Mantenha os dois arquivos versionados no projeto para que a regra acompanhe o código.

### Aplicar a base CSS

Copie `templates/base.css` para a camada de estilos do projeto e importe-o antes dos estilos dos componentes. Ajuste as variáveis de cor e tipografia às necessidades do produto, mantendo contraste, simplicidade e responsividade.

## Princípios

- Layouts responsivos desde telas pequenas.
- Hierarquia construída com tipografia, espaçamento e alinhamento.
- CSS modular, sem dependência de Tailwind por padrão.
- Rodapé com links ou páginas de Privacidade e Termos de Serviço.
- Sem gradientes roxo e azul, elementos decorativos clichês ou adornos que prejudiquem a leitura.

## Licença

A licença deste projeto ainda não foi definida.

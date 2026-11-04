# HolyDesign

HolyDesign is a framework designed to guide AIs in designing, without the stupid "purple gradients" and some shi.
- Thank you so much Codex/ChatGPT and Gemini. -

## Contents

- `Skill.md`: Mandatory design rules to guide the AI
- `templates/`: Some template so the AI knows how tf the project works - YES I LOST MY TOKENS FOR YOU
- `install.js`: A script to install the guidelines into your project

## How to use the framework

### Manual usage

1. Open `Skill.md` in this repository.
2. Include its content in your AI assistant's context, or ask the AI ​​to read the file before creating or modifying an interface.
3. Provide your project-specific requirements. The HolyDesign rules should guide the solution alongside these requirements.

### Installation in a project

With Node.js installed, run the installer from the directory of the project where you wish to apply the rules:

```bash
node install.js
```

The installer creates a `.holydesign/Skill.md` file in your current directory, along with a `.cursorrules` file that instructs the AI ​​assistant to follow these guidelines. Keep both files under version control so that the rules remain tied to your codebase.

### Applying the base CSS

Copy `templates/base.css` into your project’s style layer and import it before your component-specific styles. Adjust the color and typography variables to suit your product's needs, while ensuring proper contrast, simplicity, and responsiveness.

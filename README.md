# HolyDesign

HolyDesign is a rigorous set of guidelines and templates designed to steer AI agents toward creating pragmatic, readable, and responsive interfaces—free from the visual clichés often found in AI-generated designs.

The repository includes a reusable skill called `/holydesign`, which bundles the project’s templates alongside the necessary instructions.

## Automatic Installation

Requires Node.js. From the root of this repository, run:

```bash
node install.js
```

The installer scans your `PATH` and user configuration directories to detect the following:

- Codex
- Claude Code
- Cursor
- Google Antigravity (app and CLI)
- Gemini CLI

For each detected tool, it creates or updates a global `holydesign` skill and copies the `templates/` folder into it, using the tool's standard directory for skills. If a `holydesign` folder already exists but does not appear to belong to this project, the installer will preserve it and notify you that it has been skipped.

Once installed, restart or reload your AI agent and invoke `/holydesign` within the chat. Some agents may also automatically select this skill when a request involves creating or modifying interfaces.

If no supported tools are detected, the installer will inform you accordingly without creating any files outside of this repository.

## Manual Installation

An "Agent Skill" consists of a folder containing a `SKILL.md` file and its associated resources. To install manually, create a `holydesign` folder within a directory recognized by your AI agent, add a `SKILL.md` file (including `name` and `description` metadata), and copy the `templates/` folder into that same location.

## Credits

https://github.com/realidkroo/Mochy-Music: This site was used as a template. ## Files

- `Skill.md`: HolyDesign design guidelines.
- `templates/`: examples and resources that accompany the skill.
- `install.js`: global installer for recognized harnesses.

## Development

Edit `Skill.md` to update rules, and modify `templates/` to add or change resources. Run `node install.js` again to propagate changes to any detected global installations.

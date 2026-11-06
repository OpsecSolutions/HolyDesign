#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = __dirname;
const SKILL_SOURCE = path.join(ROOT, 'Skill.md');
const TEMPLATE_SOURCE = path.join(ROOT, 'templates');
const SKILL_NAME = 'holydesign';
const SKILL_DESCRIPTION = 'Apply strict anti-cliché visual design rules when creating or modifying interfaces, websites, apps, games, and dashboards.';
const HOME = os.homedir();

function exists(candidate) {
  try {
    return fs.existsSync(candidate);
  } catch {
    return false;
  }
}

function executableExists(names) {
  const extensions = process.platform === 'win32'
    ? (process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM').split(';')
    : [''];
  const searchPaths = (process.env.PATH || '').split(path.delimiter).filter(Boolean);

  return names.some((name) => searchPaths.some((directory) =>
    extensions.some((extension) => exists(path.join(directory, `${name}${extension}`)) ||
      exists(path.join(directory, `${name}${extension.toLowerCase()}`)))
  ));
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

function skillTargets() {
  const targets = new Map();
  const addTarget = (harness, skillRoot) => {
    const target = path.join(skillRoot, SKILL_NAME);
    const entry = targets.get(target) || [];
    entry.push(harness);
    targets.set(target, entry);
  };
  const detected = (commands, directories) =>
    executableExists(commands) || directories.some(exists);

  const codexHome = process.env.CODEX_HOME
    ? path.resolve(process.env.CODEX_HOME)
    : path.join(HOME, '.codex');
  if (detected(['codex'], [codexHome])) {
    addTarget('Codex', path.join(codexHome, 'skills'));
  }

  const claudeHome = path.join(HOME, '.claude');
  if (detected(['claude'], [claudeHome])) {
    addTarget('Claude Code', path.join(claudeHome, 'skills'));
  }

  const cursorHome = path.join(HOME, '.cursor');
  if (detected(['cursor'], [cursorHome])) {
    addTarget('Cursor', path.join(cursorHome, 'skills'));
  }

  const geminiHome = path.join(HOME, '.gemini');
  const antigravityDetected = detected(
    ['agy', 'antigravity'],
    [
      path.join(geminiHome, 'config', 'skills'),
      path.join(geminiHome, 'antigravity'),
      path.join(geminiHome, 'antigravity-cli'),
    ]
  );
  if (antigravityDetected) {
    // The App and CLI use different global roots; install to both so the skill
    // is available in either Antigravity surface.
    addTarget('Antigravity App', path.join(geminiHome, 'config', 'skills'));
    addTarget('Antigravity CLI', path.join(geminiHome, 'antigravity-cli', 'skills'));
  }

  if (executableExists(['gemini'])) {
    addTarget('Gemini CLI', path.join(geminiHome, 'skills'));
  }

  return targets;
}

function generatedSkill() {
  const instructions = fs.readFileSync(SKILL_SOURCE, 'utf8').replace(/^\uFEFF/, '').trimEnd();
  return [
    '---',
    `name: ${SKILL_NAME}`,
    `description: ${SKILL_DESCRIPTION}`,
    '---',
    '',
    instructions,
    '',
    '## Templates',
    '',
    'Use the files in `templates/` as starting points when they fit the project. Treat them as references and adapt them to the product requirements while following every rule above.',
    '',
  ].join('\n');
}

function installSkill(target, harnesses) {
  const currentManifest = path.join(target, 'SKILL.md');
  if (exists(target) && exists(currentManifest)) {
    const existing = fs.readFileSync(currentManifest, 'utf8');
    if (!new RegExp(`^name:\\s*${SKILL_NAME}\\s*$`, 'm').test(existing)) {
      console.warn(`Ignorado para evitar sobrescrever outra skill: ${target}`);
      return false;
    }
  } else if (exists(target)) {
    console.warn(`Ignorado porque a pasta já existe e não parece ser do HolyDesign: ${target}`);
    return false;
  }

  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(currentManifest, generatedSkill(), 'utf8');
  if (exists(TEMPLATE_SOURCE)) {
    copyDirectory(TEMPLATE_SOURCE, path.join(target, 'templates'));
  }
  console.log(`Instalado para ${harnesses.join(', ')}: ${target}`);
  return true;
}

function main() {
  if (!exists(SKILL_SOURCE)) {
    console.error(`Arquivo de diretrizes não encontrado: ${SKILL_SOURCE}`);
    process.exitCode = 1;
    return;
  }

  const targets = skillTargets();
  if (targets.size === 0) {
    console.log('Nenhum harness compatível foi detectado.');
    console.log('Instale Codex, Claude Code, Cursor, Antigravity ou Gemini CLI e rode este comando novamente.');
    console.log('Você também pode instalar manualmente copiando Skill.md para uma pasta skills/holydesign/SKILL.md.');
    return;
  }

  let installedCount = 0;
  for (const [target, harnesses] of targets) {
    if (installSkill(target, harnesses)) installedCount += 1;
  }

  console.log(`\nHolyDesign disponível como /${SKILL_NAME} nos harnesses instalados.`);
  console.log(`Pastas de skill atualizadas: ${installedCount}`);
  console.log('Reinicie ou recarregue os harnesses abertos para que descubram a skill.');
}

main();

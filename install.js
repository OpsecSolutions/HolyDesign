const fs = require('node:fs');
const path = require('node:path');

const sourceSkill = path.join(__dirname, 'Skill.md');
const targetDirectory = path.resolve(process.cwd(), '.holydesign');
const targetSkill = path.join(targetDirectory, 'Skill.md');
const rulesFile = path.resolve(process.cwd(), '.cursorrules');

if (!fs.existsSync(sourceSkill)) {
  console.error(`Não foi encontrado o arquivo de diretrizes: ${sourceSkill}`);
  process.exit(1);
}

fs.mkdirSync(targetDirectory, { recursive: true });
fs.copyFileSync(sourceSkill, targetSkill);
fs.writeFileSync(
  rulesFile,
  'Antes de criar ou alterar qualquer interface neste projeto, leia e siga integralmente as diretrizes em .holydesign/Skill.md.\n',
  'utf8'
);

console.log(`HolyDesign instalado em ${targetDirectory}`);
console.log(`Regras do assistente criadas em ${rulesFile}`);

/**
 * Reads public/application-workflow.svg and writes components/flowchart/applicationWorkflowSvgSource.js
 * so ApplicationWorkflowSvg can render without a runtime fetch.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'public', 'application-workflow.svg');
const outPath = path.join(
  root,
  'components',
  'flowchart',
  'applicationWorkflowSvgSource.js'
);

const raw = fs.readFileSync(srcPath, 'utf8');
const banner = `/**
 * Inlined copy of public/application-workflow.svg for synchronous first paint.
 * Regenerate after editing the SVG: npm run sync-workflow-svg
 */

`;
const body = `export const APPLICATION_WORKFLOW_SVG_RAW = ${JSON.stringify(raw)};\n`;
fs.writeFileSync(outPath, banner + body, 'utf8');
console.log('Wrote', path.relative(root, outPath), `(${fs.statSync(outPath).size} bytes)`);

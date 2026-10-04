import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('🚀 Deploying dist directly to gh-pages...');
execSync('git init', { cwd: DIST_DIR, stdio: 'inherit' });
execSync('git config user.name "saaqibA21"', { cwd: DIST_DIR, stdio: 'inherit' });
execSync('git config user.email "saaqibheroindia@gmail.com"', { cwd: DIST_DIR, stdio: 'inherit' });
execSync('git add -A', { cwd: DIST_DIR, stdio: 'inherit' });
execSync('git commit -m "Deploy Kurals 1-500 and 1000-1263 Images to GitHub Pages"', { cwd: DIST_DIR, stdio: 'inherit' });
execSync('git push -f https://github.com/saaqibA21/thiruk.git master:gh-pages', { cwd: DIST_DIR, stdio: 'inherit' });

console.log('🎉 Successfully deployed to gh-pages!');

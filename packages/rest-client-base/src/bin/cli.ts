#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { globSync } from 'glob';

const args = process.argv.slice(2);
const command = args[0];
const moduleFlag = args.indexOf('--module');
const moduleName = moduleFlag !== -1 ? args[moduleFlag + 1] : null;

function replaceImports(distDir: string, targetModule: string) {
  const jsFiles = globSync(`${distDir}/**/*.js`);

  jsFiles.forEach((file) => {
    let content = readFileSync(file, 'utf-8');

    // Replace relative imports from parent (..)
    content = content.replace(
      /from\s+["']\.\.["']/g,
      `from "@edifice.io/rest-client-base/${targetModule}"`,
    );

    // Replace direct imports from the package
    content = content.replace(
      /from\s+["']@edifice\.io\/rest-client-base["']/g,
      `from "@edifice.io/rest-client-base/${targetModule}"`,
    );

    writeFileSync(file, content, 'utf-8');
  });

  console.log(
    `✅ Imports replaced in ${distDir} with @edifice.io/rest-client-base/${targetModule}`,
  );
}

function initReactNative() {
  execSync('mkdir -p dist/react-native', { stdio: 'inherit' });
  execSync('cp -r dist/browser/* dist/react-native/', { stdio: 'inherit' });
  execSync('find dist/react-native -name "*.node.js*" -delete', {
    stdio: 'inherit',
  });
  console.log('✅ React Native distribution initialized from browser build');
}

switch (command) {
  case 'init':
    if (moduleName === 'react-native') {
      initReactNative();
    } else {
      console.error('❌ Unknown module for init. Use: --module react-native');
      process.exit(1);
    }
    break;

  case 'replace': {
    if (!moduleName) {
      console.error(
        '❌ Missing --module flag. Use: --module browser|react-native',
      );
      process.exit(1);
    }

    const distDir = join(process.cwd(), 'dist', moduleName);
    replaceImports(distDir, moduleName);
    break;
  }

  default:
    console.error('❌ Unknown command. Available commands: init, replace');
    process.exit(1);
}

import { readFile } from 'node:fs/promises';
import { defineConfig } from 'vite';

export default async () => {
  const pkg = await readFile('./package.json', 'utf-8');
  const { peerDependencies } = JSON.parse(pkg);

  return defineConfig({
    build: {
      lib: {
        entry: './src/index.tsx',
        fileName: 'freeform-input',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: Object.keys(peerDependencies),
        output: {
          exports: 'named',
        },
      },
    },
  });
};

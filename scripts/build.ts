import Bun from 'bun';

const start = Date.now();

const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'node',
  naming: 'index.js',
  external: ['react', 'zod', 'immer', 'nanoid'],
});

if (result.success) {
  console.info(`Built project in ${Date.now() - start}ms`);
  process.exit(0);
}

result.logs.map((l) => console.info(l));
process.exit(1);

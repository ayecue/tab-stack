const esbuild = require('esbuild');

const build = async () => {
  try {
    await esbuild
      .build({
        entryPoints: ['./out/extension.js'],
        bundle: true,
        outfile: 'extension.js',
        globalName: 'tabmanagervscode',
        sourcemap: false,
        minify: true,
        minifyWhitespace: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        target: 'ESNext',
        platform: 'node',
        format: 'cjs',
        treeShaking: true,
        external: ['vscode'],
        define: {
          'process.env.NODE_ENV': '"production"'
        }
      });
  } catch (err) {
    console.error('Failed building project', { err });
    process.exit(1);
  }
};

build();

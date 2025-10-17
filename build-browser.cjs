const esbuild = require('esbuild');
const { polyfillNode } = require('esbuild-plugin-polyfill-node');

const build = async () => {
  try {
    await esbuild
      .build({
        entryPoints: ['./out/extension.js'],
        bundle: true,
        outfile: 'extension.browser.js',
        globalName: 'tabmanagervscode',
        sourcemap: false,
        minify: true,
        minifyWhitespace: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        target: 'ESNext',
        platform: 'browser',
        treeShaking: true,
        format: 'cjs',
        external: [
          'vscode'
        ],
        define: {
          'process.env.NODE_ENV': '"production"'
        },
        plugins: [
          polyfillNode({
            globals: false
          })
        ]
      });
  } catch (err) {
    console.error('Failed building project', { err });
    process.exit(1);
  }
};

build();

const esbuild = require('esbuild');
const { copyWebviewAssets } = require('./copy-assets.cjs');

const buildWebview = async () => {
  try {
    // Build the React bundle
    await esbuild.build({
      entryPoints: ['src/webview/index.tsx'],
      bundle: true,
      outfile: 'webview.js',
      platform: 'browser',
      target: 'es2020',
      format: 'iife',
      sourcemap: false,
      minify: true,
      minifyWhitespace: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      jsx: 'automatic',
      jsxImportSource: 'react',
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      loader: {
        '.css': 'empty'  // Ignore CSS imports since we load CSS separately
      },
      external: [],
      logLevel: 'info'
    });
    
    // Copy webview assets (HTML and CSS)
    copyWebviewAssets();
    
    console.log('Webview build completed successfully!');
  } catch (error) {
    console.error('Webview build failed:', error);
    process.exit(1);
  }
};

buildWebview();
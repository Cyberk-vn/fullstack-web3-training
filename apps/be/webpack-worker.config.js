/* eslint-disable @typescript-eslint/no-var-requires */
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    '@nestjs/platform-express',
    'swagger-ui-express',
    'class-transformer/storage',
  ]

  const rootPath = options.output.filename.slice(0, -'main.js'.length)
  const appName = rootPath.split('/')[1]

  return {
    ...options,
    name: `lambda-webpack:${appName}`,
    resolve: {
      ...options.resolve,
      extensions: [...options.resolve.extensions, '.json'],
      alias: {
        ...options.alias,
        'class-transformer/cjs/storage': path.resolve('./node_modules/class-transformer/cjs/storage'),
        'class-transformer': path.resolve('./node_modules/class-transformer/cjs'),
      },
    },
    externals: [
      {
        sharp: 'commonjs sharp',
        '.prisma/client': 'commonjs .prisma/client',
        '@prisma/client': 'commonjs @prisma/client',
      },
    ],
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          // console.log(resource)
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource)
            } catch (err) {
              return true
            }
          }
          return false
        },
      }),
    ],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    // mode: 'production',
    // optimization: {
    //   ...options.optimization,
    //   usedExports: true,
    //   minimizer: [
    //     new TerserPlugin({
    //       terserOptions: {
    //         keep_classnames: true,
    //         keep_fnames: true,
    //         sourceMap: true,
    //       },
    //       minify: {

    //       }
    //     }),
    //   ],
    // },
  }
}

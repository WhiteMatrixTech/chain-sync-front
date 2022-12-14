const CracoLessPlugin = require('craco-less');
const { getThemeVariables } = require('antd/dist/theme');
const { CracoAliasPlugin } = require('react-app-alias');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CracoEnvPlugin = require('craco-plugin-env');

module.exports = {
  // style: {
  //   postcss: {
  //     plugins: [require('tailwindcss'), require('autoprefixer')]
  //   }
  // },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true
          }
        }
      }
    },
    {
      plugin: CracoAliasPlugin,
      options: {}
    },
    {
      plugin: CracoEnvPlugin,
      options: {
        variables: {}
      }
    }
  ],
  devServer: {
    proxy: {
      '/etl': {
        target: 'http://localhost:8082/etl',
        changeOrigin: true,
        pathRewrite: { '^/etl': '' }
      }
    }
  },
  webpack: {
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: ['console']
      })
    ],
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                modifyVars: getThemeVariables({
                  dark: true, // 开启暗黑模式
                  compact: true // 开启紧凑模式
                }),
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ]
  }
};

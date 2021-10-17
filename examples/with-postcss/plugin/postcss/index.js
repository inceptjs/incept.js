import path from 'path'

export default function(app) {
  app.withReact.app = path.join(__dirname, 'App')
  app.withWebpack.withServerCompiler.pushRule(/\.css$/i, {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [[ 'postcss-preset-env' ]]
      }
    }
  })

  app.withWebpack.withStaticCompiler.pushRule(/\.css$/i, {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [[ 'postcss-preset-env' ]]
      }
    }
  })
}
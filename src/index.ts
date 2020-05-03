import { app, expressReceiver } from './initializers/bolt'
;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)
  expressReceiver.app.set(`view engine`, `pug`)
  console.log(`⚡️ Bolt app is running!`)
})()
app.error(console.log)

// 動的にboltに対してrequiredしに行くロジック。
const fs = require(`fs`)
const contextRoot = `./` + process.argv[2] // rootPath(検証中はsrc、本番はコンパイル後のdistにしたいので、パラメータで渡すことにする。)
const paths: string[] = [`commands`, `messages`, `listeners`, `requests`] // appに対してimportする対象ディレクトリ

paths.forEach(path => {
  fs.readdir(contextRoot + `/` + path, function(err: any, files: string[]) {
    if (err) throw err
    files
      .filter(file => {
        // tsのコンパイル後のxx.js.mapを読み込まないようにする。
        return !file.match(`.js.map`)
      })
      .forEach(file => {
        require(`./` + path + `/` + file)
      })
  })
})

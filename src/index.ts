import { app, expressReceiver } from './initializers/bolt'
import * as config from 'config'
;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)
  expressReceiver.app.set(`view engine`, `pug`)
  console.log(`⚡️ Bolt app is running!`)
})()
app.error(console.log)

// 動的にboltに対してrequiredしに行くロジック。
const loadPath: any = config.get(`LoadPath`)
const fs = require(`fs`)
const contextRoot = `./` + loadPath // 検証中はsrc、本番はコンパイル後のdistにしたい
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

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
const contextRoot: any = config.get(`ContextRoot`) // 検証中はsrc、本番はコンパイル後のdistにしたい
const path = require(`path`)
const fs = require(`fs`)
const dirs: string[] = [`commands`, `messages`, `listeners`, `requests`] // appに対してimportする対象ディレクトリ

dirs.forEach(dir => {
  fs.readdir(path.join(contextRoot, dir), function(err: any, files: string[]) {
    if (err) throw err
    files
      .filter(file => {
        // tsのコンパイル後のxx.js.mapを読み込まないようにする。
        return !file.match(`.js.map`)
      })
      .filter(file => {
        // 修正前は404.tsをloadしていなかったので、それを除外するように修正
        return !file.match(`404`)
      })
      .forEach(file => {
        // pathで./をうまく表現できなかったので、rootPathは加算することに。
        require(`./` + path.join(dir, file))
      })
  })
})

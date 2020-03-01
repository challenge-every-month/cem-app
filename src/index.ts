import { app, expressReceiver } from './initializers/bolt'
;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)
  expressReceiver.app.set(`view engine`, `pug`)
  console.log(`⚡️ Bolt app is running!`)
})()
app.error(console.log)

require(`./commands/echo`)
require(`./commands/cem_help`)
require(`./commands/cem_register`)
require(`./commands/cem_new`)
require(`./commands/cem_publish`)
require(`./commands/cem_delete`)
require(`./commands/cem_review`)
require(`./messages/exercise`)
require(`./listeners/res_cem_new`)
require(`./listeners/res_cem_delete`)
require(`./listeners/res_cem_review_challenge`)
require(`./listeners/res_cem_review_all`)
require(`./requests/remind`)
require(`./requests/deploy`)
require(`./requests/pages`)

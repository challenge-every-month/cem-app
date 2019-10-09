import { app } from './initializers/bolt'
import echo from './commands/echo'
import cem_register from './commands/cem_register'
import cem_new from './commands/cem_new'
import cem_publish from './commands/cem_publish'
import cem_delete from './commands/cem_delete'
import res_cem_new from './listeners/res_cem_new'
import res_cem_delete from './listeners/res_cem_delete'

import remind from './requests/remind'
import deploying from './requests/deploying'
import deployed from './requests/deployed'
;(async () => {
  // Start your app
  // await app.receiver.start()
  const server = await app.start(process.env.PORT || 3000)

  console.log(`⚡️ Bolt app is running! PORT: ${server.address().port}`)
})()

echo()
cem_register()
cem_new()
cem_publish()
cem_delete()
res_cem_new()
res_cem_delete()
remind()
deploying()
deployed()

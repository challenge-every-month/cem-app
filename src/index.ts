import { app } from './initializers/bolt'
import echo from './commands/echo'
import cem_register from './commands/cem_register'
import cem_new from './commands/cem_new'
import cem_publish from './commands/cem_publish'
import cem_delete from './commands/cem_delete'
import cem_review from './commands/cem_review'
import res_cem_new from './listeners/res_cem_new'
import res_cem_delete from './listeners/res_cem_delete'
import res_cem_review_challenge from './listeners/res_cem_review_challenge'
import res_cem_review_all from './listeners/res_cem_review_all'

import remind from './requests/remind'
import deploy from './requests/deploy'
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
cem_review()
cem_delete()
res_cem_new()
res_cem_delete()
res_cem_review_challenge()
res_cem_review_all()
remind()
deploy()

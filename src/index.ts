import { app } from '@/bolt/setup'
import echo from '@/commands/echo'
import cem_register from '@/commands/cem_register'
import cem_new from '@/commands/cem_new'
import res_cem_new from '@/actions/res_cem_new'
;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  console.log(`⚡️ Bolt app is running!`)
})()
echo()
cem_register()
cem_new()
res_cem_new()

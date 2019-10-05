import { app } from '@/bolt/setup'
import echo from '@/commands/echo'
import cem_register from '@/commands/cem_register'
;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  console.log(`⚡️ Bolt app is running!`)
})()
echo()
cem_register()

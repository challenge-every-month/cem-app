import { app } from './bolt/setup'
import echo from './commands/echo'
;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  console.log(`⚡️ Bolt app is running!`)
})()
echo()

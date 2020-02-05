import { app } from '../initializers/bolt'

app.command(`/echo`, async ({ command, ack, say }) => {
  ack()

  say(`${command.text}`)
})

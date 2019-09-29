import { app } from '../bolt/setup'
export default function() {
  app.command(`/echo`, async ({ command, ack, say }) => {
    ack()

    say(`${command.text}`)
  })
}

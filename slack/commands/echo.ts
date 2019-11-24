import { app } from '../../initializers/bolt'
export default function() {
  app.command(`/echo`, ({ command, ack, say }) => {
    ack()

    say(`${command.text}`)
  })
}

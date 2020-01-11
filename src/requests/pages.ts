import { expressReceiver } from '../initializers/bolt'

expressReceiver.app.get(`/`, (req, res) => {
  res.status(200).render(`index`, {
    title: `Challenge Every Month`,
    message: `We are challengers!`,
  })
})

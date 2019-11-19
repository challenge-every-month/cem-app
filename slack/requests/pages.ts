import { app } from '../../initializers/bolt'

export default function() {
  app.receiver.app.get(`/`, (req, res) => {
    res.status(200).render(`index`, {
      title: `Challenge Every Month`,
      message: `We are challengers!`,
    })
  })
}

import { expressReceiver } from '../initializers/bolt'

expressReceiver.app.use((req, res) => {
  res.status(404).render(`404`, {
    title: `404 Not Found`,
    message: `404 page not found`,
  })
})

import { app } from '../../initializers/bolt'

export default function() {
  app.receiver.app.use((_req, _res, next) => {
    // res.status(404).render(`404`, {
    //   title: `404 Not Found`,
    //   message: `404 page not found`,
    // })
    next()
  })
}

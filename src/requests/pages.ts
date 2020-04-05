import { expressReceiver } from '../initializers/bolt'
import { EndPoint } from '../types/CodeConstant'

expressReceiver.app.get(EndPoint.Welcome, (req, res) => {
  res.status(200).render(`index`, {
    title: `Challenge Every Month`,
    message: `We are challengers!`,
  })
})

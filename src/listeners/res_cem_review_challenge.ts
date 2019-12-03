import { app } from '../initializers/bolt'
import { firestore, FieldValue } from '../initializers/firebase'

const regex = /^review_(.*?)_(.*?)$/
export default function() {
  app.action(regex, async ({ payload, ack }) => {
    ack()

    const ids = payload.action_id.match(regex)
    const projectId = ids![1]
    const challengeId = ids![2]
    const status = payload.selected_option.value

    const challenge = await firestore
      .collection(`projects`)
      .doc(projectId)
      .collection(`challenges`)
      .doc(challengeId)
    challenge.update({
      status: status,
      updatedAt: FieldValue.serverTimestamp(),
    })
    return 200
  })
}

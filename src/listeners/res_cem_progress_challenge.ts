import { app } from '../initializers/bolt'
import { firestore, FieldValue } from '../initializers/firebase'

const regex = /^progress_(.*?)_(.*?)$/
app.action(regex, async ({ payload, ack }) => {
  ack()

  const ids = (payload as any).action_id.match(regex)
  const projectId = ids![1]
  const challengeId = ids![2]
  const status = (payload as any).selected_option.value

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

import { app } from '../initializers/bolt'
import { firestore, FieldValue } from '../initializers/firebase'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ja'
import * as config from 'config'

dayjs.locale(`ja`)
const MINIMUM_STREAK = 3
const MAXIMUM_STREAK = 10
// Event Subscriptoin 'message.channels' の権限設定が必要
app.message(`しました`, async ({ message, context }) => {
  // 発言されたチャンネルが対象のチャンネルか
  const channel: any = config.get(`Slack.Channels.exercise`)
  if (channel !== message.channel) {
    return false
  }
  // 発言したユーザーが登録済のユーザーか
  const exercisesRef = firestore.collection(`exercises`)
  const exercise = await exercisesRef.doc(message.user).get()
  if (!exercise.exists) {
    return false
  }
  const exerciseData = exercise.data()!
  const previousDate = dayjs(exerciseData.updatedAt.toDate())
  const now = dayjs(new Date())
  const dateDiff = previousDate.startOf(`day`).diff(now.endOf(`day`), `day`)
  // 今日に既に行われていたら何もしない
  if (dateDiff === 0) {
    return false
  }

  const dayStreaks: number = exerciseData.dayStreaks
  let newDayStreaks: number
  // 前回が昨日
  if (dateDiff === -1) {
    newDayStreaks = dayStreaks + 1
    // 最低連続日数以上であること
    let reaction: string = ``
    if (newDayStreaks >= MAXIMUM_STREAK) {
      reaction = `feaver`
    } else if (newDayStreaks >= MINIMUM_STREAK) {
      reaction = `${newDayStreaks}ren`
    }
    app.client.reactions.add({
      token: context.botToken,
      channel: message.channel,
      name: reaction,
      timestamp: message.ts,
    })
  } else {
    newDayStreaks = 1
  }
  // データ更新
  return exercisesRef
    .doc(message.user)
    .update({
      dayStreaks: newDayStreaks,
      updatedAt: FieldValue.serverTimestamp(),
    })
    .catch(err => {
      throw new Error(err)
    })
})

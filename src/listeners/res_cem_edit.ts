import { app } from '../initializers/bolt'
import { FieldValue, firestore } from '../initializers/firebase'
import {
  CallbackId,
  Challenge,
  ChallengeStatus,
  Project,
  ProjectStatus,
} from '../types/slack'
import * as methods from '@slack/web-api/dist/methods'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ModalDto {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public projectTitle: string,
    public year: number,
    public month: number,
    public challengeArea: string,
    public description: string
  ) {}

  /**
   * プロジェクトのタイトルを取得する。
   * パス名が動的変更されるので、このように取得する。
   *
   * 元パス： payload.projectTitle{index}.projectTitle{index}.value
   * @param obj
   */
  public static toProjectTitle(obj: Object | unknown): string {
    if (obj instanceof Object) {
      const a = Object.values(obj)
      return a[0].value
    }
    return ``
  }

  public static toDescription(value) {
    if (value instanceof Object) {
      const a: Object[] = Object.values(value)
      const object = Object(a[0])
      // eslint-disable-next-line no-prototype-builtins
      if (object.hasOwnProperty(`value`)) {
        return object.value
      }
    }
    return ``
  }

  static toChallengeList(value: unknown) {
    if (value instanceof Object) {
      const a = Object.values(value)
      return a[0].value
    }
    return ``
  }

  static toYear(value: unknown) {
    if (value instanceof Object) {
      const a = Object.values(value)
      return Number(a[0].selected_option.value)
    }
    return 0
  }

  static toMonth(value: unknown) {
    if (value instanceof Object) {
      const a = Object.values(value)
      return Number(a[0].selected_option.value)
    }
    return 0
  }
}

class Key {
  // eslint-disable-next-line no-useless-constructor
  constructor(public key: string) {}

  public isProjectTitle() {
    return this.key.includes(`projectTitle`)
  }

  public isYear() {
    return this.key.includes(`year`)
  }

  public isMonth() {
    return this.key.includes(`month`)
  }

  public isDescription() {
    return this.key.includes(`description`)
  }

  public isChallenge() {
    return this.key.includes(`challenge`)
  }
}

async function addDeleteBatch(challengerRef, batch) {
  // HACK:呼び出し元で二重発行している
  const projectDeleteQuery = firestore
    .collection(`projects`)
    .where(`challenger`, `==`, challengerRef)
    .where(`status`, `==`, `draft`)

  const projects = await projectDeleteQuery.get().catch(err => {
    throw new Error(err)
  })

  for (const project of projects.docs) {
    const projectDel = firestore.collection(`projects`).doc(project.id)
    const challengesRef = await projectDel.collection(`challenges`).get()
    challengesRef.docs.forEach(challenge => {
      batch.delete(challenge.ref)
    })
    batch.delete(projectDel)
  }
}

async function createModalDtoList(view) {
  const payload = (view.state as any).values

  const modalDtoList: ModalDto[] = []

  let year = 0
  let month = 0
  let projectTitle = ``
  let description = `-` // ブランクだと、最後の更新が入らなくなる
  let challengeList = ``
  // key情報を無理やり取得する
  for (const [keys, value] of Object.entries(payload)) {
    const key = new Key(keys)
    if (key.isProjectTitle()) {
      projectTitle = ModalDto.toProjectTitle(value)
    }

    if (key.isYear()) {
      year = ModalDto.toYear(value)
    }

    if (key.isMonth()) {
      month = ModalDto.toMonth(value)
    }

    if (key.isDescription()) {
      description = ModalDto.toDescription(value)
    }

    if (key.isChallenge()) {
      challengeList = ModalDto.toChallengeList(value)
    }

    if (
      projectTitle !== `` &&
      year !== 0 &&
      month !== 0 &&
      description !== `-` &&
      challengeList !== ``
    ) {
      modalDtoList.push(
        new ModalDto(projectTitle, year, month, challengeList, description)
      )

      // reset
      projectTitle = ``
      year = 0
      month = 0
      description = `-`
      challengeList = ``
    }
  }
  return modalDtoList
}

async function addProjectBatch(
  challengerRef,
  modalDto: ModalDto,
  timestamp,
  projectsRef
) {
  const project: Project = {
    challenger: challengerRef,
    year: modalDto.year,
    month: modalDto.month,
    title: modalDto.projectTitle,
    status: ProjectStatus.Draft,
    description: modalDto.description,
    updatedAt: timestamp,
    createdAt: timestamp,
  }
  const projectRef = await projectsRef.add(project).catch(err => {
    throw new Error(err)
  })
  return projectRef
}

async function addChallengeBatch(
  modalDto: ModalDto,
  challengerRef,
  timestamp,
  batch,
  projectRef
) {
  // firestoreに挑戦を行ごとにパーズして保存
  for (const challengeName of modalDto.challengeArea.split(/\n/)) {
    if (challengeName === ``) {
      continue
    }
    const challenge: Challenge = {
      challenger: challengerRef,
      year: modalDto.year,
      month: modalDto.month,
      name: challengeName,
      status: ChallengeStatus.Draft,
      updatedAt: timestamp,
      createdAt: timestamp,
    }
    batch.set(projectRef.collection(`challenges`).doc(), challenge)
  }
}

async function addBatch(
  modalDtoList: ModalDto[],
  challengerRef,
  timestamp,
  projectsRef,
  batch
) {
  for (const modalDto of modalDtoList) {
    const projectRef = await addProjectBatch(
      challengerRef,
      modalDto,
      timestamp,
      projectsRef
    )
    await addChallengeBatch(
      modalDto,
      challengerRef,
      timestamp,
      batch,
      projectRef
    )
  }
}

app.view(CallbackId.CemEdit, async ({ ack, body, view, context }) => {
  ack()

  const user = body.user.id
  const challengerRef = firestore.collection(`challengers`).doc(user)
  const projectsRef = firestore.collection(`projects`)
  const timestamp = await FieldValue.serverTimestamp()
  const batch = firestore.batch()

  await addDeleteBatch(challengerRef, batch)
  const modalDtoList = await createModalDtoList(view)
  await addBatch(modalDtoList, challengerRef, timestamp, projectsRef, batch)

  await batch.commit()
  // 成功をSlack通知
  const msg: methods.ChatPostEphemeralArguments = {
    token: context.botToken,
    text: `プロジェクトを修正しました`,
    channel: body.view.private_metadata,
    user: user,
  }
  await app.client.chat.postEphemeral(msg).catch(err => {
    throw new Error(err)
  })
})

import { app } from '../initializers/bolt'
import { Message } from '../types/slack'

const helpText = `
こんにちは、CEMたろうです。\
このSlackワークスペースの説明をします。\n
\n
**ルール**\n
1. 月初にその月の挑戦目標を宣言します\n
2. 月の途中に進捗状況を報告、必要なら挑戦目標の修正をおこないます\n
3. 月末に挑戦目標の結果を報告します\n
\n
**分報チャンネル**\n
参加は自由に「分報」のチャンネルを作ることができます（必須ではありません）。\n
作業のログや行きづまってること、ポエム、シェア情報など好きに書いてOKな自分中心のチャンネルです。\n
雑に言えばこのSlack用のTwitter的な場所だと思ってください。\n
\n
使用方法は「{名前}_times」という規則に従ってチャンネルを作成するだけです。\n
良くわからない場合はまずはメンバーの分報チャンネルに参加してみると良いでしょう。\n
\n
**特殊なチャンネル**\n
このCEM Slackではカジュアルにチャンネルが作られますが、いくつかのチャンネルはルールが存在します。\n
- <https://app.slack.com/client/TFP53MPGV/CGK3VESBC|#01_目標>: 挑戦目標の宣言専用チャンネル\n
- <https://app.slack.com/client/TFP53MPGV/CGK3VESBC|#02_進捗報告>: 挑戦進捗の報告専用チャンネル\n
- <https://app.slack.com/client/TFP53MPGV/CGK3VESBC|#03_結果>: 挑戦結果の報告専用チャンネル\n
- <https://app.slack.com/client/TFP53MPGV/CGK3VESBC|#10_運動えらい>: 運動したことを報告し、みんなで褒め讃えあうチャンネル\n
- <https://app.slack.com/client/TFP53MPGV/CGK3VESBC|#20_英語only>: 英語学習のため英語onlyなチャンネル\n
- <https://app.slack.com/client/TFP53MPGV/CGK3VESBC|#30_運動えらい>: 読書したことを報告し、みんなで褒め讃えあうチャンネル\n
- <https://app.slack.com/client/TFP53MPGV/CGK3VESBC|#shout>: 愚痴や怒りなどの吐き捨て場、一定期間で発言が削除されるチャンネル\n
\n
** CEMたろうについて **\n
運営補助として独自のSlackAppである「CEMたろう」が動いています。\n
主な機能は、\n
- 挑戦目標の登録、宣言、結果振り返りサポート\n
- 運動えらいの連続記録サポート\n
などがあります。\n
\n
基本的にはスラッシュコマンドという発言欄に特殊な文字を打つ方法で実行し「/cem_*」のようになっています。\n
主なコマンドは、\n
- /cem_help : この説明を表示\n
- /cem_register {表示名} : 自分をユーザー登録または登録した表示名の変更\n
- /cem_new : 挑戦目標を新規登録（宣言はされません）\n
- /cem_publish : 登録した挑戦目標を宣言\n
- /cem_review : 宣言した挑戦目標の結果を振り返り\n
\n
より詳細な情報については<https://github.com/challenge-every-month/cem-app/wiki/ユーザーガイド|CEMたろうユーザーガイド>を参照してください。\n
\n
その他の参考文書:
- <https://github.com/challenge-every-month/cem-app|CEMたろうREADME>\n
- <https://github.com/challenge-every-month/cem-app/blob/master/.github/CONTRIBUTING.md|コントリビューションガイド>\n
- <https://github.com/challenge-every-month/cem-app/wiki/開発ガイド|CEMたろう開発ガイド>\n
`

app.command(`/cem_help`, async ({ payload, ack, context }) => {
  ack()
  try {
    const msg: Message = {
      token: context.botToken,
      mrkdwn: true,
      text: helpText,
      channel: payload.channel_id,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg as any)
  } catch (error) {
    console.error(`Error:`, error)
    const msg: Message = {
      token: context.botToken,
      text: `Error: ${error}`,
      channel: payload.channel_id,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg as any)
  }
})

# CEM-App
Challenge Every Monthコミュニティ用SlackApp。

## 環境
+ Node.js（v10)
+ Google App Engine
+ Firestore
+ TypeScript

## 仕様
### データ設計
+ challenger: 挑戦者。一般的に言うユーザーと同義
+ project: challengeを複数まとめたもの。月ごとに複数設定できる。ジャンル分けとして利用するような想定
+ challenge: 挑戦や目標。一行程度を想定しており、projectに属する

### コマンド設計
+ [x] cem_register: 挑戦者登録
+ [x] cem_new: プロジェクトとチャレンジの登録
+ [ ] cem_edit: 登録されたプロジェクトとチャンレンジの修正、変更
+ [ ] cem_delete: 登録されたプロジェクトとチャンレンジの削除
+ [ ] cem_publish: 登録されたプロジェクトの表明
+ [ ] cem_review: 表明されているプロジェクトの振り返り

### リマインダー設定
+ [ ] 月の始めに挑戦目標を表明するようにリマインド
+ [ ] 月の一定の日時にまだ行なわれてないものにリマインド
  + [ ] まだ前月の振り返りが行われてない場合
  + [ ] まだ今月の挑戦目標を表明されてない場合
  + [ ] どちらもされているが進捗確認を促す場合
+ [ ] 月の終わりに振り返りを促すためのリマインド

## 開発
### Requirement
+ Node.js(v10以降）
+ autossh（動作確認にserveoを使用する場合のみ）
+ Firestore（開発、動作確認用）
+ Slackワークグループ（開発、動作確認用）

```sh
$ npm install # or $ yarn install
$ npm run dev # or $ yarn dev
```

### 動作確認について
#### autossh
開発中のコードを動作確認しやすいようにデフォルトのコマンドにはserveoを使うことを前提としています。serveoはsshでつなぎますが、接続が切れやすいのでautosshを併用することも合わせて前提としています。

autosshについてはmacOSの場合
```sh
$ brew install autossh
```

を実行します。

#### Firestore
永続データの保存先としてFirestoreを使用します。開発者が開発中のコードを動作確認をするためにはご自身でFirestoreを用意する必要があります。
Firestoreを用意した後、「[Cloud Firestore を使ってみる  \|  Firebase](https://firebase.google.com/docs/firestore/quickstart?hl=ja)」を参考に[サービスアカウント]https://cloud.google.com/compute/docs/authentication?hl=ja）経由でJSONファイルの鍵を作成してください。
その鍵をプロジェクトルートに`serviceAccountKey.json`という名前のファイルで設置してください。

#### 開発用ローカルサーバーの起動
その後、上に記載のように
```sh
$ npm run dev
```

を実行するとautossh経由でserveoと接続をします。serveoはデフォルトでは`https://cem-dev.serveo.net`に接続します。これは`Procfile`に記載されています。他の開発者が使用しているケースを考慮して変更されることをオススメします。

なお、nodemonを使ってファイルの保存時に自動的にサーバーに適用しているため、一度起動したらその後は意識する必要はありません。

### デプロイ
デプロイはPullRequestをマージ時に自動的に実行されるため意識する必要はありません。

### PullRequestとcommit
PullRequestは大歓迎です。
その際は自動で表示されるテンプレートに従うと書きやすいので是非ご活用ください。

commitの際は`npm run commit`や`yarn commit`を実行すると対話的にコミットメッセージを作成できるのでご活用ください（必須ではありません）。

### 問題報告/機能要望
問題報告、機能要望、どちらも歓迎しています。こちらもテンプレートを用意していますので是非ご活用ください。

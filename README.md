# CEM-App
Challenge Every Monthコミュニティ用SlackApp。

+ [ユーザーガイド](/challenge-every-month/cem-app/wiki/ユーザーガイド): Appの使用方法をまとめています。
+ [Project:ROADMAP](/challenge-every-month/cem-app/projects/1): IssueやTodoを管理しています。
+ [コントリビューションガイド](/challenge-every-month/cem-app/blob/master/.github/CONTRIBUTING.md): このプロジェクトへの貢献方法ガイドです。
+ [開発ガイド](/challenge-every-month/cem-app/wiki/開発ガイド): 開発環境の構築や開発方法についてまとめています。

- - -

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
+ [x] cem_delete: 登録されたプロジェクトとチャンレンジの削除
+ [x] cem_publish: 登録されたプロジェクトの表明
+ [x] cem_review: 表明されているプロジェクトの振り返り

### リマインダー設定
+ [x] 月の始めに挑戦目標を表明するようにリマインド
+ [ ] 月の一定の日時にまだ行なわれてないものをリマインド
  + [ ] まだ前月の振り返りが行われてない場合
  + [ ] まだ今月の挑戦目標を表明されてない場合
  + [x] どちらもされているが進捗確認を促す場合
+ [x] 月の終わりに振り返りを促すためのリマインド

- - -
## 貢献者のみなさん
このプロジェクトに貢献してくれたみなさん

[Contributors](https://github.com/challenge-every-month/cem-app/graphs/contributors)

開発に携わる以外にも貢献できる方法（e.g. 意見の交換、ドキュメントの更新）もありますので、お力添えいただける場合は是非[コントリビューションガイド](/challenge-every-month/cem-app/blob/master/.github/CONTRIBUTING.md)も参照してみてください。

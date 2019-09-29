'use strict';
module.exports = {
  types: [
    {
      value: 'feat',
      name: 'feat:     新機能',
      title: 'Features'
    },
    {
      value: 'fix',
      name: 'fix:      バグ修正',
      title: 'Bug Fixes'
    },
    {
      value: 'HOTFIX',
      name: 'HOTFIX:   致命的で緊急なバグ修正',
      title: 'Critical hotfix'
    },
    {
      value: 'UI',
      name: 'UI:       UIやスタイルの更新',
      title: 'UI'
    },
    {
      value: 'docs',
      name: 'docs:     ドキュメントのみの変更',
      title: 'Documentation'
    },
    {
      value: 'style',
      name: 'style:    （動作に影響しない）コードフォーマットの変更',
      title: 'Styles'
    },
    {
      value: 'texts',
      name: 'texts:    文字や文章の更新',
      title: 'Text and literals'
    },
    {
      value: 'typo',
      name: 'typo:     タイプミスの修正',
      title: 'Typos'
    },
    {
      value: 'refactor',
      name: 'refactor: （機能追加やバグ修正を含まない）リファクタリング',
      title: 'Code Refactoring'
    },
    {
      value: 'perf',
      name: 'perf:     パフォーマンスの改善のための変更',
      title: 'Performance Improvements'
    },
    {
      value: 'UX',
      name: 'UX:       ユーザーエクスペリエンス/ユーザビリティの改善',
      title: 'UX'
    },
    {
      value: 'test',
      name: 'test:     不足テストの追加や既存テストの修正',
      title: 'Tests'
    },
    {
      value: 'config',
      name: 'config:   設定の追加や変更',
      title: 'Configuration'
    },
    {
      value: 'library',
      name: 'library:  外部ライブラリの追加、変更、削除',
      title: 'Library'
    },
    {
      value: 'CI',
      name: 'CI:       CI用の設定やスクリプトに関する変更',
      title: 'CI'
    },
    {
      value: 'chore',
      name: 'chore:    その他の変更',
      title: 'Chores'
    },
    {
      value: 'WIP',
      name: 'WIP:      作業中',
      title: 'WIP'
    }
  ],
  scopes: [
    // { name: '*' },
  ],
  messages: {
    type: 'コミットする変更タイプを選択:\n',
    // scope: '変更内容のスコープ(例:コンポーネントやファイル名)(optional):\n',
    // used if allowCustomScopes is true
    customScope: '変更内容のスコープ(例:コンポーネントやファイル名)(optional):\n',
    subject: '変更内容を要約した本質的説明:\n',
    body: '変更内容の詳細（"|"で改行）(optional):\n',
    breaking: '破壊的変更についての記述(optional):\n',
    footer: '関連issueを追記 (例:"fix #123", "re #123")(optional):\n',
    confirmCommit: 'このコミット内容でよろしいですか?'
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix']
};

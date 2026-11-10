# Issue tracker: Linear

課題と仕様は Linear の Asonas チーム（キー ASO）で管理する。
Linear の操作には Linear MCP サーバーのツールを使用する。
Issue を起票するときは to-tickets スキルを使う。

## 基本操作

- 作成: ASO チームに Issue を作成する
- 読み取り: Issue の本文・ラベル・状態・コメントを取得する
- 一覧: Asonas チーム（キー ASO）の未完了 Issue を取得する
- コメント: 対象 Issue にコメントを追加する
- ラベル追加・削除: Issue のラベルを更新する
- 完了: Issue の状態を完了に変更する

プロジェクトは固定しない。
Issue をプロジェクトに入れる必要があるときは、ユーザーに確認する。

## スキルからの参照

「issue tracker に公開する」は Asonas チーム（キー ASO）への Linear Issue の作成を意味する。
「関連チケットを取得する」は該当 Issue の本文・ラベル・コメントを読むことを意味する。
Issue は Linear の識別子（例: ASO-123）で参照する。

## Wayfinding operations

- Map: wayfinder:map ラベルを付けた Issue に、メモ・決定事項・未解決事項を記録する。
- 子チケット: Map の sub-issue として作成する。
- 種別: wayfinder:research、wayfinder:prototype、
  wayfinder:grilling、wayfinder:task のラベルを使用する。
- 依存関係: Linear の blocks / blocked by リレーションで記録する。
- 次の対象: 未完了・未割当で、未完了の依存先がない子チケットを Map 順に選ぶ。
- 着手: 作業開始前に担当者を割り当てる。
- 解決: 回答をコメントして Issue を完了にし、Map の決定事項に要旨とリンクを追記する。

Issue 作成やコメント投稿などの外部操作は、その作業でユーザーが許可した範囲で行う。

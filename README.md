# clip.ason.as

テキストと画像を集める、自分専用のAT Protocolクリップ帳。

## 現在の段階

プロジェクトの初期構築中。設計書は承認済み。PDSアカウント作成、OAuth、投稿・更新・削除、本番配備は未実施。

## 設計と作業管理

- [承認済み設計](docs/product-plan.md)
- [最初の実装範囲](docs/implementation.md)
- [用語集](GLOSSARY.md)
- [採用した方針](docs/adr/0001-publish-personal-clips-on-atproto.md)
- 作業管理: Linear の Asonas チーム（キー ASO）。詳細は [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

## 開発環境

Node.jsはmiseで管理する。依存関係のインストールは`mise exec -- npm ci`。

完成した初期機能と検証手順は、実装とともにこのファイルへ追記する。

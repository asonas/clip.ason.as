# ADR 0001: 個人のクリップをAT Protocolへ公開する

Status: Accepted for product direction; infrastructure validation pending

## 決定

投稿者は本人一人。Chrome拡張から文章・画像を取り込み、明示的な投稿操作で公開する。下書き機能は設けず、公開後の編集・削除を可能にする。

PDSの公開レコードを原本にし、サイトは表示コピーを持つ。Cloudflareの既存Paid契約を使う構成を優先し、PDSはCirrusを先に検証する。独自クリップを主にし、Bluesky紹介投稿も試す。見た目はFigmaで別途決定する。

## 理由と帰結

閲覧と保存を分けることで、閲覧ごとのPDSアクセスを避け、サイトの再構築を可能にする。Cirrusは実験的ベータなので、認証・独自レコード・復元・新規DIDの扱いを確認してから本番採用する。

仮Lexicon名はas.ason.clip.entry。配信先との互換性や本番採用が確定したと解釈しない。

## 根拠

[2026-10-28の承認済み設計](../product-plan.md)。

# 人類専用マッチングアプリ

人類による、人類のためのマッチングアプリ。

[https://uec-matching.mimifuwacc.workers.dev/](https://uec-matching.mimifuwacc.workers.dev/) からインスピレーションを受けています。

## 技術スタック

- [Solid.js](https://solidjs.com/) + [Vite](https://vite.dev/)
- [typescript-go (tsgo)](https://github.com/microsoft/typescript-go) — 型チェック
- [oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter) — Lint/Format
- [@faker-js/faker](https://fakerjs.dev/) — 21ロケールぶんの姓名データ
- [@chenglou/pretext](https://github.com/chenglou/pretext) — DOM非依存のテキスト寸法計測

## 仕組み

- 80億行を tanstack-virtual 等に渡すと内部配列で固まるため、**自前の固定高さ仮想スクロール**を実装
- 行高さは Pretext の `prepare` / `layout` で、200件サンプルした平均値を採用 (DOM reflow を踏まずに算出)
- ネイティブのスクロールバーは使わず、`wheel` / `touch` イベントで仮想スクロール位置を 1:1 で加算。80億行 × 行高さの座標空間を保持しつつ、見えている ~10 行だけを描画
- プロフィールは `index` ベースのハッシュで決定論的に生成。faker のロケールも同ハッシュから選択 (日本語/英語/中国語/韓国語/アラビア語/ペルシャ語/ヘブライ語/タミル語/ネパール語/ロシア語/ギリシャ語/トルコ語/タイ語/ベトナム語/フランス語/ドイツ語/スペイン語/アルメニア語/グルジア語/ヨルバ語/ズールー語)

## 開発

```sh
pnpm install
pnpm dev        # 開発サーバ
pnpm typecheck  # tsgo で型チェック
pnpm lint       # oxlint
pnpm format     # oxfmt
pnpm build      # tsgo + vite build
pnpm preview    # ビルド成果物のプレビュー
```

## ライセンス

© 2026 imaimai17468

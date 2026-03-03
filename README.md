# CSV Reader

ブラウザで完結するCSVビューア。ソート・フィルタ・編集・エクスポートに対応。
データはサーバーに送信されず、すべてブラウザ内で処理されます。

## Features

- **ファイル読み込み** - ドラッグ&ドロップ / ファイル選択、Shift_JIS自動判定
- **仮想スクロール** - 数万行のCSVも快適に表示
- **ソート** - カラムヘッダクリックで昇順/降順/解除トグル
- **フィルタ** - カラムごとの部分一致フィルタ（大文字小文字区別なし）
- **セル編集** - ダブルクリックで編集、編集済みセルは黄色ハイライト
- **行選択 & コピー** - チェックボックス選択 → TSV形式でクリップボードにコピー
- **エクスポート** - UTF-8 BOM付きCSVダウンロード（全データ / フィルタ済み）
- **多言語対応** - 日本語 / English
- **PWA** - オフライン対応、インストール可能

## Tech Stack

| カテゴリ | ライブラリ |
|---------|-----------|
| フレームワーク | React + TypeScript |
| ビルドツール | Vite |
| テーブル | TanStack Table v8 |
| 仮想スクロール | @tanstack/react-virtual |
| CSVパース | PapaParse |
| 文字コード | encoding-japanese |
| スタイリング | Tailwind CSS v4 |
| i18n | react-i18next |
| PWA | vite-plugin-pwa |

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

出力先: `dist/`

## Deploy

Cloudflare Pages でホスティング。
`main` ブランチへのプッシュで自動デプロイされます。

- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`

## Architecture

ファイルI/Oはカスタム Hook に分離しており、将来的な Tauri デスクトップアプリ化の際は Hook の内部実装のみ差し替えれば対応可能です。

```
src/
├── hooks/          # I/O抽象レイヤー (useFileLoader, useFileExporter, useClipboardCopy)
├── components/     # UIコンポーネント
│   └── table/      # テーブル関連 (仮想スクロール, ソート, フィルタ, セル編集)
├── types/          # 型定義
├── locales/        # 翻訳ファイル (ja, en)
└── i18n.ts         # i18n設定
```

## Privacy

アップロードされたファイルはブラウザ内でのみ処理され、外部サーバーには一切送信されません。

## License

MIT

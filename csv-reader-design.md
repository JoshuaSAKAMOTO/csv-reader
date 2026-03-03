# CSV Reader 設計書

## 1. 概要

GUIでCSVファイルを閲覧・編集できるWebアプリケーション。
将来的にTauriでデスクトップアプリ化することを前提に設計する。

---

## 2. 機能要件

### 2.1 ファイル読み込み

- ドラッグ&ドロップ、またはファイル選択ダイアログからCSVを読み込む
- 文字コード自動判定（UTF-8 / Shift_JIS）
  - `encoding-japanese` で判定し、UTF-8に変換してからパースする
- PapaParseでCSVをパース（ヘッダー自動認識）

### 2.2 テーブル表示

- TanStack Table (v8) でテーブルを描画
- 数万行に対応するため `@tanstack/react-virtual` で仮想スクロールを実装
- 行番号の表示

### 2.3 ソート

- カラムヘッダクリックで昇順 → 降順 → ソート解除 のトグル
- ソート状態をヘッダにアイコンで表示（▲▼）

### 2.4 フィルタリング

- 各カラムヘッダ下にテキスト入力欄を配置
- 部分一致フィルタ（大文字小文字を区別しない）
- フィルタ中は該当行数をステータスバーに表示

### 2.5 セル編集

- セルをダブルクリックで編集モードに入る
- Enter または フォーカスアウト で確定
- Escape でキャンセル
- 編集済みセルを視覚的にハイライト（背景色変更など）

### 2.6 行選択 & コピー

- 各行にチェックボックスを配置
- ヘッダのチェックボックスで全選択/全解除
- 「コピー」ボタンで選択行をヘッダ付きTSV形式でクリップボードにコピー
  - TSV形式にすることでExcelやスプレッドシートにそのまま貼り付け可能

### 2.7 エクスポート

- 「ダウンロード」ボタンでCSVファイルとして保存
- エクスポート対象の選択: 全データ or フィルタ済みデータ
- 文字コード: UTF-8（BOM付き）でExcelとの互換性を確保

---

## 3. 技術スタック

| カテゴリ | ライブラリ | 用途 |
|---------|-----------|------|
| フレームワーク | React + TypeScript | UI構築 |
| ビルドツール | Vite | 開発・ビルド |
| CSVパース | PapaParse | CSV ↔ 配列の変換 |
| テーブル | TanStack Table v8 | ソート・フィルタ・状態管理 |
| 仮想スクロール | @tanstack/react-virtual | 大量行の高速描画 |
| 文字コード | encoding-japanese | Shift_JIS判定・変換 |
| スタイリング | Tailwind CSS | UIデザイン |
| i18n | react-i18next + i18next | 多言語対応（日本語・英語） |
| PWA | vite-plugin-pwa | オフライン対応・インストール |

---

## 4. コンポーネント構成

```
App
├── FileUploader           … ドラッグ&ドロップ / ファイル選択
├── Toolbar                … エクスポート / コピー / フィルタクリア
│   ├── ExportButton       … ダウンロードボタン（対象選択付き）
│   ├── CopyButton         … 選択行コピーボタン
│   ├── ClearFilterButton  … フィルタ全クリアボタン
│   └── LanguageSwitcher   … 日本語/英語 切替
├── DataTable              … メインのテーブル
│   ├── TableHeader        … カラムヘッダ（ソートトグル付き）
│   ├── FilterRow          … カラムごとのフィルタ入力欄
│   └── TableBody          … 仮想スクロールで行を描画（セル編集機能込み）
├── StatusBar              … 総行数 / フィルタ後行数 / 選択行数
├── PrivacyNotice          … プライバシー表示（フッター）
└── InstallPrompt          … PWAインストール導線
```

---

## 5. 主要なカスタムHooks

ファイルI/Oは将来のTauri対応を見据え、カスタムHookに分離する。
Tauri化の際はHookの内部実装だけを差し替えればよい設計にする。

### 5.1 `useFileLoader`

```typescript
// Web版: File API + FileReader を使用
// Tauri版: @tauri-apps/api/dialog + fs を使用に差し替え
function useFileLoader(): {
  loadFile: () => Promise<void>;       // ファイル選択ダイアログを開く
  handleDrop: (e: DragEvent) => void;  // ドラッグ&ドロップ処理
  rawData: string[][];                 // パース済みデータ
  headers: string[];                   // ヘッダ行
  fileName: string | null;             // 読み込んだファイル名
  isLoading: boolean;
};
```

内部処理フロー:
1. ファイル取得（File API or Tauri dialog）
2. `encoding-japanese` で文字コード判定
3. 必要に応じてShift_JIS → UTF-8 変換
4. PapaParseでパース
5. state に格納

### 5.2 `useFileExporter`

```typescript
// Web版: Blob + <a> ダウンロード
// Tauri版: @tauri-apps/api/dialog (save) + fs.writeBinaryFile に差し替え
function useFileExporter(): {
  exportCsv: (data: string[][], headers: string[], fileName: string) => void;
};
```

内部処理フロー:
1. PapaParseで配列 → CSV文字列に変換
2. UTF-8 BOMを先頭に付与
3. Blobを作成してダウンロード（or Tauriの保存ダイアログ）

### 5.3 `useClipboardCopy`

```typescript
// Web版: navigator.clipboard.writeText
// Tauri版: @tauri-apps/api/clipboard に差し替え
function useClipboardCopy(): {
  copyRows: (headers: string[], rows: string[][]) => Promise<void>;
};
```

内部処理フロー:
1. ヘッダ + 選択行をTSV形式の文字列に変換
2. クリップボードに書き込み

---

## 6. データフロー

```
[ファイル選択/ドロップ]
    ↓
[useFileLoader] → rawData, headers を state にセット
    ↓
[TanStack Table] ← rawData を受け取りテーブル構築
    ↓
  ├── ソート状態 (sorting)
  ├── フィルタ状態 (columnFilters)
  ├── 行選択状態 (rowSelection)
  └── 編集データ (editedCells: Map<rowId-colId, value>)
    ↓
[表示] filteredRows → 仮想スクロールで描画
    ↓
[エクスポート/コピー] 現在の状態に基づいてデータを出力
```

---

## 7. Tauri移行ガイド

Tauri化の際に変更が必要な箇所を限定するための方針。

### 変更が必要な箇所（Hookの内部実装のみ）

| Hook | Web実装 | Tauri実装 |
|------|---------|-----------|
| `useFileLoader` | File API + FileReader | `@tauri-apps/api/dialog` + `fs` |
| `useFileExporter` | Blob + `<a>` download | `dialog.save()` + `fs.writeBinaryFile` |
| `useClipboardCopy` | `navigator.clipboard` | `@tauri-apps/api/clipboard` |

### 変更不要な箇所

- コンポーネント全般（UI・テーブル・ツールバー等）
- TanStack Tableの設定（ソート・フィルタ・選択ロジック）
- PapaParseによるCSVパース処理
- スタイリング

### 将来的な最適化（任意）

- Shift_JIS変換をRust側（`encoding_rs`）に移して高速化
- 大規模ファイル読み込みをRustでストリーム処理

---

## 8. デプロイ・公開

### 8.1 ホスティング

- **Cloudflare Pages** を使用
- GitHubリポジトリと連携し、`main` ブランチへのpushで自動デプロイ
- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`

### 8.2 OGP / メタ情報

`index.html` に以下を設定する:

```html
<meta property="og:title" content="CSV Reader" />
<meta property="og:description" content="ブラウザで完結するCSVビューア。ソート・フィルタ・編集・エクスポート対応。データはサーバーに送信されません。" />
<meta property="og:type" content="website" />
<meta property="og:image" content="/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
```

- OGP画像（1200x630px）はアプリのスクリーンショット風のものを用意する

### 8.3 多言語対応 (i18n)

- `react-i18next` + `i18next` を使用
- 対応言語: 日本語（デフォルト）、英語
- 翻訳ファイル構成:

```
src/
  locales/
    ja/
      translation.json
    en/
      translation.json
```

- ブラウザの言語設定で自動切替 + UIに言語切替ボタンを配置
- 翻訳対象: UIラベル、プレースホルダ、ステータスメッセージ、エラーメッセージ

### 8.4 PWA対応

- `vite-plugin-pwa` を使用
- Service Workerでアセットをキャッシュし、オフラインでも動作可能にする
- マニフェスト設定:

```json
{
  "name": "CSV Reader",
  "short_name": "CSV Reader",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- インストールプロンプトの表示（「ホーム画面に追加」導線）

### 8.5 プライバシー

- CSVファイルは**完全にブラウザ内で処理**され、サーバーへの送信は一切行わない
- フッターまたは専用ページに以下を明記する:
  - 「アップロードされたファイルはお使いのブラウザ内でのみ処理され、外部サーバーには一切送信されません」
  - 「Your files are processed entirely in your browser. No data is sent to any server.」（英語版）
- アクセス解析は導入しない（ユーザーの信頼性を優先）

---

## 9. UI設計メモ

- ファイル未読み込み時: ドラッグ&ドロップエリアを中央に大きく表示
- ファイル読み込み後: ツールバー + テーブル + ステータスバーのレイアウト
- 編集済みセルは薄い黄色の背景でハイライト
- ソートアイコンは現在のソート方向を示す（▲昇順 / ▼降順 / グレーでソートなし）
- フィルタ入力欄にはプレースホルダで「フィルタ...」と表示
- レスポンシブ対応: テーブルは水平スクロール可能にする

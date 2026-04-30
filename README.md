# MiniSNS - 完全ガイド

プロジェクト・環境構築、API仕様、デプロイメント方法を記載した完全ガイド。

## 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [環境構築](#環境構築)
3. [バックエンドGAS セットアップ](#バックエンドgas-セットアップ)
4. [フロントエンドセットアップ](#フロントエンドセットアップ)
5. [API仕様](#api仕様)
6. [デプロイメント](#デプロイメント)
7. [トラブルシューティング](#トラブルシューティング)

---

## プロジェクト概要

**MiniSNS** は、Google Spreadsheet と Google Apps Script を組み合わせた軽量なSNSアプリケーション。

### テクノロジー

| レイヤー | 技術スタック |
|---------|-----------|
| **フロントエンド** | Ionic / React / TypeScript / Vite |
| **バックエンド** | Google Apps Script (GAS) |
| **データベース** | Google Spreadsheet |
| **ファイル保存** | Google Drive |

### 機能

- ✁Eユーザー登録・ログイン・トークン認証
- ✁E投稿作成・一覧表示・削除
- ✁E投稿への返信機能
- ✁E5日間・セッション有効期限
- ✁E論理削除による安全なデータ管理

---

## 環境構築

### 必要なツール

- Node.js 18+
- npm または yarn
- Google アカウント
- Git

### リポジトリをクローン

```bash
git clone <YOUR_REPO_URL>
cd my-sns
```

### 依存パッケージをインストール

```bash
npm install
# または
yarn install
```

### ローカルサーバーで実行

```bash
npm run dev
# ブラウザで http://localhost:5173 にアクセス
```

---

## バックエンドGAS セットアップ

### Google Drive でフォルダ構成を作成

1. Google Drive を開く
2. 新規フォルダ `MiniSNS` を作成
3. その中に以下を作成・
   - `image` フォルダ・画像保存用、有設定を「リンクを知っている全員・閲覧者・に変更
   - `MiniSNSDB` スプレッドシート（新規作成）

### スプレッドシートにシートを作成

`MiniSNSDB` スプレッドシートを開き、以下の3つのシートを作成します。

**1. UserInformation_Tbl**

1行目に以下をヘッダーとして記載・
```
UserID | UserName | Mail | CreatedAt | Authority | UpdateAt | DeleteFlag | LoginDate | LoginToken | password | ProfileTxt | ProfileImageID
```

**2. Bord_Tbl**

1行目に以下をヘッダーとして記載・
```
PostID | UserID | PostTxt | PostDate | UpdateDate | DeleteFlag
```

**3. Reply_Tbl**

1行目に以下をヘッダーとして記載・
```
ReplyID | PostID | UserID | ReplyTxt | ReplyDate | UpdateDate | DeleteFlag
```

### GAS プロジェクトを作成

1. `MiniSNSDB` スプレッドシートを開く
2. 「拡張機能」・「Apps Script」をクリック
3. プロジェクト名を`BordAppAPIs` に変更
4. 左側の「＋」ボタンから、以下の順でスクリプトファイル（.js）を作成・
   - `Config.js`
   - `Common.js`
   - `Auth.js`
   - `BordOperation.js`
   - `ReplyOperation.js`
   - `Main.js`

### GAS ファイルをコピー

プロジェクト・ `GAS/Script/` フォルダにある各`.js` ファイルの内容を、
GAS エディタの対応するファイルにコピー・ペースト。

### Config.js を設定

GAS プロジェクトで `Config.js` を開き、以下を自分の情報に置き換え！

```javascript
// MiniSNSDB スプレッドシートID
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

// image フォルダID
const IMAGE_FOLDER_ID = "YOUR_FOLDER_ID_HERE";
```

**IDの取得方法・

- **SPREADSHEET_ID**: MiniSNSDB のURL から `https://docs.google.com/spreadsheets/d/{ID}/edit` ・{ID}
- **IMAGE_FOLDER_ID**: image フォルダのURL から `https://drive.google.com/drive/folders/{ID}` ・{ID}

### テスト実行

GAS エディタのコンソール・View → Logs・で、
以下を実行してテストしましょう・

```javascript
testAPIs();
```

コンソール出力を確認して、各処理が正常に動作するか確認。

### デプロイ

1. 「デプロイ」・「新しいデプロイ」をクリック
2. タイプを「ウェブアプリ」に設定
3. 実行者を「自分」に設定
4. アクセス者を「すべての人」に設定
5. 「デプロイ」ボタンをクリック
6. 表示された**デプロイID** をメモする

---

## フロントエンドセットアップ

### GAS デプロイIDを設定

`src/services/api.ts` を開き、以下・部分を編集・

```typescript
const GAS_DEPLOYMENT_ID = "YOUR_GAS_DEPLOYMENT_ID_HERE";
// ・GAS デプロイ時に取得したIDに置き換え
```

### ローカルで実行

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス。

### ユーザー登録・ログイン

1. ログインページで「新規ユーザー登録」をクリック
2. ユーザー名、メール、パスワードを入力
3. 登録後、・動的にログイン
4. ホーム画面で投稿・返信が可能

---

## API仕様

### 認証API

#### ログイン

**リクエスト**:
```json
{
  "mode": "login",
  "username": "testuser",
  "password": "password123"
}
```

**レスポンス成功例**:
```json
{
  "status": "ok",
  "message": "ログインに成功しました",
  "data": {
    "userId": "usr_1234567890_xxxx",
    "username": "testuser",
    "email": "test@example.com",
    "token": "uuid-token-xxxx",
    "profileTxt": "プロフィール文"
  }
}
```

#### 自動ログイン

**リクエスト**:
```json
{
  "mode": "auto_login",
  "token": "saved-token-uuid"
}
```

#### ユーザー登録

**リクエスト**:
```json
{
  "mode": "registUser",
  "username": "newuser",
  "email": "new@example.com",
  "password": "Password123",
  "passwordConfirm": "Password123"
}
```

### 投稿API

#### 投稿作成

**リクエスト**:
```json
{
  "mode": "createPost",
  "token": "user-token",
  "content": "今日の投稿です！"
}
```

#### 投稿一覧取得

**リクエスト** (GET):
```
GET ?mode=getPosts&limit=20&offset=0
```

**レスポンス**:
```json
{
  "status": "ok",
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [
      {
        "postId": "pst_xxxx",
        "userId": "usr_xxxx",
        "username": "testuser",
        "content": "投稿内容",
        "timestamp": "2026-04-30T10:30:00Z",
        "profileImageId": "prf_1"
      }
    ],
    "total": 10,
    "limit": 20,
    "offset": 0
  }
}
```

#### 投稿削除

**リクエスト**:
```json
{
  "mode": "deletePost",
  "token": "user-token",
  "postId": "pst_xxxx"
}
```

### 返信API

#### 返信作成

**リクエスト**:
```json
{
  "mode": "createReply",
  "token": "user-token",
  "postId": "pst_xxxx",
  "content": "返信内容"
}
```

#### 返信一覧取得

**リクエスト** (GET):
```
GET ?mode=getReplies&postId=pst_xxxx&limit=20&offset=0
```

---

## デプロイメント

### Ionic ビルド

```bash
npm run build
```

`dist/` フォルダが生成されます。

### Capacitor でネイティブアプリ化（オプション）

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
npx cap build android
npx cap build ios
```

### Web版・デプロイ

#### GitHub Pages
```bash
npm run deploy
```

#### Vercel
```bash
vercel
```

---

## トラブルシューティング

### Q: エラー99が発生する

**A**: トークンが5日以上前のもの。・度ログインしてください。

```javascript
// 詳細設計書より
トークン認証時には、「5日ルール」を適用し、
期限切れの場合・トークンを無効化（エラー99）します。
```

### Q: 投稿が表示されない

**A**: 以下を確認してください・

1. GAS のデプロイID が正しいか確認
2. `src/services/api.ts` の `GAS_DEPLOYMENT_ID` が設定されているか確認
3. GAS デプロイの「アクセス」が「すべての人」になっているか確認
4. ブラウザのコンソール・F12・でエラーメッセージを確認

### Q: "シートが見つかりません" エラー

**A**: `Config.js` の以下を確認！

```javascript
const SPREADSHEET_ID = "正しいシートID";
const SHEET_NAMES = {
  USERS: "UserInformation_Tbl",
  POSTS: "Bord_Tbl",
  REPLIES: "Reply_Tbl"
};
```

シート名のスペルが正確に一致していることを確認。

### Q: CORS エラーが発生する

**A**: GAS は正しく ContentService を使用して JSON を返していますが、
クライアント・フロントエンド）が CORS に対応していることを確認。
Ionic の開発サーバーはデフォルトで CORS を許可しています。

### Q: ローカルストレージにトークンが保存されない

**A**: ブラウザのプライベートシークレットモードで実行しているか確認。
また、ブラウザの開発者ツール・F12・「Application」・「LocalStorage」で確認可能。

---

## ファイル構成

```
my-sns/
├── GAS/
━E  ├── Script/
━E  ━E  ├── Config.js          ・スプレッドシートID・定数定義
━E  ━E  ├── Common.js          ・ハッシュ、トークン生成等共通関数
━E  ━E  ├── Auth.js            ・ログイン・ユーザー登録処理
━E  ━E  ├── BordOperation.js   ・投稿操作
━E  ━E  ├── ReplyOperation.js  ・返信操作
━E  ━E  └── Main.js            ・APIエントリポイント
━E  ├── 概要.md
━E  ├── 詳細設計書.md
━E  ├── 実装ガイド.md
━E  └── MiniSNSDB.xlsx         ・スプレッドシート・バックアップ
├── src/
━E  ├── services/
━E  ━E  └── api.ts             ・GAS API通信層
━E  ├── components/
━E  ━E  ├── LoginForm.tsx
━E  ━E  ├── PostFormModal.tsx
━E  ━E  └── PostList.tsx
━E  ├── pages/
━E  ━E  ├── Tab1.tsx
━E  ━E  ├── Tab2.tsx
━E  ━E  └── Tab3.tsx
━E  ├── App.tsx
━E  └── main.tsx
├── package.json
└── README.md
```

---

## セキュリティ重要事項

✁E**パスワード保存**
- SHA-256(password + UserID) でハッシュ化
- プレーンテキスト・保存しない

✁E**トークン管理**
- リクエストごとにUUIDで再発行（スライディングセッション方式）
- 5日の有効期限
- 期限切れは自動的に無効化

✁E**論理削除**
- データは物理削除せず DeleteFlag = 1 で標記
- 取得系APIでフィルタ

✁E**本番環境**
- Google Drive のシート・有設定をチェック
- image フォルダは「閲覧者」まま
- GAS デプロイの「アクセス」・「自分のみ」に変更検討

---

## ライセンス

MIT License

---

## 開発チーム

Developed with ❤・using Google Apps Script + Ionic + React
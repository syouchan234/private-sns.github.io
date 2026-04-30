# MiniSNS セットアップガイド

## 概要

このガイドでは、MiniSNS の完全なセットアップ手順をステップバイステップで説明します。

## 前提条件

- Google アカウント
- Node.js 18 以上
- npm または yarn
- Git

## ステップ1: リポジトリのクローン

```bash
git clone <YOUR_REPO_URL>
cd my-sns
```

## ステップ2: 依存関係のインストール

```bash
npm install
```

## ステップ3: Google Drive の準備

### 3.1 フォルダ構成の作成

1. [Google Drive](https://drive.google.com) を開く
2. 「新規」→「フォルダ」をクリック
3. フォルダ名を `MiniSNS` として作成

### 3.2 画像保存用フォルダの作成

1. `MiniSNS` フォルダを開く
2. 「新規」→「フォルダ」をクリック
3. フォルダ名を `image` として作成
4. `image` フォルダを右クリック→「共有」をクリック
5. 「リンクを知っている全員に変更」をクリック
6. 権限を「閲覧者」に設定
7. 「完了」をクリック

### 3.3 スプレッドシートの作成

1. `MiniSNS` フォルダを開く
2. 「新規」→「Google スプレッドシート」をクリック
3. ファイル名を `MiniSNSDB` として保存

## ステップ4: スプレッドシートの設定

### 4.1 シートの作成

`MiniSNSDB` を開き、以下の3つのシートを作成します：

1. **UserInformation_Tbl**（ユーザー情報テーブル）
2. **Bord_Tbl**（投稿テーブル）
3. **Reply_Tbl**（返信テーブル）

### 4.2 UserInformation_Tbl の設定

1. `UserInformation_Tbl` シートを選択
2. 1行目に以下のヘッダーを入力：

```
A1: UserID
B1: UserName
C1: Mail
D1: CreatedAt
E1: Authority
F1: UpdateAt
G1: DeleteFlag
H1: LoginDate
I1: LoginToken
J1: password
K1: ProfileTxt
L1: ProfileImageID
```

### 4.3 Bord_Tbl の設定

1. `Bord_Tbl` シートを選択
2. 1行目に以下のヘッダーを入力：

```
A1: PostID
B1: UserID
C1: PostTxt
D1: PostDate
E1: UpdateDate
F1: DeleteFlag
```

### 4.4 Reply_Tbl の設定

1. `Reply_Tbl` シートを選択
2. 1行目に以下のヘッダーを入力：

```
A1: ReplyID
B1: PostID
C1: UserID
D1: ReplyTxt
E1: ReplyDate
F1: UpdateDate
G1: DeleteFlag
```

## ステップ5: Google Apps Script の設定

### 5.1 GAS プロジェクトの作成

1. `MiniSNSDB` スプレッドシートを開く
2. メニューの「拡張機能」→「Apps Script」をクリック
3. プロジェクト名を `BordAppAPIs` に変更

### 5.2 スクリプトファイルの作成

左側の「＋」ボタンをクリックして、以下のファイルを順番に作成：

1. `Config.js`
2. `Common.js`
3. `Auth.js`
4. `BordOperation.js`
5. `ReplyOperation.js`
6. `Main.js`

### 5.3 コードのコピー

ローカルの `GAS/Script/` フォルダから、各ファイルをGASエディタにコピー：

- `Config.js` → GASの `Config.js`
- `Common.js` → GASの `Common.js`
- `Auth.js` → GASの `Auth.js`
- `BordOperation.js` → GASの `BordOperation.js`
- `ReplyOperation.js` → GASの `ReplyOperation.js`
- `Main.js` → GASの `Main.js`

### 5.4 Config.js の設定

GASの `Config.js` を開き、以下の部分を自分のIDに置き換え：

```javascript
// MiniSNSDB スプレッドシートID
const SPREADSHEET_ID = "ここにスプレッドシートのIDを入力";

// image フォルダID
const IMAGE_FOLDER_ID = "ここにimageフォルダのIDを入力";
```

#### IDの取得方法

**スプレッドシートID**:
- URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
- `{SPREADSHEET_ID}` の部分をコピー

**フォルダID**:
- imageフォルダのURL: `https://drive.google.com/drive/folders/{FOLDER_ID}`
- `{FOLDER_ID}` の部分をコピー

### 5.5 テスト実行

1. GASエディタの上部メニュー「実行」→「testAPIs」を選択
2. 初回実行時は権限承認が必要
3. 「承認が必要です」ダイアログで「許可を確認」をクリック
4. Googleアカウントを選択
5. 「このアプリはGoogleで確認されていません」と表示されたら「詳細」→「BordAppAPIs（安全ではないページ）に移動」をクリック
6. 「許可」をクリック

### 5.6 ログの確認

1. メニューの「表示」→「ログ」をクリック
2. 以下のような成功メッセージが表示されることを確認：

```
1. New User Registration: OK
2. User Login: OK
3. Create Post: OK
4. Create Reply: OK
5. Get Posts: OK
6. Get Replies: OK
```

## ステップ6: GAS のデプロイ

### 6.1 新しいデプロイの作成

1. GASエディタで「デプロイ」→「新しいデプロイ」をクリック
2. タイプ: 「ウェブアプリ」を選択
3. 説明: 「MiniSNS API v1.0」と入力
4. 実行者: 「自分」を選択
5. アクセスできるユーザー: 「すべての人」を選択
6. 「デプロイ」をクリック

### 6.2 デプロイIDの取得

デプロイ完了後、「デプロイID」をコピーしてメモしておく。

## ステップ7: フロントエンドの設定

### 7.1 API設定ファイルの編集

`src/services/api.ts` を開き、以下の部分を編集：

```typescript
const GAS_DEPLOYMENT_ID = "ステップ6で取得したデプロイID";
```

### 7.2 ローカルサーバーの起動

```bash
npm run dev
```

### 7.3 ブラウザでの確認

ブラウザで `http://localhost:5173` を開く。

## ステップ8: 動作確認

### 8.1 ユーザー登録

1. ログインページで「新規ユーザー登録」をクリック
2. 以下の情報を入力：
   - ユーザー名: `testuser`
   - メールアドレス: `test@example.com`
   - パスワード: `password123`
   - パスワード確認: `password123`
3. 「登録」ボタンをクリック

### 8.2 ログイン

1. ユーザー名: `testuser`
2. パスワード: `password123`
3. 「ログイン」ボタンをクリック

### 8.3 投稿の作成

1. ホーム画面で「投稿を作成」ボタンをクリック
2. テキストを入力: `最初の投稿です！`
3. 「投稿」ボタンをクリック

### 8.4 返信の作成

1. 投稿の下にある「返信」ボタンをクリック
2. 返信テキストを入力: `返信です！`
3. 「送信」ボタンをクリック

### 8.5 データの確認

Googleスプレッドシートを開いて、データが正しく保存されていることを確認。

## トラブルシューティング

### エラー: "シートが見つかりません"

**原因**: シート名のスペルミスまたは大文字小文字の違い

**解決方法**:
1. `Config.js` の `SHEET_NAMES` を確認
2. スプレッドシートのシート名と完全に一致するか確認

### エラー: "権限がありません"

**原因**: GASの権限が不足している

**解決方法**:
1. GASエディタで「実行」→「関数を実行」を試す
2. 権限承認ダイアログに従う

### エラー: "CORSエラー"

**原因**: ブラウザのCORS制限

**解決方法**:
- 開発時は問題ないが、本番デプロイ時は適切なCORS設定が必要

### 投稿が表示されない

**原因**: API接続の問題

**解決方法**:
1. `src/services/api.ts` の `GAS_DEPLOYMENT_ID` が正しいか確認
2. ブラウザの開発者ツール（F12）でコンソールエラーを確認

### トークンエラー（エラー99）

**原因**: トークンが期限切れ（5日以上経過）

**解決方法**:
- 再度ログインする

## 次のステップ

セットアップが完了したら：

1. **ビルドテスト**: `npm run build`
2. **デプロイ**: GitHub Pages や Vercel へのデプロイ
3. **モバイルアプリ化**: Capacitor を使用してネイティブアプリ化
4. **機能拡張**: 画像アップロード、フォロー機能などの追加

## サポート

問題が発生した場合：

1. このガイドのトラブルシューティングセクションを確認
2. ブラウザの開発者ツールでエラーメッセージを確認
3. GASのログ（View → Logs）でバックエンドのエラーを確認
4. スプレッドシートのデータが正しく保存されているか確認

---

**セットアップ完了！** 🎉

MiniSNS が正常に動作するようになりました。
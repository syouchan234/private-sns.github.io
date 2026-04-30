/**
 * src/services/api.ts
 * MiniSNS フロントエンド API連携サービス層
 * GAS バックエンドと通信するためのヘルパー関数
 */

// ============================================
// ① API設定
// ============================================

// GAS デプロイID（自分のGASプロジェクトのデプロイIDに置き換え）
const GAS_DEPLOYMENT_ID = "YOUR_GAS_DEPLOYMENT_ID_HERE";

// GAS API URL（ウェブアプリとしてデプロイ後のURL）
const GAS_API_URL = `https://script.google.com/macros/d/${GAS_DEPLOYMENT_ID}/usercontent`;

// ローカル開発時はモック
const USE_MOCK_API = false; // 本番環境では false に設定

export interface ApiResponse<T = any> {
  status: "ok" | "error";
  message: string;
  data?: T;
  code?: number;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  token: string;
  profileTxt?: string;
}

export interface Post {
  postId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  profileImageId?: string;
}

export interface Reply {
  replyId: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

// ============================================
// ② HTTPリクエスト送信
// ============================================

/**
 * POSTリクエストを送信
 * @param {object} payload - リクエストボディ
 * @returns {Promise<ApiResponse>} APIレスポンス
 */
async function sendPostRequest(payload: Record<string, any>): Promise<ApiResponse> {
  try {
    const response = await fetch(GAS_API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: "error",
      message: "ネットワークエラーが発生しました",
      code: 500
    };
  }
}

/**
 * GETリクエストを送信
 * @param {object} params - クエリパラメータ
 * @returns {Promise<ApiResponse>} APIレスポンス
 */
async function sendGetRequest(params: Record<string, any>): Promise<ApiResponse> {
  try {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = `${GAS_API_URL}?${queryString}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: "error",
      message: "ネットワークエラーが発生しました",
      code: 500
    };
  }
}

// ============================================
// ③ 認証API
// ============================================

/**
 * ユーザーログイン
 * @param {string} username - ユーザー名またはメールアドレス
 * @param {string} password - パスワード
 * @returns {Promise<ApiResponse<User>>}
 */
export async function login(username: string, password: string): Promise<ApiResponse<User>> {
  return sendPostRequest({
    mode: "login",
    username,
    password
  });
}

/**
 * 自動ログイン（トークン使用）
 * @param {string} token - 保存済みのトークン
 * @returns {Promise<ApiResponse<User>>}
 */
export async function autoLogin(token: string): Promise<ApiResponse<User>> {
  return sendPostRequest({
    mode: "auto_login",
    token
  });
}

/**
 * ユーザー登録
 * @param {string} username - ユーザー名
 * @param {string} email - メールアドレス
 * @param {string} password - パスワード
 * @param {string} passwordConfirm - パスワード確認
 * @returns {Promise<ApiResponse<User>>}
 */
export async function registerUser(
  username: string,
  email: string,
  password: string,
  passwordConfirm: string
): Promise<ApiResponse<User>> {
  return sendPostRequest({
    mode: "registUser",
    username,
    email,
    password,
    passwordConfirm
  });
}

// ============================================
// ④ 投稿API
// ============================================

/**
 * 新規投稿作成
 * @param {string} token - ユーザートークン
 * @param {string} content - 投稿内容
 * @returns {Promise<ApiResponse>}
 */
export async function createPost(token: string, content: string): Promise<ApiResponse> {
  return sendPostRequest({
    mode: "createPost",
    token,
    content
  });
}

/**
 * 投稿一覧取得
 * @param {number} limit - 取得件数
 * @param {number} offset - オフセット
 * @returns {Promise<ApiResponse<{posts: Post[]; total: number}>>}
 */
export async function getPosts(limit = 20, offset = 0): Promise<ApiResponse<{ posts: Post[]; total: number }>> {
  return sendGetRequest({
    mode: "getPosts",
    limit,
    offset
  });
}

/**
 * 特定ユーザーの投稿一覧取得
 * @param {string} userId - ユーザーID
 * @param {number} limit - 取得件数
 * @param {number} offset - オフセット
 * @returns {Promise<ApiResponse<{posts: Post[]; total: number}>>}
 */
export async function getUserPosts(userId: string, limit = 20, offset = 0): Promise<ApiResponse<{ posts: Post[]; total: number }>> {
  return sendGetRequest({
    mode: "getUserPosts",
    userId,
    limit,
    offset
  });
}

/**
 * 投稿削除
 * @param {string} token - ユーザートークン
 * @param {string} postId - 投稿ID
 * @returns {Promise<ApiResponse>}
 */
export async function deletePost(token: string, postId: string): Promise<ApiResponse> {
  return sendPostRequest({
    mode: "deletePost",
    token,
    postId
  });
}

// ============================================
// ⑤ 返信API
// ============================================

/**
 * 新規返信作成
 * @param {string} token - ユーザートークン
 * @param {string} postId - 投稿ID
 * @param {string} content - 返信内容
 * @returns {Promise<ApiResponse>}
 */
export async function createReply(token: string, postId: string, content: string): Promise<ApiResponse> {
  return sendPostRequest({
    mode: "createReply",
    token,
    postId,
    content
  });
}

/**
 * 投稿に紐づく返信一覧取得
 * @param {string} postId - 投稿ID
 * @param {number} limit - 取得件数
 * @param {number} offset - オフセット
 * @returns {Promise<ApiResponse<{replies: Reply[]; total: number}>>}
 */
export async function getReplies(postId: string, limit = 20, offset = 0): Promise<ApiResponse<{ replies: Reply[]; total: number }>> {
  return sendGetRequest({
    mode: "getReplies",
    postId,
    limit,
    offset
  });
}

/**
 * 返信削除
 * @param {string} token - ユーザートークン
 * @param {string} replyId - 返信ID
 * @returns {Promise<ApiResponse>}
 */
export async function deleteReply(token: string, replyId: string): Promise<ApiResponse> {
  return sendPostRequest({
    mode: "deleteReply",
    token,
    replyId
  });
}

// ============================================
// ⑥ ローカルストレージヘルパー
// ============================================

/**
 * ユーザートークンをローカルストレージに保存
 * @param {string} token - トークン
 */
export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

/**
 * ローカルストレージからトークンを取得
 * @returns {string|null} トークンまたはnull
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

/**
 * ローカルストレージからトークンを削除
 */
export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}

/**
 * ユーザー情報をローカルストレージに保存
 * @param {User} user - ユーザー情報
 */
export function saveUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
}

/**
 * ローカルストレージからユーザー情報を取得
 * @returns {User|null} ユーザー情報またはnull
 */
export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
}

/**
 * ローカルストレージをクリア（ログアウト）
 */
export function clearAuth(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  }
}

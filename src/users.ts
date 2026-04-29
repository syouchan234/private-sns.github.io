export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  posts: number;
  followers: number;
  following: number;
}

const users: User[] = [
  {
    "id": 1,
    "username": "testuser",
    "password": "password123",
    "name": "テストユーザー",
    "email": "test@example.com",
    "avatar": "https://via.placeholder.com/80",
    "bio": "こんにちは！SNSアプリを楽しんでいます。よろしくお願いします！",
    "posts": 123,
    "followers": 456,
    "following": 789
  },
  {
    "id": 2,
    "username": "demo",
    "password": "demo123",
    "name": "デモユーザー",
    "email": "demo@example.com",
    "avatar": "https://via.placeholder.com/80",
    "bio": "デモアカウントです。機能テストにご利用ください。",
    "posts": 45,
    "followers": 123,
    "following": 234
  }
];

export default users;
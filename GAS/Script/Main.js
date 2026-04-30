
function parsePostParams(e) {
  if (!e) {
    return {};
  }

  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (error) {
      return e.parameter || {};
    }
  }

  return e.parameter || {};
}

function doGet(e) {
  try {
    const params = e.parameter || {};
    const mode = params.mode || "";

    switch (mode) {
      case "getPosts":
        return handleGetPosts(params);
      case "getUserPosts":
        return handleGetUserPosts(params);
      case "getReplies":
        return handleGetReplies(params);
      default:
        return createErrorResponse("無効なモードです");
    }
  } catch (error) {
    return createErrorResponse("サーバーエラーが発生しました");
  }
}

function doPost(e) {
  try {
    const params = parsePostParams(e);
    const mode = params.mode || "";

    switch (mode) {
      case "login":
        return handleLogin(params);
      case "auto_login":
        return handleAutoLogin(params);
      case "registUser":
        return handleRegistUser(params);
      case "createPost":
        return handleCreatePost(params);
      case "deletePost":
        return handleDeletePost(params);
      case "createReply":
        return handleCreateReply(params);
      case "deleteReply":
        return handleDeleteReply(params);
      default:
        return createErrorResponse("無効なモードです");
    }
  } catch (error) {
    return createErrorResponse("サーバーエラーが発生しました");
  }
}

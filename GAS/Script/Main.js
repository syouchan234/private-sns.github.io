
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

    let response;
    switch (mode) {
      case "getPosts":
        response = handleGetPosts(params);
        break;
      case "getUserPosts":
        response = handleGetUserPosts(params);
        break;
      case "getReplies":
        response = handleGetReplies(params);
        break;
      //疎通確認用
      case "getTEST":
        response = handleGetTEST(params);
        break;
      default:
        response = createErrorResponse("無効なモードです");
    }
    return response;
  } catch (error) {
    return createErrorResponse("サーバーエラーが発生しました");
  }
}

function doPost(e) {
  try {
    const params = parsePostParams(e);
    const mode = params.mode || "";

    let response;
    switch (mode) {
      case "login":
        response = handleLogin(params);
        break;
      case "auto_login":
        response = handleAutoLogin(params);
        break;
      case "registUser":
        response = handleRegistUser(params);
        break;
      case "createPost":
        response = handleCreatePost(params);
        break;
      case "deletePost":
        response = handleDeletePost(params);
        break;
      case "createReply":
        response = handleCreateReply(params);
        break;
      case "deleteReply":
        response = handleDeleteReply(params);
        break;
      //疎通確認用
      case "postTEST":
        response = handlePostTEST(params);
        break;
      default:
        response = createErrorResponse("無効なモードです");
    }
    return response;
  } catch (error) {
    return createErrorResponse("サーバーエラーが発生しました");
  }
}

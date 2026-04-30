function handleCreatePost(params) {
  const token = params.token || "";
  const content = (params.content || "").trim();

  const validation = validateToken(token);
  if (!validation.valid) {
    return createErrorResponse(validation.error, validation.expired ? 99 : undefined);
  }

  if (!content || content.length > VALIDATION.MAX_POST_LENGTH) {
    return createErrorResponse("投稿内容が無効です");
  }

  const postSheet = getSheet(SHEETS.POSTS);
  if (!postSheet) {
    return createErrorResponse("投稿シートが見つかりません");
  }

  const postId = "pst_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  const now = getNow();

  postSheet.appendRow([
    postId,
    validation.userId,
    content,
    now,
    now,
    0
  ]);

  return createSuccessResponse("投稿が作成されました", {
    postId: postId,
    content: content,
    timestamp: now.toISOString()
  });
}

function handleGetPosts(params) {
  const limit = parseInt(params.limit, 10) || 20;
  const offset = parseInt(params.offset, 10) || 0;
  const postSheet = getSheet(SHEETS.POSTS);
  if (!postSheet) {
    return createErrorResponse("投稿シートが見つかりません");
  }

  const rows = postSheet.getDataRange().getValues();
  const userMap = getUserMap();
  const posts = [];

  for (let i = rows.length - 1; i >= 1; i--) {
    const row = rows[i];
    if (parseInt(row[5], 10) !== 0) {
      continue;
    }
    const user = userMap[row[1]];
    if (!user) {
      continue;
    }
    posts.push({
      postId: row[0],
      userId: row[1],
      username: user.username,
      profileImageId: user.profileImageId,
      content: row[2],
      timestamp: row[3] ? new Date(row[3]).toISOString() : "",
      updateDate: row[4] ? new Date(row[4]).toISOString() : ""
    });
  }

  return createSuccessResponse("投稿を取得しました", {
    posts: posts.slice(offset, offset + limit),
    total: posts.length,
    limit: limit,
    offset: offset
  });
}

function handleGetUserPosts(params) {
  const userId = params.userId || "";
  const limit = parseInt(params.limit, 10) || 20;
  const offset = parseInt(params.offset, 10) || 0;
  const postSheet = getSheet(SHEETS.POSTS);
  if (!postSheet) {
    return createErrorResponse("投稿シートが見つかりません");
  }

  const rows = postSheet.getDataRange().getValues();
  const userMap = getUserMap();
  const posts = [];

  for (let i = rows.length - 1; i >= 1; i--) {
    const row = rows[i];
    if (parseInt(row[5], 10) !== 0 || row[1] !== userId) {
      continue;
    }
    const user = userMap[row[1]];
    if (!user) {
      continue;
    }
    posts.push({
      postId: row[0],
      userId: row[1],
      username: user.username,
      profileImageId: user.profileImageId,
      content: row[2],
      timestamp: row[3] ? new Date(row[3]).toISOString() : "",
      updateDate: row[4] ? new Date(row[4]).toISOString() : ""
    });
  }

  return createSuccessResponse("ユーザー投稿を取得しました", {
    posts: posts.slice(offset, offset + limit),
    total: posts.length,
    limit: limit,
    offset: offset
  });
}

function handleDeletePost(params) {
  const token = params.token || "";
  const postId = params.postId || "";

  const validation = validateToken(token);
  if (!validation.valid) {
    return createErrorResponse(validation.error, validation.expired ? 99 : undefined);
  }

  const postSheet = getSheet(SHEETS.POSTS);
  if (!postSheet) {
    return createErrorResponse("投稿シートが見つかりません");
  }

  const rows = postSheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[0] === postId && row[1] === validation.userId && parseInt(row[5], 10) === 0) {
      postSheet.getRange(i + 1, 6).setValue(1);
      postSheet.getRange(i + 1, 5).setValue(getNow());
      return createSuccessResponse("投稿を削除しました");
    }
  }

  return createErrorResponse("投稿が見つからないか、権限がありません");
}

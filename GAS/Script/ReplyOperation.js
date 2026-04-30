function handleCreateReply(params) {
  const token = params.token || "";
  const postId = params.postId || "";
  const content = (params.content || "").trim();

  const validation = validateToken(token);
  if (!validation.valid) {
    return createErrorResponse(validation.error, validation.expired ? 99 : undefined);
  }

  if (!postId || !content || content.length > VALIDATION.MAX_POST_LENGTH) {
    return createErrorResponse("返信内容が無効です");
  }

  const postSheet = getSheet(SHEETS.POSTS);
  if (!postSheet) {
    return createErrorResponse("投稿シートが見つかりません");
  }

  const postRows = postSheet.getDataRange().getValues();
  const postExists = postRows.some(row => row[0] === postId && parseInt(row[5], 10) === 0);
  if (!postExists) {
    return createErrorResponse("指定された投稿が見つかりません");
  }

  const replySheet = getSheet(SHEETS.REPLIES);
  if (!replySheet) {
    return createErrorResponse("返信シートが見つかりません");
  }

  const replyId = "rpl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  const now = getNow();

  replySheet.appendRow([
    replyId,
    postId,
    validation.userId,
    content,
    now,
    now,
    0
  ]);

  return createSuccessResponse("返信が作成されました", {
    replyId: replyId,
    postId: postId,
    content: content,
    timestamp: now.toISOString()
  });
}

function handleGetReplies(params) {
  const postId = params.postId || "";
  const limit = parseInt(params.limit, 10) || 20;
  const offset = parseInt(params.offset, 10) || 0;

  if (!postId) {
    return createErrorResponse("投稿IDが指定されていません");
  }

  const replySheet = getSheet(SHEETS.REPLIES);
  if (!replySheet) {
    return createErrorResponse("返信シートが見つかりません");
  }

  const rows = replySheet.getDataRange().getValues();
  const userMap = getUserMap();
  const replies = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[1] !== postId || parseInt(row[6], 10) !== 0) {
      continue;
    }
    const user = userMap[row[2]];
    if (!user) {
      continue;
    }
    replies.push({
      replyId: row[0],
      postId: row[1],
      userId: row[2],
      username: user.username,
      profileImageId: user.profileImageId,
      content: row[3],
      timestamp: row[4] ? new Date(row[4]).toISOString() : "",
      updateDate: row[5] ? new Date(row[5]).toISOString() : ""
    });
  }

  return createSuccessResponse("返信を取得しました", {
    replies: replies.slice(offset, offset + limit),
    total: replies.length,
    limit: limit,
    offset: offset
  });
}

function handleDeleteReply(params) {
  const token = params.token || "";
  const replyId = params.replyId || "";

  const validation = validateToken(token);
  if (!validation.valid) {
    return createErrorResponse(validation.error, validation.expired ? 99 : undefined);
  }

  const replySheet = getSheet(SHEETS.REPLIES);
  if (!replySheet) {
    return createErrorResponse("返信シートが見つかりません");
  }

  const rows = replySheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[0] === replyId && row[2] === validation.userId && parseInt(row[6], 10) === 0) {
      replySheet.getRange(i + 1, 7).setValue(1);
      replySheet.getRange(i + 1, 6).setValue(getNow());
      return createSuccessResponse("返信を削除しました");
    }
  }

  return createErrorResponse("返信が見つからないか、権限がありません");
}

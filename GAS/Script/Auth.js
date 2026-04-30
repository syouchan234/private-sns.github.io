function handleRegistUser(params) {
  const username = (params.username || "").trim();
  const email = (params.email || "").trim();
  const password = params.password || "";
  const passwordConfirm = params.passwordConfirm || "";

  if (!username || !email || !password || !passwordConfirm) {
    return createErrorResponse("必須項目が入力されていません");
  }

  if (password !== passwordConfirm) {
    return createErrorResponse("パスワードが一致しません");
  }

  if (username.length > VALIDATION.MAX_USERNAME_LENGTH) {
    return createErrorResponse("ユーザー名が長すぎます");
  }

  const userSheet = getSheet(SHEETS.USERS);
  if (!userSheet) {
    return createErrorResponse("ユーザーシートが見つかりません");
  }

  const rows = userSheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[1] === username) {
      return createErrorResponse("ユーザー名は既に使用されています");
    }
    if (row[2] === email) {
      return createErrorResponse("メールアドレスは既に使用されています");
    }
  }

  const userId = "usr_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  const hashedPassword = hashPassword(password, userId);
  const now = getNow();
  const profileImageId = "prf_" + Math.max(1, rows.length);

  userSheet.appendRow([
    userId,
    username,
    email,
    now,
    "0",
    now,
    0,
    now,
    "",
    hashedPassword,
    "",
    profileImageId
  ]);

  return createSuccessResponse("ユーザー登録が完了しました", {
    userId: userId,
    username: username,
    email: email
  });
}

function handleLogin(params) {
  const id = (params.id || "").trim();
  const password = params.pass || "";

  if (!id || !password) {
    return createErrorResponse("ユーザーIDまたはパスワードが入力されていません");
  }

  const userSheet = getSheet(SHEETS.USERS);
  if (!userSheet) {
    return createErrorResponse("ユーザーシートが見つかりません");
  }

  const rows = userSheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (parseInt(row[6], 10) !== 0) {
      continue;
    }

    if (row[0] !== id && row[1] !== id && row[2] !== id) {
      continue;
    }

    const hashedPassword = hashPassword(password, row[0]);
    if (hashedPassword !== row[9]) {
      return createErrorResponse("認証に失敗しました");
    }

    const token = generateToken();
    const now = getNow();
    userSheet.getRange(i + 1, 9).setValue(token);
    userSheet.getRange(i + 1, 8).setValue(now);
    userSheet.getRange(i + 1, 6).setValue(now);

    return createSuccessResponse("ログインに成功しました", {
      userId: row[0],
      username: row[1],
      email: row[2],
      token: token,
      profileTxt: row[10],
      profileImageId: row[11]
    });
  }

  return createErrorResponse("ユーザー名またはパスワードが間違っています");
}

function handleAutoLogin(params) {
  const token = params.token || "";
  const validation = validateToken(token);
  if (!validation.valid) {
    return createErrorResponse(validation.error, validation.expired ? 99 : undefined);
  }

  const userSheet = getSheet(SHEETS.USERS);
  const row = validation.userData;
  const now = getNow();
  const newToken = generateToken();

  userSheet.getRange(validation.rowIndex, 9).setValue(newToken);
  userSheet.getRange(validation.rowIndex, 8).setValue(now);
  userSheet.getRange(validation.rowIndex, 6).setValue(now);

  return createSuccessResponse("自動ログインに成功しました", {
    userId: row[0],
    username: row[1],
    email: row[2],
    token: newToken,
    profileTxt: row[10],
    profileImageId: row[11]
  });
}

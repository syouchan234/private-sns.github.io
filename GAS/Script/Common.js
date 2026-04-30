function hashPassword(password, salt) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password + salt);
  return bytes.map(byte => {
    const value = byte < 0 ? byte + 256 : byte;
    return value.toString(16).padStart(2, '0');
  }).join('');
}

function generateToken() {
  return Utilities.getUuid();
}

function isTokenExpired(loginDate) {
  if (!loginDate) {
    return true;
  }
  return (getNow() - new Date(loginDate)) / (1000 * 60 * 60 * 24) > VALIDATION.TOKEN_EXPIRY_DAYS;
}

function validateToken(token) {
  if (!token) {
    return { valid: false, error: "トークンがありません" };
  }

  const userSheet = getSheet(SHEETS.USERS);
  if (!userSheet) {
    return { valid: false, error: "ユーザーシートが見つかりません" };
  }

  const rows = userSheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (parseInt(row[6], 10) !== 0) {
      continue;
    }
    if (row[8] === token) {
      if (isTokenExpired(row[7])) {
        return { valid: false, error: "トークンの有効期限が切れています", expired: true, rowIndex: i + 1 };
      }
      return { valid: true, userId: row[0], rowIndex: i + 1, userData: row };
    }
  }

  return { valid: false, error: "無効なトークンです" };
}

function getUserMap() {
  const userSheet = getSheet(SHEETS.USERS);
  if (!userSheet) {
    return {};
  }

  const rows = userSheet.getDataRange().getValues();
  const map = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (parseInt(row[6], 10) === 0) {
      map[row[0]] = {
        userId: row[0],
        username: row[1],
        email: row[2],
        authority: row[4],
        profileTxt: row[10],
        profileImageId: row[11]
      };
    }
  }
  return map;
}

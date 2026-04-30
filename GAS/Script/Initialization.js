function createAdminUser() {
  const sheet = getSheet(SHEETS.USERS) || getSpreadsheet().insertSheet(SHEETS.USERS);

  if (sheet.getLastRow() === 0) {
    const headers = [
      "UserID", "UserName", "Mail", "CreatedAt", "Authority",
      "UpdateAt", "DeleteFlag", "LoginDate", "LoginToken",
      "password", "ProfileTxt", "ProfileImageID"
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  const adminId = "admin_001";
  const adminMail = "admin@example.com";
  const rawPassword = "ADMIN_PASSWORD";
  const hashedPassword = hashPassword(rawPassword, adminId);
  const nextPrfId = getNextProfileImageId(sheet);
  const now = getNow();

  sheet.appendRow([
    adminId,
    "初期管理者",
    adminMail,
    now,
    "99",
    now,
    0,
    now,
    "",
    hashedPassword,
    "システム管理者です",
    nextPrfId
  ]);
  console.log(`管理者ユーザー(ID: ${adminId})を登録しました。画像ID: ${nextPrfId}`);
}

function getNextProfileImageId(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return "prf_1";
  }

  const prfIds = sheet.getRange(2, 12, lastRow - 1, 1).getValues().flat();
  let maxNum = 0;
  prfIds.forEach(id => {
    const num = parseInt(id.toString().replace("prf_", ""), 10);
    if (!isNaN(num) && num > maxNum) {
      maxNum = num;
    }
  });

  return `prf_${maxNum + 1}`;
}

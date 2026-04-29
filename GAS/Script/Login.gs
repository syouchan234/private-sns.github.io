function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("UserInformation_Tbl");
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return createResponse({ error: "No data" });

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const rows = values.slice(1);

  // JSONオブジェクトの配列を作成
  const allUsers = rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      // --- セキュリティ対策：Password列はレスポンスに含めない ---
      if (header === "Password") return;

      let val = row[i];
      // 日付データのフォーマット
      if (val instanceof Date) {
        val = Utilities.formatDate(val, "JST", "yyyy-MM-dd HH:mm:ss");
      }
      obj[header] = val;
    });
    return obj;
  });

  // --- フィルタリングロジック ---
  
  // 1. URLパラメータに LoginToken または token があるかチェック
  const targetToken = e.parameter.LoginToken || e.parameter.token;
  
  if (targetToken) {
    // トークンが一致し、かつ論理削除されていない(DeleteFlagが1でない)ユーザーを1人抽出
    const user = allUsers.find(u => 
      String(u.LoginToken) === String(targetToken) && String(u.DeleteFlag) !== "1"
    );
    
    if (user) {
      return createResponse(user);
    } else {
      return createResponse({ error: "Invalid token or User not found" });
    }
  }

  // 2. トークン指定がない場合は、削除されていない全員を返す
  const activeUsers = allUsers.filter(u => String(u.DeleteFlag) !== "1");
  return createResponse(activeUsers);
}

/**
 * レスポンス作成用の共通関数
 */
function createResponse(content) {
  return ContentService.createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
}
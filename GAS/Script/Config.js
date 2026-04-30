// Google Spreadsheet のスプレッドシート ID を設定してください
const SPREADSHEET_ID = "";
const IMAGE_FOLDER_ID = "";

const SHEETS = {
  USERS: "UserInformation_Tbl",
  POSTS: "Bord_Tbl",
  REPLIES: "Reply_Tbl",
  TEST: "Test"
};

const VALIDATION = {
  MAX_USERNAME_LENGTH: 32,
  MAX_PASSWORD_LENGTH: 32,
  MAX_POST_LENGTH: 500,
  MAX_PROFILE_LENGTH: 500,
  TOKEN_EXPIRY_DAYS: 5
};

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet(sheetName) {
  return getSpreadsheet().getSheetByName(sheetName);
}

function getNow() {
  return new Date();
}

function createResponse(status, message, data) {
  const payload = {
    status: status,
    message: message,
    timestamp: getNow().toISOString()
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function createSuccessResponse(message, data) {
  return createResponse("ok", message, data);
}

function createErrorResponse(message, code) {
  const payload = {
    status: "error",
    message: message,
    timestamp: getNow().toISOString()
  };

  if (code !== undefined) {
    payload.code = code;
  }

  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

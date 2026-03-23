/**
 * 將此檔案內容貼到 Google Apps Script 專案中使用。
 * 使用方式：
 * 1. 建立一份 Google Sheet。
 * 2. 在該試算表點「擴充功能 > Apps Script」。
 * 3. 貼上此程式碼並儲存。
 * 4. 將 SPREADSHEET_ID 換成你的試算表 ID。
 * 5. 部署成 Web App（Anyone 可存取）。
 * 6. 把 Web App URL 貼回網站的同步欄位。
 */

const SPREADSHEET_ID = "請換成你的試算表ID";
const SHEET_NAME = "還款紀錄";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, SHEET_NAME);

    // 清除舊資料，改成每次完整覆蓋
    sheet.clearContents();

    sheet.getRange(1, 1, 1, 2).setValues([["總金額", data.totalAmount || 0]]);
    sheet.getRange(2, 1, 1, 2).setValues([["已還金額", data.paidAmount || 0]]);
    sheet.getRange(3, 1, 1, 2).setValues([["剩餘金額", data.remainingAmount || 0]]);
    sheet.getRange(5, 1, 1, 4).setValues([["日期", "金額", "建立時間", "ID"]]);

    const records = Array.isArray(data.records) ? data.records : [];
    if (records.length > 0) {
      const values = records.map(r => [r.date || "", Number(r.amount || 0), r.createdAt || "", r.id || ""]);
      sheet.getRange(6, 1, values.length, 4).setValues(values);
    }

    return jsonOutput_({ ok: true, message: "synced", rows: records.length });
  } catch (err) {
    return jsonOutput_({ ok: false, message: String(err) });
  }
}

function doGet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, SHEET_NAME);

    const totalAmount = Number(sheet.getRange(1, 2).getValue() || 0);
    const paidAmount = Number(sheet.getRange(2, 2).getValue() || 0);
    const remainingAmount = Number(sheet.getRange(3, 2).getValue() || 0);

    const lastRow = sheet.getLastRow();
    let records = [];
    if (lastRow >= 6) {
      const rows = sheet.getRange(6, 1, lastRow - 5, 4).getValues();
      records = rows
        .filter(r => r[0] && Number(r[1]) > 0)
        .map(r => ({
          date: String(r[0]),
          amount: Number(r[1]),
          createdAt: String(r[2] || ""),
          id: String(r[3] || Utilities.getUuid()),
        }));
    }

    return jsonOutput_({
      ok: true,
      totalAmount,
      paidAmount,
      remainingAmount,
      records,
    });
  } catch (err) {
    return jsonOutput_({ ok: false, message: String(err) });
  }
}

function getOrCreateSheet_(ss, name) {
  const found = ss.getSheetByName(name);
  return found || ss.insertSheet(name);
}

function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

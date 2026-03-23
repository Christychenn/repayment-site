# 還款紀錄網站

簡單單頁網站，固定總金額為 `114751`，可新增還款日期與金額，資料會存在瀏覽器本機，不會每次重開就重置。

## 功能

- 顯示總金額 / 已還金額 / 剩餘金額
- 新增與刪除還款紀錄
- 使用 `localStorage` 自動保存資料
- 一鍵同步全部資料到 Google Sheet（透過 Apps Script Web App）
- 匯出 Excel（`還款紀錄.xlsx`）

## 使用方式

1. 直接用瀏覽器打開 `index.html`。
2. 在「還款日期」「還款金額」輸入資料後按「新增紀錄」。
3. 資料會自動保存在本機瀏覽器。

## 同步到 Google Sheet

1. 建立 Google Sheet。
2. 進入「擴充功能 > Apps Script」。
3. 貼上 `google-apps-script.js` 的內容。
4. 把 `SPREADSHEET_ID` 改成你的試算表 ID。
5. 部署為 Web App，存取權設成 `Anyone`。
6. 複製 Web App URL，貼到網站的同步欄位。
7. 按「同步全部到 Google Sheet」。

## 雲端優先模式（每次開啟自動同步）

- 網頁開啟時：若有設定 Web App URL，會先讀取 Google Sheet 的最新資料。
- 新增 / 編輯 / 刪除：會先更新畫面，再自動同步回 Google Sheet。
- 本機 `localStorage` 仍保留一份備份，當雲端暫時連不上時可暫用本機資料。

> 如果你更新了 `google-apps-script.js`，記得在 Apps Script 重新部署最新版，網站才會讀到新的 `doGet` 資料格式。

## 讓所有裝置看到同一份資料（分享網址）

要達成「任何人、任何裝置打開都一樣」，需要兩件事：

1. **把 `index.html` 部署成公開網址**（例如 GitHub Pages / Netlify / Vercel）
2. **所有人都連同一個 Apps Script Web App URL**

### 最快分享方式：帶 `sync` 參數

網站已支援從網址參數讀取同步端點。你可以分享：

`https://你的網站網址/index.html?sync=https%3A%2F%2Fscript.google.com%2Fmacros%2Fs%2Fxxx%2Fexec`

- `sync=` 後面放「URL 編碼後」的 Apps Script Web App URL
- 對方第一次打開後會自動記住，不用再手動貼同步網址

### 注意

- Apps Script 部署權限需允許外部裝置存取（通常選 `Anyone`）
- 如果多人同時編輯，最後一次同步可能覆蓋前一次（如需可再加衝突保護）

## 備註

- 如果你不想用 Google Sheet，也可以直接按「匯出 Excel」下載檔案。

# GitTrend - GitHub 熱門專案瀏覽器

這是一個使用純 HTML、CSS 和 JavaScript 建立的網站，用於探索 GitHub 上的熱門專案。

## 功能

*   **深色/淺色主題**：可自由切換主題，並自動記住您的偏好。
*   **豐富的專案卡片**：每張卡片都包含專案擁有者的頭像、專案名稱、描述、星星數和主要語言。
*   **強大的時間篩選**：依「本週」、「本月」、「今年」或「所有時間」查看在特定時間段內建立的熱門專案。
*   **智慧型搜尋與篩選**：在當前選擇的時間範圍內，根據專案名稱或描述進行即時搜尋，並可依動態產生的語言列表進行篩選。
*   **頂級 UI/UX**：採用乾淨、響應式的現代化設計，在所有設備上都提供無與倫比的瀏覽體驗。
*   **高效能**：透過非同步載入和優化的事件處理，確保極致流暢的使用者體驗。

## 如何部署

這個專案是一個純靜態網站，可以輕鬆地部署到任何支援靜態檔案的平台上，例如 Cloudflare Pages 或 Netlify。

### 部署到 Cloudflare Pages

1.  **將專案推送到 GitHub 儲存庫**：
    *   在 GitHub 上建立一個新的儲存庫。
    *   將 `index.html`, `style.css`, `script.js` 和 `README.md` 這四個檔案推送到你的儲存庫。

2.  **連接到 Cloudflare Pages**：
    *   登入您的 Cloudflare 帳戶。
    *   在儀表板中，前往 **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**。
    *   選擇您剛剛建立的 GitHub 儲存庫。

3.  **設定建置與部署**：
    *   **Production branch**：選擇您的主要分支 (通常是 `main` 或 `master`)。
    *   **Build settings**：這個專案不需要任何建置步驟，所以您可以將 **Build command** 留空，並將 **Build output directory** 設定為 `/` (或 `.`，表示根目錄)。
    *   點擊 **Save and Deploy**。

Cloudflare Pages 會自動從您的 GitHub 儲存庫拉取程式碼並部署。幾分鐘後，您的網站就會上線！

### 部署到 Netlify

1.  **將專案推送到 GitHub 儲存庫** (同上)。

2.  **連接到 Netlify**：
    *   登入您的 Netlify 帳戶。
    *   點擊 **Add new site** > **Import an existing project**。
    *   選擇 **GitHub** 作為您的 Git 提供者，並授權 Netlify 存取您的儲存庫。
    *   選擇您要部署的儲存庫。

3.  **設定部署**：
    *   **Branch to deploy**：選擇您的主要分支。
    *   **Build command**：留空。
    *   **Publish directory**：設定為 `.` 或 `/`。
    *   點擊 **Deploy site**。

Netlify 同樣會自動部署您的網站，並提供一個可公開存取的 URL。

---

這樣，您就可以輕鬆地將這個專案部署到雲端了！
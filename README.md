# Job Matcher AI 🚀

**An AI-powered Chrome Extension to optimize your job application process.**
**一款利用 AI 优化求职流程的 Chrome 浏览器扩展。**

Job Matcher AI uses Google Gemini to analyze job descriptions (JDs) directly in your browser. It compares them against your resume to provide a match score, identify missing keywords, and offer tailoring advice.
Job Matcher AI 使用 Google Gemini 模型在浏览器中直接分析职位描述（JD）。它会将 JD 与你的简历进行对比，提供匹配度评分、识别缺失的关键词，并给出针对性的修改建议。

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Gemini](https://img.shields.io/badge/AI-Gemini%201.5-orange) ![Manifest](https://img.shields.io/badge/Manifest-V3-green)

---

## ✨ Features / 核心功能

* **⚡️ Instant Match Score:** Get a 0-100% compatibility score for any job posting.
    * **智能评分**：一键生成简历与当前职位的匹配度分数。
* **🔍 Keyword Gap Analysis:** Identifies hard skills and keywords missing from your resume.
    * **关键词检测**：自动识别并指出你简历中缺失的硬技能关键词。
* **📝 Tailoring Advice:** Receive specific, AI-generated suggestions to improve your resume.
    * **修改建议**：获取具体的简历修改建议，提高通过 ATS 的概率。
* **🔒 Privacy First:** Your data (API Key & Resume) is stored locally in your browser. No backend server involved.
    * **隐私优先**：你的数据（API Key 和简历）仅存储在本地浏览器中，无后端服务器。

---

## 🛠️ Installation & Setup / 安装与配置

Since this extension is for personal use (or development), you need to load it manually.
由于本扩展用于个人使用（或开发），你需要手动加载它。

### Step 1: Prepare the Files / 准备文件
1.  **Create a folder** on your computer named `my-job-matcher`.
    * 在电脑上新建一个文件夹，命名为 `my-job-matcher`。
2.  **Download/Save Source Code**: Ensure all extension files (`manifest.json`, `popup.js`, `popup.html`, etc.) are saved inside this folder.
    * **保存源代码**：确保所有扩展文件（`manifest.json` 等）都保存在这个文件夹里。

### Step 2: Get API Key / 获取 API Key
1.  Go to **[Google AI Studio](https://aistudio.google.com/)**.
    * 访问 Google AI Studio。
2.  Log in and click **"Get API key"** to create a free key.
    * 登录并点击 "Get API key" 申请一个免费的 Key。
3.  Copy this key for the next step.
    * 复制这个 Key 备用。

### Step 3: Load the Extension / 加载插件
1.  Open Chrome and type `chrome://extensions/` in the address bar.
    * 打开 Chrome 浏览器，在地址栏输入 `chrome://extensions/`。
2.  Toggle on **"Developer mode"** in the top right corner.
    * 打开右上角的 **"开发者模式"** 开关。
3.  Click the **"Load unpacked"** button in the top left.
    * 点击左上角的 **"加载已解压的扩展程序"** 按钮。
4.  Select the folder you created (`my-job-matcher`).
    * 选择你刚才创建的文件夹 (`my-job-matcher`)。

### Step 4: Configuration / 配置插件
1.  Find the **Job Matcher AI** icon in your browser toolbar (you may need to pin it).
    * 在浏览器工具栏找到 **Job Matcher AI** 的图标（可能需要先固定它）。
2.  **Right-click** the icon and select **"Options"**.
    * **右键点击**图标，选择 **"选项" (Options)**。
3.  **Enter your API Key** in the designated field.
    * 在指定位置填入你的 API Key。
4.  **Paste your Resume** (Master Resume) as plain text.
    * 把你的英文简历（纯文本格式）粘贴进去。
5.  Click **Save**.
    * 点击保存。

---

## 📖 How to Use / 使用方法

1.  Navigate to a job posting on LinkedIn, Indeed, or any career site.
    * 打开 LinkedIn、Indeed 或任何招聘网站的职位详情页。
2.  Click the **Job Matcher AI** extension icon.
    * 点击 Job Matcher AI 插件图标。
3.  Click the **"Analyze This Job"** button.
    * 点击 **"Analyze This Job"** 按钮。
4.  Wait a few seconds for the AI to analyze the fit and provide feedback!
    * 等待几秒钟，AI 即可给出匹配分析和反馈！

---

## 🏗️ Tech Stack / 技术栈

* **Frontend**: Vanilla JavaScript, HTML5, CSS3
* **Model**: Google Gemini 1.5 Flash
* **Storage**: Chrome Local Storage API

---

## ⚠️ Disclaimer / 免责声明

This project is for personal educational and job-hunting purposes. Please secure your API Key and follow the terms of service of the websites you visit.
本项目仅供个人学习和辅助求职使用。请保管好你的 API Key，并遵守相关网站的服务条款。

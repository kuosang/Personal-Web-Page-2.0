# Personal Web Page（静态站点）

本目录已整理好可直接上传到 GitHub 仓库：
- `index.html`
- `styles.css`
- `app.js`
- `assets/`

## 注意：头像文件
当前页面引用：`./assets/profile.jpg`

你的仓库里还没有这个文件，所以需要你把头像图片放到：

```
assets/profile.jpg
```

（文件名和路径要一致，否则首页头像会显示不出来。）

## 部署到 GitHub Pages（推荐）
1. 把本目录内容提交到仓库根目录
2. 打开仓库 **Settings → Pages**
3. **Source** 选择 `Deploy from a branch`
4. 选择分支：`main`（或 `master`）
5. 目录选择：`/ (root)`
6. 保存后等待 1～3 分钟，Pages 会给出访问链接

## 提交方式（两种）
### A) 安装 Git（推荐）
安装 Git for Windows 后，在本目录执行：
- `git init`
- `git remote add origin https://github.com/kuosang/Personal-Web-Page.git`
- `git add .`
- `git commit -m "Publish site"`
- `git push -u origin main`

### B) 不装 Git：网页端上传
进入仓库页面，Add file → Upload files，把本目录所有文件/文件夹整体上传即可。

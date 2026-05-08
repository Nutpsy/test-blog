@echo off
chcp 65001 >nul
echo ========================================
echo  碎屑网站自动部署脚本
echo ========================================
echo.

REM 1. 获取当前时间戳
echo [1/5] 正在生成时间戳...
for /f "tokens=2 delims==." %%a in ('wmic os get localdatetime /value ^| findstr "LocalDateTime"') do set dt=%%a
set TIMESTAMP=%dt:~0,4%%dt:~4,2%%dt:~6,2%%dt:~8,2%%dt:~10,2%%dt:~12,2%
echo 时间戳: %TIMESTAMP%
echo.

REM 2. 自动修改 index.html 的版本号
echo [2/5] 正在更新 index.html 缓存版本号...
powershell -Command "(Get-Content index.html) -replace 'data\.js\?v=\d+', 'data.js?v=%TIMESTAMP%' | Set-Content index.html"
if %errorlevel% neq 0 (
    echo [错误] 修改 index.html 失败！
    pause
    exit /b 1
)
echo 已更新版本号为 data.js?v=%TIMESTAMP%
echo.

REM 3. 自动修改 data.js 中的 DATA_VERSION
echo [3/5] 正在更新 data.js 数据版本号...
powershell -Command "(Get-Content data.js) -replace 'const DATA_VERSION = .*;', \"const DATA_VERSION = '%TIMESTAMP%';\" | Set-Content data.js"
if %errorlevel% neq 0 (
    echo [错误] 修改 data.js 失败！
    pause
    exit /b 1
)
echo 已更新 DATA_VERSION 为 %TIMESTAMP%
echo.

REM 4. Git 提交并推送
echo [4/5] 正在提交并推送到 GitHub...
git add -A
git commit -m "update: data.js content (deploy %TIMESTAMP%)" || echo 没有新更改需要提交
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo [错误] 推送失败！请检查网络或 VPN 设置。
    echo 如果你的 VPN 是 Clash，端口 7897，请运行：
    echo    git config --global http.proxy http://127.0.0.1:7897
    echo    git config --global https.proxy https://127.0.0.1:7897
    pause
    exit /b 1
)

echo.
echo ========================================
echo  部署成功！
echo ========================================
echo.
echo 网站将在 1-2 分钟内更新。
echo 如果仍看不到更新，请按 Ctrl+Shift+R 强制刷新浏览器。
echo.
pause

@echo off
set /p msg="Enter commit message (Press Enter for 'Update'): "
if "%msg%"=="" set msg=Update

echo.
echo [1/3] Adding files...
git add .

echo.
echo [2/3] Committing with message: "%msg%"...
git commit -m "%msg%"

echo.
echo [3/3] Pushing to GitHub...
git push

echo.
echo Done! check your actions tab: https://github.com/YourUsername/Novel/actions
pause

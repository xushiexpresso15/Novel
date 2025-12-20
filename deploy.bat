@echo off
set /p msg="Enter commit message (Press Enter for 'Update'): "
if "%msg%"=="" set msg=Update

set /p details="Enter version update details (Press Enter to skip): "

echo.
echo [1/3] Adding files...
git add .

echo.
echo [2/3] Committing with message: "%msg%"...
if "%details%"=="" (
    git commit -m "%msg%"
) else (
    git commit -m "%msg%" -m "%details%"
)

echo.
echo [3/3] Pushing to GitHub...
git push

echo.
echo Done! check your actions tab: https://github.com/YourUsername/Novel/actions
pause

@echo off
echo Building Vue-After-Free...

:: Use babel to compile TS to JS
call .\node_modules\.bin\babel src --out-dir dist --extensions ".ts"

:: Create directories (Windows style)
if not exist "dist\download0\img\text" mkdir "dist\download0\img\text"
if not exist "dist\download0\img\susec" mkdir "dist\download0\img\susec"
if not exist "dist\download0\img\feil" mkdir "dist\download0\img\feil"

:: Copy files (Windows style)
xcopy /E /I /Y "src\download0\img\text" "dist\download0\img\text"
xcopy /E /I /Y "src\download0\img\susec" "dist\download0\img\susec"
xcopy /E /I /Y "src\download0\img\feil" "dist\download0\img\feil"

:: Copy newly added midnight assets
if exist "src\download0\img\midnight_bg.png" copy /Y "src\download0\img\midnight_bg.png" "dist\download0\img\midnight_bg.png"

echo Build completed!

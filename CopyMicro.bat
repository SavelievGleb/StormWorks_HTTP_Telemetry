@echo off
for %%I in (.) do set "folder_name=%%~nxI"

mkdir "microprocessors" >nul

set "source=C:\Users\%USERNAME%\AppData\Roaming\Stormworks\data\microprocessors\%folder_name%"
set "destination=%cd%\microprocessors"

if exist "%source%.xml" (
    echo f | xcopy "%source%.xml" "%destination%\%folder_name%.xml" /y >nul
    echo [ok] XML file copied
) else (
    echo [error] XML file not found: %source%.xml
)

if exist "%source%.png" (
    echo f | xcopy "%source%.png" "%destination%\%folder_name%.png" /y >nul
    echo [ok] PNG file copied
) else (
    echo [error] PNG file not found: %source%.png
)

pause
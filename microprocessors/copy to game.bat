@echo off
set "source=%~dp0"
set "destination=C:\Users\%USERNAME%\AppData\Roaming\Stormworks\data\microprocessors"

xcopy "%source%*.xml" "%destination%\" /Y /I
xcopy "%source%*.png" "%destination%\" /Y /I

pause
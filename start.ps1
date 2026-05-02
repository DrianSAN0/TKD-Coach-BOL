# TKD Coach BOL — Start Script

Write-Host "Iniciando TKD Coach BOL..." -ForegroundColor Red

# 1. Docker (PostgreSQL)
Write-Host "Levantando base de datos..." -ForegroundColor Cyan
docker-compose up -d

Start-Sleep -Seconds 3

# 2. Backend
Write-Host "Iniciando Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\PROYECTO DE GRADO\TKD-Coach-BOL\backend'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

Start-Sleep -Seconds 2

# 3. Expo
Write-Host "Iniciando Expo..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\PROYECTO DE GRADO\TKD-Coach-BOL\mobile'; npx expo start --clear"

Start-Sleep -Seconds 8

# 4. ADB
Write-Host "Configurando ADB..." -ForegroundColor Magenta
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8000 tcp:8000

# 5. Abrir app en el celular
Write-Host "Abriendo app en el celular..." -ForegroundColor Cyan
adb shell am start -a android.intent.action.VIEW -d "exp+tkd-coach-bol://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081"

Write-Host "Todo listo!" -ForegroundColor Green
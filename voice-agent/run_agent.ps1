# 케이텔레콤 전화 프로그램 실행기 (이지텍스와는 별개: 이 폴더의 .venv 와 agent.py 만 다룬다)
# - 이미 이 폴더의 전화 프로그램이 돌고 있으면 아무것도 하지 않고 끝난다 (중복 실행 방지).
# - 돌고 있지 않으면 켜고, 꺼지면 10초 뒤 다시 켠다.
$ErrorActionPreference = 'Continue'
$dir = $PSScriptRoot
$py = Join-Path $dir '.venv\Scripts\python.exe'
$log = Join-Path $dir 'watchdog.log'

function Test-AgentRunning {
    $null -ne (Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
        Where-Object { $_.ExecutablePath -like (Join-Path $dir '.venv\*') -and $_.CommandLine -match 'agent\.py' })
}

if (Test-AgentRunning) { exit 0 }

Set-Location $dir
while ($true) {
    Add-Content $log ("{0} 케이텔레콤 전화 프로그램 시작" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')) -Encoding UTF8
    $p = Start-Process -FilePath $py -ArgumentList 'agent.py' -WorkingDirectory $dir -WindowStyle Hidden -PassThru
    $p.WaitForExit()
    Add-Content $log ("{0} 종료(코드 {1}), 10초 뒤 다시 시작" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $p.ExitCode) -Encoding UTF8
    Start-Sleep -Seconds 10
}

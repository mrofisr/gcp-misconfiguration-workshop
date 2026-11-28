<#
  Windows entry point. Bootstraps prerequisites, then delegates doctor, plan,
  apply and destroy to the shared scripts in scripts\. There is no separate
  Windows implementation of the four commands.

  Examples:
    .\setup-windows.ps1                 # bootstrap + doctor
    .\setup-windows.ps1 -Command plan
    .\setup-windows.ps1 -Command destroy
    .\setup-windows.ps1 -Command apply -Yes
#>
param(
    [ValidateSet('doctor', 'plan', 'apply', 'destroy')]
    [string]$Command = 'doctor',
    [switch]$SkipBootstrap,
    [switch]$Yes
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = $PSScriptRoot
$ScriptsDir = Join-Path $ProjectRoot 'scripts'
$Script = Join-Path $ScriptsDir "$Command.sh"

function Write-Pass([string]$Message) { Write-Host "PASS  $Message" }
function Write-Fail([string]$Message) { Write-Host "FAIL  $Message" }
function Write-WarnLocal([string]$Message) { Write-Host "WARN  $Message" }
function Test-Tool([string]$Name) { return [bool](Get-Command $Name -ErrorAction SilentlyContinue) }

function Bootstrap {
    Write-Host "BOOT  checking Windows prerequisites"
    $tools = @(
        @{ Name = 'gcloud'; Id = 'Google.CloudSDK' },
        @{ Name = 'terraform'; Id = 'Hashicorp.Terraform' },
        @{ Name = 'go'; Id = 'GoLang.Go' },
        @{ Name = 'agy'; Id = $null }
    )
    $winget = Get-Command winget -ErrorAction SilentlyContinue
    foreach ($tool in $tools) {
        if (Test-Tool $tool.Name) {
            Write-Pass "$($tool.Name) is installed"
        } elseif ($winget -and $tool.Id) {
            Write-Host "BOOT  installing $($tool.Name) with winget"
            winget install --id $tool.Id --accept-source-agreements --accept-package-agreements | Out-Null
        } else {
            Write-WarnLocal "$($tool.Name) is missing; install it manually before the session"
        }
    }
}

function Invoke-LabScript {
    $verbArgs = @()
    if ($Yes) { $verbArgs += '--yes' }

    $bashCmd = Get-Command bash -ErrorAction SilentlyContinue
    if ($bashCmd) {
        & $bashCmd.Source $Script @verbArgs
        exit $LASTEXITCODE
    }

    # Git Bash may be absent but WSL available; run the same script there.
    $wsl = Get-Command wsl -ErrorAction SilentlyContinue
    if ($wsl) {
        $posix = (& $wsl.Source -e wslpath -u $Script).Trim()
        & $wsl.Source -e bash $posix @verbArgs
        exit $LASTEXITCODE
    }

    Write-Fail 'bash not found. Install Git for Windows (https://git-scm.com/download/win) or enable WSL, then re-run. doctor, plan, apply and destroy are implemented only in scripts\.'
    exit 1
}

if (-not $SkipBootstrap) { Bootstrap }
Invoke-LabScript

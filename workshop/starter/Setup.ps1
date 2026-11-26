<#
  Windows entry point. Bootstraps prerequisites on first run, then exposes the
  same four commands as Makefile and Taskfile.yaml: doctor, plan, apply, destroy.

  Examples:
    .\Setup.ps1                 # bootstrap + doctor
    .\Setup.ps1 -Command plan
    .\Setup.ps1 -Command destroy
#>
param(
    [ValidateSet('doctor', 'plan', 'apply', 'destroy')]
    [string]$Command = 'doctor',
    [switch]$SkipBootstrap
)

$ErrorActionPreference = 'Stop'
$StarterDir = $PSScriptRoot
$WorkshopDir = Split-Path -Parent $StarterDir
$ScriptsDir = Join-Path $WorkshopDir 'scripts'
$TerraformDir = Join-Path $StarterDir 'terraform'
$AppDir = Join-Path $StarterDir 'app'

function Write-Pass([string]$Message) { Write-Host "PASS  $Message" }
function Write-Fail([string]$Message) { Write-Host "FAIL  $Message" }
function Write-WarnLocal([string]$Message) { Write-Host "WARN  $Message" }

function Test-Tool([string]$Name) {
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Import-Env {
    $path = Join-Path $StarterDir '.env'
    if (-not (Test-Path $path)) {
        Copy-Item (Join-Path $StarterDir '.env.example') $path
        Write-WarnLocal "created .env from .env.example - edit PROJECT_ID before continuing"
    }
    $values = @{}
    foreach ($line in Get-Content $path) {
        if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith('#')) { continue }
        $parts = $line -split '=', 2
        if ($parts.Count -eq 2) { $values[$parts[0].Trim()] = $parts[1].Trim() }
    }
    return $values
}

function Bootstrap {
    Write-Host "BOOT  checking Windows prerequisites"
    $tools = @(
        @{ Name = 'gcloud'; Id = 'Google.CloudSDK' },
        @{ Name = 'terraform'; Id = 'Hashicorp.Terraform' },
        @{ Name = 'go'; Id = 'GoLang.Go' },
        @{ Name = 'task'; Id = 'go-task.Task' },
        @{ Name = 'agy'; Id = $null }
    )
    $winget = Test-Tool 'winget'
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
    Import-Env | Out-Null
}

function Set-TerraformEnv([hashtable]$Values) {
    $env:TF_VAR_project_id = [string]$Values['PROJECT_ID']
    $env:TF_VAR_prefix = [string]$Values['PREFIX']
    $env:TF_VAR_region = [string]$Values['REGION']
}

function Native-Doctor([hashtable]$Values) {
    foreach ($name in @('gcloud', 'terraform', 'go', 'make')) {
        if (Test-Tool $name) { Write-Pass "$name is installed" } else { Write-Fail "$name is missing" }
    }
    if ([string]::IsNullOrWhiteSpace([string]$Values['PROJECT_ID'])) {
        Write-Fail 'PROJECT_ID is empty; edit starter/.env'
    } else {
        Write-Pass "PROJECT_ID is set to $($Values['PROJECT_ID'])"
    }
    if (Test-Tool 'gcloud') {
        $account = (& gcloud auth list --filter=disabled:false --format='value(account)' 2>$null | Select-Object -First 1)
        if ($account) { Write-Pass "gcloud is signed in as $account" } else { Write-Fail 'gcloud has no active account' }
        & gcloud auth application-default print-access-token 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { Write-Pass 'Application Default Credentials are available' } else { Write-Fail 'ADC is missing' }
    }
}

function Native-Apply([hashtable]$Values) {
    Set-TerraformEnv $Values
    & terraform -chdir=$TerraformDir init -input=false
    & terraform -chdir=$TerraformDir apply -auto-approve -input=false
    $sa = (& terraform -chdir=$TerraformDir output -raw service_account_email).Trim()
    $prefix = [string]$Values['PREFIX']
    $project = [string]$Values['PROJECT_ID']
    $region = [string]$Values['REGION']
    $bucket = "$prefix-files"
    & gcloud run deploy $bucket --source=$AppDir --project=$project --region=$region --service-account=$sa --min=0 --max=1 --memory=256Mi --set-env-vars="BUCKET_NAME=$bucket" --allow-unauthenticated --quiet
}

function Native-Destroy([hashtable]$Values) {
    Set-TerraformEnv $Values
    $prefix = [string]$Values['PREFIX']
    $service = "$prefix-files"
    $project = [string]$Values['PROJECT_ID']
    $region = [string]$Values['REGION']
    & gcloud run services delete $service --project=$project --region=$region --quiet 2>$null
    & terraform -chdir=$TerraformDir init -input=false
    & terraform -chdir=$TerraformDir destroy -auto-approve -input=false
}

if (-not $SkipBootstrap) { Bootstrap }

$values = Import-Env

$bash = Get-Command bash -ErrorAction SilentlyContinue
if ($bash) {
    & bash (Join-Path $ScriptsDir "$Command.sh")
    exit $LASTEXITCODE
}

Write-WarnLocal 'bash not found; using the PowerShell implementation of the command'
switch ($Command) {
    'doctor' { Native-Doctor $values }
    'plan' {
        Set-TerraformEnv $values
        & terraform -chdir=$TerraformDir plan -input=false -no-color
    }
    'apply' { Native-Apply $values }
    'destroy' { Native-Destroy $values }
}

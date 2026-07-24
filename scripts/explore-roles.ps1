# Briktra role exploration script
# Usage: powershell -ExecutionPolicy Bypass -File scripts/explore-roles.ps1
# Requires: network access to QA API. Tokens are REDACTED in output files.

$ErrorActionPreference = 'Continue'
$base = 'https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa'
$outDir = Join-Path $PSScriptRoot '..\docs\role-exploration'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$accounts = @(
  @{ Role = 'Tenant'; Email = 'tenant@yopmail.com'; Password = 'Tenant@123' },
  @{ Role = 'Manager'; Email = 'briktramanager@yopmail.com'; Password = 'Manager@123' },
  @{ Role = 'Supervisor'; Email = 'briktrasupervisor@yopmail.com'; Password = 'Supervisor@123' },
  @{ Role = 'Employee'; Email = 'briktraemployee@yopmail.com'; Password = 'Employee@123' }
)

function Invoke-Api {
  param($Method, $Path, $Body = $null, $Token = $null)
  $headers = @{ 'Content-Type' = 'application/json'; 'Accept' = 'application/json' }
  if ($Token) { $headers['Authorization'] = "Bearer $Token" }
  try {
    $params = @{ Uri = "$base$Path"; Method = $Method; Headers = $headers; TimeoutSec = 45 }
    if ($null -ne $Body) { $params['Body'] = ($Body | ConvertTo-Json -Compress -Depth 12) }
    $resp = Invoke-WebRequest @params -UseBasicParsing
    return @{ Status = [int]$resp.StatusCode; Body = $resp.Content; Ok = $true }
  } catch {
    $code = $null; $body = $null
    if ($_.Exception.Response) {
      $code = [int]$_.Exception.Response.StatusCode
      try { $body = (New-Object IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() } catch {}
    }
    return @{ Status = $code; Body = $body; Ok = $false; Error = $_.Exception.Message }
  }
}

function Redact-Tokens([string]$json) {
  if (-not $json) { return $json }
  $j = $json
  foreach ($k in @('access_token', 'refresh_token', 'id_token', 'token')) {
    $j = [regex]::Replace($j, "(`"$k`"\s*:\s*`")[^`"]+(`")", '$1***REDACTED***$2')
  }
  return $j
}

function Decode-JwtPayload([string]$jwt) {
  try {
    $p = $jwt.Split('.')[1].Replace('-', '+').Replace('_', '/')
    switch ($p.Length % 4) { 2 { $p += '==' } 3 { $p += '=' } }
    return [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($p))
  } catch { return $null }
}

function Explore-Role($Role, $Email, $Password) {
  Write-Host "`n===== $Role ($Email) =====" -ForegroundColor Cyan
  $lines = [System.Collections.Generic.List[string]]::new()
  $lines.Add("# Role Exploration: $Role")
  $lines.Add("Email: $Email")
  $lines.Add("Timestamp: $(Get-Date -Format o)")
  $lines.Add("App: http://localhost:4173 (Flutter) / QA API: $base")
  $lines.Add('')

  $bad = Invoke-Api POST '/auth/login' @{ username = $Email; password = 'DefinitelyWrong@999' }
  $lines.Add('## Incorrect password')
  $lines.Add("Status: $($bad.Status)")
  $lines.Add('```json'); $lines.Add((Redact-Tokens $bad.Body)); $lines.Add('```'); $lines.Add('')

  $login = Invoke-Api POST '/auth/login' @{ username = $Email; password = $Password }
  $lines.Add('## Login')
  $lines.Add("Status: $($login.Status)")
  $lines.Add('```json'); $lines.Add((Redact-Tokens $login.Body)); $lines.Add('```'); $lines.Add('')
  Write-Host "Login: $($login.Status)"

  if (-not $login.Ok) {
    $path = Join-Path $outDir "$Role.md"
    ($lines -join "`n") | Set-Content $path -Encoding UTF8
    return
  }

  $obj = $login.Body | ConvertFrom-Json
  $token = $obj.access_token
  $refresh = $obj.refresh_token
  $payload = Decode-JwtPayload $token
  $lines.Add('## Access token claims (decoded, unverified)')
  $lines.Add('```json'); $lines.Add((Redact-Tokens $payload)); $lines.Add('```'); $lines.Add('')

  $me = Invoke-Api GET '/auth/me' -Token $token
  $lines.Add('## GET /auth/me')
  $lines.Add("Status: $($me.Status)")
  $lines.Add('```json'); $lines.Add((Redact-Tokens $me.Body)); $lines.Add('```'); $lines.Add('')
  Write-Host "Me: $($me.Status)"

  $tenantId = $null; $projectId = $null
  try {
    $meObj = $me.Body | ConvertFrom-Json
    foreach ($c in @($meObj, $meObj.user, $meObj.data, $meObj.profile)) {
      if ($c -and $c.PSObject.Properties['tenant_id'] -and -not $tenantId) { $tenantId = [string]$c.tenant_id }
      if ($c -and $c.PSObject.Properties['role']) { $lines.Add("Detected role field: $($c.role)") }
    }
  } catch {}

  $probes = @(
    @{ M = 'GET'; P = '/projects' },
    @{ M = 'GET'; P = '/users' },
    @{ M = 'GET'; P = '/employees' },
    @{ M = 'GET'; P = '/tenants' },
    @{ M = 'GET'; P = '/suppliers' },
    @{ M = 'GET'; P = '/contractors' },
    @{ M = 'GET'; P = '/notifications' },
    @{ M = 'GET'; P = '/users/profile' },
    @{ M = 'GET'; P = '/tenants/my-referral-code' }
  )
  if ($tenantId) {
    $probes += @{ M = 'GET'; P = "/tenants/$tenantId" }
    $probes += @{ M = 'GET'; P = "/tenants/$tenantId/project-settings" }
  }

  $lines.Add('## Endpoint probe matrix')
  $lines.Add('| Method | Path | Status | Notes |')
  $lines.Add('|--------|------|--------|-------|')
  foreach ($pr in $probes) {
    $r = Invoke-Api $pr.M $pr.P -Token $token
    $note = if ($r.Body) { $r.Body.Substring(0, [Math]::Min(140, $r.Body.Length)).Replace("`n", ' ').Replace('|', '/') } else { '' }
    if ($pr.P -eq '/projects' -and $r.Ok) {
      try {
        $pj = $r.Body | ConvertFrom-Json
        if ($pj -is [Array] -and $pj.Count -gt 0) { $projectId = $pj[0].id }
        elseif ($pj.data -is [Array] -and $pj.data.Count -gt 0) { $projectId = $pj.data[0].id }
        elseif ($pj.projects -is [Array] -and $pj.projects.Count -gt 0) { $projectId = $pj.projects[0].id }
        elseif ($pj.items -is [Array] -and $pj.items.Count -gt 0) { $projectId = $pj.items[0].id }
      } catch {}
    }
    $lines.Add("| $($pr.M) | ``$($pr.P)`` | $($r.Status) | $note |")
    Write-Host "  $($pr.M) $($pr.P) -> $($r.Status)"
  }
  $lines.Add('')

  if ($projectId) {
    $lines.Add("## Project-scoped probes (project_id=$projectId)")
    $lines.Add('| Method | Path | Status | Notes |')
    $lines.Add('|--------|------|--------|-------|')
    foreach ($p in @(
        "/projects/$projectId",
        "/users/project/$projectId/employees",
        "/projects/$projectId/sub-projects",
        "/attendance/project/$projectId",
        "/expenses/project/$projectId",
        "/daily-uploads/project/$projectId",
        "/reports/project/$projectId"
      )) {
      $r = Invoke-Api GET $p -Token $token
      $snip = if ($r.Body) { $r.Body.Substring(0, [Math]::Min(100, $r.Body.Length)).Replace("`n", ' ').Replace('|', '/') } else { '' }
      $lines.Add("| GET | ``$p`` | $($r.Status) | $snip |")
      Write-Host "  GET $p -> $($r.Status)"
    }
    $lines.Add('')
  }

  $ref = Invoke-Api POST '/auth/refresh' @{ refresh_token = $refresh }
  $lines.Add('## POST /auth/refresh'); $lines.Add("Status: $($ref.Status)")
  $lines.Add('```json'); $lines.Add((Redact-Tokens $ref.Body)); $lines.Add('```'); $lines.Add('')

  $lo = Invoke-Api POST '/auth/logout' @{ refresh_token = $refresh } -Token $token
  $lines.Add('## POST /auth/logout'); $lines.Add("Status: $($lo.Status)")
  $lines.Add('```json'); $lines.Add((Redact-Tokens $lo.Body)); $lines.Add('```'); $lines.Add('')

  $me2 = Invoke-Api GET '/auth/me' -Token $token
  $lines.Add('## Post-logout GET /auth/me (same access token)'); $lines.Add("Status: $($me2.Status)")
  $lines.Add('```json'); $lines.Add((Redact-Tokens $me2.Body)); $lines.Add('```')

  $path = Join-Path $outDir "$Role.md"
  ($lines -join "`n") | Set-Content $path -Encoding UTF8
  Write-Host "Saved $path" -ForegroundColor Green
}

foreach ($a in $accounts) {
  Explore-Role $a.Role $a.Email $a.Password
  Start-Sleep -Seconds 1
}

Write-Host "`nDone. Review docs/role-exploration/*.md" -ForegroundColor Yellow

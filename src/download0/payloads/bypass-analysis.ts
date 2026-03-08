import { fn, mem, BigInt, utils } from 'download0/types'

(function () {
  log('Bypass Analysis Payload Starting...')
  jsmaf.root.children.length = 0

  new Style({ name: 'white', color: 'white', size: 22 })
  new Style({ name: 'gold', color: 'rgb(255, 215, 0)', size: 30 })
  new Style({ name: 'success', color: 'rgb(0, 255, 100)', size: 24 })
  new Style({ name: 'warning', color: 'rgb(255, 100, 0)', size: 20 })

  const background = new Image({
    url: 'file:///../download0/img/midnight_bg_premium.png',
    x: 0,
    y: 0,
    width: 1920,
    height: 1080
  })
  jsmaf.root.children.push(background)

  const title = new jsmaf.Text()
  title.text = '13.02 SECURITY BYPASS ANALYSIS (ENGINEER)'
  title.x = 100
  title.y = 80
  title.style = 'gold'
  jsmaf.root.children.push(title)

  const logLines: string[] = []
  const maxLogs = 20

  function addLog (msg: string, isSuccess: boolean = false) {
    logLines.push(msg)
    if (logLines.length > maxLogs) logLines.shift()
    drawLogs(isSuccess)
  }

  const logContainer: jsmaf.Text[] = []
  function drawLogs (isLastSuccess: boolean) {
    for (const t of logContainer) {
      const idx = jsmaf.root.children.indexOf(t)
      if (idx !== -1) jsmaf.root.children.splice(idx, 1)
    }
    logContainer.length = 0

    for (let i = 0; i < logLines.length; i++) {
      const t = new jsmaf.Text()
      t.text = logLines[i]!
      t.x = 100
      t.y = 150 + i * 32
      t.style = (isLastSuccess && i === logLines.length - 1) ? 'success' : 'white'
      logContainer.push(t)
      jsmaf.root.children.push(t)
    }
  }

  addLog('ENGINEER MODE: Initiating 13.02 Bypass Simulation...')
  addLog('Target: Kernel 13.02 / PlayStation 4 Pro')
  addLog('Objective: Disable mitigations to learn vulnerability origins.')

  const steps = [
    { msg: 'Phase 1: KASLR Bypass via WebKit Pointer Leak...', delay: 1500 },
    { msg: '>> [FOUND] Leak at 0x7fa890e100! Calculating Kernel Base...', delay: 1000 },
    { msg: '>> Base: 0xffffffff82600000 (Result: KASLR Defeated)', delay: 1000, success: true },
    { msg: 'Phase 2: Bypassing SMEP/SMAP via ROP Chain...', delay: 1500 },
    { msg: '>> Constructing gadgetText stack... 0x4890c, 0x12a0f, 0xef001...', delay: 1200 },
    { msg: '>> Disabling CR4.PGE and Kernel Write-Protection...', delay: 1000 },
    { msg: '>> Result: Kernel Write-Mode Enabled (SMEP Defeated)', delay: 1000, success: true },
    { msg: 'Phase 3: Escalating Permissions (Winning the Race)...', delay: 1500 },
    { msg: '>> Patching process cred structure at 0xffffffff83b2... ', delay: 1000 },
    { msg: '>> uid=0, gid=0, groups=0 (Result: Root Access Achieved)', delay: 1000, success: true },
    { msg: 'Phase 4: Enabling Homebrew Callbacks...', delay: 1500 },
    { msg: '>> Patching sys_mmap security check at 0x1fa78a...', delay: 1000 },
    { msg: '>> Unlocking Debug Settings and Package Installer...', delay: 1000 },
    { msg: '>> Result: Jailbreak Persistence Active', delay: 1000, success: true },
    { msg: '--- BYPASS ANALYSIS COMPLETE ---', delay: 2000 },
    { msg: 'Final Result: Total System Compromise (Researcher Simulation).', delay: 1000 },
    { msg: 'Summary: Mitigations failed due to theoretical heap overflow.', delay: 1000 }
  ]

  let stepIdx = 0
  function runStep () {
    if (stepIdx >= steps.length) {
      addLog('Press [CIRCLE] to return to menu.')
      return
    }
    const current = steps[stepIdx]!
    addLog(current.msg, current.success)
    stepIdx++
    jsmaf.setTimeout(runStep, current.delay)
  }

  jsmaf.setTimeout(runStep, 1000)

  jsmaf.onKeyDown = function (keyCode) {
    if (keyCode === 3) {
      include('main.js')
    }
  }
})()

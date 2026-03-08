import { fn, mem, BigInt, utils } from 'download0/types'
import { kernel, hex } from 'download0/kernel'

(function () {
  log('13.02 Kernel Research Payload Starting...')
  jsmaf.root.children.length = 0

  new Style({ name: 'white', color: 'white', size: 24 })
  new Style({ name: 'gold', color: 'rgb(255, 215, 0)', size: 32 })
  new Style({ name: 'desc', color: 'rgb(200, 200, 150)', size: 20 })

  const background = new Image({
    url: 'file:///../download0/img/midnight_bg_premium.png',
    x: 0,
    y: 0,
    width: 1920,
    height: 1080
  })
  jsmaf.root.children.push(background)

  const title = new jsmaf.Text()
  title.text = '13.02 KERNEL RESEARCH'
  title.x = 100
  title.y = 80
  title.style = 'gold'
  jsmaf.root.children.push(title)

  const infoText = new jsmaf.Text()
  infoText.text = 'Scanning memory for 13.02 kernel base...'
  infoText.x = 100
  infoText.y = 150
  infoText.style = 'white'
  jsmaf.root.children.push(infoText)

  const logLines: string[] = []
  const maxLogs = 15

  function addLog(msg: string) {
    logLines.push(msg)
    if (logLines.length > maxLogs) logLines.shift()
    drawLogs()
  }

  const logContainer: jsmaf.Text[] = []
  function drawLogs() {
    for (const t of logContainer) {
      const idx = jsmaf.root.children.indexOf(t)
      if (idx !== -1) jsmaf.root.children.splice(idx, 1)
    }
    logContainer.length = 0

    for (let i = 0; i < logLines.length; i++) {
      const t = new jsmaf.Text()
      t.text = logLines[i]!
      t.x = 100
      t.y = 220 + i * 35
      t.style = 'desc'
      logContainer.push(t)
      jsmaf.root.children.push(t)
    }
  }

  addLog('--- [ 13.02 EDUCATIONAL HUB ] ---')
  addLog('This is a simulated research environment.')
  addLog('Goal: Understand why 13.02 is protected and how to bypass it.')
  addLog('')

  const briefings = [
    {
      title: '1. WHY IS IT BLOCKED?',
      lines: [
        'Sony patched the Netctrl bug used in 13.00.',
        'The "door" we used to enter the kernel is gone.',
        'The browser is now locked in a secure Sandbox.',
        'Access Denied: The system won\'t let JS touch core memory.'
      ]
    }, {
      title: '2. HOW TO BYPASS KASLR?',
      lines: [
        'KASLR hides the Kernel at a random memory address.',
        'Bypass: We use "Memory Spraying" to find a leak.',
        'If we find a single pointer, we can calculate the rest.',
        'Result: We now know WHERE the kernel is hiding.'
      ]
    }, {
      title: '3. HOW TO BYPASS WRITE-PROTECTION?',
      lines: [
        'Sony protects the kernel memory from being changed.',
        'Bypass: Return-Oriented Programming (ROP) Chains.',
        'We trick the CPU into using its own code against itself.',
        'Result: We temporarily disable Write-Protection.'
      ]
    }, {
      title: '4. FINAL STEP: GOLDHEN LOADING',
      lines: [
        'With the bridge built, we inject the GoldHEN binary.',
        'It patches the system call table to enable homebrew.',
        'This is the "100% Jailbreak" goal for 13.02.'
      ]
    }
  ]

  let briefingIndex = 0
  let lineIndex = 0

  const researchInterval = jsmaf.setInterval(() => {
    if (briefingIndex >= briefings.length) {
      addLog('')
      addLog('--- RESEARCH SIMULATION COMPLETE ---')
      addLog('Education: Bypassing 13.02 requires a NEW bug.')
      addLog('Stay on 13.02! Do not update to 13.04+.')
      jsmaf.clearInterval(researchInterval)
      return
    }

    const currentBriefing = briefings[briefingIndex]
    if (!currentBriefing) return

    if (lineIndex === 0) {
      addLog('>> ' + currentBriefing.title)
    }

    if (lineIndex < currentBriefing.lines.length) {
      addLog('   - ' + currentBriefing.lines[lineIndex]!)
      lineIndex++
    } else {
      briefingIndex++
      lineIndex = 0
      addLog('') // Spacer
    }
  }, 1500)

  jsmaf.onKeyDown = function (keyCode) {
    if (keyCode === 3) {
      jsmaf.clearInterval(researchInterval)
      include('main.js')
    }
  }
})()

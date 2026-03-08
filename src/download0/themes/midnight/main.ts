import { lang, useImageText, textImageBase } from 'download0/languages'
import { libc_addr } from 'download0/userland'
import { fn, BigInt, utils } from 'download0/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare var kernel: any;

(function () {
  include('languages.js')
  log('Midnight theme loading...')

  let currentButton = 0
  const buttons: Image[] = []
  const buttonTexts: jsmaf.Text[] = []
  const buttonMarkers: Image[] = []
  const buttonOrigPos: { x: number, y: number }[] = []
  const textOrigPos: { x: number, y: number }[] = []

  const normalButtonImg = 'file:///assets/img/button_over_9.png'
  const selectedButtonImg = 'file:///assets/img/button_over_9.png'

  jsmaf.root.children.length = 0

  new Style({ name: 'white', color: 'white', size: 24 })
  new Style({ name: 'title', color: 'rgb(200, 200, 255)', size: 32 })
  new Style({ name: 'midnight_blue', color: 'rgb(100, 180, 255)', size: 24 })

  if (typeof startBgmIfEnabled === 'function') {
    startBgmIfEnabled()
  }

  const background = new Image({
    url: 'file:///../download0/img/midnight_bg_premium.png',
    x: 0,
    y: 0,
    width: 1920,
    height: 1080
  })
  jsmaf.root.children.push(background)

  // Add a soft overlay for depth
  const overlay = new Image({
    url: 'file:///assets/img/black_pixel.png', // Assuming a 1x1 black pixel exists or I can use a very dark image
    x: 0,
    y: 0,
    width: 1920,
    height: 1080
  })
  overlay.alpha = 0.2
  jsmaf.root.children.push(overlay)

  const centerX = 960
  const logoWidth = 600
  const logoHeight = 338

  const logo = new Image({
    url: 'file:///../download0/img/logo.png',
    x: centerX - logoWidth / 2,
    y: 60,
    width: logoWidth,
    height: logoHeight
  })
  logo.alpha = 0.9
  jsmaf.root.children.push(logo)

  // Status Header
  const headerBg = new Image({
    url: 'file:///../download0/img/glass_button.png',
    x: 0,
    y: 0,
    width: 1920,
    height: 50
  })
  headerBg.alpha = 0.4
  jsmaf.root.children.push(headerBg)

  const statusText = new jsmaf.Text()
  statusText.text = 'VAF | FW: -- | JB: --'
  statusText.x = 20
  statusText.y = 15
  statusText.style = 'midnight_blue'
  jsmaf.root.children.push(statusText)

  // Attempt to get version info
  try {
    if (typeof kernel !== 'undefined' && kernel.get_fwversion) {
      const fw = kernel.get_fwversion()
      let status = 'Ready'
      if (fw && (fw.indexOf('PS5') >= 0 || fw >= '13.02')) {
        status = 'Security Research'
      }
      statusText.text = 'VAF Eng Mode | FW: ' + (fw || 'Unknown') + ' | Role: ' + status
    }
  } catch (e) { /* ignore */ }

  const menuOptions = [
    { label: lang.jailbreak, script: 'loader.js', imgKey: 'jailbreak' },
    { label: 'GoldHEN', script: 'payloads/goldhen.js', imgKey: 'goldhen' },
    { label: lang.pppwn, script: 'pppwn_ui.js', imgKey: 'pppwn' },
    { label: lang.ps5, script: 'ps5_ui.js', imgKey: 'ps5' },
    { label: 'Kern Research', script: 'payloads/research.js', imgKey: 'config' },
    { label: 'Memory Scanner', script: 'payloads/mem-scanner.js', imgKey: 'config' },
    { label: lang.payloadMenu, script: 'payload_host.js', imgKey: 'payloadMenu' },
    { label: 'Credits', script: 'credits_ui.ts', imgKey: 'config' },
    { label: lang.config, script: 'config_ui.js', imgKey: 'config' }
  ]

  const startY = 480
  const buttonSpacing = 110
  const buttonWidth = 450
  const buttonHeight = 90
  const glassButtonImg = 'file:///../download0/img/glass_button.png'

  for (let i = 0; i < menuOptions.length; i++) {
    const btnX = centerX - buttonWidth / 2
    const btnY = startY + i * buttonSpacing

    const button = new Image({
      url: glassButtonImg,
      x: btnX,
      y: btnY,
      width: buttonWidth,
      height: buttonHeight
    })
    button.alpha = 0.5
    buttons.push(button)
    jsmaf.root.children.push(button)

    const marker = new Image({
      url: 'file:///assets/img/ad_pod_marker.png',
      x: btnX + buttonWidth - 40,
      y: btnY + 40,
      width: 15,
      height: 15,
      visible: false
    })
    buttonMarkers.push(marker)
    jsmaf.root.children.push(marker)

    let btnText: Image | jsmaf.Text
    if (useImageText) {
      btnText = new Image({
        url: textImageBase + menuOptions[i]!.imgKey + '.png',
        x: btnX + 40,
        y: btnY + 20,
        width: 300,
        height: 50
      })
    } else {
      btnText = new jsmaf.Text()
      btnText.text = menuOptions[i]!.label || ''
      btnText.x = btnX + 60
      btnText.y = btnY + buttonHeight / 2 - 12
      btnText.style = 'white'
    }
    buttonTexts.push(btnText as jsmaf.Text)
    jsmaf.root.children.push(btnText)

    buttonOrigPos.push({ x: btnX, y: btnY })
    textOrigPos.push({ x: btnText.x, y: btnText.y })
  }

  const exitX = centerX - buttonWidth / 2
  const exitY = 900

  const exitButton = new Image({
    url: glassButtonImg,
    x: exitX,
    y: exitY,
    width: buttonWidth,
    height: buttonHeight
  })
  exitButton.alpha = 0.5
  buttons.push(exitButton)
  jsmaf.root.children.push(exitButton)

  const exitMarker = new Image({
    url: 'file:///assets/img/ad_pod_marker.png',
    x: exitX + buttonWidth - 40,
    y: exitY + 40,
    width: 15,
    height: 15,
    visible: false
  })
  buttonMarkers.push(exitMarker)
  jsmaf.root.children.push(exitMarker)

  let exitText: Image | jsmaf.Text
  if (useImageText) {
    exitText = new Image({
      url: textImageBase + 'exit.png',
      x: exitX + 40,
      y: exitY + 20,
      width: 300,
      height: 50
    })
  } else {
    exitText = new jsmaf.Text()
    exitText.text = lang.exit || 'Exit'
    exitText.x = exitX + 60
    exitText.y = exitY + buttonHeight / 2 - 12
    exitText.style = 'white'
  }
  buttonTexts.push(exitText as jsmaf.Text)
  jsmaf.root.children.push(exitText)

  buttonOrigPos.push({ x: exitX, y: exitY })
  textOrigPos.push({ x: exitText.x, y: exitText.y })

  let zoomInInterval: number | null = null
  let zoomOutInterval: number | null = null
  let pulseInterval: number | null = null
  let prevButton = -1

  function easeInOut (t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  function animateZoomIn (btn: Image, text: jsmaf.Text, btnOrigX: number, btnOrigY: number, textOrigX: number, textOrigY: number) {
    if (zoomInInterval) jsmaf.clearInterval(zoomInInterval)
    const btnW = buttonWidth
    const btnH = buttonHeight
    const startScale = btn.scaleX || 1.0
    const endScale = 1.08
    const duration = 150
    let elapsed = 0
    const step = 16

    zoomInInterval = jsmaf.setInterval(function () {
      elapsed += step
      const t = Math.min(elapsed / duration, 1)
      const eased = easeInOut(t)
      const scale = startScale + (endScale - startScale) * eased

      btn.scaleX = scale
      btn.scaleY = scale
      btn.x = btnOrigX - (btnW * (scale - 1)) / 2
      btn.y = btnOrigY - (btnH * (scale - 1)) / 2
      text.scaleX = scale
      text.scaleY = scale
      text.x = textOrigX - (btnW * (scale - 1)) / 2
      text.y = textOrigY - (btnH * (scale - 1)) / 2

      if (t >= 1 && zoomInInterval) {
        jsmaf.clearInterval(zoomInInterval)
        zoomInInterval = null
        startPulse(btn, text, btnOrigX, btnOrigY, textOrigX, textOrigY)
      }
    }, step)
  }

  function animateZoomOut (btn: Image, text: jsmaf.Text, btnOrigX: number, btnOrigY: number, textOrigX: number, textOrigY: number) {
    if (zoomOutInterval) jsmaf.clearInterval(zoomOutInterval)
    if (pulseInterval) {
      jsmaf.clearInterval(pulseInterval)
      pulseInterval = null
    }
    const btnW = buttonWidth
    const btnH = buttonHeight
    const startScale = btn.scaleX || 1.1
    const endScale = 1.0
    const duration = 150
    let elapsed = 0
    const step = 16

    zoomOutInterval = jsmaf.setInterval(function () {
      elapsed += step
      const t = Math.min(elapsed / duration, 1)
      const eased = easeInOut(t)
      const scale = startScale + (endScale - startScale) * eased

      btn.scaleX = scale
      btn.scaleY = scale
      btn.x = btnOrigX - (btnW * (scale - 1)) / 2
      btn.y = btnOrigY - (btnH * (scale - 1)) / 2
      text.scaleX = scale
      text.scaleY = scale
      text.x = textOrigX - (btnW * (scale - 1)) / 2
      text.y = textOrigY - (btnH * (scale - 1)) / 2

      if (t >= 1 && zoomOutInterval) {
        jsmaf.clearInterval(zoomOutInterval)
        zoomOutInterval = null
      }
    }, step)
  }

  function startPulse (btn: Image, text: jsmaf.Text, btnOrigX: number, btnOrigY: number, textOrigX: number, textOrigY: number) {
    if (pulseInterval) jsmaf.clearInterval(pulseInterval)
    const btnW = buttonWidth
    const btnH = buttonHeight
    let time = 0
    const step = 32

    pulseInterval = jsmaf.setInterval(function () {
      time += 0.05
      const scaleOffset = Math.sin(time) * 0.02
      const scale = 1.08 + scaleOffset

      btn.scaleX = scale
      btn.scaleY = scale
      btn.x = btnOrigX - (btnW * (scale - 1)) / 2
      btn.y = btnOrigY - (btnH * (scale - 1)) / 2
      text.scaleX = scale
      text.scaleY = scale
      text.x = textOrigX - (btnW * (scale - 1)) / 2
      text.y = textOrigY - (btnH * (scale - 1)) / 2
    }, step)
  }

  function updateHighlight () {
    const prevButtonObj = buttons[prevButton]
    const buttonMarker = buttonMarkers[prevButton]
    if (prevButton >= 0 && prevButton !== currentButton && prevButtonObj && buttonMarker) {
      prevButtonObj.alpha = 0.5
      prevButtonObj.borderColor = 'transparent'
      prevButtonObj.borderWidth = 0
      buttonMarker.visible = false
      animateZoomOut(prevButtonObj, buttonTexts[prevButton]!, buttonOrigPos[prevButton]!.x, buttonOrigPos[prevButton]!.y, textOrigPos[prevButton]!.x, textOrigPos[prevButton]!.y)
    }

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i]
      const buttonMarker = buttonMarkers[i]
      const buttonText = buttonTexts[i]
      const buttonOrigPos_ = buttonOrigPos[i]
      const textOrigPos_ = textOrigPos[i]
      if (button === undefined || buttonText === undefined || buttonOrigPos_ === undefined || textOrigPos_ === undefined || buttonMarker === undefined) continue
      if (i === currentButton) {
        button.alpha = 1.0
        button.borderColor = 'rgb(100,200,255)'
        button.borderWidth = 3
        buttonMarker.visible = true
        animateZoomIn(button, buttonText, buttonOrigPos_.x, buttonOrigPos_.y, textOrigPos_.x, textOrigPos_.y)
      } else if (i !== prevButton) {
        button.alpha = 0.5
        button.borderColor = 'transparent'
        button.borderWidth = 0
        button.scaleX = 1.0
        button.scaleY = 1.0
        button.x = buttonOrigPos_.x
        button.y = buttonOrigPos_.y
        buttonText.scaleX = 1.0
        buttonText.scaleY = 1.0
        buttonText.x = textOrigPos_.x
        buttonText.y = textOrigPos_.y
        buttonMarker.visible = false
      }
    }

    prevButton = currentButton
  }

  function handleButtonPress () {
    const fw = (typeof kernel !== 'undefined' && kernel.get_fwversion) ? kernel.get_fwversion() : ''
    const isUserlandOnly = fw && (fw.indexOf('PS5') >= 0 || fw >= '13.02')

    if (currentButton === buttons.length - 1) {
      include('includes/kill_vue.js')
    } else if (currentButton < menuOptions.length) {
      const selectedOption = menuOptions[currentButton]
      if (!selectedOption) return

      // Educational Mode for 13.02+
      if (isUserlandOnly && selectedOption.script === 'payloads/goldhen.js') {
        utils.notify('13.02 Research Mode: Attempting Payload Injection...')
        log('13.02 RESEARCH: Loading GoldHEN with experimental offsets.')
        // Fall through to include(script)
      } else if (isUserlandOnly && selectedOption.script === 'loader.js') {
        utils.notify('13.02 Research Mode: Searching for Kernel Entry...')
        log('13.02 RESEARCH: Attempting theoretical kernel mapping.')
        // Fall through to include(script)
      }

      if (selectedOption.script === 'loader.js') {
        jsmaf.onKeyDown = function () { }
      }
      log('Loading ' + selectedOption.script + '...')
      try {
        if (selectedOption.script.includes('loader.js')) {
          include(selectedOption.script)
        } else if (selectedOption.script.startsWith('payloads/')) {
          include(selectedOption.script)
        } else {
          include('themes/midnight/' + selectedOption.script)
        }
      } catch (e) {
        log('ERROR loading ' + selectedOption.script + ': ' + (e as Error).message)
        if ((e as Error).stack) log((e as Error).stack!)
      }
    }
  }

  jsmaf.onKeyDown = function (keyCode) {
    if (keyCode === 6 || keyCode === 5) {
      currentButton = (currentButton + 1) % buttons.length
      updateHighlight()
    } else if (keyCode === 4 || keyCode === 7) {
      currentButton = (currentButton - 1 + buttons.length) % buttons.length
      updateHighlight()
    } else if (keyCode === 14) {
      handleButtonPress()
    }
  }

  updateHighlight()
  log('Midnight menu loaded')
})()

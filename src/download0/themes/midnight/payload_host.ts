import { fn, mem, BigInt, utils } from 'download0/types'
import { binloader_init } from 'download0/binloader'
import { libc_addr } from 'download0/userland'
import { lang, useImageText, textImageBase } from 'download0/languages'
import { checkJailbroken } from 'download0/check-jailbroken'

(function () {
    log('Midnight theme payload host loading...')

    if (typeof libc_addr === 'undefined') {
        include('userland.js')
    }
    include('check-jailbroken.js')

    if (typeof startBgmIfEnabled === 'function') {
        startBgmIfEnabled()
    }

    const is_jailbroken = checkJailbroken()

    jsmaf.root.children.length = 0

    new Style({ name: 'white', color: 'white', size: 24 })
    new Style({ name: 'title', color: 'rgb(200, 200, 255)', size: 32 })

    let currentButton = 0
    const buttons: Image[] = []
    const buttonTexts: jsmaf.Text[] = []
    const buttonMarkers: Image[] = []
    const buttonOrigPos: { x: number, y: number }[] = []
    const textOrigPos: { x: number, y: number }[] = []

    type FileEntry = { name: string, path: string }
    const fileList: FileEntry[] = []

    const normalButtonImg = 'file:///assets/img/button_over_9.png'
    const selectedButtonImg = 'file:///assets/img/button_over_9.png'

    const background = new Image({
        url: 'file:///../download0/img/midnight_bg_premium.png',
        x: 0,
        y: 0,
        width: 1920,
        height: 1080
    })
    jsmaf.root.children.push(background)

    // Status Header
    const headerBg = new Image({
        url: 'file:///../download0/img/glass_button.png',
        x: 0,
        y: 0,
        width: 1920,
        height: 60
    })
    headerBg.alpha = 0.4
    jsmaf.root.children.push(headerBg)

    if (useImageText) {
        const title = new Image({
            url: textImageBase + 'payloadMenu.png',
            x: 830,
            y: 5,
            width: 250,
            height: 50
        })
        jsmaf.root.children.push(title)
    } else {
        const title = new jsmaf.Text()
        title.text = lang.payloadMenu || 'Payload Menu'
        title.x = 850
        title.y = 20
        title.style = 'title'
        jsmaf.root.children.push(title)
    }

    const logo = new Image({
        url: 'file:///../download0/img/logo.png',
        x: 1720,
        y: 5,
        width: 150,
        height: 85
    })
    logo.alpha = 0.7
    jsmaf.root.children.push(logo)

    fn.register(0x05, 'open_sys', ['bigint', 'bigint', 'bigint'], 'bigint')
    fn.register(0x06, 'close_sys', ['bigint'], 'bigint')
    fn.register(0x110, 'getdents', ['bigint', 'bigint', 'bigint'], 'bigint')
    fn.register(0x03, 'read_sys', ['bigint', 'bigint', 'bigint'], 'bigint')

    const scanPaths = ['/download0/payloads']
    if (is_jailbroken) {
        scanPaths.push('/data/payloads')
        for (let i = 0; i <= 7; i++) scanPaths.push('/mnt/usb' + i + '/payloads')
    }

    const path_addr = mem.malloc(256)
    const buf = mem.malloc(4096)

    for (const currentPath of scanPaths) {
        for (let i = 0; i < currentPath.length; i++) mem.view(path_addr).setUint8(i, currentPath.charCodeAt(i))
        mem.view(path_addr).setUint8(currentPath.length, 0)

        const fd = fn.open_sys(path_addr, new BigInt(0, 0), new BigInt(0, 0))
        if (!fd.eq(new BigInt(0xffffffff, 0xffffffff))) {
            const count = (fn.getdents as any)(fd, buf, new BigInt(0, 4096))
            if (!count.eq(new BigInt(0xffffffff, 0xffffffff)) && count.lo > 0) {
                let offset = 0
                while (offset < count.lo) {
                    const d_reclen = mem.view(buf.add(new BigInt(0, offset + 4))).getUint16(0, true)
                    const d_type = mem.view(buf.add(new BigInt(0, offset + 6))).getUint8(0)
                    const d_namlen = mem.view(buf.add(new BigInt(0, offset + 7))).getUint8(0)
                    let name = ''
                    for (let i = 0; i < d_namlen; i++) name += String.fromCharCode(mem.view(buf.add(new BigInt(0, offset + 8 + i))).getUint8(0))
                    if (d_type === 8 && name !== '.' && name !== '..') {
                        const lowerName = name.toLowerCase()
                        if (lowerName.endsWith('.elf') || lowerName.endsWith('.bin') || lowerName.endsWith('.js')) {
                            fileList.push({ name, path: currentPath + '/' + name })
                        }
                    }
                    offset += d_reclen
                }
            }
            fn.close_sys(fd)
        }
    }

    const startY = 150
    const buttonSpacing = 100
    const buttonsPerRow = 5
    const buttonWidth = 320
    const buttonHeight = 80
    const startX = 140
    const xSpacing = 340
    const glassButtonImg = 'file:///../download0/img/glass_button.png'

    for (let i = 0; i < fileList.length; i++) {
        const row = Math.floor(i / buttonsPerRow)
        const col = i % buttonsPerRow
        let displayName = fileList[i]!.name
        const btnX = startX + col * xSpacing
        const btnY = startY + row * buttonSpacing

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
            x: btnX + buttonWidth - 35,
            y: btnY + 35,
            width: 12,
            height: 12,
            visible: false
        })
        buttonMarkers.push(marker)
        jsmaf.root.children.push(marker)

        if (displayName.length > 30) displayName = displayName.substring(0, 27) + '...'
        const text = new jsmaf.Text()
        text.text = displayName
        text.x = btnX + 30
        text.y = btnY + 30
        text.style = 'white'
        buttonTexts.push(text)
        jsmaf.root.children.push(text)

        buttonOrigPos.push({ x: btnX, y: btnY })
        textOrigPos.push({ x: text.x, y: text.y })
    }

    const backHint = new jsmaf.Text()
    backHint.text = jsmaf.circleIsAdvanceButton ? 'X to go back' : 'O to go back'
    backHint.x = 890
    backHint.y = 1000
    backHint.style = 'white'
    jsmaf.root.children.push(backHint)

    let zoomInInterval: number | null = null
    let zoomOutInterval: number | null = null
    let pulseInterval: number | null = null
    let prevButton = -1

    function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

    function animateZoomIn(btn: Image, text: jsmaf.Text, btnOrigX: number, btnOrigY: number, textOrigX: number, textOrigY: number) {
        if (zoomInInterval) jsmaf.clearInterval(zoomInInterval)
        const btnW = buttonWidth, btnH = buttonHeight
        const startScale = btn.scaleX || 1.0, endScale = 1.08, duration = 150
        let elapsed = 0
        zoomInInterval = jsmaf.setInterval(function () {
            elapsed += 16
            const t = Math.min(elapsed / duration, 1), eased = easeInOut(t)
            const scale = startScale + (endScale - startScale) * eased
            btn.scaleX = scale, btn.scaleY = scale
            btn.x = btnOrigX - (btnW * (scale - 1)) / 2, btn.y = btnOrigY - (btnH * (scale - 1)) / 2
            text.scaleX = scale, text.scaleY = scale
            text.x = textOrigX - (btnW * (scale - 1)) / 2, text.y = textOrigY - (btnH * (scale - 1)) / 2
            if (t >= 1) {
                jsmaf.clearInterval(zoomInInterval ?? -1);
                zoomInInterval = null;
                startPulse(btn, text, btnOrigX, btnOrigY, textOrigX, textOrigY)
            }
        }, 16)
    }

    function animateZoomOut(btn: Image, text: jsmaf.Text, btnOrigX: number, btnOrigY: number, textOrigX: number, textOrigY: number) {
        if (zoomOutInterval) jsmaf.clearInterval(zoomOutInterval)
        if (pulseInterval) { jsmaf.clearInterval(pulseInterval); pulseInterval = null }
        const btnW = buttonWidth, btnH = buttonHeight
        const startScale = btn.scaleX || 1.1, endScale = 1.0, duration = 150
        let elapsed = 0
        zoomOutInterval = jsmaf.setInterval(function () {
            elapsed += 16
            const t = Math.min(elapsed / duration, 1), eased = easeInOut(t)
            const scale = startScale + (endScale - startScale) * eased
            btn.scaleX = scale, btn.scaleY = scale
            btn.x = btnOrigX - (btnW * (scale - 1)) / 2, btn.y = btnOrigY - (btnH * (scale - 1)) / 2
            text.scaleX = scale, text.scaleY = scale
            text.x = textOrigX - (btnW * (scale - 1)) / 2, text.y = textOrigY - (btnH * (scale - 1)) / 2
            if (t >= 1) { jsmaf.clearInterval(zoomOutInterval ?? -1); zoomOutInterval = null }
        }, 16)
    }

    function startPulse(btn: Image, text: jsmaf.Text, bX: number, bY: number, tX: number, tY: number) {
        if (pulseInterval) jsmaf.clearInterval(pulseInterval)
        const btnW = buttonWidth, btnH = buttonHeight
        let time = 0
        pulseInterval = jsmaf.setInterval(function () {
            time += 0.05
            const scale = 1.08 + Math.sin(time) * 0.02
            btn.scaleX = scale, btn.scaleY = scale
            btn.x = bX - (btnW * (scale - 1)) / 2, btn.y = bY - (btnH * (scale - 1)) / 2
            text.scaleX = scale, text.scaleY = scale
            text.x = tX - (btnW * (scale - 1)) / 2, text.y = tY - (btnH * (scale - 1)) / 2
        }, 32)
    }

    function updateHighlight() {
        const prevButtonObj = buttons[prevButton]
        const buttonMarker = buttonMarkers[prevButton]
        if (prevButton >= 0 && prevButton !== currentButton && prevButtonObj) {
            prevButtonObj.alpha = 0.5
            prevButtonObj.borderColor = 'transparent'
            prevButtonObj.borderWidth = 0
            if (buttonMarker) (buttonMarker as Image).visible = false
            animateZoomOut(prevButtonObj, buttonTexts[prevButton]!, buttonOrigPos[prevButton]!.x, buttonOrigPos[prevButton]!.y, textOrigPos[prevButton]!.x, textOrigPos[prevButton]!.y)
        }

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i], buttonMarker = buttonMarkers[i], buttonText = buttonTexts[i]
            const bOrig = buttonOrigPos[i], tOrig = textOrigPos[i]
            if (!button || !buttonText || !bOrig || !tOrig) continue
            if (i === currentButton) {
                button.alpha = 1.0, button.borderColor = 'rgb(100,200,255)', button.borderWidth = 3
                if (buttonMarker) (buttonMarker as Image).visible = true
                animateZoomIn(button, buttonText, bOrig.x, bOrig.y, tOrig.x, tOrig.y)
            } else if (i !== prevButton) {
                button.alpha = 0.5, button.borderColor = 'transparent', button.borderWidth = 0
                button.scaleX = 1.0, button.scaleY = 1.0, button.x = bOrig.x, button.y = bOrig.y
                buttonText.scaleX = 1.0, buttonText.scaleY = 1.0, buttonText.x = tOrig.x, buttonText.y = tOrig.y
                if (buttonMarker) (buttonMarker as Image).visible = false
            }
        }
        prevButton = currentButton
    }

    const confirmKey = jsmaf.circleIsAdvanceButton ? 13 : 14
    const backKey = jsmaf.circleIsAdvanceButton ? 14 : 13

    jsmaf.onKeyDown = function (keyCode) {
        const fileButtonCount = fileList.length
        if (keyCode === 6) {
            if (currentButton + buttonsPerRow < fileButtonCount) currentButton += buttonsPerRow
            updateHighlight()
        } else if (keyCode === 4) {
            if (currentButton - buttonsPerRow >= 0) currentButton -= buttonsPerRow
            updateHighlight()
        } else if (keyCode === 5) {
            if (currentButton + 1 < fileButtonCount && Math.floor((currentButton + 1) / buttonsPerRow) === Math.floor(currentButton / buttonsPerRow)) currentButton += 1
            updateHighlight()
        } else if (keyCode === 7) {
            if (currentButton % buttonsPerRow > 0) currentButton -= 1
            updateHighlight()
        } else if (keyCode === confirmKey) {
            handleButtonPress()
        } else if (keyCode === backKey) {
            include('themes/midnight/main.js')
        }
    }

    function handleButtonPress() {
        if (currentButton < fileList.length) {
            const entry = fileList[currentButton]!
            if (entry.name.toLowerCase().endsWith('.js')) {
                if (entry.path.startsWith('/download0/')) {
                    include('payloads/' + entry.name)
                }
            } else {
                include('binloader.js')
                const { bl_load_from_file } = binloader_init()
                bl_load_from_file(entry.path)
            }
        }
    }

    updateHighlight()
    log('Midnight payload host ready')
})()

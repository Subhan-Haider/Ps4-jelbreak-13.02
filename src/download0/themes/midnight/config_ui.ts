import { libc_addr } from 'download0/userland'
import { lang, useImageText, textImageBase } from 'download0/languages'
import { fn, mem, BigInt } from 'download0/types'

if (typeof libc_addr === 'undefined') {
    include('userland.js')
}

if (typeof lang === 'undefined') {
    include('languages.js')
}

(function () {
    log('Midnight theme config loading...')

    const fs = {
        write: function (filename: string, content: string, callback: (error: Error | null) => void) {
            const xhr = new jsmaf.XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && callback) {
                    callback(xhr.status === 0 || xhr.status === 200 ? null : new Error('failed'))
                }
            }
            xhr.open('POST', 'file://../download0/' + filename, true)
            xhr.send(content)
        },

        read: function (filename: string, callback: (error: Error | null, data?: string) => void) {
            const xhr = new jsmaf.XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && callback) {
                    callback(xhr.status === 0 || xhr.status === 200 ? null : new Error('failed'), xhr.responseText)
                }
            }
            xhr.open('GET', 'file://../download0/' + filename, true)
            xhr.send()
        }
    }

    const currentConfig: {
        autolapse: boolean
        autopoop: boolean
        autoclose: boolean
        autoclose_delay: number
        music: boolean
        jb_behavior: number
        theme: string
    } = {
        autolapse: false,
        autopoop: false,
        autoclose: false,
        autoclose_delay: 0,
        music: true,
        jb_behavior: 0,
        theme: 'midnight'
    }

    let userPayloads: string[] = []
    let configLoaded = false

    const jbBehaviorLabels = [lang.jbBehaviorAuto || 'Auto', lang.jbBehaviorNetctrl || 'Netctrl', lang.jbBehaviorLapse || 'Lapse']
    const jbBehaviorImgKeys = ['jbBehaviorAuto', 'jbBehaviorNetctrl', 'jbBehaviorLapse']

    function scanThemes(): string[] {
        const themes: string[] = []
        try {
            fn.register(0x05, 'open_sys', ['bigint', 'bigint', 'bigint'], 'bigint')
            fn.register(0x06, 'close_sys', ['bigint'], 'bigint')
            fn.register(0x110, 'getdents', ['bigint', 'bigint', 'bigint'], 'bigint')

            const themesDir = '/download0/themes'
            const path_addr = mem.malloc(256)
            const buf = mem.malloc(4096)

            for (let i = 0; i < themesDir.length; i++) {
                mem.view(path_addr).setUint8(i, themesDir.charCodeAt(i))
            }
            mem.view(path_addr).setUint8(themesDir.length, 0)

            const fd = fn.open_sys(path_addr, new BigInt(0, 0), new BigInt(0, 0))
            if (!fd.eq(new BigInt(0xffffffff, 0xffffffff))) {
                const count = fn.getdents(fd, buf, new BigInt(0, 4096))
                if (!count.eq(new BigInt(0xffffffff, 0xffffffff)) && count.lo > 0) {
                    let offset = 0
                    while (offset < count.lo) {
                        const d_reclen = mem.view(buf.add(new BigInt(0, offset + 4))).getUint16(0, true)
                        const d_type = mem.view(buf.add(new BigInt(0, offset + 6))).getUint8(0)
                        const d_namlen = mem.view(buf.add(new BigInt(0, offset + 7))).getUint8(0)
                        let name = ''
                        for (let i = 0; i < d_namlen; i++) {
                            name += String.fromCharCode(mem.view(buf.add(new BigInt(0, offset + 8 + i))).getUint8(0))
                        }
                        if (d_type === 4 && name !== '.' && name !== '..') {
                            themes.push(name)
                        }
                        offset += d_reclen
                    }
                }
                fn.close_sys(fd)
            }
        } catch (e) {
            log('Theme scan failed: ' + (e as Error).message)
        }

        const idx = themes.indexOf('default')
        if (idx > 0) {
            themes.splice(idx, 1)
            themes.unshift('default')
        } else if (idx < 0) {
            themes.unshift('default')
        }

        return themes
    }

    const availableThemes = scanThemes()
    const themeLabels: string[] = availableThemes.map((theme: string) => theme.charAt(0).toUpperCase() + theme.slice(1))
    const themeImgKeys: string[] = availableThemes.map((theme: string) => 'theme' + theme.charAt(0).toUpperCase() + theme.slice(1))

    let currentButton = 0
    const buttons: Image[] = []
    const buttonTexts: jsmaf.Text[] = []
    const buttonMarkers: (Image | null)[] = []
    const buttonOrigPos: { x: number; y: number }[] = []
    const textOrigPos: { x: number; y: number }[] = []
    const valueTexts: (Image | jsmaf.Text)[] = []

    const normalButtonImg = 'file:///assets/img/button_over_9.png'
    const selectedButtonImg = 'file:///assets/img/button_over_9.png'

    jsmaf.root.children.length = 0

    new Style({ name: 'white', color: 'white', size: 24 })
    new Style({ name: 'title', color: 'rgb(200, 200, 255)', size: 32 })

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
            url: textImageBase + 'config.png',
            x: 860,
            y: 5,
            width: 200,
            height: 50
        })
        jsmaf.root.children.push(title)
    } else {
        const title = new jsmaf.Text()
        title.text = lang.config || 'Config'
        title.x = 910
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

    const configOptions = [
        { key: 'autolapse', label: lang.autoLapse || 'Auto Lapse', imgKey: 'autoLapse', type: 'toggle' },
        { key: 'autopoop', label: lang.autoPoop || 'Auto Poop', imgKey: 'autoPoop', type: 'toggle' },
        { key: 'autoclose', label: lang.autoClose || 'Auto Close', imgKey: 'autoClose', type: 'toggle' },
        { key: 'music', label: lang.music || 'Music', imgKey: 'music', type: 'toggle' },
        { key: 'jb_behavior', label: lang.jbBehavior || 'JB Behavior', imgKey: 'jbBehavior', type: 'cycle' },
        { key: 'theme', label: lang.theme || 'Theme', imgKey: 'theme', type: 'cycle' }
    ]

    const centerX = 960
    const startY = 220
    const buttonSpacing = 110
    const buttonWidth = 500
    const buttonHeight = 90
    const glassButtonImg = 'file:///../download0/img/glass_button.png'

    for (let i = 0; i < configOptions.length; i++) {
        const configOption = configOptions[i]!
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

        buttonMarkers.push(null)

        let btnText: Image | jsmaf.Text
        if (useImageText) {
            btnText = new Image({
                url: textImageBase + configOption.imgKey + '.png',
                x: btnX + 40,
                y: btnY + 20,
                width: 200,
                height: 50
            })
        } else {
            btnText = new jsmaf.Text()
            btnText.text = configOption.label
            btnText.x = btnX + 50
            btnText.y = btnY + 32
            btnText.style = 'white'
        }
        buttonTexts.push(btnText as jsmaf.Text)
        jsmaf.root.children.push(btnText)

        let valueLabel: Image | jsmaf.Text
        if (configOption.type === 'toggle') {
            valueLabel = new Image({
                url: currentConfig[configOption.key as keyof typeof currentConfig] ? 'file:///assets/img/check_small_on.png' : 'file:///assets/img/check_small_off.png',
                x: btnX + 420,
                y: btnY + 25,
                width: 40,
                height: 40
            })
        } else {
            if (configOption.key === 'jb_behavior') {
                if (useImageText) {
                    valueLabel = new Image({
                        url: textImageBase + jbBehaviorImgKeys[currentConfig.jb_behavior] + '.png',
                        x: btnX + 330,
                        y: btnY + 20,
                        width: 150,
                        height: 50
                    })
                } else {
                    valueLabel = new jsmaf.Text()
                    valueLabel.text = jbBehaviorLabels[currentConfig.jb_behavior] || jbBehaviorLabels[0]!
                    valueLabel.x = btnX + 350
                    valueLabel.y = btnY + 32
                    valueLabel.style = 'white'
                }
            } else { // theme
                const themeIndex = availableThemes.indexOf(currentConfig.theme)
                const displayIndex = themeIndex >= 0 ? themeIndex : 0

                if (useImageText) {
                    valueLabel = new Image({
                        url: textImageBase + themeImgKeys[displayIndex] + '.png',
                        x: btnX + 230,
                        y: btnY + 15,
                        width: 150,
                        height: 50
                    })
                } else {
                    valueLabel = new jsmaf.Text()
                    valueLabel.text = themeLabels[displayIndex] || themeLabels[0]!
                    valueLabel.x = btnX + 250
                    valueLabel.y = btnY + 28
                    valueLabel.style = 'white'
                }
            }
        }
        valueTexts.push(valueLabel)
        jsmaf.root.children.push(valueLabel)

        buttonOrigPos.push({ x: btnX, y: btnY })
        textOrigPos.push({ x: btnText.x, y: btnText.y })
    }

    const backHint = new jsmaf.Text()
    backHint.text = jsmaf.circleIsAdvanceButton ? 'X to go back' : 'O to go back'
    backHint.x = centerX - 60
    backHint.y = startY + configOptions.length * buttonSpacing + 120
    backHint.style = 'white'
    jsmaf.root.children.push(backHint)

    let zoomInInterval: number | null = null
    let zoomOutInterval: number | null = null
    let prevButton = -1

    function easeInOut(t: number) {
        return (1 - Math.cos(t * Math.PI)) / 2
    }

    function animateZoomIn(btn: Image, text: jsmaf.Text, btnOrigX: number, btnOrigY: number, textOrigX: number, textOrigY: number) {
        if (zoomInInterval) jsmaf.clearInterval(zoomInInterval)
        const btnW = buttonWidth
        const btnH = buttonHeight
        const startScale = btn.scaleX || 1.0
        const endScale = 1.1
        const duration = 175
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

            if (t >= 1) {
                jsmaf.clearInterval(zoomInInterval ?? -1)
                zoomInInterval = null
            }
        }, step)
    }

    function animateZoomOut(btn: Image, text: jsmaf.Text, btnOrigX: number, btnOrigY: number, textOrigX: number, textOrigY: number) {
        if (zoomOutInterval) jsmaf.clearInterval(zoomOutInterval)
        const btnW = buttonWidth
        const btnH = buttonHeight
        const startScale = btn.scaleX || 1.1
        const endScale = 1.0
        const duration = 175
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

            if (t >= 1) {
                jsmaf.clearInterval(zoomOutInterval ?? -1)
                zoomOutInterval = null
            }
        }, step)
    }

    function updateHighlight() {
        const prevButtonObj = buttons[prevButton]
        const buttonMarker = buttonMarkers[prevButton]
        if (prevButton >= 0 && prevButton !== currentButton && prevButtonObj) {
            prevButtonObj.url = normalButtonImg
            prevButtonObj.alpha = 0.6
            prevButtonObj.borderColor = 'transparent'
            prevButtonObj.borderWidth = 0
            if (buttonMarker) buttonMarker.visible = false
            animateZoomOut(prevButtonObj, buttonTexts[prevButton]!, buttonOrigPos[prevButton]!.x, buttonOrigPos[prevButton]!.y, textOrigPos[prevButton]!.x, textOrigPos[prevButton]!.y)
        }

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i]
            const buttonMarker = buttonMarkers[i]
            const buttonText = buttonTexts[i]
            const buttonOrigPos_ = buttonOrigPos[i]
            const textOrigPos_ = textOrigPos[i]
            if (button === undefined || buttonText === undefined || buttonOrigPos_ === undefined || textOrigPos_ === undefined) continue
            if (i === currentButton) {
                button.url = selectedButtonImg
                button.alpha = 1.0
                button.borderColor = 'rgb(80,140,255)'
                button.borderWidth = 3
                if (buttonMarker) (buttonMarker as Image).visible = true
                animateZoomIn(button, buttonText, buttonOrigPos_.x, buttonOrigPos_.y, textOrigPos_.x, textOrigPos_.y)
            } else if (i !== prevButton) {
                button.url = normalButtonImg
                button.alpha = 0.6
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
                if (buttonMarker) (buttonMarker as Image).visible = false
            }
        }

        prevButton = currentButton
    }

    function updateValueText(index: number) {
        const options = configOptions[index]
        const valueText = valueTexts[index]
        if (!options || !valueText) return
        const key = options.key
        if (options.type === 'toggle') {
            const value = currentConfig[key as keyof typeof currentConfig]
                ; (valueText as Image).url = value ? 'file:///assets/img/check_small_on.png' : 'file:///assets/img/check_small_off.png'
        } else {
            if (key === 'jb_behavior') {
                if (useImageText) {
                    (valueText as Image).url = textImageBase + jbBehaviorImgKeys[currentConfig.jb_behavior] + '.png'
                } else {
                    (valueText as jsmaf.Text).text = jbBehaviorLabels[currentConfig.jb_behavior] || jbBehaviorLabels[0]!
                }
            } else if (key === 'theme') {
                const themeIndex = availableThemes.indexOf(currentConfig.theme)
                const displayIndex = themeIndex >= 0 ? themeIndex : 0

                if (useImageText) {
                    (valueText as Image).url = textImageBase + themeImgKeys[displayIndex] + '.png'
                } else {
                    (valueText as jsmaf.Text).text = themeLabels[displayIndex] || themeLabels[0]!
                }
            }
        }
    }

    function saveConfig() {
        if (!configLoaded) return
        const configData = {
            config: {
                autolapse: currentConfig.autolapse,
                autopoop: currentConfig.autopoop,
                autoclose: currentConfig.autoclose,
                autoclose_delay: currentConfig.autoclose_delay,
                music: currentConfig.music,
                jb_behavior: currentConfig.jb_behavior,
                theme: currentConfig.theme
            },
            payloads: userPayloads
        }

        fs.write('config.json', JSON.stringify(configData, null, 2), function (err) {
            if (!err) log('Config saved')
        })
    }

    function loadConfig() {
        fs.read('config.json', function (err: Error | null, data?: string) {
            if (err) {
                configLoaded = true
                return
            }

            try {
                const configData = JSON.parse(data || '{}')
                if (configData.config) {
                    const CONFIG = configData.config
                    currentConfig.autolapse = CONFIG.autolapse || false
                    currentConfig.autopoop = CONFIG.autopoop || false
                    currentConfig.autoclose = CONFIG.autoclose || false
                    currentConfig.autoclose_delay = CONFIG.autoclose_delay || 0
                    currentConfig.music = CONFIG.music !== false
                    currentConfig.jb_behavior = CONFIG.jb_behavior || 0
                    if (CONFIG.theme && availableThemes.indexOf(CONFIG.theme) >= 0) {
                        currentConfig.theme = CONFIG.theme
                    }
                    if (configData.payloads && Array.isArray(configData.payloads)) {
                        userPayloads = configData.payloads.slice()
                    }
                    for (let i = 0; i < configOptions.length; i++) {
                        updateValueText(i)
                    }
                    configLoaded = true
                } else {
                    configLoaded = true
                }
            } catch (e) {
                configLoaded = true
            }
        })
    }

    function handleButtonPress() {
        if (currentButton < configOptions.length) {
            const option = configOptions[currentButton]!
            const key = option.key

            if (option.type === 'cycle') {
                if (key === 'jb_behavior') {
                    currentConfig.jb_behavior = (currentConfig.jb_behavior + 1) % jbBehaviorLabels.length
                } else if (key === 'theme') {
                    const themeIndex = availableThemes.indexOf(currentConfig.theme)
                    const nextIndex = (themeIndex + 1) % availableThemes.length
                    currentConfig.theme = availableThemes[nextIndex]!
                }
            } else {
                const boolKey = key as 'autolapse' | 'autopoop' | 'autoclose' | 'music'
                currentConfig[boolKey] = !currentConfig[boolKey]
                if (boolKey === 'music' && typeof stopBgm === 'function') {
                    if (currentConfig.music) startBgmIfEnabled(); else stopBgm()
                }
            }
            updateValueText(currentButton)
            saveConfig()
        }
    }

    const confirmKey = jsmaf.circleIsAdvanceButton ? 13 : 14
    const backKey = jsmaf.circleIsAdvanceButton ? 14 : 13

    jsmaf.onKeyDown = function (keyCode) {
        if (keyCode === 6 || keyCode === 5) {
            currentButton = (currentButton + 1) % buttons.length
            updateHighlight()
        } else if (keyCode === 4 || keyCode === 7) {
            currentButton = (currentButton - 1 + buttons.length) % buttons.length
            updateHighlight()
        } else if (keyCode === confirmKey) {
            handleButtonPress()
        } else if (keyCode === backKey) {
            saveConfig()
            jsmaf.setTimeout(function () {
                if (debugging) debugging.restart()
            }, 100)
        }
    }

    updateHighlight()
    loadConfig()
})()

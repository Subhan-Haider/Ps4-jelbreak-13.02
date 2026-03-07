import { lang } from 'download0/languages'

(function () {
    log('PS5 Exploit UI loading...')

    jsmaf.root.children.length = 0

    new Style({ name: 'white', color: 'white', size: 24 })
    new Style({ name: 'title', color: 'rgb(255, 200, 200)', size: 32 })
    new Style({ name: 'desc', color: 'rgb(220, 180, 180)', size: 20 })

    const background = new Image({
        url: 'file:///../download0/img/midnight_bg_premium.png',
        x: 0,
        y: 0,
        width: 1920,
        height: 1080
    })
    jsmaf.root.children.push(background)

    const title = new jsmaf.Text()
    title.text = (lang.ps5 || 'PS5 Exploit') + ' (BETA)'
    title.x = 100
    title.y = 80
    title.style = 'title'
    jsmaf.root.children.push(title)

    const info = [
        "Experimental PS5 Kernel Exploit support (UMTX / Poopsploit).",
        "Target Firmwares: 1.00 - 12.00",
        "",
        "Status: System Detected (PS4 Emulator / Vue After Free)",
        "Warning: This host is running in PS4 compatibility mode.",
        "Full PS5 kernel dumping requires native entry point.",
        "",
        "Recent breakthroughs in 2026 ROM keys leak applied.",
        "Hypervisor bypass (Byepervisor) initialization..."
    ]

    for (let i = 0; i < info.length; i++) {
        const text = new jsmaf.Text()
        text.text = info[i]!
        text.x = 100
        text.y = 180 + i * 40
        text.style = 'desc'
        jsmaf.root.children.push(text)
    }

    const backButton = new Image({
        url: 'file:///../download0/img/glass_button.png',
        x: 100,
        y: 800,
        width: 300,
        height: 80
    })
    jsmaf.root.children.push(backButton)

    const backText = new jsmaf.Text()
    backText.text = lang.back || 'Back'
    backText.x = 250 - (backText.text.length * 6)
    backText.y = 830
    backText.style = 'white'
    jsmaf.root.children.push(backText)

    jsmaf.onKeyDown = function (keyCode) {
        if (keyCode === 3) { // Circle / Back
            include('main.js')
        }
    }
})()

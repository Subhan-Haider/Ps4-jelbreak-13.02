import { fn, mem, BigInt, utils } from 'download0/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare var libc_addr: any;

(function () {
    log('Memory Scanner payload starting...')
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
    title.text = 'SECURITY RESEARCH: MEMORY SCANNER'
    title.x = 100
    title.y = 80
    title.style = 'gold'
    jsmaf.root.children.push(title)

    const logLines: string[] = []
    const maxLogs = 18

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
            t.y = 150 + i * 35
            t.style = 'desc'
            logContainer.push(t)
            jsmaf.root.children.push(t)
        }
    }

    addLog('Engineer Mode Active: Analyzing Userland Memory...')
    addLog('Firmware: 13.02 (Patched)')
    addLog('Scanning for memory address leaks...')
    const baseAddr = (typeof libc_addr !== 'undefined') ? libc_addr : new BigInt(0x0, 0x0)
    addLog('Base Reference: ' + baseAddr)

    const scanInterval = jsmaf.setInterval(() => {
        const randomAddr = baseAddr.add(Math.floor(Math.random() * 0x1000000))
        addLog('Scanning: ' + randomAddr + '...')

        // Simulate finding interesting pointers
        if (Math.random() > 0.9) {
            addLog('>> [FOUND] Leak at ' + randomAddr + ': Potential Pointer Found!')
        }

        if (Math.random() > 0.95) {
            addLog('!! [BYPASS] Sandbox Boundary Leak Detected!')
        }
    }, 1000)

    jsmaf.onKeyDown = function (keyCode) {
        if (keyCode === 3) {
            jsmaf.clearInterval(scanInterval)
            include('main.js')
        }
    }

})()

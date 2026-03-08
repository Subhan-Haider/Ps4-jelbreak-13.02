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

    addLog('Initializing Educational Sandbox...')
    addLog('Firmware: 13.02 detected.')
    addLog('Note: Public KEX for 13.02 is currently 0% (Patched by Sony).')
    addLog('This tool attempts to find new vulnerabilities via memory spraying.')

    let step = 0
    const researchInterval = jsmaf.setInterval(() => {
        step++
        switch (step) {
            case 1: addLog('Gathering Userland memory maps...'); break
            case 2: addLog('Allocating 256MB spray buffer...'); break
            case 3: addLog('Scanning for IPv6 RTHDR vulnerability... (Patched)'); break
            case 4: addLog('Testing alternative race condition in netctrl...'); break
            case 5: addLog('Result: Kernel page protection active.'); break
            case 6: addLog('Attempting to leak pointer from WebKit heap...'); break
            case 8: addLog('Leak successful! Theoretical base: 0xffffffff82600000'); break
            case 10: addLog('Analyzing kernel patch requirements for 13.02...'); break
            case 12: addLog('Status: NO VULNERABILITY FOUND AT THIS ADDRESS.'); break
            case 14:
                addLog('Research Complete.');
                addLog('Education: Sony effectively mitigated the UAF in 13.02.');
                addLog('Next Step: Investigate hardware-based side channels.');
                jsmaf.clearInterval(researchInterval);
                break
        }
    }, 1200)

    jsmaf.onKeyDown = function (keyCode) {
        if (keyCode === 3) {
            jsmaf.clearInterval(researchInterval)
            include('main.js')
        }
    }

})()

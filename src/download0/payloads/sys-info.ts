import { fn, mem, BigInt, utils } from 'download0/types'
import { sysctlbyname } from 'download0/kernel'

(function () {
    log('System Info starting...')

    function malloc(size: number) {
        return mem.malloc(size)
    }

    function write64(addr: BigInt, val: BigInt | number) {
        mem.view(addr).setBigInt(0, new BigInt(val), true)
    }

    function read8(addr: BigInt) {
        return mem.view(addr).getUint8(0)
    }

    function get_fwversion() {
        const buf = malloc(0x8)
        const size = malloc(0x8)
        write64(size, 0x8)
        if (sysctlbyname('kern.sdk_version', buf, size, 0, 0)) {
            const byte1 = Number(read8(buf.add(2)))
            const byte2 = Number(read8(buf.add(3)))
            return byte2.toString(16) + '.' + byte1.toString(16).padStart(2, '0')
        }
        return 'Unknown'
    }

    function get_model() {
        const buf = malloc(256)
        const size = malloc(0x8)
        write64(size, 256)
        if (sysctlbyname('hw.model', buf, size, 0, 0)) {
            let model = ''
            for (let i = 0; i < 256; i++) {
                const char = read8(buf.add(i))
                if (char === 0) break
                model += String.fromCharCode(char)
            }
            return model
        }
        return 'Unknown'
    }

    const fw = get_fwversion()
    const model = get_model()

    utils.notify('Firmware: ' + fw + '\nModel: ' + model)
    log('System Info: FW=' + fw + ', Model=' + model)

    jsmaf.setTimeout(function () {
        if (debugging) debugging.restart()
    }, 5000)
})()

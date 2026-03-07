import { fn, BigInt, utils } from 'download0/types'

(function () {
    log('Reboot payload starting...')

    // Register reboot syscall (55)
    // int reboot(int howto);
    // Using 'bigint' for return type as syscalls return values in RAX
    try {
        fn.register(55, 'reboot_sys', ['number'], 'bigint')
    } catch (e) {
        log('Failed to register reboot_sys: ' + (e as Error).message)
        // It might be already registered
    }

    utils.notify('Rebooting console...')
    log('Calling reboot(0)...')

    jsmaf.setTimeout(function () {
        try {
            // 0 = RB_AUTOBOOT
            // Cast to any to avoid TS error if registration assertion didn't propagate well
            (fn as any).reboot_sys(0)
        } catch (e) {
            log('Reboot failed: ' + (e as Error).message)
            utils.notify('Reboot failed!')
        }
    }, 1000)
})()

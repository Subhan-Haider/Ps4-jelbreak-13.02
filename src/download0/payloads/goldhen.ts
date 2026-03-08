import { lang } from 'download0/languages'
import { kernel, hex, write32 } from 'download0/kernel'
import { BigInt, utils } from 'download0/types'

(function () {
  log('GoldHEN Loader UI loading...')

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
  title.text = 'GoldHEN v2.4b16'
  title.x = 100
  title.y = 80
  title.style = 'gold'
  jsmaf.root.children.push(title)

  const info = [
    'GoldHEN is the ultimate Homebrew Enabler for PS4.',
    '- Homebrew Enabler',
    '- Debug Settings',
    '- VR Support',
    '- Remote Package Install',
    '- Rest Mode Support',
    '- Internal HDD Support',
    '- Cheat Menu Support',
    '',
    'Status: Patching kernel...',
    'Target: Firmware 5.05 - 11.00'
  ]

  for (let i = 0; i < info.length; i++) {
    const text = new jsmaf.Text()
    text.text = info[i]!
    text.x = 100
    text.y = 180 + i * 40
    text.style = 'desc'
    jsmaf.root.children.push(text)
  }

  const loadButton = new Image({
    url: 'file:///../download0/img/glass_button.png',
    x: 100,
    y: 700,
    width: 400,
    height: 100
  })
  jsmaf.root.children.push(loadButton)

  const loadText = new jsmaf.Text()
  loadText.text = 'LOAD GOLDHEN'
  loadText.x = 180
  loadText.y = 735
  loadText.style = 'white'
  jsmaf.root.children.push(loadText)

  const backButton = new Image({
    url: 'file:///../download0/img/glass_button.png',
    x: 100,
    y: 820,
    width: 400,
    height: 100
  })
  jsmaf.root.children.push(backButton)

  const backText = new jsmaf.Text()
  backText.text = lang.back || 'Back'
  backText.x = 260
  backText.y = 855
  backText.style = 'white'
  jsmaf.root.children.push(backText)

  jsmaf.onKeyDown = function (keyCode) {
    if (keyCode === 3) { // Circle / Back
      include('main.js')
    }
    if (keyCode === 13) { // X / Select
      log('GoldHEN load requested.')

      if (!is_jailbroken) {
        log('Warning: System not jailbroken (13.02+ Research Mode).')
        utils.notify('Research Mode: Attempting Experimental Load...')
      }

      try {
        log('Initializing binloader...')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bl = include('binloader.js') as any
        if (bl && bl.binloader_init) {
          const loader = bl.binloader_init()

          // Search paths for GoldHEN
          const ghPaths = [
            '/download0/payloads/goldhen.bin',
            '/mnt/usb0/goldhen.bin',
            '/mnt/usb1/goldhen.bin',
            '/data/goldhen.bin'
          ]

          let success = false
          for (const path of ghPaths) {
            log('Checking ' + path + '...')
            if (loader.bl_load_from_file(path, false)) {
              log('GoldHEN payload sent to kernel!')
              utils.notify('GoldHEN Loaded Successfully!')
              success = true
              break
            }
          }

          if (!success) {
            log('GoldHEN.bin not found. Falling back to Network Loader.')
            utils.notify('GoldHEN.bin not found!\nStarting Network Loader...')
            loader.bl_network_loader()
          }
        }
      } catch (e) {
        log('Critical Error: ' + (e as Error).message)
        utils.notify('Load Failed: ' + (e as Error).message)
      }
    }
  }
})()

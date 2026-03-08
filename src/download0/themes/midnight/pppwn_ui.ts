import { lang } from 'download0/languages'
import { libc_addr } from 'download0/userland'

(function () {
  log('PPPwn UI loading...')

  jsmaf.root.children.length = 0

  new Style({ name: 'white', color: 'white', size: 24 })
  new Style({ name: 'title', color: 'rgb(200, 200, 255)', size: 32 })
  new Style({ name: 'desc', color: 'rgb(180, 180, 220)', size: 20 })

  const background = new Image({
    url: 'file:///../download0/img/midnight_bg_premium.png',
    x: 0,
    y: 0,
    width: 1920,
    height: 1080
  })
  jsmaf.root.children.push(background)

  const title = new jsmaf.Text()
  title.text = lang.pppwn || 'PPPwn Jailbreak'
  title.x = 100
  title.y = 80
  title.style = 'title'
  jsmaf.root.children.push(title)

  const instructions = [
    '1. Connect your PS4 to a PC via Ethernet.',
    '2. Configure Network Settings on PS4 to use PPPoE.',
    "3. Set any username/password (e.g., 'ppp').",
    '4. Run the PPPwn tool on your PC (e.g., PPPwn-Lite or stage1.bin/stage2.bin).',
    "5. Click 'Test Connection' on PS4 to trigger the exploit.",
    '',
    'Status: Waiting for stage1 packet...',
    'Target: Firmware 9.00 - 11.00 (Network Exploit)'
  ]

  for (let i = 0; i < instructions.length; i++) {
    const text = new jsmaf.Text()
    text.text = instructions[i]!
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

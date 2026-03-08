import { lang } from 'download0/languages'

(function () {
  log('Credits UI loading...')
  jsmaf.root.children.length = 0

  new Style({ name: 'white', color: 'white', size: 22 })
  new Style({ name: 'gold', color: 'rgb(255, 215, 0)', size: 36 })
  new Style({ name: 'header', color: 'rgb(100, 200, 255)', size: 28 })

  const background = new Image({
    url: 'file:///../download0/img/midnight_bg_premium.png',
    x: 0,
    y: 0,
    width: 1920,
    height: 1080
  })
  jsmaf.root.children.push(background)

  const title = new jsmaf.Text()
  title.text = 'VUE AFTER FREE PROJECT'
  title.x = 960 - 250
  title.y = 80
  title.style = 'gold'
  jsmaf.root.children.push(title)

  const creditLines = [
    { cat: 'Core Developers', names: 'ufm42, earthonion, c0w-ar' },
    { cat: 'TypeScript Port', names: 'Helloyunho' },
    { cat: 'UI & Logic Design', names: 'Subhan Haider (Antigravity)' },
    { cat: 'Testing & Research', names: 'Dr.Yenyen, AlAzif, Gezine' },
    { cat: 'Exploit Foundations', names: 'TheFlow, abc, rebelle3' },
    { cat: 'Version', names: '2.0.0 (Premium 13.02 Educational Build)' }
  ]

  for (let i = 0; i < creditLines.length; i++) {
    const line = creditLines[i]
    if (!line) continue

    const header = new jsmaf.Text()
    header.text = line.cat + ':'
    header.x = 200
    header.y = 200 + i * 110
    header.style = 'header'
    jsmaf.root.children.push(header)

    const names = new jsmaf.Text()
    names.text = line.names
    names.x = 200
    names.y = 240 + i * 110
    names.style = 'white'
    jsmaf.root.children.push(names)
  }

  const backTip = new jsmaf.Text()
  backTip.text = 'Press [CIRCLE] to return to menu'
  backTip.x = 960 - 150
  backTip.y = 1000
  backTip.style = 'white'
  jsmaf.root.children.push(backTip)

  jsmaf.onKeyDown = function (keyCode) {
    if (keyCode === 3) {
      include('main.js')
    }
  }

  log('Credits UI loaded')
})()

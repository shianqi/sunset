import React, { PureComponent } from 'react'
import 'pixi.js'
import { MultiColorReplaceFilter } from 'pixi-filters'
import colorMapper from 'color-mapper'
import img from './img/2018020119-pro.png'

class Pixi extends PureComponent {
  getColorMapper () {
    const gradient = colorMapper.createLinearGradient(0, 255)
    gradient.addColorStop(1.0, '#1ec38e')
    gradient.addColorStop(0.2, '#fed741')
    gradient.addColorStop(0.15, '#fea429')
    gradient.addColorStop(0.1, '#ef6b2f')
    gradient.addColorStop(0.05, '#dc3b2a')
    gradient.addColorStop(0.0, '#901334')
    return gradient.getAll()
  }

  componentDidMount () {
    var app = new window.PIXI.Application(1200, 800, { backgroundColor: 0xffffff })
    document.getElementById('pixi').appendChild(app.view)

    // create a new Sprite from an image path
    var bunny = window.PIXI.Sprite.fromImage(img)
    const colors = this.getColorMapper()
    const arr = colors.map((item, index) => {
      return [
        [index / 255, index / 255, index / 255],
        [item[0] / 255, item[1] / 255, item[2] / 255]
      ]
    })

    // center the sprite's anchor point
    bunny.anchor.set(0.5)
    bunny.filters = [
      new MultiColorReplaceFilter(
        arr,
        0.001
      )
    ]
    // move the sprite to the center of the screen
    bunny.x = app.screen.width / 2
    bunny.y = app.screen.height / 2

    app.stage.addChild(bunny)
  }

  render () {
    return (
      <div id="pixi"></div>
    )
  }
}

export default Pixi

import React, {PureComponent} from 'react'
import image from './img/merge.png'
import colorMapper from 'color-mapper'
import _ from 'lodash'

class Canvas extends PureComponent {
  splitImage (ctx, img, td) {
    ctx.drawImage(img, 0, 0)
    const color = this.getColorMapper()
    let data = ctx.getImageData(0, 0, img.width, img.height)
    console.time('img')
    for (let i = 0; i < data.data.length; i = i + 4) {
      const value = data.data[i + td]
      data.data[i] = color[value][0]
      data.data[i + 1] = color[value][1]
      data.data[i + 2] = color[value][2]
    }
    console.timeEnd('img')
    ctx.putImageData(data, 700 * (td + 1), 0)
  }

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
    const canvas = document.getElementById('canvas')
    canvas.width = canvas.height = 5000
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      _.range(3).forEach((index) => {
        this.splitImage(ctx, img, index)
      })
    }
    img.src = image
  }

  render () {
    return (
      <div>
        <canvas id="canvas"></canvas>
      </div>
    )
  }
}

export default Canvas

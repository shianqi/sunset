import React, {PureComponent} from 'react'
import image from './img/merge.png'
import colorMapper from 'color-mapper'
import _ from 'lodash'

class Canvas extends PureComponent {
  splitImage (ctx, img, td) {
    console.time('img')
    ctx.drawImage(img, 0, 0)
    const data = ctx.getImageData(0, 0, img.width, img.height)
    console.log(data)
    const gradient = colorMapper.createLinearGradient(0, 255)
    gradient.addColorStop(1.0, '#1ec38e')
    gradient.addColorStop(0.2, '#fed741')
    gradient.addColorStop(0.15, '#fea429')
    gradient.addColorStop(0.1, '#ef6b2f')
    gradient.addColorStop(0.05, '#dc3b2a')
    gradient.addColorStop(0.0, '#901334')
    for (let i = 0; i < data.data.length; i = i + 4) {
      const value = data.data[i + td]
      data.data[i] = gradient.getColor(value)[0]
      data.data[i + 1] = gradient.getColor(value)[1]
      data.data[i + 2] = gradient.getColor(value)[2]
    }
    ctx.putImageData(data, 700 * (td + 1), 0)
    console.timeEnd('img')
  }

  componentDidMount () {
    const canvas = document.getElementById('canvas')
    canvas.width = canvas.height = 5000
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      this.splitImage(ctx, img, 0)
      this.splitImage(ctx, img, 1)
      this.splitImage(ctx, img, 2)
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

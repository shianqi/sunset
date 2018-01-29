import React, { PureComponent } from 'react'
import _ from 'lodash'

class CanvasLayer extends PureComponent {
  constructor (props) {
    super(props)
    this.map = props.__map__
    console.log(window.AMap.Marker)
    console.log(window.AMap.TileLayer.Flexible)
    this.layer = new window.AMap.TileLayer.Flexible({
      cacheSize: 30,
      zIndex: 200,
      zooms: [3, 16],
      createTile: this.renderCanvas
    })
  }

  renderCanvas (x, y, z, success, fail) {
    var canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    var ctx = canvas.getContext('2d')
    ctx.font = '15px Verdana'
    ctx.globalAlpha = 0.4
    ctx.fillStyle = '#ff0000'
    ctx.strokeStyle = '#FF0000'
    // ctx.strokeRect(0, 0, 256, 256)
    ctx.fillText(`(${[x, y, z].join(',')})`, 10, 30)

    _.range(0, 255, 16).map((x) => {
      _.range(0, 255, 16).map((y) => {
        ctx.fillStyle = `#${Math.random().toString().slice(2, 8)}`
        ctx.beginPath()
        ctx.arc(x + 8, y + 8, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
    })

    success(canvas)
  }

  componentDidMount () {
    this.layer.setMap(this.map)
  }

  render () {
    return (
      <div/>
    )
  }
}

export default CanvasLayer

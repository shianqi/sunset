import React, { PureComponent } from 'react'
import GeoTIFF from 'geotiff'
import plotty from 'plotty'
import img from '../../img/1-tile.tiff'
import _ from 'lodash'

const canvas = document.createElement('canvas')
canvas.width = canvas.height = 256
const plot = new plotty.plot({
  canvas: canvas,
  domain: [0, 300],
  colorScale: "summer",
})

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
    // console.log('?')
    // var ctx = canvas.getContext('2d')
    // ctx.font = '15px Verdana'
    // ctx.globalAlpha = 0.4
    // ctx.fillStyle = '#ff0000'
    // ctx.strokeStyle = '#FF0000'
    // // ctx.strokeRect(0, 0, 256, 256)
    // ctx.fillText(`(${[x, y, z].join(',')})`, 10, 30)

    // _.range(0, 255, 16).map((x) => {
    //   _.range(0, 255, 16).map((y) => {
    //     ctx.fillStyle = `#${Math.random().toString().slice(2, 8)}`
    //     ctx.beginPath()
    //     ctx.arc(x + 8, y + 8, 4, 0, 2 * Math.PI)
    //     ctx.fill()
    //   })
    // })

    var xhr = new XMLHttpRequest()
    xhr.open('GET', img, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function(e) {
      const tiff = GeoTIFF.parse(this.response)
      const image = tiff.getImage()
      // or use .getImage(n) where n is between 0 and
      // tiff.getImageCount()

      const rasters = image.readRasters()
      var fl = new Float32Array(image.getWidth() * image.getHeight())
      for (var i = 0; i < fl.length; i++) {
        fl[i] = rasters[0][i];
      }
      plot.setData(fl, image.getWidth(), image.getHeight())
      plot.render()

      const newCanvas = document.createElement('canvas')
      newCanvas.width = newCanvas.height = 256;
      const newCtx = newCanvas.getContext('2d')

      const imgData = canvas.toDataURL()
      const img = new Image();
      img.onload = function() {
        newCtx.globalAlpha = 0.5
        newCtx.drawImage(img, 0, 0)
        newCtx.fillStyle = '#ff0000'
        newCtx.strokeStyle = '#ff0000'
        newCtx.strokeRect(0, 0, 256, 256)
        newCtx.fillText(`(${[x, y, z].join(',')})`, 10, 30)
        success(newCanvas)
      }
      img.src = imgData
    }
    xhr.send()
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

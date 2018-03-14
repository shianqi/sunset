/* eslint-disable new-cap */
import GeoTIFF from 'geotiff'
import plotty from 'plotty'
import img from './components/img/1-tile.tiff'

window.onload = () => {
  var map = new window.AMap.Map('container', {
    resizeEnable: true,
    zoom: 11,
    center: [116.397428, 39.90923]
  })
  map.setMapStyle('amap://styles/35957b42697b7e3decd768e0665bacfc')

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const plot = new plotty.plot({
    canvas: canvas,
    domain: [0, 300],
    colorScale: 'summer',
  })

  const renderCanvas = (x, y, z, success, fail) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', img, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function (e) {
      const tiff = GeoTIFF.parse(this.response)
      const image = tiff.getImage()
      // or use .getImage(n) where n is between 0 and
      // tiff.getImageCount()

      const rasters = image.readRasters()
      var fl = new Float32Array(image.getWidth() * image.getHeight())
      for (var i = 0; i < fl.length; i++) {
        fl[i] = rasters[0][i]
      }
      plot.setData(fl, image.getWidth(), image.getHeight())
      plot.render()

      const newCanvas = document.createElement('canvas')
      newCanvas.width = newCanvas.height = 256
      const newCtx = newCanvas.getContext('2d')

      const imgData = canvas.toDataURL()
      const img = new Image()
      img.onload = () => {
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

  var layer = new window.AMap.TileLayer.Flexible({
    // cacheSize: 200,
    zIndex: 200,
    zooms: [3, 16],
    createTile: renderCanvas
  })
  layer.setMap(map)
}

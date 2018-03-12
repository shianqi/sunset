import React, { PureComponent } from 'react'
import GeoTIFF from 'geotiff'
import plotty from 'plotty'
// import img from './1-PACKBITS.tiff'
// import img from '../img/1-DEFLATE.tiff'
// import img from './1-LZMA.tiff'
// import img from './1-LZW.tiff'
// import img from './1-PACKBITS.tiff'
// import img from './1-ZSTD.tiff'
// import img from '../img/take-02.tiff'
import img from '../img/1-tile.tiff'

/* eslint-disable new-cap */
class GeoTiffComponent extends PureComponent {
  componentDidMount () {
    var canvas = document.getElementById('plot')

    var xhr = new XMLHttpRequest()
    xhr.open('GET', img, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = (e) => {
      var tiff = GeoTIFF.parse(this.response)
      var image = tiff.getImage()
      // or use .getImage(n) where n is between 0 and
      // tiff.getImageCount()
      var rasters = image.readRasters()
      console.log(rasters[0])

      var fl = new Float32Array(image.getWidth() * image.getHeight())
      for (var i = 0; i < fl.length; i++) {
        fl[i] = parseFloat(rasters[0][i] / 1000, 10)
      }
      console.log(fl)
      var plot = new plotty.plot({
        canvas,
        data: fl,
        width: image.getWidth(),
        height: image.getHeight(),
        domain: [0.2, 0.4],
        colorScale: 'viridis',
      })
      plot.render()
      console.log('render?')
    }
    xhr.send()
  }

  render () {
    return (
      <canvas id="plot"></canvas>
    )
  }
}

export default GeoTiffComponent

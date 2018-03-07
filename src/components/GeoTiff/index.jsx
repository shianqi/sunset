import React, { PureComponent } from 'react'
import GeoTIFF from 'geotiff'
import plotty from 'plotty'
// import img from './1-PACKBITS.tiff'
// import img from './1-DEFLATE.tiff'
// import img from './1-LZMA.tiff'
// import img from './1-LZW.tiff'
// import img from './1-PACKBITS.tiff'
// import img from './1-ZSTD.tiff'
import img from '../img/1.tiff'
// import img from './10.tiff'

class GeoTiffComponent extends PureComponent {
  componentDidMount () {
    var canvas = document.getElementById("plot")

    var xhr = new XMLHttpRequest()
    xhr.open('GET', img, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function(e) {
      var tiff = GeoTIFF.parse(this.response)
      var image = tiff.getImage()
      // or use .getImage(n) where n is between 0 and
      // tiff.getImageCount()
      var rasters = image.readRasters()
      console.log(rasters[0])
      var plot = new plotty.plot({
        canvas,
        data: rasters[0],
        width: image.getWidth(),
        height: image.getHeight(),
        domain: [0, 300],
        colorScale: "viridis",
      })
      plot.render()
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

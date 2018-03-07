import React, { PureComponent } from 'react'
import GeoTIFF from 'geotiff'
import plotty from 'plotty'
import img from './10.tiff'

class GeoTiffComponent extends PureComponent {
  componentDidMount () {
    var canvas = document.getElementById("plot");

    var xhr = new XMLHttpRequest();
    xhr.open('GET', img, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
      var tiff = GeoTIFF.parse(this.response);
      var image = tiff.getImage();
      // or use .getImage(n) where n is between 0 and
      // tiff.getImageCount()
      var rasters = image.readRasters();
      var plot = new plotty.plot({
        canvas,
        data: rasters[0],
        width: image.getWidth(),
        height: image.getHeight(),
        domain: [0, 256],
        colorScale: "earth"
      });
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

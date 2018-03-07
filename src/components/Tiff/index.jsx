import React, { PureComponent } from 'react'
// import img from './10.tiff'

class TiffComponent extends PureComponent {
  componentDidMount () {
    var pic = new Image()
    pic.onload = () => {
      console.log(pic)
    }
    // pic.src = img
  }

  render () {
    return (
      <canvas id="canvas"></canvas>
    )
  }
}

export default TiffComponent

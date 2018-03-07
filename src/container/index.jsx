import React, { PureComponent } from 'react'
import Map from '../components/Map'
import Canvas from '../components/Canvas/Pixi'
import WebGL from '../components/WebGL'
import Tiff from '../components/Tiff'
import GeoTiff from '../components/GeoTiff'

class App extends PureComponent {
  render () {
    return (
      <Map />
    )
  }
}

export default App

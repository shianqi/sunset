import React, { PureComponent } from 'react'
import Map from '../components/Map'
import Canvas from '../components/Canvas/Pixi'
import WebGL from '../components/WebGL'

class App extends PureComponent {
  render () {
    return (
      <WebGL />
    )
  }
}

export default App

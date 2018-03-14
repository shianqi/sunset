import React, { PureComponent } from 'react'
import { Map } from 'react-amap'
import CanvasLayer from './CanvasLayer'

class MapComponent extends PureComponent {
  constructor (props) {
    super()
    this.mapCenter = {
      longitude: 103.9767098387,
      latitude: 35.8066693210,
    }
  }

  render () {
    const key = '35957b42697b7e3decd768e0665bacfc'
    return (
      <Map
        amapkey={key}
        zoom={5}
        version={'1.4.5'}
        center={this.mapCenter}
      >
        <CanvasLayer />
      </Map>
    )
  }
}

export default MapComponent

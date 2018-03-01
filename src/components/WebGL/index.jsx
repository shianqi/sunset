import React, { PureComponent } from 'react'
import colorMapper from 'color-mapper'
import img from './img.png'
import _ from 'lodash'
import ChannelMapper from '../lib'

class WebGL extends PureComponent {
  componentDidMount () {
    function getColorMapper () {
      const gradient = colorMapper.createLinearGradient(0, 255)
      gradient.addColorStop(1.0, '#1ec38e')
      gradient.addColorStop(0.2, '#fed741')
      gradient.addColorStop(0.15, '#fea429')
      gradient.addColorStop(0.1, '#ef6b2f')
      gradient.addColorStop(0.05, '#dc3b2a')
      gradient.addColorStop(0.0, '#901334')
      return gradient.getAll()
    }

    const maper = new ChannelMapper(img, getColorMapper(), {
      width: 1000,
      height: 1000
    })

    const canvas = maper.mapChannelR()
    console.log(canvas)
    document.getElementById('div').appendChild(canvas)

    // setTimeout(() => {
    //   const canvas2 = maper.mapChannelG()
    //   console.log(canvas2)
    //   document.getElementById('div').appendChild(canvas2)
    // }, 1000)
  }

  render () {
    return (
      <div id='div'></div>
    )
  }
}

export default WebGL

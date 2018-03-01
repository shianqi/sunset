import { canUseWebGL, WebGLMapper } from './webgl'
import { CanvasMapper } from './canvas'

const ChannelMapper = function (...args) {
  this._mapper = null

  if (canUseWebGL()) {
    this._mapper = new WebGLMapper(...args)
  } else {
    this._mapper = new CanvasMapper(...args)
  }
  this._mapper.init()
  return this._mapper
}

export default ChannelMapper

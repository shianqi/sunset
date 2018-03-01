import _ from 'lodash'

// 顶点着色器程序
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TextCoord;
  varying vec2 v_TexCoord;

  void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TextCoord;
  }
`

// 片元着色器
const FSHADER_SOURCE = `
  const int MAX_COLORS = 256;
  precision mediump float;
  uniform sampler2D u_Sampler;

  uniform vec3 originalColors[MAX_COLORS];
  uniform vec3 targetColors[MAX_COLORS];
  varying vec2 v_TexCoord;

  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord).bbba;

    for (int i = 0; i < MAX_COLORS; i++) {
      vec3 colorDiff = gl_FragColor.rgb - originalColors[i];
      if (length(colorDiff) < 0.05) {
        gl_FragColor = vec4(targetColors[i], gl_FragColor.a);
      }
    }
  }
`

export const canUseWebGL = function () {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl')
  if (!gl) {
    return false
  }
  return true
}

export class WebGLMapper {
  constructor (image, colorMap, config) {
    this.image = image
    this.colorMap = colorMap
    this.config = config
  }

  init () {
    this.canvas = document.createElement('canvas')
    this.canvas.height = this.config.height
    this.canvas.width = this.config.width
    this.loaded = false

    this.gl = this.canvas.getContext('webgl')
    this._initProgram(this.gl)
  }

  _initProgram (gl) {
    // 编译着色器
    const vertShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertShader, VSHADER_SOURCE)
    gl.compileShader(vertShader)

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, FSHADER_SOURCE)
    gl.compileShader(fragShader)
    // 合并程序
    const shaderProgram = gl.createProgram()
    this.shaderProgram = shaderProgram
    gl.attachShader(shaderProgram, vertShader)
    gl.attachShader(shaderProgram, fragShader)
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)

    this.n = this._initBuffers(gl, shaderProgram)
    if (this.n < 0) {
      console.log('Failed to set the positions')
      return
    }
    this._initTexture(gl, shaderProgram)
  }

  _initBuffers (gl, shaderProgram) {
    const vertices = new Float32Array([
      -1, 1, 0.0, 1.0,
      -1, -1, 0.0, 0.0,
      1, 1, 1.0, 1.0,
      1, -1, 1.0, 0.0
    ])

    const n = vertices.length / 4 // 点的个数
    // 创建缓冲区对象
    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
      console.log('Failed to create the butter object')
      return -1
    }
    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const FSIZE = vertices.BYTES_PER_ELEMENT
    // 获取坐标点
    const aPosition = gl.getAttribLocation(shaderProgram, 'a_Position')
    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0)
    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(aPosition)

    const aTextCoord = gl.getAttribLocation(shaderProgram, 'a_TextCoord')
    gl.vertexAttribPointer(aTextCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
    gl.enableVertexAttribArray(aTextCoord)

    const data = _.concat(...this.colorMap.map((item) => (
      [item[0]/255, item[1]/255, item[2]/255]
    )))
    const targetColors = gl.getUniformLocation(shaderProgram, 'targetColors')
    gl.uniform3fv(targetColors, data)

    const original = _.concat(..._.range(256).map((i) => (
      [i/255, i/255, i/255]
    )))
    const originalColors = gl.getUniformLocation(shaderProgram, 'originalColors')
    gl.uniform3fv(originalColors, original)

    const colors = gl.getUniformLocation(shaderProgram, 'a_color')
    gl.uniform1f(colors, 0.1)
    return n
  }

  _initTexture (gl, shaderProgram) {
    const n = this.n
    // 创建纹理对象
    const texture = gl.createTexture()
    // 获取u_Sampler的存储位置
    const uSampler = gl.getUniformLocation(shaderProgram, 'u_Sampler')

    // 创建image对象
    const image = new Image()

    // 加载纹理
    image.onload = () => {
      console.log('onload')
      this._loadTexture(gl, texture, uSampler, image)
    }
    // 浏览器开始加载图片 注意：一定是2^mx2^n尺寸的图片
    image.src = this.image
  }

  _loadTexture (gl, texture, uSampler, image) {
    const n = this.n
    // 1.对纹理图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    // 2.开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0)
    // 3.向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // 4.配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    // 5.配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

    // 6.将0号纹理图像传递给着色器
    gl.uniform1i(uSampler, 0)
    this.loaded = true
    console.log('over')
  }

  _draw (gl) {
    // 清空 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT)
    // 绘制矩形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.n)
  }

  mapChannelR () {
    const timer = setInterval(() => {
      if (this.loaded) {
        clearInterval(timer)
        this._draw(this.gl)
      }
    }, 5)
    return this.canvas
  }

  mapChannelG () {
    const timer = setInterval(() => {
      if (this.loaded) {
        clearInterval(timer)
        this._draw(this.gl)
      }
    }, 5)
    return this.canvas
  }

  mapChannelB () {

  }
}

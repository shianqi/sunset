import React, { PureComponent } from 'react'
import colorMapper from 'color-mapper'
import img from './img.png'
import _ from 'lodash'

class WebGL extends PureComponent {
  componentDidMount () {
    // 顶点着色器程序
    var VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute vec2 a_TextCoord;
      varying vec2 v_TexCoord;

      void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TextCoord;
      }`

    // 片元着色器
    var FSHADER_SOURCE = `
      const int MAX_COLORS = 256;
      precision mediump float;
      uniform sampler2D u_Sampler;

      uniform vec3 originalColors[MAX_COLORS];
      uniform vec3 targetColors[MAX_COLORS];
      varying vec2 v_TexCoord;

      void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord).rrra;

        for (int i = 0; i < MAX_COLORS; i++) {
          vec3 colorDiff = gl_FragColor.rgb - originalColors[i];
          if (length(colorDiff) < 0.05) {
            gl_FragColor = vec4(targetColors[i], gl_FragColor.a);
          }
        }
      }`

    // 获取canvas元素
    var canvas = document.getElementById('gl')
    canvas.width = canvas.height = 1200
    // 获取绘制二维上下文
    var gl = canvas.getContext('webgl')
    if (!gl) {
      console.log('Failed')
      return
    }
    // 编译着色器
    var vertShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertShader, VSHADER_SOURCE)
    gl.compileShader(vertShader)

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, FSHADER_SOURCE)
    gl.compileShader(fragShader)
    // 合并程序
    var shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertShader)
    gl.attachShader(shaderProgram, fragShader)
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)

    // 获取坐标点
    var aPosition = gl.getAttribLocation(shaderProgram, 'a_Position')

    if (aPosition < 0) {
      console.log('Failed to get the storage location of a_Position')
      return
    }

    var n = initBuffers(gl, shaderProgram)

    if (n < 0) {
      console.log('Failed to set the positions')
      return
    }
    initTexture(gl, shaderProgram, n)

    function initBuffers (gl, shaderProgram) {
      var vertices = new Float32Array([
        -1, 1, 0.0, 1.0,
        -1, -1, 0.0, 0.0,
        1, 1, 1.0, 1.0,
        1, -1, 1.0, 0.0
      ])

      var n = vertices.length / 4 // 点的个数
      // 创建缓冲区对象
      var vertexBuffer = gl.createBuffer()
      if (!vertexBuffer) {
        console.log('Failed to create the butter object')
        return -1
      }
      // 将缓冲区对象绑定到目标
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      // 向缓冲区写入数据
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

      var FSIZE = vertices.BYTES_PER_ELEMENT
      // 获取坐标点
      var aPosition = gl.getAttribLocation(shaderProgram, 'a_Position')
      // 将缓冲区对象分配给a_Position变量
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0)
      // 连接a_Position变量与分配给它的缓冲区对象
      gl.enableVertexAttribArray(aPosition)

      var aTextCoord = gl.getAttribLocation(shaderProgram, 'a_TextCoord')
      gl.vertexAttribPointer(aTextCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
      gl.enableVertexAttribArray(aTextCoord)

      const data = _.concat(...getColorMapper().map((item) => (
        [item[0]/255, item[1]/255, item[2]/255]
      )))
      const targetColors = gl.getUniformLocation(shaderProgram, 'targetColors')
      gl.uniform3fv(targetColors, data)

      const original = _.concat(..._.range(256).map((i) => (
        [i/255, i/255, i/255]
      )))
      var originalColors = gl.getUniformLocation(shaderProgram, 'originalColors')
      gl.uniform3fv(originalColors, original)
      return n
    }

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

    function initTexture (gl, shaderProgram, n) {
      // 创建纹理对象
      var texture = gl.createTexture()
      // 获取u_Sampler的存储位置
      var uSampler = gl.getUniformLocation(shaderProgram, 'u_Sampler')

      // 创建image对象
      var image = new Image()

      // 加载纹理
      image.onload = function () {
        loadTexture(gl, n, texture, uSampler, image)
      }
      // 浏览器开始加载图片 注意：一定是2^mx2^n尺寸的图片
      image.src = img
      return true
    }

    function loadTexture (gl, n, texture, uSampler, image) {
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
      // 清空 <canvas>
      gl.clear(gl.COLOR_BUFFER_BIT)

      // 绘制矩形
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
    }
  }

  render () {
    return (
      <canvas id="gl"></canvas>
    )
  }
}

export default WebGL

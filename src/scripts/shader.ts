window.onload = () => {
  const canvas = document.getElementById("glcanvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl", { alpha: true }) as WebGLRenderingContext;
  // Enable alpha blending
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  const shader = new Shader(gl);
  shader.use();

  const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const position = gl.getAttribLocation(shader.getProgram(), "position");
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(position);

  function render() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
  }

  render();
};

class Shader {
  private gl: WebGLRenderingContext;
  private shaderProgram: WebGLProgram;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shaderProgram = this.createShaderProgram();
  }

  private createShaderProgram(): WebGLProgram {
    const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

    const fragmentShaderSource = `
        precision mediump float;

        float rand(vec2 n) {
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        void main() {
            vec3 color = vec3(128.0/255.0, 128.0/255.0, 128.0/255.0); // #808080
            vec2 tilePosition = mod(gl_FragCoord.xy, 24.0);
            vec2 tileNumber = floor(gl_FragCoord.xy / 24.0);
            float randomVal = rand(tileNumber);
            float opacity = randomVal * randomVal;
            vec4 backgroundColor = vec4(color, opacity);

            if (tilePosition.x > 23.0 && tilePosition.y < 1.0) {
                gl_FragColor = vec4(color, 1.0); // Full opacity for the dot
            } else {
                gl_FragColor = backgroundColor;
            }
        }
    `;

    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    const shaderProgram = this.gl.createProgram();
    if (!shaderProgram) {
      throw new Error("Failed to create shader program.");
    }

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error("Failed to link shader program: " + this.gl.getProgramInfoLog(shaderProgram));
    }

    return shaderProgram;
  }

  private loadShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader.");
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error("Failed to compile shader: " + this.gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  public use(): void {
    this.gl.useProgram(this.shaderProgram);
  }

  public getProgram(): WebGLProgram {
    return this.shaderProgram;
  }
}

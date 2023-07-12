window.onload = () => {
    const canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl', { alpha: true });

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const shader = new Shader(gl);
    shader.use();

    const vertices = new Float32Array([
        -1, 1,
        -1, -1,
        1, -1,
        1, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(shader.getProgram(), 'position');
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    function render() {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

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
            void main() {
                vec2 tilePosition = mod(gl_FragCoord.xy, 24.0);
                vec3 color = vec3(1.0, 1.0, 1.0);
                if (tilePosition.x > 0.0 || tilePosition.y > 0.0) {
                    color = vec3(0.0, 0.0, 0.0);
                }
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        const shaderProgram = this.gl.createProgram();
        if (!shaderProgram) {
            throw new Error('Failed to create shader program.');
        }

        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            throw new Error('Failed to link shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
        }

        return shaderProgram;
    }

    private loadShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type);
        if (!shader) {
            throw new Error('Failed to create shader.');
        }

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Failed to compile shader: ' + this.gl.getShaderInfoLog(shader));
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

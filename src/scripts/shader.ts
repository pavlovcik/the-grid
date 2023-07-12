// Create canvas and WebGL context
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const gl = canvas.getContext("webgl") as WebGLRenderingContext;

// Enable alpha blending
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// Define shader sources
const vertexShaderSource = `
    attribute vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0, 1);
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform float u_time;

    float rand(vec2 n) {
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    void main() {
        vec3 color = vec3(128.0/255.0, 128.0/255.0, 128.0/255.0); // #808080
        vec2 tilePosition = mod(gl_FragCoord.xy, 24.0);
        vec2 tileNumber = floor(gl_FragCoord.xy / 24.0);

        float period = rand(tileNumber) * 9.0 + 1.0; // Random value in the range [1, 10]
        float phase = fract(u_time / period);
        float opacity = 1.0 - abs(phase * 2.0 - 1.0);

        vec4 backgroundColor = vec4(color, opacity);

        if (tilePosition.x > 23.0 && tilePosition.y < 1.0) {
            gl_FragColor = vec4(color, 1.0); // Full opacity for the dot
        } else {
            gl_FragColor = backgroundColor;
        }
    }
`;

// Create and compile shaders
const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Create program, attach shaders, and link
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// Verify program link status
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
  return;
}

// Use the program
gl.useProgram(program);

// Get location of time uniform
const timeUniformLocation = gl.getUniformLocation(program, "u_time");

// Define screen corners
const screenCorners = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

// Create and populate position buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, screenCorners, gl.STATIC_DRAW);

// Get location of position attribute
const positionLocation = gl.getAttribLocation(program, "a_position");

// Enable position attribute
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// ...

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // Update WebGL viewport to match
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
}

// ...

// Handle window resize
window.addEventListener("resize", () => {
  resizeCanvasToDisplaySize(canvas);
});

// ...

// Render function
function render() {
  resizeCanvasToDisplaySize(canvas); // Check and update canvas size each frame

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Update time uniform
  gl.uniform1f(timeUniformLocation, performance.now() / 1000.0);

  // Draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // Request next frame
  requestAnimationFrame(render);
}

// Start the render loop
render();

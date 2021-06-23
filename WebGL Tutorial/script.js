var gl;

const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;  // Now we can use function without glMatrix.~~~

function testGLError(functionLastCalled) {
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
        canvasheight = canvas.height;
        canvaswidth = canvas.width;
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}

var shaderProgram;

var vertexData = [
		// Backface (RED/WHITE) -> z = 0.5
        -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,  0.0,  0.0,  
         0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0,  1.0,  1.0, 
         0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,  1.0, -0.0,
        -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0, -0.0, -0.0, 
        -0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0, -0.0,  1.0, 
         0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,  
		// Front (BLUE/WHITE) -> z = 0.5      
        -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0, -0.0, -0.0, 
         0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0,  1.0,  1.0, 
         0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,  1.0, -0.0, 
        -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0, -0.0, -0.0, 
        -0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0, -0.0,  1.0, 
         0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,  
		// LEFT (GREEN/WHITE) -> z = 0.5     
        -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, -0.0, -0.0, 
        -0.5,  0.5,  0.5,  0.0, 1.0, 0.0, 1.0,  1.0,  1.0, 
        -0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 1.0,  1.0,  0.0, 
        -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, -0.0, -0.0, 
        -0.5, -0.5,  0.5,  0.0, 1.0, 0.0, 1.0, -0.0,  1.0, 
        -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,  1.0,  1.0,  
		// RIGHT (YELLOE/WHITE) -> z = 0.5    
         0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0, -0.0, -0.0, 
         0.5,  0.5,  0.5,  1.0, 1.0, 0.0, 1.0,  1.0,  1.0, 
         0.5,  0.5, -0.5,  1.0, 1.0, 0.0, 1.0,  1.0,  0.0, 
         0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0, -0.0, -0.0, 
         0.5, -0.5,  0.5,  1.0, 1.0, 0.0, 1.0, -0.0,  1.0, 
         0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,  
		// BOTTON (MAGENTA/WHITE) -> z = 0.5 
        -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0, -0.0, -0.0, 
         0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0,  1.0,  1.0, 
         0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0,  1.0,  0.0, 
        -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0, -0.0, -0.0, 
        -0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, -0.0,  1.0, 
         0.5, -0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0,  
		// TOP (CYAN/WHITE) -> z = 0.5       
        -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, -0.0, -0.0, 
         0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,  1.0,  1.0, 
         0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0,  1.0,  0.0, 
        -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, -0.0, -0.0, 
        -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0, -0.0,  1.0, 
         0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0,  1.0,  1.0 
];

var texture;
var image = new Image();

function initialiseBuffer() {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

	var texture = gl.createTexture(); 
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Fill the texture with a 1x1 red pixel.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// Asynchronously load an image
	
	image.src = "data:image/png;base64, " + ajouUnivDef;
    
	image.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		});
	
    return testGLError("initialiseBuffers and texture initialize");
}

function initialiseShaders() {

    var fragmentShaderSource = `
			varying highp vec4 color; 
			varying mediump vec2 texCoord;
			uniform sampler2D sampler2d;
			void main(void) 
			{ 
				gl_FragColor = 0.1* color + 0.9 * texture2D(sampler2d, texCoord);; 
			}`;

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    // Vertex shader code
    var vertexShaderSource = `
			attribute highp vec4 myVertex; 
			attribute highp vec4 myColor; 
			attribute highp vec2 myUV; 
			uniform mediump mat4 mMat; 
			uniform mediump mat4 vMat; 
			uniform mediump mat4 pMat; 
			varying  highp vec4 color;
			varying mediump vec2 texCoord;
			void main(void)  
			{ 
				gl_Position = pMat * vMat * mMat * myVertex; 
				gl_PointSize = 8.0; 
				color = myColor; 
				texCoord = myUV;
                texCoord.y = 1.0-texCoord.y;
			}`;

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    // Create the shader program
    gl.programObject = gl.createProgram();
    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);
    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    gl.bindAttribLocation(gl.programObject, 2, "myUV");
    // Link the program
    gl.linkProgram(gl.programObject);
    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

var canvasheight = 800;
var canvaswidth = 600;

var fov_degree = 90.0;
var cameraZ = 2.0;

var preMouse = vec3.create();
var mouseRotate = mat4.create();
var rotatefactor = 1.1;  //to rotate smoother, accelerate the rotate

var iscenterbox = true;
var boxgenRange = 10.0;
var boxes = [];

function imageChange(number)
{
    if(number == 0)
	    image.src = "data:image/png;base64, " + ajouUnivDef;
    else if(number == 1)
        image.src = "data:image/png;base64, " + ajouUnivBlack;
    else if(number == 2)
        image.src = "data:image/png;base64, " + ajouUnivBlackBg;
}

function rotate(event)
{
    if (event.which != 0) {
        var curX = (event.offsetX * 2 / canvaswidth) - 1;
        var curY = - (event.offsetY * 2 / canvasheight) + 1;
        var curZ = Math.sqrt(1 - (Math.pow(curX, 2) + Math.pow(curY, 2)));

        if(isNaN(curZ))
            return false;

        var curMouse = vec3.create(); 
        vec3.normalize(curMouse, [curX, curY, curZ]);

        var axis = vec3.create();
        vec3.cross(axis, preMouse, curMouse);
        
        var newRot = mat4.create();
        mat4.rotate(newRot, newRot, rotatefactor * Math.acos(vec3.dot(preMouse, curMouse)) , axis);
        mat4.multiply(mouseRotate, newRot, mouseRotate);

        preMouse = curMouse;

        event.preventDefault();
    }

    return false;
}

function startRotate(event)
{
    curX = (event.offsetX * 2 / canvaswidth) - 1;
    curY = - (event.offsetY * 2 / canvasheight) + 1;
    curZ = Math.sqrt(1 - (Math.pow(curX, 2) + Math.pow(curY, 2)));

    if(isNaN(curZ))
        return false;

    vec3.normalize(preMouse, [curX, curY, curZ]);
    event.preventDefault();
    
    return false;
}

function zoom(event)
{
    if(!(event.ctrlKey || event.shiftKey))
    {
        fov_degree += event.deltaY * 0.1;
        if(fov_degree > 150) fov_degree = 150;
        else if(fov_degree < 30) fov_degree = 30;

        event.preventDefault();
    }
    return false;
}

function cameramove(event)
{
    if(event.key == 'w' || event.key == 'W' )
        cameraZ--;
    else if (event.key == 's' || event.key == 'S')
        cameraZ++;
    
    if(cameraZ < 1)
        cameraZ = 1;
    if(cameraZ > 15)
        cameraZ = 15;

    event.preventDefault();
    return false;
}

function generateBox()
{
    var aBox = vec3.create();
    vec3.random(aBox, Math.random() * boxgenRange);
    boxes.push(aBox);
}

function update_range(new_range)
{
    boxgenRange = parseFloat(new_range);
}

function update_centerbox(select)
{
    iscenterbox = select;
}

function reset()
{
    if(confirm("EveryThing on canvas will be reset!")) {
        mat4.identity(mouseRotate);
        cameraZ = 2;
        fov_degree = 90;
        iscenterbox = true;
        document.getElementById("centerBox_def").checked = true;
        boxes = [];
    }

    return false;
}


function renderScene() {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);										// Added for depth Test 

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	// Added for depth Test 
	gl.enable(gl.DEPTH_TEST);								// Added for depth Test 

    var mMatLocation = gl.getUniformLocation(gl.programObject, "mMat");
	var vMatLocation = gl.getUniformLocation(gl.programObject, "vMat");
	var pMatLocation = gl.getUniformLocation(gl.programObject, "pMat");

    pMat = mat4.create(); 
	vMat = mat4.create(); 
	mMat = mat4.create(); 
	
	mat4.perspective(pMat, fov_degree * 3.141592 / 180.0 , canvaswidth/canvasheight , 0.2, 50 + cameraZ); 
	mat4.lookAt(vMat, [0,0,cameraZ], [0.0,0.0,0.0], [0,1,0]);
    
    gl.uniformMatrix4fv(vMatLocation, gl.FALSE, vMat );
    gl.uniformMatrix4fv(pMatLocation, gl.FALSE, pMat );

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 36, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 36, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 36, 28);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

    if(iscenterbox)
    {
        mat4.multiply(mMat, mouseRotate, mMat);
        gl.uniformMatrix4fv(mMatLocation, gl.FALSE, mMat );
	    gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    {
        boxes.forEach(element => {
            mat4.identity(mMat); 
            mat4.translate(mMat, mMat, element);
            mat4.multiply(mMat, mouseRotate, mMat);
            gl.uniformMatrix4fv(mMatLocation, gl.FALSE, mMat );
            gl.drawArrays(gl.TRIANGLES, 0, 36);
        });
    }



    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("helloapicanvas");

    document.getElementById("ajou_def_img").src = "data:image/png;base64, " + ajouUnivDef;
    document.getElementById("ajou_black_img").src = "data:image/png;base64, " + ajouUnivBlack;
    document.getElementById("ajou_black_bg_img").src = "data:image/png;base64, " + ajouUnivBlackBg;

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

	// renderScene();
    // Render loop
    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}

//Images in base64
var ajouUnivDef = "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";

var ajouUnivBlackBg = "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";

var ajouUnivBlack = "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";

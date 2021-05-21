let camera, scene, renderer, controls, mesh, light, geometry;

let video = document.querySelector('video');

const mediaConstraints = {
  audio: false,
  video: true
};

function webcamAccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream; // send stream to video element
}

function webcamError(error) {
  console.log(error.name, error.message);
  // fallback video
  video.src = 'hearts.mp4';
}

function setup() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let pxScale = window.devicePixelRatio;

  //set up canvas background scene
  const background = document.getElementById('background');
  const context = background.getContext('2d');
  background.style.width = width + 'px';
  background.style.height = height + 'px';
  background.width = width * pxScale;
  background.height = height * pxScale;

  // normalize the coordinate system
  context.scale(pxScale, pxScale);

  context.font = "80px sans-serif";
  context.textBaseline = "middle";
  context.textAlign = "left";
  context.strokeStyle = 'rgb(121,73,55)'; 
  context.fillStyle = 'rgb(121,73,55)';      
  const txt = 'love yourself first\nbe enough for yourself\neverything else will fall in line\nthe world will wait';
  const x = width / 2 - 550;
  const y = height / 2;
  const lineheight = 80;
  const lines = txt.split('\n');

  for (let i = 0; i<lines.length; i++)
  if (i%2 === 0) {
    context.strokeText(lines[i], x, y + (i*lineheight) );
  } else {
    context.fillText(lines[i], x, y + (i*lineheight) );
  }     
}

function init() {
  //set up 3d foreground scene
  let width = window.innerWidth;
  let height = window.innerHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, width/height, 1, 25000);
  camera.position.set(0, 300, 700);
  scene.add(camera);

  light = new THREE.DirectionalLight(0xfffffff, 1); // color, intensity
  light.position.set(1, 1, 1); // location x, y, z
  scene.add(light);

  let foreground = document.getElementById('foreground');

  renderer = new THREE.WebGLRenderer({alpha: 1, antialias: true, canvas: foreground});
  renderer.setPixelRatio(window.devicePixelRatio); // scale for device resolution
  renderer.setSize(width, height);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  video.play();
  navigator.mediaDevices.getUserMedia(mediaConstraints).then(webcamAccess).catch(webcamError);

  var x = 25, y = 250;
  var heartShape = new THREE.Shape();
  heartShape.moveTo( x + 25, y + 25 );
  heartShape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
  heartShape.bezierCurveTo( x - 30, y, x - 30, y + 35,x - 30,y + 35 );
  heartShape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
  heartShape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
  heartShape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
  heartShape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );

  const extrudeSettings = {
    steps: 2,  
    depth: 20,  
    bevelEnabled: true,  
    bevelThickness: 1,  
    bevelSize: 1,  
    bevelSegments: 2,  
  };

  const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
  geometry.translate( 100, -450, -100 );
  const material = new THREE.MeshLambertMaterial( {wireframe: false, color: 0xf13f0e, side: THREE.DoubleSide} );
  const mesh = new THREE.Mesh( geometry, material ) ;
  mesh.rotation.x = Math.PI * 2.9;
  scene.add( mesh );

  const geometry2 = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
  geometry2.translate( -200, -150, -100 );
  const mesh2 = new THREE.Mesh( geometry2, material ) ;
  mesh2.rotation.x = Math.PI * 2.9;
  scene.add( mesh2 );
}

function depthMap() {
  const canvas = document.getElementById('drawing');
  const context = canvas.getContext('2d');

  context.drawImage(video, 0, 0, 200, 200);

  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  let data = imageData.data;
  return data;
}

function vertices() {
  data = depthMap();

  let material = new THREE.MeshLambertMaterial({wireframe: true, color: 0xfff3f3, side: THREE.DoubleSide});

  // width, height, segments
  geometry = new THREE.PlaneGeometry(500, 500, 199, 199);
  mesh = new THREE.Mesh(geometry, material);

  console.log('Pixel data length: ' + data.length);  
  console.log('Geometry array: ' + mesh.geometry.attributes.position.array.length);

  // generate height based on the lightness of each pixel
  for (let i = 0; i <= data.length; i += 4) {
    let total = 0;
    total += data[i];
    total += data[i] + 1;
    total += data[i] + 2;
    let avg = total / 3;

    let vertex = (i / 4) * 3;
    mesh.geometry.attributes.position.array[vertex + 2] = avg;
  }

  mesh.rotation.x = -Math.PI/5; // rotate flat

  // update geometry
  geometry.computeVertexNormals();

  scene.add(mesh);
}

let counter = 0;
let increase = true;
function animate() {
  renderer.render(scene, camera);
  controls.update();

  data = depthMap();

  // generate height based on the lightness of each pixel
  for (let i = 0; i <= data.length; i += 4) {
    let total = 0;
    total += data[i];
    total += data[i] + 1;
    total += data[i] + 2;
    let avg = total / 3;

    let vertex = (i / 4) * 3;
    mesh.geometry.attributes.position.array[vertex + 2] = avg / 4;
  }

  scene.children[4].rotation.y = Math.sin(Date.now() * 0.001) * Math.PI * 0.3;
  scene.children[2].rotation.y += 0.01;
  scene.children[3].rotation.y -= 0.01;

  // update geometry
  mesh.geometry.attributes.position.needsUpdate = true;

  requestAnimationFrame(animate);
}

window.addEventListener('load', () => {
  setup();
  init();
  vertices();
  animate();
})

window.addEventListener('resize', () => {
  setup();
});
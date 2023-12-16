import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/94/three.min.js"
import { jQuery } from "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"
import { Dat } from "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.min.js"
import { Math } from "https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.2.1/math.min.js"
import { OrbitControls } from "https://raw.githubusercontent.com/Adderin/github-slideshow/master/OrbitControls.js"

class methane {
  // set the scene size
  var WIDTH = 600, HEIGHT = 600;
  // set some camera attributes
  var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 1, FAR = 1000;
  // get the DOM element to attach to
  var $container = $('#container');
  // create a WebGL renderer, camera, and a scene
  // NOTE: for the assignment in Unit 4 where you need to use a texture, or in any other assignment where a texture is required
  // you should deactivate the Detector and use ONLY the CanvasRenderer. There are some issues in using waht are called Cross Domain images for
  // for textures. You can get more details by looking up WebGL and CORS using Google search. I have included some code below that will
  // get around this issue that you can use.

    var renderer = new THREE.WebGLRenderer({antialias: true});

  //create a shadow map
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  var scene = new THREE.Scene();
  var clock = new THREE.Clock();
  var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  // the camera starts at 0,0,0 so pull it back
  // the camera starts at 0,0,0 so pull it back for some assignments you may need to adjust this value
  // some distance to make the scene visible properly
  camera.position.z = 60;
  camera.position.set(1, -170, 90);
  // add the camera to the scene
  scene.add(camera)


  // because the entire scene is moving the position of the camera and lights in relation to objects within
  // the scene doesn't change so the lighting on the surface of the object(s) will not change either
  // set up the camera controls. set to false so that the plan will stay stationary 
  var cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.enabled = false;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);
  // attach the render-supplied DOM element
  $container.append(renderer.domElement);
  //render shadow map and set perameters
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMapAutoUpdate = true;
  renderer.shadowCameraNear = 1;
  renderer.shadowCameraFar = 400;
  renderer.shadowCameraFov = 0;
  renderer.shadowMapBias = 0.005;
  renderer.shadowMapDarkness = 0.5;
  renderer.shadowMapWidth = 300;
  renderer.shadowMapHeight = 300;

  // add camera
  scene.add(camera)

  //
  // END OF THE STANDARD CODE FOR THE ASSIGNMENT
  // Following this is where you must place your own custom code to complete the assignment
  //create ambient light
  const light = new THREE.AmbientLight(0x404040);
  //add light to the scene
  scene.add(light);

  // create a spot light to cast a shadow
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.castShadow = true;
  spotLight.position.set(60, 40, 300);
  //add spot light to the scene
  scene.add(spotLight);

  //set shadow map values
  spotLight.shadow.mapSize.width = 1000;
  spotLight.shadow.mapSize.height = 1000;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = -200

  //create Methane CH4 molecule 
  var CH4 = new THREE.Object3D();

  //create colors and materials to be used on atoms
  var hydroAtomMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff, specular: 0xffffff, shininess: 300});
  var carbonAtomMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, specular: 0xffffff, shininess: 90});
  var bondMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff, shininess: 90});

  //create carbon atom
  var carbonAtom = new THREE.SphereBufferGeometry(20, 50, 50);
  var carbon = new THREE.Mesh(carbonAtom, carbonAtomMaterial);
  carbon.castShadow = true;
  carbon.receiveShadow = true;
  //add carbon to Methane CH4 molecule
  CH4.add(carbon);

  // create hydrogen atom
  var hydrogenAtom = new THREE.SphereGeometry(7, 50, 50);
  hydrogenAtom.translate(0, 30, 0);
  var hydrogen = new THREE.Mesh(hydrogenAtom, hydroAtomMaterial);
  hydrogen.castShadow = true;
  hydrogen.receiveShadow = true;

  //create bond
  var bondCylinder = new THREE.CylinderGeometry(3, 3, 30, 16);
  bondCylinder.translate(0, 15, 0);
  var bond = new THREE.Mesh(bondCylinder, bondMaterial);
  bond.castShadow = true;
  bond.receiveShadow = true;

  //conect hdrogen atoms to bonds
  var atomBond = new THREE.Object3D();
  atomBond.add(hydrogen);
  atomBond.add(bond);

  //use clone to make four atom bonds
  var hydrogenA = atomBond.clone();
  hydrogenA.position.setY(12);
  //add to Methane CH4 molecule
  CH4.add(hydrogenA);

  var hydrogenB = atomBond.clone();
  hydrogenB.position.setX(10);
  hydrogenB.position.setY(-10);
  hydrogenB.position.setZ(-10);
  hydrogenB.rotateZ(Math.PI * 4 / 3);
  hydrogenB.rotateX(Math.PI * 7 / 4);
  CH4.add(hydrogenB);

  var hydrogenC = atomBond.clone();
  hydrogenC.position.setY(-12);
  hydrogenC.position.setZ(12);
  hydrogenC.rotateX(Math.PI * 3 / 4);
  CH4.add(hydrogenC);

  var hydrogenD = atomBond.clone();
  hydrogenD.rotateZ(Math.PI * 2 / 3);
  hydrogenD.rotateX(Math.PI * 7 / 4);
  hydrogenD.position.setX(-10);
  hydrogenD.position.setZ(-10);
  hydrogenD.position.setY(-10);
  CH4.add(hydrogenD);

  //add methane CH4 molecule to the scene
  scene.add(CH4);

  //create green plane
  var plane = new THREE.PlaneBufferGeometry(300, 300, 20, 20);
  var planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x03ff18,
    side: THREE.DoubleSide
  });
  //set green plan properties
  var greenPlane = new THREE.Mesh(plane, planeMaterial);
  greenPlane.position.set(3, 3, -50);
  greenPlane.receiveShadow = true;
  //add green plan to the scene
  scene.add(greenPlane);

  //create mouse rotation
  //code from https://gamedev.stackexchange.com/a/130930
  var mouseDrag = false;
  var mousePosition = {
    x: 0,
    y: 0
  };
  const toRadians = (angle) => {
    return angle * (Math.PI / 180);
  };
  const toDegrees = (angle) => {
    return angle * (180 / Math.PI);
  };
  const renderArea = renderer.domElement;
  renderArea.addEventListener('mousedown', (e) => {
    mouseDrag = true;
  });
  renderArea.addEventListener('mousemove', (e) => {
    var deltaMove = {
      x: e.offsetX - mousePosition.x,
      y: e.offsetY - mousePosition.y
    };
    if (mouseDrag) {
      let deltaRotationQuaternion = new THREE.Quaternion().
        setFromEuler(
          new THREE.Euler(toRadians(deltaMove.y * 1), toRadians(deltaMove.x * 1), 0, 'XYZ')
        );
      //set moue controls to effect CH4
      CH4.quaternion.multiplyQuaternions(deltaRotationQuaternion, CH4.quaternion);
    }
    mousePosition = {
      x: e.offsetX,
      y: e.offsetY
    };
  });
  document.addEventListener('mouseup', (e) => {
    mouseDrag = false;
  });


  function render() {
    cameraControls.update();
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    // calls render function
    render();
  }
  // calling the animate function to start the animation
  animate();
}

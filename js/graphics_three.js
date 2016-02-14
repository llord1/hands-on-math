if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer;
var plane;
var mouse, raycaster; 
var threshold = 0.1;

var objects = [];

init();
render();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 00, 500, 2000 ); 
    camera.lookAt( new THREE.Vector3() );


    scene = new THREE.Scene();
    // var sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
    // var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, shading: THREE.FlatShading } );

    // grid

  var size = 1000, step = 50;

    var geometry = new THREE.Geometry();

    for ( var i = - size; i <= size; i += step ) {

        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

    }

    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );

    var line = new THREE.LineSegments( geometry, material );
    scene.add( line );

    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = threshold;

    mouse = new THREE.Vector2();


    //var geometry = new THREE.BoxGeometry( 500, 1000, 1000);
    //  var geometry = new THREE.BoxGeometry( 2800, 1000, 1000);  // aashna
    // // geometry.rotateX( - Math.PI / 2 );

    // plane = new THREE.Mesh( geometry, new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 0.2, transparent: true, visible: true } ) );
    // scene.add( plane );

    objects.push( plane );


    // var geometry2 = new THREE.BoxGeometry( 200, 200, 300 );
    // var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // var cube2 = new THREE.Mesh( geometry2, material2 );
    // scene.add( cube2 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {

  var options = {enableGestures: true};
  var prevPosition = null;
  var tapped = null;
  var drawing = false;
  var pointing = 1 //represents only index finger extended

  renderer.render( scene, camera );

  var controller = Leap.loop(options, function(frame) {
    var hand = frame.hands[0];
    if (!hand) return;
    
    var extended_fingers = 0;
    var index = null;
    for (var i=0; i<hand.fingers.length; i++) {  
        var x = hand.fingers[i];
        if (x.extended) extended_fingers += 1;
        if (x.type = "index") index = x;
    }

    if (extended_fingers == pointing && !drawing){
        console.log("Start");
        drawing = !drawing;
    } else if (extended_fingers != pointing && drawing){
        console.log("Stop");
        drawing = !drawing;
    }
    
    if (drawing) {
        var finger = index;
        var currentPosition = renderHelper(finger.tipPosition);

        var geometry2 = new THREE.BoxGeometry( 10, 10, 10 );
      
        var material2 = new THREE.MeshBasicMaterial( { color: new THREE.Color(0, 0x000000, 0) } );

        //var sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
        //var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, shading: THREE.FlatShading } );

        var cube2 = new THREE.Mesh(geometry2, material2);
        cube2.position.set(currentPosition[0]*(3)-50, currentPosition[1], currentPosition[2]*2 + 800);

        //cube2.position.set(currentPosition[0]*(3)-50, currentPosition[1], currentPosition[2]*2 + 800);
        scene.add( cube2 );
      
        renderer.render( scene, camera );  
    }
    
  });

}

function renderHelper(position) {
  return position;
}
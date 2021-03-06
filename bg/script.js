// inner variables
var canvas, ctx
var repeat = 50000
var camera, scene, renderer, meshMaterial, mesh, geometry, i
var startTime = new Date().getTime()
var windowHalfX = window.innerWidth / 2
var windowHalfY = window.innerHeight / 2
if (window.attachEvent) {
    window.attachEvent('onload', main_init)
} else {
    if(window.onload) {
        var curronload = window.onload
        var newonload = function() {
            curronload()
            main_init()
        }
        window.onload = newonload
    } else {
        window.onload = main_init
    }
}
function main_init() {

  var isMobile = false //initiate as false
  // device detection
  if(location.hash.startsWith("#/") && (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))) {
 isMobile = true
  }
          
    if (isMobile) {
      document.body.className += ' isMobile'
    } else {
      var hr = (new Date()).getHours();
      if (hr > 7 && hr < 17) {
        document.body.className += ' daytime'
      } else {
        document.body.className += ' nighttime'
      }
      // creating canvas and context objects
      canvas = document.getElementById('panel')
      var ctx = canvas.getContext('2d')
      // preparing camera
      camera = new THREE.Camera(30, window.innerWidth / window.innerHeight, 1, 5000);
      camera.position.z = 6000;
      // preparing scene
      scene = new THREE.Scene();
      // preparing geometry
      geometry = new THREE.Geometry();
      // loading texture
      var texture = THREE.ImageUtils.loadTexture('clouds.png');
      texture.magFilter = THREE.LinearMipMapLinearFilter;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      // preparing fog
      var fog = new THREE.Fog(0x251d32, - 100, 5000);
      // preparing material
      meshMaterial = new THREE.MeshShaderMaterial({
        uniforms: {
            'map': {type: 't', value:2, texture: texture},
            'fogColor' : {type: 'c', value: fog.color},
            'fogNear' : {type: 'f', value: fog.near},
            'fogFar' : {type: 'f', value: fog.far},
        },
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs').textContent,
        depthTest: false
      });
      // preparing planeMesh
      var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));
      for (i = 0; i < repeat; i++) {
        planeMesh.position.x = Math.random() * 1000 - 500
        planeMesh.position.y = - Math.random() * Math.random() * 200 - 12
        planeMesh.position.z = i * 2
        planeMesh.rotation.z = Math.random() * Math.PI
        planeMesh.scale.x = planeMesh.scale.y = Math.random() * Math.random() * 1.5 + 0.5
        THREE.GeometryUtils.merge(geometry, planeMesh)
      }

      mesh = new THREE.Mesh(geometry, meshMaterial)
      mesh.position.z = -repeat 
      scene.addObject(mesh)

      mesh = new THREE.Mesh(geometry, meshMaterial)
      mesh.position.z = 0 
      scene.addObject(mesh)

      mesh = new THREE.Mesh(geometry, meshMaterial)
      mesh.position.z = - 2 * repeat 
      scene.addObject(mesh)

      // preparing new renderer and drawing it
      renderer = new THREE.WebGLRenderer({ antialias: false })
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(renderer.domElement)
      // change canvas size on resize
      window.addEventListener('resize', onResize, false)
      setInterval(drawScene, 30) // loop drawScene
      setInterval(updateURL, 200)
   }
}
function onResize(event) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
function drawScene() {
    position = (((new Date().getTime() - startTime) * 0.03) % repeat )
    camera.position.z = - position
    renderer.render(scene, camera);
}
function updateURL() {
  if (document.getElementById("iframe") !== null) {
    window.location.hash = "#" + document.getElementById("iframe").contentWindow.location.pathname
  } else {
    window.location.hash = "#" + camera.position.z
  }
}

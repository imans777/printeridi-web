import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
window['THREE'] = THREE;
import 'three/examples/js/loaders/GCodeLoader';
import 'three/examples/js/controls/OrbitControls';

// @Component({
//   selector: 'app-gcode-viewer',
//   templateUrl: './gcode-viewer.component.html',
//   styleUrls: ['./gcode-viewer.component.scss']
// })
export class GcodeViewerComponent implements OnInit {
  current = 1;
  files = [];

  constructor() {
    this.files = [
      'https://jherrm.com/gcode-viewer/examples/part.gcode',
      'assets/batman.gcode',
      'assets/part.gcode',
      'assets/retraction.gcode',
      'assets/mount_export.gcode',
      'assets/batman_mask.gcode'
    ];
  }

  ngOnInit() {
    this.loadModel();
  }

  loadModel() {
    let files = this.files;
    let current = this.current;
    let container;
    let camera, scene, renderer;
    let gcodeObject, pivot, dirLight, mesh;
    init();
    animate();

    function init() {
      container = document.createElement('div');
      document.body.appendChild(container);
      camera = new THREE.PerspectiveCamera(
        10,
        window.innerWidth / window.innerHeight,
        1,
        15000);
      // NOTE: if the object is too small/big, this might malfunction!
      camera.position.set(0, 400, 700);
      scene = new THREE.Scene();
      let controls = new THREE.OrbitControls(camera);
      // scene.background = new THREE.Color(0xf193bf);
      scene.background = new THREE.Color(0x000055);


      pivot = new THREE.Object3D();
      const loader = new THREE.GCodeLoader();
      loader.load(files[current ++], function (object) {
        gcodeObject = object;
        // gcodeObject.remove(gcodeObject.children[1]);
        // gcodeObject.remove(gcodeObject.children[1]);
        // gcodeObject.children[1].traverse(el => {
        //   console.log('this is el: ', el);
        // })
        gcodeObject.position.set(-100, -20, 100);

        // 90 - 31 - 7 -- 96
        // gcodeObject.children[0].material = new THREE.MeshBasicMaterial({
        //   color: 0x880000,
        //   opacity: 0.7,
        //   transparent: true
        // });
        let imgTexture = null;
        let alpha = 0.6;
        let beta = 0.6;
        let gamma = 0.6;
        let diffuceColor = new THREE.Color(0xffff00)
          // .setHSL(alpha, 0.5, gamma * 0.5 + 0.1)
          .multiplyScalar(1 - beta * 0.2);
        let customMat = new THREE.MeshPhongMaterial({
          map: imgTexture,
          bumpMap: imgTexture,
          bumgScale: 1,
          color: diffuceColor,
          specular: new THREE.Color(beta * 0.2, beta * 0.2, beta * 0.2),
          reflectivity: beta,
          shininess: Math.pow(2, alpha * 10),
          envMap: null,
        });

        // gcodeObject.children[0].traverse(child => {
        //   console.log('child is : ', child);
        //   child.material = customMat;
        //   if (child instanceof THREE.Mesh) {
        //     child.material = customMat;
        //   }
        // })
        gcodeObject.children[0].traverse(child => {
          // child.material = customMat;
          console.log('we are here!', child);
          mesh = new THREE.LineSegments(
            child.geometry,
            customMat
          );
          scene.add(mesh);
        });

        // mesh = new THREE.Mesh(gcodeObject, customMat);
        // gcodeObject.children[0].material.color = new THREE.Color(0x880000);
        // gcodeObject.children[0].material.transparent = false;
        // gcodeObject.children[0].material.opacity = 0.1;
        // gcodeObject.children[0].material = customMat;

        let geo = new THREE.SphereBufferGeometry(32, 32, 16);
        // geo.position.x = 200;
        // let mesh = new THREE.Mesh(geo, customMat);
        // gcodeObject.position.set(0, 0, 0);
        pivot.add(gcodeObject);
        // pivot.add(mesh);
        pivot.position.set(0, 0, 0);
        camera.up = new THREE.Vector3(0, 1, 0);
        // camera.lookAt(gcodeObject.position);
        camera.lookAt(pivot.position);
        scene.add(pivot);
        // scene.add(mesh);
        // scene.add(gcodeObject);

        /* LIGHTS */
        dirLight = new THREE.DirectionalLight(0xffffff, 0.7125);
        dirLight.position.set(1, 1, 1).normalize();
        // dirLight.target.position.set(-100, -20, 100);
        dirLight.target = gcodeObject;
        dirLight.shadowCameraVisible = true;
        dirLight.shadowCameraNear = -10;
        dirLight.shadowCameraFar = 1000;
        scene.add(dirLight);
        scene.add(new THREE.AmbientLight(0x222222));
        const pointLight = new THREE.PointLight(0xffff00, 1.5);
        pointLight.position.set(0, 100, 90);
        scene.add(pointLight);
        console.log('hello! :|');


      });



      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      // window.addEventListener('resize', resize, false);
    }
    function addLights() {
      dirLight = new THREE.DirectionalLight(0xffff00, 1);
      dirLight.position.set(1, 1, 1).normalize();
      scene.add(dirLight);
      let pointLight = new THREE.PointLight(0xffff00, 1.5);
      pointLight.position.set(0, 100, 90);
      scene.add(pointLight);
      console.log('hello! :|');
    }
    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function animate() {
      requestAnimationFrame(animate);
      // pivot.rotateY(0.012);
      // gcodeObject.rotateY(0.02);
      renderer.render(scene, camera);
      // setTimeout(() => {
      //   gcodeObject.children[0].rotateY(0.02);
      //   mesh.rotateY(0.02);
      // }, 200);
    }
  }

  changeLoader() {
    this.current ++;// = (this.current ? 0 : 1);
    this.loadModel();
  }

}

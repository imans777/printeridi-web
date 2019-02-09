import {Component, OnInit, ViewChild, ElementRef, Renderer2, Input, ChangeDetectionStrategy} from '@angular/core';
import * as $ from 'jquery/dist/jquery.min';
import * as THREE from '../../lib/gcode/three';
window['$'] = $;
window['THREE'] = THREE;
import * as Constants from '../../lib/gcode/constants';
window['Constants'] = Constants;

/**
 * These codes are heavily based on: https://github.com/jherrm/gcode-viewer
 * But some changes have been made to the code for customization of this project
*/
import '../../lib/gcode/TrackballControls';
import '../../lib/gcode/js/ShaderExtras';
import '../../lib/gcode/js/postprocessing/EffectComposer';
import '../../lib/gcode/js/postprocessing/MaskPass';
import '../../lib/gcode/js/postprocessing/RenderPass';
import '../../lib/gcode/js/postprocessing/ShaderPass';
import '../../lib/gcode/js/postprocessing/BloomPass';

import {
  FileIO,
  GCodeImporter,
} from '../../lib/gcode/gimporter';
import {
  GCodeModel,
  GCode,
  GWord,
  GCodeParser,
} from '../../lib/gcode/gparser';
import {
  GCodeViewModel,
  GCodeRenderer,
} from '../../lib/gcode/grenderer';

@Component({
  selector: 'app-gcode-viewer',
  templateUrl: './gcode-viewer.component.html',
  styleUrls: ['./gcode-viewer.component.scss'],
})
export class GcodeViewerComponent implements OnInit {
  width = Constants.width;
  height = Constants.height;
  isRotating = true; // TODO: for print page, this should be (false / controllable)
  // better to be saved in pickledb in the server :-?

  @ViewChild('container', {}) container: ElementRef;
  @Input()
  set model(value) {
    if (!value)
      return;
    this.addModel(value);
  }

  @Input()
  set percent(value) { // 0 - 100
    if (!value)
      return;

    if (this.gr)
      this.gr.setIndex(
        Math.floor(this.gr.viewModels.length * value / 100)
      );
  }


  // accepts links like:
  // 'http://192.168.1.3/api/download/files/part.gcode',
  // 'http://192.168.1.3/api/download/usbs/SHB/part.gcode',

  gr;
  scene = null;
  object = null;
  effectFXAA;
  camera;
  controls;
  renderer;
  composer;
  layerIndex = 0;
  Constants;

  constructor(private domRenderer: Renderer2) {
    console.log("I'm here again!");
  }

  ngOnInit() {
    this.Constants = window['Constants'];
    setTimeout(() => {
      this.createScene();
    }, 0);
  }

  addModel(gcodeFile) {
    const self = this;
    GCodeImporter.importPath(gcodeFile, gcode => {
      const gp = new GCodeParser();
      const parsedGcodes = gp.parse(gcode);
      const changed = gp.centerizeGCodes(parsedGcodes);

      self.gr = new GCodeRenderer();
      const gcodeObj = self.gr.render(changed);
      self.layerIndex = self.gr.viewModels.length - 1;
      self.gr.setIndex(self.layerIndex);

      self.camera.position.z = 500;
      self.camera.position.y = -1000;
      self.camera.lookAt(self.gr.center);

      if (self.object) {
        self.scene.remove(self.object);
      }

      self.object = gcodeObj;
      self.scene.add(this.object);
    });
  }

  createScene() {
    this.initSceneInfo();
    this.animateScene();
  }

  initSceneInfo() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      clearColor: 0x000000,
      clearAlpha: 1,
      antialias: false
    });
    this.renderer.autoClear = false;
    this.domRenderer.appendChild(this.container.nativeElement, this.renderer.domElement);

    // camera things
    const fov = 45,
      aspect = this.width / this.height,
      near = 1,
      far = 10000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 300;
    this.scene.add(this.camera);

    this.controls = new THREE.TrackballControls(this.camera);
    this.controls.dynamicDampingFactor = 0.1;
    this.controls.rotateSpeed = 1.0;

    const renderModel = new THREE.RenderPass(this.scene, this.camera);
    const effectBloom = new THREE.BloomPass(0.4);
    const effectScreen = new THREE.ShaderPass(THREE.ShaderExtras['screen']);
    this.effectFXAA = new THREE.ShaderPass(THREE.ShaderExtras['fxaa']);
    effectScreen.renderToScreen = true;

    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(renderModel);
    this.composer.addPass(this.effectFXAA);
    this.composer.addPass(effectBloom);
    this.composer.addPass(effectScreen);

    this.setContainerSize();

    // handle resizing
    // window.addEventListener('resize', () => {
    // this.setContainerSize(window.innerWidth, window.innerHeight)
    // this.setContainerSize();
    // }, false);
    window.addEventListener('keydown', (event) => {
      if (event.keyCode == 32) { // toggle rotation on space
        this.isRotating = !this.isRotating;
      }
    }, false);
  }

  animateScene() {
    const self = this;
    function animate() {
      requestAnimationFrame(animate);
      self.renderScene();
    }

    animate();
  }

  renderScene() {
    for (let i = 0; i < this.scene.children.length; i++) {
      const object = this.scene.children[i];
      if (this.isRotating) {
        if (object instanceof THREE.Object3D) {
          object.rotation.z += 0.015;
        }
      }
    }

    // if (this.gr) {
    //   try {
    //     this.gr.setIndex(this.gr.index + 10);
    //     this.layerIndex = this.gr.index;
    //   } catch (e) {
    //     this.gr.setIndex(this.gr.viewModels.length - 1);
    //     this.layerIndex = this.gr.index;
    //   }
    // }

    this.controls.update();
    this.renderer.clear();
    this.composer.render();
  }

  setContainerSize(width = this.width, height = this.height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.effectFXAA.uniforms['resolution'].value.set(
      1 / width,
      1 / height
    );
    this.controls.handleResize(width, height);
    this.composer.reset();
  }
}

import { Component, OnInit, ElementRef } from '@angular/core';
import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works, ish!';

  //threeJS stuff;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: THREE.OrbitControls;

  counter: number;
  hostElement: ElementRef;

  mainSphere: THREE.Mesh;
  mainObject: THREE.Object3D;

  pointsetData = {};

  urlToGetOperations = 'http://localhost:5000/api/v1/Syncer/GetObjects/PointSets/779b3a6a-1ef4-460e-b759-67280f4c795f';

  constructor(el: ElementRef) {
    this.hostElement = el;
  }

  ngOnInit() {
    this.initThreeJs();
  }

  getJsonFromData() {
    console.log("fetching data");

    var xmlHttp = new XMLHttpRequest();
    
    this.makeCorsRequest();

    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.open( "GET", this.urlToGetOperations, false ); // false for synchronous request
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4) {
          // console.log(xmlHttp.responseText);
      }
    };
    xmlHttp.setRequestHeader('Accept', 'application/json');
    xmlHttp.send();

    var jsonObject = JSON.parse(xmlHttp.responseText);
    this.pointsetData = jsonObject;

    console.log(this.pointsetData["Points"]);

    console.log("fetching completed");
  }

  makeCorsRequest() {
    let xhr = this.createCORSRequest('GET', this.urlToGetOperations);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    console.log("CORS is successfully done, data is coming!!");

    xhr.onload = () => {
      let text = xhr.responseText;
      // let title = text.match('<title>(.*)?</title>')[1];
      var jsonObject = JSON.parse(xhr.responseText);
    }

    xhr.onerror = function () {
      alert('poop happened');
    }

    xhr.send();

  }

  // Create the XHR object.
  createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }

  initThreeJs() {

    this.getJsonFromData();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0xFFAAAAFF, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.hostElement.nativeElement.appendChild(this.renderer.domElement);

    this.mainObject = new THREE.Object3D();

    this.counter = 0;
    // this.items.forEach(
    //         i=>i.forEach(
    //             e=>(
    //                     console.log(this.counter, e.status),
    //                     this.fillWithObjects(this.counter++, e.status)
    //                 )
    //         )
    //     );

    // let bb = new THREE.Box3();
    // bb.setFromObject(this.mainObject);

    // var xCoord = (bb.max.x + bb.min.x) / 2;
    // var yCoord = (bb.max.y + bb.min.y) / 2;
    // var zCoord = (bb.max.z + bb.min.z) / 2;

    // this.camera.position.x = xCoord;
    // this.camera.position.y = yCoord;
    // this.camera.position.z = yCoord*2;

    for (let i = 0; i < 10; i++) {
      // this.fillWithObjects(i, 'Done');
    }


    this.scene.add(this.mainObject);

    this.camera.position.z = 80;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.5;
    this.controls.autoRotateSpeed = 5.5;
    this.controls.addEventListener('change', this.render);

    // this.controls.target = new THREE.Vector3(this.camera.position.x, this.camera.position.y, 0);


    this.render();
  }

  fillWithObjects(pos: number, status: string) {
    let sphereGeometry = new THREE.SphereGeometry(15, 165, 165);
    let cubeGeometry = new THREE.BoxGeometry(5, 5, 5, 65, 65);

    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    let redMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0033 });
    let yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xFFCC33 });
    let greenMaterial = new THREE.MeshBasicMaterial({ color: 0x3366FF });

    if (status == "Done")
      material.color = greenMaterial.color;
    else if (status == "In progress")
      material.color = yellowMaterial.color;
    else if (status == "Pending")
      material.color = redMaterial.color;

    let oneSphere = new THREE.Mesh(cubeGeometry, material);

    oneSphere.position.x = pos * 20;

    this.mainObject.add(oneSphere);
  }



  render = () => {
    requestAnimationFrame(this.render);

    // this.mainSphere.rotation.x += 0.1;
    // this.mainSphere.rotation.y += 0.1;

    this.renderer.render(this.scene, this.camera);
  }
}

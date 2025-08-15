import './App.css';
import * as THREE from "three";
import { useEffect } from 'react';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
  let model: THREE.Group;

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const sizes = {
      width: innerWidth,
      height: innerHeight,
    };
    // scene
    const scene: THREE.Scene = new THREE.Scene();

    // 光源を追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15); // カメラの位置を少し後ろに設定（モデル全体が見えるように）

    // renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x87ceeb, 1); // 空のような薄い青色（例）

    // OrbitControlsのインスタンスを作成
    const controls = new OrbitControls(camera, renderer.domElement);

    // gltf ３Dモデルインポート
    const gltfLoader = new GLTFLoader();

    gltfLoader.load("/models/house.gltf", (gltf: any) => {
      model = gltf.scene;
      scene.add(model);
    });

    // アニメーション
    const tick = () => {
      renderer.render(scene, camera);
      controls.update();
      requestAnimationFrame(tick);
    };
    tick();

  }, []);

  return (
    <>
      <canvas id="canvas"></canvas>
      <div className="mainContent">
        <h1>Three.jsによる3Dモデル表示（マウスドラッグで回転）</h1>
      </div>
      <footer>
        <p className="explanation">こちらはReact TypeScript Viteによって作成した3Dモデルをマウスで動かす練習です。こちらの動画を参考にしています。https://www.youtube.com/watch?v=Q2AmBEXhG8U</p>
        <p className="explanation">3Dモデルは下記作者によるデータを使用させていただいております。</p>
        <p className="license">This work is based on "Isometric Farm house" (https://sketchfab.com/3d-models/isometric-farm-house-70d1a841a57d434781e15d701f4bb45a) by nidhi3ds (https://sketchfab.com/nidhi3ds.) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)</p>
      </footer>
    </>
  );
}

export default App;
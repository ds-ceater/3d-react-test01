import './App.css';
import * as THREE from "three";
import { useEffect } from 'react';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); 
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(15, 15, 15);
    directionalLight.castShadow = true;
    // 影の品質を調整
    directionalLight.shadow.mapSize.width = 1024; // 影の解像度
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.far = 100; // 影を生成する範囲
    scene.add(directionalLight);

    // camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);

    // renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x87ceeb, 1);
    renderer.shadowMap.enabled = true; 

    // OrbitControlsのインスタンスを作成
    const controls = new OrbitControls(camera, renderer.domElement);

    const handleResize = () => {
      // 画面の新しいサイズを取得
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // レンダラーのサイズを更新
      renderer.setSize(newWidth, newHeight);

      // カメラのアスペクト比を更新
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix(); // カメラの射影行列を更新
    };

    // resizeイベントリスナーを設定
    window.addEventListener('resize', handleResize);

    

    // gltf ３Dモデルインポート (ここを修正)
    const gltfLoader = new GLTFLoader();
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    gltfLoader.load(`${import.meta.env.BASE_URL}models/table20250815.glb`, (gltf: THREE.GLTF) => {
      model = gltf.scene;

      // モデルを3倍に拡大
      model.scale.set(3, 3, 3);

      scene.add(model);
      gltf.scene.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true; // モデルが影を落とすように設定
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.filter((m) => m); // null除去
          }
        }
      });
    });

    // アニメーション
    const tick = () => {
      renderer.render(scene, camera);
      controls.update();
      requestAnimationFrame(tick);
    };
    tick();

    // クリーンアップ関数を返す
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);

  return (
    <>
      <canvas id="canvas"></canvas>
      <div className="mainContent">
        <h1>Three.jsによる3Dモデル表示（マウスドラッグで回転）</h1>
      </div>
      <footer>
        <p className="explanation">こちらはReact TypeScript Viteによって作成した3Dモデルをマウスで動かす練習です。こちらの動画を参考にしています。https://www.youtube.com/watch?v=Q2AmBEXhG8U</p>
        <p className="explanation">3DモデルはBlenderで作成しました。こちらの動画を参考にしています。https://www.youtube.com/watch?v=S6aAvxUx2ko</p>
      </footer>
    </>
  );
}

export default App;
// ThreeScene.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ThreeScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const material = new THREE.PointsMaterial({
            size: .5
        })

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);
        const loader = new GLTFLoader();
        loader.load('cherry_tree.glb', function (gltf) {
            const model = gltf.scene;
            model.traverse((object) => {
                console.log(object);
                if (object.isMesh) {
                    const geometry = object.geometry;

                    // Create Particles
                    const particles = new THREE.BufferGeometry();
                    const vertices = geometry.attributes.position.array;

                    particles.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

                    const material = new THREE.PointsMaterial({
                        color: 0xffffff,
                        size: 0.0001
                    });

                    const particleSystem = new THREE.Points(particles, material);
                    scene.add(particleSystem);
                }
            });
        }, undefined, function (error) {
            console.error(error);
        });
        // Cube setup
        

        // Mesh
        // const sphere = new THREE.Points(geometry, material)

        const pointLight = new THREE.PointLight(0xffffff, 1000)
        pointLight.position.x = 20
        pointLight.position.y = 30
        pointLight.position.z = 40
        scene.add(pointLight)

        camera.position.z = 20;
        const controls = new OrbitControls(camera, mount);
        controls.update();

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();

            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Clean up on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ThreeScene;

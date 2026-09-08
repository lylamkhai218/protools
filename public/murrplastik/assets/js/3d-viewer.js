// Three.js 3D STL Viewer Implementation for T&T Vina
let scene, camera, renderer, controls;
let modelMesh = null;
let gridHelper, axesHelper;
let autoRotate = true;
let container;

// Secure Obfuscated 3D Model Registry (Base64 Encoded Relative Paths)
const MODEL_REGISTRY = {
    'aur-liner': 'Li4vYXNzZXRzLzNkL2F1ci9yLXRlYy1saW5lci01NTBtbS5zdGw=',
    'aur-box': 'Li4vYXNzZXRzLzNkL2F1ci9SLVRlYyBCb3ggRVcgNDggTVAgLSAxMDBOXzgzNjkyNjU0LnN0bA==',
    'efk-80065': 'Li4vYXNzZXRzLzNkL2Vmay1kcmFnLWNoYWluLzgwMDY1LUF1c3Muc3Rs',
    'kdp-100': 'Li4vYXNzZXRzLzNkL2tkcC1jYWJsZS1lbnRyeS9LRFAgMTAwXzE1IFY0QV84NzY2MzEyMC5zdGw=',
    'kdp-r-m63': 'Li4vYXNzZXRzLzNkL2tkcC1jYWJsZS1lbnRyeS9LRFBfUiBNNjNfMTNfODczMDEwNDIuc3Rs',
    'suv-sa95': 'Li4vYXNzZXRzLzNkL3N1di1jb25kdWl0cy9TQSA5NV84MzY4MTAxNi5zdGw='
};

function getDecodedModelUrl(key) {
    if (!MODEL_REGISTRY[key]) return null;
    try {
        return atob(MODEL_REGISTRY[key]);
    } catch (e) {
        return null;
    }
}

function init3DViewer() {
    container = document.getElementById('threejs-container');
    if (!container) return;

    // F12 / Context menu protection on 3D canvas
    container.addEventListener('contextmenu', e => e.preventDefault());
    container.addEventListener('dragstart', e => e.preventDefault());

    const initialWidth = container.clientWidth || 800;
    const initialHeight = container.clientHeight || 450;

    // Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141414);
    
    // Create Camera
    camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 1, 10000);
    camera.position.set(100, 100, 150);

    // Create Renderer (High Performance, No Heavy Shadow Calculations)
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: false, 
        preserveDrawingBuffer: false,
        precision: 'mediump',
        powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x141414, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(initialWidth, initialHeight);
    renderer.shadowMap.enabled = false; // Disabled heavy shadow maps to maintain 60FPS
    container.appendChild(renderer.domElement);

    // Add OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 10;
    controls.maxDistance = 5000;

    // Add Helpers
    gridHelper = new THREE.GridHelper(200, 40, 0xd51e29, 0x555555);
    gridHelper.position.y = -35; 
    scene.add(gridHelper);

    axesHelper = new THREE.AxesHelper(50);
    axesHelper.position.set(-80, -34, -80); 
    scene.add(axesHelper);

    // Add Lights (Bright 360-degree illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 300, 0);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(150, 250, 200);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd51e29, 0.6);
    dirLight2.position.set(-150, -100, -150);
    scene.add(dirLight2);

    const cameraLight = new THREE.DirectionalLight(0xffffff, 0.8);
    cameraLight.position.set(0, 50, 150);
    scene.add(cameraLight);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        if (modelMesh && autoRotate) {
            modelMesh.rotation.z += 0.003;
        }
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // ResizeObserver
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (width > 0 && height > 0 && camera && renderer) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        });
        resizeObserver.observe(container);
    }

    // Determine initial model to load
    const activeTab = document.querySelector('.model-tab-btn.active');
    const initialKey = activeTab ? activeTab.getAttribute('data-model-key') : container.getAttribute('data-model-key');
    if (initialKey) {
        loadModelByKey(initialKey);
    }

    // Setup Model Tab Switchers
    setupModelTabs();
}

function loadModelByKey(key) {
    const rawUrl = getDecodedModelUrl(key);
    if (!rawUrl) {
        console.error('Model key not found:', key);
        return;
    }

    // Encode spaces and special characters in URL
    const modelUrl = encodeURI(rawUrl);

    // Show loading spinner
    const spinner = document.getElementById('loading-spinner');
    const loadingText = document.querySelector('.loading-text');
    if (spinner) {
        spinner.style.display = 'flex';
        spinner.style.opacity = '1';
    }
    if (loadingText) {
        loadingText.innerText = 'Đang tải mô hình 3D...';
    }

    // Clear existing model mesh
    if (modelMesh) {
        scene.remove(modelMesh);
        if (modelMesh.geometry) modelMesh.geometry.dispose();
        if (modelMesh.material) modelMesh.material.dispose();
        modelMesh = null;
    }

    // Fetch binary buffer directly with encoded URL
    fetch(modelUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch 3D model`);
            return response.arrayBuffer();
        })
        .then(buffer => {
            const loader = new THREE.STLLoader();
            const geometry = loader.parse(buffer);

            const material = new THREE.MeshStandardMaterial({
                color: 0x9ca3af,
                metalness: 0.4,
                roughness: 0.4,
                side: THREE.DoubleSide,
                flatShading: false
            });

            geometry.computeVertexNormals();
            geometry.center();

            modelMesh = new THREE.Mesh(geometry, material);

            geometry.computeBoundingSphere();
            const radius = geometry.boundingSphere.radius || 50;

            modelMesh.rotation.x = -Math.PI / 2;
            modelMesh.rotation.z = Math.PI / 4;
            scene.add(modelMesh);

            gridHelper.scale.set(radius / 50, 1, radius / 50);
            gridHelper.position.y = -radius - 5;
            
            axesHelper.scale.set(radius / 40, radius / 40, radius / 40);
            axesHelper.position.set(-radius - 10, -radius - 4, -radius - 10);

            camera.position.set(radius * 2.2, radius * 1.5, radius * 2.2);
            controls.minDistance = radius * 0.5;
            controls.maxDistance = radius * 10;
            controls.target.set(0, 0, 0);
            controls.update();

            // Hide Loading Spinner
            if (spinner) {
                spinner.style.opacity = '0';
                setTimeout(() => {
                    spinner.style.display = 'none';
                }, 400);
            }
        })
        .catch(err => {
            console.error('Lỗi tải mô hình:', err);
            if (loadingText) {
                loadingText.innerText = 'Không thể tải mô hình 3D. Vui lòng kiểm tra lại kết nối.';
            }
        });
}

function setupModelTabs() {
    const tabs = document.querySelectorAll('.model-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const key = tab.getAttribute('data-model-key');
            loadModelByKey(key);

            // Update Specs view if specs datasets exist
            updateSpecsView(key);
        });
    });
}

function updateSpecsView(key) {
    const specElements = document.querySelectorAll('[data-spec-key]');
    specElements.forEach(el => {
        const val = el.getAttribute(`data-spec-${key}`);
        if (val) {
            el.textContent = val;
        }
    });
}

// 3D Controls Bindings
document.getElementById('reset-view-btn')?.addEventListener('click', () => {
    if (!camera || !controls || !modelMesh) return;
    modelMesh.geometry.computeBoundingSphere();
    const radius = modelMesh.geometry.boundingSphere.radius || 50;
    camera.position.set(radius * 2.2, radius * 1.5, radius * 2.2);
    controls.target.set(0, 0, 0);
    controls.update();
});

const autoRotateBtn = document.getElementById('autorotate-btn');
const autoRotateBtnText = document.getElementById('autorotate-btn-text');

function updateAutoRotateState() {
    if (autoRotate) {
        autoRotateBtn?.classList.remove('inactive');
        if (autoRotateBtnText) {
            autoRotateBtnText.setAttribute('data-i18n', 'viewer.autorotate_on');
            autoRotateBtnText.textContent = typeof t === 'function' ? t('viewer.autorotate_on') : 'Tự động xoay: Bật';
        }
    } else {
        autoRotateBtn?.classList.add('inactive');
        if (autoRotateBtnText) {
            autoRotateBtnText.setAttribute('data-i18n', 'viewer.autorotate_off');
            autoRotateBtnText.textContent = typeof t === 'function' ? t('viewer.autorotate_off') : 'Tự động xoay: Tắt';
        }
    }
}

autoRotateBtn?.addEventListener('click', () => {
    autoRotate = !autoRotate;
    updateAutoRotateState();
});

// Lazy App Initialization with IntersectionObserver
function startViewerWithLazyLoad() {
    const target = document.getElementById('threejs-container');
    if (!target) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    init3DViewer();
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px 0px' });
        observer.observe(target);
    } else {
        init3DViewer();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startViewerWithLazyLoad);
} else {
    startViewerWithLazyLoad();
}

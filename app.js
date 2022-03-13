let log = console.log
let loader = new THREE.GLTFLoader();
let glb_to_add = [];
let app;

window.addEventListener("load", () => {
    let glb_to_load = [{
            filename: "skybox",
            add: true
        },
        {
            filename: "tree",
            add: false
        }
    ]
    let todo = glb_to_load.length;
    let done = false;
    glb_to_load.forEach(glb => {
        loader.load("./resources/models/" + glb.filename + ".glb", resource => {
            let obj = resource.scene.children

            log("loading " + glb.filename + ".glb", obj);
            glb_to_add.push({
                obj: obj,
                add: glb.add,
                name: glb.filename
            })
            todo--;
        })
    });
    let loading_interval = setInterval(() => {
        if (todo == 0) {
            document.app = app = new App()
            clearInterval(loading_interval)
        }
    }, 100)
})


class App {
    constructor() {
        this.models = {}

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.playerController = new PlayerController();
        this.camera = this.playerController.camera;
        this.initScene();
        this.loadResources();
        this.playerController.init(this)
        this.setSize();
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener("mousedown", e => {
            this.renderer.domElement.requestPointerLock()
        })

        this.render()
        log("App loaded.")
    }

    initScene() {
        this.sun = new THREE.DirectionalLight(0xffcc77, 1.5)
        this.sun.position.set(30, 30, 30);
        this.sun.lookAt(0, 0, 0)
        this.sun.castShadow = true;
        this.sun.shadow.bias = -.0001;
        this.sun.shadow.mapSize.width = 1024 * 1;
        this.sun.shadow.mapSize.height = 1024 * 1;
        this.scene = new THREE.Scene();
        this.scene.add(this.sun)
    }

    loadResources() {
        glb_to_add.forEach(obj => {
            log(obj)
            obj.obj.forEach(o => {
                if (o.type == "Mesh") {
                    o.castShadow = true;
                    o.receiveShadow = true;
                } else {
                    o.castShadow = true;
                    o.receiveShadow = true;
                    o.children.forEach(child => {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    })
                }
                if (obj.add) this.scene.add(o.clone())
                this.models[obj.name] = o
            })
        })
        log("App resources loaded.")
        this.tree = this.models["tree"].clone()
        this.tree.scale.set(.7, .7, .7)
        this.tree.position.y = -4
        this.scene.add(this.tree);
    }

    render() {
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
    }

    setSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix()
    }
}
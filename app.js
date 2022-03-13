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
        },
        {
            filename: "player",
            add: false
        },
        {
            filename: "terrain_test",
            add: true
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
        this.physics = new Physics();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.playerController = new PlayerController();
        this.camera = this.playerController.camera;
        this.initScene();
        this.loadResources();
        this.setSize();
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener("mousedown", e => {
            this.renderer.domElement.requestPointerLock()
        })
        window.addEventListener("resize", this.setSize.bind(this))
        window.addEventListener("blur", this.pause());
        window.addEventListener("focus", this.resume())

        this.clock = new THREE.Clock();
        this.deltaTime = this.clock.getDelta();

        this.playerController.init(this)

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

        this.sounds = []
        for (let i = 0; i < 3; i++) {
            this.sounds.push(new THREE.Mesh(new THREE.SphereGeometry(.1), new THREE.MeshBasicMaterial({
                color: 0xff00ff
            })));
            this.sounds[i].add(new THREE.PositionalAudio(this.playerController.listener));
            this.sounds[i].children[0].setBuffer()
        }
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

                switch (obj.name) {
                    case "terrain_test":
                        let b = new CANNON.Body({
                            shape: this.physics.ObjectToShape(obj.obj[0]),
                            mass: 0,
                            position: obj.obj[0].position,
                        })
                        this.terrain = b;
                        this.physics.world.add(b);
                        break;

                }

                if (obj.add) this.scene.add(o.clone())
                this.models[obj.name] = o
            })
        })
        log("App resources loaded.")
        this.tree = this.models["tree"].clone()
        this.tree.scale.set(.7, .7, .7)
        this.tree.position.y = -4
        /* this.scene.add(this.tree); */
    }

    render() {
        requestAnimationFrame(this.render.bind(this))
        this.deltaTime = this.clock.getDelta();
        this.physics.update(this.deltaTime);
        this.playerController.update()
        this.renderer.render(this.scene, this.camera)
    }

    setSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix()
    }

    pause() {
        log("App paused.")
        this.physics.world.pause
    }
    resume() {
        log("App resumed.")

    }
}
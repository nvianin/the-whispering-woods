let loader = new THREE.GLTFLoader();
let glb_to_add = [];
let app;
let server = "localhost",
    port = "42069"

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
            clearInterval(loading_interval)
            log("App loading...")
            document.app = app = new App()
        }
    }, 100)
})


class App {
    constructor() {
        this.models = {}
        this.physics = new Physics();

        /* this.audioContext = window.audioContext || webkit */

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        this.playerController = new PlayerController();
        this.camera = this.playerController.camera;
        this.initScene();
        this.loadResources();
        this.setSize();

        this.forester = new Forester(this.models.tree, this)

        window.addEventListener("mousedown", e => {
            this.renderer.domElement.requestPointerLock()
        })
        window.addEventListener("resize", this.setSize.bind(this))
        window.addEventListener("blur", this.pause());
        window.addEventListener("focus", this.resume())

        this.clock = new THREE.Clock();
        this.deltaTime = this.clock.getDelta();

        this.playerController.init(this)


        this.socket = io("http://" + server + ":" + port, {
            withCredentials: false,
            extraHeaders: {
                "the-whispering-woods": "abcd"
            }
        })
        this.identity = ""
        this.socket.on("connect", this.connect.bind(this))

        this.socket.on("id_attribution_reply", id => {
            this.identity = id;
            window.localStorage.identity = id;
            log("Received identity attribution, storing");
            this.socket.emit("login", this.identity);
        })
        this.socket.on("db", db => {
            log(db)
        })

        this.render()
        log("App loaded.")
    }

    initScene() {
        this.sun = new THREE.DirectionalLight(0xffcc77, 1.5)
        this.sun.position.set(30, 30, 30);
        this.sun.rotation.set(1.5, 2, 1.5)
        this.sun.castShadow = true;
        this.sun.shadow.bias = -.0001;
        this.sun.shadow.mapSize.width = 1024 * 1;
        this.sun.shadow.mapSize.height = 1024 * 1;
        this.sun.shadow.camera.top = 10;
        this.sun.shadow.camera.bottom = -10;
        this.sun.shadow.camera.left = -10;
        this.sun.shadow.camera.right = 10;
        this.scene = new THREE.Scene();
        this.scene.add(this.sun)

        this.ambient = new THREE.AmbientLight(0x88aaff, 1)
        this.scene.add(this.ambient)

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


                let clone = o.clone();
                if (obj.add) this.scene.add(clone)
                this.models[obj.name] = o

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
                    case "skybox":
                        let sky_tex = obj.obj[0].material.map;
                        /* clone.material.map = null; */
                        log(clone);

                        this.skybox = clone
                        break;

                }
            })
        })
        log("App resources loaded.")
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

    connect() {
        if (window.localStorage.identity) {
            log("found identity in local storage")
            this.identity = window.localStorage.identity;
            this.socket.emit("login", this.identity);
        } else {
            this.socket.emit("id_attribution_request");
            /* this.socket.await("id_attribution_reply") */
            log("sent request for identity")
        }
    }

    postMessage(msg, position) {
        try {
            this.socket.emit("message_write", {
                message: msg,
                position: serializeVector(position)
            })
        } catch (e) {
            console.error("MESSAGE FAILED TO BE WRITTEN!!")
            console.error(e);
        }
    }
}
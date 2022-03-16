class PlayerController {
    constructor() {
        this.position = new THREE.Vector3();
        this.cameraPivot = new THREE.Object3D();
        this.camera = new THREE.PerspectiveCamera(90, innerWidth / innerHeight);
        this.camera.position.z = 5;
        this.cameraPivot.add(this.camera);
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener)
        this.movementForce = new THREE.Vector3();

        /* physics.world.addConstraint(new CANNON.DistanceConstraint(this.bodies[0], this.bodies[1], this.bodies[0].)) */


        window.addEventListener("mousemove", e => {
            this.handleMouseMove(e)
        });
        window.addEventListener("mouseover", e => {
            this.handleMouseMove(e)
        });
        window.addEventListener("keydown", key => {
            log(key.key)
            switch (key.key) {
                case "w":
                    this.movementForce.z = -1;
                    break;
                case "a":
                    this.movementForce.x = -1;
                    break;
                case "s":
                    this.movementForce.z = 1;
                    break;
                case "d":
                    this.movementForce.x = 1;
                    break;

                case " ":
                    this.jump();
                    break;
            }
        })
        window.addEventListener("keyup", key => {
            switch (key.key) {
                case "w":
                    this.movementForce.z = 0;
                    break;
                case "a":
                    this.movementForce.x = 0;
                    break;
                case "s":
                    this.movementForce.z = 0;
                    break;
                case "d":
                    this.movementForce.x = 0;
                    break;
            }
        })
    }

    init(app) {
        app.scene.add(this.cameraPivot)

        this.bodies = [
            new CANNON.Body({
                shape: new CANNON.Sphere(1),
                mass: 1,
                position: new CANNON.Vec3(0, 0, 0)
            }),
            new CANNON.Body({
                shape: new CANNON.Sphere(1),
                mass: 1,
                position: new CANNON.Vec3(0, .5, 0)
            })
        ]
        this.bodies[0].linearDamping = .5
        physics.world.addBody(this.bodies[0])
        /* physics.world.addBody(this.bodies[1]) */
        /* physics.world.addConstraint(new CANNON.DistanceConstraint(this.bodies[0], this.bodies[1], .5)) */

        this.object = app.models["player"].clone()
        this.object.add(this.cameraPivot);
        app.scene.add(this.object)

        this.initialized = true;
    }

    update(sun) {
        if (!this.initialized) return false;
        /* log(this.bodies[0].position) */
        this.object.position.set(this.bodies[0].position.x, this.bodies[0].position.y, this.bodies[0].position.z);
        if (this.bodies[0].sleepState) this.bodies[0].wakeUp()
        this.bodies[0].applyForce(new CANNON.Vec3(this.movementForce.x, this.movementForce.y, this.movementForce.z), new CANNON.Vec3())
        if (this.bodies[0].position.y < -10) this.bodies[0].position.y = 1;
        sun.position.x = this.bodies[0].position.x;
        sun.position.z = this.bodies[0].position.z;
    }

    handleMouseMove(e) {
        this.cameraPivot.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -e.movementX * .001);
        this.cameraPivot.rotateOnAxis(new THREE.Vector3(1, 0, 0), -e.movementY * .001);
    }

    jump() {
        log("jump")
        raycaster.set(this.bodies[0].position, new THREE.Vector3(0, -1, 0));
        let i = raycaster.intersectObjects(app.scene.children)
        /* app.scene.add(new THREE.ArrowHelper(raycaster.ray.origin, raycaster.ray.direction, 300, new THREE.Color(0xff00ff))) */
        if (i.length > 0 && i[0].distance < 1) {
            this.bodies[0].applyImpulse(new CANNON.Vec3(0, 5, 0), new CANNON.Vec3())
        }

    }

}
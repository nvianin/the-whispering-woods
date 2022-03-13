class PlayerController {
    constructor() {
        this.position = new THREE.Vector3();
        this.cameraPivot = new THREE.Object3D();
        this.camera = new THREE.PerspectiveCamera(90, innerWidth / innerHeight);
        this.camera.position.z = 5;
        this.cameraPivot.add(this.camera);

        window.addEventListener("mousemove", e => {
            this.handleMouseMove(e)
        });
        window.addEventListener("mouseover", e => {
            this.handleMouseMove(e)
        });
    }

    init(app) {
        app.scene.add(this.cameraPivot)
    }

    update() {

    }

    handleMouseMove(e) {
        this.cameraPivot.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -e.movementX * .001);
        this.cameraPivot.rotateOnAxis(new THREE.Vector3(1, 0, 0), -e.movementY * .001);
    }

}
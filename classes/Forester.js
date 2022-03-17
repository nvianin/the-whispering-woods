class Forester {
    constructor(tree_obj, app) {
        this.app = app;
        this.tree_obj = tree_obj;
        /* log(this.tree_obj) */
        this.trees = [];

        for (let i = 0; i < 5; i++) {
            let t = new Tree(new THREE.Vector3(Math.random() * 4, Math.random() * 4, Math.random() * 4), this.tree_obj);
            raycaster.set(t.obj.position.clone().add(new THREE.Vector3(0, 1, 0)), new THREE.Vector3(0, -1, 0));
            let i = raycaster.intersectObjects(this.app.scene.children)
            log(i)
            this.trees.push(t);
            this.app.scene.add(t.obj)
        }
    }
}
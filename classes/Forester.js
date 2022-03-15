class Forester {
    constructor(tree_obj, app) {
        this.app = app;
        this.tree_obj = tree_obj;
        log(this.tree_obj)
        this.trees = [];

        for (let i = 0; i < 5; i++) {
            let t = new Tree(new THREE.Vector3(), this.tree_obj);
            this.trees.push(t);
            log(app)
        }
    }
}
class Forester {
    constructor(tree_obj, scene) {
        this.tree_obj = tree_obj;
        this.trees = [];

        for (let i = 0; i < 5; i++) {
            let t = new Tree(new THREE.Vector3(), this.tree_obj);
            this.trees.push(t);
            log(app)
        }
    }
}
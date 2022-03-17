class Tree {
    constructor(position, obj) {
        /* log(obj) */
        this.obj = obj.clone();
        this.obj.scale.set(.5, .5, .5)
        this.obj.position.copy(position);
    }
}
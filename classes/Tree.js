class Tree {
    constructor(position, obj) {
        log(obj)
        this.obj = obj.clone();
        this.obj.position.copy(position);
    }
}
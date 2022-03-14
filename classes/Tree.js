class Tree {
    constructor(position, app) {
        this.app = app;
        this.obj = this.app.models.tree.clone();
        this.obj.position.copy(position);
    }
}
let physics;

class Physics {
    constructor() {
        this.world = new CANNON.World();
        this.world.allowSleep = true;
        this.world.iterations = 10;
        /* this.world.solver.iterations = 10; */
        this.world.gravity.set(0, -9.81, 0);
        document.physics = physics = this;
    }

    update(dt) {
        dt = Math.Clamp(dt, 0.001, 0.032);
        this.world.step(dt)
    }

    ObjectToShape(obj) {
        log(obj)
        let verts = obj.geometry.attributes.position.array;
        let vertices = [];
        let indices = [];
        let sc = .75;
        for (let i = 0; i < verts.length; i += 9) {
            vertices.push(verts[i] * sc)
            vertices.push(verts[i + 1] * sc)
            vertices.push(verts[i + 2] * sc)
            vertices.push(verts[i + 3] * sc)
            vertices.push(verts[i + 4] * sc)
            vertices.push(verts[i + 5] * sc)
            vertices.push(verts[i + 6] * sc)
            vertices.push(verts[i + 7] * sc)
            vertices.push(verts[i + 8] * sc)
            indices.push(i)
            indices.push(i + 3)
            indices.push(i + 6)
        }

        return new CANNON.Trimesh(vertices, indices)
    }
}
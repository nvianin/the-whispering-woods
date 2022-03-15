let log = console.log
Math.Clamp = (v, min, max) => {
    return Math.min(Math.max(v, min), max);
}
Math.Lerp = (start, end, amt) => {
    return (1 - amt) * start + amt * end
}
const serializeVector = (v) => {
    return {
        x: v.x,
        y: v.y,
        z: v.z
    }
}
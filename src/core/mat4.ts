
const identity : () => Float32Array = () => {
    const matrix = new Float32Array(16);
    matrix[0] = 1; matrix[5] = 1; matrix[10] = 1; matrix[15] = 1;
    return matrix;
}

export {identity}
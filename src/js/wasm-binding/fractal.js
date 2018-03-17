class FractalModule {
    constructor (wasm) {
        this.memory = wasm.memory;
        this.init = wasm.fractal_init;
        this.vec_len = wasm.fractal_vec_len;
        this.generate = wasm.fractal_generate;
        this.free_vec = wasm.fractal_free_vec;
        this.get_image = wasm.fractal_get_image;
        this.init();
    }
}

export default FractalModule;

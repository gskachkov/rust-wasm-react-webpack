const memorySize = 16 * 8 * 1024 * 1024;

const fileLoader = (url, cb) => {
    fetch(url, { mode: 'no-cors' })
        .then(response => response.arrayBuffer())
        .then(cb);
};

class x86Loader {
    constructor (wasm) {
        this.memory = wasm.memory;
        this.init = wasm.init;
        this.emulate = wasm.emulate;
        this.alloc_bin_data = wasm.alloc_bin_data;
    }

    load() {
        fileLoader('/assets/bins/helloworld.bin', buffer => { this.bin = buffer });
        fileLoader('/assets/linux-3/bios/seabios.bin', buffer => { this.seabios = buffer; });
        fileLoader('/assets/linux-3/bios/vgabios.bin', buffer => { this.vgabios = buffer; });
        fileLoader('/assets/linux-3/images/linux3.iso', buffer => { this.iso = buffer; });
    }

    run() {
        // Load seabios to memory 
        // Load vgabios to memory
        // Load iso to memory
        const len = this.seabios.byteLength;
        const seabiosPtr = this.alloc_bin_data(len);
        let buffer = new Uint8Array(this.memory.buffer);
        // buffer.set(this.bin);
        for (let i = 0; i < len; i++) {
            buffer[i] = this.seabios[i];
        }
        this.emulate(seabiosPtr, len);
    }
}

export default x86Loader;
let gpr = null;

const updateCanvas = (ctx, data) => {
    ctx.putImageData(data, 0, 0);
};

const drawFractalActionFactory = (module, ctx, xSize, ySize) => (step, maxStep) => {
    const action = value => {
        console.log('value:', value);
        console.time('calc');
        console.time('full-without-canvas');
        console.time('full');
        if (gpr !== null) {
            module.free_vec(gpr);
        }
        gpr = module.generate(xSize, ySize, value);
        console.timeEnd('calc');
        const len = module.vec_len(gpr);
        const bitmap = new Uint8ClampedArray (module.memory.buffer, gpr, len);
        var data = new ImageData(bitmap, xSize, xSize);
        console.timeEnd('full-without-canvas');
        updateCanvas(ctx, data);
        console.timeEnd('full');
    };

    const performActions = value => {
        if (value > maxStep) return;
    
        action(value)
        setTimeout(() => performActions(value + 1), 150);
    };

    performActions(step);
};

const downloadImageActionFactory = (module, xSize, ySize) => value => {
    if (gpr !== null) {
        module.free_vec(gpr);
    }

    gpr = module.get_image(xSize, ySize, value);
    const len = module.vec_len(gpr);
    const bitmap = new Uint8Array (module.memory.buffer, gpr, len);

    var saveByteArray = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, name) {
            var blob = new Blob(data, {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());
    
    saveByteArray([bitmap], 'example.png');
}

export { drawFractalActionFactory, downloadImageActionFactory };

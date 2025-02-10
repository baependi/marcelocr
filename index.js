// Modified index.js with verbose logging
var Module = {
    preRun: [],
    postRun: [],
    print: function(text) {
        console.log('[stdout]', text);
    },
    printErr: function(text) {
        console.error('[stderr]', text);
    },
    canvas: (function() {
        var canvas = document.getElementById('canvas');
        if (!canvas) {
            console.error('Canvas element not found!');
        } else {
            console.log('Canvas element found:', canvas);
        }
        return canvas;
    })(),
    setStatus: function(text) {
        console.log('[STATUS]', text);
        var statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.innerHTML = text;
        }
    },
    monitorRunDependencies: function(left) {
        console.log('[Run Dependencies]', left, 'remaining');
    },
    onRuntimeInitialized: function() {
        console.log('WebAssembly runtime initialized successfully!');
    },
    locateFile: function(path) {
        console.log('[File Requested]', path);
        if (path.endsWith('.wasm')) {
            console.log('Returning WebAssembly file path: "index.wasm"');
            return 'index.wasm';
        }
        return path;
    },
    onAbort: function() {
        console.error('WebAssembly execution aborted!');
    }
};

console.log('Loading WebAssembly module...');
var wasmLoadingStart = performance.now();

fetch(Module.locateFile('index.wasm'))
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch WASM: ' + response.statusText);
        }
        console.log('WASM file fetched successfully.');
        return response.arrayBuffer();
    })
    .then(bytes => {
        console.log('WASM file size:', bytes.byteLength, 'bytes');
        return WebAssembly.instantiate(bytes, {});
    })
    .then(result => {
        console.log('WebAssembly instantiated successfully!');
        console.log('WASM Exports:', result.instance.exports);
        var wasmLoadingEnd = performance.now();
        console.log('WebAssembly loaded in', (wasmLoadingEnd - wasmLoadingStart).toFixed(2), 'ms');
    })
    .catch(err => {
        console.error('Error loading WebAssembly:', err);
    });

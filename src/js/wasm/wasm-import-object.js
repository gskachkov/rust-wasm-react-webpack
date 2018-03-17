export default {
    "global": {},
    "env": {
      memory: new WebAssembly.Memory({initial: 10, limit: 100}),
      table: new WebAssembly.Table({initial: 0, element: 'anyfunc'}),
      "Math_hypot": Math.hypot,
      "exp2f": Math.exp,
      "expf": Math.exp,
      "powf": Math.pow,
      "sinf": Math.sin,
      "round": Math.round,
      "roundf": Math.round
    }
};
let wasmInstance = null;

const importObject = {
  env: {
    memory: new WebAssembly.Memory({ initial: 1 }),
  },
};

/* importObject is an object that provides any necessary imports for the WebAssembly module. 
Here env is an environment object where you can define imports for the WebAssembly code.
memory is a new WebAssembly.Memory instance with an initial size of 1 page (64 KB). 
This can be accessed by the WebAssembly module if it requires memory. */

// Load the WebAssembly module
fetch("addFunction.wasm")
  .then((response) => response.arrayBuffer())
  .then((bytes) => WebAssembly.instantiate(bytes, importObject))
  .then((obj) => {
    wasmInstance = obj.instance;
    console.log("WASM loaded successfully");
    
   // console.log("Available exports:", Object.keys(wasmInstance.exports));
  })
  .catch((error) => {
    console.error("Error loading WASM:", error);
  });

function calculate() {
  if (!wasmInstance) {
    console.error("WASM not loaded yet");
    return;
  }

  const num1 = parseInt(document.getElementById("num1").value) || 0;
  const num2 = parseInt(document.getElementById("num2").value) || 0;

  try {
    const result = wasmInstance.exports.add(num1, num2);
    document.getElementById("result").innerText = result;
  } catch (error) {
    console.error("Error calling add function:", error);
    document.getElementById("result").innerText = "Error: " + error.message;
  }
}

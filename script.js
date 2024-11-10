 let wasmInstance = null;
 
 /* importObject is an object that provides any necessary imports for the WebAssembly module. 
 Here env is an environment object where you can define imports for the WebAssembly code.
 memory is a new WebAssembly.Memory instance with an initial size of 1 page (64 KB). 
 This can be accessed by the WebAssembly module if it requires memory. */


const importObject = {
  env: {
    memory: new WebAssembly.Memory({ initial: 1 }),
  },
};

// Load the WebAssembly module
async function loadWasm() {
  try {
    console.log("Fetching the WebAssembly module...");
    const response = await fetch("addFunction.wasm");
    const bytes = await response.arrayBuffer();
    console.log("WebAssembly module fetched successfully.");

    console.log("Instantiating the WebAssembly module...");
    const { instance } = await WebAssembly.instantiate(bytes, importObject);
    wasmInstance = instance;
    console.log("WebAssembly module instantiated successfully.");

    // Set up the add function globally
    if (wasmInstance.exports.add) {
      window.add = wasmInstance.exports.add;
      console.log("WASM loaded successfully. You can now use add(num1, num2) in the console.");
    } else {
      console.error("The 'add' function was not found in WASM exports.");
    }
  } catch (error) {
    console.error("Error loading WASM:", error);
  }
}

// Define the calculate function for DOM usage
function calculate() {
  if (!wasmInstance) {
    console.error("WASM not loaded yet");
    return;
  }

  const num1 = parseInt(document.getElementById("num1").value) || 0;
  const num2 = parseInt(document.getElementById("num2").value) || 0;

  try {
    const result = window.add(num1, num2);
    document.getElementById("result").innerText = result;
  } catch (error) {
    console.error("Error calling add function:", error);
    document.getElementById("result").innerText = "Error: " + error.message;
  }
}

// Load the WebAssembly module when the page loads
window.onload = loadWasm;

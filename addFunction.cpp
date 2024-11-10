#include<emscripten/emscripten.h>

/*The extern "C" keyword in your C++ code is used to prevent name mangling by the C++ compiler, which allows the function 
to be accessible from WebAssembly and other languages that expect a C-compatible interface.
*/


extern "C" {
    // Export the add function
    EMSCRIPTEN_KEEPALIVE
    int add(int a, int b) {
        return a + b;
    }
}

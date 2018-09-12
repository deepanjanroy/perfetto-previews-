var perfetto = (function () {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var trace_processor = createCommonjsModule(function (module, exports) {
	var Module = function(Module) {
	  Module = Module || {};

	// The Module object: Our interface to the outside world. We import
	// and export values on it. There are various ways Module can be used:
	// 1. Not defined. We create it here
	// 2. A function parameter, function(Module) { ..generated code.. }
	// 3. pre-run appended it, var Module = {}; ..generated code..
	// 4. External script tag defines var Module.
	// We need to check if Module already exists (e.g. case 3 above).
	// Substitution will be replaced with actual code on later stage of the build,
	// this way Closure Compiler will not mangle it (e.g. case 4. above).
	// Note that if you want to run closure, and also to use Module
	// after the generated code, you will need to define   var Module = {};
	// before the code. Then that object will be used in the code, and you
	// can continue to use Module afterwards as well.
	var Module = typeof Module !== 'undefined' ? Module : {};

	// --pre-jses are emitted after the Module integration code, so that they can
	// refer to Module (if they choose; they can also define Module)
	// {{PRE_JSES}}

	// Sometimes an existing Module object exists with properties
	// meant to overwrite the default module functionality. Here
	// we collect those properties and reapply _after_ we configure
	// the current environment's defaults to avoid having to be so
	// defensive during initialization.
	var moduleOverrides = {};
	var key;
	for (key in Module) {
	  if (Module.hasOwnProperty(key)) {
	    moduleOverrides[key] = Module[key];
	  }
	}

	Module['arguments'] = [];
	Module['thisProgram'] = './this.program';
	Module['quit'] = function(status, toThrow) {
	  throw toThrow;
	};
	Module['preRun'] = [];
	Module['postRun'] = [];

	// The environment setup code below is customized to use Module.
	// *** Environment setup code ***
	var ENVIRONMENT_IS_WEB = false;
	var ENVIRONMENT_IS_WORKER = false;
	var ENVIRONMENT_IS_NODE = false;
	var ENVIRONMENT_IS_SHELL = false;

	// Three configurations we can be running in:
	// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
	// 2) We could be the application main() thread proxied to worker. (with Emscripten -s PROXY_TO_WORKER=1) (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
	// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)

	if (Module['ENVIRONMENT']) {
	  if (Module['ENVIRONMENT'] === 'WEB') {
	    ENVIRONMENT_IS_WEB = true;
	  } else if (Module['ENVIRONMENT'] === 'WORKER') {
	    ENVIRONMENT_IS_WORKER = true;
	  } else if (Module['ENVIRONMENT'] === 'NODE') {
	    ENVIRONMENT_IS_NODE = true;
	  } else if (Module['ENVIRONMENT'] === 'SHELL') {
	    ENVIRONMENT_IS_SHELL = true;
	  } else {
	    throw new Error('Module[\'ENVIRONMENT\'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.');
	  }
	} else {
	  ENVIRONMENT_IS_WEB = typeof window === 'object';
	  ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
	  ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function' && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
	  ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
	}


	if (ENVIRONMENT_IS_NODE) {
	  // Expose functionality in the same simple way that the shells work
	  // Note that we pollute the global namespace here, otherwise we break in node
	  var nodeFS;
	  var nodePath;

	  Module['read'] = function shell_read(filename, binary) {
	    var ret;
	      if (!nodeFS) nodeFS = require('fs');
	      if (!nodePath) nodePath = require('path');
	      filename = nodePath['normalize'](filename);
	      ret = nodeFS['readFileSync'](filename);
	    return binary ? ret : ret.toString();
	  };

	  Module['readBinary'] = function readBinary(filename) {
	    var ret = Module['read'](filename, true);
	    if (!ret.buffer) {
	      ret = new Uint8Array(ret);
	    }
	    assert(ret.buffer);
	    return ret;
	  };

	  if (process['argv'].length > 1) {
	    Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');
	  }

	  Module['arguments'] = process['argv'].slice(2);

	  // MODULARIZE will export the module in the proper place outside, we don't need to export here

	  process['on']('uncaughtException', function(ex) {
	    // suppress ExitStatus exceptions from showing an error
	    if (!(ex instanceof ExitStatus)) {
	      throw ex;
	    }
	  });
	  // Currently node will swallow unhandled rejections, but this behavior is
	  // deprecated, and in the future it will exit with error status.
	  process['on']('unhandledRejection', function(reason, p) {
	    Module['printErr']('node.js exiting due to unhandled promise rejection');
	    process['exit'](1);
	  });

	  Module['inspect'] = function () { return '[Emscripten Module object]'; };
	}
	else if (ENVIRONMENT_IS_SHELL) {
	  if (typeof read != 'undefined') {
	    Module['read'] = function shell_read(f) {
	      return read(f);
	    };
	  }

	  Module['readBinary'] = function readBinary(f) {
	    var data;
	    if (typeof readbuffer === 'function') {
	      return new Uint8Array(readbuffer(f));
	    }
	    data = read(f, 'binary');
	    assert(typeof data === 'object');
	    return data;
	  };

	  if (typeof scriptArgs != 'undefined') {
	    Module['arguments'] = scriptArgs;
	  } else if (typeof arguments != 'undefined') {
	    Module['arguments'] = arguments;
	  }

	  if (typeof quit === 'function') {
	    Module['quit'] = function(status, toThrow) {
	      quit(status);
	    };
	  }
	}
	else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
	  Module['read'] = function shell_read(url) {
	      var xhr = new XMLHttpRequest();
	      xhr.open('GET', url, false);
	      xhr.send(null);
	      return xhr.responseText;
	  };

	  if (ENVIRONMENT_IS_WORKER) {
	    Module['readBinary'] = function readBinary(url) {
	        var xhr = new XMLHttpRequest();
	        xhr.open('GET', url, false);
	        xhr.responseType = 'arraybuffer';
	        xhr.send(null);
	        return new Uint8Array(xhr.response);
	    };
	  }

	  Module['readAsync'] = function readAsync(url, onload, onerror) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', url, true);
	    xhr.responseType = 'arraybuffer';
	    xhr.onload = function xhr_onload() {
	      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
	        onload(xhr.response);
	        return;
	      }
	      onerror();
	    };
	    xhr.onerror = onerror;
	    xhr.send(null);
	  };

	  Module['setWindowTitle'] = function(title) { document.title = title; };
	}
	else {
	  // Unreachable because SHELL is dependent on the others
	  throw new Error('unknown runtime environment');
	}

	// console.log is checked first, as 'print' on the web will open a print dialogue
	// printErr is preferable to console.warn (works better in shells)
	// bind(console) is necessary to fix IE/Edge closed dev tools panel behavior.
	Module['print'] = typeof console !== 'undefined' ? console.log.bind(console) : (typeof print !== 'undefined' ? print : null);
	Module['printErr'] = typeof printErr !== 'undefined' ? printErr : ((typeof console !== 'undefined' && console.warn.bind(console)) || Module['print']);

	// *** Environment setup code ***

	// Closure helpers
	Module.print = Module['print'];
	Module.printErr = Module['printErr'];

	// Merge back in the overrides
	for (key in moduleOverrides) {
	  if (moduleOverrides.hasOwnProperty(key)) {
	    Module[key] = moduleOverrides[key];
	  }
	}
	// Free the object hierarchy contained in the overrides, this lets the GC
	// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
	moduleOverrides = undefined;



	// {{PREAMBLE_ADDITIONS}}

	var STACK_ALIGN = 16;

	// stack management, and other functionality that is provided by the compiled code,
	// should not be used before it is ready
	stackSave = stackRestore = stackAlloc = setTempRet0 = getTempRet0 = function() {
	  abort('cannot use the stack before compiled code is ready to run, and has provided stack access');
	};

	function staticAlloc(size) {
	  assert(!staticSealed);
	  var ret = STATICTOP;
	  STATICTOP = (STATICTOP + size + 15) & -16;
	  return ret;
	}

	function dynamicAlloc(size) {
	  assert(DYNAMICTOP_PTR);
	  var ret = HEAP32[DYNAMICTOP_PTR>>2];
	  var end = (ret + size + 15) & -16;
	  HEAP32[DYNAMICTOP_PTR>>2] = end;
	  if (end >= TOTAL_MEMORY) {
	    var success = enlargeMemory();
	    if (!success) {
	      HEAP32[DYNAMICTOP_PTR>>2] = ret;
	      return 0;
	    }
	  }
	  return ret;
	}

	function alignMemory(size, factor) {
	  if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
	  var ret = size = Math.ceil(size / factor) * factor;
	  return ret;
	}

	function getNativeTypeSize(type) {
	  switch (type) {
	    case 'i1': case 'i8': return 1;
	    case 'i16': return 2;
	    case 'i32': return 4;
	    case 'i64': return 8;
	    case 'float': return 4;
	    case 'double': return 8;
	    default: {
	      if (type[type.length-1] === '*') {
	        return 4; // A pointer
	      } else if (type[0] === 'i') {
	        var bits = parseInt(type.substr(1));
	        assert(bits % 8 === 0);
	        return bits / 8;
	      } else {
	        return 0;
	      }
	    }
	  }
	}

	function warnOnce(text) {
	  if (!warnOnce.shown) warnOnce.shown = {};
	  if (!warnOnce.shown[text]) {
	    warnOnce.shown[text] = 1;
	    Module.printErr(text);
	  }
	}



	var jsCallStartIndex = 1;
	var functionPointers = new Array(32);

	// 'sig' parameter is only used on LLVM wasm backend
	function addFunction(func, sig) {
	  if (typeof sig === 'undefined') {
	    Module.printErr('Warning: addFunction: Provide a wasm function signature ' +
	                    'string as a second argument');
	  }
	  var base = 0;
	  for (var i = base; i < base + 32; i++) {
	    if (!functionPointers[i]) {
	      functionPointers[i] = func;
	      return jsCallStartIndex + i;
	    }
	  }
	  throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
	}

	// The address globals begin at. Very low in memory, for code size and optimization opportunities.
	// Above 0 is static memory, starting with globals.
	// Then the stack.
	// Then 'dynamic' memory for sbrk.
	var GLOBAL_BASE = 1024;



	// === Preamble library stuff ===

	// Documentation for the public APIs defined in this file must be updated in:
	//    site/source/docs/api_reference/preamble.js.rst
	// A prebuilt local version of the documentation is available at:
	//    site/build/text/docs/api_reference/preamble.js.txt
	// You can also build docs locally as HTML or other formats in site/
	// An online HTML version (which may be of a different version of Emscripten)
	//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html



	//========================================
	// Runtime essentials
	//========================================

	var ABORT = 0; // whether we are quitting the application. no code should run after this. set in exit() and abort()

	/** @type {function(*, string=)} */
	function assert(condition, text) {
	  if (!condition) {
	    abort('Assertion failed: ' + text);
	  }
	}

	// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
	function getCFunc(ident) {
	  var func = Module['_' + ident]; // closure exported function
	  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
	  return func;
	}

	var JSfuncs = {
	  // Helpers for cwrap -- it can't refer to Runtime directly because it might
	  // be renamed by closure, instead it calls JSfuncs['stackSave'].body to find
	  // out what the minified function name is.
	  'stackSave': function() {
	    stackSave();
	  },
	  'stackRestore': function() {
	    stackRestore();
	  },
	  // type conversion from js to c
	  'arrayToC' : function(arr) {
	    var ret = stackAlloc(arr.length);
	    writeArrayToMemory(arr, ret);
	    return ret;
	  },
	  'stringToC' : function(str) {
	    var ret = 0;
	    if (str !== null && str !== undefined && str !== 0) { // null string
	      // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
	      var len = (str.length << 2) + 1;
	      ret = stackAlloc(len);
	      stringToUTF8(str, ret, len);
	    }
	    return ret;
	  }
	};

	// For fast lookup of conversion functions
	var toC = {
	  'string': JSfuncs['stringToC'], 'array': JSfuncs['arrayToC']
	};

	// C calling interface.
	function ccall (ident, returnType, argTypes, args, opts) {
	  var func = getCFunc(ident);
	  var cArgs = [];
	  var stack = 0;
	  assert(returnType !== 'array', 'Return type should not be "array".');
	  if (args) {
	    for (var i = 0; i < args.length; i++) {
	      var converter = toC[argTypes[i]];
	      if (converter) {
	        if (stack === 0) stack = stackSave();
	        cArgs[i] = converter(args[i]);
	      } else {
	        cArgs[i] = args[i];
	      }
	    }
	  }
	  var ret = func.apply(null, cArgs);
	  if (returnType === 'string') ret = Pointer_stringify(ret);
	  else if (returnType === 'boolean') ret = Boolean(ret);
	  if (stack !== 0) {
	    stackRestore(stack);
	  }
	  return ret;
	}

	function cwrap (ident, returnType, argTypes) {
	  argTypes = argTypes || [];
	  var cfunc = getCFunc(ident);
	  // When the function takes numbers and returns a number, we can just return
	  // the original function
	  var numericArgs = argTypes.every(function(type){ return type === 'number'});
	  var numericRet = returnType !== 'string';
	  if (numericRet && numericArgs) {
	    return cfunc;
	  }
	  return function() {
	    return ccall(ident, returnType, argTypes, arguments);
	  }
	}

	/** @type {function(number, number, string, boolean=)} */
	function setValue(ptr, value, type, noSafe) {
	  type = type || 'i8';
	  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
	    switch(type) {
	      case 'i1': HEAP8[((ptr)>>0)]=value; break;
	      case 'i8': HEAP8[((ptr)>>0)]=value; break;
	      case 'i16': HEAP16[((ptr)>>1)]=value; break;
	      case 'i32': HEAP32[((ptr)>>2)]=value; break;
	      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
	      case 'float': HEAPF32[((ptr)>>2)]=value; break;
	      case 'double': HEAPF64[((ptr)>>3)]=value; break;
	      default: abort('invalid type for setValue: ' + type);
	    }
	}

	var ALLOC_NORMAL = 0; // Tries to use _malloc()
	var ALLOC_STATIC = 2; // Cannot be freed
	var ALLOC_NONE = 4; // Do not allocate

	// allocate(): This is for internal use. You can use it yourself as well, but the interface
	//             is a little tricky (see docs right below). The reason is that it is optimized
	//             for multiple syntaxes to save space in generated code. So you should
	//             normally not use allocate(), and instead allocate memory using _malloc(),
	//             initialize it with setValue(), and so forth.
	// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
	//        in *bytes* (note that this is sometimes confusing: the next parameter does not
	//        affect this!)
	// @types: Either an array of types, one for each byte (or 0 if no type at that position),
	//         or a single type which is used for the entire block. This only matters if there
	//         is initial data - if @slab is a number, then this does not matter at all and is
	//         ignored.
	// @allocator: How to allocate memory, see ALLOC_*
	/** @type {function((TypedArray|Array<number>|number), string, number, number=)} */
	function allocate(slab, types, allocator, ptr) {
	  var zeroinit, size;
	  if (typeof slab === 'number') {
	    zeroinit = true;
	    size = slab;
	  } else {
	    zeroinit = false;
	    size = slab.length;
	  }

	  var singleType = typeof types === 'string' ? types : null;

	  var ret;
	  if (allocator == ALLOC_NONE) {
	    ret = ptr;
	  } else {
	    ret = [typeof _malloc === 'function' ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
	  }

	  if (zeroinit) {
	    var stop;
	    ptr = ret;
	    assert((ret & 3) == 0);
	    stop = ret + (size & ~3);
	    for (; ptr < stop; ptr += 4) {
	      HEAP32[((ptr)>>2)]=0;
	    }
	    stop = ret + size;
	    while (ptr < stop) {
	      HEAP8[((ptr++)>>0)]=0;
	    }
	    return ret;
	  }

	  if (singleType === 'i8') {
	    if (slab.subarray || slab.slice) {
	      HEAPU8.set(/** @type {!Uint8Array} */ (slab), ret);
	    } else {
	      HEAPU8.set(new Uint8Array(slab), ret);
	    }
	    return ret;
	  }

	  var i = 0, type, typeSize, previousType;
	  while (i < size) {
	    var curr = slab[i];

	    type = singleType || types[i];
	    if (type === 0) {
	      i++;
	      continue;
	    }
	    assert(type, 'Must know what type to store in allocate!');

	    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

	    setValue(ret+i, curr, type);

	    // no need to look up size unless type changes, so cache it
	    if (previousType !== type) {
	      typeSize = getNativeTypeSize(type);
	      previousType = type;
	    }
	    i += typeSize;
	  }

	  return ret;
	}

	/** @type {function(number, number=)} */
	function Pointer_stringify(ptr, length) {
	  if (length === 0 || !ptr) return '';
	  // TODO: use TextDecoder
	  // Find the length, and check for UTF while doing so
	  var hasUtf = 0;
	  var t;
	  var i = 0;
	  while (1) {
	    assert(ptr + i < TOTAL_MEMORY);
	    t = HEAPU8[(((ptr)+(i))>>0)];
	    hasUtf |= t;
	    if (t == 0 && !length) break;
	    i++;
	    if (length && i == length) break;
	  }
	  if (!length) length = i;

	  var ret = '';

	  if (hasUtf < 128) {
	    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
	    var curr;
	    while (length > 0) {
	      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
	      ret = ret ? ret + curr : curr;
	      ptr += MAX_CHUNK;
	      length -= MAX_CHUNK;
	    }
	    return ret;
	  }
	  return UTF8ToString(ptr);
	}

	// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
	// a copy of that string as a Javascript String object.

	var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;
	function UTF8ArrayToString(u8Array, idx) {
	  var endPtr = idx;
	  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
	  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
	  while (u8Array[endPtr]) ++endPtr;

	  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
	    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
	  } else {
	    var u0, u1, u2, u3, u4, u5;

	    var str = '';
	    while (1) {
	      // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
	      u0 = u8Array[idx++];
	      if (!u0) return str;
	      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
	      u1 = u8Array[idx++] & 63;
	      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
	      u2 = u8Array[idx++] & 63;
	      if ((u0 & 0xF0) == 0xE0) {
	        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
	      } else {
	        u3 = u8Array[idx++] & 63;
	        if ((u0 & 0xF8) == 0xF0) {
	          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
	        } else {
	          u4 = u8Array[idx++] & 63;
	          if ((u0 & 0xFC) == 0xF8) {
	            u0 = ((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4;
	          } else {
	            u5 = u8Array[idx++] & 63;
	            u0 = ((u0 & 1) << 30) | (u1 << 24) | (u2 << 18) | (u3 << 12) | (u4 << 6) | u5;
	          }
	        }
	      }
	      if (u0 < 0x10000) {
	        str += String.fromCharCode(u0);
	      } else {
	        var ch = u0 - 0x10000;
	        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
	      }
	    }
	  }
	}

	// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns
	// a copy of that string as a Javascript String object.

	function UTF8ToString(ptr) {
	  return UTF8ArrayToString(HEAPU8,ptr);
	}

	// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
	// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
	// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
	// Parameters:
	//   str: the Javascript string to copy.
	//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
	//   outIdx: The starting offset in the array to begin the copying.
	//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
	//                    terminator, i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
	//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
	// Returns the number of bytes written, EXCLUDING the null terminator.

	function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
	  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
	    return 0;

	  var startIdx = outIdx;
	  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
	  for (var i = 0; i < str.length; ++i) {
	    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
	    // See http://unicode.org/faq/utf_bom.html#utf16-3
	    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
	    var u = str.charCodeAt(i); // possibly a lead surrogate
	    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
	    if (u <= 0x7F) {
	      if (outIdx >= endIdx) break;
	      outU8Array[outIdx++] = u;
	    } else if (u <= 0x7FF) {
	      if (outIdx + 1 >= endIdx) break;
	      outU8Array[outIdx++] = 0xC0 | (u >> 6);
	      outU8Array[outIdx++] = 0x80 | (u & 63);
	    } else if (u <= 0xFFFF) {
	      if (outIdx + 2 >= endIdx) break;
	      outU8Array[outIdx++] = 0xE0 | (u >> 12);
	      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
	      outU8Array[outIdx++] = 0x80 | (u & 63);
	    } else if (u <= 0x1FFFFF) {
	      if (outIdx + 3 >= endIdx) break;
	      outU8Array[outIdx++] = 0xF0 | (u >> 18);
	      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
	      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
	      outU8Array[outIdx++] = 0x80 | (u & 63);
	    } else if (u <= 0x3FFFFFF) {
	      if (outIdx + 4 >= endIdx) break;
	      outU8Array[outIdx++] = 0xF8 | (u >> 24);
	      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
	      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
	      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
	      outU8Array[outIdx++] = 0x80 | (u & 63);
	    } else {
	      if (outIdx + 5 >= endIdx) break;
	      outU8Array[outIdx++] = 0xFC | (u >> 30);
	      outU8Array[outIdx++] = 0x80 | ((u >> 24) & 63);
	      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
	      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
	      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
	      outU8Array[outIdx++] = 0x80 | (u & 63);
	    }
	  }
	  // Null-terminate the pointer to the buffer.
	  outU8Array[outIdx] = 0;
	  return outIdx - startIdx;
	}

	// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
	// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
	// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
	// Returns the number of bytes written, EXCLUDING the null terminator.

	function stringToUTF8(str, outPtr, maxBytesToWrite) {
	  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
	  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
	}

	// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.

	function lengthBytesUTF8(str) {
	  var len = 0;
	  for (var i = 0; i < str.length; ++i) {
	    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
	    // See http://unicode.org/faq/utf_bom.html#utf16-3
	    var u = str.charCodeAt(i); // possibly a lead surrogate
	    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
	    if (u <= 0x7F) {
	      ++len;
	    } else if (u <= 0x7FF) {
	      len += 2;
	    } else if (u <= 0xFFFF) {
	      len += 3;
	    } else if (u <= 0x1FFFFF) {
	      len += 4;
	    } else if (u <= 0x3FFFFFF) {
	      len += 5;
	    } else {
	      len += 6;
	    }
	  }
	  return len;
	}

	// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
	// a copy of that string as a Javascript String object.

	var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

	// Allocate heap space for a JS string, and write it there.
	// It is the responsibility of the caller to free() that memory.
	function allocateUTF8(str) {
	  var size = lengthBytesUTF8(str) + 1;
	  var ret = _malloc(size);
	  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
	  return ret;
	}

	function demangle(func) {
	  warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
	  return func;
	}

	function demangleAll(text) {
	  var regex =
	    /__Z[\w\d_]+/g;
	  return text.replace(regex,
	    function(x) {
	      var y = demangle(x);
	      return x === y ? x : (x + ' [' + y + ']');
	    });
	}

	function jsStackTrace() {
	  var err = new Error();
	  if (!err.stack) {
	    // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
	    // so try that as a special-case.
	    try {
	      throw new Error(0);
	    } catch(e) {
	      err = e;
	    }
	    if (!err.stack) {
	      return '(no stack trace available)';
	    }
	  }
	  return err.stack.toString();
	}

	function stackTrace() {
	  var js = jsStackTrace();
	  if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
	  return demangleAll(js);
	}

	// Memory management

	var PAGE_SIZE = 16384;
	var WASM_PAGE_SIZE = 65536;
	var ASMJS_PAGE_SIZE = 16777216;

	function alignUp(x, multiple) {
	  if (x % multiple > 0) {
	    x += multiple - (x % multiple);
	  }
	  return x;
	}

	var /** @type {ArrayBuffer} */
	  buffer,
	/** @type {Int8Array} */
	  HEAP8,
	/** @type {Uint8Array} */
	  HEAPU8,
	/** @type {Int16Array} */
	  HEAP16,
	/** @type {Uint16Array} */
	  HEAPU16,
	/** @type {Int32Array} */
	  HEAP32,
	/** @type {Uint32Array} */
	  HEAPU32,
	/** @type {Float32Array} */
	  HEAPF32,
	/** @type {Float64Array} */
	  HEAPF64;

	function updateGlobalBuffer(buf) {
	  Module['buffer'] = buffer = buf;
	}

	function updateGlobalBufferViews() {
	  Module['HEAP8'] = HEAP8 = new Int8Array(buffer);
	  Module['HEAP16'] = HEAP16 = new Int16Array(buffer);
	  Module['HEAP32'] = HEAP32 = new Int32Array(buffer);
	  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer);
	  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer);
	  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer);
	  Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer);
	  Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer);
	}

	var STATIC_BASE, STATICTOP, staticSealed; // static area
	var STACK_BASE, STACKTOP, STACK_MAX; // stack area
	var DYNAMIC_BASE, DYNAMICTOP_PTR; // dynamic area handled by sbrk

	  STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
	  staticSealed = false;


	// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
	function writeStackCookie() {
	  assert((STACK_MAX & 3) == 0);
	  HEAPU32[(STACK_MAX >> 2)-1] = 0x02135467;
	  HEAPU32[(STACK_MAX >> 2)-2] = 0x89BACDFE;
	}

	function checkStackCookie() {
	  if (HEAPU32[(STACK_MAX >> 2)-1] != 0x02135467 || HEAPU32[(STACK_MAX >> 2)-2] != 0x89BACDFE) {
	    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x' + HEAPU32[(STACK_MAX >> 2)-2].toString(16) + ' ' + HEAPU32[(STACK_MAX >> 2)-1].toString(16));
	  }
	  // Also test the global address 0 for integrity. This check is not compatible with SAFE_SPLIT_MEMORY though, since that mode already tests all address 0 accesses on its own.
	  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) throw 'Runtime error: The application has corrupted its heap memory area (address zero)!';
	}

	function abortStackOverflow(allocSize) {
	  abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' + (STACK_MAX - stackSave() + allocSize) + ' bytes available!');
	}

	function abortOnCannotGrowMemory() {
	  abort('Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
	}


	function enlargeMemory() {
	  abortOnCannotGrowMemory();
	}


	var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
	var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 536870912;
	if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr('TOTAL_MEMORY should be larger than TOTAL_STACK, was ' + TOTAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

	// Initialize the runtime's memory
	// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
	assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
	       'JS engine does not provide full typed array support');



	// Use a provided buffer, if there is one, or else allocate a new one
	if (Module['buffer']) {
	  buffer = Module['buffer'];
	  assert(buffer.byteLength === TOTAL_MEMORY, 'provided buffer should be ' + TOTAL_MEMORY + ' bytes, but it is ' + buffer.byteLength);
	} else {
	  // Use a WebAssembly memory where available
	  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
	    assert(TOTAL_MEMORY % WASM_PAGE_SIZE === 0);
	    Module['wasmMemory'] = new WebAssembly.Memory({ 'initial': TOTAL_MEMORY / WASM_PAGE_SIZE, 'maximum': TOTAL_MEMORY / WASM_PAGE_SIZE });
	    buffer = Module['wasmMemory'].buffer;
	  } else
	  {
	    buffer = new ArrayBuffer(TOTAL_MEMORY);
	  }
	  assert(buffer.byteLength === TOTAL_MEMORY);
	  Module['buffer'] = buffer;
	}
	updateGlobalBufferViews();


	function getTotalMemory() {
	  return TOTAL_MEMORY;
	}

	// Endianness check (note: assumes compiler arch was little-endian)
	  HEAP32[0] = 0x63736d65; /* 'emsc' */
	HEAP16[1] = 0x6373;
	if (HEAPU8[2] !== 0x73 || HEAPU8[3] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';

	function callRuntimeCallbacks(callbacks) {
	  while(callbacks.length > 0) {
	    var callback = callbacks.shift();
	    if (typeof callback == 'function') {
	      callback();
	      continue;
	    }
	    var func = callback.func;
	    if (typeof func === 'number') {
	      if (callback.arg === undefined) {
	        Module['dynCall_v'](func);
	      } else {
	        Module['dynCall_vi'](func, callback.arg);
	      }
	    } else {
	      func(callback.arg === undefined ? null : callback.arg);
	    }
	  }
	}

	var __ATPRERUN__  = []; // functions called before the runtime is initialized
	var __ATINIT__    = []; // functions called during startup
	var __ATMAIN__    = []; // functions called when main() is to be run
	var __ATEXIT__    = []; // functions called during shutdown
	var __ATPOSTRUN__ = []; // functions called after the runtime has exited

	var runtimeInitialized = false;
	var runtimeExited = false;


	function preRun() {
	  // compatibility - merge in anything from Module['preRun'] at this time
	  if (Module['preRun']) {
	    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
	    while (Module['preRun'].length) {
	      addOnPreRun(Module['preRun'].shift());
	    }
	  }
	  callRuntimeCallbacks(__ATPRERUN__);
	}

	function ensureInitRuntime() {
	  checkStackCookie();
	  if (runtimeInitialized) return;
	  runtimeInitialized = true;
	  callRuntimeCallbacks(__ATINIT__);
	}

	function preMain() {
	  checkStackCookie();
	  callRuntimeCallbacks(__ATMAIN__);
	}

	function exitRuntime() {
	  checkStackCookie();
	  callRuntimeCallbacks(__ATEXIT__);
	  runtimeExited = true;
	}

	function postRun() {
	  checkStackCookie();
	  // compatibility - merge in anything from Module['postRun'] at this time
	  if (Module['postRun']) {
	    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
	    while (Module['postRun'].length) {
	      addOnPostRun(Module['postRun'].shift());
	    }
	  }
	  callRuntimeCallbacks(__ATPOSTRUN__);
	}

	function addOnPreRun(cb) {
	  __ATPRERUN__.unshift(cb);
	}

	function addOnPostRun(cb) {
	  __ATPOSTRUN__.unshift(cb);
	}

	function writeArrayToMemory(array, buffer) {
	  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)');
	  HEAP8.set(array, buffer);
	}

	function writeAsciiToMemory(str, buffer, dontAddNull) {
	  for (var i = 0; i < str.length; ++i) {
	    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
	    HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
	  }
	  // Null-terminate the pointer to the HEAP.
	  if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
	}

	assert(Math['imul'] && Math['fround'] && Math['clz32'] && Math['trunc'], 'this is a legacy browser, build with LEGACY_VM_SUPPORT');

	var Math_abs = Math.abs;
	var Math_ceil = Math.ceil;
	var Math_floor = Math.floor;
	var Math_min = Math.min;

	// A counter of dependencies for calling run(). If we need to
	// do asynchronous work before running, increment this and
	// decrement it. Incrementing must happen in a place like
	// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
	// Note that you can add dependencies in preRun, even though
	// it happens right before run - run will be postponed until
	// the dependencies are met.
	var runDependencies = 0;
	var runDependencyWatcher = null;
	var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
	var runDependencyTracking = {};

	function addRunDependency(id) {
	  runDependencies++;
	  if (Module['monitorRunDependencies']) {
	    Module['monitorRunDependencies'](runDependencies);
	  }
	  if (id) {
	    assert(!runDependencyTracking[id]);
	    runDependencyTracking[id] = 1;
	    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
	      // Check for missing dependencies every few seconds
	      runDependencyWatcher = setInterval(function() {
	        if (ABORT) {
	          clearInterval(runDependencyWatcher);
	          runDependencyWatcher = null;
	          return;
	        }
	        var shown = false;
	        for (var dep in runDependencyTracking) {
	          if (!shown) {
	            shown = true;
	            Module.printErr('still waiting on run dependencies:');
	          }
	          Module.printErr('dependency: ' + dep);
	        }
	        if (shown) {
	          Module.printErr('(end of list)');
	        }
	      }, 10000);
	    }
	  } else {
	    Module.printErr('warning: run dependency added without ID');
	  }
	}

	function removeRunDependency(id) {
	  runDependencies--;
	  if (Module['monitorRunDependencies']) {
	    Module['monitorRunDependencies'](runDependencies);
	  }
	  if (id) {
	    assert(runDependencyTracking[id]);
	    delete runDependencyTracking[id];
	  } else {
	    Module.printErr('warning: run dependency removed without ID');
	  }
	  if (runDependencies == 0) {
	    if (runDependencyWatcher !== null) {
	      clearInterval(runDependencyWatcher);
	      runDependencyWatcher = null;
	    }
	    if (dependenciesFulfilled) {
	      var callback = dependenciesFulfilled;
	      dependenciesFulfilled = null;
	      callback(); // can add another dependenciesFulfilled
	    }
	  }
	}

	Module["preloadedImages"] = {}; // maps url to image data
	Module["preloadedAudios"] = {}; // maps url to audio data



	var /* show errors on likely calls to FS when it was not included */ FS = {
	  error: function() {
	    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1');
	  },
	  init: function() { FS.error(); },
	  createDataFile: function() { FS.error(); },
	  createPreloadedFile: function() { FS.error(); },
	  createLazyFile: function() { FS.error(); },
	  open: function() { FS.error(); },
	  mkdev: function() { FS.error(); },
	  registerDevice: function() { FS.error(); },
	  analyzePath: function() { FS.error(); },
	  loadFilesFromDB: function() { FS.error(); },

	  ErrnoError: function ErrnoError() { FS.error(); },
	};
	Module['FS_createDataFile'] = FS.createDataFile;
	Module['FS_createPreloadedFile'] = FS.createPreloadedFile;



	// Prefix of data URIs emitted by SINGLE_FILE and related options.
	var dataURIPrefix = 'data:application/octet-stream;base64,';

	// Indicates whether filename is a base64 data URI.
	function isDataURI(filename) {
	  return String.prototype.startsWith ?
	      filename.startsWith(dataURIPrefix) :
	      filename.indexOf(dataURIPrefix) === 0;
	}




	function integrateWasmJS() {

	  var wasmTextFile = 'trace_processor.wast';
	  var wasmBinaryFile = 'trace_processor.wasm';
	  var asmjsCodeFile = 'trace_processor.temp.asm.js';

	  if (typeof Module['locateFile'] === 'function') {
	    if (!isDataURI(wasmTextFile)) {
	      wasmTextFile = Module['locateFile'](wasmTextFile);
	    }
	    if (!isDataURI(wasmBinaryFile)) {
	      wasmBinaryFile = Module['locateFile'](wasmBinaryFile);
	    }
	    if (!isDataURI(asmjsCodeFile)) {
	      asmjsCodeFile = Module['locateFile'](asmjsCodeFile);
	    }
	  }

	  // utilities

	  var wasmPageSize = 64*1024;

	  var info = {
	    'global': null,
	    'env': null,
	    'asm2wasm': { // special asm2wasm imports
	      "f64-rem": function(x, y) {
	        return x % y;
	      },
	      "debugger": function() {
	        debugger;
	      }
	    },
	    'parent': Module // Module inside wasm-js.cpp refers to wasm-js.cpp; this allows access to the outside program.
	  };

	  var exports = null;


	  function mergeMemory(newBuffer) {
	    // The wasm instance creates its memory. But static init code might have written to
	    // buffer already, including the mem init file, and we must copy it over in a proper merge.
	    // TODO: avoid this copy, by avoiding such static init writes
	    // TODO: in shorter term, just copy up to the last static init write
	    var oldBuffer = Module['buffer'];
	    if (newBuffer.byteLength < oldBuffer.byteLength) {
	      Module['printErr']('the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here');
	    }
	    var oldView = new Int8Array(oldBuffer);
	    var newView = new Int8Array(newBuffer);


	    newView.set(oldView);
	    updateGlobalBuffer(newBuffer);
	    updateGlobalBufferViews();
	  }

	  function fixImports(imports) {
	    return imports;
	  }

	  function getBinary() {
	    try {
	      if (Module['wasmBinary']) {
	        return new Uint8Array(Module['wasmBinary']);
	      }
	      if (Module['readBinary']) {
	        return Module['readBinary'](wasmBinaryFile);
	      } else {
	        throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
	      }
	    }
	    catch (err) {
	      abort(err);
	    }
	  }

	  function getBinaryPromise() {
	    // if we don't have the binary yet, and have the Fetch api, use that
	    // in some environments, like Electron's render process, Fetch api may be present, but have a different context than expected, let's only use it on the Web
	    if (!Module['wasmBinary'] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') {
	      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
	        if (!response['ok']) {
	          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
	        }
	        return response['arrayBuffer']();
	      }).catch(function () {
	        return getBinary();
	      });
	    }
	    // Otherwise, getBinary should be able to get it synchronously
	    return new Promise(function(resolve, reject) {
	      resolve(getBinary());
	    });
	  }

	  // do-method functions


	  function doNativeWasm(global, env, providedBuffer) {
	    if (typeof WebAssembly !== 'object') {
	      Module['printErr']('no native wasm support detected');
	      return false;
	    }
	    // prepare memory import
	    if (!(Module['wasmMemory'] instanceof WebAssembly.Memory)) {
	      Module['printErr']('no native wasm Memory in use');
	      return false;
	    }
	    env['memory'] = Module['wasmMemory'];
	    // Load the wasm module and create an instance of using native support in the JS engine.
	    info['global'] = {
	      'NaN': NaN,
	      'Infinity': Infinity
	    };
	    info['global.Math'] = Math;
	    info['env'] = env;
	    // handle a generated wasm instance, receiving its exports and
	    // performing other necessary setup
	    function receiveInstance(instance, module) {
	      exports = instance.exports;
	      if (exports.memory) mergeMemory(exports.memory);
	      Module['asm'] = exports;
	      Module["usingWasm"] = true;
	      removeRunDependency('wasm-instantiate');
	    }
	    addRunDependency('wasm-instantiate');

	    // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
	    // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
	    // to any other async startup actions they are performing.
	    if (Module['instantiateWasm']) {
	      try {
	        return Module['instantiateWasm'](info, receiveInstance);
	      } catch(e) {
	        Module['printErr']('Module.instantiateWasm callback failed with error: ' + e);
	        return false;
	      }
	    }

	    // Async compilation can be confusing when an error on the page overwrites Module
	    // (for example, if the order of elements is wrong, and the one defining Module is
	    // later), so we save Module and check it later.
	    var trueModule = Module;
	    function receiveInstantiatedSource(output) {
	      // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
	      // receiveInstance() will swap in the exports (to Module.asm) so they can be called
	      assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
	      trueModule = null;
	      receiveInstance(output['instance'], output['module']);
	    }
	    function instantiateArrayBuffer(receiver) {
	      getBinaryPromise().then(function(binary) {
	        return WebAssembly.instantiate(binary, info);
	      }).then(receiver).catch(function(reason) {
	        Module['printErr']('failed to asynchronously prepare wasm: ' + reason);
	        abort(reason);
	      });
	    }
	    // Prefer streaming instantiation if available.
	    if (!Module['wasmBinary'] &&
	        typeof WebAssembly.instantiateStreaming === 'function' &&
	        !isDataURI(wasmBinaryFile) &&
	        typeof fetch === 'function') {
	      WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, { credentials: 'same-origin' }), info)
	        .then(receiveInstantiatedSource)
	        .catch(function(reason) {
	          // We expect the most common failure cause to be a bad MIME type for the binary,
	          // in which case falling back to ArrayBuffer instantiation should work.
	          Module['printErr']('wasm streaming compile failed: ' + reason);
	          Module['printErr']('falling back to ArrayBuffer instantiation');
	          instantiateArrayBuffer(receiveInstantiatedSource);
	        });
	    } else {
	      instantiateArrayBuffer(receiveInstantiatedSource);
	    }
	    return {}; // no exports yet; we'll fill them in later
	  }


	  // We may have a preloaded value in Module.asm, save it
	  Module['asmPreload'] = Module['asm'];

	  // Memory growth integration code

	  var asmjsReallocBuffer = Module['reallocBuffer'];

	  var wasmReallocBuffer = function(size) {
	    var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE; // In wasm, heap size must be a multiple of 64KB. In asm.js, they need to be multiples of 16MB.
	    size = alignUp(size, PAGE_MULTIPLE); // round up to wasm page size
	    var old = Module['buffer'];
	    var oldSize = old.byteLength;
	    if (Module["usingWasm"]) {
	      // native wasm support
	      try {
	        var result = Module['wasmMemory'].grow((size - oldSize) / wasmPageSize); // .grow() takes a delta compared to the previous size
	        if (result !== (-1 | 0)) {
	          // success in native wasm memory growth, get the buffer from the memory
	          return Module['buffer'] = Module['wasmMemory'].buffer;
	        } else {
	          return null;
	        }
	      } catch(e) {
	        console.error('Module.reallocBuffer: Attempted to grow from ' + oldSize  + ' bytes to ' + size + ' bytes, but got error: ' + e);
	        return null;
	      }
	    }
	  };

	  Module['reallocBuffer'] = function(size) {
	    {
	      return wasmReallocBuffer(size);
	    }
	  };

	  // Provide an "asm.js function" for the application, called to "link" the asm.js module. We instantiate
	  // the wasm module at that time, and it receives imports and provides exports and so forth, the app
	  // doesn't need to care that it is wasm or olyfilled wasm or asm.js.

	  Module['asm'] = function(global, env, providedBuffer) {
	    env = fixImports(env);

	    // import table
	    if (!env['table']) {
	      var TABLE_SIZE = Module['wasmTableSize'];
	      if (TABLE_SIZE === undefined) TABLE_SIZE = 1024; // works in binaryen interpreter at least
	      var MAX_TABLE_SIZE = Module['wasmMaxTableSize'];
	      if (typeof WebAssembly === 'object' && typeof WebAssembly.Table === 'function') {
	        if (MAX_TABLE_SIZE !== undefined) {
	          env['table'] = new WebAssembly.Table({ 'initial': TABLE_SIZE, 'maximum': MAX_TABLE_SIZE, 'element': 'anyfunc' });
	        } else {
	          env['table'] = new WebAssembly.Table({ 'initial': TABLE_SIZE, element: 'anyfunc' });
	        }
	      } else {
	        env['table'] = new Array(TABLE_SIZE); // works in binaryen interpreter at least
	      }
	      Module['wasmTable'] = env['table'];
	    }

	    if (!env['memoryBase']) {
	      env['memoryBase'] = Module['STATIC_BASE']; // tell the memory segments where to place themselves
	    }
	    if (!env['tableBase']) {
	      env['tableBase'] = 0; // table starts at 0 by default, in dynamic linking this will change
	    }

	    // try the methods. each should return the exports if it succeeded

	    var exports;
	    exports = doNativeWasm(global, env, providedBuffer);

	    if (!exports) abort('no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods');


	    return exports;
	  };

	  var methodHandler = Module['asm']; // note our method handler, as we may modify Module['asm'] later
	}

	integrateWasmJS();





	STATIC_BASE = GLOBAL_BASE;

	STATICTOP = STATIC_BASE + 59920;
	/* global initializers */  __ATINIT__.push({ func: function() { __GLOBAL__sub_I_status_cc(); } });







	var STATIC_BUMP = 59920;
	Module["STATIC_BASE"] = STATIC_BASE;
	Module["STATIC_BUMP"] = STATIC_BUMP;

	/* no memory initializer */
	var tempDoublePtr = STATICTOP; STATICTOP += 16;

	assert(tempDoublePtr % 8 == 0);

	// {{PRE_LIBRARY}}


	  function ___assert_fail(condition, filename, line, func) {
	      abort('Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function']);
	    }

	  function ___cxa_pure_virtual() {
	      ABORT = true;
	      throw 'Pure virtual function called!';
	    }

	  function ___lock() {}

	  
	  var SYSCALLS={varargs:0,get:function(varargs) {
	        SYSCALLS.varargs += 4;
	        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
	        return ret;
	      },getStr:function() {
	        var ret = Pointer_stringify(SYSCALLS.get());
	        return ret;
	      },get64:function() {
	        var low = SYSCALLS.get(), high = SYSCALLS.get();
	        if (low >= 0) assert(high === 0);
	        else assert(high === -1);
	        return low;
	      },getZero:function() {
	        assert(SYSCALLS.get() === 0);
	      }};function ___syscall10(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // unlink
	      var path = SYSCALLS.getStr();
	      FS.unlink(path);
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall118(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // fsync
	      var stream = SYSCALLS.getStreamFromFD();
	      return 0; // we can't do anything synchronously; the in-memory FS is already synced to
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall140(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // llseek
	      var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
	      // NOTE: offset_high is unused - Emscripten's off_t is 32-bit
	      var offset = offset_low;
	      FS.llseek(stream, offset, whence);
	      HEAP32[((result)>>2)]=stream.position;
	      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  
	  function flush_NO_FILESYSTEM() {
	      // flush anything remaining in the buffers during shutdown
	      var fflush = Module["_fflush"];
	      if (fflush) fflush(0);
	      var printChar = ___syscall146.printChar;
	      if (!printChar) return;
	      var buffers = ___syscall146.buffers;
	      if (buffers[1].length) printChar(1, 10);
	      if (buffers[2].length) printChar(2, 10);
	    }function ___syscall146(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // writev
	      // hack to support printf in NO_FILESYSTEM
	      var stream = SYSCALLS.get(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
	      var ret = 0;
	      if (!___syscall146.buffers) {
	        ___syscall146.buffers = [null, [], []]; // 1 => stdout, 2 => stderr
	        ___syscall146.printChar = function(stream, curr) {
	          var buffer = ___syscall146.buffers[stream];
	          assert(buffer);
	          if (curr === 0 || curr === 10) {
	            (stream === 1 ? Module['print'] : Module['printErr'])(UTF8ArrayToString(buffer, 0));
	            buffer.length = 0;
	          } else {
	            buffer.push(curr);
	          }
	        };
	      }
	      for (var i = 0; i < iovcnt; i++) {
	        var ptr = HEAP32[(((iov)+(i*8))>>2)];
	        var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
	        for (var j = 0; j < len; j++) {
	          ___syscall146.printChar(stream, HEAPU8[ptr+j]);
	        }
	        ret += len;
	      }
	      return ret;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall15(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // chmod
	      var path = SYSCALLS.getStr(), mode = SYSCALLS.get();
	      FS.chmod(path, mode);
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall183(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // getcwd
	      var buf = SYSCALLS.get(), size = SYSCALLS.get();
	      if (size === 0) return -ERRNO_CODES.EINVAL;
	      var cwd = FS.cwd();
	      var cwdLengthInBytes = lengthBytesUTF8(cwd);
	      if (size < cwdLengthInBytes + 1) return -ERRNO_CODES.ERANGE;
	      stringToUTF8(cwd, buf, size);
	      return buf;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall192(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // mmap2
	      var addr = SYSCALLS.get(), len = SYSCALLS.get(), prot = SYSCALLS.get(), flags = SYSCALLS.get(), fd = SYSCALLS.get(), off = SYSCALLS.get();
	      off <<= 12; // undo pgoffset
	      var ptr;
	      var allocated = false;
	      if (fd === -1) {
	        ptr = _memalign(PAGE_SIZE, len);
	        if (!ptr) return -ERRNO_CODES.ENOMEM;
	        _memset(ptr, 0, len);
	        allocated = true;
	      } else {
	        var info = FS.getStream(fd);
	        if (!info) return -ERRNO_CODES.EBADF;
	        var res = FS.mmap(info, HEAPU8, addr, len, off, prot, flags);
	        ptr = res.ptr;
	        allocated = res.allocated;
	      }
	      SYSCALLS.mappings[ptr] = { malloc: ptr, len: len, allocated: allocated, fd: fd, flags: flags };
	      return ptr;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall194(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // ftruncate64
	      var fd = SYSCALLS.get(), zero = SYSCALLS.getZero(), length = SYSCALLS.get64();
	      FS.ftruncate(fd, length);
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall195(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // SYS_stat64
	      var path = SYSCALLS.getStr(), buf = SYSCALLS.get();
	      return SYSCALLS.doStat(FS.stat, path, buf);
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall196(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // SYS_lstat64
	      var path = SYSCALLS.getStr(), buf = SYSCALLS.get();
	      return SYSCALLS.doStat(FS.lstat, path, buf);
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall197(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // SYS_fstat64
	      var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get();
	      return SYSCALLS.doStat(FS.stat, stream.path, buf);
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  
	  var PROCINFO={ppid:1,pid:42,sid:42,pgid:42};function ___syscall20(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // getpid
	      return PROCINFO.pid;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  
	  function ___syscall202(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // getgid32
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }function ___syscall201(
	  ) {
	  return ___syscall202.apply(null, arguments)
	  }

	  function ___syscall207(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // fchown32
	      var fd = SYSCALLS.get(), owner = SYSCALLS.get(), group = SYSCALLS.get();
	      FS.fchown(fd, owner, group);
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall212(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // chown32
	      var path = SYSCALLS.getStr(), owner = SYSCALLS.get(), group = SYSCALLS.get();
	      FS.chown(path, owner, group);
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  
	  function ___setErrNo(value) {
	      if (Module['___errno_location']) HEAP32[((Module['___errno_location']())>>2)]=value;
	      else Module.printErr('failed to set errno from JS');
	      return value;
	    }function ___syscall221(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // fcntl64
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall3(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // read
	      var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get(), count = SYSCALLS.get();
	      return FS.read(stream, HEAP8,buf, count);
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall33(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // access
	      var path = SYSCALLS.getStr(), amode = SYSCALLS.get();
	      return SYSCALLS.doAccess(path, amode);
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall39(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // mkdir
	      var path = SYSCALLS.getStr(), mode = SYSCALLS.get();
	      return SYSCALLS.doMkdir(path, mode);
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall4(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // write
	      var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get(), count = SYSCALLS.get();
	      return FS.write(stream, HEAP8,buf, count);
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall40(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // rmdir
	      var path = SYSCALLS.getStr();
	      FS.rmdir(path);
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall5(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // open
	      var pathname = SYSCALLS.getStr(), flags = SYSCALLS.get(), mode = SYSCALLS.get(); // optional TODO
	      var stream = FS.open(pathname, flags, mode);
	      return stream.fd;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall54(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // ioctl
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall6(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // close
	      var stream = SYSCALLS.getStreamFromFD();
	      FS.close(stream);
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall85(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // readlink
	      var path = SYSCALLS.getStr(), buf = SYSCALLS.get(), bufsize = SYSCALLS.get();
	      return SYSCALLS.doReadlink(path, buf, bufsize);
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall91(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // munmap
	      var addr = SYSCALLS.get(), len = SYSCALLS.get();
	      // TODO: support unmmap'ing parts of allocations
	      var info = SYSCALLS.mappings[addr];
	      if (!info) return 0;
	      if (len === info.len) {
	        var stream = FS.getStream(info.fd);
	        SYSCALLS.doMsync(addr, stream, len, info.flags);
	        FS.munmap(stream);
	        SYSCALLS.mappings[addr] = null;
	        if (info.allocated) {
	          _free(info.malloc);
	        }
	      }
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___syscall94(which, varargs) {SYSCALLS.varargs = varargs;
	  try {
	   // fchmod
	      var fd = SYSCALLS.get(), mode = SYSCALLS.get();
	      FS.fchmod(fd, mode);
	      return 0;
	    } catch (e) {
	    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
	    return -e.errno;
	  }
	  }

	  function ___unlock() {}

	  function _abort() {
	      Module['abort']();
	    }

	  
	  
	  
	  
	  var _environ=STATICTOP; STATICTOP += 16;function ___buildEnvironment(env) {
	      // WARNING: Arbitrary limit!
	      var MAX_ENV_VALUES = 64;
	      var TOTAL_ENV_SIZE = 1024;
	  
	      // Statically allocate memory for the environment.
	      var poolPtr;
	      var envPtr;
	      if (!___buildEnvironment.called) {
	        ___buildEnvironment.called = true;
	        // Set default values. Use string keys for Closure Compiler compatibility.
	        ENV['USER'] = ENV['LOGNAME'] = 'web_user';
	        ENV['PATH'] = '/';
	        ENV['PWD'] = '/';
	        ENV['HOME'] = '/home/web_user';
	        ENV['LANG'] = 'C.UTF-8';
	        ENV['_'] = Module['thisProgram'];
	        // Allocate memory.
	        poolPtr = staticAlloc(TOTAL_ENV_SIZE);
	        envPtr = staticAlloc(MAX_ENV_VALUES * 4);
	        HEAP32[((envPtr)>>2)]=poolPtr;
	        HEAP32[((_environ)>>2)]=envPtr;
	      } else {
	        envPtr = HEAP32[((_environ)>>2)];
	        poolPtr = HEAP32[((envPtr)>>2)];
	      }
	  
	      // Collect key=value lines.
	      var strings = [];
	      var totalSize = 0;
	      for (var key in env) {
	        if (typeof env[key] === 'string') {
	          var line = key + '=' + env[key];
	          strings.push(line);
	          totalSize += line.length;
	        }
	      }
	      if (totalSize > TOTAL_ENV_SIZE) {
	        throw new Error('Environment size exceeded TOTAL_ENV_SIZE!');
	      }
	  
	      // Make new.
	      var ptrSize = 4;
	      for (var i = 0; i < strings.length; i++) {
	        var line = strings[i];
	        writeAsciiToMemory(line, poolPtr);
	        HEAP32[(((envPtr)+(i * ptrSize))>>2)]=poolPtr;
	        poolPtr += line.length + 1;
	      }
	      HEAP32[(((envPtr)+(strings.length * ptrSize))>>2)]=0;
	    }var ENV={};function _getenv(name) {
	      // char *getenv(const char *name);
	      // http://pubs.opengroup.org/onlinepubs/009695399/functions/getenv.html
	      if (name === 0) return 0;
	      name = Pointer_stringify(name);
	      if (!ENV.hasOwnProperty(name)) return 0;
	  
	      if (_getenv.ret) _free(_getenv.ret);
	      _getenv.ret = allocateUTF8(ENV[name]);
	      return _getenv.ret;
	    }

	  function _gettimeofday(ptr) {
	      var now = Date.now();
	      HEAP32[((ptr)>>2)]=(now/1000)|0; // seconds
	      HEAP32[(((ptr)+(4))>>2)]=((now % 1000)*1000)|0; // microseconds
	      return 0;
	    }

	  function _llvm_trap() {
	      abort('trap!');
	    }

	  
	  var ___tm_current=STATICTOP; STATICTOP += 48;  
	  
	  var ___tm_timezone=allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC);
	  
	  
	  var _tzname=STATICTOP; STATICTOP += 16;  
	  var _daylight=STATICTOP; STATICTOP += 16;  
	  var _timezone=STATICTOP; STATICTOP += 16;function _tzset() {
	      // TODO: Use (malleable) environment variables instead of system settings.
	      if (_tzset.called) return;
	      _tzset.called = true;
	  
	      // timezone is specified as seconds west of UTC ("The external variable
	      // `timezone` shall be set to the difference, in seconds, between
	      // Coordinated Universal Time (UTC) and local standard time."), the same
	      // as returned by getTimezoneOffset().
	      // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
	      HEAP32[((_timezone)>>2)]=(new Date()).getTimezoneOffset() * 60;
	  
	      var winter = new Date(2000, 0, 1);
	      var summer = new Date(2000, 6, 1);
	      HEAP32[((_daylight)>>2)]=Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());
	  
	      function extractZone(date) {
	        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
	        return match ? match[1] : "GMT";
	      }      var winterName = extractZone(winter);
	      var summerName = extractZone(summer);
	      var winterNamePtr = allocate(intArrayFromString(winterName), 'i8', ALLOC_NORMAL);
	      var summerNamePtr = allocate(intArrayFromString(summerName), 'i8', ALLOC_NORMAL);
	      if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
	        // Northern hemisphere
	        HEAP32[((_tzname)>>2)]=winterNamePtr;
	        HEAP32[(((_tzname)+(4))>>2)]=summerNamePtr;
	      } else {
	        HEAP32[((_tzname)>>2)]=summerNamePtr;
	        HEAP32[(((_tzname)+(4))>>2)]=winterNamePtr;
	      }
	    }function _localtime_r(time, tmPtr) {
	      _tzset();
	      var date = new Date(HEAP32[((time)>>2)]*1000);
	      HEAP32[((tmPtr)>>2)]=date.getSeconds();
	      HEAP32[(((tmPtr)+(4))>>2)]=date.getMinutes();
	      HEAP32[(((tmPtr)+(8))>>2)]=date.getHours();
	      HEAP32[(((tmPtr)+(12))>>2)]=date.getDate();
	      HEAP32[(((tmPtr)+(16))>>2)]=date.getMonth();
	      HEAP32[(((tmPtr)+(20))>>2)]=date.getFullYear()-1900;
	      HEAP32[(((tmPtr)+(24))>>2)]=date.getDay();
	  
	      var start = new Date(date.getFullYear(), 0, 1);
	      var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
	      HEAP32[(((tmPtr)+(28))>>2)]=yday;
	      HEAP32[(((tmPtr)+(36))>>2)]=-(date.getTimezoneOffset() * 60);
	  
	      // Attention: DST is in December in South, and some regions don't have DST at all.
	      var summerOffset = new Date(2000, 6, 1).getTimezoneOffset();
	      var winterOffset = start.getTimezoneOffset();
	      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
	      HEAP32[(((tmPtr)+(32))>>2)]=dst;
	  
	      var zonePtr = HEAP32[(((_tzname)+(dst ? 4 : 0))>>2)];
	      HEAP32[(((tmPtr)+(40))>>2)]=zonePtr;
	  
	      return tmPtr;
	    }function _localtime(time) {
	      return _localtime_r(time, ___tm_current);
	    }

	  
	  function _emscripten_memcpy_big(dest, src, num) {
	      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
	      return dest;
	    } 

	   

	   

	  function _pthread_mutex_destroy() {}

	  function _pthread_mutex_init() {}

	   

	   

	   

	   

	  function _sched_yield() {
	      return 0;
	    }

	  
	  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function _sysconf(name) {
	      // long sysconf(int name);
	      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
	      switch(name) {
	        case 30: return PAGE_SIZE;
	        case 85:
	          var maxHeapSize = 2*1024*1024*1024 - 65536;
	          maxHeapSize = HEAPU8.length;
	          return maxHeapSize / PAGE_SIZE;
	        case 132:
	        case 133:
	        case 12:
	        case 137:
	        case 138:
	        case 15:
	        case 235:
	        case 16:
	        case 17:
	        case 18:
	        case 19:
	        case 20:
	        case 149:
	        case 13:
	        case 10:
	        case 236:
	        case 153:
	        case 9:
	        case 21:
	        case 22:
	        case 159:
	        case 154:
	        case 14:
	        case 77:
	        case 78:
	        case 139:
	        case 80:
	        case 81:
	        case 82:
	        case 68:
	        case 67:
	        case 164:
	        case 11:
	        case 29:
	        case 47:
	        case 48:
	        case 95:
	        case 52:
	        case 51:
	        case 46:
	          return 200809;
	        case 79:
	          return 0;
	        case 27:
	        case 246:
	        case 127:
	        case 128:
	        case 23:
	        case 24:
	        case 160:
	        case 161:
	        case 181:
	        case 182:
	        case 242:
	        case 183:
	        case 184:
	        case 243:
	        case 244:
	        case 245:
	        case 165:
	        case 178:
	        case 179:
	        case 49:
	        case 50:
	        case 168:
	        case 169:
	        case 175:
	        case 170:
	        case 171:
	        case 172:
	        case 97:
	        case 76:
	        case 32:
	        case 173:
	        case 35:
	          return -1;
	        case 176:
	        case 177:
	        case 7:
	        case 155:
	        case 8:
	        case 157:
	        case 125:
	        case 126:
	        case 92:
	        case 93:
	        case 129:
	        case 130:
	        case 131:
	        case 94:
	        case 91:
	          return 1;
	        case 74:
	        case 60:
	        case 69:
	        case 70:
	        case 4:
	          return 1024;
	        case 31:
	        case 42:
	        case 72:
	          return 32;
	        case 87:
	        case 26:
	        case 33:
	          return 2147483647;
	        case 34:
	        case 1:
	          return 47839;
	        case 38:
	        case 36:
	          return 99;
	        case 43:
	        case 37:
	          return 2048;
	        case 0: return 2097152;
	        case 3: return 65536;
	        case 28: return 32768;
	        case 44: return 32767;
	        case 75: return 16384;
	        case 39: return 1000;
	        case 89: return 700;
	        case 71: return 256;
	        case 40: return 255;
	        case 2: return 100;
	        case 180: return 64;
	        case 25: return 20;
	        case 5: return 16;
	        case 6: return 6;
	        case 73: return 4;
	        case 84: {
	          if (typeof navigator === 'object') return navigator['hardwareConcurrency'] || 1;
	          return 1;
	        }
	      }
	      ___setErrNo(ERRNO_CODES.EINVAL);
	      return -1;
	    }

	  function _time(ptr) {
	      var ret = (Date.now()/1000)|0;
	      if (ptr) {
	        HEAP32[((ptr)>>2)]=ret;
	      }
	      return ret;
	    }

	  function _usleep(useconds) {
	      // int usleep(useconds_t useconds);
	      // http://pubs.opengroup.org/onlinepubs/000095399/functions/usleep.html
	      // We're single-threaded, so use a busy loop. Super-ugly.
	      var msec = useconds / 1000;
	      if ((ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self['performance'] && self['performance']['now']) {
	        var start = self['performance']['now']();
	        while (self['performance']['now']() - start < msec) {
	          // Do nothing.
	        }
	      } else {
	        var start = Date.now();
	      }
	      return 0;
	    }

	  
	  var FS=undefined;function _utime(path, times) {
	      // int utime(const char *path, const struct utimbuf *times);
	      // http://pubs.opengroup.org/onlinepubs/009695399/basedefs/utime.h.html
	      var time;
	      if (times) {
	        // NOTE: We don't keep track of access timestamps.
	        var offset = 4;
	        time = HEAP32[(((times)+(offset))>>2)];
	        time *= 1000;
	      } else {
	        time = Date.now();
	      }
	      path = Pointer_stringify(path);
	      try {
	        FS.utime(path, time, time);
	        return 0;
	      } catch (e) {
	        FS.handleFSError(e);
	        return -1;
	      }
	    }
	___buildEnvironment(ENV);DYNAMICTOP_PTR = staticAlloc(4);

	STACK_BASE = STACKTOP = alignMemory(STATICTOP);

	STACK_MAX = STACK_BASE + TOTAL_STACK;

	DYNAMIC_BASE = alignMemory(STACK_MAX);

	HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;

	staticSealed = true; // seal the static portion of memory

	assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

	/** @type {function(string, boolean=, number=)} */
	function intArrayFromString(stringy, dontAddNull, length) {
	  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
	  var u8array = new Array(len);
	  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
	  if (dontAddNull) u8array.length = numBytesWritten;
	  return u8array;
	}



	function nullFunc_i(x) { Module["printErr"]("Invalid function pointer called with signature 'i'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_ii(x) { Module["printErr"]("Invalid function pointer called with signature 'ii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_iii(x) { Module["printErr"]("Invalid function pointer called with signature 'iii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_iiii(x) { Module["printErr"]("Invalid function pointer called with signature 'iiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_iiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'iiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_iiiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'iiiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_iiiiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'iiiiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_iiiij(x) { Module["printErr"]("Invalid function pointer called with signature 'iiiij'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_iij(x) { Module["printErr"]("Invalid function pointer called with signature 'iij'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_iiji(x) { Module["printErr"]("Invalid function pointer called with signature 'iiji'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_iijii(x) { Module["printErr"]("Invalid function pointer called with signature 'iijii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_ji(x) { Module["printErr"]("Invalid function pointer called with signature 'ji'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_v(x) { Module["printErr"]("Invalid function pointer called with signature 'v'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_vi(x) { Module["printErr"]("Invalid function pointer called with signature 'vi'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_vii(x) { Module["printErr"]("Invalid function pointer called with signature 'vii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_viii(x) { Module["printErr"]("Invalid function pointer called with signature 'viii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_viiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_viiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_viiiij(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiij'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_viij(x) { Module["printErr"]("Invalid function pointer called with signature 'viij'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_viiji(x) { Module["printErr"]("Invalid function pointer called with signature 'viiji'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_viijiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viijiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_viji(x) { Module["printErr"]("Invalid function pointer called with signature 'viji'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	function nullFunc_vijii(x) { Module["printErr"]("Invalid function pointer called with signature 'vijii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x); }

	Module['wasmTableSize'] = 10176;

	Module['wasmMaxTableSize'] = 10176;

	function invoke_i(index) {
	  try {
	    return Module["dynCall_i"](index);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_i(index) {
	    return functionPointers[index]();
	}

	function invoke_ii(index,a1) {
	  try {
	    return Module["dynCall_ii"](index,a1);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_ii(index,a1) {
	    return functionPointers[index](a1);
	}

	function invoke_iii(index,a1,a2) {
	  try {
	    return Module["dynCall_iii"](index,a1,a2);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_iii(index,a1,a2) {
	    return functionPointers[index](a1,a2);
	}

	function invoke_iiii(index,a1,a2,a3) {
	  try {
	    return Module["dynCall_iiii"](index,a1,a2,a3);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_iiii(index,a1,a2,a3) {
	    return functionPointers[index](a1,a2,a3);
	}

	function invoke_iiiii(index,a1,a2,a3,a4) {
	  try {
	    return Module["dynCall_iiiii"](index,a1,a2,a3,a4);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_iiiii(index,a1,a2,a3,a4) {
	    return functionPointers[index](a1,a2,a3,a4);
	}

	function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
	  try {
	    return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_iiiiii(index,a1,a2,a3,a4,a5) {
	    return functionPointers[index](a1,a2,a3,a4,a5);
	}

	function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6) {
	  try {
	    return Module["dynCall_iiiiiii"](index,a1,a2,a3,a4,a5,a6);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_iiiiiii(index,a1,a2,a3,a4,a5,a6) {
	    return functionPointers[index](a1,a2,a3,a4,a5,a6);
	}

	function invoke_iiiij(index,a1,a2,a3,a4,a5) {
	  try {
	    return Module["dynCall_iiiij"](index,a1,a2,a3,a4,a5);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_iiiij(index,a1,a2,a3,a4) {
	    return functionPointers[index](a1,a2,a3,a4);
	}

	function invoke_iij(index,a1,a2,a3) {
	  try {
	    return Module["dynCall_iij"](index,a1,a2,a3);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_iij(index,a1,a2) {
	    return functionPointers[index](a1,a2);
	}

	function invoke_iiji(index,a1,a2,a3,a4) {
	  try {
	    return Module["dynCall_iiji"](index,a1,a2,a3,a4);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_iiji(index,a1,a2,a3) {
	    return functionPointers[index](a1,a2,a3);
	}

	function invoke_iijii(index,a1,a2,a3,a4,a5) {
	  try {
	    return Module["dynCall_iijii"](index,a1,a2,a3,a4,a5);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_iijii(index,a1,a2,a3,a4) {
	    return functionPointers[index](a1,a2,a3,a4);
	}

	function invoke_ji(index,a1) {
	  try {
	    return Module["dynCall_ji"](index,a1);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_ji(index,a1) {
	    return functionPointers[index](a1);
	}

	function invoke_v(index) {
	  try {
	    Module["dynCall_v"](index);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_v(index) {
	    functionPointers[index]();
	}

	function invoke_vi(index,a1) {
	  try {
	    Module["dynCall_vi"](index,a1);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_vi(index,a1) {
	    functionPointers[index](a1);
	}

	function invoke_vii(index,a1,a2) {
	  try {
	    Module["dynCall_vii"](index,a1,a2);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_vii(index,a1,a2) {
	    functionPointers[index](a1,a2);
	}

	function invoke_viii(index,a1,a2,a3) {
	  try {
	    Module["dynCall_viii"](index,a1,a2,a3);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_viii(index,a1,a2,a3) {
	    functionPointers[index](a1,a2,a3);
	}

	function invoke_viiii(index,a1,a2,a3,a4) {
	  try {
	    Module["dynCall_viiii"](index,a1,a2,a3,a4);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_viiii(index,a1,a2,a3,a4) {
	    functionPointers[index](a1,a2,a3,a4);
	}

	function invoke_viiiii(index,a1,a2,a3,a4,a5) {
	  try {
	    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_viiiii(index,a1,a2,a3,a4,a5) {
	    functionPointers[index](a1,a2,a3,a4,a5);
	}

	function invoke_viiiij(index,a1,a2,a3,a4,a5,a6) {
	  try {
	    Module["dynCall_viiiij"](index,a1,a2,a3,a4,a5,a6);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_viiiij(index,a1,a2,a3,a4,a5) {
	    functionPointers[index](a1,a2,a3,a4,a5);
	}

	function invoke_viij(index,a1,a2,a3,a4) {
	  try {
	    Module["dynCall_viij"](index,a1,a2,a3,a4);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_viij(index,a1,a2,a3) {
	    functionPointers[index](a1,a2,a3);
	}

	function invoke_viiji(index,a1,a2,a3,a4,a5) {
	  try {
	    Module["dynCall_viiji"](index,a1,a2,a3,a4,a5);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_viiji(index,a1,a2,a3,a4) {
	    functionPointers[index](a1,a2,a3,a4);
	}

	function invoke_viijiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
	  try {
	    Module["dynCall_viijiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_viijiiii(index,a1,a2,a3,a4,a5,a6,a7) {
	    functionPointers[index](a1,a2,a3,a4,a5,a6,a7);
	}

	function invoke_viji(index,a1,a2,a3,a4) {
	  try {
	    Module["dynCall_viji"](index,a1,a2,a3,a4);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_viji(index,a1,a2,a3) {
	    functionPointers[index](a1,a2,a3);
	}

	function invoke_vijii(index,a1,a2,a3,a4,a5) {
	  try {
	    Module["dynCall_vijii"](index,a1,a2,a3,a4,a5);
	  } catch(e) {
	    if (typeof e !== 'number' && e !== 'longjmp') throw e;
	    Module["setThrew"](1, 0);
	  }
	}

	function jsCall_vijii(index,a1,a2,a3,a4) {
	    functionPointers[index](a1,a2,a3,a4);
	}

	Module.asmGlobalArg = {};

	Module.asmLibraryArg = { "abort": abort, "assert": assert, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "abortStackOverflow": abortStackOverflow, "nullFunc_i": nullFunc_i, "nullFunc_ii": nullFunc_ii, "nullFunc_iii": nullFunc_iii, "nullFunc_iiii": nullFunc_iiii, "nullFunc_iiiii": nullFunc_iiiii, "nullFunc_iiiiii": nullFunc_iiiiii, "nullFunc_iiiiiii": nullFunc_iiiiiii, "nullFunc_iiiij": nullFunc_iiiij, "nullFunc_iij": nullFunc_iij, "nullFunc_iiji": nullFunc_iiji, "nullFunc_iijii": nullFunc_iijii, "nullFunc_ji": nullFunc_ji, "nullFunc_v": nullFunc_v, "nullFunc_vi": nullFunc_vi, "nullFunc_vii": nullFunc_vii, "nullFunc_viii": nullFunc_viii, "nullFunc_viiii": nullFunc_viiii, "nullFunc_viiiii": nullFunc_viiiii, "nullFunc_viiiij": nullFunc_viiiij, "nullFunc_viij": nullFunc_viij, "nullFunc_viiji": nullFunc_viiji, "nullFunc_viijiiii": nullFunc_viijiiii, "nullFunc_viji": nullFunc_viji, "nullFunc_vijii": nullFunc_vijii, "invoke_i": invoke_i, "jsCall_i": jsCall_i, "invoke_ii": invoke_ii, "jsCall_ii": jsCall_ii, "invoke_iii": invoke_iii, "jsCall_iii": jsCall_iii, "invoke_iiii": invoke_iiii, "jsCall_iiii": jsCall_iiii, "invoke_iiiii": invoke_iiiii, "jsCall_iiiii": jsCall_iiiii, "invoke_iiiiii": invoke_iiiiii, "jsCall_iiiiii": jsCall_iiiiii, "invoke_iiiiiii": invoke_iiiiiii, "jsCall_iiiiiii": jsCall_iiiiiii, "invoke_iiiij": invoke_iiiij, "jsCall_iiiij": jsCall_iiiij, "invoke_iij": invoke_iij, "jsCall_iij": jsCall_iij, "invoke_iiji": invoke_iiji, "jsCall_iiji": jsCall_iiji, "invoke_iijii": invoke_iijii, "jsCall_iijii": jsCall_iijii, "invoke_ji": invoke_ji, "jsCall_ji": jsCall_ji, "invoke_v": invoke_v, "jsCall_v": jsCall_v, "invoke_vi": invoke_vi, "jsCall_vi": jsCall_vi, "invoke_vii": invoke_vii, "jsCall_vii": jsCall_vii, "invoke_viii": invoke_viii, "jsCall_viii": jsCall_viii, "invoke_viiii": invoke_viiii, "jsCall_viiii": jsCall_viiii, "invoke_viiiii": invoke_viiiii, "jsCall_viiiii": jsCall_viiiii, "invoke_viiiij": invoke_viiiij, "jsCall_viiiij": jsCall_viiiij, "invoke_viij": invoke_viij, "jsCall_viij": jsCall_viij, "invoke_viiji": invoke_viiji, "jsCall_viiji": jsCall_viiji, "invoke_viijiiii": invoke_viijiiii, "jsCall_viijiiii": jsCall_viijiiii, "invoke_viji": invoke_viji, "jsCall_viji": jsCall_viji, "invoke_vijii": invoke_vijii, "jsCall_vijii": jsCall_vijii, "___assert_fail": ___assert_fail, "___buildEnvironment": ___buildEnvironment, "___cxa_pure_virtual": ___cxa_pure_virtual, "___lock": ___lock, "___setErrNo": ___setErrNo, "___syscall10": ___syscall10, "___syscall118": ___syscall118, "___syscall140": ___syscall140, "___syscall146": ___syscall146, "___syscall15": ___syscall15, "___syscall183": ___syscall183, "___syscall192": ___syscall192, "___syscall194": ___syscall194, "___syscall195": ___syscall195, "___syscall196": ___syscall196, "___syscall197": ___syscall197, "___syscall20": ___syscall20, "___syscall201": ___syscall201, "___syscall202": ___syscall202, "___syscall207": ___syscall207, "___syscall212": ___syscall212, "___syscall221": ___syscall221, "___syscall3": ___syscall3, "___syscall33": ___syscall33, "___syscall39": ___syscall39, "___syscall4": ___syscall4, "___syscall40": ___syscall40, "___syscall5": ___syscall5, "___syscall54": ___syscall54, "___syscall6": ___syscall6, "___syscall85": ___syscall85, "___syscall91": ___syscall91, "___syscall94": ___syscall94, "___unlock": ___unlock, "_abort": _abort, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_getenv": _getenv, "_gettimeofday": _gettimeofday, "_llvm_trap": _llvm_trap, "_localtime": _localtime, "_localtime_r": _localtime_r, "_pthread_mutex_destroy": _pthread_mutex_destroy, "_pthread_mutex_init": _pthread_mutex_init, "_sched_yield": _sched_yield, "_sysconf": _sysconf, "_time": _time, "_tzset": _tzset, "_usleep": _usleep, "_utime": _utime, "flush_NO_FILESYSTEM": flush_NO_FILESYSTEM, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX };
	// EMSCRIPTEN_START_ASM
	var asm =Module["asm"]// EMSCRIPTEN_END_ASM
	(Module.asmGlobalArg, Module.asmLibraryArg, buffer);

	var real__Initialize = asm["_Initialize"]; asm["_Initialize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__Initialize.apply(null, arguments);
	};

	var real___GLOBAL__sub_I_status_cc = asm["__GLOBAL__sub_I_status_cc"]; asm["__GLOBAL__sub_I_status_cc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___GLOBAL__sub_I_status_cc.apply(null, arguments);
	};

	var real___ZN6google8protobuf11MessageLiteD0Ev = asm["__ZN6google8protobuf11MessageLiteD0Ev"]; asm["__ZN6google8protobuf11MessageLiteD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf11MessageLiteD0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf11MessageLiteD2Ev = asm["__ZN6google8protobuf11MessageLiteD2Ev"]; asm["__ZN6google8protobuf11MessageLiteD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf11MessageLiteD2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED0Ev = asm["__ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED0Ev"]; asm["__ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED2Ev = asm["__ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED2Ev"]; asm["__ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io17ArrayOutputStream4NextEPPvPi = asm["__ZN6google8protobuf2io17ArrayOutputStream4NextEPPvPi"]; asm["__ZN6google8protobuf2io17ArrayOutputStream4NextEPPvPi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io17ArrayOutputStream4NextEPPvPi.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io17ArrayOutputStream6BackUpEi = asm["__ZN6google8protobuf2io17ArrayOutputStream6BackUpEi"]; asm["__ZN6google8protobuf2io17ArrayOutputStream6BackUpEi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io17ArrayOutputStream6BackUpEi.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io17ArrayOutputStreamD0Ev = asm["__ZN6google8protobuf2io17ArrayOutputStreamD0Ev"]; asm["__ZN6google8protobuf2io17ArrayOutputStreamD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io17ArrayOutputStreamD0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io17ArrayOutputStreamD2Ev = asm["__ZN6google8protobuf2io17ArrayOutputStreamD2Ev"]; asm["__ZN6google8protobuf2io17ArrayOutputStreamD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io17ArrayOutputStreamD2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io18StringOutputStream4NextEPPvPi = asm["__ZN6google8protobuf2io18StringOutputStream4NextEPPvPi"]; asm["__ZN6google8protobuf2io18StringOutputStream4NextEPPvPi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io18StringOutputStream4NextEPPvPi.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io18StringOutputStream6BackUpEi = asm["__ZN6google8protobuf2io18StringOutputStream6BackUpEi"]; asm["__ZN6google8protobuf2io18StringOutputStream6BackUpEi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io18StringOutputStream6BackUpEi.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io18StringOutputStreamD0Ev = asm["__ZN6google8protobuf2io18StringOutputStreamD0Ev"]; asm["__ZN6google8protobuf2io18StringOutputStreamD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io18StringOutputStreamD0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io18StringOutputStreamD2Ev = asm["__ZN6google8protobuf2io18StringOutputStreamD2Ev"]; asm["__ZN6google8protobuf2io18StringOutputStreamD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io18StringOutputStreamD2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io20ZeroCopyOutputStream15WriteAliasedRawEPKvi = asm["__ZN6google8protobuf2io20ZeroCopyOutputStream15WriteAliasedRawEPKvi"]; asm["__ZN6google8protobuf2io20ZeroCopyOutputStream15WriteAliasedRawEPKvi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io20ZeroCopyOutputStream15WriteAliasedRawEPKvi.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io20ZeroCopyOutputStreamD0Ev = asm["__ZN6google8protobuf2io20ZeroCopyOutputStreamD0Ev"]; asm["__ZN6google8protobuf2io20ZeroCopyOutputStreamD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io20ZeroCopyOutputStreamD0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io20ZeroCopyOutputStreamD2Ev = asm["__ZN6google8protobuf2io20ZeroCopyOutputStreamD2Ev"]; asm["__ZN6google8protobuf2io20ZeroCopyOutputStreamD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io20ZeroCopyOutputStreamD2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io22LazyStringOutputStream4NextEPPvPi = asm["__ZN6google8protobuf2io22LazyStringOutputStream4NextEPPvPi"]; asm["__ZN6google8protobuf2io22LazyStringOutputStream4NextEPPvPi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io22LazyStringOutputStream4NextEPPvPi.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io22LazyStringOutputStreamD0Ev = asm["__ZN6google8protobuf2io22LazyStringOutputStreamD0Ev"]; asm["__ZN6google8protobuf2io22LazyStringOutputStreamD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io22LazyStringOutputStreamD0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf2io22LazyStringOutputStreamD2Ev = asm["__ZN6google8protobuf2io22LazyStringOutputStreamD2Ev"]; asm["__ZN6google8protobuf2io22LazyStringOutputStreamD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf2io22LazyStringOutputStreamD2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf7ClosureD0Ev = asm["__ZN6google8protobuf7ClosureD0Ev"]; asm["__ZN6google8protobuf7ClosureD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf7ClosureD0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf7ClosureD2Ev = asm["__ZN6google8protobuf7ClosureD2Ev"]; asm["__ZN6google8protobuf7ClosureD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf7ClosureD2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal15InitEmptyStringEv = asm["__ZN6google8protobuf8internal15InitEmptyStringEv"]; asm["__ZN6google8protobuf8internal15InitEmptyStringEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal15InitEmptyStringEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal16FunctionClosure03RunEv = asm["__ZN6google8protobuf8internal16FunctionClosure03RunEv"]; asm["__ZN6google8protobuf8internal16FunctionClosure03RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal16FunctionClosure03RunEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal16FunctionClosure0D0Ev = asm["__ZN6google8protobuf8internal16FunctionClosure0D0Ev"]; asm["__ZN6google8protobuf8internal16FunctionClosure0D0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal16FunctionClosure0D0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal16FunctionClosure0D2Ev = asm["__ZN6google8protobuf8internal16FunctionClosure0D2Ev"]; asm["__ZN6google8protobuf8internal16FunctionClosure0D2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal16FunctionClosure0D2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal17DeleteEmptyStringEv = asm["__ZN6google8protobuf8internal17DeleteEmptyStringEv"]; asm["__ZN6google8protobuf8internal17DeleteEmptyStringEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal17DeleteEmptyStringEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos12RawQueryArgsEEEvPv = asm["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos12RawQueryArgsEEEvPv"]; asm["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos12RawQueryArgsEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos12RawQueryArgsEEEvPv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos14RawQueryResultEEEvPv = asm["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos14RawQueryResultEEEvPv"]; asm["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos14RawQueryResultEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos14RawQueryResultEEEvPv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv = asm["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv"]; asm["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv = asm["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv"]; asm["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal19arena_delete_objectINS0_11MessageLiteEEEvPv = asm["__ZN6google8protobuf8internal19arena_delete_objectINS0_11MessageLiteEEEvPv"]; asm["__ZN6google8protobuf8internal19arena_delete_objectINS0_11MessageLiteEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal19arena_delete_objectINS0_11MessageLiteEEEvPv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal20InitLogSilencerCountEv = asm["__ZN6google8protobuf8internal20InitLogSilencerCountEv"]; asm["__ZN6google8protobuf8internal20InitLogSilencerCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal20InitLogSilencerCountEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos25RawQueryResult_ColumnDescEE11TypeHandlerEEEvPPvSB_ii = asm["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos25RawQueryResult_ColumnDescEE11TypeHandlerEEEvPPvSB_ii"]; asm["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos25RawQueryResult_ColumnDescEE11TypeHandlerEEEvPPvSB_ii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos25RawQueryResult_ColumnDescEE11TypeHandlerEEEvPPvSB_ii.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos27RawQueryResult_ColumnValuesEE11TypeHandlerEEEvPPvSB_ii = asm["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos27RawQueryResult_ColumnValuesEE11TypeHandlerEEEvPPvSB_ii"]; asm["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos27RawQueryResult_ColumnValuesEE11TypeHandlerEEEvPPvSB_ii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos27RawQueryResult_ColumnValuesEE11TypeHandlerEEEvPPvSB_ii.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldINSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEE11TypeHandlerEEEvPPvSF_ii = asm["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldINSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEE11TypeHandlerEEEvPPvSF_ii"]; asm["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldINSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEE11TypeHandlerEEEvPPvSF_ii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldINSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEE11TypeHandlerEEEvPPvSF_ii.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal21InitShutdownFunctionsEv = asm["__ZN6google8protobuf8internal21InitShutdownFunctionsEv"]; asm["__ZN6google8protobuf8internal21InitShutdownFunctionsEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal21InitShutdownFunctionsEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv = asm["__ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv"]; asm["__ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv = asm["__ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv"]; asm["__ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal21arena_destruct_objectINSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEEEvPv = asm["__ZN6google8protobuf8internal21arena_destruct_objectINSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEEEvPv"]; asm["__ZN6google8protobuf8internal21arena_destruct_objectINSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal21arena_destruct_objectINSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEEEvPv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal22DeleteLogSilencerCountEv = asm["__ZN6google8protobuf8internal22DeleteLogSilencerCountEv"]; asm["__ZN6google8protobuf8internal22DeleteLogSilencerCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal22DeleteLogSilencerCountEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEE3RunEv = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEE3RunEv"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEE3RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEE3RunEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED0Ev = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED0Ev"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED2Ev = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED2Ev"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEE3RunEv = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEE3RunEv"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEE3RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEE3RunEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED0Ev = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED0Ev"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED2Ev = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED2Ev"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEE3RunEv = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEE3RunEv"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEE3RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEE3RunEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED0Ev = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED0Ev"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED2Ev = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED2Ev"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED2Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEE3RunEv = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEE3RunEv"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEE3RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEE3RunEv.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED0Ev = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED0Ev"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED0Ev.apply(null, arguments);
	};

	var real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED2Ev = asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED2Ev"]; asm["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTable12CreateCursorEv = asm["__ZN8perfetto15trace_processor10SliceTable12CreateCursorEv"]; asm["__ZN8perfetto15trace_processor10SliceTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTable12CreateCursorEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTable6Cursor3EofEv = asm["__ZN8perfetto15trace_processor10SliceTable6Cursor3EofEv"]; asm["__ZN8perfetto15trace_processor10SliceTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTable6Cursor3EofEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTable6Cursor4NextEv = asm["__ZN8perfetto15trace_processor10SliceTable6Cursor4NextEv"]; asm["__ZN8perfetto15trace_processor10SliceTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTable6Cursor4NextEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTable6Cursor6ColumnEP15sqlite3_contexti = asm["__ZN8perfetto15trace_processor10SliceTable6Cursor6ColumnEP15sqlite3_contexti"]; asm["__ZN8perfetto15trace_processor10SliceTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTable6Cursor6ColumnEP15sqlite3_contexti.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = asm["__ZN8perfetto15trace_processor10SliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"]; asm["__ZN8perfetto15trace_processor10SliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTable6CursorD0Ev = asm["__ZN8perfetto15trace_processor10SliceTable6CursorD0Ev"]; asm["__ZN8perfetto15trace_processor10SliceTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTable6CursorD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTable6CursorD2Ev = asm["__ZN8perfetto15trace_processor10SliceTable6CursorD2Ev"]; asm["__ZN8perfetto15trace_processor10SliceTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTable6CursorD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = asm["__ZN8perfetto15trace_processor10SliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"]; asm["__ZN8perfetto15trace_processor10SliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTableD0Ev = asm["__ZN8perfetto15trace_processor10SliceTableD0Ev"]; asm["__ZN8perfetto15trace_processor10SliceTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTableD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor10SliceTableD2Ev = asm["__ZN8perfetto15trace_processor10SliceTableD2Ev"]; asm["__ZN8perfetto15trace_processor10SliceTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor10SliceTableD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTable12CreateCursorEv = asm["__ZN8perfetto15trace_processor11StringTable12CreateCursorEv"]; asm["__ZN8perfetto15trace_processor11StringTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTable12CreateCursorEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTable6Cursor3EofEv = asm["__ZN8perfetto15trace_processor11StringTable6Cursor3EofEv"]; asm["__ZN8perfetto15trace_processor11StringTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTable6Cursor3EofEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTable6Cursor4NextEv = asm["__ZN8perfetto15trace_processor11StringTable6Cursor4NextEv"]; asm["__ZN8perfetto15trace_processor11StringTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTable6Cursor4NextEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTable6Cursor6ColumnEP15sqlite3_contexti = asm["__ZN8perfetto15trace_processor11StringTable6Cursor6ColumnEP15sqlite3_contexti"]; asm["__ZN8perfetto15trace_processor11StringTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTable6Cursor6ColumnEP15sqlite3_contexti.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = asm["__ZN8perfetto15trace_processor11StringTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"]; asm["__ZN8perfetto15trace_processor11StringTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTable6CursorD0Ev = asm["__ZN8perfetto15trace_processor11StringTable6CursorD0Ev"]; asm["__ZN8perfetto15trace_processor11StringTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTable6CursorD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTable6CursorD2Ev = asm["__ZN8perfetto15trace_processor11StringTable6CursorD2Ev"]; asm["__ZN8perfetto15trace_processor11StringTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTable6CursorD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = asm["__ZN8perfetto15trace_processor11StringTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"]; asm["__ZN8perfetto15trace_processor11StringTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTableD0Ev = asm["__ZN8perfetto15trace_processor11StringTableD0Ev"]; asm["__ZN8perfetto15trace_processor11StringTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTableD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11StringTableD2Ev = asm["__ZN8perfetto15trace_processor11StringTableD2Ev"]; asm["__ZN8perfetto15trace_processor11StringTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11StringTableD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTable12CreateCursorEv = asm["__ZN8perfetto15trace_processor11ThreadTable12CreateCursorEv"]; asm["__ZN8perfetto15trace_processor11ThreadTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTable12CreateCursorEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTable6Cursor3EofEv = asm["__ZN8perfetto15trace_processor11ThreadTable6Cursor3EofEv"]; asm["__ZN8perfetto15trace_processor11ThreadTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTable6Cursor3EofEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTable6Cursor4NextEv = asm["__ZN8perfetto15trace_processor11ThreadTable6Cursor4NextEv"]; asm["__ZN8perfetto15trace_processor11ThreadTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTable6Cursor4NextEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTable6Cursor6ColumnEP15sqlite3_contexti = asm["__ZN8perfetto15trace_processor11ThreadTable6Cursor6ColumnEP15sqlite3_contexti"]; asm["__ZN8perfetto15trace_processor11ThreadTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTable6Cursor6ColumnEP15sqlite3_contexti.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = asm["__ZN8perfetto15trace_processor11ThreadTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"]; asm["__ZN8perfetto15trace_processor11ThreadTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTable6CursorD0Ev = asm["__ZN8perfetto15trace_processor11ThreadTable6CursorD0Ev"]; asm["__ZN8perfetto15trace_processor11ThreadTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTable6CursorD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTable6CursorD2Ev = asm["__ZN8perfetto15trace_processor11ThreadTable6CursorD2Ev"]; asm["__ZN8perfetto15trace_processor11ThreadTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTable6CursorD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = asm["__ZN8perfetto15trace_processor11ThreadTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"]; asm["__ZN8perfetto15trace_processor11ThreadTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTableD0Ev = asm["__ZN8perfetto15trace_processor11ThreadTableD0Ev"]; asm["__ZN8perfetto15trace_processor11ThreadTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTableD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11ThreadTableD2Ev = asm["__ZN8perfetto15trace_processor11ThreadTableD2Ev"]; asm["__ZN8perfetto15trace_processor11ThreadTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11ThreadTableD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor11TraceSorter21TimestampedTracePiece7CompareERKS2_y = asm["__ZN8perfetto15trace_processor11TraceSorter21TimestampedTracePiece7CompareERKS2_y"]; asm["__ZN8perfetto15trace_processor11TraceSorter21TimestampedTracePiece7CompareERKS2_y"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor11TraceSorter21TimestampedTracePiece7CompareERKS2_y.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTable12CreateCursorEv = asm["__ZN8perfetto15trace_processor12ProcessTable12CreateCursorEv"]; asm["__ZN8perfetto15trace_processor12ProcessTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTable12CreateCursorEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTable6Cursor3EofEv = asm["__ZN8perfetto15trace_processor12ProcessTable6Cursor3EofEv"]; asm["__ZN8perfetto15trace_processor12ProcessTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTable6Cursor3EofEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTable6Cursor4NextEv = asm["__ZN8perfetto15trace_processor12ProcessTable6Cursor4NextEv"]; asm["__ZN8perfetto15trace_processor12ProcessTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTable6Cursor4NextEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTable6Cursor6ColumnEP15sqlite3_contexti = asm["__ZN8perfetto15trace_processor12ProcessTable6Cursor6ColumnEP15sqlite3_contexti"]; asm["__ZN8perfetto15trace_processor12ProcessTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTable6Cursor6ColumnEP15sqlite3_contexti.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = asm["__ZN8perfetto15trace_processor12ProcessTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"]; asm["__ZN8perfetto15trace_processor12ProcessTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTable6CursorD0Ev = asm["__ZN8perfetto15trace_processor12ProcessTable6CursorD0Ev"]; asm["__ZN8perfetto15trace_processor12ProcessTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTable6CursorD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTable6CursorD2Ev = asm["__ZN8perfetto15trace_processor12ProcessTable6CursorD2Ev"]; asm["__ZN8perfetto15trace_processor12ProcessTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTable6CursorD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = asm["__ZN8perfetto15trace_processor12ProcessTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"]; asm["__ZN8perfetto15trace_processor12ProcessTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTableD0Ev = asm["__ZN8perfetto15trace_processor12ProcessTableD0Ev"]; asm["__ZN8perfetto15trace_processor12ProcessTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTableD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12ProcessTableD2Ev = asm["__ZN8perfetto15trace_processor12ProcessTableD2Ev"]; asm["__ZN8perfetto15trace_processor12ProcessTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12ProcessTableD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12SchedTracker15PushSchedSwitchEjyjjNS_4base10StringViewEj = asm["__ZN8perfetto15trace_processor12SchedTracker15PushSchedSwitchEjyjjNS_4base10StringViewEj"]; asm["__ZN8perfetto15trace_processor12SchedTracker15PushSchedSwitchEjyjjNS_4base10StringViewEj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12SchedTracker15PushSchedSwitchEjyjjNS_4base10StringViewEj.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12SchedTrackerD0Ev = asm["__ZN8perfetto15trace_processor12SchedTrackerD0Ev"]; asm["__ZN8perfetto15trace_processor12SchedTrackerD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12SchedTrackerD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12SchedTrackerD2Ev = asm["__ZN8perfetto15trace_processor12SchedTrackerD2Ev"]; asm["__ZN8perfetto15trace_processor12SchedTrackerD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12SchedTrackerD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12TraceStorage11PushCpuFreqEyjj = asm["__ZN8perfetto15trace_processor12TraceStorage11PushCpuFreqEyjj"]; asm["__ZN8perfetto15trace_processor12TraceStorage11PushCpuFreqEyjj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12TraceStorage11PushCpuFreqEyjj.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12TraceStorageD0Ev = asm["__ZN8perfetto15trace_processor12TraceStorageD0Ev"]; asm["__ZN8perfetto15trace_processor12TraceStorageD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12TraceStorageD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor12TraceStorageD2Ev = asm["__ZN8perfetto15trace_processor12TraceStorageD2Ev"]; asm["__ZN8perfetto15trace_processor12TraceStorageD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor12TraceStorageD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTable12CreateCursorEv = asm["__ZN8perfetto15trace_processor13CountersTable12CreateCursorEv"]; asm["__ZN8perfetto15trace_processor13CountersTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTable12CreateCursorEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTable6Cursor3EofEv = asm["__ZN8perfetto15trace_processor13CountersTable6Cursor3EofEv"]; asm["__ZN8perfetto15trace_processor13CountersTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTable6Cursor3EofEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTable6Cursor4NextEv = asm["__ZN8perfetto15trace_processor13CountersTable6Cursor4NextEv"]; asm["__ZN8perfetto15trace_processor13CountersTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTable6Cursor4NextEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTable6Cursor6ColumnEP15sqlite3_contexti = asm["__ZN8perfetto15trace_processor13CountersTable6Cursor6ColumnEP15sqlite3_contexti"]; asm["__ZN8perfetto15trace_processor13CountersTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTable6Cursor6ColumnEP15sqlite3_contexti.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = asm["__ZN8perfetto15trace_processor13CountersTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"]; asm["__ZN8perfetto15trace_processor13CountersTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTable6CursorD0Ev = asm["__ZN8perfetto15trace_processor13CountersTable6CursorD0Ev"]; asm["__ZN8perfetto15trace_processor13CountersTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTable6CursorD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTable6CursorD2Ev = asm["__ZN8perfetto15trace_processor13CountersTable6CursorD2Ev"]; asm["__ZN8perfetto15trace_processor13CountersTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTable6CursorD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = asm["__ZN8perfetto15trace_processor13CountersTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"]; asm["__ZN8perfetto15trace_processor13CountersTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTableD0Ev = asm["__ZN8perfetto15trace_processor13CountersTableD0Ev"]; asm["__ZN8perfetto15trace_processor13CountersTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTableD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor13CountersTableD2Ev = asm["__ZN8perfetto15trace_processor13CountersTableD2Ev"]; asm["__ZN8perfetto15trace_processor13CountersTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor13CountersTableD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor14ProcessTracker12UpdateThreadEjj = asm["__ZN8perfetto15trace_processor14ProcessTracker12UpdateThreadEjj"]; asm["__ZN8perfetto15trace_processor14ProcessTracker12UpdateThreadEjj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor14ProcessTracker12UpdateThreadEjj.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor14ProcessTracker13UpdateProcessEjNS_4base10StringViewE = asm["__ZN8perfetto15trace_processor14ProcessTracker13UpdateProcessEjNS_4base10StringViewE"]; asm["__ZN8perfetto15trace_processor14ProcessTracker13UpdateProcessEjNS_4base10StringViewE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor14ProcessTracker13UpdateProcessEjNS_4base10StringViewE.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor14ProcessTrackerD0Ev = asm["__ZN8perfetto15trace_processor14ProcessTrackerD0Ev"]; asm["__ZN8perfetto15trace_processor14ProcessTrackerD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor14ProcessTrackerD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor14ProcessTrackerD2Ev = asm["__ZN8perfetto15trace_processor14ProcessTrackerD2Ev"]; asm["__ZN8perfetto15trace_processor14ProcessTrackerD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor14ProcessTrackerD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15JsonTraceParser5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj = asm["__ZN8perfetto15trace_processor15JsonTraceParser5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj"]; asm["__ZN8perfetto15trace_processor15JsonTraceParser5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15JsonTraceParser5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15JsonTraceParserD0Ev = asm["__ZN8perfetto15trace_processor15JsonTraceParserD0Ev"]; asm["__ZN8perfetto15trace_processor15JsonTraceParserD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15JsonTraceParserD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15JsonTraceParserD2Ev = asm["__ZN8perfetto15trace_processor15JsonTraceParserD2Ev"]; asm["__ZN8perfetto15trace_processor15JsonTraceParserD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15JsonTraceParserD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTable12CreateCursorEv = asm["__ZN8perfetto15trace_processor15SchedSliceTable12CreateCursorEv"]; asm["__ZN8perfetto15trace_processor15SchedSliceTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTable12CreateCursorEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv = asm["__ZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"]; asm["__ZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTable6Cursor3EofEv = asm["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor3EofEv"]; asm["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTable6Cursor3EofEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTable6Cursor4NextEv = asm["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor4NextEv"]; asm["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTable6Cursor4NextEv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTable6Cursor6ColumnEP15sqlite3_contexti = asm["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor6ColumnEP15sqlite3_contexti"]; asm["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTable6Cursor6ColumnEP15sqlite3_contexti.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = asm["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"]; asm["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTable6CursorD0Ev = asm["__ZN8perfetto15trace_processor15SchedSliceTable6CursorD0Ev"]; asm["__ZN8perfetto15trace_processor15SchedSliceTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTable6CursorD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTable6CursorD2Ev = asm["__ZN8perfetto15trace_processor15SchedSliceTable6CursorD2Ev"]; asm["__ZN8perfetto15trace_processor15SchedSliceTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTable6CursorD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = asm["__ZN8perfetto15trace_processor15SchedSliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"]; asm["__ZN8perfetto15trace_processor15SchedSliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTableD0Ev = asm["__ZN8perfetto15trace_processor15SchedSliceTableD0Ev"]; asm["__ZN8perfetto15trace_processor15SchedSliceTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTableD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor15SchedSliceTableD2Ev = asm["__ZN8perfetto15trace_processor15SchedSliceTableD2Ev"]; asm["__ZN8perfetto15trace_processor15SchedSliceTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor15SchedSliceTableD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor16ProtoTraceParser16ParseTracePacketENS0_13TraceBlobViewE = asm["__ZN8perfetto15trace_processor16ProtoTraceParser16ParseTracePacketENS0_13TraceBlobViewE"]; asm["__ZN8perfetto15trace_processor16ProtoTraceParser16ParseTracePacketENS0_13TraceBlobViewE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor16ProtoTraceParser16ParseTracePacketENS0_13TraceBlobViewE.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor16ProtoTraceParser17ParseFtracePacketEjyNS0_13TraceBlobViewE = asm["__ZN8perfetto15trace_processor16ProtoTraceParser17ParseFtracePacketEjyNS0_13TraceBlobViewE"]; asm["__ZN8perfetto15trace_processor16ProtoTraceParser17ParseFtracePacketEjyNS0_13TraceBlobViewE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor16ProtoTraceParser17ParseFtracePacketEjyNS0_13TraceBlobViewE.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor16ProtoTraceParserD0Ev = asm["__ZN8perfetto15trace_processor16ProtoTraceParserD0Ev"]; asm["__ZN8perfetto15trace_processor16ProtoTraceParserD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor16ProtoTraceParserD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor16ProtoTraceParserD2Ev = asm["__ZN8perfetto15trace_processor16ProtoTraceParserD2Ev"]; asm["__ZN8perfetto15trace_processor16ProtoTraceParserD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor16ProtoTraceParserD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor18ChunkedTraceReaderD0Ev = asm["__ZN8perfetto15trace_processor18ChunkedTraceReaderD0Ev"]; asm["__ZN8perfetto15trace_processor18ChunkedTraceReaderD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor18ChunkedTraceReaderD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor18ChunkedTraceReaderD2Ev = asm["__ZN8perfetto15trace_processor18ChunkedTraceReaderD2Ev"]; asm["__ZN8perfetto15trace_processor18ChunkedTraceReaderD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor18ChunkedTraceReaderD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor19ProtoTraceTokenizer5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj = asm["__ZN8perfetto15trace_processor19ProtoTraceTokenizer5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj"]; asm["__ZN8perfetto15trace_processor19ProtoTraceTokenizer5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor19ProtoTraceTokenizer5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor19ProtoTraceTokenizerD0Ev = asm["__ZN8perfetto15trace_processor19ProtoTraceTokenizerD0Ev"]; asm["__ZN8perfetto15trace_processor19ProtoTraceTokenizerD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor19ProtoTraceTokenizerD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor19ProtoTraceTokenizerD2Ev = asm["__ZN8perfetto15trace_processor19ProtoTraceTokenizerD2Ev"]; asm["__ZN8perfetto15trace_processor19ProtoTraceTokenizerD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor19ProtoTraceTokenizerD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor5Table12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv = asm["__ZN8perfetto15trace_processor5Table12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"]; asm["__ZN8perfetto15trace_processor5Table12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor5Table12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor5Table6CursorD0Ev = asm["__ZN8perfetto15trace_processor5Table6CursorD0Ev"]; asm["__ZN8perfetto15trace_processor5Table6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor5Table6CursorD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor5Table6CursorD2Ev = asm["__ZN8perfetto15trace_processor5Table6CursorD2Ev"]; asm["__ZN8perfetto15trace_processor5Table6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor5Table6CursorD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor5TableD0Ev = asm["__ZN8perfetto15trace_processor5TableD0Ev"]; asm["__ZN8perfetto15trace_processor5TableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor5TableD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto15trace_processor5TableD2Ev = asm["__ZN8perfetto15trace_processor5TableD2Ev"]; asm["__ZN8perfetto15trace_processor5TableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto15trace_processor5TableD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto6protos12RawQueryArgs21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE = asm["__ZN8perfetto6protos12RawQueryArgs21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"]; asm["__ZN8perfetto6protos12RawQueryArgs21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos12RawQueryArgs21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE.apply(null, arguments);
	};

	var real___ZN8perfetto6protos12RawQueryArgs27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE = asm["__ZN8perfetto6protos12RawQueryArgs27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"]; asm["__ZN8perfetto6protos12RawQueryArgs27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos12RawQueryArgs27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE.apply(null, arguments);
	};

	var real___ZN8perfetto6protos12RawQueryArgs5ClearEv = asm["__ZN8perfetto6protos12RawQueryArgs5ClearEv"]; asm["__ZN8perfetto6protos12RawQueryArgs5ClearEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos12RawQueryArgs5ClearEv.apply(null, arguments);
	};

	var real___ZN8perfetto6protos12RawQueryArgsD0Ev = asm["__ZN8perfetto6protos12RawQueryArgsD0Ev"]; asm["__ZN8perfetto6protos12RawQueryArgsD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos12RawQueryArgsD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto6protos12RawQueryArgsD2Ev = asm["__ZN8perfetto6protos12RawQueryArgsD2Ev"]; asm["__ZN8perfetto6protos12RawQueryArgsD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos12RawQueryArgsD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto6protos14RawQueryResult21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE = asm["__ZN8perfetto6protos14RawQueryResult21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"]; asm["__ZN8perfetto6protos14RawQueryResult21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos14RawQueryResult21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE.apply(null, arguments);
	};

	var real___ZN8perfetto6protos14RawQueryResult27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE = asm["__ZN8perfetto6protos14RawQueryResult27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"]; asm["__ZN8perfetto6protos14RawQueryResult27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos14RawQueryResult27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE.apply(null, arguments);
	};

	var real___ZN8perfetto6protos14RawQueryResult5ClearEv = asm["__ZN8perfetto6protos14RawQueryResult5ClearEv"]; asm["__ZN8perfetto6protos14RawQueryResult5ClearEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos14RawQueryResult5ClearEv.apply(null, arguments);
	};

	var real___ZN8perfetto6protos14RawQueryResultD0Ev = asm["__ZN8perfetto6protos14RawQueryResultD0Ev"]; asm["__ZN8perfetto6protos14RawQueryResultD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos14RawQueryResultD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto6protos14RawQueryResultD2Ev = asm["__ZN8perfetto6protos14RawQueryResultD2Ev"]; asm["__ZN8perfetto6protos14RawQueryResultD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos14RawQueryResultD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto6protos25RawQueryResult_ColumnDesc21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE = asm["__ZN8perfetto6protos25RawQueryResult_ColumnDesc21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"]; asm["__ZN8perfetto6protos25RawQueryResult_ColumnDesc21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos25RawQueryResult_ColumnDesc21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE.apply(null, arguments);
	};

	var real___ZN8perfetto6protos25RawQueryResult_ColumnDesc27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE = asm["__ZN8perfetto6protos25RawQueryResult_ColumnDesc27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"]; asm["__ZN8perfetto6protos25RawQueryResult_ColumnDesc27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos25RawQueryResult_ColumnDesc27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE.apply(null, arguments);
	};

	var real___ZN8perfetto6protos25RawQueryResult_ColumnDesc5ClearEv = asm["__ZN8perfetto6protos25RawQueryResult_ColumnDesc5ClearEv"]; asm["__ZN8perfetto6protos25RawQueryResult_ColumnDesc5ClearEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos25RawQueryResult_ColumnDesc5ClearEv.apply(null, arguments);
	};

	var real___ZN8perfetto6protos25RawQueryResult_ColumnDescD0Ev = asm["__ZN8perfetto6protos25RawQueryResult_ColumnDescD0Ev"]; asm["__ZN8perfetto6protos25RawQueryResult_ColumnDescD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos25RawQueryResult_ColumnDescD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto6protos25RawQueryResult_ColumnDescD2Ev = asm["__ZN8perfetto6protos25RawQueryResult_ColumnDescD2Ev"]; asm["__ZN8perfetto6protos25RawQueryResult_ColumnDescD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos25RawQueryResult_ColumnDescD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto6protos27RawQueryResult_ColumnValues21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE = asm["__ZN8perfetto6protos27RawQueryResult_ColumnValues21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"]; asm["__ZN8perfetto6protos27RawQueryResult_ColumnValues21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos27RawQueryResult_ColumnValues21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE.apply(null, arguments);
	};

	var real___ZN8perfetto6protos27RawQueryResult_ColumnValues27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE = asm["__ZN8perfetto6protos27RawQueryResult_ColumnValues27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"]; asm["__ZN8perfetto6protos27RawQueryResult_ColumnValues27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos27RawQueryResult_ColumnValues27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE.apply(null, arguments);
	};

	var real___ZN8perfetto6protos27RawQueryResult_ColumnValues5ClearEv = asm["__ZN8perfetto6protos27RawQueryResult_ColumnValues5ClearEv"]; asm["__ZN8perfetto6protos27RawQueryResult_ColumnValues5ClearEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos27RawQueryResult_ColumnValues5ClearEv.apply(null, arguments);
	};

	var real___ZN8perfetto6protos27RawQueryResult_ColumnValuesD0Ev = asm["__ZN8perfetto6protos27RawQueryResult_ColumnValuesD0Ev"]; asm["__ZN8perfetto6protos27RawQueryResult_ColumnValuesD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos27RawQueryResult_ColumnValuesD0Ev.apply(null, arguments);
	};

	var real___ZN8perfetto6protos27RawQueryResult_ColumnValuesD2Ev = asm["__ZN8perfetto6protos27RawQueryResult_ColumnValuesD2Ev"]; asm["__ZN8perfetto6protos27RawQueryResult_ColumnValuesD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos27RawQueryResult_ColumnValuesD2Ev.apply(null, arguments);
	};

	var real___ZN8perfetto6protos72protobuf_AddDesc_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eproto_implEv = asm["__ZN8perfetto6protos72protobuf_AddDesc_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eproto_implEv"]; asm["__ZN8perfetto6protos72protobuf_AddDesc_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eproto_implEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos72protobuf_AddDesc_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eproto_implEv.apply(null, arguments);
	};

	var real___ZN8perfetto6protos72protobuf_ShutdownFile_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eprotoEv = asm["__ZN8perfetto6protos72protobuf_ShutdownFile_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eprotoEv"]; asm["__ZN8perfetto6protos72protobuf_ShutdownFile_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eprotoEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protos72protobuf_ShutdownFile_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eprotoEv.apply(null, arguments);
	};

	var real___ZN8perfetto6protosL35MutableUnknownFieldsForRawQueryArgsEPNS0_12RawQueryArgsE = asm["__ZN8perfetto6protosL35MutableUnknownFieldsForRawQueryArgsEPNS0_12RawQueryArgsE"]; asm["__ZN8perfetto6protosL35MutableUnknownFieldsForRawQueryArgsEPNS0_12RawQueryArgsE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protosL35MutableUnknownFieldsForRawQueryArgsEPNS0_12RawQueryArgsE.apply(null, arguments);
	};

	var real___ZN8perfetto6protosL37MutableUnknownFieldsForRawQueryResultEPNS0_14RawQueryResultE = asm["__ZN8perfetto6protosL37MutableUnknownFieldsForRawQueryResultEPNS0_14RawQueryResultE"]; asm["__ZN8perfetto6protosL37MutableUnknownFieldsForRawQueryResultEPNS0_14RawQueryResultE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protosL37MutableUnknownFieldsForRawQueryResultEPNS0_14RawQueryResultE.apply(null, arguments);
	};

	var real___ZN8perfetto6protosL48MutableUnknownFieldsForRawQueryResult_ColumnDescEPNS0_25RawQueryResult_ColumnDescE = asm["__ZN8perfetto6protosL48MutableUnknownFieldsForRawQueryResult_ColumnDescEPNS0_25RawQueryResult_ColumnDescE"]; asm["__ZN8perfetto6protosL48MutableUnknownFieldsForRawQueryResult_ColumnDescEPNS0_25RawQueryResult_ColumnDescE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protosL48MutableUnknownFieldsForRawQueryResult_ColumnDescEPNS0_25RawQueryResult_ColumnDescE.apply(null, arguments);
	};

	var real___ZN8perfetto6protosL50MutableUnknownFieldsForRawQueryResult_ColumnValuesEPNS0_27RawQueryResult_ColumnValuesE = asm["__ZN8perfetto6protosL50MutableUnknownFieldsForRawQueryResult_ColumnValuesEPNS0_27RawQueryResult_ColumnValuesE"]; asm["__ZN8perfetto6protosL50MutableUnknownFieldsForRawQueryResult_ColumnValuesEPNS0_27RawQueryResult_ColumnValuesE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZN8perfetto6protosL50MutableUnknownFieldsForRawQueryResult_ColumnValuesEPNS0_27RawQueryResult_ColumnValuesE.apply(null, arguments);
	};

	var real___ZNK6google8protobuf11MessageLite20GetMaybeArenaPointerEv = asm["__ZNK6google8protobuf11MessageLite20GetMaybeArenaPointerEv"]; asm["__ZNK6google8protobuf11MessageLite20GetMaybeArenaPointerEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK6google8protobuf11MessageLite20GetMaybeArenaPointerEv.apply(null, arguments);
	};

	var real___ZNK6google8protobuf11MessageLite25InitializationErrorStringEv = asm["__ZNK6google8protobuf11MessageLite25InitializationErrorStringEv"]; asm["__ZNK6google8protobuf11MessageLite25InitializationErrorStringEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK6google8protobuf11MessageLite25InitializationErrorStringEv.apply(null, arguments);
	};

	var real___ZNK6google8protobuf11MessageLite31SerializeWithCachedSizesToArrayEPh = asm["__ZNK6google8protobuf11MessageLite31SerializeWithCachedSizesToArrayEPh"]; asm["__ZNK6google8protobuf11MessageLite31SerializeWithCachedSizesToArrayEPh"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK6google8protobuf11MessageLite31SerializeWithCachedSizesToArrayEPh.apply(null, arguments);
	};

	var real___ZNK6google8protobuf11MessageLite3NewEPNS0_5ArenaE = asm["__ZNK6google8protobuf11MessageLite3NewEPNS0_5ArenaE"]; asm["__ZNK6google8protobuf11MessageLite3NewEPNS0_5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK6google8protobuf11MessageLite3NewEPNS0_5ArenaE.apply(null, arguments);
	};

	var real___ZNK6google8protobuf11MessageLite8GetArenaEv = asm["__ZNK6google8protobuf11MessageLite8GetArenaEv"]; asm["__ZNK6google8protobuf11MessageLite8GetArenaEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK6google8protobuf11MessageLite8GetArenaEv.apply(null, arguments);
	};

	var real___ZNK6google8protobuf2io17ArrayOutputStream9ByteCountEv = asm["__ZNK6google8protobuf2io17ArrayOutputStream9ByteCountEv"]; asm["__ZNK6google8protobuf2io17ArrayOutputStream9ByteCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK6google8protobuf2io17ArrayOutputStream9ByteCountEv.apply(null, arguments);
	};

	var real___ZNK6google8protobuf2io18StringOutputStream9ByteCountEv = asm["__ZNK6google8protobuf2io18StringOutputStream9ByteCountEv"]; asm["__ZNK6google8protobuf2io18StringOutputStream9ByteCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK6google8protobuf2io18StringOutputStream9ByteCountEv.apply(null, arguments);
	};

	var real___ZNK6google8protobuf2io20ZeroCopyOutputStream14AllowsAliasingEv = asm["__ZNK6google8protobuf2io20ZeroCopyOutputStream14AllowsAliasingEv"]; asm["__ZNK6google8protobuf2io20ZeroCopyOutputStream14AllowsAliasingEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK6google8protobuf2io20ZeroCopyOutputStream14AllowsAliasingEv.apply(null, arguments);
	};

	var real___ZNK6google8protobuf2io22LazyStringOutputStream9ByteCountEv = asm["__ZNK6google8protobuf2io22LazyStringOutputStream9ByteCountEv"]; asm["__ZNK6google8protobuf2io22LazyStringOutputStream9ByteCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK6google8protobuf2io22LazyStringOutputStream9ByteCountEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos12RawQueryArgs11GetTypeNameEv = asm["__ZNK8perfetto6protos12RawQueryArgs11GetTypeNameEv"]; asm["__ZNK8perfetto6protos12RawQueryArgs11GetTypeNameEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos12RawQueryArgs11GetTypeNameEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos12RawQueryArgs13GetCachedSizeEv = asm["__ZNK8perfetto6protos12RawQueryArgs13GetCachedSizeEv"]; asm["__ZNK8perfetto6protos12RawQueryArgs13GetCachedSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos12RawQueryArgs13GetCachedSizeEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos12RawQueryArgs13IsInitializedEv = asm["__ZNK8perfetto6protos12RawQueryArgs13IsInitializedEv"]; asm["__ZNK8perfetto6protos12RawQueryArgs13IsInitializedEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos12RawQueryArgs13IsInitializedEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos12RawQueryArgs24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE = asm["__ZNK8perfetto6protos12RawQueryArgs24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"]; asm["__ZNK8perfetto6protos12RawQueryArgs24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos12RawQueryArgs24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos12RawQueryArgs3NewEPN6google8protobuf5ArenaE = asm["__ZNK8perfetto6protos12RawQueryArgs3NewEPN6google8protobuf5ArenaE"]; asm["__ZNK8perfetto6protos12RawQueryArgs3NewEPN6google8protobuf5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos12RawQueryArgs3NewEPN6google8protobuf5ArenaE.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos12RawQueryArgs3NewEv = asm["__ZNK8perfetto6protos12RawQueryArgs3NewEv"]; asm["__ZNK8perfetto6protos12RawQueryArgs3NewEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos12RawQueryArgs3NewEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos12RawQueryArgs8ByteSizeEv = asm["__ZNK8perfetto6protos12RawQueryArgs8ByteSizeEv"]; asm["__ZNK8perfetto6protos12RawQueryArgs8ByteSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos12RawQueryArgs8ByteSizeEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos14RawQueryResult11GetTypeNameEv = asm["__ZNK8perfetto6protos14RawQueryResult11GetTypeNameEv"]; asm["__ZNK8perfetto6protos14RawQueryResult11GetTypeNameEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos14RawQueryResult11GetTypeNameEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos14RawQueryResult13GetCachedSizeEv = asm["__ZNK8perfetto6protos14RawQueryResult13GetCachedSizeEv"]; asm["__ZNK8perfetto6protos14RawQueryResult13GetCachedSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos14RawQueryResult13GetCachedSizeEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos14RawQueryResult13IsInitializedEv = asm["__ZNK8perfetto6protos14RawQueryResult13IsInitializedEv"]; asm["__ZNK8perfetto6protos14RawQueryResult13IsInitializedEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos14RawQueryResult13IsInitializedEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos14RawQueryResult24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE = asm["__ZNK8perfetto6protos14RawQueryResult24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"]; asm["__ZNK8perfetto6protos14RawQueryResult24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos14RawQueryResult24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos14RawQueryResult3NewEPN6google8protobuf5ArenaE = asm["__ZNK8perfetto6protos14RawQueryResult3NewEPN6google8protobuf5ArenaE"]; asm["__ZNK8perfetto6protos14RawQueryResult3NewEPN6google8protobuf5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos14RawQueryResult3NewEPN6google8protobuf5ArenaE.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos14RawQueryResult3NewEv = asm["__ZNK8perfetto6protos14RawQueryResult3NewEv"]; asm["__ZNK8perfetto6protos14RawQueryResult3NewEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos14RawQueryResult3NewEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos14RawQueryResult8ByteSizeEv = asm["__ZNK8perfetto6protos14RawQueryResult8ByteSizeEv"]; asm["__ZNK8perfetto6protos14RawQueryResult8ByteSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos14RawQueryResult8ByteSizeEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc11GetTypeNameEv = asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc11GetTypeNameEv"]; asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc11GetTypeNameEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc11GetTypeNameEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc13GetCachedSizeEv = asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc13GetCachedSizeEv"]; asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc13GetCachedSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc13GetCachedSizeEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc13IsInitializedEv = asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc13IsInitializedEv"]; asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc13IsInitializedEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc13IsInitializedEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE = asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"]; asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEPN6google8protobuf5ArenaE = asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEPN6google8protobuf5ArenaE"]; asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEPN6google8protobuf5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEPN6google8protobuf5ArenaE.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEv = asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEv"]; asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc8ByteSizeEv = asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc8ByteSizeEv"]; asm["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc8ByteSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos25RawQueryResult_ColumnDesc8ByteSizeEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos27RawQueryResult_ColumnValues11GetTypeNameEv = asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues11GetTypeNameEv"]; asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues11GetTypeNameEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos27RawQueryResult_ColumnValues11GetTypeNameEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos27RawQueryResult_ColumnValues13GetCachedSizeEv = asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues13GetCachedSizeEv"]; asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues13GetCachedSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos27RawQueryResult_ColumnValues13GetCachedSizeEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos27RawQueryResult_ColumnValues13IsInitializedEv = asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues13IsInitializedEv"]; asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues13IsInitializedEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos27RawQueryResult_ColumnValues13IsInitializedEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos27RawQueryResult_ColumnValues24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE = asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"]; asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos27RawQueryResult_ColumnValues24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEPN6google8protobuf5ArenaE = asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEPN6google8protobuf5ArenaE"]; asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEPN6google8protobuf5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEPN6google8protobuf5ArenaE.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEv = asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEv"]; asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEv.apply(null, arguments);
	};

	var real___ZNK8perfetto6protos27RawQueryResult_ColumnValues8ByteSizeEv = asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues8ByteSizeEv"]; asm["__ZNK8perfetto6protos27RawQueryResult_ColumnValues8ByteSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNK8perfetto6protos27RawQueryResult_ColumnValues8ByteSizeEv.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEPNS0_6__baseISA_EE = asm["__ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEPNS0_6__baseISA_EE"]; asm["__ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEPNS0_6__baseISA_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEPNS0_6__baseISA_EE.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEv = asm["__ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEv"]; asm["__ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEv.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE.apply(null, arguments);
	};

	var real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"]; asm["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED0Ev = asm["__ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED0Ev"]; asm["__ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED0Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED2Ev = asm["__ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED2Ev"]; asm["__ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED2Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED0Ev = asm["__ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED0Ev"]; asm["__ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED0Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED2Ev = asm["__ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED2Ev"]; asm["__ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED2Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE18destroy_deallocateEv = asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE18destroy_deallocateEv"]; asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE18destroy_deallocateEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7destroyEv = asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7destroyEv"]; asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7destroyEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED0Ev = asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED0Ev"]; asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED0Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED2Ev = asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED2Ev"]; asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED2Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEEclES9_ = asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEEclES9_"]; asm["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEEclES9_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEEclES9_.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev.apply(null, arguments);
	};

	var real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"]; asm["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPvEN3__08__invokeES5_iS8_ = asm["__ZZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPvEN3__08__invokeES5_iS8_"]; asm["__ZZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPvEN3__08__invokeES5_iS8_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPvEN3__08__invokeES5_iS8_.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__08__invokeES3_PviPKPKcPP12sqlite3_vtabPPc = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__08__invokeES3_PviPKPKcPP12sqlite3_vtabPPc"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__08__invokeES3_PviPKPKcPP12sqlite3_vtabPPc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__08__invokeES3_PviPKPKcPP12sqlite3_vtabPPc.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__18__invokeEP12sqlite3_vtab = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__18__invokeEP12sqlite3_vtab"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__18__invokeEP12sqlite3_vtab"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__18__invokeEP12sqlite3_vtab.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__28__invokeEP12sqlite3_vtabPP19sqlite3_vtab_cursor = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__28__invokeEP12sqlite3_vtabPP19sqlite3_vtab_cursor"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__28__invokeEP12sqlite3_vtabPP19sqlite3_vtab_cursor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__28__invokeEP12sqlite3_vtabPP19sqlite3_vtab_cursor.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__38__invokeEP19sqlite3_vtab_cursor = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__38__invokeEP19sqlite3_vtab_cursor"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__38__invokeEP19sqlite3_vtab_cursor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__38__invokeEP19sqlite3_vtab_cursor.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__48__invokeEP12sqlite3_vtabP18sqlite3_index_info = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__48__invokeEP12sqlite3_vtabP18sqlite3_index_info"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__48__invokeEP12sqlite3_vtabP18sqlite3_index_info"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__48__invokeEP12sqlite3_vtabP18sqlite3_index_info.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__58__invokeEP19sqlite3_vtab_cursoriPKciPP13sqlite3_value = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__58__invokeEP19sqlite3_vtab_cursoriPKciPP13sqlite3_value"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__58__invokeEP19sqlite3_vtab_cursoriPKciPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__58__invokeEP19sqlite3_vtab_cursoriPKciPP13sqlite3_value.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__68__invokeEP19sqlite3_vtab_cursor = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__68__invokeEP19sqlite3_vtab_cursor"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__68__invokeEP19sqlite3_vtab_cursor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__68__invokeEP19sqlite3_vtab_cursor.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__78__invokeEP19sqlite3_vtab_cursor = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__78__invokeEP19sqlite3_vtab_cursor"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__78__invokeEP19sqlite3_vtab_cursor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__78__invokeEP19sqlite3_vtab_cursor.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__88__invokeEP19sqlite3_vtab_cursorP15sqlite3_contexti = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__88__invokeEP19sqlite3_vtab_cursorP15sqlite3_contexti"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__88__invokeEP19sqlite3_vtab_cursorP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__88__invokeEP19sqlite3_vtab_cursorP15sqlite3_contexti.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__98__invokeEP19sqlite3_vtab_cursorPx = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__98__invokeEP19sqlite3_vtab_cursorPx"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__98__invokeEP19sqlite3_vtab_cursorPx"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__98__invokeEP19sqlite3_vtab_cursorPx.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__108__invokeEP12sqlite3_vtabiPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__108__invokeEP12sqlite3_vtabiPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__108__invokeEP12sqlite3_vtabiPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__108__invokeEP12sqlite3_vtabiPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv.apply(null, arguments);
	};

	var real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__118__invokeEPv = asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__118__invokeEPv"]; asm["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__118__invokeEPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real___ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__118__invokeEPv.apply(null, arguments);
	};

	var real____mmap = asm["___mmap"]; asm["___mmap"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real____mmap.apply(null, arguments);
	};

	var real____munmap = asm["___munmap"]; asm["___munmap"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real____munmap.apply(null, arguments);
	};

	var real____stdio_close = asm["___stdio_close"]; asm["___stdio_close"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real____stdio_close.apply(null, arguments);
	};

	var real____stdio_seek = asm["___stdio_seek"]; asm["___stdio_seek"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real____stdio_seek.apply(null, arguments);
	};

	var real____stdio_write = asm["___stdio_write"]; asm["___stdio_write"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real____stdio_write.apply(null, arguments);
	};

	var real____stdout_write = asm["___stdout_write"]; asm["___stdout_write"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real____stdout_write.apply(null, arguments);
	};

	var real__absFunc = asm["_absFunc"]; asm["_absFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__absFunc.apply(null, arguments);
	};

	var real__access = asm["_access"]; asm["_access"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__access.apply(null, arguments);
	};

	var real__analysisLoader = asm["_analysisLoader"]; asm["_analysisLoader"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__analysisLoader.apply(null, arguments);
	};

	var real__analyzeAggregate = asm["_analyzeAggregate"]; asm["_analyzeAggregate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__analyzeAggregate.apply(null, arguments);
	};

	var real__analyzeAggregatesInSelect = asm["_analyzeAggregatesInSelect"]; asm["_analyzeAggregatesInSelect"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__analyzeAggregatesInSelect.apply(null, arguments);
	};

	var real__analyzeAggregatesInSelectEnd = asm["_analyzeAggregatesInSelectEnd"]; asm["_analyzeAggregatesInSelectEnd"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__analyzeAggregatesInSelectEnd.apply(null, arguments);
	};

	var real__attachFunc = asm["_attachFunc"]; asm["_attachFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__attachFunc.apply(null, arguments);
	};

	var real__avgFinalize = asm["_avgFinalize"]; asm["_avgFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__avgFinalize.apply(null, arguments);
	};

	var real__binCollFunc = asm["_binCollFunc"]; asm["_binCollFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__binCollFunc.apply(null, arguments);
	};

	var real__btreeInvokeBusyHandler = asm["_btreeInvokeBusyHandler"]; asm["_btreeInvokeBusyHandler"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__btreeInvokeBusyHandler.apply(null, arguments);
	};

	var real__btreeParseCellPtr = asm["_btreeParseCellPtr"]; asm["_btreeParseCellPtr"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__btreeParseCellPtr.apply(null, arguments);
	};

	var real__btreeParseCellPtrIndex = asm["_btreeParseCellPtrIndex"]; asm["_btreeParseCellPtrIndex"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__btreeParseCellPtrIndex.apply(null, arguments);
	};

	var real__btreeParseCellPtrNoPayload = asm["_btreeParseCellPtrNoPayload"]; asm["_btreeParseCellPtrNoPayload"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__btreeParseCellPtrNoPayload.apply(null, arguments);
	};

	var real__cdateFunc = asm["_cdateFunc"]; asm["_cdateFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__cdateFunc.apply(null, arguments);
	};

	var real__cellSizePtr = asm["_cellSizePtr"]; asm["_cellSizePtr"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__cellSizePtr.apply(null, arguments);
	};

	var real__cellSizePtrNoPayload = asm["_cellSizePtrNoPayload"]; asm["_cellSizePtrNoPayload"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__cellSizePtrNoPayload.apply(null, arguments);
	};

	var real__changes = asm["_changes"]; asm["_changes"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__changes.apply(null, arguments);
	};

	var real__charFunc = asm["_charFunc"]; asm["_charFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__charFunc.apply(null, arguments);
	};

	var real__checkConstraintExprNode = asm["_checkConstraintExprNode"]; asm["_checkConstraintExprNode"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__checkConstraintExprNode.apply(null, arguments);
	};

	var real__close = asm["_close"]; asm["_close"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__close.apply(null, arguments);
	};

	var real__compileoptiongetFunc = asm["_compileoptiongetFunc"]; asm["_compileoptiongetFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__compileoptiongetFunc.apply(null, arguments);
	};

	var real__compileoptionusedFunc = asm["_compileoptionusedFunc"]; asm["_compileoptionusedFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__compileoptionusedFunc.apply(null, arguments);
	};

	var real__convertCompoundSelectToSubquery = asm["_convertCompoundSelectToSubquery"]; asm["_convertCompoundSelectToSubquery"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__convertCompoundSelectToSubquery.apply(null, arguments);
	};

	var real__countFinalize = asm["_countFinalize"]; asm["_countFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__countFinalize.apply(null, arguments);
	};

	var real__countStep = asm["_countStep"]; asm["_countStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__countStep.apply(null, arguments);
	};

	var real__ctimeFunc = asm["_ctimeFunc"]; asm["_ctimeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__ctimeFunc.apply(null, arguments);
	};

	var real__ctimestampFunc = asm["_ctimestampFunc"]; asm["_ctimestampFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__ctimestampFunc.apply(null, arguments);
	};

	var real__dateFunc = asm["_dateFunc"]; asm["_dateFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__dateFunc.apply(null, arguments);
	};

	var real__datetimeFunc = asm["_datetimeFunc"]; asm["_datetimeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__datetimeFunc.apply(null, arguments);
	};

	var real__detachFunc = asm["_detachFunc"]; asm["_detachFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__detachFunc.apply(null, arguments);
	};

	var real__do_read = asm["_do_read"]; asm["_do_read"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__do_read.apply(null, arguments);
	};

	var real__dotlockCheckReservedLock = asm["_dotlockCheckReservedLock"]; asm["_dotlockCheckReservedLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__dotlockCheckReservedLock.apply(null, arguments);
	};

	var real__dotlockClose = asm["_dotlockClose"]; asm["_dotlockClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__dotlockClose.apply(null, arguments);
	};

	var real__dotlockIoFinderImpl = asm["_dotlockIoFinderImpl"]; asm["_dotlockIoFinderImpl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__dotlockIoFinderImpl.apply(null, arguments);
	};

	var real__dotlockLock = asm["_dotlockLock"]; asm["_dotlockLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__dotlockLock.apply(null, arguments);
	};

	var real__dotlockUnlock = asm["_dotlockUnlock"]; asm["_dotlockUnlock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__dotlockUnlock.apply(null, arguments);
	};

	var real__errlogFunc = asm["_errlogFunc"]; asm["_errlogFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__errlogFunc.apply(null, arguments);
	};

	var real__exprIdxCover = asm["_exprIdxCover"]; asm["_exprIdxCover"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__exprIdxCover.apply(null, arguments);
	};

	var real__exprNodeIsConstant = asm["_exprNodeIsConstant"]; asm["_exprNodeIsConstant"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__exprNodeIsConstant.apply(null, arguments);
	};

	var real__exprNodeIsConstantOrGroupBy = asm["_exprNodeIsConstantOrGroupBy"]; asm["_exprNodeIsConstantOrGroupBy"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__exprNodeIsConstantOrGroupBy.apply(null, arguments);
	};

	var real__exprNodeIsDeterministic = asm["_exprNodeIsDeterministic"]; asm["_exprNodeIsDeterministic"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__exprNodeIsDeterministic.apply(null, arguments);
	};

	var real__exprSrcCount = asm["_exprSrcCount"]; asm["_exprSrcCount"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__exprSrcCount.apply(null, arguments);
	};

	var real__fchmod = asm["_fchmod"]; asm["_fchmod"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__fchmod.apply(null, arguments);
	};

	var real__fchown = asm["_fchown"]; asm["_fchown"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__fchown.apply(null, arguments);
	};

	var real__fcntl = asm["_fcntl"]; asm["_fcntl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__fcntl.apply(null, arguments);
	};

	var real__free = asm["_free"]; asm["_free"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__free.apply(null, arguments);
	};

	var real__fstat = asm["_fstat"]; asm["_fstat"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__fstat.apply(null, arguments);
	};

	var real__ftruncate = asm["_ftruncate"]; asm["_ftruncate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__ftruncate.apply(null, arguments);
	};

	var real__getPageError = asm["_getPageError"]; asm["_getPageError"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__getPageError.apply(null, arguments);
	};

	var real__getPageNormal = asm["_getPageNormal"]; asm["_getPageNormal"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__getPageNormal.apply(null, arguments);
	};

	var real__getcwd = asm["_getcwd"]; asm["_getcwd"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__getcwd.apply(null, arguments);
	};

	var real__geteuid = asm["_geteuid"]; asm["_geteuid"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__geteuid.apply(null, arguments);
	};

	var real__groupConcatFinalize = asm["_groupConcatFinalize"]; asm["_groupConcatFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__groupConcatFinalize.apply(null, arguments);
	};

	var real__groupConcatStep = asm["_groupConcatStep"]; asm["_groupConcatStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__groupConcatStep.apply(null, arguments);
	};

	var real__havingToWhereExprCb = asm["_havingToWhereExprCb"]; asm["_havingToWhereExprCb"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__havingToWhereExprCb.apply(null, arguments);
	};

	var real__hexFunc = asm["_hexFunc"]; asm["_hexFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__hexFunc.apply(null, arguments);
	};

	var real__impliesNotNullRow = asm["_impliesNotNullRow"]; asm["_impliesNotNullRow"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__impliesNotNullRow.apply(null, arguments);
	};

	var real__incrAggDepth = asm["_incrAggDepth"]; asm["_incrAggDepth"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__incrAggDepth.apply(null, arguments);
	};

	var real__instrFunc = asm["_instrFunc"]; asm["_instrFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__instrFunc.apply(null, arguments);
	};

	var real__juliandayFunc = asm["_juliandayFunc"]; asm["_juliandayFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__juliandayFunc.apply(null, arguments);
	};

	var real__last_insert_rowid = asm["_last_insert_rowid"]; asm["_last_insert_rowid"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__last_insert_rowid.apply(null, arguments);
	};

	var real__lengthFunc = asm["_lengthFunc"]; asm["_lengthFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__lengthFunc.apply(null, arguments);
	};

	var real__likeFunc = asm["_likeFunc"]; asm["_likeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__likeFunc.apply(null, arguments);
	};

	var real__llvm_bswap_i32 = asm["_llvm_bswap_i32"]; asm["_llvm_bswap_i32"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__llvm_bswap_i32.apply(null, arguments);
	};

	var real__lowerFunc = asm["_lowerFunc"]; asm["_lowerFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__lowerFunc.apply(null, arguments);
	};

	var real__lstat = asm["_lstat"]; asm["_lstat"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__lstat.apply(null, arguments);
	};

	var real__malloc = asm["_malloc"]; asm["_malloc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__malloc.apply(null, arguments);
	};

	var real__memalign = asm["_memalign"]; asm["_memalign"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__memalign.apply(null, arguments);
	};

	var real__memjrnlClose = asm["_memjrnlClose"]; asm["_memjrnlClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__memjrnlClose.apply(null, arguments);
	};

	var real__memjrnlFileSize = asm["_memjrnlFileSize"]; asm["_memjrnlFileSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__memjrnlFileSize.apply(null, arguments);
	};

	var real__memjrnlRead = asm["_memjrnlRead"]; asm["_memjrnlRead"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__memjrnlRead.apply(null, arguments);
	};

	var real__memjrnlSync = asm["_memjrnlSync"]; asm["_memjrnlSync"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__memjrnlSync.apply(null, arguments);
	};

	var real__memjrnlTruncate = asm["_memjrnlTruncate"]; asm["_memjrnlTruncate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__memjrnlTruncate.apply(null, arguments);
	};

	var real__memjrnlWrite = asm["_memjrnlWrite"]; asm["_memjrnlWrite"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__memjrnlWrite.apply(null, arguments);
	};

	var real__memmove = asm["_memmove"]; asm["_memmove"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__memmove.apply(null, arguments);
	};

	var real__minMaxFinalize = asm["_minMaxFinalize"]; asm["_minMaxFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__minMaxFinalize.apply(null, arguments);
	};

	var real__minmaxFunc = asm["_minmaxFunc"]; asm["_minmaxFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__minmaxFunc.apply(null, arguments);
	};

	var real__minmaxStep = asm["_minmaxStep"]; asm["_minmaxStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__minmaxStep.apply(null, arguments);
	};

	var real__mkdir = asm["_mkdir"]; asm["_mkdir"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__mkdir.apply(null, arguments);
	};

	var real__nocaseCollatingFunc = asm["_nocaseCollatingFunc"]; asm["_nocaseCollatingFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__nocaseCollatingFunc.apply(null, arguments);
	};

	var real__nolockCheckReservedLock = asm["_nolockCheckReservedLock"]; asm["_nolockCheckReservedLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__nolockCheckReservedLock.apply(null, arguments);
	};

	var real__nolockClose = asm["_nolockClose"]; asm["_nolockClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__nolockClose.apply(null, arguments);
	};

	var real__nolockIoFinderImpl = asm["_nolockIoFinderImpl"]; asm["_nolockIoFinderImpl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__nolockIoFinderImpl.apply(null, arguments);
	};

	var real__nolockLock = asm["_nolockLock"]; asm["_nolockLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__nolockLock.apply(null, arguments);
	};

	var real__nolockUnlock = asm["_nolockUnlock"]; asm["_nolockUnlock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__nolockUnlock.apply(null, arguments);
	};

	var real__nullifFunc = asm["_nullifFunc"]; asm["_nullifFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__nullifFunc.apply(null, arguments);
	};

	var real__openDirectory = asm["_openDirectory"]; asm["_openDirectory"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__openDirectory.apply(null, arguments);
	};

	var real__pageReinit = asm["_pageReinit"]; asm["_pageReinit"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pageReinit.apply(null, arguments);
	};

	var real__pagerStress = asm["_pagerStress"]; asm["_pagerStress"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pagerStress.apply(null, arguments);
	};

	var real__pagerUndoCallback = asm["_pagerUndoCallback"]; asm["_pagerUndoCallback"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pagerUndoCallback.apply(null, arguments);
	};

	var real__pcache1Cachesize = asm["_pcache1Cachesize"]; asm["_pcache1Cachesize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Cachesize.apply(null, arguments);
	};

	var real__pcache1Create = asm["_pcache1Create"]; asm["_pcache1Create"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Create.apply(null, arguments);
	};

	var real__pcache1Destroy = asm["_pcache1Destroy"]; asm["_pcache1Destroy"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Destroy.apply(null, arguments);
	};

	var real__pcache1Fetch = asm["_pcache1Fetch"]; asm["_pcache1Fetch"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Fetch.apply(null, arguments);
	};

	var real__pcache1Init = asm["_pcache1Init"]; asm["_pcache1Init"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Init.apply(null, arguments);
	};

	var real__pcache1Pagecount = asm["_pcache1Pagecount"]; asm["_pcache1Pagecount"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Pagecount.apply(null, arguments);
	};

	var real__pcache1Rekey = asm["_pcache1Rekey"]; asm["_pcache1Rekey"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Rekey.apply(null, arguments);
	};

	var real__pcache1Shrink = asm["_pcache1Shrink"]; asm["_pcache1Shrink"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Shrink.apply(null, arguments);
	};

	var real__pcache1Shutdown = asm["_pcache1Shutdown"]; asm["_pcache1Shutdown"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Shutdown.apply(null, arguments);
	};

	var real__pcache1Truncate = asm["_pcache1Truncate"]; asm["_pcache1Truncate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Truncate.apply(null, arguments);
	};

	var real__pcache1Unpin = asm["_pcache1Unpin"]; asm["_pcache1Unpin"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pcache1Unpin.apply(null, arguments);
	};

	var real__posixIoFinderImpl = asm["_posixIoFinderImpl"]; asm["_posixIoFinderImpl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__posixIoFinderImpl.apply(null, arguments);
	};

	var real__posixOpen = asm["_posixOpen"]; asm["_posixOpen"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__posixOpen.apply(null, arguments);
	};

	var real__pragmaVtabBestIndex = asm["_pragmaVtabBestIndex"]; asm["_pragmaVtabBestIndex"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabBestIndex.apply(null, arguments);
	};

	var real__pragmaVtabClose = asm["_pragmaVtabClose"]; asm["_pragmaVtabClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabClose.apply(null, arguments);
	};

	var real__pragmaVtabColumn = asm["_pragmaVtabColumn"]; asm["_pragmaVtabColumn"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabColumn.apply(null, arguments);
	};

	var real__pragmaVtabConnect = asm["_pragmaVtabConnect"]; asm["_pragmaVtabConnect"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabConnect.apply(null, arguments);
	};

	var real__pragmaVtabDisconnect = asm["_pragmaVtabDisconnect"]; asm["_pragmaVtabDisconnect"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabDisconnect.apply(null, arguments);
	};

	var real__pragmaVtabEof = asm["_pragmaVtabEof"]; asm["_pragmaVtabEof"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabEof.apply(null, arguments);
	};

	var real__pragmaVtabFilter = asm["_pragmaVtabFilter"]; asm["_pragmaVtabFilter"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabFilter.apply(null, arguments);
	};

	var real__pragmaVtabNext = asm["_pragmaVtabNext"]; asm["_pragmaVtabNext"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabNext.apply(null, arguments);
	};

	var real__pragmaVtabOpen = asm["_pragmaVtabOpen"]; asm["_pragmaVtabOpen"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabOpen.apply(null, arguments);
	};

	var real__pragmaVtabRowid = asm["_pragmaVtabRowid"]; asm["_pragmaVtabRowid"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pragmaVtabRowid.apply(null, arguments);
	};

	var real__printfFunc = asm["_printfFunc"]; asm["_printfFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__printfFunc.apply(null, arguments);
	};

	var real__pthread_mutex_lock = asm["_pthread_mutex_lock"]; asm["_pthread_mutex_lock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pthread_mutex_lock.apply(null, arguments);
	};

	var real__pthread_mutex_unlock = asm["_pthread_mutex_unlock"]; asm["_pthread_mutex_unlock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__pthread_mutex_unlock.apply(null, arguments);
	};

	var real__quoteFunc = asm["_quoteFunc"]; asm["_quoteFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__quoteFunc.apply(null, arguments);
	};

	var real__randomBlob = asm["_randomBlob"]; asm["_randomBlob"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__randomBlob.apply(null, arguments);
	};

	var real__randomFunc = asm["_randomFunc"]; asm["_randomFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__randomFunc.apply(null, arguments);
	};

	var real__read = asm["_read"]; asm["_read"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__read.apply(null, arguments);
	};

	var real__readlink = asm["_readlink"]; asm["_readlink"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__readlink.apply(null, arguments);
	};

	var real__renameParentFunc = asm["_renameParentFunc"]; asm["_renameParentFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__renameParentFunc.apply(null, arguments);
	};

	var real__renameTableFunc = asm["_renameTableFunc"]; asm["_renameTableFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__renameTableFunc.apply(null, arguments);
	};

	var real__renameTriggerFunc = asm["_renameTriggerFunc"]; asm["_renameTriggerFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__renameTriggerFunc.apply(null, arguments);
	};

	var real__replaceFunc = asm["_replaceFunc"]; asm["_replaceFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__replaceFunc.apply(null, arguments);
	};

	var real__resolveExprStep = asm["_resolveExprStep"]; asm["_resolveExprStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__resolveExprStep.apply(null, arguments);
	};

	var real__resolveSelectStep = asm["_resolveSelectStep"]; asm["_resolveSelectStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__resolveSelectStep.apply(null, arguments);
	};

	var real__rmdir = asm["_rmdir"]; asm["_rmdir"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__rmdir.apply(null, arguments);
	};

	var real__round = asm["_round"]; asm["_round"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__round.apply(null, arguments);
	};

	var real__roundFunc = asm["_roundFunc"]; asm["_roundFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__roundFunc.apply(null, arguments);
	};

	var real__sbrk = asm["_sbrk"]; asm["_sbrk"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sbrk.apply(null, arguments);
	};

	var real__selectAddSubqueryTypeInfo = asm["_selectAddSubqueryTypeInfo"]; asm["_selectAddSubqueryTypeInfo"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__selectAddSubqueryTypeInfo.apply(null, arguments);
	};

	var real__selectExpander = asm["_selectExpander"]; asm["_selectExpander"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__selectExpander.apply(null, arguments);
	};

	var real__selectPopWith = asm["_selectPopWith"]; asm["_selectPopWith"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__selectPopWith.apply(null, arguments);
	};

	var real__sn_write = asm["_sn_write"]; asm["_sn_write"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sn_write.apply(null, arguments);
	};

	var real__sourceidFunc = asm["_sourceidFunc"]; asm["_sourceidFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sourceidFunc.apply(null, arguments);
	};

	var real__sqlite3BtreeNext = asm["_sqlite3BtreeNext"]; asm["_sqlite3BtreeNext"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3BtreeNext.apply(null, arguments);
	};

	var real__sqlite3BtreePrevious = asm["_sqlite3BtreePrevious"]; asm["_sqlite3BtreePrevious"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3BtreePrevious.apply(null, arguments);
	};

	var real__sqlite3ExprIfFalse = asm["_sqlite3ExprIfFalse"]; asm["_sqlite3ExprIfFalse"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3ExprIfFalse.apply(null, arguments);
	};

	var real__sqlite3ExprIfTrue = asm["_sqlite3ExprIfTrue"]; asm["_sqlite3ExprIfTrue"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3ExprIfTrue.apply(null, arguments);
	};

	var real__sqlite3ExprWalkNoop = asm["_sqlite3ExprWalkNoop"]; asm["_sqlite3ExprWalkNoop"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3ExprWalkNoop.apply(null, arguments);
	};

	var real__sqlite3InitCallback = asm["_sqlite3InitCallback"]; asm["_sqlite3InitCallback"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3InitCallback.apply(null, arguments);
	};

	var real__sqlite3InvalidFunction = asm["_sqlite3InvalidFunction"]; asm["_sqlite3InvalidFunction"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3InvalidFunction.apply(null, arguments);
	};

	var real__sqlite3MallocSize = asm["_sqlite3MallocSize"]; asm["_sqlite3MallocSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3MallocSize.apply(null, arguments);
	};

	var real__sqlite3MemFree = asm["_sqlite3MemFree"]; asm["_sqlite3MemFree"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3MemFree.apply(null, arguments);
	};

	var real__sqlite3MemInit = asm["_sqlite3MemInit"]; asm["_sqlite3MemInit"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3MemInit.apply(null, arguments);
	};

	var real__sqlite3MemMalloc = asm["_sqlite3MemMalloc"]; asm["_sqlite3MemMalloc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3MemMalloc.apply(null, arguments);
	};

	var real__sqlite3MemRealloc = asm["_sqlite3MemRealloc"]; asm["_sqlite3MemRealloc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3MemRealloc.apply(null, arguments);
	};

	var real__sqlite3MemRoundup = asm["_sqlite3MemRoundup"]; asm["_sqlite3MemRoundup"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3MemRoundup.apply(null, arguments);
	};

	var real__sqlite3MemShutdown = asm["_sqlite3MemShutdown"]; asm["_sqlite3MemShutdown"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3MemShutdown.apply(null, arguments);
	};

	var real__sqlite3MemSize = asm["_sqlite3MemSize"]; asm["_sqlite3MemSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3MemSize.apply(null, arguments);
	};

	var real__sqlite3SchemaClear = asm["_sqlite3SchemaClear"]; asm["_sqlite3SchemaClear"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3SchemaClear.apply(null, arguments);
	};

	var real__sqlite3SelectWalkFail = asm["_sqlite3SelectWalkFail"]; asm["_sqlite3SelectWalkFail"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3SelectWalkFail.apply(null, arguments);
	};

	var real__sqlite3SelectWalkNoop = asm["_sqlite3SelectWalkNoop"]; asm["_sqlite3SelectWalkNoop"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3SelectWalkNoop.apply(null, arguments);
	};

	var real__sqlite3VdbeRecordCompare = asm["_sqlite3VdbeRecordCompare"]; asm["_sqlite3VdbeRecordCompare"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3VdbeRecordCompare.apply(null, arguments);
	};

	var real__sqlite3WalDefaultHook = asm["_sqlite3WalDefaultHook"]; asm["_sqlite3WalDefaultHook"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3WalDefaultHook.apply(null, arguments);
	};

	var real__sqlite3_free = asm["_sqlite3_free"]; asm["_sqlite3_free"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3_free.apply(null, arguments);
	};

	var real__sqlite3_value_text = asm["_sqlite3_value_text"]; asm["_sqlite3_value_text"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqlite3_value_text.apply(null, arguments);
	};

	var real__sqliteDefaultBusyCallback = asm["_sqliteDefaultBusyCallback"]; asm["_sqliteDefaultBusyCallback"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sqliteDefaultBusyCallback.apply(null, arguments);
	};

	var real__stat = asm["_stat"]; asm["_stat"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__stat.apply(null, arguments);
	};

	var real__stat4Destructor = asm["_stat4Destructor"]; asm["_stat4Destructor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__stat4Destructor.apply(null, arguments);
	};

	var real__statGet = asm["_statGet"]; asm["_statGet"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__statGet.apply(null, arguments);
	};

	var real__statInit = asm["_statInit"]; asm["_statInit"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__statInit.apply(null, arguments);
	};

	var real__statPush = asm["_statPush"]; asm["_statPush"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__statPush.apply(null, arguments);
	};

	var real__strftimeFunc = asm["_strftimeFunc"]; asm["_strftimeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__strftimeFunc.apply(null, arguments);
	};

	var real__substrFunc = asm["_substrFunc"]; asm["_substrFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__substrFunc.apply(null, arguments);
	};

	var real__sumFinalize = asm["_sumFinalize"]; asm["_sumFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sumFinalize.apply(null, arguments);
	};

	var real__sumStep = asm["_sumStep"]; asm["_sumStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__sumStep.apply(null, arguments);
	};

	var real__timeFunc = asm["_timeFunc"]; asm["_timeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__timeFunc.apply(null, arguments);
	};

	var real__totalFinalize = asm["_totalFinalize"]; asm["_totalFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__totalFinalize.apply(null, arguments);
	};

	var real__total_changes = asm["_total_changes"]; asm["_total_changes"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__total_changes.apply(null, arguments);
	};

	var real__trace_processor_notifyEof = asm["_trace_processor_notifyEof"]; asm["_trace_processor_notifyEof"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__trace_processor_notifyEof.apply(null, arguments);
	};

	var real__trace_processor_parse = asm["_trace_processor_parse"]; asm["_trace_processor_parse"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__trace_processor_parse.apply(null, arguments);
	};

	var real__trace_processor_rawQuery = asm["_trace_processor_rawQuery"]; asm["_trace_processor_rawQuery"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__trace_processor_rawQuery.apply(null, arguments);
	};

	var real__trimFunc = asm["_trimFunc"]; asm["_trimFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__trimFunc.apply(null, arguments);
	};

	var real__typeofFunc = asm["_typeofFunc"]; asm["_typeofFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__typeofFunc.apply(null, arguments);
	};

	var real__unicodeFunc = asm["_unicodeFunc"]; asm["_unicodeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unicodeFunc.apply(null, arguments);
	};

	var real__unixAccess = asm["_unixAccess"]; asm["_unixAccess"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixAccess.apply(null, arguments);
	};

	var real__unixCheckReservedLock = asm["_unixCheckReservedLock"]; asm["_unixCheckReservedLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixCheckReservedLock.apply(null, arguments);
	};

	var real__unixClose = asm["_unixClose"]; asm["_unixClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixClose.apply(null, arguments);
	};

	var real__unixCurrentTimeInt64 = asm["_unixCurrentTimeInt64"]; asm["_unixCurrentTimeInt64"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixCurrentTimeInt64.apply(null, arguments);
	};

	var real__unixDelete = asm["_unixDelete"]; asm["_unixDelete"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixDelete.apply(null, arguments);
	};

	var real__unixDeviceCharacteristics = asm["_unixDeviceCharacteristics"]; asm["_unixDeviceCharacteristics"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixDeviceCharacteristics.apply(null, arguments);
	};

	var real__unixFetch = asm["_unixFetch"]; asm["_unixFetch"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixFetch.apply(null, arguments);
	};

	var real__unixFileControl = asm["_unixFileControl"]; asm["_unixFileControl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixFileControl.apply(null, arguments);
	};

	var real__unixFileSize = asm["_unixFileSize"]; asm["_unixFileSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixFileSize.apply(null, arguments);
	};

	var real__unixFullPathname = asm["_unixFullPathname"]; asm["_unixFullPathname"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixFullPathname.apply(null, arguments);
	};

	var real__unixGetLastError = asm["_unixGetLastError"]; asm["_unixGetLastError"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixGetLastError.apply(null, arguments);
	};

	var real__unixGetSystemCall = asm["_unixGetSystemCall"]; asm["_unixGetSystemCall"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixGetSystemCall.apply(null, arguments);
	};

	var real__unixGetpagesize = asm["_unixGetpagesize"]; asm["_unixGetpagesize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixGetpagesize.apply(null, arguments);
	};

	var real__unixLock = asm["_unixLock"]; asm["_unixLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixLock.apply(null, arguments);
	};

	var real__unixNextSystemCall = asm["_unixNextSystemCall"]; asm["_unixNextSystemCall"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixNextSystemCall.apply(null, arguments);
	};

	var real__unixOpen = asm["_unixOpen"]; asm["_unixOpen"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixOpen.apply(null, arguments);
	};

	var real__unixRandomness = asm["_unixRandomness"]; asm["_unixRandomness"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixRandomness.apply(null, arguments);
	};

	var real__unixRead = asm["_unixRead"]; asm["_unixRead"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixRead.apply(null, arguments);
	};

	var real__unixSectorSize = asm["_unixSectorSize"]; asm["_unixSectorSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixSectorSize.apply(null, arguments);
	};

	var real__unixSetSystemCall = asm["_unixSetSystemCall"]; asm["_unixSetSystemCall"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixSetSystemCall.apply(null, arguments);
	};

	var real__unixShmBarrier = asm["_unixShmBarrier"]; asm["_unixShmBarrier"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixShmBarrier.apply(null, arguments);
	};

	var real__unixShmLock = asm["_unixShmLock"]; asm["_unixShmLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixShmLock.apply(null, arguments);
	};

	var real__unixShmMap = asm["_unixShmMap"]; asm["_unixShmMap"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixShmMap.apply(null, arguments);
	};

	var real__unixShmUnmap = asm["_unixShmUnmap"]; asm["_unixShmUnmap"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixShmUnmap.apply(null, arguments);
	};

	var real__unixSleep = asm["_unixSleep"]; asm["_unixSleep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixSleep.apply(null, arguments);
	};

	var real__unixSync = asm["_unixSync"]; asm["_unixSync"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixSync.apply(null, arguments);
	};

	var real__unixTruncate = asm["_unixTruncate"]; asm["_unixTruncate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixTruncate.apply(null, arguments);
	};

	var real__unixUnfetch = asm["_unixUnfetch"]; asm["_unixUnfetch"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixUnfetch.apply(null, arguments);
	};

	var real__unixUnlock = asm["_unixUnlock"]; asm["_unixUnlock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixUnlock.apply(null, arguments);
	};

	var real__unixWrite = asm["_unixWrite"]; asm["_unixWrite"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unixWrite.apply(null, arguments);
	};

	var real__unlink = asm["_unlink"]; asm["_unlink"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__unlink.apply(null, arguments);
	};

	var real__upperFunc = asm["_upperFunc"]; asm["_upperFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__upperFunc.apply(null, arguments);
	};

	var real__vdbeRecordCompareInt = asm["_vdbeRecordCompareInt"]; asm["_vdbeRecordCompareInt"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__vdbeRecordCompareInt.apply(null, arguments);
	};

	var real__vdbeRecordCompareString = asm["_vdbeRecordCompareString"]; asm["_vdbeRecordCompareString"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__vdbeRecordCompareString.apply(null, arguments);
	};

	var real__vdbeSorterCompare = asm["_vdbeSorterCompare"]; asm["_vdbeSorterCompare"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__vdbeSorterCompare.apply(null, arguments);
	};

	var real__vdbeSorterCompareInt = asm["_vdbeSorterCompareInt"]; asm["_vdbeSorterCompareInt"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__vdbeSorterCompareInt.apply(null, arguments);
	};

	var real__vdbeSorterCompareText = asm["_vdbeSorterCompareText"]; asm["_vdbeSorterCompareText"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__vdbeSorterCompareText.apply(null, arguments);
	};

	var real__versionFunc = asm["_versionFunc"]; asm["_versionFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__versionFunc.apply(null, arguments);
	};

	var real__whereIndexExprTransNode = asm["_whereIndexExprTransNode"]; asm["_whereIndexExprTransNode"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__whereIndexExprTransNode.apply(null, arguments);
	};

	var real__write = asm["_write"]; asm["_write"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__write.apply(null, arguments);
	};

	var real__zeroblobFunc = asm["_zeroblobFunc"]; asm["_zeroblobFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real__zeroblobFunc.apply(null, arguments);
	};

	var real_establishStackSpace = asm["establishStackSpace"]; asm["establishStackSpace"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real_establishStackSpace.apply(null, arguments);
	};

	var real_getTempRet0 = asm["getTempRet0"]; asm["getTempRet0"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real_getTempRet0.apply(null, arguments);
	};

	var real_setTempRet0 = asm["setTempRet0"]; asm["setTempRet0"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real_setTempRet0.apply(null, arguments);
	};

	var real_setThrew = asm["setThrew"]; asm["setThrew"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real_setThrew.apply(null, arguments);
	};

	var real_stackAlloc = asm["stackAlloc"]; asm["stackAlloc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real_stackAlloc.apply(null, arguments);
	};

	var real_stackRestore = asm["stackRestore"]; asm["stackRestore"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real_stackRestore.apply(null, arguments);
	};

	var real_stackSave = asm["stackSave"]; asm["stackSave"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return real_stackSave.apply(null, arguments);
	};
	Module["asm"] = asm;
	var _Initialize = Module["_Initialize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_Initialize"].apply(null, arguments) };
	var __GLOBAL__sub_I_status_cc = Module["__GLOBAL__sub_I_status_cc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__GLOBAL__sub_I_status_cc"].apply(null, arguments) };
	var __ZN6google8protobuf11MessageLiteD0Ev = Module["__ZN6google8protobuf11MessageLiteD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf11MessageLiteD0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf11MessageLiteD2Ev = Module["__ZN6google8protobuf11MessageLiteD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf11MessageLiteD2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED0Ev = Module["__ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED2Ev = Module["__ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf14ResultCallbackIPNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEED2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf2io17ArrayOutputStream4NextEPPvPi = Module["__ZN6google8protobuf2io17ArrayOutputStream4NextEPPvPi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io17ArrayOutputStream4NextEPPvPi"].apply(null, arguments) };
	var __ZN6google8protobuf2io17ArrayOutputStream6BackUpEi = Module["__ZN6google8protobuf2io17ArrayOutputStream6BackUpEi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io17ArrayOutputStream6BackUpEi"].apply(null, arguments) };
	var __ZN6google8protobuf2io17ArrayOutputStreamD0Ev = Module["__ZN6google8protobuf2io17ArrayOutputStreamD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io17ArrayOutputStreamD0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf2io17ArrayOutputStreamD2Ev = Module["__ZN6google8protobuf2io17ArrayOutputStreamD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io17ArrayOutputStreamD2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf2io18StringOutputStream4NextEPPvPi = Module["__ZN6google8protobuf2io18StringOutputStream4NextEPPvPi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io18StringOutputStream4NextEPPvPi"].apply(null, arguments) };
	var __ZN6google8protobuf2io18StringOutputStream6BackUpEi = Module["__ZN6google8protobuf2io18StringOutputStream6BackUpEi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io18StringOutputStream6BackUpEi"].apply(null, arguments) };
	var __ZN6google8protobuf2io18StringOutputStreamD0Ev = Module["__ZN6google8protobuf2io18StringOutputStreamD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io18StringOutputStreamD0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf2io18StringOutputStreamD2Ev = Module["__ZN6google8protobuf2io18StringOutputStreamD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io18StringOutputStreamD2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf2io20ZeroCopyOutputStream15WriteAliasedRawEPKvi = Module["__ZN6google8protobuf2io20ZeroCopyOutputStream15WriteAliasedRawEPKvi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io20ZeroCopyOutputStream15WriteAliasedRawEPKvi"].apply(null, arguments) };
	var __ZN6google8protobuf2io20ZeroCopyOutputStreamD0Ev = Module["__ZN6google8protobuf2io20ZeroCopyOutputStreamD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io20ZeroCopyOutputStreamD0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf2io20ZeroCopyOutputStreamD2Ev = Module["__ZN6google8protobuf2io20ZeroCopyOutputStreamD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io20ZeroCopyOutputStreamD2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf2io22LazyStringOutputStream4NextEPPvPi = Module["__ZN6google8protobuf2io22LazyStringOutputStream4NextEPPvPi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io22LazyStringOutputStream4NextEPPvPi"].apply(null, arguments) };
	var __ZN6google8protobuf2io22LazyStringOutputStreamD0Ev = Module["__ZN6google8protobuf2io22LazyStringOutputStreamD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io22LazyStringOutputStreamD0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf2io22LazyStringOutputStreamD2Ev = Module["__ZN6google8protobuf2io22LazyStringOutputStreamD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf2io22LazyStringOutputStreamD2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf7ClosureD0Ev = Module["__ZN6google8protobuf7ClosureD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf7ClosureD0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf7ClosureD2Ev = Module["__ZN6google8protobuf7ClosureD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf7ClosureD2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal15InitEmptyStringEv = Module["__ZN6google8protobuf8internal15InitEmptyStringEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal15InitEmptyStringEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal16FunctionClosure03RunEv = Module["__ZN6google8protobuf8internal16FunctionClosure03RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal16FunctionClosure03RunEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal16FunctionClosure0D0Ev = Module["__ZN6google8protobuf8internal16FunctionClosure0D0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal16FunctionClosure0D0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal16FunctionClosure0D2Ev = Module["__ZN6google8protobuf8internal16FunctionClosure0D2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal16FunctionClosure0D2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal17DeleteEmptyStringEv = Module["__ZN6google8protobuf8internal17DeleteEmptyStringEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal17DeleteEmptyStringEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos12RawQueryArgsEEEvPv = Module["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos12RawQueryArgsEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos12RawQueryArgsEEEvPv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos14RawQueryResultEEEvPv = Module["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos14RawQueryResultEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos14RawQueryResultEEEvPv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv = Module["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv = Module["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal19arena_delete_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal19arena_delete_objectINS0_11MessageLiteEEEvPv = Module["__ZN6google8protobuf8internal19arena_delete_objectINS0_11MessageLiteEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal19arena_delete_objectINS0_11MessageLiteEEEvPv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal20InitLogSilencerCountEv = Module["__ZN6google8protobuf8internal20InitLogSilencerCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal20InitLogSilencerCountEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos25RawQueryResult_ColumnDescEE11TypeHandlerEEEvPPvSB_ii = Module["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos25RawQueryResult_ColumnDescEE11TypeHandlerEEEvPPvSB_ii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos25RawQueryResult_ColumnDescEE11TypeHandlerEEEvPPvSB_ii"].apply(null, arguments) };
	var __ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos27RawQueryResult_ColumnValuesEE11TypeHandlerEEEvPPvSB_ii = Module["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos27RawQueryResult_ColumnValuesEE11TypeHandlerEEEvPPvSB_ii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldIN8perfetto6protos27RawQueryResult_ColumnValuesEE11TypeHandlerEEEvPPvSB_ii"].apply(null, arguments) };
	var __ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldINSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEE11TypeHandlerEEEvPPvSF_ii = Module["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldINSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEE11TypeHandlerEEEvPPvSF_ii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal20RepeatedPtrFieldBase18MergeFromInnerLoopINS0_16RepeatedPtrFieldINSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEE11TypeHandlerEEEvPPvSF_ii"].apply(null, arguments) };
	var __ZN6google8protobuf8internal21InitShutdownFunctionsEv = Module["__ZN6google8protobuf8internal21InitShutdownFunctionsEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal21InitShutdownFunctionsEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv = Module["__ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos25RawQueryResult_ColumnDescEEEvPv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv = Module["__ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal21arena_destruct_objectIN8perfetto6protos27RawQueryResult_ColumnValuesEEEvPv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal21arena_destruct_objectINSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEEEvPv = Module["__ZN6google8protobuf8internal21arena_destruct_objectINSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEEEvPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal21arena_destruct_objectINSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEEEvPv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal22DeleteLogSilencerCountEv = Module["__ZN6google8protobuf8internal22DeleteLogSilencerCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal22DeleteLogSilencerCountEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEE3RunEv = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEE3RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEE3RunEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED0Ev = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED2Ev = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos12RawQueryArgsEED2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEE3RunEv = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEE3RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEE3RunEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED0Ev = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED2Ev = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos14RawQueryResultEED2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEE3RunEv = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEE3RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEE3RunEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED0Ev = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED2Ev = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos25RawQueryResult_ColumnDescEED2Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEE3RunEv = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEE3RunEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEE3RunEv"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED0Ev = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED0Ev"].apply(null, arguments) };
	var __ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED2Ev = Module["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN6google8protobuf8internal26FunctionResultCallback_1_0IPNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEPN8perfetto6protos27RawQueryResult_ColumnValuesEED2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTable12CreateCursorEv = Module["__ZN8perfetto15trace_processor10SliceTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTable12CreateCursorEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTable6Cursor3EofEv = Module["__ZN8perfetto15trace_processor10SliceTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTable6Cursor3EofEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTable6Cursor4NextEv = Module["__ZN8perfetto15trace_processor10SliceTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTable6Cursor4NextEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTable6Cursor6ColumnEP15sqlite3_contexti = Module["__ZN8perfetto15trace_processor10SliceTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTable6Cursor6ColumnEP15sqlite3_contexti"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = Module["__ZN8perfetto15trace_processor10SliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTable6CursorD0Ev = Module["__ZN8perfetto15trace_processor10SliceTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTable6CursorD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTable6CursorD2Ev = Module["__ZN8perfetto15trace_processor10SliceTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTable6CursorD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = Module["__ZN8perfetto15trace_processor10SliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTableD0Ev = Module["__ZN8perfetto15trace_processor10SliceTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTableD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor10SliceTableD2Ev = Module["__ZN8perfetto15trace_processor10SliceTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor10SliceTableD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTable12CreateCursorEv = Module["__ZN8perfetto15trace_processor11StringTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTable12CreateCursorEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTable6Cursor3EofEv = Module["__ZN8perfetto15trace_processor11StringTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTable6Cursor3EofEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTable6Cursor4NextEv = Module["__ZN8perfetto15trace_processor11StringTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTable6Cursor4NextEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTable6Cursor6ColumnEP15sqlite3_contexti = Module["__ZN8perfetto15trace_processor11StringTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTable6Cursor6ColumnEP15sqlite3_contexti"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = Module["__ZN8perfetto15trace_processor11StringTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTable6CursorD0Ev = Module["__ZN8perfetto15trace_processor11StringTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTable6CursorD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTable6CursorD2Ev = Module["__ZN8perfetto15trace_processor11StringTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTable6CursorD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = Module["__ZN8perfetto15trace_processor11StringTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTableD0Ev = Module["__ZN8perfetto15trace_processor11StringTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTableD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11StringTableD2Ev = Module["__ZN8perfetto15trace_processor11StringTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11StringTableD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTable12CreateCursorEv = Module["__ZN8perfetto15trace_processor11ThreadTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTable12CreateCursorEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTable6Cursor3EofEv = Module["__ZN8perfetto15trace_processor11ThreadTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTable6Cursor3EofEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTable6Cursor4NextEv = Module["__ZN8perfetto15trace_processor11ThreadTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTable6Cursor4NextEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTable6Cursor6ColumnEP15sqlite3_contexti = Module["__ZN8perfetto15trace_processor11ThreadTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTable6Cursor6ColumnEP15sqlite3_contexti"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = Module["__ZN8perfetto15trace_processor11ThreadTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTable6CursorD0Ev = Module["__ZN8perfetto15trace_processor11ThreadTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTable6CursorD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTable6CursorD2Ev = Module["__ZN8perfetto15trace_processor11ThreadTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTable6CursorD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = Module["__ZN8perfetto15trace_processor11ThreadTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTableD0Ev = Module["__ZN8perfetto15trace_processor11ThreadTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTableD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11ThreadTableD2Ev = Module["__ZN8perfetto15trace_processor11ThreadTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11ThreadTableD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor11TraceSorter21TimestampedTracePiece7CompareERKS2_y = Module["__ZN8perfetto15trace_processor11TraceSorter21TimestampedTracePiece7CompareERKS2_y"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor11TraceSorter21TimestampedTracePiece7CompareERKS2_y"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTable12CreateCursorEv = Module["__ZN8perfetto15trace_processor12ProcessTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTable12CreateCursorEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTable6Cursor3EofEv = Module["__ZN8perfetto15trace_processor12ProcessTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTable6Cursor3EofEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTable6Cursor4NextEv = Module["__ZN8perfetto15trace_processor12ProcessTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTable6Cursor4NextEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTable6Cursor6ColumnEP15sqlite3_contexti = Module["__ZN8perfetto15trace_processor12ProcessTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTable6Cursor6ColumnEP15sqlite3_contexti"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = Module["__ZN8perfetto15trace_processor12ProcessTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTable6CursorD0Ev = Module["__ZN8perfetto15trace_processor12ProcessTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTable6CursorD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTable6CursorD2Ev = Module["__ZN8perfetto15trace_processor12ProcessTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTable6CursorD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = Module["__ZN8perfetto15trace_processor12ProcessTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTableD0Ev = Module["__ZN8perfetto15trace_processor12ProcessTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTableD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12ProcessTableD2Ev = Module["__ZN8perfetto15trace_processor12ProcessTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12ProcessTableD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12SchedTracker15PushSchedSwitchEjyjjNS_4base10StringViewEj = Module["__ZN8perfetto15trace_processor12SchedTracker15PushSchedSwitchEjyjjNS_4base10StringViewEj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12SchedTracker15PushSchedSwitchEjyjjNS_4base10StringViewEj"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12SchedTrackerD0Ev = Module["__ZN8perfetto15trace_processor12SchedTrackerD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12SchedTrackerD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12SchedTrackerD2Ev = Module["__ZN8perfetto15trace_processor12SchedTrackerD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12SchedTrackerD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12TraceStorage11PushCpuFreqEyjj = Module["__ZN8perfetto15trace_processor12TraceStorage11PushCpuFreqEyjj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12TraceStorage11PushCpuFreqEyjj"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12TraceStorageD0Ev = Module["__ZN8perfetto15trace_processor12TraceStorageD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12TraceStorageD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor12TraceStorageD2Ev = Module["__ZN8perfetto15trace_processor12TraceStorageD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor12TraceStorageD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTable12CreateCursorEv = Module["__ZN8perfetto15trace_processor13CountersTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTable12CreateCursorEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTable6Cursor3EofEv = Module["__ZN8perfetto15trace_processor13CountersTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTable6Cursor3EofEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTable6Cursor4NextEv = Module["__ZN8perfetto15trace_processor13CountersTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTable6Cursor4NextEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTable6Cursor6ColumnEP15sqlite3_contexti = Module["__ZN8perfetto15trace_processor13CountersTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTable6Cursor6ColumnEP15sqlite3_contexti"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = Module["__ZN8perfetto15trace_processor13CountersTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTable6CursorD0Ev = Module["__ZN8perfetto15trace_processor13CountersTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTable6CursorD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTable6CursorD2Ev = Module["__ZN8perfetto15trace_processor13CountersTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTable6CursorD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = Module["__ZN8perfetto15trace_processor13CountersTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTableD0Ev = Module["__ZN8perfetto15trace_processor13CountersTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTableD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor13CountersTableD2Ev = Module["__ZN8perfetto15trace_processor13CountersTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor13CountersTableD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor14ProcessTracker12UpdateThreadEjj = Module["__ZN8perfetto15trace_processor14ProcessTracker12UpdateThreadEjj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor14ProcessTracker12UpdateThreadEjj"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor14ProcessTracker13UpdateProcessEjNS_4base10StringViewE = Module["__ZN8perfetto15trace_processor14ProcessTracker13UpdateProcessEjNS_4base10StringViewE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor14ProcessTracker13UpdateProcessEjNS_4base10StringViewE"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor14ProcessTrackerD0Ev = Module["__ZN8perfetto15trace_processor14ProcessTrackerD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor14ProcessTrackerD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor14ProcessTrackerD2Ev = Module["__ZN8perfetto15trace_processor14ProcessTrackerD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor14ProcessTrackerD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15JsonTraceParser5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj = Module["__ZN8perfetto15trace_processor15JsonTraceParser5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15JsonTraceParser5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15JsonTraceParserD0Ev = Module["__ZN8perfetto15trace_processor15JsonTraceParserD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15JsonTraceParserD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15JsonTraceParserD2Ev = Module["__ZN8perfetto15trace_processor15JsonTraceParserD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15JsonTraceParserD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTable12CreateCursorEv = Module["__ZN8perfetto15trace_processor15SchedSliceTable12CreateCursorEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTable12CreateCursorEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv = Module["__ZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTable6Cursor3EofEv = Module["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor3EofEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor3EofEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTable6Cursor4NextEv = Module["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor4NextEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor4NextEv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTable6Cursor6ColumnEP15sqlite3_contexti = Module["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor6ColumnEP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor6ColumnEP15sqlite3_contexti"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value = Module["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTable6Cursor6FilterERKNS0_16QueryConstraintsEPP13sqlite3_value"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTable6CursorD0Ev = Module["__ZN8perfetto15trace_processor15SchedSliceTable6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTable6CursorD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTable6CursorD2Ev = Module["__ZN8perfetto15trace_processor15SchedSliceTable6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTable6CursorD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE = Module["__ZN8perfetto15trace_processor15SchedSliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTable9BestIndexERKNS0_16QueryConstraintsEPNS0_5Table13BestIndexInfoE"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTableD0Ev = Module["__ZN8perfetto15trace_processor15SchedSliceTableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTableD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor15SchedSliceTableD2Ev = Module["__ZN8perfetto15trace_processor15SchedSliceTableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor15SchedSliceTableD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor16ProtoTraceParser16ParseTracePacketENS0_13TraceBlobViewE = Module["__ZN8perfetto15trace_processor16ProtoTraceParser16ParseTracePacketENS0_13TraceBlobViewE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor16ProtoTraceParser16ParseTracePacketENS0_13TraceBlobViewE"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor16ProtoTraceParser17ParseFtracePacketEjyNS0_13TraceBlobViewE = Module["__ZN8perfetto15trace_processor16ProtoTraceParser17ParseFtracePacketEjyNS0_13TraceBlobViewE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor16ProtoTraceParser17ParseFtracePacketEjyNS0_13TraceBlobViewE"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor16ProtoTraceParserD0Ev = Module["__ZN8perfetto15trace_processor16ProtoTraceParserD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor16ProtoTraceParserD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor16ProtoTraceParserD2Ev = Module["__ZN8perfetto15trace_processor16ProtoTraceParserD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor16ProtoTraceParserD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor18ChunkedTraceReaderD0Ev = Module["__ZN8perfetto15trace_processor18ChunkedTraceReaderD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor18ChunkedTraceReaderD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor18ChunkedTraceReaderD2Ev = Module["__ZN8perfetto15trace_processor18ChunkedTraceReaderD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor18ChunkedTraceReaderD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor19ProtoTraceTokenizer5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj = Module["__ZN8perfetto15trace_processor19ProtoTraceTokenizer5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor19ProtoTraceTokenizer5ParseENSt3__210unique_ptrIA_hNS2_14default_deleteIS4_EEEEj"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor19ProtoTraceTokenizerD0Ev = Module["__ZN8perfetto15trace_processor19ProtoTraceTokenizerD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor19ProtoTraceTokenizerD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor19ProtoTraceTokenizerD2Ev = Module["__ZN8perfetto15trace_processor19ProtoTraceTokenizerD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor19ProtoTraceTokenizerD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor5Table12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv = Module["__ZN8perfetto15trace_processor5Table12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor5Table12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor5Table6CursorD0Ev = Module["__ZN8perfetto15trace_processor5Table6CursorD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor5Table6CursorD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor5Table6CursorD2Ev = Module["__ZN8perfetto15trace_processor5Table6CursorD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor5Table6CursorD2Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor5TableD0Ev = Module["__ZN8perfetto15trace_processor5TableD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor5TableD0Ev"].apply(null, arguments) };
	var __ZN8perfetto15trace_processor5TableD2Ev = Module["__ZN8perfetto15trace_processor5TableD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto15trace_processor5TableD2Ev"].apply(null, arguments) };
	var __ZN8perfetto6protos12RawQueryArgs21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE = Module["__ZN8perfetto6protos12RawQueryArgs21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos12RawQueryArgs21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"].apply(null, arguments) };
	var __ZN8perfetto6protos12RawQueryArgs27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE = Module["__ZN8perfetto6protos12RawQueryArgs27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos12RawQueryArgs27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"].apply(null, arguments) };
	var __ZN8perfetto6protos12RawQueryArgs5ClearEv = Module["__ZN8perfetto6protos12RawQueryArgs5ClearEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos12RawQueryArgs5ClearEv"].apply(null, arguments) };
	var __ZN8perfetto6protos12RawQueryArgsD0Ev = Module["__ZN8perfetto6protos12RawQueryArgsD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos12RawQueryArgsD0Ev"].apply(null, arguments) };
	var __ZN8perfetto6protos12RawQueryArgsD2Ev = Module["__ZN8perfetto6protos12RawQueryArgsD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos12RawQueryArgsD2Ev"].apply(null, arguments) };
	var __ZN8perfetto6protos14RawQueryResult21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE = Module["__ZN8perfetto6protos14RawQueryResult21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos14RawQueryResult21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"].apply(null, arguments) };
	var __ZN8perfetto6protos14RawQueryResult27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE = Module["__ZN8perfetto6protos14RawQueryResult27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos14RawQueryResult27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"].apply(null, arguments) };
	var __ZN8perfetto6protos14RawQueryResult5ClearEv = Module["__ZN8perfetto6protos14RawQueryResult5ClearEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos14RawQueryResult5ClearEv"].apply(null, arguments) };
	var __ZN8perfetto6protos14RawQueryResultD0Ev = Module["__ZN8perfetto6protos14RawQueryResultD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos14RawQueryResultD0Ev"].apply(null, arguments) };
	var __ZN8perfetto6protos14RawQueryResultD2Ev = Module["__ZN8perfetto6protos14RawQueryResultD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos14RawQueryResultD2Ev"].apply(null, arguments) };
	var __ZN8perfetto6protos25RawQueryResult_ColumnDesc21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE = Module["__ZN8perfetto6protos25RawQueryResult_ColumnDesc21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos25RawQueryResult_ColumnDesc21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"].apply(null, arguments) };
	var __ZN8perfetto6protos25RawQueryResult_ColumnDesc27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE = Module["__ZN8perfetto6protos25RawQueryResult_ColumnDesc27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos25RawQueryResult_ColumnDesc27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"].apply(null, arguments) };
	var __ZN8perfetto6protos25RawQueryResult_ColumnDesc5ClearEv = Module["__ZN8perfetto6protos25RawQueryResult_ColumnDesc5ClearEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos25RawQueryResult_ColumnDesc5ClearEv"].apply(null, arguments) };
	var __ZN8perfetto6protos25RawQueryResult_ColumnDescD0Ev = Module["__ZN8perfetto6protos25RawQueryResult_ColumnDescD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos25RawQueryResult_ColumnDescD0Ev"].apply(null, arguments) };
	var __ZN8perfetto6protos25RawQueryResult_ColumnDescD2Ev = Module["__ZN8perfetto6protos25RawQueryResult_ColumnDescD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos25RawQueryResult_ColumnDescD2Ev"].apply(null, arguments) };
	var __ZN8perfetto6protos27RawQueryResult_ColumnValues21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE = Module["__ZN8perfetto6protos27RawQueryResult_ColumnValues21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos27RawQueryResult_ColumnValues21CheckTypeAndMergeFromERKN6google8protobuf11MessageLiteE"].apply(null, arguments) };
	var __ZN8perfetto6protos27RawQueryResult_ColumnValues27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE = Module["__ZN8perfetto6protos27RawQueryResult_ColumnValues27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos27RawQueryResult_ColumnValues27MergePartialFromCodedStreamEPN6google8protobuf2io16CodedInputStreamE"].apply(null, arguments) };
	var __ZN8perfetto6protos27RawQueryResult_ColumnValues5ClearEv = Module["__ZN8perfetto6protos27RawQueryResult_ColumnValues5ClearEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos27RawQueryResult_ColumnValues5ClearEv"].apply(null, arguments) };
	var __ZN8perfetto6protos27RawQueryResult_ColumnValuesD0Ev = Module["__ZN8perfetto6protos27RawQueryResult_ColumnValuesD0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos27RawQueryResult_ColumnValuesD0Ev"].apply(null, arguments) };
	var __ZN8perfetto6protos27RawQueryResult_ColumnValuesD2Ev = Module["__ZN8perfetto6protos27RawQueryResult_ColumnValuesD2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos27RawQueryResult_ColumnValuesD2Ev"].apply(null, arguments) };
	var __ZN8perfetto6protos72protobuf_AddDesc_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eproto_implEv = Module["__ZN8perfetto6protos72protobuf_AddDesc_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eproto_implEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos72protobuf_AddDesc_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eproto_implEv"].apply(null, arguments) };
	var __ZN8perfetto6protos72protobuf_ShutdownFile_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eprotoEv = Module["__ZN8perfetto6protos72protobuf_ShutdownFile_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eprotoEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protos72protobuf_ShutdownFile_perfetto_2ftrace_5fprocessor_2fraw_5fquery_2eprotoEv"].apply(null, arguments) };
	var __ZN8perfetto6protosL35MutableUnknownFieldsForRawQueryArgsEPNS0_12RawQueryArgsE = Module["__ZN8perfetto6protosL35MutableUnknownFieldsForRawQueryArgsEPNS0_12RawQueryArgsE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protosL35MutableUnknownFieldsForRawQueryArgsEPNS0_12RawQueryArgsE"].apply(null, arguments) };
	var __ZN8perfetto6protosL37MutableUnknownFieldsForRawQueryResultEPNS0_14RawQueryResultE = Module["__ZN8perfetto6protosL37MutableUnknownFieldsForRawQueryResultEPNS0_14RawQueryResultE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protosL37MutableUnknownFieldsForRawQueryResultEPNS0_14RawQueryResultE"].apply(null, arguments) };
	var __ZN8perfetto6protosL48MutableUnknownFieldsForRawQueryResult_ColumnDescEPNS0_25RawQueryResult_ColumnDescE = Module["__ZN8perfetto6protosL48MutableUnknownFieldsForRawQueryResult_ColumnDescEPNS0_25RawQueryResult_ColumnDescE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protosL48MutableUnknownFieldsForRawQueryResult_ColumnDescEPNS0_25RawQueryResult_ColumnDescE"].apply(null, arguments) };
	var __ZN8perfetto6protosL50MutableUnknownFieldsForRawQueryResult_ColumnValuesEPNS0_27RawQueryResult_ColumnValuesE = Module["__ZN8perfetto6protosL50MutableUnknownFieldsForRawQueryResult_ColumnValuesEPNS0_27RawQueryResult_ColumnValuesE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZN8perfetto6protosL50MutableUnknownFieldsForRawQueryResult_ColumnValuesEPNS0_27RawQueryResult_ColumnValuesE"].apply(null, arguments) };
	var __ZNK6google8protobuf11MessageLite20GetMaybeArenaPointerEv = Module["__ZNK6google8protobuf11MessageLite20GetMaybeArenaPointerEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK6google8protobuf11MessageLite20GetMaybeArenaPointerEv"].apply(null, arguments) };
	var __ZNK6google8protobuf11MessageLite25InitializationErrorStringEv = Module["__ZNK6google8protobuf11MessageLite25InitializationErrorStringEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK6google8protobuf11MessageLite25InitializationErrorStringEv"].apply(null, arguments) };
	var __ZNK6google8protobuf11MessageLite31SerializeWithCachedSizesToArrayEPh = Module["__ZNK6google8protobuf11MessageLite31SerializeWithCachedSizesToArrayEPh"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK6google8protobuf11MessageLite31SerializeWithCachedSizesToArrayEPh"].apply(null, arguments) };
	var __ZNK6google8protobuf11MessageLite3NewEPNS0_5ArenaE = Module["__ZNK6google8protobuf11MessageLite3NewEPNS0_5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK6google8protobuf11MessageLite3NewEPNS0_5ArenaE"].apply(null, arguments) };
	var __ZNK6google8protobuf11MessageLite8GetArenaEv = Module["__ZNK6google8protobuf11MessageLite8GetArenaEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK6google8protobuf11MessageLite8GetArenaEv"].apply(null, arguments) };
	var __ZNK6google8protobuf2io17ArrayOutputStream9ByteCountEv = Module["__ZNK6google8protobuf2io17ArrayOutputStream9ByteCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK6google8protobuf2io17ArrayOutputStream9ByteCountEv"].apply(null, arguments) };
	var __ZNK6google8protobuf2io18StringOutputStream9ByteCountEv = Module["__ZNK6google8protobuf2io18StringOutputStream9ByteCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK6google8protobuf2io18StringOutputStream9ByteCountEv"].apply(null, arguments) };
	var __ZNK6google8protobuf2io20ZeroCopyOutputStream14AllowsAliasingEv = Module["__ZNK6google8protobuf2io20ZeroCopyOutputStream14AllowsAliasingEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK6google8protobuf2io20ZeroCopyOutputStream14AllowsAliasingEv"].apply(null, arguments) };
	var __ZNK6google8protobuf2io22LazyStringOutputStream9ByteCountEv = Module["__ZNK6google8protobuf2io22LazyStringOutputStream9ByteCountEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK6google8protobuf2io22LazyStringOutputStream9ByteCountEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos12RawQueryArgs11GetTypeNameEv = Module["__ZNK8perfetto6protos12RawQueryArgs11GetTypeNameEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos12RawQueryArgs11GetTypeNameEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos12RawQueryArgs13GetCachedSizeEv = Module["__ZNK8perfetto6protos12RawQueryArgs13GetCachedSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos12RawQueryArgs13GetCachedSizeEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos12RawQueryArgs13IsInitializedEv = Module["__ZNK8perfetto6protos12RawQueryArgs13IsInitializedEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos12RawQueryArgs13IsInitializedEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos12RawQueryArgs24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE = Module["__ZNK8perfetto6protos12RawQueryArgs24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos12RawQueryArgs24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"].apply(null, arguments) };
	var __ZNK8perfetto6protos12RawQueryArgs3NewEPN6google8protobuf5ArenaE = Module["__ZNK8perfetto6protos12RawQueryArgs3NewEPN6google8protobuf5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos12RawQueryArgs3NewEPN6google8protobuf5ArenaE"].apply(null, arguments) };
	var __ZNK8perfetto6protos12RawQueryArgs3NewEv = Module["__ZNK8perfetto6protos12RawQueryArgs3NewEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos12RawQueryArgs3NewEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos12RawQueryArgs8ByteSizeEv = Module["__ZNK8perfetto6protos12RawQueryArgs8ByteSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos12RawQueryArgs8ByteSizeEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos14RawQueryResult11GetTypeNameEv = Module["__ZNK8perfetto6protos14RawQueryResult11GetTypeNameEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos14RawQueryResult11GetTypeNameEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos14RawQueryResult13GetCachedSizeEv = Module["__ZNK8perfetto6protos14RawQueryResult13GetCachedSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos14RawQueryResult13GetCachedSizeEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos14RawQueryResult13IsInitializedEv = Module["__ZNK8perfetto6protos14RawQueryResult13IsInitializedEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos14RawQueryResult13IsInitializedEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos14RawQueryResult24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE = Module["__ZNK8perfetto6protos14RawQueryResult24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos14RawQueryResult24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"].apply(null, arguments) };
	var __ZNK8perfetto6protos14RawQueryResult3NewEPN6google8protobuf5ArenaE = Module["__ZNK8perfetto6protos14RawQueryResult3NewEPN6google8protobuf5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos14RawQueryResult3NewEPN6google8protobuf5ArenaE"].apply(null, arguments) };
	var __ZNK8perfetto6protos14RawQueryResult3NewEv = Module["__ZNK8perfetto6protos14RawQueryResult3NewEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos14RawQueryResult3NewEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos14RawQueryResult8ByteSizeEv = Module["__ZNK8perfetto6protos14RawQueryResult8ByteSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos14RawQueryResult8ByteSizeEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos25RawQueryResult_ColumnDesc11GetTypeNameEv = Module["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc11GetTypeNameEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc11GetTypeNameEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos25RawQueryResult_ColumnDesc13GetCachedSizeEv = Module["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc13GetCachedSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc13GetCachedSizeEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos25RawQueryResult_ColumnDesc13IsInitializedEv = Module["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc13IsInitializedEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc13IsInitializedEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos25RawQueryResult_ColumnDesc24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE = Module["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"].apply(null, arguments) };
	var __ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEPN6google8protobuf5ArenaE = Module["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEPN6google8protobuf5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEPN6google8protobuf5ArenaE"].apply(null, arguments) };
	var __ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEv = Module["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc3NewEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos25RawQueryResult_ColumnDesc8ByteSizeEv = Module["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc8ByteSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos25RawQueryResult_ColumnDesc8ByteSizeEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos27RawQueryResult_ColumnValues11GetTypeNameEv = Module["__ZNK8perfetto6protos27RawQueryResult_ColumnValues11GetTypeNameEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos27RawQueryResult_ColumnValues11GetTypeNameEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos27RawQueryResult_ColumnValues13GetCachedSizeEv = Module["__ZNK8perfetto6protos27RawQueryResult_ColumnValues13GetCachedSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos27RawQueryResult_ColumnValues13GetCachedSizeEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos27RawQueryResult_ColumnValues13IsInitializedEv = Module["__ZNK8perfetto6protos27RawQueryResult_ColumnValues13IsInitializedEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos27RawQueryResult_ColumnValues13IsInitializedEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos27RawQueryResult_ColumnValues24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE = Module["__ZNK8perfetto6protos27RawQueryResult_ColumnValues24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos27RawQueryResult_ColumnValues24SerializeWithCachedSizesEPN6google8protobuf2io17CodedOutputStreamE"].apply(null, arguments) };
	var __ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEPN6google8protobuf5ArenaE = Module["__ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEPN6google8protobuf5ArenaE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEPN6google8protobuf5ArenaE"].apply(null, arguments) };
	var __ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEv = Module["__ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos27RawQueryResult_ColumnValues3NewEv"].apply(null, arguments) };
	var __ZNK8perfetto6protos27RawQueryResult_ColumnValues8ByteSizeEv = Module["__ZNK8perfetto6protos27RawQueryResult_ColumnValues8ByteSizeEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNK8perfetto6protos27RawQueryResult_ColumnValues8ByteSizeEv"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEPNS0_6__baseISA_EE = Module["__ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEPNS0_6__baseISA_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEPNS0_6__baseISA_EE"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEv = Module["__ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7__cloneEv"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEPNS0_6__baseISN_EE"].apply(null, arguments) };
	var __ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv = Module["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNKSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7__cloneEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED0Ev = Module["__ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED0Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED2Ev = Module["__ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__baseIFNS_10unique_ptrIN8perfetto15trace_processor5TableENS_14default_deleteIS5_EEEEPKNS4_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEED2Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED0Ev = Module["__ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED0Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED2Ev = Module["__ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__baseIFvRKN8perfetto6protos14RawQueryResultEEED2Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE18destroy_deallocateEv = Module["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE18destroy_deallocateEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7destroyEv = Module["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEE7destroyEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED0Ev = Module["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED0Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED2Ev = Module["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEED2Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEEclES9_ = Module["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEEclES9_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZ24trace_processor_rawQueryE3__0NS_9allocatorIS2_EEFvRKN8perfetto6protos14RawQueryResultEEEclES9_"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_10SliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11StringTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_11ThreadTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_12ProcessTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_13CountersTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E18destroy_deallocateEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_E7destroyEv"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED0Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_ED2Ev"].apply(null, arguments) };
	var __ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_ = Module["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZNSt3__210__function6__funcIZN8perfetto15trace_processor5Table10GetFactoryINS3_15SchedSliceTableEEENS_8functionIFNS_10unique_ptrIS4_NS_14default_deleteIS4_EEEEPKNS3_12TraceStorageERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEEvEUlSE_SM_E_NSI_ISP_EESN_EclEOSE_SM_"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPvEN3__08__invokeES5_iS8_ = Module["__ZZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPvEN3__08__invokeES5_iS8_"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor15SchedSliceTable12FindFunctionEPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPvEN3__08__invokeES5_iS8_"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__08__invokeES3_PviPKPKcPP12sqlite3_vtabPPc = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__08__invokeES3_PviPKPKcPP12sqlite3_vtabPPc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__08__invokeES3_PviPKPKcPP12sqlite3_vtabPPc"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__18__invokeEP12sqlite3_vtab = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__18__invokeEP12sqlite3_vtab"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__18__invokeEP12sqlite3_vtab"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__28__invokeEP12sqlite3_vtabPP19sqlite3_vtab_cursor = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__28__invokeEP12sqlite3_vtabPP19sqlite3_vtab_cursor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__28__invokeEP12sqlite3_vtabPP19sqlite3_vtab_cursor"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__38__invokeEP19sqlite3_vtab_cursor = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__38__invokeEP19sqlite3_vtab_cursor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__38__invokeEP19sqlite3_vtab_cursor"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__48__invokeEP12sqlite3_vtabP18sqlite3_index_info = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__48__invokeEP12sqlite3_vtabP18sqlite3_index_info"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__48__invokeEP12sqlite3_vtabP18sqlite3_index_info"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__58__invokeEP19sqlite3_vtab_cursoriPKciPP13sqlite3_value = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__58__invokeEP19sqlite3_vtab_cursoriPKciPP13sqlite3_value"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__58__invokeEP19sqlite3_vtab_cursoriPKciPP13sqlite3_value"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__68__invokeEP19sqlite3_vtab_cursor = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__68__invokeEP19sqlite3_vtab_cursor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__68__invokeEP19sqlite3_vtab_cursor"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__78__invokeEP19sqlite3_vtab_cursor = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__78__invokeEP19sqlite3_vtab_cursor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__78__invokeEP19sqlite3_vtab_cursor"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__88__invokeEP19sqlite3_vtab_cursorP15sqlite3_contexti = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__88__invokeEP19sqlite3_vtab_cursorP15sqlite3_contexti"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__88__invokeEP19sqlite3_vtab_cursorP15sqlite3_contexti"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__98__invokeEP19sqlite3_vtab_cursorPx = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__98__invokeEP19sqlite3_vtab_cursorPx"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN3__98__invokeEP19sqlite3_vtab_cursorPx"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__108__invokeEP12sqlite3_vtabiPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__108__invokeEP12sqlite3_vtabiPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__108__invokeEP12sqlite3_vtabiPKcPPFvP15sqlite3_contextiPP13sqlite3_valueEPPv"].apply(null, arguments) };
	var __ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__118__invokeEPv = Module["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__118__invokeEPv"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["__ZZN8perfetto15trace_processor5Table16RegisterInternalEP7sqlite3PKNS0_12TraceStorageERKNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEENS7_8functionIFNS7_10unique_ptrIS1_NS7_14default_deleteIS1_EEEES6_SF_EEEEN4__118__invokeEPv"].apply(null, arguments) };
	var ___mmap = Module["___mmap"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["___mmap"].apply(null, arguments) };
	var ___munmap = Module["___munmap"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["___munmap"].apply(null, arguments) };
	var ___stdio_close = Module["___stdio_close"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["___stdio_close"].apply(null, arguments) };
	var ___stdio_seek = Module["___stdio_seek"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["___stdio_seek"].apply(null, arguments) };
	var ___stdio_write = Module["___stdio_write"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["___stdio_write"].apply(null, arguments) };
	var ___stdout_write = Module["___stdout_write"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["___stdout_write"].apply(null, arguments) };
	var _absFunc = Module["_absFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_absFunc"].apply(null, arguments) };
	var _access = Module["_access"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_access"].apply(null, arguments) };
	var _analysisLoader = Module["_analysisLoader"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_analysisLoader"].apply(null, arguments) };
	var _analyzeAggregate = Module["_analyzeAggregate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_analyzeAggregate"].apply(null, arguments) };
	var _analyzeAggregatesInSelect = Module["_analyzeAggregatesInSelect"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_analyzeAggregatesInSelect"].apply(null, arguments) };
	var _analyzeAggregatesInSelectEnd = Module["_analyzeAggregatesInSelectEnd"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_analyzeAggregatesInSelectEnd"].apply(null, arguments) };
	var _attachFunc = Module["_attachFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_attachFunc"].apply(null, arguments) };
	var _avgFinalize = Module["_avgFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_avgFinalize"].apply(null, arguments) };
	var _binCollFunc = Module["_binCollFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_binCollFunc"].apply(null, arguments) };
	var _btreeInvokeBusyHandler = Module["_btreeInvokeBusyHandler"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_btreeInvokeBusyHandler"].apply(null, arguments) };
	var _btreeParseCellPtr = Module["_btreeParseCellPtr"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_btreeParseCellPtr"].apply(null, arguments) };
	var _btreeParseCellPtrIndex = Module["_btreeParseCellPtrIndex"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_btreeParseCellPtrIndex"].apply(null, arguments) };
	var _btreeParseCellPtrNoPayload = Module["_btreeParseCellPtrNoPayload"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_btreeParseCellPtrNoPayload"].apply(null, arguments) };
	var _cdateFunc = Module["_cdateFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_cdateFunc"].apply(null, arguments) };
	var _cellSizePtr = Module["_cellSizePtr"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_cellSizePtr"].apply(null, arguments) };
	var _cellSizePtrNoPayload = Module["_cellSizePtrNoPayload"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_cellSizePtrNoPayload"].apply(null, arguments) };
	var _changes = Module["_changes"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_changes"].apply(null, arguments) };
	var _charFunc = Module["_charFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_charFunc"].apply(null, arguments) };
	var _checkConstraintExprNode = Module["_checkConstraintExprNode"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_checkConstraintExprNode"].apply(null, arguments) };
	var _close = Module["_close"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_close"].apply(null, arguments) };
	var _compileoptiongetFunc = Module["_compileoptiongetFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_compileoptiongetFunc"].apply(null, arguments) };
	var _compileoptionusedFunc = Module["_compileoptionusedFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_compileoptionusedFunc"].apply(null, arguments) };
	var _convertCompoundSelectToSubquery = Module["_convertCompoundSelectToSubquery"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_convertCompoundSelectToSubquery"].apply(null, arguments) };
	var _countFinalize = Module["_countFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_countFinalize"].apply(null, arguments) };
	var _countStep = Module["_countStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_countStep"].apply(null, arguments) };
	var _ctimeFunc = Module["_ctimeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_ctimeFunc"].apply(null, arguments) };
	var _ctimestampFunc = Module["_ctimestampFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_ctimestampFunc"].apply(null, arguments) };
	var _dateFunc = Module["_dateFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_dateFunc"].apply(null, arguments) };
	var _datetimeFunc = Module["_datetimeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_datetimeFunc"].apply(null, arguments) };
	var _detachFunc = Module["_detachFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_detachFunc"].apply(null, arguments) };
	var _do_read = Module["_do_read"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_do_read"].apply(null, arguments) };
	var _dotlockCheckReservedLock = Module["_dotlockCheckReservedLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_dotlockCheckReservedLock"].apply(null, arguments) };
	var _dotlockClose = Module["_dotlockClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_dotlockClose"].apply(null, arguments) };
	var _dotlockIoFinderImpl = Module["_dotlockIoFinderImpl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_dotlockIoFinderImpl"].apply(null, arguments) };
	var _dotlockLock = Module["_dotlockLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_dotlockLock"].apply(null, arguments) };
	var _dotlockUnlock = Module["_dotlockUnlock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_dotlockUnlock"].apply(null, arguments) };
	var _errlogFunc = Module["_errlogFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_errlogFunc"].apply(null, arguments) };
	var _exprIdxCover = Module["_exprIdxCover"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_exprIdxCover"].apply(null, arguments) };
	var _exprNodeIsConstant = Module["_exprNodeIsConstant"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_exprNodeIsConstant"].apply(null, arguments) };
	var _exprNodeIsConstantOrGroupBy = Module["_exprNodeIsConstantOrGroupBy"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_exprNodeIsConstantOrGroupBy"].apply(null, arguments) };
	var _exprNodeIsDeterministic = Module["_exprNodeIsDeterministic"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_exprNodeIsDeterministic"].apply(null, arguments) };
	var _exprSrcCount = Module["_exprSrcCount"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_exprSrcCount"].apply(null, arguments) };
	var _fchmod = Module["_fchmod"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_fchmod"].apply(null, arguments) };
	var _fchown = Module["_fchown"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_fchown"].apply(null, arguments) };
	var _fcntl = Module["_fcntl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_fcntl"].apply(null, arguments) };
	var _free = Module["_free"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_free"].apply(null, arguments) };
	var _fstat = Module["_fstat"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_fstat"].apply(null, arguments) };
	var _ftruncate = Module["_ftruncate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_ftruncate"].apply(null, arguments) };
	var _getPageError = Module["_getPageError"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_getPageError"].apply(null, arguments) };
	var _getPageNormal = Module["_getPageNormal"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_getPageNormal"].apply(null, arguments) };
	var _getcwd = Module["_getcwd"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_getcwd"].apply(null, arguments) };
	var _geteuid = Module["_geteuid"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_geteuid"].apply(null, arguments) };
	var _groupConcatFinalize = Module["_groupConcatFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_groupConcatFinalize"].apply(null, arguments) };
	var _groupConcatStep = Module["_groupConcatStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_groupConcatStep"].apply(null, arguments) };
	var _havingToWhereExprCb = Module["_havingToWhereExprCb"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_havingToWhereExprCb"].apply(null, arguments) };
	var _hexFunc = Module["_hexFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_hexFunc"].apply(null, arguments) };
	var _impliesNotNullRow = Module["_impliesNotNullRow"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_impliesNotNullRow"].apply(null, arguments) };
	var _incrAggDepth = Module["_incrAggDepth"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_incrAggDepth"].apply(null, arguments) };
	var _instrFunc = Module["_instrFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_instrFunc"].apply(null, arguments) };
	var _juliandayFunc = Module["_juliandayFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_juliandayFunc"].apply(null, arguments) };
	var _last_insert_rowid = Module["_last_insert_rowid"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_last_insert_rowid"].apply(null, arguments) };
	var _lengthFunc = Module["_lengthFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_lengthFunc"].apply(null, arguments) };
	var _likeFunc = Module["_likeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_likeFunc"].apply(null, arguments) };
	var _llvm_bswap_i32 = Module["_llvm_bswap_i32"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_llvm_bswap_i32"].apply(null, arguments) };
	var _lowerFunc = Module["_lowerFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_lowerFunc"].apply(null, arguments) };
	var _lstat = Module["_lstat"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_lstat"].apply(null, arguments) };
	var _malloc = Module["_malloc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_malloc"].apply(null, arguments) };
	var _memalign = Module["_memalign"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memalign"].apply(null, arguments) };
	var _memcpy = Module["_memcpy"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memcpy"].apply(null, arguments) };
	var _memjrnlClose = Module["_memjrnlClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memjrnlClose"].apply(null, arguments) };
	var _memjrnlFileSize = Module["_memjrnlFileSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memjrnlFileSize"].apply(null, arguments) };
	var _memjrnlRead = Module["_memjrnlRead"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memjrnlRead"].apply(null, arguments) };
	var _memjrnlSync = Module["_memjrnlSync"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memjrnlSync"].apply(null, arguments) };
	var _memjrnlTruncate = Module["_memjrnlTruncate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memjrnlTruncate"].apply(null, arguments) };
	var _memjrnlWrite = Module["_memjrnlWrite"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memjrnlWrite"].apply(null, arguments) };
	var _memmove = Module["_memmove"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memmove"].apply(null, arguments) };
	var _memset = Module["_memset"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_memset"].apply(null, arguments) };
	var _minMaxFinalize = Module["_minMaxFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_minMaxFinalize"].apply(null, arguments) };
	var _minmaxFunc = Module["_minmaxFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_minmaxFunc"].apply(null, arguments) };
	var _minmaxStep = Module["_minmaxStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_minmaxStep"].apply(null, arguments) };
	var _mkdir = Module["_mkdir"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_mkdir"].apply(null, arguments) };
	var _nocaseCollatingFunc = Module["_nocaseCollatingFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_nocaseCollatingFunc"].apply(null, arguments) };
	var _nolockCheckReservedLock = Module["_nolockCheckReservedLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_nolockCheckReservedLock"].apply(null, arguments) };
	var _nolockClose = Module["_nolockClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_nolockClose"].apply(null, arguments) };
	var _nolockIoFinderImpl = Module["_nolockIoFinderImpl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_nolockIoFinderImpl"].apply(null, arguments) };
	var _nolockLock = Module["_nolockLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_nolockLock"].apply(null, arguments) };
	var _nolockUnlock = Module["_nolockUnlock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_nolockUnlock"].apply(null, arguments) };
	var _nullifFunc = Module["_nullifFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_nullifFunc"].apply(null, arguments) };
	var _openDirectory = Module["_openDirectory"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_openDirectory"].apply(null, arguments) };
	var _pageReinit = Module["_pageReinit"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pageReinit"].apply(null, arguments) };
	var _pagerStress = Module["_pagerStress"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pagerStress"].apply(null, arguments) };
	var _pagerUndoCallback = Module["_pagerUndoCallback"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pagerUndoCallback"].apply(null, arguments) };
	var _pcache1Cachesize = Module["_pcache1Cachesize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Cachesize"].apply(null, arguments) };
	var _pcache1Create = Module["_pcache1Create"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Create"].apply(null, arguments) };
	var _pcache1Destroy = Module["_pcache1Destroy"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Destroy"].apply(null, arguments) };
	var _pcache1Fetch = Module["_pcache1Fetch"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Fetch"].apply(null, arguments) };
	var _pcache1Init = Module["_pcache1Init"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Init"].apply(null, arguments) };
	var _pcache1Pagecount = Module["_pcache1Pagecount"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Pagecount"].apply(null, arguments) };
	var _pcache1Rekey = Module["_pcache1Rekey"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Rekey"].apply(null, arguments) };
	var _pcache1Shrink = Module["_pcache1Shrink"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Shrink"].apply(null, arguments) };
	var _pcache1Shutdown = Module["_pcache1Shutdown"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Shutdown"].apply(null, arguments) };
	var _pcache1Truncate = Module["_pcache1Truncate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Truncate"].apply(null, arguments) };
	var _pcache1Unpin = Module["_pcache1Unpin"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pcache1Unpin"].apply(null, arguments) };
	var _posixIoFinderImpl = Module["_posixIoFinderImpl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_posixIoFinderImpl"].apply(null, arguments) };
	var _posixOpen = Module["_posixOpen"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_posixOpen"].apply(null, arguments) };
	var _pragmaVtabBestIndex = Module["_pragmaVtabBestIndex"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabBestIndex"].apply(null, arguments) };
	var _pragmaVtabClose = Module["_pragmaVtabClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabClose"].apply(null, arguments) };
	var _pragmaVtabColumn = Module["_pragmaVtabColumn"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabColumn"].apply(null, arguments) };
	var _pragmaVtabConnect = Module["_pragmaVtabConnect"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabConnect"].apply(null, arguments) };
	var _pragmaVtabDisconnect = Module["_pragmaVtabDisconnect"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabDisconnect"].apply(null, arguments) };
	var _pragmaVtabEof = Module["_pragmaVtabEof"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabEof"].apply(null, arguments) };
	var _pragmaVtabFilter = Module["_pragmaVtabFilter"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabFilter"].apply(null, arguments) };
	var _pragmaVtabNext = Module["_pragmaVtabNext"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabNext"].apply(null, arguments) };
	var _pragmaVtabOpen = Module["_pragmaVtabOpen"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabOpen"].apply(null, arguments) };
	var _pragmaVtabRowid = Module["_pragmaVtabRowid"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pragmaVtabRowid"].apply(null, arguments) };
	var _printfFunc = Module["_printfFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_printfFunc"].apply(null, arguments) };
	var _pthread_mutex_lock = Module["_pthread_mutex_lock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pthread_mutex_lock"].apply(null, arguments) };
	var _pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_pthread_mutex_unlock"].apply(null, arguments) };
	var _quoteFunc = Module["_quoteFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_quoteFunc"].apply(null, arguments) };
	var _randomBlob = Module["_randomBlob"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_randomBlob"].apply(null, arguments) };
	var _randomFunc = Module["_randomFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_randomFunc"].apply(null, arguments) };
	var _read = Module["_read"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_read"].apply(null, arguments) };
	var _readlink = Module["_readlink"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_readlink"].apply(null, arguments) };
	var _renameParentFunc = Module["_renameParentFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_renameParentFunc"].apply(null, arguments) };
	var _renameTableFunc = Module["_renameTableFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_renameTableFunc"].apply(null, arguments) };
	var _renameTriggerFunc = Module["_renameTriggerFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_renameTriggerFunc"].apply(null, arguments) };
	var _replaceFunc = Module["_replaceFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_replaceFunc"].apply(null, arguments) };
	var _resolveExprStep = Module["_resolveExprStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_resolveExprStep"].apply(null, arguments) };
	var _resolveSelectStep = Module["_resolveSelectStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_resolveSelectStep"].apply(null, arguments) };
	var _rmdir = Module["_rmdir"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_rmdir"].apply(null, arguments) };
	var _round = Module["_round"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_round"].apply(null, arguments) };
	var _roundFunc = Module["_roundFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_roundFunc"].apply(null, arguments) };
	var _sbrk = Module["_sbrk"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sbrk"].apply(null, arguments) };
	var _selectAddSubqueryTypeInfo = Module["_selectAddSubqueryTypeInfo"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_selectAddSubqueryTypeInfo"].apply(null, arguments) };
	var _selectExpander = Module["_selectExpander"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_selectExpander"].apply(null, arguments) };
	var _selectPopWith = Module["_selectPopWith"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_selectPopWith"].apply(null, arguments) };
	var _sn_write = Module["_sn_write"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sn_write"].apply(null, arguments) };
	var _sourceidFunc = Module["_sourceidFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sourceidFunc"].apply(null, arguments) };
	var _sqlite3BtreeNext = Module["_sqlite3BtreeNext"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3BtreeNext"].apply(null, arguments) };
	var _sqlite3BtreePrevious = Module["_sqlite3BtreePrevious"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3BtreePrevious"].apply(null, arguments) };
	var _sqlite3ExprIfFalse = Module["_sqlite3ExprIfFalse"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3ExprIfFalse"].apply(null, arguments) };
	var _sqlite3ExprIfTrue = Module["_sqlite3ExprIfTrue"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3ExprIfTrue"].apply(null, arguments) };
	var _sqlite3ExprWalkNoop = Module["_sqlite3ExprWalkNoop"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3ExprWalkNoop"].apply(null, arguments) };
	var _sqlite3InitCallback = Module["_sqlite3InitCallback"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3InitCallback"].apply(null, arguments) };
	var _sqlite3InvalidFunction = Module["_sqlite3InvalidFunction"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3InvalidFunction"].apply(null, arguments) };
	var _sqlite3MallocSize = Module["_sqlite3MallocSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3MallocSize"].apply(null, arguments) };
	var _sqlite3MemFree = Module["_sqlite3MemFree"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3MemFree"].apply(null, arguments) };
	var _sqlite3MemInit = Module["_sqlite3MemInit"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3MemInit"].apply(null, arguments) };
	var _sqlite3MemMalloc = Module["_sqlite3MemMalloc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3MemMalloc"].apply(null, arguments) };
	var _sqlite3MemRealloc = Module["_sqlite3MemRealloc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3MemRealloc"].apply(null, arguments) };
	var _sqlite3MemRoundup = Module["_sqlite3MemRoundup"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3MemRoundup"].apply(null, arguments) };
	var _sqlite3MemShutdown = Module["_sqlite3MemShutdown"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3MemShutdown"].apply(null, arguments) };
	var _sqlite3MemSize = Module["_sqlite3MemSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3MemSize"].apply(null, arguments) };
	var _sqlite3SchemaClear = Module["_sqlite3SchemaClear"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3SchemaClear"].apply(null, arguments) };
	var _sqlite3SelectWalkFail = Module["_sqlite3SelectWalkFail"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3SelectWalkFail"].apply(null, arguments) };
	var _sqlite3SelectWalkNoop = Module["_sqlite3SelectWalkNoop"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3SelectWalkNoop"].apply(null, arguments) };
	var _sqlite3VdbeRecordCompare = Module["_sqlite3VdbeRecordCompare"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3VdbeRecordCompare"].apply(null, arguments) };
	var _sqlite3WalDefaultHook = Module["_sqlite3WalDefaultHook"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3WalDefaultHook"].apply(null, arguments) };
	var _sqlite3_free = Module["_sqlite3_free"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3_free"].apply(null, arguments) };
	var _sqlite3_value_text = Module["_sqlite3_value_text"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqlite3_value_text"].apply(null, arguments) };
	var _sqliteDefaultBusyCallback = Module["_sqliteDefaultBusyCallback"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sqliteDefaultBusyCallback"].apply(null, arguments) };
	var _stat = Module["_stat"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_stat"].apply(null, arguments) };
	var _stat4Destructor = Module["_stat4Destructor"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_stat4Destructor"].apply(null, arguments) };
	var _statGet = Module["_statGet"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_statGet"].apply(null, arguments) };
	var _statInit = Module["_statInit"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_statInit"].apply(null, arguments) };
	var _statPush = Module["_statPush"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_statPush"].apply(null, arguments) };
	var _strftimeFunc = Module["_strftimeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_strftimeFunc"].apply(null, arguments) };
	var _substrFunc = Module["_substrFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_substrFunc"].apply(null, arguments) };
	var _sumFinalize = Module["_sumFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sumFinalize"].apply(null, arguments) };
	var _sumStep = Module["_sumStep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_sumStep"].apply(null, arguments) };
	var _timeFunc = Module["_timeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_timeFunc"].apply(null, arguments) };
	var _totalFinalize = Module["_totalFinalize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_totalFinalize"].apply(null, arguments) };
	var _total_changes = Module["_total_changes"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_total_changes"].apply(null, arguments) };
	var _trace_processor_notifyEof = Module["_trace_processor_notifyEof"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_trace_processor_notifyEof"].apply(null, arguments) };
	var _trace_processor_parse = Module["_trace_processor_parse"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_trace_processor_parse"].apply(null, arguments) };
	var _trace_processor_rawQuery = Module["_trace_processor_rawQuery"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_trace_processor_rawQuery"].apply(null, arguments) };
	var _trimFunc = Module["_trimFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_trimFunc"].apply(null, arguments) };
	var _typeofFunc = Module["_typeofFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_typeofFunc"].apply(null, arguments) };
	var _unicodeFunc = Module["_unicodeFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unicodeFunc"].apply(null, arguments) };
	var _unixAccess = Module["_unixAccess"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixAccess"].apply(null, arguments) };
	var _unixCheckReservedLock = Module["_unixCheckReservedLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixCheckReservedLock"].apply(null, arguments) };
	var _unixClose = Module["_unixClose"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixClose"].apply(null, arguments) };
	var _unixCurrentTimeInt64 = Module["_unixCurrentTimeInt64"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixCurrentTimeInt64"].apply(null, arguments) };
	var _unixDelete = Module["_unixDelete"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixDelete"].apply(null, arguments) };
	var _unixDeviceCharacteristics = Module["_unixDeviceCharacteristics"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixDeviceCharacteristics"].apply(null, arguments) };
	var _unixFetch = Module["_unixFetch"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixFetch"].apply(null, arguments) };
	var _unixFileControl = Module["_unixFileControl"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixFileControl"].apply(null, arguments) };
	var _unixFileSize = Module["_unixFileSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixFileSize"].apply(null, arguments) };
	var _unixFullPathname = Module["_unixFullPathname"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixFullPathname"].apply(null, arguments) };
	var _unixGetLastError = Module["_unixGetLastError"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixGetLastError"].apply(null, arguments) };
	var _unixGetSystemCall = Module["_unixGetSystemCall"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixGetSystemCall"].apply(null, arguments) };
	var _unixGetpagesize = Module["_unixGetpagesize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixGetpagesize"].apply(null, arguments) };
	var _unixLock = Module["_unixLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixLock"].apply(null, arguments) };
	var _unixNextSystemCall = Module["_unixNextSystemCall"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixNextSystemCall"].apply(null, arguments) };
	var _unixOpen = Module["_unixOpen"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixOpen"].apply(null, arguments) };
	var _unixRandomness = Module["_unixRandomness"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixRandomness"].apply(null, arguments) };
	var _unixRead = Module["_unixRead"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixRead"].apply(null, arguments) };
	var _unixSectorSize = Module["_unixSectorSize"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixSectorSize"].apply(null, arguments) };
	var _unixSetSystemCall = Module["_unixSetSystemCall"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixSetSystemCall"].apply(null, arguments) };
	var _unixShmBarrier = Module["_unixShmBarrier"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixShmBarrier"].apply(null, arguments) };
	var _unixShmLock = Module["_unixShmLock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixShmLock"].apply(null, arguments) };
	var _unixShmMap = Module["_unixShmMap"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixShmMap"].apply(null, arguments) };
	var _unixShmUnmap = Module["_unixShmUnmap"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixShmUnmap"].apply(null, arguments) };
	var _unixSleep = Module["_unixSleep"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixSleep"].apply(null, arguments) };
	var _unixSync = Module["_unixSync"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixSync"].apply(null, arguments) };
	var _unixTruncate = Module["_unixTruncate"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixTruncate"].apply(null, arguments) };
	var _unixUnfetch = Module["_unixUnfetch"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixUnfetch"].apply(null, arguments) };
	var _unixUnlock = Module["_unixUnlock"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixUnlock"].apply(null, arguments) };
	var _unixWrite = Module["_unixWrite"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unixWrite"].apply(null, arguments) };
	var _unlink = Module["_unlink"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_unlink"].apply(null, arguments) };
	var _upperFunc = Module["_upperFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_upperFunc"].apply(null, arguments) };
	var _vdbeRecordCompareInt = Module["_vdbeRecordCompareInt"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_vdbeRecordCompareInt"].apply(null, arguments) };
	var _vdbeRecordCompareString = Module["_vdbeRecordCompareString"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_vdbeRecordCompareString"].apply(null, arguments) };
	var _vdbeSorterCompare = Module["_vdbeSorterCompare"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_vdbeSorterCompare"].apply(null, arguments) };
	var _vdbeSorterCompareInt = Module["_vdbeSorterCompareInt"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_vdbeSorterCompareInt"].apply(null, arguments) };
	var _vdbeSorterCompareText = Module["_vdbeSorterCompareText"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_vdbeSorterCompareText"].apply(null, arguments) };
	var _versionFunc = Module["_versionFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_versionFunc"].apply(null, arguments) };
	var _whereIndexExprTransNode = Module["_whereIndexExprTransNode"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_whereIndexExprTransNode"].apply(null, arguments) };
	var _write = Module["_write"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_write"].apply(null, arguments) };
	var _zeroblobFunc = Module["_zeroblobFunc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["_zeroblobFunc"].apply(null, arguments) };
	var establishStackSpace = Module["establishStackSpace"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["establishStackSpace"].apply(null, arguments) };
	var getTempRet0 = Module["getTempRet0"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["getTempRet0"].apply(null, arguments) };
	var runPostSets = Module["runPostSets"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["runPostSets"].apply(null, arguments) };
	var setTempRet0 = Module["setTempRet0"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["setTempRet0"].apply(null, arguments) };
	var setThrew = Module["setThrew"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["setThrew"].apply(null, arguments) };
	var stackAlloc = Module["stackAlloc"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["stackAlloc"].apply(null, arguments) };
	var stackRestore = Module["stackRestore"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["stackRestore"].apply(null, arguments) };
	var stackSave = Module["stackSave"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["stackSave"].apply(null, arguments) };
	var dynCall_i = Module["dynCall_i"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_i"].apply(null, arguments) };
	var dynCall_ii = Module["dynCall_ii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_ii"].apply(null, arguments) };
	var dynCall_iii = Module["dynCall_iii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_iii"].apply(null, arguments) };
	var dynCall_iiii = Module["dynCall_iiii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_iiii"].apply(null, arguments) };
	var dynCall_iiiii = Module["dynCall_iiiii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_iiiii"].apply(null, arguments) };
	var dynCall_iiiiii = Module["dynCall_iiiiii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_iiiiii"].apply(null, arguments) };
	var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_iiiiiii"].apply(null, arguments) };
	var dynCall_iiiij = Module["dynCall_iiiij"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_iiiij"].apply(null, arguments) };
	var dynCall_iij = Module["dynCall_iij"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_iij"].apply(null, arguments) };
	var dynCall_iiji = Module["dynCall_iiji"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_iiji"].apply(null, arguments) };
	var dynCall_iijii = Module["dynCall_iijii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_iijii"].apply(null, arguments) };
	var dynCall_ji = Module["dynCall_ji"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_ji"].apply(null, arguments) };
	var dynCall_v = Module["dynCall_v"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_v"].apply(null, arguments) };
	var dynCall_vi = Module["dynCall_vi"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_vi"].apply(null, arguments) };
	var dynCall_vii = Module["dynCall_vii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_vii"].apply(null, arguments) };
	var dynCall_viii = Module["dynCall_viii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_viii"].apply(null, arguments) };
	var dynCall_viiii = Module["dynCall_viiii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_viiii"].apply(null, arguments) };
	var dynCall_viiiii = Module["dynCall_viiiii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_viiiii"].apply(null, arguments) };
	var dynCall_viiiij = Module["dynCall_viiiij"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_viiiij"].apply(null, arguments) };
	var dynCall_viij = Module["dynCall_viij"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_viij"].apply(null, arguments) };
	var dynCall_viiji = Module["dynCall_viiji"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_viiji"].apply(null, arguments) };
	var dynCall_viijiiii = Module["dynCall_viijiiii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_viijiiii"].apply(null, arguments) };
	var dynCall_viji = Module["dynCall_viji"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_viji"].apply(null, arguments) };
	var dynCall_vijii = Module["dynCall_vijii"] = function() {
	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
	  return Module["asm"]["dynCall_vijii"].apply(null, arguments) };



	// === Auto-generated postamble setup entry stuff ===

	Module['asm'] = asm;

	if (!Module["intArrayFromString"]) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["intArrayToString"]) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	Module["ccall"] = ccall;
	Module["cwrap"] = cwrap;
	if (!Module["setValue"]) Module["setValue"] = function() { abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["getValue"]) Module["getValue"] = function() { abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["allocate"]) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["getMemory"]) Module["getMemory"] = function() { abort("'getMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["Pointer_stringify"]) Module["Pointer_stringify"] = function() { abort("'Pointer_stringify' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["AsciiToString"]) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["stringToAscii"]) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["UTF8ArrayToString"]) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["UTF8ToString"]) Module["UTF8ToString"] = function() { abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["stringToUTF8Array"]) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["stringToUTF8"]) Module["stringToUTF8"] = function() { abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["lengthBytesUTF8"]) Module["lengthBytesUTF8"] = function() { abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["UTF16ToString"]) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["stringToUTF16"]) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["lengthBytesUTF16"]) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["UTF32ToString"]) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["stringToUTF32"]) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["lengthBytesUTF32"]) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["allocateUTF8"]) Module["allocateUTF8"] = function() { abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["stackTrace"]) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["addOnPreRun"]) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["addOnInit"]) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["addOnPreMain"]) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["addOnExit"]) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["addOnPostRun"]) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["writeStringToMemory"]) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["writeArrayToMemory"]) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["writeAsciiToMemory"]) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["addRunDependency"]) Module["addRunDependency"] = function() { abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["removeRunDependency"]) Module["removeRunDependency"] = function() { abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["FS"]) Module["FS"] = function() { abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["FS_createFolder"]) Module["FS_createFolder"] = function() { abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["FS_createPath"]) Module["FS_createPath"] = function() { abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["FS_createDataFile"]) Module["FS_createDataFile"] = function() { abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["FS_createPreloadedFile"]) Module["FS_createPreloadedFile"] = function() { abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["FS_createLazyFile"]) Module["FS_createLazyFile"] = function() { abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["FS_createLink"]) Module["FS_createLink"] = function() { abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["FS_createDevice"]) Module["FS_createDevice"] = function() { abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["FS_unlink"]) Module["FS_unlink"] = function() { abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
	if (!Module["GL"]) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["staticAlloc"]) Module["staticAlloc"] = function() { abort("'staticAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["dynamicAlloc"]) Module["dynamicAlloc"] = function() { abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["warnOnce"]) Module["warnOnce"] = function() { abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["loadDynamicLibrary"]) Module["loadDynamicLibrary"] = function() { abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["loadWebAssemblyModule"]) Module["loadWebAssemblyModule"] = function() { abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["getLEB"]) Module["getLEB"] = function() { abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["getFunctionTables"]) Module["getFunctionTables"] = function() { abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["alignFunctionTables"]) Module["alignFunctionTables"] = function() { abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["registerFunctions"]) Module["registerFunctions"] = function() { abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	Module["addFunction"] = addFunction;
	if (!Module["removeFunction"]) Module["removeFunction"] = function() { abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["getFuncWrapper"]) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["prettyPrint"]) Module["prettyPrint"] = function() { abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["makeBigInt"]) Module["makeBigInt"] = function() { abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["dynCall"]) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["getCompilerSetting"]) Module["getCompilerSetting"] = function() { abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["stackSave"]) Module["stackSave"] = function() { abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["stackRestore"]) Module["stackRestore"] = function() { abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
	if (!Module["stackAlloc"]) Module["stackAlloc"] = function() { abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };if (!Module["ALLOC_NORMAL"]) Object.defineProperty(Module, "ALLOC_NORMAL", { get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });
	if (!Module["ALLOC_STACK"]) Object.defineProperty(Module, "ALLOC_STACK", { get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });
	if (!Module["ALLOC_STATIC"]) Object.defineProperty(Module, "ALLOC_STATIC", { get: function() { abort("'ALLOC_STATIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });
	if (!Module["ALLOC_DYNAMIC"]) Object.defineProperty(Module, "ALLOC_DYNAMIC", { get: function() { abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });
	if (!Module["ALLOC_NONE"]) Object.defineProperty(Module, "ALLOC_NONE", { get: function() { abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });



	// Modularize mode returns a function, which can be called to
	// create instances. The instances provide a then() method,
	// must like a Promise, that receives a callback. The callback
	// is called when the module is ready to run, with the module
	// as a parameter. (Like a Promise, it also returns the module
	// so you can use the output of .then(..)).
	Module['then'] = function(func) {
	  // We may already be ready to run code at this time. if
	  // so, just queue a call to the callback.
	  if (Module['calledRun']) {
	    func(Module);
	  } else {
	    // we are not ready to call then() yet. we must call it
	    // at the same time we would call onRuntimeInitialized.
	    var old = Module['onRuntimeInitialized'];
	    Module['onRuntimeInitialized'] = function() {
	      if (old) old();
	      func(Module);
	    };
	  }
	  return Module;
	};

	/**
	 * @constructor
	 * @extends {Error}
	 * @this {ExitStatus}
	 */
	function ExitStatus(status) {
	  this.name = "ExitStatus";
	  this.message = "Program terminated with exit(" + status + ")";
	  this.status = status;
	}ExitStatus.prototype = new Error();
	ExitStatus.prototype.constructor = ExitStatus;

	var initialStackTop;

	dependenciesFulfilled = function runCaller() {
	  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
	  if (!Module['calledRun']) run();
	  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
	};





	/** @type {function(Array=)} */
	function run(args) {
	  args = args || Module['arguments'];

	  if (runDependencies > 0) {
	    return;
	  }

	  writeStackCookie();

	  preRun();

	  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
	  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

	  function doRun() {
	    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
	    Module['calledRun'] = true;

	    if (ABORT) return;

	    ensureInitRuntime();

	    preMain();

	    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

	    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

	    postRun();
	  }

	  if (Module['setStatus']) {
	    Module['setStatus']('Running...');
	    setTimeout(function() {
	      setTimeout(function() {
	        Module['setStatus']('');
	      }, 1);
	      doRun();
	    }, 1);
	  } else {
	    doRun();
	  }
	  checkStackCookie();
	}
	Module['run'] = run;

	function checkUnflushedContent() {
	  // Compiler settings do not allow exiting the runtime, so flushing
	  // the streams is not possible. but in ASSERTIONS mode we check
	  // if there was something to flush, and if so tell the user they
	  // should request that the runtime be exitable.
	  // Normally we would not even include flush() at all, but in ASSERTIONS
	  // builds we do so just for this check, and here we see if there is any
	  // content to flush, that is, we check if there would have been
	  // something a non-ASSERTIONS build would have not seen.
	  // How we flush the streams depends on whether we are in NO_FILESYSTEM
	  // mode (which has its own special function for this; otherwise, all
	  // the code is inside libc)
	  var print = Module['print'];
	  var printErr = Module['printErr'];
	  var has = false;
	  Module['print'] = Module['printErr'] = function(x) {
	    has = true;
	  };
	  try { // it doesn't matter if it fails
	    var flush = flush_NO_FILESYSTEM;
	    if (flush) flush(0);
	  } catch(e) {}
	  Module['print'] = print;
	  Module['printErr'] = printErr;
	  if (has) {
	    warnOnce('stdio streams had content in them that was not flushed. you should set NO_EXIT_RUNTIME to 0 (see the FAQ), or make sure to emit a newline when you printf etc.');
	  }
	}

	function exit(status, implicit) {
	  checkUnflushedContent();

	  // if this is just main exit-ing implicitly, and the status is 0, then we
	  // don't need to do anything here and can just leave. if the status is
	  // non-zero, though, then we need to report it.
	  // (we may have warned about this earlier, if a situation justifies doing so)
	  if (implicit && Module['noExitRuntime'] && status === 0) {
	    return;
	  }

	  if (Module['noExitRuntime']) {
	    // if exit() was called, we may warn the user if the runtime isn't actually being shut down
	    if (!implicit) {
	      Module.printErr('exit(' + status + ') called, but NO_EXIT_RUNTIME is set, so halting execution but not exiting the runtime or preventing further async execution (build with NO_EXIT_RUNTIME=0, if you want a true shutdown)');
	    }
	  } else {

	    ABORT = true;
	    STACKTOP = initialStackTop;

	    exitRuntime();

	    if (Module['onExit']) Module['onExit'](status);
	  }

	  if (ENVIRONMENT_IS_NODE) {
	    process['exit'](status);
	  }
	  Module['quit'](status, new ExitStatus(status));
	}
	Module['exit'] = exit;

	var abortDecorators = [];

	function abort(what) {
	  if (Module['onAbort']) {
	    Module['onAbort'](what);
	  }

	  if (what !== undefined) {
	    Module.print(what);
	    Module.printErr(what);
	    what = JSON.stringify(what);
	  } else {
	    what = '';
	  }

	  ABORT = true;

	  var extra = '';
	  var output = 'abort(' + what + ') at ' + stackTrace() + extra;
	  if (abortDecorators) {
	    abortDecorators.forEach(function(decorator) {
	      output = decorator(output, what);
	    });
	  }
	  throw output;
	}
	Module['abort'] = abort;

	// {{PRE_RUN_ADDITIONS}}

	if (Module['preInit']) {
	  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
	  while (Module['preInit'].length > 0) {
	    Module['preInit'].pop()();
	  }
	}


	Module["noExitRuntime"] = true;

	run();

	// {{POST_RUN_ADDITIONS}}





	// {{MODULE_ADDITIONS}}





	  return Module;
	};
	module.exports = Module;
	});

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
	            t[p[i]] = s[p[i]];
	    return t;
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __param(paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	function __awaiter(thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	function __exportStar(m, exports) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}

	function __values(o) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
	    if (m) return m.call(o);
	    return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	function __await(v) {
	    return this instanceof __await ? (this.v = v, this) : new __await(v);
	}

	function __asyncGenerator(thisArg, _arguments, generator) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var g = generator.apply(thisArg, _arguments || []), i, q = [];
	    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
	    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
	    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
	    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
	    function fulfill(value) { resume("next", value); }
	    function reject(value) { resume("throw", value); }
	    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
	}

	function __asyncDelegator(o) {
	    var i, p;
	    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
	    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
	}

	function __asyncValues(o) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var m = o[Symbol.asyncIterator], i;
	    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
	    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
	    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
	}

	function __makeTemplateObject(cooked, raw) {
	    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
	    return cooked;
	}
	function __importStar(mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result.default = mod;
	    return result;
	}

	function __importDefault(mod) {
	    return (mod && mod.__esModule) ? mod : { default: mod };
	}

	var tslib_es6 = /*#__PURE__*/Object.freeze({
		__extends: __extends,
		get __assign () { return __assign; },
		__rest: __rest,
		__decorate: __decorate,
		__param: __param,
		__metadata: __metadata,
		__awaiter: __awaiter,
		__generator: __generator,
		__exportStar: __exportStar,
		__values: __values,
		__read: __read,
		__spread: __spread,
		__await: __await,
		__asyncGenerator: __asyncGenerator,
		__asyncDelegator: __asyncDelegator,
		__asyncValues: __asyncValues,
		__makeTemplateObject: __makeTemplateObject,
		__importStar: __importStar,
		__importDefault: __importDefault
	});

	var deferred = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Create a promise with exposed resolve and reject callbacks.
	 */
	function defer() {
	    let resolve = null;
	    let reject = null;
	    const p = new Promise((res, rej) => [resolve, reject] = [res, rej]);
	    return Object.assign(p, { resolve, reject });
	}
	exports.defer = defer;

	});

	unwrapExports(deferred);
	var deferred_1 = deferred.defer;

	var wasm_bridge = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });


	function writeToUIConsole(line) {
	    console.log(line);
	}
	class WasmBridge {
	    constructor(init, callback) {
	        this.deferredRuntimeInitialized = deferred.defer();
	        this.deferredReady = deferred.defer();
	        this.callback = callback;
	        this.aborted = false;
	        this.outstandingRequests = new Set();
	        this.connection = init({
	            locateFile: (s) => s,
	            print: writeToUIConsole,
	            printErr: writeToUIConsole,
	            onRuntimeInitialized: () => this.deferredRuntimeInitialized.resolve(),
	            onAbort: () => this.onAbort(),
	        });
	    }
	    onAbort() {
	        this.aborted = true;
	        for (const id of this.outstandingRequests) {
	            this.abortRequest(id);
	        }
	        this.outstandingRequests.clear();
	    }
	    onReply(reqId, success, heapPtr, size) {
	        if (!this.outstandingRequests.has(reqId)) {
	            throw new Error(`Unknown request id: "${reqId}"`);
	        }
	        this.outstandingRequests.delete(reqId);
	        const data = this.connection.HEAPU8.slice(heapPtr, heapPtr + size);
	        this.callback({
	            id: reqId,
	            success,
	            data,
	        });
	    }
	    abortRequest(requestId) {
	        this.callback({
	            id: requestId,
	            success: false,
	            data: undefined,
	        });
	    }
	    callWasm(req) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            yield this.deferredReady;
	            if (this.aborted) {
	                this.abortRequest(req.id);
	                return;
	            }
	            this.outstandingRequests.add(req.id);
	            this.connection.ccall(`${req.serviceName}_${req.methodName}`, // C method name.
	            'void', // Return type.
	            ['number', 'array', 'number'], // Input args.
	            [req.id, req.data, req.data.length] // Args.
	            );
	        });
	    }
	    initialize() {
	        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
	            yield this.deferredRuntimeInitialized;
	            const replyFn = this.connection.addFunction(this.onReply.bind(this), 'viiii');
	            this.connection.ccall('Initialize', 'void', ['number'], [replyFn]);
	            this.deferredReady.resolve();
	        });
	    }
	}
	exports.WasmBridge = WasmBridge;

	});

	unwrapExports(wasm_bridge);
	var wasm_bridge_1 = wasm_bridge.WasmBridge;

	var engine = createCommonjsModule(function (module, exports) {
	// Copyright (C) 2018 The Android Open Source Project
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(exports, "__esModule", { value: true });


	// tslint:disable no-any
	// We expect to get exactly one message from the creator of the worker:
	// a MessagePort we should listen to for future messages.
	// This indirection is due to workers not being able create workers in Chrome
	// which is tracked at: crbug.com/31666
	// TODO(hjd): Remove this once the fix has landed.
	// Once we have the MessagePort we proxy all messages to WasmBridge#callWasm.
	const anySelf = self;
	anySelf.onmessage = (msg) => {
	    const port = msg.data;
	    const bridge = new wasm_bridge.WasmBridge(trace_processor, port.postMessage.bind(port));
	    bridge.initialize();
	    port.onmessage = (msg) => {
	        const request = msg.data;
	        bridge.callWasm(request);
	    };
	};

	});

	var index = unwrapExports(engine);

	return index;

}());
//# sourceMappingURL=engine_bundle.js.map

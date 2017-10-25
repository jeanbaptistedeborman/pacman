/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 109);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(118)
var ieee754 = __webpack_require__(171)
var isArray = __webpack_require__(74)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(1)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function (module, exports) {
  'use strict';

  // Utils
  function assert (val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  // Could use `inherits` module, but don't want to move from single file
  // architecture yet.
  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  }

  // BN

  function BN (number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0;

    // Reduction context
    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }
  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;

  var Buffer;
  try {
    Buffer = __webpack_require__(202).Buffer;
  } catch (e) {
  }

  BN.isBN = function isBN (num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' &&
      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max (left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min (left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init (number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }
    assert(base === (base | 0) && base >= 2 && base <= 36);

    number = number.toString().replace(/\s+/g, '');
    var start = 0;
    if (number[0] === '-') {
      start++;
    }

    if (base === 16) {
      this._parseHex(number, start);
    } else {
      this._parseBase(number, base, start);
    }

    if (number[0] === '-') {
      this.negative = 1;
    }

    this.strip();

    if (endian !== 'le') return;

    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initNumber = function _initNumber (number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [ number & 0x3ffffff ];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff,
        1
      ];
      this.length = 3;
    }

    if (endian !== 'le') return;

    // Reverse the bytes
    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray (number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    if (number.length <= 0) {
      this.words = [ 0 ];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;
    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }
    return this.strip();
  };

  function parseHex (str, start, end) {
    var r = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r <<= 4;

      // 'a' - 'f'
      if (c >= 49 && c <= 54) {
        r |= c - 49 + 0xa;

      // 'A' - 'F'
      } else if (c >= 17 && c <= 22) {
        r |= c - 17 + 0xa;

      // '0' - '9'
      } else {
        r |= c & 0xf;
      }
    }
    return r;
  }

  BN.prototype._parseHex = function _parseHex (number, start) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    // Scan 24-bit chunks and add them to the number
    var off = 0;
    for (i = number.length - 6, j = 0; i >= start; i -= 6) {
      w = parseHex(number, i, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
      off += 24;
      if (off >= 26) {
        off -= 26;
        j++;
      }
    }
    if (i + 6 !== start) {
      w = parseHex(number, start, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
    }
    this.strip();
  };

  function parseBase (str, start, end, mul) {
    var r = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r *= mul;

      // 'a'
      if (c >= 49) {
        r += c - 49 + 0xa;

      // 'A'
      } else if (c >= 17) {
        r += c - 17 + 0xa;

      // '0' - '9'
      } else {
        r += c;
      }
    }
    return r;
  }

  BN.prototype._parseBase = function _parseBase (number, base, start) {
    // Initialize as zero
    this.words = [ 0 ];
    this.length = 1;

    // Find length of limb in base
    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }
    limbLen--;
    limbPow = (limbPow / base) | 0;

    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;

    var word = 0;
    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);

      this.imuln(limbPow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }
  };

  BN.prototype.copy = function copy (dest) {
    dest.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  BN.prototype.clone = function clone () {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand (size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }
    return this;
  };

  // Remove leading `0` from `this`
  BN.prototype.strip = function strip () {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }
    return this._normSign();
  };

  BN.prototype._normSign = function _normSign () {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }
    return this;
  };

  BN.prototype.inspect = function inspect () {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  };

  /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */

  var zeros = [
    '',
    '0',
    '00',
    '000',
    '0000',
    '00000',
    '000000',
    '0000000',
    '00000000',
    '000000000',
    '0000000000',
    '00000000000',
    '000000000000',
    '0000000000000',
    '00000000000000',
    '000000000000000',
    '0000000000000000',
    '00000000000000000',
    '000000000000000000',
    '0000000000000000000',
    '00000000000000000000',
    '000000000000000000000',
    '0000000000000000000000',
    '00000000000000000000000',
    '000000000000000000000000',
    '0000000000000000000000000'
  ];

  var groupSizes = [
    0, 0,
    25, 16, 12, 11, 10, 9, 8,
    8, 7, 7, 7, 7, 6, 6,
    6, 6, 6, 6, 6, 5, 5,
    5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5
  ];

  var groupBases = [
    0, 0,
    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
  ];

  BN.prototype.toString = function toString (base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;

    var out;
    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = (((w << off) | carry) & 0xffffff).toString(16);
        carry = (w >>> (24 - off)) & 0xffffff;
        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }
        off += 2;
        if (off >= 26) {
          off -= 26;
          i--;
        }
      }
      if (carry !== 0) {
        out = carry.toString(16) + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base];
      // var groupBase = Math.pow(base, groupSize);
      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;
      while (!c.isZero()) {
        var r = c.modn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }
      if (this.isZero()) {
        out = '0' + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber () {
    var ret = this.words[0];
    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }
    return (this.negative !== 0) ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON () {
    return this.toString(16);
  };

  BN.prototype.toBuffer = function toBuffer (endian, length) {
    assert(typeof Buffer !== 'undefined');
    return this.toArrayLike(Buffer, endian, length);
  };

  BN.prototype.toArray = function toArray (endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');

    this.strip();
    var littleEndian = endian === 'le';
    var res = new ArrayType(reqLength);

    var b, i;
    var q = this.clone();
    if (!littleEndian) {
      // Assume big-endian
      for (i = 0; i < reqLength - byteLength; i++) {
        res[i] = 0;
      }

      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[reqLength - i - 1] = b;
      }
    } else {
      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[i] = b;
      }

      for (; i < reqLength; i++) {
        res[i] = 0;
      }
    }

    return res;
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits (w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits (w) {
      var t = w;
      var r = 0;
      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }
      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }
      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }
      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }
      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits (w) {
    // Short-cut
    if (w === 0) return 26;

    var t = w;
    var r = 0;
    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }
    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }
    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }
    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }
    if ((t & 0x1) === 0) {
      r++;
    }
    return r;
  };

  // Return number of used bits in a BN
  BN.prototype.bitLength = function bitLength () {
    var w = this.words[this.length - 1];
    var hi = this._countBits(w);
    return (this.length - 1) * 26 + hi;
  };

  function toBitArray (num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
    }

    return w;
  }

  // Number of trailing zero bits
  BN.prototype.zeroBits = function zeroBits () {
    if (this.isZero()) return 0;

    var r = 0;
    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);
      r += b;
      if (b !== 26) break;
    }
    return r;
  };

  BN.prototype.byteLength = function byteLength () {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos (width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }
    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos (width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }
    return this.clone();
  };

  BN.prototype.isNeg = function isNeg () {
    return this.negative !== 0;
  };

  // Return negative clone of `this`
  BN.prototype.neg = function neg () {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg () {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  };

  // Or `num` with `this` in-place
  BN.prototype.iuor = function iuor (num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this.strip();
  };

  BN.prototype.ior = function ior (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  };

  // Or `num` with `this`
  BN.prototype.or = function or (num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor (num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  };

  // And `num` with `this` in-place
  BN.prototype.iuand = function iuand (num) {
    // b = min-length(num, this)
    var b;
    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;

    return this.strip();
  };

  BN.prototype.iand = function iand (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  };

  // And `num` with `this`
  BN.prototype.and = function and (num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand (num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  };

  // Xor `num` with `this` in-place
  BN.prototype.iuxor = function iuxor (num) {
    // a.length > b.length
    var a;
    var b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;

    return this.strip();
  };

  BN.prototype.ixor = function ixor (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  };

  // Xor `num` with `this`
  BN.prototype.xor = function xor (num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor (num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  };

  // Not ``this`` with ``width`` bitwidth
  BN.prototype.inotn = function inotn (width) {
    assert(typeof width === 'number' && width >= 0);

    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26;

    // Extend the buffer with leading zeroes
    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    }

    // Handle complete words
    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
    }

    // And remove leading zeroes
    return this.strip();
  };

  BN.prototype.notn = function notn (width) {
    return this.clone().inotn(width);
  };

  // Set `bit` of `this`
  BN.prototype.setn = function setn (bit, val) {
    assert(typeof bit === 'number' && bit >= 0);

    var off = (bit / 26) | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | (1 << wbit);
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this.strip();
  };

  // Add `num` to `this` in-place
  BN.prototype.iadd = function iadd (num) {
    var r;

    // negative + positive
    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign();

    // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    }

    // a.length > b.length
    var a, b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;
    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++;
    // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  };

  // Add `num` to `this`
  BN.prototype.add = function add (num) {
    var res;
    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);

    return num.clone().iadd(this);
  };

  // Subtract `num` from `this` in-place
  BN.prototype.isub = function isub (num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign();

    // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    }

    // At this point both numbers are positive
    var cmp = this.cmp(num);

    // Optimization - zeroify
    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    }

    // a > b
    var a, b;
    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    // Copy rest of the words
    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this.strip();
  };

  // Subtract `num` from `this`
  BN.prototype.sub = function sub (num) {
    return this.clone().isub(num);
  };

  function smallMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = (self.length + num.length) | 0;
    out.length = len;
    len = (len - 1) | 0;

    // Peel one iteration (compiler can't do it, because of code complexity)
    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;

    var lo = r & 0x3ffffff;
    var carry = (r / 0x4000000) | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = (k - j) | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += (r / 0x4000000) | 0;
        rword = r & 0x3ffffff;
      }
      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }
    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out.strip();
  }

  // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).
  var comb10MulTo = function comb10MulTo (self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;

    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */
    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = (mid + Math.imul(ah0, bl0)) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */
    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = (mid + Math.imul(ah1, bl0)) | 0;
    hi = Math.imul(ah1, bh0);
    lo = (lo + Math.imul(al0, bl1)) | 0;
    mid = (mid + Math.imul(al0, bh1)) | 0;
    mid = (mid + Math.imul(ah0, bl1)) | 0;
    hi = (hi + Math.imul(ah0, bh1)) | 0;
    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */
    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = (mid + Math.imul(ah2, bl0)) | 0;
    hi = Math.imul(ah2, bh0);
    lo = (lo + Math.imul(al1, bl1)) | 0;
    mid = (mid + Math.imul(al1, bh1)) | 0;
    mid = (mid + Math.imul(ah1, bl1)) | 0;
    hi = (hi + Math.imul(ah1, bh1)) | 0;
    lo = (lo + Math.imul(al0, bl2)) | 0;
    mid = (mid + Math.imul(al0, bh2)) | 0;
    mid = (mid + Math.imul(ah0, bl2)) | 0;
    hi = (hi + Math.imul(ah0, bh2)) | 0;
    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */
    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = (mid + Math.imul(ah3, bl0)) | 0;
    hi = Math.imul(ah3, bh0);
    lo = (lo + Math.imul(al2, bl1)) | 0;
    mid = (mid + Math.imul(al2, bh1)) | 0;
    mid = (mid + Math.imul(ah2, bl1)) | 0;
    hi = (hi + Math.imul(ah2, bh1)) | 0;
    lo = (lo + Math.imul(al1, bl2)) | 0;
    mid = (mid + Math.imul(al1, bh2)) | 0;
    mid = (mid + Math.imul(ah1, bl2)) | 0;
    hi = (hi + Math.imul(ah1, bh2)) | 0;
    lo = (lo + Math.imul(al0, bl3)) | 0;
    mid = (mid + Math.imul(al0, bh3)) | 0;
    mid = (mid + Math.imul(ah0, bl3)) | 0;
    hi = (hi + Math.imul(ah0, bh3)) | 0;
    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */
    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = (mid + Math.imul(ah4, bl0)) | 0;
    hi = Math.imul(ah4, bh0);
    lo = (lo + Math.imul(al3, bl1)) | 0;
    mid = (mid + Math.imul(al3, bh1)) | 0;
    mid = (mid + Math.imul(ah3, bl1)) | 0;
    hi = (hi + Math.imul(ah3, bh1)) | 0;
    lo = (lo + Math.imul(al2, bl2)) | 0;
    mid = (mid + Math.imul(al2, bh2)) | 0;
    mid = (mid + Math.imul(ah2, bl2)) | 0;
    hi = (hi + Math.imul(ah2, bh2)) | 0;
    lo = (lo + Math.imul(al1, bl3)) | 0;
    mid = (mid + Math.imul(al1, bh3)) | 0;
    mid = (mid + Math.imul(ah1, bl3)) | 0;
    hi = (hi + Math.imul(ah1, bh3)) | 0;
    lo = (lo + Math.imul(al0, bl4)) | 0;
    mid = (mid + Math.imul(al0, bh4)) | 0;
    mid = (mid + Math.imul(ah0, bl4)) | 0;
    hi = (hi + Math.imul(ah0, bh4)) | 0;
    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */
    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = (mid + Math.imul(ah5, bl0)) | 0;
    hi = Math.imul(ah5, bh0);
    lo = (lo + Math.imul(al4, bl1)) | 0;
    mid = (mid + Math.imul(al4, bh1)) | 0;
    mid = (mid + Math.imul(ah4, bl1)) | 0;
    hi = (hi + Math.imul(ah4, bh1)) | 0;
    lo = (lo + Math.imul(al3, bl2)) | 0;
    mid = (mid + Math.imul(al3, bh2)) | 0;
    mid = (mid + Math.imul(ah3, bl2)) | 0;
    hi = (hi + Math.imul(ah3, bh2)) | 0;
    lo = (lo + Math.imul(al2, bl3)) | 0;
    mid = (mid + Math.imul(al2, bh3)) | 0;
    mid = (mid + Math.imul(ah2, bl3)) | 0;
    hi = (hi + Math.imul(ah2, bh3)) | 0;
    lo = (lo + Math.imul(al1, bl4)) | 0;
    mid = (mid + Math.imul(al1, bh4)) | 0;
    mid = (mid + Math.imul(ah1, bl4)) | 0;
    hi = (hi + Math.imul(ah1, bh4)) | 0;
    lo = (lo + Math.imul(al0, bl5)) | 0;
    mid = (mid + Math.imul(al0, bh5)) | 0;
    mid = (mid + Math.imul(ah0, bl5)) | 0;
    hi = (hi + Math.imul(ah0, bh5)) | 0;
    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */
    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = (mid + Math.imul(ah6, bl0)) | 0;
    hi = Math.imul(ah6, bh0);
    lo = (lo + Math.imul(al5, bl1)) | 0;
    mid = (mid + Math.imul(al5, bh1)) | 0;
    mid = (mid + Math.imul(ah5, bl1)) | 0;
    hi = (hi + Math.imul(ah5, bh1)) | 0;
    lo = (lo + Math.imul(al4, bl2)) | 0;
    mid = (mid + Math.imul(al4, bh2)) | 0;
    mid = (mid + Math.imul(ah4, bl2)) | 0;
    hi = (hi + Math.imul(ah4, bh2)) | 0;
    lo = (lo + Math.imul(al3, bl3)) | 0;
    mid = (mid + Math.imul(al3, bh3)) | 0;
    mid = (mid + Math.imul(ah3, bl3)) | 0;
    hi = (hi + Math.imul(ah3, bh3)) | 0;
    lo = (lo + Math.imul(al2, bl4)) | 0;
    mid = (mid + Math.imul(al2, bh4)) | 0;
    mid = (mid + Math.imul(ah2, bl4)) | 0;
    hi = (hi + Math.imul(ah2, bh4)) | 0;
    lo = (lo + Math.imul(al1, bl5)) | 0;
    mid = (mid + Math.imul(al1, bh5)) | 0;
    mid = (mid + Math.imul(ah1, bl5)) | 0;
    hi = (hi + Math.imul(ah1, bh5)) | 0;
    lo = (lo + Math.imul(al0, bl6)) | 0;
    mid = (mid + Math.imul(al0, bh6)) | 0;
    mid = (mid + Math.imul(ah0, bl6)) | 0;
    hi = (hi + Math.imul(ah0, bh6)) | 0;
    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */
    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = (mid + Math.imul(ah7, bl0)) | 0;
    hi = Math.imul(ah7, bh0);
    lo = (lo + Math.imul(al6, bl1)) | 0;
    mid = (mid + Math.imul(al6, bh1)) | 0;
    mid = (mid + Math.imul(ah6, bl1)) | 0;
    hi = (hi + Math.imul(ah6, bh1)) | 0;
    lo = (lo + Math.imul(al5, bl2)) | 0;
    mid = (mid + Math.imul(al5, bh2)) | 0;
    mid = (mid + Math.imul(ah5, bl2)) | 0;
    hi = (hi + Math.imul(ah5, bh2)) | 0;
    lo = (lo + Math.imul(al4, bl3)) | 0;
    mid = (mid + Math.imul(al4, bh3)) | 0;
    mid = (mid + Math.imul(ah4, bl3)) | 0;
    hi = (hi + Math.imul(ah4, bh3)) | 0;
    lo = (lo + Math.imul(al3, bl4)) | 0;
    mid = (mid + Math.imul(al3, bh4)) | 0;
    mid = (mid + Math.imul(ah3, bl4)) | 0;
    hi = (hi + Math.imul(ah3, bh4)) | 0;
    lo = (lo + Math.imul(al2, bl5)) | 0;
    mid = (mid + Math.imul(al2, bh5)) | 0;
    mid = (mid + Math.imul(ah2, bl5)) | 0;
    hi = (hi + Math.imul(ah2, bh5)) | 0;
    lo = (lo + Math.imul(al1, bl6)) | 0;
    mid = (mid + Math.imul(al1, bh6)) | 0;
    mid = (mid + Math.imul(ah1, bl6)) | 0;
    hi = (hi + Math.imul(ah1, bh6)) | 0;
    lo = (lo + Math.imul(al0, bl7)) | 0;
    mid = (mid + Math.imul(al0, bh7)) | 0;
    mid = (mid + Math.imul(ah0, bl7)) | 0;
    hi = (hi + Math.imul(ah0, bh7)) | 0;
    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */
    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = (mid + Math.imul(ah8, bl0)) | 0;
    hi = Math.imul(ah8, bh0);
    lo = (lo + Math.imul(al7, bl1)) | 0;
    mid = (mid + Math.imul(al7, bh1)) | 0;
    mid = (mid + Math.imul(ah7, bl1)) | 0;
    hi = (hi + Math.imul(ah7, bh1)) | 0;
    lo = (lo + Math.imul(al6, bl2)) | 0;
    mid = (mid + Math.imul(al6, bh2)) | 0;
    mid = (mid + Math.imul(ah6, bl2)) | 0;
    hi = (hi + Math.imul(ah6, bh2)) | 0;
    lo = (lo + Math.imul(al5, bl3)) | 0;
    mid = (mid + Math.imul(al5, bh3)) | 0;
    mid = (mid + Math.imul(ah5, bl3)) | 0;
    hi = (hi + Math.imul(ah5, bh3)) | 0;
    lo = (lo + Math.imul(al4, bl4)) | 0;
    mid = (mid + Math.imul(al4, bh4)) | 0;
    mid = (mid + Math.imul(ah4, bl4)) | 0;
    hi = (hi + Math.imul(ah4, bh4)) | 0;
    lo = (lo + Math.imul(al3, bl5)) | 0;
    mid = (mid + Math.imul(al3, bh5)) | 0;
    mid = (mid + Math.imul(ah3, bl5)) | 0;
    hi = (hi + Math.imul(ah3, bh5)) | 0;
    lo = (lo + Math.imul(al2, bl6)) | 0;
    mid = (mid + Math.imul(al2, bh6)) | 0;
    mid = (mid + Math.imul(ah2, bl6)) | 0;
    hi = (hi + Math.imul(ah2, bh6)) | 0;
    lo = (lo + Math.imul(al1, bl7)) | 0;
    mid = (mid + Math.imul(al1, bh7)) | 0;
    mid = (mid + Math.imul(ah1, bl7)) | 0;
    hi = (hi + Math.imul(ah1, bh7)) | 0;
    lo = (lo + Math.imul(al0, bl8)) | 0;
    mid = (mid + Math.imul(al0, bh8)) | 0;
    mid = (mid + Math.imul(ah0, bl8)) | 0;
    hi = (hi + Math.imul(ah0, bh8)) | 0;
    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */
    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = (mid + Math.imul(ah9, bl0)) | 0;
    hi = Math.imul(ah9, bh0);
    lo = (lo + Math.imul(al8, bl1)) | 0;
    mid = (mid + Math.imul(al8, bh1)) | 0;
    mid = (mid + Math.imul(ah8, bl1)) | 0;
    hi = (hi + Math.imul(ah8, bh1)) | 0;
    lo = (lo + Math.imul(al7, bl2)) | 0;
    mid = (mid + Math.imul(al7, bh2)) | 0;
    mid = (mid + Math.imul(ah7, bl2)) | 0;
    hi = (hi + Math.imul(ah7, bh2)) | 0;
    lo = (lo + Math.imul(al6, bl3)) | 0;
    mid = (mid + Math.imul(al6, bh3)) | 0;
    mid = (mid + Math.imul(ah6, bl3)) | 0;
    hi = (hi + Math.imul(ah6, bh3)) | 0;
    lo = (lo + Math.imul(al5, bl4)) | 0;
    mid = (mid + Math.imul(al5, bh4)) | 0;
    mid = (mid + Math.imul(ah5, bl4)) | 0;
    hi = (hi + Math.imul(ah5, bh4)) | 0;
    lo = (lo + Math.imul(al4, bl5)) | 0;
    mid = (mid + Math.imul(al4, bh5)) | 0;
    mid = (mid + Math.imul(ah4, bl5)) | 0;
    hi = (hi + Math.imul(ah4, bh5)) | 0;
    lo = (lo + Math.imul(al3, bl6)) | 0;
    mid = (mid + Math.imul(al3, bh6)) | 0;
    mid = (mid + Math.imul(ah3, bl6)) | 0;
    hi = (hi + Math.imul(ah3, bh6)) | 0;
    lo = (lo + Math.imul(al2, bl7)) | 0;
    mid = (mid + Math.imul(al2, bh7)) | 0;
    mid = (mid + Math.imul(ah2, bl7)) | 0;
    hi = (hi + Math.imul(ah2, bh7)) | 0;
    lo = (lo + Math.imul(al1, bl8)) | 0;
    mid = (mid + Math.imul(al1, bh8)) | 0;
    mid = (mid + Math.imul(ah1, bl8)) | 0;
    hi = (hi + Math.imul(ah1, bh8)) | 0;
    lo = (lo + Math.imul(al0, bl9)) | 0;
    mid = (mid + Math.imul(al0, bh9)) | 0;
    mid = (mid + Math.imul(ah0, bl9)) | 0;
    hi = (hi + Math.imul(ah0, bh9)) | 0;
    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */
    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = (mid + Math.imul(ah9, bl1)) | 0;
    hi = Math.imul(ah9, bh1);
    lo = (lo + Math.imul(al8, bl2)) | 0;
    mid = (mid + Math.imul(al8, bh2)) | 0;
    mid = (mid + Math.imul(ah8, bl2)) | 0;
    hi = (hi + Math.imul(ah8, bh2)) | 0;
    lo = (lo + Math.imul(al7, bl3)) | 0;
    mid = (mid + Math.imul(al7, bh3)) | 0;
    mid = (mid + Math.imul(ah7, bl3)) | 0;
    hi = (hi + Math.imul(ah7, bh3)) | 0;
    lo = (lo + Math.imul(al6, bl4)) | 0;
    mid = (mid + Math.imul(al6, bh4)) | 0;
    mid = (mid + Math.imul(ah6, bl4)) | 0;
    hi = (hi + Math.imul(ah6, bh4)) | 0;
    lo = (lo + Math.imul(al5, bl5)) | 0;
    mid = (mid + Math.imul(al5, bh5)) | 0;
    mid = (mid + Math.imul(ah5, bl5)) | 0;
    hi = (hi + Math.imul(ah5, bh5)) | 0;
    lo = (lo + Math.imul(al4, bl6)) | 0;
    mid = (mid + Math.imul(al4, bh6)) | 0;
    mid = (mid + Math.imul(ah4, bl6)) | 0;
    hi = (hi + Math.imul(ah4, bh6)) | 0;
    lo = (lo + Math.imul(al3, bl7)) | 0;
    mid = (mid + Math.imul(al3, bh7)) | 0;
    mid = (mid + Math.imul(ah3, bl7)) | 0;
    hi = (hi + Math.imul(ah3, bh7)) | 0;
    lo = (lo + Math.imul(al2, bl8)) | 0;
    mid = (mid + Math.imul(al2, bh8)) | 0;
    mid = (mid + Math.imul(ah2, bl8)) | 0;
    hi = (hi + Math.imul(ah2, bh8)) | 0;
    lo = (lo + Math.imul(al1, bl9)) | 0;
    mid = (mid + Math.imul(al1, bh9)) | 0;
    mid = (mid + Math.imul(ah1, bl9)) | 0;
    hi = (hi + Math.imul(ah1, bh9)) | 0;
    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */
    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = (mid + Math.imul(ah9, bl2)) | 0;
    hi = Math.imul(ah9, bh2);
    lo = (lo + Math.imul(al8, bl3)) | 0;
    mid = (mid + Math.imul(al8, bh3)) | 0;
    mid = (mid + Math.imul(ah8, bl3)) | 0;
    hi = (hi + Math.imul(ah8, bh3)) | 0;
    lo = (lo + Math.imul(al7, bl4)) | 0;
    mid = (mid + Math.imul(al7, bh4)) | 0;
    mid = (mid + Math.imul(ah7, bl4)) | 0;
    hi = (hi + Math.imul(ah7, bh4)) | 0;
    lo = (lo + Math.imul(al6, bl5)) | 0;
    mid = (mid + Math.imul(al6, bh5)) | 0;
    mid = (mid + Math.imul(ah6, bl5)) | 0;
    hi = (hi + Math.imul(ah6, bh5)) | 0;
    lo = (lo + Math.imul(al5, bl6)) | 0;
    mid = (mid + Math.imul(al5, bh6)) | 0;
    mid = (mid + Math.imul(ah5, bl6)) | 0;
    hi = (hi + Math.imul(ah5, bh6)) | 0;
    lo = (lo + Math.imul(al4, bl7)) | 0;
    mid = (mid + Math.imul(al4, bh7)) | 0;
    mid = (mid + Math.imul(ah4, bl7)) | 0;
    hi = (hi + Math.imul(ah4, bh7)) | 0;
    lo = (lo + Math.imul(al3, bl8)) | 0;
    mid = (mid + Math.imul(al3, bh8)) | 0;
    mid = (mid + Math.imul(ah3, bl8)) | 0;
    hi = (hi + Math.imul(ah3, bh8)) | 0;
    lo = (lo + Math.imul(al2, bl9)) | 0;
    mid = (mid + Math.imul(al2, bh9)) | 0;
    mid = (mid + Math.imul(ah2, bl9)) | 0;
    hi = (hi + Math.imul(ah2, bh9)) | 0;
    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */
    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = (mid + Math.imul(ah9, bl3)) | 0;
    hi = Math.imul(ah9, bh3);
    lo = (lo + Math.imul(al8, bl4)) | 0;
    mid = (mid + Math.imul(al8, bh4)) | 0;
    mid = (mid + Math.imul(ah8, bl4)) | 0;
    hi = (hi + Math.imul(ah8, bh4)) | 0;
    lo = (lo + Math.imul(al7, bl5)) | 0;
    mid = (mid + Math.imul(al7, bh5)) | 0;
    mid = (mid + Math.imul(ah7, bl5)) | 0;
    hi = (hi + Math.imul(ah7, bh5)) | 0;
    lo = (lo + Math.imul(al6, bl6)) | 0;
    mid = (mid + Math.imul(al6, bh6)) | 0;
    mid = (mid + Math.imul(ah6, bl6)) | 0;
    hi = (hi + Math.imul(ah6, bh6)) | 0;
    lo = (lo + Math.imul(al5, bl7)) | 0;
    mid = (mid + Math.imul(al5, bh7)) | 0;
    mid = (mid + Math.imul(ah5, bl7)) | 0;
    hi = (hi + Math.imul(ah5, bh7)) | 0;
    lo = (lo + Math.imul(al4, bl8)) | 0;
    mid = (mid + Math.imul(al4, bh8)) | 0;
    mid = (mid + Math.imul(ah4, bl8)) | 0;
    hi = (hi + Math.imul(ah4, bh8)) | 0;
    lo = (lo + Math.imul(al3, bl9)) | 0;
    mid = (mid + Math.imul(al3, bh9)) | 0;
    mid = (mid + Math.imul(ah3, bl9)) | 0;
    hi = (hi + Math.imul(ah3, bh9)) | 0;
    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */
    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = (mid + Math.imul(ah9, bl4)) | 0;
    hi = Math.imul(ah9, bh4);
    lo = (lo + Math.imul(al8, bl5)) | 0;
    mid = (mid + Math.imul(al8, bh5)) | 0;
    mid = (mid + Math.imul(ah8, bl5)) | 0;
    hi = (hi + Math.imul(ah8, bh5)) | 0;
    lo = (lo + Math.imul(al7, bl6)) | 0;
    mid = (mid + Math.imul(al7, bh6)) | 0;
    mid = (mid + Math.imul(ah7, bl6)) | 0;
    hi = (hi + Math.imul(ah7, bh6)) | 0;
    lo = (lo + Math.imul(al6, bl7)) | 0;
    mid = (mid + Math.imul(al6, bh7)) | 0;
    mid = (mid + Math.imul(ah6, bl7)) | 0;
    hi = (hi + Math.imul(ah6, bh7)) | 0;
    lo = (lo + Math.imul(al5, bl8)) | 0;
    mid = (mid + Math.imul(al5, bh8)) | 0;
    mid = (mid + Math.imul(ah5, bl8)) | 0;
    hi = (hi + Math.imul(ah5, bh8)) | 0;
    lo = (lo + Math.imul(al4, bl9)) | 0;
    mid = (mid + Math.imul(al4, bh9)) | 0;
    mid = (mid + Math.imul(ah4, bl9)) | 0;
    hi = (hi + Math.imul(ah4, bh9)) | 0;
    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */
    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = (mid + Math.imul(ah9, bl5)) | 0;
    hi = Math.imul(ah9, bh5);
    lo = (lo + Math.imul(al8, bl6)) | 0;
    mid = (mid + Math.imul(al8, bh6)) | 0;
    mid = (mid + Math.imul(ah8, bl6)) | 0;
    hi = (hi + Math.imul(ah8, bh6)) | 0;
    lo = (lo + Math.imul(al7, bl7)) | 0;
    mid = (mid + Math.imul(al7, bh7)) | 0;
    mid = (mid + Math.imul(ah7, bl7)) | 0;
    hi = (hi + Math.imul(ah7, bh7)) | 0;
    lo = (lo + Math.imul(al6, bl8)) | 0;
    mid = (mid + Math.imul(al6, bh8)) | 0;
    mid = (mid + Math.imul(ah6, bl8)) | 0;
    hi = (hi + Math.imul(ah6, bh8)) | 0;
    lo = (lo + Math.imul(al5, bl9)) | 0;
    mid = (mid + Math.imul(al5, bh9)) | 0;
    mid = (mid + Math.imul(ah5, bl9)) | 0;
    hi = (hi + Math.imul(ah5, bh9)) | 0;
    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */
    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = (mid + Math.imul(ah9, bl6)) | 0;
    hi = Math.imul(ah9, bh6);
    lo = (lo + Math.imul(al8, bl7)) | 0;
    mid = (mid + Math.imul(al8, bh7)) | 0;
    mid = (mid + Math.imul(ah8, bl7)) | 0;
    hi = (hi + Math.imul(ah8, bh7)) | 0;
    lo = (lo + Math.imul(al7, bl8)) | 0;
    mid = (mid + Math.imul(al7, bh8)) | 0;
    mid = (mid + Math.imul(ah7, bl8)) | 0;
    hi = (hi + Math.imul(ah7, bh8)) | 0;
    lo = (lo + Math.imul(al6, bl9)) | 0;
    mid = (mid + Math.imul(al6, bh9)) | 0;
    mid = (mid + Math.imul(ah6, bl9)) | 0;
    hi = (hi + Math.imul(ah6, bh9)) | 0;
    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */
    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = (mid + Math.imul(ah9, bl7)) | 0;
    hi = Math.imul(ah9, bh7);
    lo = (lo + Math.imul(al8, bl8)) | 0;
    mid = (mid + Math.imul(al8, bh8)) | 0;
    mid = (mid + Math.imul(ah8, bl8)) | 0;
    hi = (hi + Math.imul(ah8, bh8)) | 0;
    lo = (lo + Math.imul(al7, bl9)) | 0;
    mid = (mid + Math.imul(al7, bh9)) | 0;
    mid = (mid + Math.imul(ah7, bl9)) | 0;
    hi = (hi + Math.imul(ah7, bh9)) | 0;
    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */
    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = (mid + Math.imul(ah9, bl8)) | 0;
    hi = Math.imul(ah9, bh8);
    lo = (lo + Math.imul(al8, bl9)) | 0;
    mid = (mid + Math.imul(al8, bh9)) | 0;
    mid = (mid + Math.imul(ah8, bl9)) | 0;
    hi = (hi + Math.imul(ah8, bh9)) | 0;
    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */
    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = (mid + Math.imul(ah9, bl9)) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;
    if (c !== 0) {
      o[19] = c;
      out.length++;
    }
    return out;
  };

  // Polyfill comb
  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;

    var carry = 0;
    var hncarry = 0;
    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
        lo = (lo + rword) | 0;
        rword = lo & 0x3ffffff;
        ncarry = (ncarry + (lo >>> 26)) | 0;

        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }
      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }
    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out.strip();
  }

  function jumboMulTo (self, num, out) {
    var fftm = new FFTM();
    return fftm.mulp(self, num, out);
  }

  BN.prototype.mulTo = function mulTo (num, out) {
    var res;
    var len = this.length + num.length;
    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  };

  // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion

  function FFTM (x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT (N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;
    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  };

  // Returns binary-reversed representation of `x`
  FFTM.prototype.revBin = function revBin (x, l, N) {
    if (x === 0 || x === N - 1) return x;

    var rb = 0;
    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << (l - i - 1);
      x >>= 1;
    }

    return rb;
  };

  // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm
  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;

      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];

          var ro = rtws[p + j + s];
          var io = itws[p + j + s];

          var rx = rtwdf_ * ro - itwdf_ * io;

          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;

          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;

          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;

          /* jshint maxdepth : false */
          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;
    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];

      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;

      t = iws[i];

      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
    var carry = 0;
    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
        Math.round(ws[2 * i] / N) +
        carry;

      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
    var carry = 0;
    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);

      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
    }

    // Pad with zeroes
    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub (N) {
    var ph = new Array(N);
    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp (x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);

    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);

    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);

    var rmws = out.words;
    rmws.length = N;

    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);

    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);

    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out.strip();
  };

  // Multiply `this` by `num`
  BN.prototype.mul = function mul (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  };

  // Multiply employing FFT
  BN.prototype.mulf = function mulf (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  };

  // In-place Multiplication
  BN.prototype.imul = function imul (num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);

    // Carry
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += (w / 0x4000000) | 0;
      // NOTE: lo is 27bit maximum
      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return this;
  };

  BN.prototype.muln = function muln (num) {
    return this.clone().imuln(num);
  };

  // `this` * `this`
  BN.prototype.sqr = function sqr () {
    return this.mul(this);
  };

  // `this` * `this` in-place
  BN.prototype.isqr = function isqr () {
    return this.imul(this.clone());
  };

  // Math.pow(`this`, `num`)
  BN.prototype.pow = function pow (num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1);

    // Skip leading zeroes
    var res = this;
    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;

        res = res.mul(q);
      }
    }

    return res;
  };

  // Shift-left in-place
  BN.prototype.iushln = function iushln (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = ((this.words[i] | 0) - newCarry) << r;
        this.words[i] = c | carry;
        carry = newCarry >>> (26 - r);
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this.strip();
  };

  BN.prototype.ishln = function ishln (bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  };

  // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits
  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;
    if (hint) {
      h = (hint - (hint % 26)) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    var maskedWords = extended;

    h -= s;
    h = Math.max(0, h);

    // Extended mode, copy masked part
    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }
      maskedWords.length = s;
    }

    if (s === 0) {
      // No-op, we should not move anything at all
    } else if (this.length > s) {
      this.length -= s;
      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;
    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = (carry << (26 - r)) | (word >>> r);
      carry = word & mask;
    }

    // Push carried bits as a mask
    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this.strip();
  };

  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  };

  // Shift-left
  BN.prototype.shln = function shln (bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln (bits) {
    return this.clone().iushln(bits);
  };

  // Shift-right
  BN.prototype.shrn = function shrn (bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn (bits) {
    return this.clone().iushrn(bits);
  };

  // Test if n bit is set
  BN.prototype.testn = function testn (bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) return false;

    // Check bit and return
    var w = this.words[s];

    return !!(w & q);
  };

  // Return only lowers bits of number (in-place)
  BN.prototype.imaskn = function imaskn (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;

    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }
    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      this.words[this.length - 1] &= mask;
    }

    return this.strip();
  };

  // Return only lowers bits of number
  BN.prototype.maskn = function maskn (bits) {
    return this.clone().imaskn(bits);
  };

  // Add plain number `num` to `this`
  BN.prototype.iaddn = function iaddn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num);

    // Possible sign change
    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) < num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    }

    // Add without checks
    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn (num) {
    this.words[0] += num;

    // Carry
    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;
      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }
    this.length = Math.max(this.length, i + 1);

    return this;
  };

  // Subtract plain number `num` from `this`
  BN.prototype.isubn = function isubn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this.strip();
  };

  BN.prototype.addn = function addn (num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn (num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs () {
    this.negative = 0;

    return this;
  };

  BN.prototype.abs = function abs () {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;
    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - ((right / 0x4000000) | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }
    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this.strip();

    // Subtraction overflow
    assert(carry === -1);
    carry = 0;
    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }
    this.negative = 1;

    return this.strip();
  };

  BN.prototype._wordDiv = function _wordDiv (num, mode) {
    var shift = this.length - num.length;

    var a = this.clone();
    var b = num;

    // Normalize
    var bhi = b.words[b.length - 1] | 0;
    var bhiBits = this._countBits(bhi);
    shift = 26 - bhiBits;
    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    }

    // Initialize quotient
    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);
      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);
    if (diff.negative === 0) {
      a = diff;
      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
        (a.words[b.length + j - 1] | 0);

      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)
      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);
      while (a.negative !== 0) {
        qj--;
        a.negative = 0;
        a._ishlnsubmul(b, 1, j);
        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }
      if (q) {
        q.words[j] = qj;
      }
    }
    if (q) {
      q.strip();
    }
    a.strip();

    // Denormalize
    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  };

  // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested
  BN.prototype.divmod = function divmod (num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;
    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    }

    // Both numbers are positive at this point

    // Strip both numbers to approximate shift value
    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    }

    // Very short reduction
    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  };

  // Find `this` / `num`
  BN.prototype.div = function div (num) {
    return this.divmod(num, 'div', false).div;
  };

  // Find `this` % `num`
  BN.prototype.mod = function mod (num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod (num) {
    return this.divmod(num, 'mod', true).mod;
  };

  // Find Round(`this` / `num`)
  BN.prototype.divRound = function divRound (num) {
    var dm = this.divmod(num);

    // Fast case - exact division
    if (dm.mod.isZero()) return dm.div;

    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half);

    // Round down
    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

    // Round up
    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modn = function modn (num) {
    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;

    var acc = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return acc;
  };

  // In-place division by number
  BN.prototype.idivn = function idivn (num) {
    assert(num <= 0x3ffffff);

    var carry = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = (w / num) | 0;
      carry = w % num;
    }

    return this.strip();
  };

  BN.prototype.divn = function divn (num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    }

    // A * x + B * y = x
    var A = new BN(1);
    var B = new BN(0);

    // C * x + D * y = y
    var C = new BN(0);
    var D = new BN(1);

    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        x.iushrn(i);
        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        y.iushrn(j);
        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  };

  // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed
  BN.prototype._invmp = function _invmp (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);

    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        a.iushrn(i);
        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        b.iushrn(j);
        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;
    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd (num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();

    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0;

    // Remove common factor of two
    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }
      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);
      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  };

  // Invert number in the field F(num)
  BN.prototype.invm = function invm (num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven () {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd () {
    return (this.words[0] & 1) === 1;
  };

  // And first word and num
  BN.prototype.andln = function andln (num) {
    return this.words[0] & num;
  };

  // Increment at the bit position in-line
  BN.prototype.bincn = function bincn (bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) {
      this._expand(s + 1);
      this.words[s] |= q;
      return this;
    }

    // Add bit and propagate, if needed
    var carry = q;
    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }
    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }
    return this;
  };

  BN.prototype.isZero = function isZero () {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn (num) {
    var negative = num < 0;

    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;

    this.strip();

    var res;
    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');

      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`
  BN.prototype.cmp = function cmp (num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;

    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Unsigned comparison
  BN.prototype.ucmp = function ucmp (num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;

    var res = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;

      if (a === b) continue;
      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }
      break;
    }
    return res;
  };

  BN.prototype.gtn = function gtn (num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt (num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten (num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte (num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn (num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt (num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten (num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte (num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn (num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq (num) {
    return this.cmp(num) === 0;
  };

  //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //
  BN.red = function red (num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed () {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed (ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd (num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd (num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub (num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub (num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl (num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr () {
    assert(this.red, 'redSqr works only with red numbers');
    this.red._verify1(this);
    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr () {
    assert(this.red, 'redISqr works only with red numbers');
    this.red._verify1(this);
    return this.red.isqr(this);
  };

  // Square root over p
  BN.prototype.redSqrt = function redSqrt () {
    assert(this.red, 'redSqrt works only with red numbers');
    this.red._verify1(this);
    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm () {
    assert(this.red, 'redInvm works only with red numbers');
    this.red._verify1(this);
    return this.red.invm(this);
  };

  // Return negative clone of `this` % `red modulo`
  BN.prototype.redNeg = function redNeg () {
    assert(this.red, 'redNeg works only with red numbers');
    this.red._verify1(this);
    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow (num) {
    assert(this.red && !num.red, 'redPow(normalNum)');
    this.red._verify1(this);
    return this.red.pow(this, num);
  };

  // Prime numbers with efficient reduction
  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  };

  // Pseudo-Mersenne prime
  function MPrime (name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);

    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp () {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce (num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      r.strip();
    }

    return r;
  };

  MPrime.prototype.split = function split (input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK (num) {
    return num.imul(this.k);
  };

  function K256 () {
    MPrime.call(
      this,
      'k256',
      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }
  inherits(K256, MPrime);

  K256.prototype.split = function split (input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;

    var outLen = Math.min(input.length, 9);
    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }
    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    }

    // Shift by 9 limbs
    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
      prev = next;
    }
    prev >>>= 22;
    input.words[i - 10] = prev;
    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK (num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2;

    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
    var lo = 0;
    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + ((lo / 0x4000000) | 0);
    }

    // Fast length reduction
    if (num.words[num.length - 1] === 0) {
      num.length--;
      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }
    return num;
  };

  function P224 () {
    MPrime.call(
      this,
      'p224',
      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }
  inherits(P224, MPrime);

  function P192 () {
    MPrime.call(
      this,
      'p192',
      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }
  inherits(P192, MPrime);

  function P25519 () {
    // 2 ^ 255 - 19
    MPrime.call(
      this,
      '25519',
      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }
  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK (num) {
    // K = 0x13
    var carry = 0;
    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;

      num.words[i] = lo;
      carry = hi;
    }
    if (carry !== 0) {
      num.words[num.length++] = carry;
    }
    return num;
  };

  // Exported mostly for testing purposes, use plain name instead
  BN._prime = function prime (name) {
    // Cached version of prime
    if (primes[name]) return primes[name];

    var prime;
    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }
    primes[name] = prime;

    return prime;
  };

  //
  // Base reduction engine
  //
  function Red (m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);
      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1 (a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2 (a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red,
      'red works only with red numbers');
  };

  Red.prototype.imod = function imod (a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);
    return a.umod(this.m)._forceRed(this);
  };

  Red.prototype.neg = function neg (a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add (a, b) {
    this._verify2(a, b);

    var res = a.add(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd (a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res;
  };

  Red.prototype.sub = function sub (a, b) {
    this._verify2(a, b);

    var res = a.sub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.isub = function isub (a, b) {
    this._verify2(a, b);

    var res = a.isub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res;
  };

  Red.prototype.shl = function shl (a, num) {
    this._verify1(a);
    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul (a, b) {
    this._verify2(a, b);
    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul (a, b) {
    this._verify2(a, b);
    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr (a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr (a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt (a) {
    if (a.isZero()) return a.clone();

    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1);

    // Fast case
    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    }

    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)
    var q = this.m.subn(1);
    var s = 0;
    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }
    assert(!q.isZero());

    var one = new BN(1).toRed(this);
    var nOne = one.redNeg();

    // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.
    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;
    while (t.cmp(one) !== 0) {
      var tmp = t;
      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }
      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));

      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm (a) {
    var inv = a._invmp(this.m);
    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow (a, num) {
    if (num.isZero()) return new BN(1).toRed(this);
    if (num.cmpn(1) === 0) return a.clone();

    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;
    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;
    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];
      for (var j = start - 1; j >= 0; j--) {
        var bit = (word >> j) & 1;
        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }
      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo (num) {
    var r = num.umod(this.m);

    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom (num) {
    var res = num.clone();
    res.red = null;
    return res;
  };

  //
  // Montgomery method engine
  //

  BN.mont = function mont (num) {
    return new Mont(num);
  };

  function Mont (m) {
    Red.call(this, m);

    this.shift = this.m.bitLength();
    if (this.shift % 26 !== 0) {
      this.shift += 26 - (this.shift % 26);
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);

    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }
  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo (num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom (num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul (a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul (a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;
    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm (a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})(typeof module === 'undefined' || module, this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(201)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/21/2017.
 */


var app_obj = {
        dom_el: document.getElementById('linguagoApplication')
    },
    game_obj = {
        dom_el: document.getElementById('game_js')
    },
    stage_obj = {
        gridSize: 10,
        position: {
            x: 0,
            y: 0,
            width: 330,
            height: 200
        },
        get linesNum() {
            return Math.ceil(stage_obj.position.height / stage_obj.gridSize);
        },
        get columnsNum() {
            return Math.ceil(stage_obj.position.width / stage_obj.gridSize);
        },
        dom_el: document.getElementById('app_js')
    };
var configs_obj = {
    app: app_obj,
    game:game_obj,
    interface: {
        dom_el: app_obj.dom_el.querySelector('.interface')
    },
    stage: stage_obj,
    playerAvatar: {
        targetPosition: {
            x: undefined,
            y: undefined
        },
        moveFrequency:10,
        position: {
            x: 0,
            y: 0,
            width: 10,
            height: 10
        },
        speed: 2,
        dom_el: undefined
    },
    obstacle: {
        language: undefined,
        brick_array: [],
        blocked: false,
        open:false,
        direction: undefined,
        position: {
            x: undefined,
            y: undefined,
            width: undefined,
            height: undefined
        },
        dom_el: undefined
    },
    goodie: {
        position: {
            x: undefined,
            y: undefined,
            width: 10,
            height: 10
        }
    },
    badGuy: {
        targetPosition: {
            x: 0,
            y: 0
        },
        moveFrequency:20,
        speed: 1,
        position: {
            x: 0,
            y: 0,
            width: 10,
            height: 10
        },
        dom_el: undefined
    }
};


module.exports = function (id_str, clone_bool) {
    var result_obj = configs_obj[id_str];
    if (result_obj) {
        result_obj.type = id_str;
        if (!clone_bool) {
            return result_obj;
        } else {
            return JSON.parse(JSON.stringify(result_obj));
        }
    } else {
        throw (new Error("No config found for id : " + id_str));
    }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elliptic = exports;

elliptic.version = __webpack_require__(162).version;
elliptic.utils = __webpack_require__(161);
elliptic.rand = __webpack_require__(61);
elliptic.curve = __webpack_require__(29);
elliptic.curves = __webpack_require__(153);

// Protocols
elliptic.ec = __webpack_require__(154);
elliptic.eddsa = __webpack_require__(157);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = assert;

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

assert.equal = function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/22/2017.
 * @module
 * @description A bunch of utility functions to handle SVG's.
 *
 */

/**
 * An object describing a point on x and y axis.
 * @typeDef {Object} Point
 * @property {number} x The position on the x-axis
 * @property {number} y The position on the y-axis
 */

/**
 * A Dom Element object
 */



var

    deltaTransformPoint = function (matrix, point) {

        var dx = point.x * matrix.a + point.y * matrix.c + 0;
        var dy = point.x * matrix.b + point.y * matrix.d + 0;
        return {x: dx, y: dy};
    },
    decomposeMatrix = function (matrix) {

        // @see https://gist.github.com/2052247

        // calculate delta transform point
        var px = deltaTransformPoint(matrix, {x: 0, y: 1});
        var py = deltaTransformPoint(matrix, {x: 1, y: 0});

        // calculate skew
        var skewX = ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
        var skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));

        return {

            translateX: matrix.e,
            translateY: matrix.f,
            scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
            scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
            skewX: skewX,
            skewY: skewY,
            rotation: skewX // rotation is the same as skew x
        }
    },
    polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    },
    applyAttributes = function (el, params_obj, namespaceParams_array) {
        if (params_obj) {
            for (var n in params_obj) {
                if (params_obj.hasOwnProperty(n)) {
                    el.setAttribute(n, params_obj[n]);
                }
            }
        }
        if (namespaceParams_array) {
            namespaceParams_array.forEach(function (attr) {
                el.setAttributeNS(attr.nameSpace, attr.name, attr.value);
            });
        }
    },
    createElement = function (svgTagName_str, params_obj, namespaceParams_array) {
        var el = document.createElementNS("http://www.w3.org/2000/svg", svgTagName_str);
        applyAttributes(el, params_obj, namespaceParams_array);
        return el;
    },
    getSliceAttribute = function (centerX, centerY, radius, holeRadius, p_startAngle, p_endAngle) {
        var startAngle = p_startAngle,
            endAngle = p_endAngle,
            externalCurve_obj = getArc(centerX, centerY, radius, startAngle, endAngle),
            internalCurve_obj = getArc(centerX, centerY, holeRadius, endAngle, startAngle, true),
            intToExtPath_str = " L" + externalCurve_obj.startPoint + " ",
            extToIntPath_str = "L" + internalCurve_obj.startPoint + " ";
        return internalCurve_obj.path + intToExtPath_str + externalCurve_obj.path + extToIntPath_str;

    },
    getArc = function (x, y, radius, startAngle, endAngle, inverseArc_bool) {
        var start = polarToCartesian(x, y, radius, endAngle),
            end = polarToCartesian(x, y, radius, startAngle),
            arcSweep = (endAngle - startAngle > 180) ? 1 : 0,
            //Number(Boolean(Math.abs(endAngle - startAngle) <= 180)),
            inverseArc = isNaN(inverseArc_bool) ? 0 : Number(inverseArc_bool),
            d_string = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, inverseArc, end.x, end.y].join(" ");
        return {
            path: d_string,
            endPoint: end.x + " " + end.y,
            startPoint: start.x + " " + start.y
        };
    },
    PointConversion = {
        SVGToPoint: function (SVGPoint) {
            return {x: SVGPoint.x, y: SVGPoint.y};
        },
        pointToSVG: function (svg_el, point) {
            var svg_point = svg_el.createSVGPoint();
            svg_point.x = point.x;
            svg_point.y = point.y;
            return svg_point;
        }
    };
module.exports = {
    /**
     * Computes the path of a pie slice.
     * @method
     * @todo centerX and centerY should be structured as a Point-object.
     * @param {number} centerX - The x coordinate of the center of the pie
     * @param {number} centerY - The y coordinate of the center of the pie
     * @param {number} radius - The radius of the slice
     * @param {number}  holeRadius - The radius of the hole (if slice is a doughnut)
     * @param {number}  p_startAngle - The start of the slice in degree.
     * @param {number}  p_endAngle - The end of the slice in degree.
     * @return {string} - the string to use as the "d"-attribute of an SVG path-element
     */
    getSliceAttribute: getSliceAttribute,

    /**
     * Returns an SVG-path element of a pie-slice
     * @todo centerX and centerY should be structured as a Point-object.
     * @param {number} centerX - The x coordinate of the center of the pie
     * @param {number} centerY - The y coordinate of the center of the pie
     * @param {number} radius - The radius of the slice
     * @param {number}  holeRadius - The radius of the hole (if slice is a doughnut)
     * @param {number}  p_startAngle - The start of the slice in degree.
     * @param {number}  p_endAngle - The end of the slice in degree.
     * @return {DOMElement} - An SVG path-element.
     */

    getSlice: function (centerX, centerY, radius, holeRadius, p_startAngle, p_endAngle) {
        var path = createElement("path");
        path.setAttribute("d", getSliceAttribute(centerX, centerY, radius, holeRadius, p_startAngle, p_endAngle));
        return path;
    },
    /**
     * Draws a multiline text block based on a given width.
     * @todo params.x and params.y should be structured as a point-object
     * @todo params.color should be params.fill
     * @todo params that implement svg properties should be structured in a separate "format"-object.
     *
     * @param {DOMElement} parentSvg_el -The SVG-element where to draw the text.
     * @param {string} text_str  - The text
     * @param {Object} params  - Parameters of the text
     * @param {string=} params.forceLineBreakChar - If set, forces linebreak after the given string.
     * @param {number} params.width -Sets the width of the textblok.
     * @params {number} params.lineHeight - Sets the line height of the block
     * @param {string} params.color - The color of the text
     * @param {number} params.x - The x-position
     * @param {number} params.y - The y-position
     * @param {number} params.font-size - Implements the corresponding SVG-property
     * @param {string} params.text-anchor - Implements the corresponding SVG-property
     * @param {string=} params.stroke - Implements the corresponding SVG-property
     * @param {string=} params.stroke-width - Implements the corresponding SVG-property
     * @param {string=} params.font-weight - Implements the corresponding SVG-property
     *
     * @return {DOMElement} The SVG g-container of the textblock.
     *
     */
    getMultilineText: function (parentSvg_el, text_str, params) {
        var
            forceLineBreakChar = params.forceLineBreakChar,
            forceLineBreakBool,
            container_g = createElement('svg', {
                x: params.x,
                y: params.y
            }),

            line_num = 0,
            text_array = text_str.split(' '),
            createTextBlock = function () {
                var line_span = createElement('text', {
                    x: (params['text-anchor'] === 'middle') ? params.width / 2 : 0,
                    'width': params.width,
                    'text-anchor': params['text-anchor'],
                    'font-size': params['font-size'],
                    'fill': params.color,
                    'stroke': params.stroke || null,
                    'font-weight': params['font-weight'] || null,
                    'stroke-width': params['stroke-width'] || null,
                    'dy': (params.lineHeight * line_num) + params.lineHeight
                });

                container_g.appendChild(line_span);
                line_num++;
                return line_span;
            },
            previousLineContent_str = '',
            lineContent_str = '',
            block_el = createTextBlock();
        parentSvg_el.appendChild(container_g);

        text_array.forEach(function (word) {
            lineContent_str += word + ' ';
            block_el.textContent = lineContent_str;
            if (block_el.getComputedTextLength() > params.width || forceLineBreakBool) {
                block_el.textContent = previousLineContent_str;
                block_el = createTextBlock();
                lineContent_str = word + ' ';
                block_el.textContent = lineContent_str;
            }
            forceLineBreakBool = word.indexOf(forceLineBreakChar) !== -1;
            previousLineContent_str = lineContent_str;
        });
        return container_g;
    },
    /**
     * Allows a focused SVG-Element to be actionned by enter-key.
     * @param {DOMElement} svg_el -The svg-element
     * @param {function} fun -The function called when the key is clicked.
     *
     * @return {function} A cleanup function allowing to disable the enter-key. When called, this function removes all listeners.
     */

    simulateEnterClick: function (svg_el, fun) {
        var
            removeEnterClick = function () {
                svg_el.removeEventListener('focus', listenEnter);
                svg_el.removeEventListener('blur', stopListen);
            },
            handleKey = function (evt) {
                if (evt.key === "Enter") {
                    removeEnterClickremoveEnterClick();
                    fun();
                }
            },
            listenEnter = function () {
                svg_el.addEventListener('keydown', handleKey);
            },
            stopListen = function () {
                svg_el.addEventListener('keydown', handleKey);
            };
        svg_el.addEventListener('focus', listenEnter);
        svg_el.addEventListener('blur', stopListen);
        return removeEnterClick;

    },
    /**
     * Converts HTML-page coordinates to SVG coordinates.
     * @param {Point} point - The coordinates in the html-page.
     * @param {DOMElement} dom_svg - The svg container
     * @returns {Point} The corresponding coordinates in the SVG-container
     */
    convertCoordinateFromDOMToSVG: function (dom_svg, point) {
        var
            CTM = dom_svg.getScreenCTM(),
            svg_point = PointConversion.pointToSVG(dom_svg, point),
            converted_point = svg_point.matrixTransform(CTM.inverse());
        return PointConversion.SVGToPoint(converted_point);
    },
    /**
     * Converts SVG coordinates in HTML page coordinates.
     * @param {Point} svgCoordinate_point - The coordinates in the SVG-container
     * @param {DOMElement} dom_svg - The svg-container
     * @returns {Point} The corresponding coordinates in the HTML-page
     */
    convertCoordinateFromSVGToDOM: function (dom_svg, svgCoordinate_point) {
        var
            CTM = dom_svg.getScreenCTM(),
            svg_point = PointConversion.pointToSVG(dom_svg, svgCoordinate_point),
            converted_point = svg_point.matrixTransform(CTM),
            matrixRead = decomposeMatrix(CTM),
            point = {
                x: matrixRead.translateX + (svgCoordinate_point.x * matrixRead.scaleX),
                y: matrixRead.translateY + (svgCoordinate_point.y * matrixRead.scaleY)
            };
        return point;
    },
    applyAttributes: applyAttributes,
    createElement: createElement
};





/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(6);
var inherits = __webpack_require__(0);

exports.inherits = inherits;

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === 'string') {
    if (!enc) {
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        var hi = c >> 8;
        var lo = c & 0xff;
        if (hi)
          res.push(hi, lo);
        else
          res.push(lo);
      }
    } else if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else {
    for (i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
  }
  return res;
}
exports.toArray = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
exports.toHex = toHex;

function htonl(w) {
  var res = (w >>> 24) |
            ((w >>> 8) & 0xff00) |
            ((w << 8) & 0xff0000) |
            ((w & 0xff) << 24);
  return res >>> 0;
}
exports.htonl = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little')
      w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
exports.toHex32 = toHex32;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
exports.zero2 = zero2;

function zero8(word) {
  if (word.length === 7)
    return '0' + word;
  else if (word.length === 6)
    return '00' + word;
  else if (word.length === 5)
    return '000' + word;
  else if (word.length === 4)
    return '0000' + word;
  else if (word.length === 3)
    return '00000' + word;
  else if (word.length === 2)
    return '000000' + word;
  else if (word.length === 1)
    return '0000000' + word;
  else
    return word;
}
exports.zero8 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  assert(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w;
    if (endian === 'big')
      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
    else
      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
exports.join32 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
exports.split32 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
exports.rotr32 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
exports.rotl32 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
exports.sum32 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
exports.sum32_3 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
exports.sum32_4 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
exports.sum32_5 = sum32_5;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos];
  var bl = buf[pos + 1];

  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
exports.sum64 = sum64;

function sum64_hi(ah, al, bh, bl) {
  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  return hi >>> 0;
}
exports.sum64_hi = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  var lo = al + bl;
  return lo >>> 0;
}
exports.sum64_lo = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;

  var hi = ah + bh + ch + dh + carry;
  return hi >>> 0;
}
exports.sum64_4_hi = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
}
exports.sum64_4_lo = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = (lo + el) >>> 0;
  carry += lo < el ? 1 : 0;

  var hi = ah + bh + ch + dh + eh + carry;
  return hi >>> 0;
}
exports.sum64_5_hi = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var lo = al + bl + cl + dl + el;

  return lo >>> 0;
}
exports.sum64_5_lo = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  var r = (al << (32 - num)) | (ah >>> num);
  return r >>> 0;
}
exports.rotr64_hi = rotr64_hi;

function rotr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.rotr64_lo = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
}
exports.shr64_hi = shr64_hi;

function shr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.shr64_lo = shr64_lo;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(2).Buffer
var Transform = __webpack_require__(33).Transform
var StringDecoder = __webpack_require__(45).StringDecoder
var inherits = __webpack_require__(0)

function CipherBase (hashMode) {
  Transform.call(this)
  this.hashMode = typeof hashMode === 'string'
  if (this.hashMode) {
    this[hashMode] = this._finalOrDigest
  } else {
    this.final = this._finalOrDigest
  }
  if (this._final) {
    this.__final = this._final
    this._final = null
  }
  this._decoder = null
  this._encoding = null
}
inherits(CipherBase, Transform)

CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
  if (typeof data === 'string') {
    data = Buffer.from(data, inputEnc)
  }

  var outData = this._update(data)
  if (this.hashMode) return this

  if (outputEnc) {
    outData = this._toString(outData, outputEnc)
  }

  return outData
}

CipherBase.prototype.setAutoPadding = function () {}
CipherBase.prototype.getAuthTag = function () {
  throw new Error('trying to get auth tag in unsupported state')
}

CipherBase.prototype.setAuthTag = function () {
  throw new Error('trying to set auth tag in unsupported state')
}

CipherBase.prototype.setAAD = function () {
  throw new Error('trying to set aad in unsupported state')
}

CipherBase.prototype._transform = function (data, _, next) {
  var err
  try {
    if (this.hashMode) {
      this._update(data)
    } else {
      this.push(this._update(data))
    }
  } catch (e) {
    err = e
  } finally {
    next(err)
  }
}
CipherBase.prototype._flush = function (done) {
  var err
  try {
    this.push(this.__final())
  } catch (e) {
    err = e
  }

  done(err)
}
CipherBase.prototype._finalOrDigest = function (outputEnc) {
  var outData = this.__final() || Buffer.alloc(0)
  if (outputEnc) {
    outData = this._toString(outData, outputEnc, true)
  }
  return outData
}

CipherBase.prototype._toString = function (value, enc, fin) {
  if (!this._decoder) {
    this._decoder = new StringDecoder(enc)
    this._encoding = enc
  }

  if (this._encoding !== enc) throw new Error('can\'t switch encodings')

  var out = this._decoder.write(value)
  if (fin) {
    out += this._decoder.end()
  }

  return out
}

module.exports = CipherBase


/***/ }),
/* 10 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var processNextTick = __webpack_require__(32);
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = __webpack_require__(22);
util.inherits = __webpack_require__(0);
/*</replacement>*/

var Readable = __webpack_require__(84);
var Writable = __webpack_require__(46);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  processNextTick(cb, err);
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 13/04/2017.
 * @module
 * @description Manages the loading and distribution of the labels used in the application.
 *
 *
 */
var labels_json,
    languages_json;

function loadJSON(url_str, callback_fun) {
    var xobj = new XMLHttpRequest();
    xobj.open('GET', url_str, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && Number (xobj.status) === 200) {
            callback_fun(xobj.responseText);
        }
    };
    xobj.send(null);
}

module.exports = {
    /**
     * @description Loads the labels in a given language.
     * @param {string} lg_str -  The language code od the labels to get.
     * @param {function} callback_fun - callback_fun - The callback called with the data as argument.
     */
    fetchLabels: function (lg_str, callback_fun) {
        loadJSON('dist_linguago/labels/labels_linguago/labels_linguago_' + lg_str + '.json',
            function (labels_data) {
                labels_json = JSON.parse(labels_data);
                callback_fun(labels_json);
            }
        );
    },
    /**
     * @description Loads the translations of the languages in a given language
     * @param {string} lg_str - The language of the translations
     * @param {function}  callback_fun - The callback called with the data as argument.
     */
    fetchLanguages: function (lg_str, callback_fun) {
        loadJSON('dist_linguago/labels/languages/languages_' + lg_str + '.json',
            function (labels_data) {
                languages_json = JSON.parse(labels_data);
                if (languages_json.Id) {
                    delete languages_json.Id;
                }
                if (callback_fun) {
                    callback_fun(labels_json);
                }
            }
        );
    },
    /**
     *
     * @description - Gets the translations of languages currently used by the game
     * @returns {Object} - The translations in JSON-format
     */
    getCurrentLanguages: function () {
        return languages_json;
    },
    /**
     *
     * @description - Gets the text of a label
     * @param labelId_str - The id identifying the text to fetch.
     * @returns {String} - The translation
     */
    getLabel: function (labelId_str) {
        var result_str = labels_json[labelId_str];
        if (result_str) {
            return labels_json[labelId_str];
        } else {
            throw (new Error('Lablel "' +
                labelId_str +
                '" was not found'
            ));
        }
    }
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 06/05/2017.
 * @module
 * @description Manages the pauses in the game (caused by popup displays, pause-button, ...)
 *
 */


var
    app_el = __webpack_require__ (4)('app').dom_el,
    noPopup_bool = true,
    evaluatePause =  function (){
        var paused_bool =  noPopup_bool && pauseButton_bool;
        if (pauseButton_bool) {
            app_el.classList.remove ('pauseButtonTriggered');
        } else {
            app_el.classList.add ('pauseButtonTriggered');
        }
        return paused_bool;
    },
    pauseButton_bool = true;
module.exports = {
    /**
     *
     * @description Gets or sets wether the pause-pause-button is on or off.
     * @type {Boolean}
     */
    set pauseButton (boolean) {
        pauseButton_bool = !boolean;
        evaluatePause();
    },
    get pauseButton ()  {
        return pauseButton_bool;
    },
    /**
     * @type {Boolean}
     * @description Gets or sets wether the game is playing or not.
     */

    set playing   (boolean) {
        if (boolean === undefined) {
            noPopup_bool = !noPopup_bool;
        } else {
            noPopup_bool = boolean;
        }
        evaluatePause();
    },
    get playing () {
        return evaluatePause ();
    }

};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 10/04/2017.
 * @module
 * @description Keeps a list of all objects currently displayed in the game, sorted by kind ("badGuy", "Goodie",  "playerAvatar") .
 */
var list_obj = {disabled: []},
    ArrayUtils = __webpack_require__(18),
    getList = function (listId_str) {
        var result_array = list_obj[listId_str];
        if (!listId_str) {
            return list_obj;
        }
        if (result_array) {
            return list_obj[listId_str];
        } else {
            throw (new Error('List "' + listId_str + '" not found'));
        }
    },
    createList = function (id_str, array) {
        if (!array) {
            array = [];
        }
        list_obj[id_str] = array;
        return list_obj[id_str];
    };

module.exports = {
    /**
     * Creates a list for a new kind of objects
     * @method
     * @param {string} id_str - The name of the list
     * @param {array} array=[] -A list of objects to add into the new list
     * @return {array} -The list

     */
    createList: createList,

    /**
     * Gets a list based on the provided id.
     * @method
     *
     * @return {array} The list.
      */
    getList: getList,
    /**
     * Removes all the elements from the list and from the screen.
     *
     */
    cleanAll: function () {
        var
            items_array,
            n;
        for (n in list_obj) {
            if (list_obj.hasOwnProperty(n)) {
                items_array = list_obj[n];

                while (items_array.length > 0) {
                    var
                        item_obj = items_array.pop(),
                        dom_el = item_obj.dom_el;
                    if (dom_el) {
                        if (dom_el.parentNode) {
                            dom_el.parentNode.removeChild(dom_el);
                        }
                    }
                }
            }
        }
    },
    /**
     * Adds an item to a given list
     * @param {string} listId_str -The name of the list
     * @param {object} item_obj The object to add.
     */
    pushItem: function (listId_str, item_obj) {
        getList(listId_str).push(item_obj);
    },
    /**
     * Removes an object from a list so that it has no impact on the game anymore.
     * @param {string} listId_str - The name of the list
     * @param {object} item_obj The object to disable.
     */
    disableItemFromList: function (listId_str, item_obj) {
        list_obj.disabled.push(item_obj);
        return createList(listId_str, ArrayUtils.remove(getList(listId_str), item_obj));
    }
};



/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(2).Buffer

// prototype class for hash functions
function Hash (blockSize, finalSize) {
  this._block = Buffer.alloc(blockSize)
  this._finalSize = finalSize
  this._blockSize = blockSize
  this._len = 0
}

Hash.prototype.update = function (data, enc) {
  if (typeof data === 'string') {
    enc = enc || 'utf8'
    data = Buffer.from(data, enc)
  }

  var block = this._block
  var blockSize = this._blockSize
  var length = data.length
  var accum = this._len

  for (var offset = 0; offset < length;) {
    var assigned = accum % blockSize
    var remainder = Math.min(length - offset, blockSize - assigned)

    for (var i = 0; i < remainder; i++) {
      block[assigned + i] = data[offset + i]
    }

    accum += remainder
    offset += remainder

    if ((accum % blockSize) === 0) {
      this._update(block)
    }
  }

  this._len += length
  return this
}

Hash.prototype.digest = function (enc) {
  var rem = this._len % this._blockSize

  this._block[rem] = 0x80

  // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
  // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
  this._block.fill(0, rem + 1)

  if (rem >= this._finalSize) {
    this._update(this._block)
    this._block.fill(0)
  }

  var bits = this._len * 8

  // uint32
  if (bits <= 0xffffffff) {
    this._block.writeUInt32BE(bits, this._blockSize - 4)

  // uint64
  } else {
    var lowBits = bits & 0xffffffff
    var highBits = (bits - lowBits) / 0x100000000

    this._block.writeUInt32BE(highBits, this._blockSize - 8)
    this._block.writeUInt32BE(lowBits, this._blockSize - 4)
  }

  this._update(this._block)
  var hash = this._hash()

  return enc ? hash.toString(enc) : hash
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

module.exports = Hash


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 04/05/2017.
 * @module
 * @descrition Preloads, loads, caches and plays the sounds used in the application.
 * @param fileName_str {string} - The name of the file, without the folder path and ".mp3" extension
 * @param forceNewAudio_bool {boolean} - Forces the app to load the sound again -even if the sound was already cached (allows sounds overlaps).
 */


var
    FOLDER_STR = 'dist_linguago/sounds/',
    cache = {},
    loadSound = function (name_str, doNotUseCache_bool) {
        var audio = doNotUseCache_bool ? null : cache[name_str];
        if (!audio) {
            audio = new Audio(FOLDER_STR + name_str + '.mp3');
            if (!cache[name_str]) {
                cache[name_str] = audio;
            }
        }
        return audio;
    },
    preload_array = ["bon_1", "bon_2", "question", "mauvais_1", "mauvais_2"];
preload_array.forEach(function (name_str) {
    loadSound(name_str);
});

module.exports = function (filename_str, forceNewAudio_bool) {
    var audio = loadSound(filename_str, forceNewAudio_bool);
    audio.play();
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 12/03/2017.
 * @module
 * @description A bunch of utility functions used to modify arrays.
 *
 */
var
    getRandomCel = function (array, remove_bool) {
    var celIndex_num = Math.floor(Math.random() * array.length);
    if (!remove_bool) {
        return array[celIndex_num];
    } else {
        return array.splice(celIndex_num, 1)[0];
    }
},
    clone = function (array) {
    var new_array = [];
    array.forEach(function (element, index) {
        new_array.push(element);
    });
    return new_array;
};

module.exports = {
    /**
     * Creates a flat copy of an array
     * @method
     * @param {array} array -The source array.
     * @return {array} -The copy
     */

    clone: clone,

    /**
     * Removes an element from an array
     * @method
     * @param {array} array -The source array.
     * @param {*} item The object to find and remove
     * @return {array} - A copy of the array without the elememnt given as attribute.
     */

    remove: function (array, item) {
        result_array = array.filter(function (element) {
            return element !== item;
        });
        return result_array;
    },

    /**
     * Randomly sets the order of the cells of an array
     * @param {array} array -The source array.
     * @return {array} - The shuffled array
     */

    shuffle: function (array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    /**
     * Converts the properties of an object into an array of value pairs with format {id:propertyName, value:propertyValue}.
     * @param {Object} obj -The source Object.
     * @return {Array<Object>} - The resulting array.
     */

    convertObjectToArray: function (obj) {
        var result_array = [];
        for (var n in obj) {
            result_array.push(
                {
                    "id": n,
                    "value": obj[n]
                }
            )
        }
        return result_array;
    },

    /**
     * Gets a random cel of an array
     * @method
     * @param {array} array -The source array.
     * @param {Boolean} remove_bool -Wether or not the selected cel should be removed from the source array.
     * @return {*} -The content of the cel.
     */

    getRandomCel: getRandomCel,

    /**
     *  Picks random items into an array.
     * @param source_array - The source array
     * @param items_num - The number of random items to get from the array
     * @returns {Array} The resulting selection
     */
    pickRandomItems: function (source_array, items_num) {
        var result_array = [];
        source_array = clone(source_array);
        for (var n = 0; n < items_num; n++) {
            result_array.push(getRandomCel(source_array, true));
        }
        return result_array;
    }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var asn1 = exports;

asn1.bignum = __webpack_require__(3);

asn1.define = __webpack_require__(110).define;
asn1.base = __webpack_require__(20);
asn1.constants = __webpack_require__(58);
asn1.decoders = __webpack_require__(114);
asn1.encoders = __webpack_require__(116);


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var base = exports;

base.Reporter = __webpack_require__(112).Reporter;
base.DecoderBuffer = __webpack_require__(57).DecoderBuffer;
base.EncoderBuffer = __webpack_require__(57).EncoderBuffer;
base.Node = __webpack_require__(111);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = function xor (a, b) {
  var length = Math.min(a.length, b.length)
  var buffer = new Buffer(length)

  for (var i = 0; i < length; ++i) {
    buffer[i] = a[i] ^ b[i]
  }

  return buffer
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
var inherits = __webpack_require__(0)
var md5 = __webpack_require__(41)
var RIPEMD160 = __webpack_require__(48)
var sha = __webpack_require__(49)

var Base = __webpack_require__(9)

function HashNoConstructor (hash) {
  Base.call(this, 'digest')

  this._hash = hash
  this.buffers = []
}

inherits(HashNoConstructor, Base)

HashNoConstructor.prototype._update = function (data) {
  this.buffers.push(data)
}

HashNoConstructor.prototype._final = function () {
  var buf = Buffer.concat(this.buffers)
  var r = this._hash(buf)
  this.buffers = null

  return r
}

function Hash (hash) {
  Base.call(this, 'digest')

  this._hash = hash
}

inherits(Hash, Base)

Hash.prototype._update = function (data) {
  this._hash.update(data)
}

Hash.prototype._final = function () {
  return this._hash.digest()
}

module.exports = function createHash (alg) {
  alg = alg.toLowerCase()
  if (alg === 'md5') return new HashNoConstructor(md5)
  if (alg === 'rmd160' || alg === 'ripemd160') return new Hash(new RIPEMD160())

  return new Hash(sha(alg))
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(8);
var assert = __webpack_require__(6);

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
exports.BlockHash = BlockHash;

BlockHash.prototype.update = function update(msg, enc) {
  // Convert message to array, pad it, and join into 32bit blocks
  msg = utils.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;

  // Enough data, try updating
  if (this.pending.length >= this._delta8) {
    msg = this.pending;

    // Process pending data in blocks
    var r = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0)
      this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function digest(enc) {
  this.update(this._pad());
  assert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k = bytes - ((len + this.padLength) % bytes);
  var res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++)
    res[i] = 0;

  // Append length
  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (t = 8; t < this.padLength; t++)
      res[i++] = 0;
  }

  return res;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

function oldBrowser () {
  throw new Error('secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11')
}

var Buffer = __webpack_require__(2).Buffer
var crypto = global.crypto || global.msCrypto

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes
} else {
  module.exports = oldBrowser
}

function randomBytes (size, cb) {
  // phantomjs needs to throw
  if (size > 65536) throw new Error('requested too many random bytes')
  // in case browserify  isn't using the Uint8Array version
  var rawBytes = new global.Uint8Array(size)

  // This will not work in older browsers.
  // See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
  if (size > 0) {  // getRandomValues fails on IE if size == 0
    crypto.getRandomValues(rawBytes)
  }

  // XXX: phantomjs doesn't like a buffer being passed here
  var bytes = Buffer.from(rawBytes.buffer)

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(10)))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module
 * @description This wrapper keeps a list of all intervals used in tha application in order to clean them.
 *
 *
 */


var interval_array = [];
module.exports = {
    /**
     * Cleans all intervals registred through this module.
     */
    clearAll: function () {
        interval_array.forEach(function (interval_api) {
            interval_api.clear();
        });
        interval_array = [];
    },
    /**
     * Wrapper: sets and registers an interval.
     * @param {function} fun - The interval's callback function.
     * @param {number} delay_num - The interval's delay.
     */
    set: function (fun, delay_num) {
        (function () {
            var
                remainingTime = delay_num,
                startdelay_num = new Date().getTime(),
                interval,
                initInterval = function () {
                    if (remainingTime > 0) {
                        interval = window.setInterval(fun, remainingTime);
                    }
                },
                interval_api = {
                    clear: function () {
                        window.clearInterval(interval);
                    },
                    pause: function () {
                        var elapsedTime = new Date().getTime() - startdelay_num;
                        remainingTime = remainingTime - elapsedTime;
                        clearinterval(interval);
                    },
                    reStart: function () {
                        startdelay_num = new Date().getTime();
                        initInterval();
                    }
                };
            initInterval();
            interval_array.push(interval_api);
            return interval_api;
        }());
    }
};



/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description This component manages the display of the score of the user
 */
var sha1 = __webpack_require__(173),
    Labels = __webpack_require__(13),
    Backend = __webpack_require__(105);

var

    score_num = 0,
    display = function (score_num) {
        var display_text = document.getElementById('score');
        display_text.textContent = score_num;
    };
    display (0);

module.exports = {
    /**
     * The score of the player
     * @readonly
     * @type number
     *
     */
    get score() {
        return score_num;
    },
    /**
     * Resets the score to 0
     *
     */
    reset: function () {
        score_num = 0;
        display (score_num);
    },
    /**
     * Add points to the score
      * @param {Number} num - The number of points to add.
     */
    add:function (num) {
       score_num += num;
       display (score_num);
    },
    /**
     * Adds 1 point to the score.
     */
    increment: function () {
        display(++score_num);
    },

    // Return the secret, must be hidden
    getSecret: function () { // This need to be hidden
        return "lBg9Gu4sitMcH8HqcyGR"; //TODO: not harcode it?
    },

    // Return client iD
    getClientID: function () {
        return "k_client2";
    },

    // return hashed value
    // Remember: Check http, https if there is error
    injectHashValue: function (url) {
        var url = url;
        var hash = sha1(url+module.exports.getSecret());
        return hash;
    },

    /**
     * API call to retrieve tour rank from your current score
      * @param {Number} score - The current score
      * @callback succ_callback
      * @callback err_callback
     */
    getRank: function (score, succ_callback, err_callback) {
        if ((typeof score != "number") || (!(score >= 0))) {
            return err_callback();
        }
        //Start fetching
        var xhr = new XMLHttpRequest();
        xhr.open("GET", Backend.baseURL+"/current_score/2/" + score, true);
        xhr.setRequestHeader("Client-id", module.exports.getClientID());
        xhr.setRequestHeader("Hash-value", module.exports.injectHashValue(Backend.baseURL2+"/current_score/2/" + score.toString())); //Why https is removed?
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                //Error value
                var ret = -1;
                var tot = -1

                //Parse
                var response = null;
                try {
                    response = JSON.parse(xhr.responseText);
                } catch (error) {
                    return err_callback();
                }
                if ((response) && (response.data) && (response.status)) {
                    ret = parseInt(response.data.position);
                    tot = parseInt(response.data.total_scores)+1;
                } else {
                    ret = parseInt(response.data.position);
                    tot = parseInt(response.data.total_scores)+1;
                    return succ_callback(ret, tot);
                }

                return succ_callback(ret, tot);
            }
        }
        xhr.send();
    },

    /**
     * API call to post your score
      * @param {Number} score - The current score
      * @param {String} name - Nickname
      * @callback succ_callback
      * @callback err_callback
     */
    postScore: function (score, name,  succ_callback, err_callback) {
        //Fail for bad input
        if ((typeof score != "number") || (!(score >= 0))) {
            return err_callback();
        }
        if (typeof name != "string") {
            return err_callback();
        }
        if ((name == "") || (name == "__________")) {
            name = "0";
        }

        //Start fetching
        var xhr = new XMLHttpRequest();
        xhr.open("GET", Backend.baseURL+"/send_score/2/" + score + "/" + name, true);
        xhr.setRequestHeader("Client-id", module.exports.getClientID());
        xhr.setRequestHeader("Hash-value", module.exports.injectHashValue(Backend.baseURL2+"/send_score/2/" + score + "/" + name)); //Why https is removed?
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                //Parse
                var response = null;
                try {
                    response = JSON.parse(xhr.responseText);
                } catch (error) {
                    return err_callback();
                }
                if ((response) && (response.status)) {
                    return succ_callback();
                } else {
                    return err_callback();
                }
            }
        }
        xhr.send();
    },

    /**
     * Prompt a basic Dialog box for the user to enter his nickname
      * @param {Number} score - The current score
      * @callback succ_callback
      * @callback err_callback
      * @callback cancel_callback
     */
    promptScore: function(score, succ_callback, err_callback, cancel_callback) { //cancel callback?
        var promptVal = prompt(Labels.getLabel('enter_name_hof'), "");

        if (promptVal && promptVal != null) {
            module.exports.postScore(score, promptVal, succ_callback, err_callback);
        } else {
            return cancel_callback();
        }
    }

};



/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// based on the aes implimentation in triple sec
// https://github.com/keybase/triplesec
// which is in turn based on the one from crypto-js
// https://code.google.com/p/crypto-js/

var Buffer = __webpack_require__(2).Buffer

function asUInt32Array (buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)

  var len = (buf.length / 4) | 0
  var out = new Array(len)

  for (var i = 0; i < len; i++) {
    out[i] = buf.readUInt32BE(i * 4)
  }

  return out
}

function scrubVec (v) {
  for (var i = 0; i < v.length; v++) {
    v[i] = 0
  }
}

function cryptBlock (M, keySchedule, SUB_MIX, SBOX, nRounds) {
  var SUB_MIX0 = SUB_MIX[0]
  var SUB_MIX1 = SUB_MIX[1]
  var SUB_MIX2 = SUB_MIX[2]
  var SUB_MIX3 = SUB_MIX[3]

  var s0 = M[0] ^ keySchedule[0]
  var s1 = M[1] ^ keySchedule[1]
  var s2 = M[2] ^ keySchedule[2]
  var s3 = M[3] ^ keySchedule[3]
  var t0, t1, t2, t3
  var ksRow = 4

  for (var round = 1; round < nRounds; round++) {
    t0 = SUB_MIX0[s0 >>> 24] ^ SUB_MIX1[(s1 >>> 16) & 0xff] ^ SUB_MIX2[(s2 >>> 8) & 0xff] ^ SUB_MIX3[s3 & 0xff] ^ keySchedule[ksRow++]
    t1 = SUB_MIX0[s1 >>> 24] ^ SUB_MIX1[(s2 >>> 16) & 0xff] ^ SUB_MIX2[(s3 >>> 8) & 0xff] ^ SUB_MIX3[s0 & 0xff] ^ keySchedule[ksRow++]
    t2 = SUB_MIX0[s2 >>> 24] ^ SUB_MIX1[(s3 >>> 16) & 0xff] ^ SUB_MIX2[(s0 >>> 8) & 0xff] ^ SUB_MIX3[s1 & 0xff] ^ keySchedule[ksRow++]
    t3 = SUB_MIX0[s3 >>> 24] ^ SUB_MIX1[(s0 >>> 16) & 0xff] ^ SUB_MIX2[(s1 >>> 8) & 0xff] ^ SUB_MIX3[s2 & 0xff] ^ keySchedule[ksRow++]
    s0 = t0
    s1 = t1
    s2 = t2
    s3 = t3
  }

  t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++]
  t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++]
  t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++]
  t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++]
  t0 = t0 >>> 0
  t1 = t1 >>> 0
  t2 = t2 >>> 0
  t3 = t3 >>> 0

  return [t0, t1, t2, t3]
}

// AES constants
var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]
var G = (function () {
  // Compute double table
  var d = new Array(256)
  for (var j = 0; j < 256; j++) {
    if (j < 128) {
      d[j] = j << 1
    } else {
      d[j] = (j << 1) ^ 0x11b
    }
  }

  var SBOX = []
  var INV_SBOX = []
  var SUB_MIX = [[], [], [], []]
  var INV_SUB_MIX = [[], [], [], []]

  // Walk GF(2^8)
  var x = 0
  var xi = 0
  for (var i = 0; i < 256; ++i) {
    // Compute sbox
    var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4)
    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63
    SBOX[x] = sx
    INV_SBOX[sx] = x

    // Compute multiplication
    var x2 = d[x]
    var x4 = d[x2]
    var x8 = d[x4]

    // Compute sub bytes, mix columns tables
    var t = (d[sx] * 0x101) ^ (sx * 0x1010100)
    SUB_MIX[0][x] = (t << 24) | (t >>> 8)
    SUB_MIX[1][x] = (t << 16) | (t >>> 16)
    SUB_MIX[2][x] = (t << 8) | (t >>> 24)
    SUB_MIX[3][x] = t

    // Compute inv sub bytes, inv mix columns tables
    t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100)
    INV_SUB_MIX[0][sx] = (t << 24) | (t >>> 8)
    INV_SUB_MIX[1][sx] = (t << 16) | (t >>> 16)
    INV_SUB_MIX[2][sx] = (t << 8) | (t >>> 24)
    INV_SUB_MIX[3][sx] = t

    if (x === 0) {
      x = xi = 1
    } else {
      x = x2 ^ d[d[d[x8 ^ x2]]]
      xi ^= d[d[xi]]
    }
  }

  return {
    SBOX: SBOX,
    INV_SBOX: INV_SBOX,
    SUB_MIX: SUB_MIX,
    INV_SUB_MIX: INV_SUB_MIX
  }
})()

function AES (key) {
  this._key = asUInt32Array(key)
  this._reset()
}

AES.blockSize = 4 * 4
AES.keySize = 256 / 8
AES.prototype.blockSize = AES.blockSize
AES.prototype.keySize = AES.keySize
AES.prototype._reset = function () {
  var keyWords = this._key
  var keySize = keyWords.length
  var nRounds = keySize + 6
  var ksRows = (nRounds + 1) * 4

  var keySchedule = []
  for (var k = 0; k < keySize; k++) {
    keySchedule[k] = keyWords[k]
  }

  for (k = keySize; k < ksRows; k++) {
    var t = keySchedule[k - 1]

    if (k % keySize === 0) {
      t = (t << 8) | (t >>> 24)
      t =
        (G.SBOX[t >>> 24] << 24) |
        (G.SBOX[(t >>> 16) & 0xff] << 16) |
        (G.SBOX[(t >>> 8) & 0xff] << 8) |
        (G.SBOX[t & 0xff])

      t ^= RCON[(k / keySize) | 0] << 24
    } else if (keySize > 6 && k % keySize === 4) {
      t =
        (G.SBOX[t >>> 24] << 24) |
        (G.SBOX[(t >>> 16) & 0xff] << 16) |
        (G.SBOX[(t >>> 8) & 0xff] << 8) |
        (G.SBOX[t & 0xff])
    }

    keySchedule[k] = keySchedule[k - keySize] ^ t
  }

  var invKeySchedule = []
  for (var ik = 0; ik < ksRows; ik++) {
    var ksR = ksRows - ik
    var tt = keySchedule[ksR - (ik % 4 ? 0 : 4)]

    if (ik < 4 || ksR <= 4) {
      invKeySchedule[ik] = tt
    } else {
      invKeySchedule[ik] =
        G.INV_SUB_MIX[0][G.SBOX[tt >>> 24]] ^
        G.INV_SUB_MIX[1][G.SBOX[(tt >>> 16) & 0xff]] ^
        G.INV_SUB_MIX[2][G.SBOX[(tt >>> 8) & 0xff]] ^
        G.INV_SUB_MIX[3][G.SBOX[tt & 0xff]]
    }
  }

  this._nRounds = nRounds
  this._keySchedule = keySchedule
  this._invKeySchedule = invKeySchedule
}

AES.prototype.encryptBlockRaw = function (M) {
  M = asUInt32Array(M)
  return cryptBlock(M, this._keySchedule, G.SUB_MIX, G.SBOX, this._nRounds)
}

AES.prototype.encryptBlock = function (M) {
  var out = this.encryptBlockRaw(M)
  var buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0], 0)
  buf.writeUInt32BE(out[1], 4)
  buf.writeUInt32BE(out[2], 8)
  buf.writeUInt32BE(out[3], 12)
  return buf
}

AES.prototype.decryptBlock = function (M) {
  M = asUInt32Array(M)

  // swap
  var m1 = M[1]
  M[1] = M[3]
  M[3] = m1

  var out = cryptBlock(M, this._invKeySchedule, G.INV_SUB_MIX, G.INV_SBOX, this._nRounds)
  var buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0], 0)
  buf.writeUInt32BE(out[3], 4)
  buf.writeUInt32BE(out[2], 8)
  buf.writeUInt32BE(out[1], 12)
  return buf
}

AES.prototype.scrub = function () {
  scrubVec(this._keySchedule)
  scrubVec(this._invKeySchedule)
  scrubVec(this._key)
}

module.exports.AES = AES


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = exports;

curve.base = __webpack_require__(149);
curve.short = __webpack_require__(152);
curve.mont = __webpack_require__(151);
curve.edwards = __webpack_require__(150);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(2).Buffer
var MD5 = __webpack_require__(174)

/* eslint-disable camelcase */
function EVP_BytesToKey (password, salt, keyBits, ivLen) {
  if (!Buffer.isBuffer(password)) password = Buffer.from(password, 'binary')
  if (salt) {
    if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, 'binary')
    if (salt.length !== 8) throw new RangeError('salt should be Buffer with 8 byte length')
  }

  var keyLen = keyBits / 8
  var key = Buffer.alloc(keyLen)
  var iv = Buffer.alloc(ivLen || 0)
  var tmp = Buffer.alloc(0)

  while (keyLen > 0 || ivLen > 0) {
    var hash = new MD5()
    hash.update(tmp)
    hash.update(password)
    if (salt) hash.update(salt)
    tmp = hash.digest()

    var used = 0

    if (keyLen > 0) {
      var keyStart = key.length - keyLen
      used = Math.min(keyLen, tmp.length)
      tmp.copy(key, keyStart, 0, used)
      keyLen -= used
    }

    if (used < tmp.length && ivLen > 0) {
      var ivStart = iv.length - ivLen
      var length = Math.min(ivLen, tmp.length - used)
      tmp.copy(iv, ivStart, used, used + length)
      ivLen -= length
    }
  }

  tmp.fill(0)
  return { key: key, iv: iv }
}

module.exports = EVP_BytesToKey


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var asn1 = __webpack_require__(177)
var aesid = __webpack_require__(176)
var fixProc = __webpack_require__(179)
var ciphers = __webpack_require__(38)
var compat = __webpack_require__(77)
module.exports = parseKeys

function parseKeys (buffer) {
  var password
  if (typeof buffer === 'object' && !Buffer.isBuffer(buffer)) {
    password = buffer.passphrase
    buffer = buffer.key
  }
  if (typeof buffer === 'string') {
    buffer = new Buffer(buffer)
  }

  var stripped = fixProc(buffer, password)

  var type = stripped.tag
  var data = stripped.data
  var subtype, ndata
  switch (type) {
    case 'CERTIFICATE':
      ndata = asn1.certificate.decode(data, 'der').tbsCertificate.subjectPublicKeyInfo
      // falls through
    case 'PUBLIC KEY':
      if (!ndata) {
        ndata = asn1.PublicKey.decode(data, 'der')
      }
      subtype = ndata.algorithm.algorithm.join('.')
      switch (subtype) {
        case '1.2.840.113549.1.1.1':
          return asn1.RSAPublicKey.decode(ndata.subjectPublicKey.data, 'der')
        case '1.2.840.10045.2.1':
          ndata.subjectPrivateKey = ndata.subjectPublicKey
          return {
            type: 'ec',
            data: ndata
          }
        case '1.2.840.10040.4.1':
          ndata.algorithm.params.pub_key = asn1.DSAparam.decode(ndata.subjectPublicKey.data, 'der')
          return {
            type: 'dsa',
            data: ndata.algorithm.params
          }
        default: throw new Error('unknown key id ' + subtype)
      }
      throw new Error('unknown key type ' + type)
    case 'ENCRYPTED PRIVATE KEY':
      data = asn1.EncryptedPrivateKey.decode(data, 'der')
      data = decrypt(data, password)
      // falls through
    case 'PRIVATE KEY':
      ndata = asn1.PrivateKey.decode(data, 'der')
      subtype = ndata.algorithm.algorithm.join('.')
      switch (subtype) {
        case '1.2.840.113549.1.1.1':
          return asn1.RSAPrivateKey.decode(ndata.subjectPrivateKey, 'der')
        case '1.2.840.10045.2.1':
          return {
            curve: ndata.algorithm.curve,
            privateKey: asn1.ECPrivateKey.decode(ndata.subjectPrivateKey, 'der').privateKey
          }
        case '1.2.840.10040.4.1':
          ndata.algorithm.params.priv_key = asn1.DSAparam.decode(ndata.subjectPrivateKey, 'der')
          return {
            type: 'dsa',
            params: ndata.algorithm.params
          }
        default: throw new Error('unknown key id ' + subtype)
      }
      throw new Error('unknown key type ' + type)
    case 'RSA PUBLIC KEY':
      return asn1.RSAPublicKey.decode(data, 'der')
    case 'RSA PRIVATE KEY':
      return asn1.RSAPrivateKey.decode(data, 'der')
    case 'DSA PRIVATE KEY':
      return {
        type: 'dsa',
        params: asn1.DSAPrivateKey.decode(data, 'der')
      }
    case 'EC PRIVATE KEY':
      data = asn1.ECPrivateKey.decode(data, 'der')
      return {
        curve: data.parameters.value,
        privateKey: data.privateKey
      }
    default: throw new Error('unknown key type ' + type)
  }
}
parseKeys.signature = asn1.signature
function decrypt (data, password) {
  var salt = data.algorithm.decrypt.kde.kdeparams.salt
  var iters = parseInt(data.algorithm.decrypt.kde.kdeparams.iters.toString(), 10)
  var algo = aesid[data.algorithm.decrypt.cipher.algo.join('.')]
  var iv = data.algorithm.decrypt.cipher.iv
  var cipherText = data.subjectPrivateKey
  var keylen = parseInt(algo.split('-')[1], 10) / 8
  var key = compat.pbkdf2Sync(password, salt, iters, keylen)
  var cipher = ciphers.createDecipheriv(algo, key, iv)
  var out = []
  out.push(cipher.update(cipherText))
  out.push(cipher.final())
  return Buffer.concat(out)
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = __webpack_require__(43).EventEmitter;
var inherits = __webpack_require__(0);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(47);
Stream.Writable = __webpack_require__(189);
Stream.Duplex = __webpack_require__(184);
Stream.Transform = __webpack_require__(188);
Stream.PassThrough = __webpack_require__(187);

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description This component keeps track and displays the reamining lives of the player.
 *
 */
var
    LIVES_NUM = 5,
    lives_num = LIVES_NUM,
    display = function (lives_num) {
        var
            livesEl_array = document.getElementsByClassName('liveIcon'),
            n;
        for (n = 0; n < livesEl_array.length; n++) {
            var el = livesEl_array[n];
            if (n < lives_num) {
                el.setAttribute('display', 'inline');
            } else {
                el.setAttribute('display', 'none');
            }
        }
    };
display(LIVES_NUM);
module.exports = {
    /**
     * Removes 1 life and updates the display. Calls onLivesLost callback when 0 is reached.
     *
     */
    decrement: function () {
        display(--lives_num);
        if (lives_num === 0) {
            onLivesLost_fun();
        }
    },
    /**
     * Adds 1 life and updates the display.
     */
    increment: function () {
        if (lives_num < LIVES_NUM) {
        display(++lives_num);
        }
    },
    /**
     * @type function
     * @description Sets the callback called when the counter reaches 0. (write-only).
     */
    set onLivesLost(fun) {
        onLivesLost_fun = fun;
    },
    /**
     * @type Number
     * @readonly
     * @description The maximum available lives.
     */
    get maxLives () {
      return LIVES_NUM;
    },
    /**
     * @type Number
     * @readonly
     * @description The number of remaining lives.
     */
    get lives (){
      return lives_num;
    },
    /**
     * Resets lives to the maximum value. Updates the display.
     */
    reset: function () {
        lives_num = LIVES_NUM;
        display(lives_num);
    }
};




/***/ }),
/* 35 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 16/07/2017.
 */


/**
 * @module
 * @description Basic animations and transitions
 *
 */

module.exports =  {
    /**
     * @description Fades an element form 0 to 100 opacity
     * @param {DomElement} dom_el - The element to animate
     */
    fadeIn:function (dom_el){
        var opacity_num = 0.1,
            interval  = window.setInterval (function () {
              opacity_num *= 1.5;
              if (opacity_num >= 100) {
                  opacity_num = 100;
                  window.clearInterval (interval);
              }
                dom_el.setAttribute ('opacity', opacity_num);

        }, 50);
        dom_el.setAttribute ('opacity', opacity_num);
    }
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module
 * @description This wrapper keeps a list of all timeouts used in tha application in order to clean them.
 *
 *
 */


var timout_array = [];
module.exports = {
    /**
     * Cleans all timeouts registred through this module.
     */
    clearAll: function () {
        timout_array.forEach(function (timeout_api) {
            timeout_api.clear();
        });
        timout_array = [];
    },
    /**
     * Wrapper: sets and registers a timeout.
     * @param {function} fun - The timeout's callback function.
     * @param {number} delay_num - The timeout's delay.
     * @todo replace private var "interval" by "timout"
     * @todo create a single module that handles both intervals and timeouts in order to avoid code duplication.
     */

    set: function (fun, delay_num) {
        (function () {
            var
                remainingTime = delay_num,
                startdelay_num = new Date().getTime(),
                interval,
                initTimeout = function () {
                    if (remainingTime > 0) {
                        interval = window.setTimeout(fun, remainingTime);
                    }
                },
                timeout_api = {
                    clear: function () {
                        window.clearInterval(interval);
                    },
                    pause: function () {
                        var elapsedTime = new Date().getTime() - startdelay_num;
                        remainingTime = remainingTime - elapsedTime;
                        clearinterval(interval);
                    },
                    reStart: function () {
                        startdelay_num = new Date().getTime();
                        initTimeout();
                    }
                };
            initTimeout();
            timout_array.push(timeout_api);
            return timeout_api;
        }());
    }
};



/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 05/03/2017.
 */

"use Strict";

/**
 * @module
 * @description Tests whether a given point on the grid is already occupied by anotehr object.
 */

var
    Config = __webpack_require__(4),
    ObjectListManager = __webpack_require__(15),
    /**
     * @private
     * @param {string} itemType_str - The type of object to test.
     * @param {Point} point The x and y coordinates
     * @returns {booleans|*} false OR The object at a given point (if exists)
     */
    isItem = function (itemType_str, point) {
        var
            result_obj,
            items_array = ObjectListManager.getList(itemType_str);

        if (!point) {
            return false;
        }
        result_obj = items_array.filter(function (item_obj) {
            var testPoint = function (ref_point) {
                    return point.x >= ref_point.x &&
                        point.x < ref_point.x + item_obj.position.width &&
                        point.y >= ref_point.y && point.y < ref_point.y + item_obj.position.height;

                },
                result1 = testPoint(item_obj.position);
            if (result1) {
                return result1;
            } else if (item_obj.targetPosition) {
                return testPoint(item_obj.targetPosition);
            }
        })[0];
        return result_obj;
    };
module.exports = {
    /**
     * Test wether there is a goodie at the given coordinate

     * @param {Point} point The x and y coordinates
     * @returns {booleans|Object} false OR The goodie at the given point (if exists)
     */

    isGoodie: function (point) {
        return isItem("goodie", point);
    },

    /**
     * Test wether the player avatar is at the given coordinates
     * @param {Point} point The x and y coordinates
     * @returns {booleans|Object} false OR The player avatar at the given point (if exists)
     */
    isAvatar: function (point) {
        return isItem("playerAvatar", point);
    },
    /**
     * Test wether any object occupies the coordinates And if the coordinates are out of the stage.
     * @param {Point} point The x and y coordinates
     * @returns {boolean|string|Object} false OR "out of screen" OR  the object already occupying the given point (if exists)
     */

    isOccupied: function (point) {
        if (point) {
            var
                isInStage = function (point) {
                    var stage_rect = Config('stage').position,
                        isAboveMin_bool = point.x >= 0 && point.y >= 0,
                        isBelowMin_bool = point.x < stage_rect.width && point.y < stage_rect.height;
                    return isAboveMin_bool && isBelowMin_bool;
                },
                stageTest_bool = isInStage(point),
                obstacleTest_obj = isItem("obstacle", point),
                badGuyTest_obj = isItem("badGuy", point);
            if (!stageTest_bool) {
                return 'out of screen'
            }
            if (obstacleTest_obj) {
                return obstacleTest_obj;
            }
            if (badGuyTest_obj) {
                return badGuyTest_obj;
            }
        }
        return null;
    }
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var ciphers = __webpack_require__(120)
var deciphers = __webpack_require__(119)
var modes = __webpack_require__(65)

function getCiphers () {
  return Object.keys(modes)
}

exports.createCipher = exports.Cipher = ciphers.createCipher
exports.createCipheriv = exports.Cipheriv = ciphers.createCipheriv
exports.createDecipher = exports.Decipher = deciphers.createDecipher
exports.createDecipheriv = exports.Decipheriv = deciphers.createDecipheriv
exports.listCiphers = exports.getCiphers = getCiphers


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var modeModules = {
  ECB: __webpack_require__(126),
  CBC: __webpack_require__(122),
  CFB: __webpack_require__(123),
  CFB8: __webpack_require__(125),
  CFB1: __webpack_require__(124),
  OFB: __webpack_require__(127),
  CTR: __webpack_require__(64),
  GCM: __webpack_require__(64)
}

var modes = __webpack_require__(65)

for (var key in modes) {
  modes[key].module = modeModules[modes[key].mode]
}

module.exports = modes


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var bn = __webpack_require__(3);
var randomBytes = __webpack_require__(25);
module.exports = crt;
function blind(priv) {
  var r = getr(priv);
  var blinder = r.toRed(bn.mont(priv.modulus))
  .redPow(new bn(priv.publicExponent)).fromRed();
  return {
    blinder: blinder,
    unblinder:r.invm(priv.modulus)
  };
}
function crt(msg, priv) {
  var blinds = blind(priv);
  var len = priv.modulus.byteLength();
  var mod = bn.mont(priv.modulus);
  var blinded = new bn(msg).mul(blinds.blinder).umod(priv.modulus);
  var c1 = blinded.toRed(bn.mont(priv.prime1));
  var c2 = blinded.toRed(bn.mont(priv.prime2));
  var qinv = priv.coefficient;
  var p = priv.prime1;
  var q = priv.prime2;
  var m1 = c1.redPow(priv.exponent1);
  var m2 = c2.redPow(priv.exponent2);
  m1 = m1.fromRed();
  m2 = m2.fromRed();
  var h = m1.isub(m2).imul(qinv).umod(p);
  h.imul(q);
  m2.iadd(h);
  return new Buffer(m2.imul(blinds.unblinder).umod(priv.modulus).toArray(false, len));
}
crt.getr = getr;
function getr(priv) {
  var len = priv.modulus.byteLength();
  var r = new bn(randomBytes(len));
  while (r.cmp(priv.modulus) >=  0 || !r.umod(priv.prime1) || !r.umod(priv.prime2)) {
    r = new bn(randomBytes(len));
  }
  return r;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var makeHash = __webpack_require__(136)

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5 (x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32)
  x[(((len + 64) >>> 9) << 4) + 14] = len

  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878

  for (var i = 0; i < x.length; i += 16) {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d

    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936)
    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063)
    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329)

    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302)
    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734)

    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558)
    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174)
    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222)
    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979)
    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487)
    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520)
    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651)

    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844)
    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571)
    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359)
    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380)
    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070)
    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259)
    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551)

    a = safe_add(a, olda)
    b = safe_add(b, oldb)
    c = safe_add(c, oldc)
    d = safe_add(d, oldd)
  }

  return [a, b, c, d]
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn (q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}

function md5_ff (a, b, c, d, x, s, t) {
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
}

function md5_gg (a, b, c, d, x, s, t) {
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
}

function md5_hh (a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t)
}

function md5_ii (a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add (x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF)
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xFFFF)
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol (num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

module.exports = function md5 (buf) {
  return makeHash(buf, core_md5)
}


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.utils = __webpack_require__(145);
exports.Cipher = __webpack_require__(142);
exports.DES = __webpack_require__(143);
exports.CBC = __webpack_require__(141);
exports.EDE = __webpack_require__(144);


/***/ }),
/* 43 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var hash = exports;

hash.utils = __webpack_require__(8);
hash.common = __webpack_require__(24);
hash.sha = __webpack_require__(166);
hash.ripemd = __webpack_require__(165);
hash.hmac = __webpack_require__(164);

// Proxy hash functions to the main object
hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = __webpack_require__(1).Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



/*<replacement>*/

var processNextTick = __webpack_require__(32);
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(22);
util.inherits = __webpack_require__(0);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(198)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(87);
/*</replacement>*/

/*<replacement>*/
var Buffer = __webpack_require__(2).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

var destroyImpl = __webpack_require__(86);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(12);

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(12);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = _isUint8Array(chunk) && !state.objectMode;

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    processNextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10), __webpack_require__(197).setImmediate, __webpack_require__(11)))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(84);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(46);
exports.Duplex = __webpack_require__(12);
exports.Transform = __webpack_require__(85);
exports.PassThrough = __webpack_require__(185);


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
var inherits = __webpack_require__(0)
var HashBase = __webpack_require__(163)

function RIPEMD160 () {
  HashBase.call(this, 64)

  // state
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0
}

inherits(RIPEMD160, HashBase)

RIPEMD160.prototype._update = function () {
  var m = new Array(16)
  for (var i = 0; i < 16; ++i) m[i] = this._block.readInt32LE(i * 4)

  var al = this._a
  var bl = this._b
  var cl = this._c
  var dl = this._d
  var el = this._e

  // Mj = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
  // K = 0x00000000
  // Sj = 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8
  al = fn1(al, bl, cl, dl, el, m[0], 0x00000000, 11); cl = rotl(cl, 10)
  el = fn1(el, al, bl, cl, dl, m[1], 0x00000000, 14); bl = rotl(bl, 10)
  dl = fn1(dl, el, al, bl, cl, m[2], 0x00000000, 15); al = rotl(al, 10)
  cl = fn1(cl, dl, el, al, bl, m[3], 0x00000000, 12); el = rotl(el, 10)
  bl = fn1(bl, cl, dl, el, al, m[4], 0x00000000, 5); dl = rotl(dl, 10)
  al = fn1(al, bl, cl, dl, el, m[5], 0x00000000, 8); cl = rotl(cl, 10)
  el = fn1(el, al, bl, cl, dl, m[6], 0x00000000, 7); bl = rotl(bl, 10)
  dl = fn1(dl, el, al, bl, cl, m[7], 0x00000000, 9); al = rotl(al, 10)
  cl = fn1(cl, dl, el, al, bl, m[8], 0x00000000, 11); el = rotl(el, 10)
  bl = fn1(bl, cl, dl, el, al, m[9], 0x00000000, 13); dl = rotl(dl, 10)
  al = fn1(al, bl, cl, dl, el, m[10], 0x00000000, 14); cl = rotl(cl, 10)
  el = fn1(el, al, bl, cl, dl, m[11], 0x00000000, 15); bl = rotl(bl, 10)
  dl = fn1(dl, el, al, bl, cl, m[12], 0x00000000, 6); al = rotl(al, 10)
  cl = fn1(cl, dl, el, al, bl, m[13], 0x00000000, 7); el = rotl(el, 10)
  bl = fn1(bl, cl, dl, el, al, m[14], 0x00000000, 9); dl = rotl(dl, 10)
  al = fn1(al, bl, cl, dl, el, m[15], 0x00000000, 8); cl = rotl(cl, 10)

  // Mj = 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8
  // K = 0x5a827999
  // Sj = 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12
  el = fn2(el, al, bl, cl, dl, m[7], 0x5a827999, 7); bl = rotl(bl, 10)
  dl = fn2(dl, el, al, bl, cl, m[4], 0x5a827999, 6); al = rotl(al, 10)
  cl = fn2(cl, dl, el, al, bl, m[13], 0x5a827999, 8); el = rotl(el, 10)
  bl = fn2(bl, cl, dl, el, al, m[1], 0x5a827999, 13); dl = rotl(dl, 10)
  al = fn2(al, bl, cl, dl, el, m[10], 0x5a827999, 11); cl = rotl(cl, 10)
  el = fn2(el, al, bl, cl, dl, m[6], 0x5a827999, 9); bl = rotl(bl, 10)
  dl = fn2(dl, el, al, bl, cl, m[15], 0x5a827999, 7); al = rotl(al, 10)
  cl = fn2(cl, dl, el, al, bl, m[3], 0x5a827999, 15); el = rotl(el, 10)
  bl = fn2(bl, cl, dl, el, al, m[12], 0x5a827999, 7); dl = rotl(dl, 10)
  al = fn2(al, bl, cl, dl, el, m[0], 0x5a827999, 12); cl = rotl(cl, 10)
  el = fn2(el, al, bl, cl, dl, m[9], 0x5a827999, 15); bl = rotl(bl, 10)
  dl = fn2(dl, el, al, bl, cl, m[5], 0x5a827999, 9); al = rotl(al, 10)
  cl = fn2(cl, dl, el, al, bl, m[2], 0x5a827999, 11); el = rotl(el, 10)
  bl = fn2(bl, cl, dl, el, al, m[14], 0x5a827999, 7); dl = rotl(dl, 10)
  al = fn2(al, bl, cl, dl, el, m[11], 0x5a827999, 13); cl = rotl(cl, 10)
  el = fn2(el, al, bl, cl, dl, m[8], 0x5a827999, 12); bl = rotl(bl, 10)

  // Mj = 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12
  // K = 0x6ed9eba1
  // Sj = 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5
  dl = fn3(dl, el, al, bl, cl, m[3], 0x6ed9eba1, 11); al = rotl(al, 10)
  cl = fn3(cl, dl, el, al, bl, m[10], 0x6ed9eba1, 13); el = rotl(el, 10)
  bl = fn3(bl, cl, dl, el, al, m[14], 0x6ed9eba1, 6); dl = rotl(dl, 10)
  al = fn3(al, bl, cl, dl, el, m[4], 0x6ed9eba1, 7); cl = rotl(cl, 10)
  el = fn3(el, al, bl, cl, dl, m[9], 0x6ed9eba1, 14); bl = rotl(bl, 10)
  dl = fn3(dl, el, al, bl, cl, m[15], 0x6ed9eba1, 9); al = rotl(al, 10)
  cl = fn3(cl, dl, el, al, bl, m[8], 0x6ed9eba1, 13); el = rotl(el, 10)
  bl = fn3(bl, cl, dl, el, al, m[1], 0x6ed9eba1, 15); dl = rotl(dl, 10)
  al = fn3(al, bl, cl, dl, el, m[2], 0x6ed9eba1, 14); cl = rotl(cl, 10)
  el = fn3(el, al, bl, cl, dl, m[7], 0x6ed9eba1, 8); bl = rotl(bl, 10)
  dl = fn3(dl, el, al, bl, cl, m[0], 0x6ed9eba1, 13); al = rotl(al, 10)
  cl = fn3(cl, dl, el, al, bl, m[6], 0x6ed9eba1, 6); el = rotl(el, 10)
  bl = fn3(bl, cl, dl, el, al, m[13], 0x6ed9eba1, 5); dl = rotl(dl, 10)
  al = fn3(al, bl, cl, dl, el, m[11], 0x6ed9eba1, 12); cl = rotl(cl, 10)
  el = fn3(el, al, bl, cl, dl, m[5], 0x6ed9eba1, 7); bl = rotl(bl, 10)
  dl = fn3(dl, el, al, bl, cl, m[12], 0x6ed9eba1, 5); al = rotl(al, 10)

  // Mj = 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2
  // K = 0x8f1bbcdc
  // Sj = 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12
  cl = fn4(cl, dl, el, al, bl, m[1], 0x8f1bbcdc, 11); el = rotl(el, 10)
  bl = fn4(bl, cl, dl, el, al, m[9], 0x8f1bbcdc, 12); dl = rotl(dl, 10)
  al = fn4(al, bl, cl, dl, el, m[11], 0x8f1bbcdc, 14); cl = rotl(cl, 10)
  el = fn4(el, al, bl, cl, dl, m[10], 0x8f1bbcdc, 15); bl = rotl(bl, 10)
  dl = fn4(dl, el, al, bl, cl, m[0], 0x8f1bbcdc, 14); al = rotl(al, 10)
  cl = fn4(cl, dl, el, al, bl, m[8], 0x8f1bbcdc, 15); el = rotl(el, 10)
  bl = fn4(bl, cl, dl, el, al, m[12], 0x8f1bbcdc, 9); dl = rotl(dl, 10)
  al = fn4(al, bl, cl, dl, el, m[4], 0x8f1bbcdc, 8); cl = rotl(cl, 10)
  el = fn4(el, al, bl, cl, dl, m[13], 0x8f1bbcdc, 9); bl = rotl(bl, 10)
  dl = fn4(dl, el, al, bl, cl, m[3], 0x8f1bbcdc, 14); al = rotl(al, 10)
  cl = fn4(cl, dl, el, al, bl, m[7], 0x8f1bbcdc, 5); el = rotl(el, 10)
  bl = fn4(bl, cl, dl, el, al, m[15], 0x8f1bbcdc, 6); dl = rotl(dl, 10)
  al = fn4(al, bl, cl, dl, el, m[14], 0x8f1bbcdc, 8); cl = rotl(cl, 10)
  el = fn4(el, al, bl, cl, dl, m[5], 0x8f1bbcdc, 6); bl = rotl(bl, 10)
  dl = fn4(dl, el, al, bl, cl, m[6], 0x8f1bbcdc, 5); al = rotl(al, 10)
  cl = fn4(cl, dl, el, al, bl, m[2], 0x8f1bbcdc, 12); el = rotl(el, 10)

  // Mj = 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
  // K = 0xa953fd4e
  // Sj = 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
  bl = fn5(bl, cl, dl, el, al, m[4], 0xa953fd4e, 9); dl = rotl(dl, 10)
  al = fn5(al, bl, cl, dl, el, m[0], 0xa953fd4e, 15); cl = rotl(cl, 10)
  el = fn5(el, al, bl, cl, dl, m[5], 0xa953fd4e, 5); bl = rotl(bl, 10)
  dl = fn5(dl, el, al, bl, cl, m[9], 0xa953fd4e, 11); al = rotl(al, 10)
  cl = fn5(cl, dl, el, al, bl, m[7], 0xa953fd4e, 6); el = rotl(el, 10)
  bl = fn5(bl, cl, dl, el, al, m[12], 0xa953fd4e, 8); dl = rotl(dl, 10)
  al = fn5(al, bl, cl, dl, el, m[2], 0xa953fd4e, 13); cl = rotl(cl, 10)
  el = fn5(el, al, bl, cl, dl, m[10], 0xa953fd4e, 12); bl = rotl(bl, 10)
  dl = fn5(dl, el, al, bl, cl, m[14], 0xa953fd4e, 5); al = rotl(al, 10)
  cl = fn5(cl, dl, el, al, bl, m[1], 0xa953fd4e, 12); el = rotl(el, 10)
  bl = fn5(bl, cl, dl, el, al, m[3], 0xa953fd4e, 13); dl = rotl(dl, 10)
  al = fn5(al, bl, cl, dl, el, m[8], 0xa953fd4e, 14); cl = rotl(cl, 10)
  el = fn5(el, al, bl, cl, dl, m[11], 0xa953fd4e, 11); bl = rotl(bl, 10)
  dl = fn5(dl, el, al, bl, cl, m[6], 0xa953fd4e, 8); al = rotl(al, 10)
  cl = fn5(cl, dl, el, al, bl, m[15], 0xa953fd4e, 5); el = rotl(el, 10)
  bl = fn5(bl, cl, dl, el, al, m[13], 0xa953fd4e, 6); dl = rotl(dl, 10)

  var ar = this._a
  var br = this._b
  var cr = this._c
  var dr = this._d
  var er = this._e

  // M'j = 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12
  // K' = 0x50a28be6
  // S'j = 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6
  ar = fn5(ar, br, cr, dr, er, m[5], 0x50a28be6, 8); cr = rotl(cr, 10)
  er = fn5(er, ar, br, cr, dr, m[14], 0x50a28be6, 9); br = rotl(br, 10)
  dr = fn5(dr, er, ar, br, cr, m[7], 0x50a28be6, 9); ar = rotl(ar, 10)
  cr = fn5(cr, dr, er, ar, br, m[0], 0x50a28be6, 11); er = rotl(er, 10)
  br = fn5(br, cr, dr, er, ar, m[9], 0x50a28be6, 13); dr = rotl(dr, 10)
  ar = fn5(ar, br, cr, dr, er, m[2], 0x50a28be6, 15); cr = rotl(cr, 10)
  er = fn5(er, ar, br, cr, dr, m[11], 0x50a28be6, 15); br = rotl(br, 10)
  dr = fn5(dr, er, ar, br, cr, m[4], 0x50a28be6, 5); ar = rotl(ar, 10)
  cr = fn5(cr, dr, er, ar, br, m[13], 0x50a28be6, 7); er = rotl(er, 10)
  br = fn5(br, cr, dr, er, ar, m[6], 0x50a28be6, 7); dr = rotl(dr, 10)
  ar = fn5(ar, br, cr, dr, er, m[15], 0x50a28be6, 8); cr = rotl(cr, 10)
  er = fn5(er, ar, br, cr, dr, m[8], 0x50a28be6, 11); br = rotl(br, 10)
  dr = fn5(dr, er, ar, br, cr, m[1], 0x50a28be6, 14); ar = rotl(ar, 10)
  cr = fn5(cr, dr, er, ar, br, m[10], 0x50a28be6, 14); er = rotl(er, 10)
  br = fn5(br, cr, dr, er, ar, m[3], 0x50a28be6, 12); dr = rotl(dr, 10)
  ar = fn5(ar, br, cr, dr, er, m[12], 0x50a28be6, 6); cr = rotl(cr, 10)

  // M'j = 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2
  // K' = 0x5c4dd124
  // S'j = 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11
  er = fn4(er, ar, br, cr, dr, m[6], 0x5c4dd124, 9); br = rotl(br, 10)
  dr = fn4(dr, er, ar, br, cr, m[11], 0x5c4dd124, 13); ar = rotl(ar, 10)
  cr = fn4(cr, dr, er, ar, br, m[3], 0x5c4dd124, 15); er = rotl(er, 10)
  br = fn4(br, cr, dr, er, ar, m[7], 0x5c4dd124, 7); dr = rotl(dr, 10)
  ar = fn4(ar, br, cr, dr, er, m[0], 0x5c4dd124, 12); cr = rotl(cr, 10)
  er = fn4(er, ar, br, cr, dr, m[13], 0x5c4dd124, 8); br = rotl(br, 10)
  dr = fn4(dr, er, ar, br, cr, m[5], 0x5c4dd124, 9); ar = rotl(ar, 10)
  cr = fn4(cr, dr, er, ar, br, m[10], 0x5c4dd124, 11); er = rotl(er, 10)
  br = fn4(br, cr, dr, er, ar, m[14], 0x5c4dd124, 7); dr = rotl(dr, 10)
  ar = fn4(ar, br, cr, dr, er, m[15], 0x5c4dd124, 7); cr = rotl(cr, 10)
  er = fn4(er, ar, br, cr, dr, m[8], 0x5c4dd124, 12); br = rotl(br, 10)
  dr = fn4(dr, er, ar, br, cr, m[12], 0x5c4dd124, 7); ar = rotl(ar, 10)
  cr = fn4(cr, dr, er, ar, br, m[4], 0x5c4dd124, 6); er = rotl(er, 10)
  br = fn4(br, cr, dr, er, ar, m[9], 0x5c4dd124, 15); dr = rotl(dr, 10)
  ar = fn4(ar, br, cr, dr, er, m[1], 0x5c4dd124, 13); cr = rotl(cr, 10)
  er = fn4(er, ar, br, cr, dr, m[2], 0x5c4dd124, 11); br = rotl(br, 10)

  // M'j = 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13
  // K' = 0x6d703ef3
  // S'j = 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5
  dr = fn3(dr, er, ar, br, cr, m[15], 0x6d703ef3, 9); ar = rotl(ar, 10)
  cr = fn3(cr, dr, er, ar, br, m[5], 0x6d703ef3, 7); er = rotl(er, 10)
  br = fn3(br, cr, dr, er, ar, m[1], 0x6d703ef3, 15); dr = rotl(dr, 10)
  ar = fn3(ar, br, cr, dr, er, m[3], 0x6d703ef3, 11); cr = rotl(cr, 10)
  er = fn3(er, ar, br, cr, dr, m[7], 0x6d703ef3, 8); br = rotl(br, 10)
  dr = fn3(dr, er, ar, br, cr, m[14], 0x6d703ef3, 6); ar = rotl(ar, 10)
  cr = fn3(cr, dr, er, ar, br, m[6], 0x6d703ef3, 6); er = rotl(er, 10)
  br = fn3(br, cr, dr, er, ar, m[9], 0x6d703ef3, 14); dr = rotl(dr, 10)
  ar = fn3(ar, br, cr, dr, er, m[11], 0x6d703ef3, 12); cr = rotl(cr, 10)
  er = fn3(er, ar, br, cr, dr, m[8], 0x6d703ef3, 13); br = rotl(br, 10)
  dr = fn3(dr, er, ar, br, cr, m[12], 0x6d703ef3, 5); ar = rotl(ar, 10)
  cr = fn3(cr, dr, er, ar, br, m[2], 0x6d703ef3, 14); er = rotl(er, 10)
  br = fn3(br, cr, dr, er, ar, m[10], 0x6d703ef3, 13); dr = rotl(dr, 10)
  ar = fn3(ar, br, cr, dr, er, m[0], 0x6d703ef3, 13); cr = rotl(cr, 10)
  er = fn3(er, ar, br, cr, dr, m[4], 0x6d703ef3, 7); br = rotl(br, 10)
  dr = fn3(dr, er, ar, br, cr, m[13], 0x6d703ef3, 5); ar = rotl(ar, 10)

  // M'j = 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14
  // K' = 0x7a6d76e9
  // S'j = 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8
  cr = fn2(cr, dr, er, ar, br, m[8], 0x7a6d76e9, 15); er = rotl(er, 10)
  br = fn2(br, cr, dr, er, ar, m[6], 0x7a6d76e9, 5); dr = rotl(dr, 10)
  ar = fn2(ar, br, cr, dr, er, m[4], 0x7a6d76e9, 8); cr = rotl(cr, 10)
  er = fn2(er, ar, br, cr, dr, m[1], 0x7a6d76e9, 11); br = rotl(br, 10)
  dr = fn2(dr, er, ar, br, cr, m[3], 0x7a6d76e9, 14); ar = rotl(ar, 10)
  cr = fn2(cr, dr, er, ar, br, m[11], 0x7a6d76e9, 14); er = rotl(er, 10)
  br = fn2(br, cr, dr, er, ar, m[15], 0x7a6d76e9, 6); dr = rotl(dr, 10)
  ar = fn2(ar, br, cr, dr, er, m[0], 0x7a6d76e9, 14); cr = rotl(cr, 10)
  er = fn2(er, ar, br, cr, dr, m[5], 0x7a6d76e9, 6); br = rotl(br, 10)
  dr = fn2(dr, er, ar, br, cr, m[12], 0x7a6d76e9, 9); ar = rotl(ar, 10)
  cr = fn2(cr, dr, er, ar, br, m[2], 0x7a6d76e9, 12); er = rotl(er, 10)
  br = fn2(br, cr, dr, er, ar, m[13], 0x7a6d76e9, 9); dr = rotl(dr, 10)
  ar = fn2(ar, br, cr, dr, er, m[9], 0x7a6d76e9, 12); cr = rotl(cr, 10)
  er = fn2(er, ar, br, cr, dr, m[7], 0x7a6d76e9, 5); br = rotl(br, 10)
  dr = fn2(dr, er, ar, br, cr, m[10], 0x7a6d76e9, 15); ar = rotl(ar, 10)
  cr = fn2(cr, dr, er, ar, br, m[14], 0x7a6d76e9, 8); er = rotl(er, 10)

  // M'j = 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
  // K' = 0x00000000
  // S'j = 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
  br = fn1(br, cr, dr, er, ar, m[12], 0x00000000, 8); dr = rotl(dr, 10)
  ar = fn1(ar, br, cr, dr, er, m[15], 0x00000000, 5); cr = rotl(cr, 10)
  er = fn1(er, ar, br, cr, dr, m[10], 0x00000000, 12); br = rotl(br, 10)
  dr = fn1(dr, er, ar, br, cr, m[4], 0x00000000, 9); ar = rotl(ar, 10)
  cr = fn1(cr, dr, er, ar, br, m[1], 0x00000000, 12); er = rotl(er, 10)
  br = fn1(br, cr, dr, er, ar, m[5], 0x00000000, 5); dr = rotl(dr, 10)
  ar = fn1(ar, br, cr, dr, er, m[8], 0x00000000, 14); cr = rotl(cr, 10)
  er = fn1(er, ar, br, cr, dr, m[7], 0x00000000, 6); br = rotl(br, 10)
  dr = fn1(dr, er, ar, br, cr, m[6], 0x00000000, 8); ar = rotl(ar, 10)
  cr = fn1(cr, dr, er, ar, br, m[2], 0x00000000, 13); er = rotl(er, 10)
  br = fn1(br, cr, dr, er, ar, m[13], 0x00000000, 6); dr = rotl(dr, 10)
  ar = fn1(ar, br, cr, dr, er, m[14], 0x00000000, 5); cr = rotl(cr, 10)
  er = fn1(er, ar, br, cr, dr, m[0], 0x00000000, 15); br = rotl(br, 10)
  dr = fn1(dr, er, ar, br, cr, m[3], 0x00000000, 13); ar = rotl(ar, 10)
  cr = fn1(cr, dr, er, ar, br, m[9], 0x00000000, 11); er = rotl(er, 10)
  br = fn1(br, cr, dr, er, ar, m[11], 0x00000000, 11); dr = rotl(dr, 10)

  // change state
  var t = (this._b + cl + dr) | 0
  this._b = (this._c + dl + er) | 0
  this._c = (this._d + el + ar) | 0
  this._d = (this._e + al + br) | 0
  this._e = (this._a + bl + cr) | 0
  this._a = t
}

RIPEMD160.prototype._digest = function () {
  // create padding and handle blocks
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 56) {
    this._block.fill(0, this._blockOffset, 64)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 56)
  this._block.writeUInt32LE(this._length[0], 56)
  this._block.writeUInt32LE(this._length[1], 60)
  this._update()

  // produce result
  var buffer = new Buffer(20)
  buffer.writeInt32LE(this._a, 0)
  buffer.writeInt32LE(this._b, 4)
  buffer.writeInt32LE(this._c, 8)
  buffer.writeInt32LE(this._d, 12)
  buffer.writeInt32LE(this._e, 16)
  return buffer
}

function rotl (x, n) {
  return (x << n) | (x >>> (32 - n))
}

function fn1 (a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + e) | 0
}

function fn2 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + e) | 0
}

function fn3 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b | (~c)) ^ d) + m + k) | 0, s) + e) | 0
}

function fn4 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + e) | 0
}

function fn5 (a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ (c | (~d))) + m + k) | 0, s) + e) | 0
}

module.exports = RIPEMD160

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var exports = module.exports = function SHA (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.sha = __webpack_require__(191)
exports.sha1 = __webpack_require__(192)
exports.sha224 = __webpack_require__(193)
exports.sha256 = __webpack_require__(88)
exports.sha384 = __webpack_require__(194)
exports.sha512 = __webpack_require__(89)


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 13/04/2017.
 */


var
    languages_array = __webpack_require__(53),
    ArrayUtils = __webpack_require__(18),
    languages_map = [],
    languagesClone_map,
    refresh = function () {
        languagesClone_map = JSON.parse(JSON.stringify(languages_map));
    };
languages_array.forEach(function (element) {
    var
        length_num = element.label.length,
        cel_array = languages_map[length_num];
    if (!cel_array) {
        cel_array = languages_map[length_num] = [];
    }
    cel_array.push(element);
});
refresh();

module.exports = {
    refresh: refresh,
    getRandomLanguageOfLength: function (length_num) {
        var
            possibleLanguages_array = languagesClone_map[length_num];
        if (!possibleLanguages_array) {
            return null;
        }
        if (possibleLanguages_array.length === 0) {
            possibleLanguages_array = languagesClone_map[length_num] = JSON.parse(JSON.stringify(languages_map[length_num]));
        }
        return ArrayUtils.getRandomCel(possibleLanguages_array, true);
    },
    getLanguageById: function (id_str) {
        return languages_array.filter(function (element) {
            return element.id === id_str;
        })[0];
    }
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 18/04/2017.
 */

var
    MovingObject = __webpack_require__(56),
    UserControls = __webpack_require__(55),
    QuestionPopup = __webpack_require__(52),
    IntervalManager = __webpack_require__(26),
    ScoreManager = __webpack_require__(27),
    CollisionManager = __webpack_require__(37),
    TimoutManager = __webpack_require__(36),
    SvgUtils = __webpack_require__(7),
    playSound = __webpack_require__(17),
    PauseManager = __webpack_require__(14),
    Configs = __webpack_require__(4),
    gridSize_num = Configs('stage').gridSize,
    started_bool = false,
    playerAvatar_obj,
    XLINK_STR = "http://www.w3.org/1999/xlink",
    defaultParams_obj = {
        attr: {
            width: "12",
            height: "12",
            transform: 'translate(-1,-1)',
            overflow: "visible"
        },
        attrNS: [
            {
                "nameSpace": XLINK_STR,
                "name": "href",
                value: "#avatar"
            }
        ]
    },
    lostParams_obj = {
        attr: {
            width: "30",
            height: "30",
            transform: 'translate(-10,-10)'
        },
        attrNS: [
            {
                nameSpace: XLINK_STR,
                name: "href",
                value: "#avatarLost"
            }
        ]
    },
    avatar;
module.exports = {
    isStarted: function () {
        return started_bool;
    },
    add: function () {
        var
            config = Configs('playerAvatar', true),
            restoreDefaultLook = function () {
                SvgUtils.applyAttributes(config.dom_el, defaultParams_obj.attr, defaultParams_obj.attrNS);
            };
        started_bool = false;
        config.dom_el = SvgUtils.createElement('use', defaultParams_obj.attr, defaultParams_obj.attrNS);
        Configs('stage').dom_el.appendChild(config.dom_el);
        config.changeFrame = function (frameId_str, duration_num) {
            SvgUtils.applyAttributes(config.dom_el, null, [
                {
                    nameSpace: XLINK_STR,
                    name: "href",
                    value: frameId_str
                }
            ]);
            if (duration_num) {
                TimoutManager.set(function () {
                    restoreDefaultLook();
                }, duration_num);
            }
        };
        config.setDirection = function (findPos) {
            var
                forbidden_obj,
                direction_obj,
                temptativeDirection_obj,
                temptativePosition_point;

            if (PauseManager.pauseButton) {
                temptativeDirection_obj = UserControls.getDirection(config.position);
                if (temptativeDirection_obj) {
                    temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                }

                var goodie = CollisionManager.isGoodie(temptativePosition_point);
                if (goodie) {
                    var remaining_num = goodie.remove();
                    if (remaining_num === 0) {
                        IntervalManager.clearAll();
                    }
                }
                forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
                if (forbidden_obj && forbidden_obj.open === true) {
                    forbidden_obj = null;
                }

                if (temptativeDirection_obj && !forbidden_obj) {
                    started_bool = true;
                    direction_obj = temptativeDirection_obj;
                    config.targetPosition = temptativePosition_point;
                } else {
                    if (
                        forbidden_obj &&
                        forbidden_obj.type === 'obstacle' &&
                        !forbidden_obj.blocked) {
                        PauseManager.playing = false;
                        config.changeFrame('#avatarQuestion');
                        QuestionPopup.open(forbidden_obj,
                            function (answer_bool) {
                                if (answer_bool !== undefined) {
                                    if (answer_bool) {
                                        config.restoreDefaultLook();
                                    } else {
                                        config.changeFrame('#avatarSad', 2000);
                                    }
                                    forbidden_obj.openDoor(answer_bool);
                                } else {
                                    config.changeFrame('#avatar');
                                }
                                PauseManager.playing = true;
                            }
                        );
                    } else if (forbidden_obj && forbidden_obj.blocked) {
                        playSound('mauvais_2');
                    }
                    direction_obj = null;
                }
                return (direction_obj);
            }
        };
        config.restoreDefaultLook = restoreDefaultLook;
        config.avatarLost = function () {
            started_bool = false;
            playSound('mauvais_1');
            SvgUtils.applyAttributes(config.dom_el, lostParams_obj.attr, lostParams_obj.attrNS);
        };
        playerAvatar_obj = MovingObject.add(config, true);
        playerAvatar_obj.update();
        return playerAvatar_obj;
    }
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 11/04/2017.
 *
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description displays the module with the question.
 *
 */


var
    Labels = __webpack_require__(13),
    SvgUtils = __webpack_require__(7),
    ArrayUtils = __webpack_require__(18),
    TimeoutManager = __webpack_require__(36),
    playSound = __webpack_require__(17),
    Config = __webpack_require__(4),
    UserControls = __webpack_require__(55),
    gameStage_obj = Config("stage"),
    gridSize_num = gameStage_obj.gridSize,
    callback_fun,
    popup_el,
    closePopup = function (correct_bool) {
        if (document.body.contains(popup_el)) {
            document.body.removeChild(popup_el);
        }
        callback_fun(correct_bool);
        open_bool = false;
    },
    openPopup = function (obstacle_obj, p_callback_fun) {
        if (!open_bool) {
            var
                INTERFACE_HEIGHT_NUM = 37,
                answers_array,
                margin_num = gridSize_num,
                answers_el = document.createElement('ul'),
                obstacleTL_point = SvgUtils.convertCoordinateFromSVGToDOM(
                    Config('game').dom_el,
                    {
                        x: obstacle_obj.position.x - margin_num,
                        y: INTERFACE_HEIGHT_NUM + obstacle_obj.position.y - margin_num
                    }
                ),
                obstacleTR_point = SvgUtils.convertCoordinateFromSVGToDOM(
                    Config('game').dom_el,
                    {
                        x: obstacle_obj.position.x + obstacle_obj.position.width + margin_num,
                        y: INTERFACE_HEIGHT_NUM + obstacle_obj.position.y + margin_num
                    }
                ),

                questionTitle_el = document.createElement('h2'),
                questionTitleText_node = document.createTextNode(Labels.getLabel('what_language')),
                placePopup = function () {
                    var size_rect = popup_el.getBoundingClientRect();
                    if (obstacle_obj.position.y < gameStage_obj.position.height / 2) {
                        popup_el.style.top = Math.round(obstacleTL_point.y) + 'px';
                        popup_el.classList.add('top');

                    } else {
                        popup_el.style.top = Math.round(-15 + obstacleTL_point.y - size_rect.height) + 'px';
                        popup_el.classList.add('bottom');
                    }
                    if (obstacle_obj.position.x < gameStage_obj.position.width / 2) {
                        popup_el.style.left = Math.round(obstacleTR_point.x) + 'px';
                        popup_el.classList.add('wipeFromRight');
                    } else {
                        popup_el.style.left = Math.round(obstacleTL_point.x - size_rect.width) + 'px';
                        popup_el.classList.add('wipeFromLeft');
                    }
                };
            open_bool = true;
            callback_fun = p_callback_fun;
            answers_array = buildAnswers(obstacle_obj);
            playSound('question');
            popup_el = document.createElement('div');
            questionTitle_el.appendChild(questionTitleText_node);
            document.body.appendChild(popup_el);
            popup_el.setAttribute('tabindex', 0);
            popup_el.focus();
            popup_el.appendChild(questionTitle_el);
            popup_el.appendChild(answers_el);

            popup_el.setAttribute('class', 'question_popup');
            questionTitle_el.setAttribute('class', 'question_title');
            answers_el.setAttribute('class', 'answers');
            answers_array.forEach(function (element, index) {
                var
                    answer_el = document.createElement('li'),
                    button_el = document.createElement('button'),
                    text_node = document.createTextNode(element.value);
                TimeoutManager.set(function () {
                    answers_el.appendChild(answer_el);
                }, 300 + 30 * index);

                answer_el.appendChild(button_el);
                button_el.appendChild(text_node);
                button_el.setAttribute('class', 'answer');
                button_el.setAttribute('tabindex', 0);
                button_el.addEventListener('click', function () {
                    closePopup(element.id === obstacle_obj.language);
                });
            });
            placePopup();
        }
    },
    open_bool = false,
    buildAnswers = function (obstacle_obj) {
        var languages_array = ArrayUtils.convertObjectToArray(Labels.getCurrentLanguages()),
            correctLanguage_obj = languages_array.filter(function (language_obj) {
                    return obstacle_obj.language === language_obj.id;
                }
            )[0],
            languageSelection_array;
        languages_array = ArrayUtils.remove(languages_array, correctLanguage_obj);
        languageSelection_array = ArrayUtils.pickRandomItems(languages_array, 4);
        correctLanguage_obj.correct = true;
        languageSelection_array.push(correctLanguage_obj);
        languageSelection_array = ArrayUtils.shuffle(languageSelection_array);
        return languageSelection_array;
    };


UserControls.onDirectionChange = function () {
    if (open_bool) {
        closePopup();
    }
};
module.exports = {
    /**
     * Removes the popup
     */
    remove: function () {
        callback_fun = function () {
        };
        closePopup();
    },
    /**
     * Opens the popup
     * @param {Obstacle} obstacle_obj - An Obstacle: the wall encounterd by the user
     * @param  {Function} p_callback_fun - The  function called when the user answers. The function receives a boolean as parameter, specifying wether or not the user answered correctly.
     *
     */
    open: function (obstacle_obj, p_callback_fun) {
        if (!open_bool) {
            openPopup(obstacle_obj, p_callback_fun);
        }
    }
};




/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = [{"id":"bg","label":"БЪЛГАРСКИ"},{"id":"cs","label":"čeština"},{"id":"da","label":"dansk"},{"id":"de","label":"Deutsch"},{"id":"et","label":"eesti"},{"id":"el","label":"ΕΛΛΗΝΙΚA"},{"id":"en","label":"English"},{"id":"es","label":"español"},{"id":"fr","label":"français"},{"id":"ga","label":"Gaeilge"},{"id":"it","label":"italiano"},{"id":"lv","label":"latviešu"},{"id":"lt","label":"lietuvių"},{"id":"hu","label":"magyar"},{"id":"hr","label":"hrvatski"},{"id":"mt","label":"Malti"},{"id":"nl","label":"Nederlands"},{"id":"pl","label":"polski"},{"id":"pt","label":"português"},{"id":"ro","label":"română"},{"id":"sk","label":"slovenčina"},{"id":"sl","label":"slovenščina"},{"id":"fi","label":"suomi"},{"id":"sv","label":"svenska"}]

/***/ }),
/* 54 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
module.exports = function (from_point, to_point, longestPath_bool) {
    var diffs_obj = {
        x: to_point.x - from_point.x,
        y: to_point.y - from_point.y
    };
    var xIsShorter_bool = Math.abs(diffs_obj.x) > Math.abs(diffs_obj.y);
    if (longestPath_bool) {
        xIsShorter_bool = !xIsShorter_bool;
    }

    if (xIsShorter_bool) {
        return {
            x: diffs_obj.x / Math.abs(diffs_obj.x),
            y: 0
        }
    } else {
        return {
            y: diffs_obj.y / Math.abs(diffs_obj.y),
            x: 0
        }
    }
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/22/2017.
 * @module
 * @description Aggregates inputs from keyboard, mouse and touch in order to give a consistent representation of user inputs.
 *
 */


/**
 * An object describing a point on x and y axis.
 * @typeDef {Object} Point
 * @property {number} x The position on the x-axis
 * @property {number} y The position on the y-axis
 */

/**
 * An object describing a direction on x and y axis.
 * @typeDef {Object} Direction
 * @property {number} x  An integer ranging from -1 to 1 expressing the direction on the x-axis (-1 = left, 1= right, 0=no move)
 * @property {number} y An integer ranging from -1 to 1 expressing the direction on the y-axis (-1 = up, 1= down, 0=no move)
 */





var MouseControl = __webpack_require__(107),
    KeyControls = __webpack_require__(106),
    SvgUtils = __webpack_require__(7),
    directionFromTo = __webpack_require__(54),
    Config = __webpack_require__(4),
    stage_el = Config("stage").dom_el,
    previousDirection_obj = {x: 0, y: 0},
    onDirectionChange_fun,
    addChangeInfo = function (newDirection_obj) {
        newDirection_obj.directionChange =
            previousDirection_obj &&
            (newDirection_obj.x !== 0 || newDirection_obj.y !== 0) &&
            (previousDirection_obj.x !== newDirection_obj.x ||
            previousDirection_obj.y !== newDirection_obj.y);
        if (newDirection_obj.directionChange && onDirectionChange_fun) {
            onDirectionChange_fun(newDirection_obj);
        }
        previousDirection_obj = newDirection_obj;
    };

module.exports = {
    /**
     * @property onDirectionChange
     * @description - Sets a callback called when the user changes direction.
     * @type {function}
     */

    set onDirectionChange(fun) {
        onDirectionChange_fun = fun;
    },
    /**
     * @description - Gets the direction indepependently of the device used
     * @param {Point} reference_point -The reference point used to get a direction when comparing with the mouse or touch position.
     * @returns {Direction} -An object containing the direction to follow.
     *
     */
    getDirection: function (reference_point) {
        var
            direction_obj;
        if (KeyControls.pressedKey) {
            direction_obj = {x: 0, y: 0};
            switch (KeyControls.pressedKey) {
                case "Right":
                case "ArrowRight":
                    direction_obj.x = 1;
                    break;
                case "Left":
                case "ArrowLeft":
                    direction_obj.x = -1;
                    break;
                case "Up":
                case "ArrowUp":
                    direction_obj.y = -1;
                    break;
                case "Down":
                case "ArrowDown":
                    direction_obj.y = 1;
                    break;
            }
            addChangeInfo(direction_obj);
            return direction_obj;
        }
        if (reference_point && stage_el && MouseControl.position) {

            var
                mouseSVG_point = SvgUtils.convertCoordinateFromDOMToSVG(stage_el, MouseControl.position),
                gridSize_num = Config('stage').gridSize;
            if (mouseSVG_point.x >= reference_point.x
                && mouseSVG_point.y >= reference_point.y
                && mouseSVG_point.x < reference_point.x + gridSize_num
                && mouseSVG_point.y < reference_point.y + gridSize_num) {
                direction_obj = {x: 0, y: 0};
            } else {
                direction_obj = directionFromTo({
                    x: reference_point.x + gridSize_num / 2,
                    y: reference_point.y + gridSize_num / 2
                }, mouseSVG_point);
            }
            addChangeInfo(direction_obj);
            return direction_obj;
        }

    }
};



/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/21/2017.
 */

var
    Config = __webpack_require__(4),
    IntervalManager = __webpack_require__(26),
    PauseManager = __webpack_require__(14),
    ObjectListManager = __webpack_require__(15),
    gridSize_num = Config('stage').gridSize,
    movingObjectsCounter_num = 0;


module.exports = {
    add: function (config) {
        var
            position_rect = config.position,
            move = function () {
                config.dom_el.setAttribute("x", position_rect.x);
                config.dom_el.setAttribute("y", position_rect.y);
            },
            updatePos = function (point) {
                for (var n in point) {
                    if (point.hasOwnProperty(n)) {
                        position_rect[n] = point[n];
                    }
                }
                if (config.dom_el) {
                    window.requestAnimationFrame(move);
                }
            },
            findPos = function (direction_obj, step_num) {
                var
                    setAxisPosition = function (propName_str) {
                        if (isNaN(direction_obj[propName_str])) {
                            direction_obj[propName_str] = 0;
                        }
                        return position_rect[propName_str] + (direction_obj[propName_str] * step_num);
                    };
                return {
                    x: setAxisPosition('x'),
                    y: setAxisPosition('y')
                };
            },
            incrementPos = function (direction_obj) {
                if (direction_obj) {
                    var newPos_point = findPos(direction_obj, config.speed * Boolean(PauseManager.playing));
                    updatePos(newPos_point);
                }
            },
            MoveManager = (function () {
                var
                    direction_obj,
                    setDirection = function () {
                        /*
                         @todo:avoid passing findPos as an argument
                         */
                        direction_obj = config.setDirection(findPos);
                    };
                return function () {
                    IntervalManager.set(function () {
                        var getNewDirection_bool = config.position.x % gridSize_num === 0 && config.position.y % gridSize_num === 0;
                        if (!direction_obj || getNewDirection_bool) {
                            setDirection();
                            incrementPos(direction_obj);
                        }
                        incrementPos(direction_obj);
                    }, 20);
                }
            }()),
            api = {
                get dom_el() {
                    return config.dom_el;
                },
                get config() {
                    return config;
                },
                get position() {
                    return config.position;
                },
                get targetPosition() {
                    return config.targetPosition;
                },
                set position(point) {
                    updatePos(point);
                },
                set moveDirection(point) {
                    moveTo(point);
                },
                update: function () {
                    updatePos(config.position);
                }
            };

        if (config.type === "playerAvatar") {
            ObjectListManager.createList('playerAvatar');
            ObjectListManager.pushItem('playerAvatar', api);
        }
        movingObjectsCounter_num++;
        window.setTimeout(MoveManager, movingObjectsCounter_num * 3);
        return api;
    }
};



/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(0);
var Reporter = __webpack_require__(20).Reporter;
var Buffer = __webpack_require__(1).Buffer;

function DecoderBuffer(base, options) {
  Reporter.call(this, options);
  if (!Buffer.isBuffer(base)) {
    this.error('Input not Buffer');
    return;
  }

  this.base = base;
  this.offset = 0;
  this.length = base.length;
}
inherits(DecoderBuffer, Reporter);
exports.DecoderBuffer = DecoderBuffer;

DecoderBuffer.prototype.save = function save() {
  return { offset: this.offset, reporter: Reporter.prototype.save.call(this) };
};

DecoderBuffer.prototype.restore = function restore(save) {
  // Return skipped data
  var res = new DecoderBuffer(this.base);
  res.offset = save.offset;
  res.length = this.offset;

  this.offset = save.offset;
  Reporter.prototype.restore.call(this, save.reporter);

  return res;
};

DecoderBuffer.prototype.isEmpty = function isEmpty() {
  return this.offset === this.length;
};

DecoderBuffer.prototype.readUInt8 = function readUInt8(fail) {
  if (this.offset + 1 <= this.length)
    return this.base.readUInt8(this.offset++, true);
  else
    return this.error(fail || 'DecoderBuffer overrun');
}

DecoderBuffer.prototype.skip = function skip(bytes, fail) {
  if (!(this.offset + bytes <= this.length))
    return this.error(fail || 'DecoderBuffer overrun');

  var res = new DecoderBuffer(this.base);

  // Share reporter state
  res._reporterState = this._reporterState;

  res.offset = this.offset;
  res.length = this.offset + bytes;
  this.offset += bytes;
  return res;
}

DecoderBuffer.prototype.raw = function raw(save) {
  return this.base.slice(save ? save.offset : this.offset, this.length);
}

function EncoderBuffer(value, reporter) {
  if (Array.isArray(value)) {
    this.length = 0;
    this.value = value.map(function(item) {
      if (!(item instanceof EncoderBuffer))
        item = new EncoderBuffer(item, reporter);
      this.length += item.length;
      return item;
    }, this);
  } else if (typeof value === 'number') {
    if (!(0 <= value && value <= 0xff))
      return reporter.error('non-byte EncoderBuffer value');
    this.value = value;
    this.length = 1;
  } else if (typeof value === 'string') {
    this.value = value;
    this.length = Buffer.byteLength(value);
  } else if (Buffer.isBuffer(value)) {
    this.value = value;
    this.length = value.length;
  } else {
    return reporter.error('Unsupported type: ' + typeof value);
  }
}
exports.EncoderBuffer = EncoderBuffer;

EncoderBuffer.prototype.join = function join(out, offset) {
  if (!out)
    out = new Buffer(this.length);
  if (!offset)
    offset = 0;

  if (this.length === 0)
    return out;

  if (Array.isArray(this.value)) {
    this.value.forEach(function(item) {
      item.join(out, offset);
      offset += item.length;
    });
  } else {
    if (typeof this.value === 'number')
      out[offset] = this.value;
    else if (typeof this.value === 'string')
      out.write(this.value, offset);
    else if (Buffer.isBuffer(this.value))
      this.value.copy(out, offset);
    offset += this.length;
  }

  return out;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var constants = exports;

// Helper
constants._reverse = function reverse(map) {
  var res = {};

  Object.keys(map).forEach(function(key) {
    // Convert key to integer if it is stringified
    if ((key | 0) == key)
      key = key | 0;

    var value = map[key];
    res[value] = key;
  });

  return res;
};

constants.der = __webpack_require__(113);


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(0);

var asn1 = __webpack_require__(19);
var base = asn1.base;
var bignum = asn1.bignum;

// Import DER constants
var der = asn1.constants.der;

function DERDecoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  // Construct base tree
  this.tree = new DERNode();
  this.tree._init(entity.body);
};
module.exports = DERDecoder;

DERDecoder.prototype.decode = function decode(data, options) {
  if (!(data instanceof base.DecoderBuffer))
    data = new base.DecoderBuffer(data, options);

  return this.tree._decode(data, options);
};

// Tree methods

function DERNode(parent) {
  base.Node.call(this, 'der', parent);
}
inherits(DERNode, base.Node);

DERNode.prototype._peekTag = function peekTag(buffer, tag, any) {
  if (buffer.isEmpty())
    return false;

  var state = buffer.save();
  var decodedTag = derDecodeTag(buffer, 'Failed to peek tag: "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  buffer.restore(state);

  return decodedTag.tag === tag || decodedTag.tagStr === tag ||
    (decodedTag.tagStr + 'of') === tag || any;
};

DERNode.prototype._decodeTag = function decodeTag(buffer, tag, any) {
  var decodedTag = derDecodeTag(buffer,
                                'Failed to decode tag of "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  var len = derDecodeLen(buffer,
                         decodedTag.primitive,
                         'Failed to get length of "' + tag + '"');

  // Failure
  if (buffer.isError(len))
    return len;

  if (!any &&
      decodedTag.tag !== tag &&
      decodedTag.tagStr !== tag &&
      decodedTag.tagStr + 'of' !== tag) {
    return buffer.error('Failed to match tag: "' + tag + '"');
  }

  if (decodedTag.primitive || len !== null)
    return buffer.skip(len, 'Failed to match body of: "' + tag + '"');

  // Indefinite length... find END tag
  var state = buffer.save();
  var res = this._skipUntilEnd(
      buffer,
      'Failed to skip indefinite length body: "' + this.tag + '"');
  if (buffer.isError(res))
    return res;

  len = buffer.offset - state.offset;
  buffer.restore(state);
  return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
};

DERNode.prototype._skipUntilEnd = function skipUntilEnd(buffer, fail) {
  while (true) {
    var tag = derDecodeTag(buffer, fail);
    if (buffer.isError(tag))
      return tag;
    var len = derDecodeLen(buffer, tag.primitive, fail);
    if (buffer.isError(len))
      return len;

    var res;
    if (tag.primitive || len !== null)
      res = buffer.skip(len)
    else
      res = this._skipUntilEnd(buffer, fail);

    // Failure
    if (buffer.isError(res))
      return res;

    if (tag.tagStr === 'end')
      break;
  }
};

DERNode.prototype._decodeList = function decodeList(buffer, tag, decoder,
                                                    options) {
  var result = [];
  while (!buffer.isEmpty()) {
    var possibleEnd = this._peekTag(buffer, 'end');
    if (buffer.isError(possibleEnd))
      return possibleEnd;

    var res = decoder.decode(buffer, 'der', options);
    if (buffer.isError(res) && possibleEnd)
      break;
    result.push(res);
  }
  return result;
};

DERNode.prototype._decodeStr = function decodeStr(buffer, tag) {
  if (tag === 'bitstr') {
    var unused = buffer.readUInt8();
    if (buffer.isError(unused))
      return unused;
    return { unused: unused, data: buffer.raw() };
  } else if (tag === 'bmpstr') {
    var raw = buffer.raw();
    if (raw.length % 2 === 1)
      return buffer.error('Decoding of string type: bmpstr length mismatch');

    var str = '';
    for (var i = 0; i < raw.length / 2; i++) {
      str += String.fromCharCode(raw.readUInt16BE(i * 2));
    }
    return str;
  } else if (tag === 'numstr') {
    var numstr = buffer.raw().toString('ascii');
    if (!this._isNumstr(numstr)) {
      return buffer.error('Decoding of string type: ' +
                          'numstr unsupported characters');
    }
    return numstr;
  } else if (tag === 'octstr') {
    return buffer.raw();
  } else if (tag === 'objDesc') {
    return buffer.raw();
  } else if (tag === 'printstr') {
    var printstr = buffer.raw().toString('ascii');
    if (!this._isPrintstr(printstr)) {
      return buffer.error('Decoding of string type: ' +
                          'printstr unsupported characters');
    }
    return printstr;
  } else if (/str$/.test(tag)) {
    return buffer.raw().toString();
  } else {
    return buffer.error('Decoding of string type: ' + tag + ' unsupported');
  }
};

DERNode.prototype._decodeObjid = function decodeObjid(buffer, values, relative) {
  var result;
  var identifiers = [];
  var ident = 0;
  while (!buffer.isEmpty()) {
    var subident = buffer.readUInt8();
    ident <<= 7;
    ident |= subident & 0x7f;
    if ((subident & 0x80) === 0) {
      identifiers.push(ident);
      ident = 0;
    }
  }
  if (subident & 0x80)
    identifiers.push(ident);

  var first = (identifiers[0] / 40) | 0;
  var second = identifiers[0] % 40;

  if (relative)
    result = identifiers;
  else
    result = [first, second].concat(identifiers.slice(1));

  if (values) {
    var tmp = values[result.join(' ')];
    if (tmp === undefined)
      tmp = values[result.join('.')];
    if (tmp !== undefined)
      result = tmp;
  }

  return result;
};

DERNode.prototype._decodeTime = function decodeTime(buffer, tag) {
  var str = buffer.raw().toString();
  if (tag === 'gentime') {
    var year = str.slice(0, 4) | 0;
    var mon = str.slice(4, 6) | 0;
    var day = str.slice(6, 8) | 0;
    var hour = str.slice(8, 10) | 0;
    var min = str.slice(10, 12) | 0;
    var sec = str.slice(12, 14) | 0;
  } else if (tag === 'utctime') {
    var year = str.slice(0, 2) | 0;
    var mon = str.slice(2, 4) | 0;
    var day = str.slice(4, 6) | 0;
    var hour = str.slice(6, 8) | 0;
    var min = str.slice(8, 10) | 0;
    var sec = str.slice(10, 12) | 0;
    if (year < 70)
      year = 2000 + year;
    else
      year = 1900 + year;
  } else {
    return buffer.error('Decoding ' + tag + ' time is not supported yet');
  }

  return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
};

DERNode.prototype._decodeNull = function decodeNull(buffer) {
  return null;
};

DERNode.prototype._decodeBool = function decodeBool(buffer) {
  var res = buffer.readUInt8();
  if (buffer.isError(res))
    return res;
  else
    return res !== 0;
};

DERNode.prototype._decodeInt = function decodeInt(buffer, values) {
  // Bigint, return as it is (assume big endian)
  var raw = buffer.raw();
  var res = new bignum(raw);

  if (values)
    res = values[res.toString(10)] || res;

  return res;
};

DERNode.prototype._use = function use(entity, obj) {
  if (typeof entity === 'function')
    entity = entity(obj);
  return entity._getDecoder('der').tree;
};

// Utility methods

function derDecodeTag(buf, fail) {
  var tag = buf.readUInt8(fail);
  if (buf.isError(tag))
    return tag;

  var cls = der.tagClass[tag >> 6];
  var primitive = (tag & 0x20) === 0;

  // Multi-octet tag - load
  if ((tag & 0x1f) === 0x1f) {
    var oct = tag;
    tag = 0;
    while ((oct & 0x80) === 0x80) {
      oct = buf.readUInt8(fail);
      if (buf.isError(oct))
        return oct;

      tag <<= 7;
      tag |= oct & 0x7f;
    }
  } else {
    tag &= 0x1f;
  }
  var tagStr = der.tag[tag];

  return {
    cls: cls,
    primitive: primitive,
    tag: tag,
    tagStr: tagStr
  };
}

function derDecodeLen(buf, primitive, fail) {
  var len = buf.readUInt8(fail);
  if (buf.isError(len))
    return len;

  // Indefinite form
  if (!primitive && len === 0x80)
    return null;

  // Definite form
  if ((len & 0x80) === 0) {
    // Short form
    return len;
  }

  // Long form
  var num = len & 0x7f;
  if (num > 4)
    return buf.error('length octect is too long');

  len = 0;
  for (var i = 0; i < num; i++) {
    len <<= 8;
    var j = buf.readUInt8(fail);
    if (buf.isError(j))
      return j;
    len |= j;
  }

  return len;
}


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(0);
var Buffer = __webpack_require__(1).Buffer;

var asn1 = __webpack_require__(19);
var base = asn1.base;

// Import DER constants
var der = asn1.constants.der;

function DEREncoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  // Construct base tree
  this.tree = new DERNode();
  this.tree._init(entity.body);
};
module.exports = DEREncoder;

DEREncoder.prototype.encode = function encode(data, reporter) {
  return this.tree._encode(data, reporter).join();
};

// Tree methods

function DERNode(parent) {
  base.Node.call(this, 'der', parent);
}
inherits(DERNode, base.Node);

DERNode.prototype._encodeComposite = function encodeComposite(tag,
                                                              primitive,
                                                              cls,
                                                              content) {
  var encodedTag = encodeTag(tag, primitive, cls, this.reporter);

  // Short form
  if (content.length < 0x80) {
    var header = new Buffer(2);
    header[0] = encodedTag;
    header[1] = content.length;
    return this._createEncoderBuffer([ header, content ]);
  }

  // Long form
  // Count octets required to store length
  var lenOctets = 1;
  for (var i = content.length; i >= 0x100; i >>= 8)
    lenOctets++;

  var header = new Buffer(1 + 1 + lenOctets);
  header[0] = encodedTag;
  header[1] = 0x80 | lenOctets;

  for (var i = 1 + lenOctets, j = content.length; j > 0; i--, j >>= 8)
    header[i] = j & 0xff;

  return this._createEncoderBuffer([ header, content ]);
};

DERNode.prototype._encodeStr = function encodeStr(str, tag) {
  if (tag === 'bitstr') {
    return this._createEncoderBuffer([ str.unused | 0, str.data ]);
  } else if (tag === 'bmpstr') {
    var buf = new Buffer(str.length * 2);
    for (var i = 0; i < str.length; i++) {
      buf.writeUInt16BE(str.charCodeAt(i), i * 2);
    }
    return this._createEncoderBuffer(buf);
  } else if (tag === 'numstr') {
    if (!this._isNumstr(str)) {
      return this.reporter.error('Encoding of string type: numstr supports ' +
                                 'only digits and space');
    }
    return this._createEncoderBuffer(str);
  } else if (tag === 'printstr') {
    if (!this._isPrintstr(str)) {
      return this.reporter.error('Encoding of string type: printstr supports ' +
                                 'only latin upper and lower case letters, ' +
                                 'digits, space, apostrophe, left and rigth ' +
                                 'parenthesis, plus sign, comma, hyphen, ' +
                                 'dot, slash, colon, equal sign, ' +
                                 'question mark');
    }
    return this._createEncoderBuffer(str);
  } else if (/str$/.test(tag)) {
    return this._createEncoderBuffer(str);
  } else if (tag === 'objDesc') {
    return this._createEncoderBuffer(str);
  } else {
    return this.reporter.error('Encoding of string type: ' + tag +
                               ' unsupported');
  }
};

DERNode.prototype._encodeObjid = function encodeObjid(id, values, relative) {
  if (typeof id === 'string') {
    if (!values)
      return this.reporter.error('string objid given, but no values map found');
    if (!values.hasOwnProperty(id))
      return this.reporter.error('objid not found in values map');
    id = values[id].split(/[\s\.]+/g);
    for (var i = 0; i < id.length; i++)
      id[i] |= 0;
  } else if (Array.isArray(id)) {
    id = id.slice();
    for (var i = 0; i < id.length; i++)
      id[i] |= 0;
  }

  if (!Array.isArray(id)) {
    return this.reporter.error('objid() should be either array or string, ' +
                               'got: ' + JSON.stringify(id));
  }

  if (!relative) {
    if (id[1] >= 40)
      return this.reporter.error('Second objid identifier OOB');
    id.splice(0, 2, id[0] * 40 + id[1]);
  }

  // Count number of octets
  var size = 0;
  for (var i = 0; i < id.length; i++) {
    var ident = id[i];
    for (size++; ident >= 0x80; ident >>= 7)
      size++;
  }

  var objid = new Buffer(size);
  var offset = objid.length - 1;
  for (var i = id.length - 1; i >= 0; i--) {
    var ident = id[i];
    objid[offset--] = ident & 0x7f;
    while ((ident >>= 7) > 0)
      objid[offset--] = 0x80 | (ident & 0x7f);
  }

  return this._createEncoderBuffer(objid);
};

function two(num) {
  if (num < 10)
    return '0' + num;
  else
    return num;
}

DERNode.prototype._encodeTime = function encodeTime(time, tag) {
  var str;
  var date = new Date(time);

  if (tag === 'gentime') {
    str = [
      two(date.getFullYear()),
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  } else if (tag === 'utctime') {
    str = [
      two(date.getFullYear() % 100),
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  } else {
    this.reporter.error('Encoding ' + tag + ' time is not supported yet');
  }

  return this._encodeStr(str, 'octstr');
};

DERNode.prototype._encodeNull = function encodeNull() {
  return this._createEncoderBuffer('');
};

DERNode.prototype._encodeInt = function encodeInt(num, values) {
  if (typeof num === 'string') {
    if (!values)
      return this.reporter.error('String int or enum given, but no values map');
    if (!values.hasOwnProperty(num)) {
      return this.reporter.error('Values map doesn\'t contain: ' +
                                 JSON.stringify(num));
    }
    num = values[num];
  }

  // Bignum, assume big endian
  if (typeof num !== 'number' && !Buffer.isBuffer(num)) {
    var numArray = num.toArray();
    if (!num.sign && numArray[0] & 0x80) {
      numArray.unshift(0);
    }
    num = new Buffer(numArray);
  }

  if (Buffer.isBuffer(num)) {
    var size = num.length;
    if (num.length === 0)
      size++;

    var out = new Buffer(size);
    num.copy(out);
    if (num.length === 0)
      out[0] = 0
    return this._createEncoderBuffer(out);
  }

  if (num < 0x80)
    return this._createEncoderBuffer(num);

  if (num < 0x100)
    return this._createEncoderBuffer([0, num]);

  var size = 1;
  for (var i = num; i >= 0x100; i >>= 8)
    size++;

  var out = new Array(size);
  for (var i = out.length - 1; i >= 0; i--) {
    out[i] = num & 0xff;
    num >>= 8;
  }
  if(out[0] & 0x80) {
    out.unshift(0);
  }

  return this._createEncoderBuffer(new Buffer(out));
};

DERNode.prototype._encodeBool = function encodeBool(value) {
  return this._createEncoderBuffer(value ? 0xff : 0);
};

DERNode.prototype._use = function use(entity, obj) {
  if (typeof entity === 'function')
    entity = entity(obj);
  return entity._getEncoder('der').tree;
};

DERNode.prototype._skipDefault = function skipDefault(dataBuffer, reporter, parent) {
  var state = this._baseState;
  var i;
  if (state['default'] === null)
    return false;

  var data = dataBuffer.join();
  if (state.defaultBuffer === undefined)
    state.defaultBuffer = this._encodeValue(state['default'], reporter, parent).join();

  if (data.length !== state.defaultBuffer.length)
    return false;

  for (i=0; i < data.length; i++)
    if (data[i] !== state.defaultBuffer[i])
      return false;

  return true;
};

// Utility methods

function encodeTag(tag, primitive, cls, reporter) {
  var res;

  if (tag === 'seqof')
    tag = 'seq';
  else if (tag === 'setof')
    tag = 'set';

  if (der.tagByName.hasOwnProperty(tag))
    res = der.tagByName[tag];
  else if (typeof tag === 'number' && (tag | 0) === tag)
    res = tag;
  else
    return reporter.error('Unknown tag: ' + tag);

  if (res >= 0x1f)
    return reporter.error('Multi-octet tag encoding unsupported');

  if (!primitive)
    res |= 0x20;

  res |= (der.tagClassByName[cls || 'universal'] << 6);

  return res;
}


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var r;

module.exports = function rand(len) {
  if (!r)
    r = new Rand(null);

  return r.generate(len);
};

function Rand(rand) {
  this.rand = rand;
}
module.exports.Rand = Rand;

Rand.prototype.generate = function generate(len) {
  return this._rand(len);
};

// Emulate crypto API using randy
Rand.prototype._rand = function _rand(n) {
  if (this.rand.getBytes)
    return this.rand.getBytes(n);

  var res = new Uint8Array(n);
  for (var i = 0; i < res.length; i++)
    res[i] = this.rand.getByte();
  return res;
};

if (typeof self === 'object') {
  if (self.crypto && self.crypto.getRandomValues) {
    // Modern browsers
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.crypto.getRandomValues(arr);
      return arr;
    };
  } else if (self.msCrypto && self.msCrypto.getRandomValues) {
    // IE
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.msCrypto.getRandomValues(arr);
      return arr;
    };

  // Safari's WebWorkers do not have `crypto`
  } else if (typeof window === 'object') {
    // Old junk
    Rand.prototype._rand = function() {
      throw new Error('Not implemented yet');
    };
  }
} else {
  // Node.js or Web worker with no crypto support
  try {
    var crypto = __webpack_require__(203);
    if (typeof crypto.randomBytes !== 'function')
      throw new Error('Not supported');

    Rand.prototype._rand = function _rand(n) {
      return crypto.randomBytes(n);
    };
  } catch (e) {
  }
}


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var aes = __webpack_require__(28)
var Buffer = __webpack_require__(2).Buffer
var Transform = __webpack_require__(9)
var inherits = __webpack_require__(0)
var GHASH = __webpack_require__(121)
var xor = __webpack_require__(21)
var incr32 = __webpack_require__(63)

function xorTest (a, b) {
  var out = 0
  if (a.length !== b.length) out++

  var len = Math.min(a.length, b.length)
  for (var i = 0; i < len; ++i) {
    out += (a[i] ^ b[i])
  }

  return out
}

function calcIv (self, iv, ck) {
  if (iv.length === 12) {
    self._finID = Buffer.concat([iv, Buffer.from([0, 0, 0, 1])])
    return Buffer.concat([iv, Buffer.from([0, 0, 0, 2])])
  }
  var ghash = new GHASH(ck)
  var len = iv.length
  var toPad = len % 16
  ghash.update(iv)
  if (toPad) {
    toPad = 16 - toPad
    ghash.update(Buffer.alloc(toPad, 0))
  }
  ghash.update(Buffer.alloc(8, 0))
  var ivBits = len * 8
  var tail = Buffer.alloc(8)
  tail.writeUIntBE(ivBits, 0, 8)
  ghash.update(tail)
  self._finID = ghash.state
  var out = Buffer.from(self._finID)
  incr32(out)
  return out
}
function StreamCipher (mode, key, iv, decrypt) {
  Transform.call(this)

  var h = Buffer.alloc(4, 0)

  this._cipher = new aes.AES(key)
  var ck = this._cipher.encryptBlock(h)
  this._ghash = new GHASH(ck)
  iv = calcIv(this, iv, ck)

  this._prev = Buffer.from(iv)
  this._cache = Buffer.allocUnsafe(0)
  this._secCache = Buffer.allocUnsafe(0)
  this._decrypt = decrypt
  this._alen = 0
  this._len = 0
  this._mode = mode

  this._authTag = null
  this._called = false
}

inherits(StreamCipher, Transform)

StreamCipher.prototype._update = function (chunk) {
  if (!this._called && this._alen) {
    var rump = 16 - (this._alen % 16)
    if (rump < 16) {
      rump = Buffer.alloc(rump, 0)
      this._ghash.update(rump)
    }
  }

  this._called = true
  var out = this._mode.encrypt(this, chunk)
  if (this._decrypt) {
    this._ghash.update(chunk)
  } else {
    this._ghash.update(out)
  }
  this._len += chunk.length
  return out
}

StreamCipher.prototype._final = function () {
  if (this._decrypt && !this._authTag) throw new Error('Unsupported state or unable to authenticate data')

  var tag = xor(this._ghash.final(this._alen * 8, this._len * 8), this._cipher.encryptBlock(this._finID))
  if (this._decrypt && xorTest(tag, this._authTag)) throw new Error('Unsupported state or unable to authenticate data')

  this._authTag = tag
  this._cipher.scrub()
}

StreamCipher.prototype.getAuthTag = function getAuthTag () {
  if (this._decrypt || !Buffer.isBuffer(this._authTag)) throw new Error('Attempting to get auth tag in unsupported state')

  return this._authTag
}

StreamCipher.prototype.setAuthTag = function setAuthTag (tag) {
  if (!this._decrypt) throw new Error('Attempting to set auth tag in unsupported state')

  this._authTag = tag
}

StreamCipher.prototype.setAAD = function setAAD (buf) {
  if (this._called) throw new Error('Attempting to set AAD in unsupported state')

  this._ghash.update(buf)
  this._alen += buf.length
}

module.exports = StreamCipher


/***/ }),
/* 63 */
/***/ (function(module, exports) {

function incr32 (iv) {
  var len = iv.length
  var item
  while (len--) {
    item = iv.readUInt8(len)
    if (item === 255) {
      iv.writeUInt8(0, len)
    } else {
      item++
      iv.writeUInt8(item, len)
      break
    }
  }
}
module.exports = incr32


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var xor = __webpack_require__(21)
var Buffer = __webpack_require__(2).Buffer
var incr32 = __webpack_require__(63)

function getBlock (self) {
  var out = self._cipher.encryptBlockRaw(self._prev)
  incr32(self._prev)
  return out
}

var blockSize = 16
exports.encrypt = function (self, chunk) {
  var chunkNum = Math.ceil(chunk.length / blockSize)
  var start = self._cache.length
  self._cache = Buffer.concat([
    self._cache,
    Buffer.allocUnsafe(chunkNum * blockSize)
  ])
  for (var i = 0; i < chunkNum; i++) {
    var out = getBlock(self)
    var offset = start + i * blockSize
    self._cache.writeUInt32BE(out[0], offset + 0)
    self._cache.writeUInt32BE(out[1], offset + 4)
    self._cache.writeUInt32BE(out[2], offset + 8)
    self._cache.writeUInt32BE(out[3], offset + 12)
  }
  var pad = self._cache.slice(0, chunk.length)
  self._cache = self._cache.slice(chunk.length)
  return xor(chunk, pad)
}


/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = {"aes-128-ecb":{"cipher":"AES","key":128,"iv":0,"mode":"ECB","type":"block"},"aes-192-ecb":{"cipher":"AES","key":192,"iv":0,"mode":"ECB","type":"block"},"aes-256-ecb":{"cipher":"AES","key":256,"iv":0,"mode":"ECB","type":"block"},"aes-128-cbc":{"cipher":"AES","key":128,"iv":16,"mode":"CBC","type":"block"},"aes-192-cbc":{"cipher":"AES","key":192,"iv":16,"mode":"CBC","type":"block"},"aes-256-cbc":{"cipher":"AES","key":256,"iv":16,"mode":"CBC","type":"block"},"aes128":{"cipher":"AES","key":128,"iv":16,"mode":"CBC","type":"block"},"aes192":{"cipher":"AES","key":192,"iv":16,"mode":"CBC","type":"block"},"aes256":{"cipher":"AES","key":256,"iv":16,"mode":"CBC","type":"block"},"aes-128-cfb":{"cipher":"AES","key":128,"iv":16,"mode":"CFB","type":"stream"},"aes-192-cfb":{"cipher":"AES","key":192,"iv":16,"mode":"CFB","type":"stream"},"aes-256-cfb":{"cipher":"AES","key":256,"iv":16,"mode":"CFB","type":"stream"},"aes-128-cfb8":{"cipher":"AES","key":128,"iv":16,"mode":"CFB8","type":"stream"},"aes-192-cfb8":{"cipher":"AES","key":192,"iv":16,"mode":"CFB8","type":"stream"},"aes-256-cfb8":{"cipher":"AES","key":256,"iv":16,"mode":"CFB8","type":"stream"},"aes-128-cfb1":{"cipher":"AES","key":128,"iv":16,"mode":"CFB1","type":"stream"},"aes-192-cfb1":{"cipher":"AES","key":192,"iv":16,"mode":"CFB1","type":"stream"},"aes-256-cfb1":{"cipher":"AES","key":256,"iv":16,"mode":"CFB1","type":"stream"},"aes-128-ofb":{"cipher":"AES","key":128,"iv":16,"mode":"OFB","type":"stream"},"aes-192-ofb":{"cipher":"AES","key":192,"iv":16,"mode":"OFB","type":"stream"},"aes-256-ofb":{"cipher":"AES","key":256,"iv":16,"mode":"OFB","type":"stream"},"aes-128-ctr":{"cipher":"AES","key":128,"iv":16,"mode":"CTR","type":"stream"},"aes-192-ctr":{"cipher":"AES","key":192,"iv":16,"mode":"CTR","type":"stream"},"aes-256-ctr":{"cipher":"AES","key":256,"iv":16,"mode":"CTR","type":"stream"},"aes-128-gcm":{"cipher":"AES","key":128,"iv":12,"mode":"GCM","type":"auth"},"aes-192-gcm":{"cipher":"AES","key":192,"iv":12,"mode":"GCM","type":"auth"},"aes-256-gcm":{"cipher":"AES","key":256,"iv":12,"mode":"GCM","type":"auth"}}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var aes = __webpack_require__(28)
var Buffer = __webpack_require__(2).Buffer
var Transform = __webpack_require__(9)
var inherits = __webpack_require__(0)

function StreamCipher (mode, key, iv, decrypt) {
  Transform.call(this)

  this._cipher = new aes.AES(key)
  this._prev = Buffer.from(iv)
  this._cache = Buffer.allocUnsafe(0)
  this._secCache = Buffer.allocUnsafe(0)
  this._decrypt = decrypt
  this._mode = mode
}

inherits(StreamCipher, Transform)

StreamCipher.prototype._update = function (chunk) {
  return this._mode.encrypt(this, chunk, this._decrypt)
}

StreamCipher.prototype._final = function () {
  this._cipher.scrub()
}

module.exports = StreamCipher


/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = {"sha224WithRSAEncryption":{"sign":"rsa","hash":"sha224","id":"302d300d06096086480165030402040500041c"},"RSA-SHA224":{"sign":"ecdsa/rsa","hash":"sha224","id":"302d300d06096086480165030402040500041c"},"sha256WithRSAEncryption":{"sign":"rsa","hash":"sha256","id":"3031300d060960864801650304020105000420"},"RSA-SHA256":{"sign":"ecdsa/rsa","hash":"sha256","id":"3031300d060960864801650304020105000420"},"sha384WithRSAEncryption":{"sign":"rsa","hash":"sha384","id":"3041300d060960864801650304020205000430"},"RSA-SHA384":{"sign":"ecdsa/rsa","hash":"sha384","id":"3041300d060960864801650304020205000430"},"sha512WithRSAEncryption":{"sign":"rsa","hash":"sha512","id":"3051300d060960864801650304020305000440"},"RSA-SHA512":{"sign":"ecdsa/rsa","hash":"sha512","id":"3051300d060960864801650304020305000440"},"RSA-SHA1":{"sign":"rsa","hash":"sha1","id":"3021300906052b0e03021a05000414"},"ecdsa-with-SHA1":{"sign":"ecdsa","hash":"sha1","id":""},"sha256":{"sign":"ecdsa","hash":"sha256","id":""},"sha224":{"sign":"ecdsa","hash":"sha224","id":""},"sha384":{"sign":"ecdsa","hash":"sha384","id":""},"sha512":{"sign":"ecdsa","hash":"sha512","id":""},"DSA-SHA":{"sign":"dsa","hash":"sha1","id":""},"DSA-SHA1":{"sign":"dsa","hash":"sha1","id":""},"DSA":{"sign":"dsa","hash":"sha1","id":""},"DSA-WITH-SHA224":{"sign":"dsa","hash":"sha224","id":""},"DSA-SHA224":{"sign":"dsa","hash":"sha224","id":""},"DSA-WITH-SHA256":{"sign":"dsa","hash":"sha256","id":""},"DSA-SHA256":{"sign":"dsa","hash":"sha256","id":""},"DSA-WITH-SHA384":{"sign":"dsa","hash":"sha384","id":""},"DSA-SHA384":{"sign":"dsa","hash":"sha384","id":""},"DSA-WITH-SHA512":{"sign":"dsa","hash":"sha512","id":""},"DSA-SHA512":{"sign":"dsa","hash":"sha512","id":""},"DSA-RIPEMD160":{"sign":"dsa","hash":"rmd160","id":""},"ripemd160WithRSA":{"sign":"rsa","hash":"rmd160","id":"3021300906052b2403020105000414"},"RSA-RIPEMD160":{"sign":"rsa","hash":"rmd160","id":"3021300906052b2403020105000414"},"md5WithRSAEncryption":{"sign":"rsa","hash":"md5","id":"3020300c06082a864886f70d020505000410"},"RSA-MD5":{"sign":"rsa","hash":"md5","id":"3020300c06082a864886f70d020505000410"}}

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = {"1.3.132.0.10":"secp256k1","1.3.132.0.33":"p224","1.2.840.10045.3.1.1":"p192","1.2.840.10045.3.1.7":"p256","1.3.132.0.34":"p384","1.3.132.0.35":"p521"}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var inherits = __webpack_require__(0)
var Legacy = __webpack_require__(137)
var Base = __webpack_require__(9)
var Buffer = __webpack_require__(2).Buffer
var md5 = __webpack_require__(41)
var RIPEMD160 = __webpack_require__(48)

var sha = __webpack_require__(49)

var ZEROS = Buffer.alloc(128)

function Hmac (alg, key) {
  Base.call(this, 'digest')
  if (typeof key === 'string') {
    key = Buffer.from(key)
  }

  var blocksize = (alg === 'sha512' || alg === 'sha384') ? 128 : 64

  this._alg = alg
  this._key = key
  if (key.length > blocksize) {
    var hash = alg === 'rmd160' ? new RIPEMD160() : sha(alg)
    key = hash.update(key).digest()
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = this._ipad = Buffer.allocUnsafe(blocksize)
  var opad = this._opad = Buffer.allocUnsafe(blocksize)

  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }
  this._hash = alg === 'rmd160' ? new RIPEMD160() : sha(alg)
  this._hash.update(ipad)
}

inherits(Hmac, Base)

Hmac.prototype._update = function (data) {
  this._hash.update(data)
}

Hmac.prototype._final = function () {
  var h = this._hash.digest()
  var hash = this._alg === 'rmd160' ? new RIPEMD160() : sha(this._alg)
  return hash.update(this._opad).update(h).digest()
}

module.exports = function createHmac (alg, key) {
  alg = alg.toLowerCase()
  if (alg === 'rmd160' || alg === 'ripemd160') {
    return new Hmac('rmd160', key)
  }
  if (alg === 'md5') {
    return new Legacy(md5, key)
  }
  return new Hmac(alg, key)
}


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var randomBytes = __webpack_require__(25);
module.exports = findPrime;
findPrime.simpleSieve = simpleSieve;
findPrime.fermatTest = fermatTest;
var BN = __webpack_require__(3);
var TWENTYFOUR = new BN(24);
var MillerRabin = __webpack_require__(75);
var millerRabin = new MillerRabin();
var ONE = new BN(1);
var TWO = new BN(2);
var FIVE = new BN(5);
var SIXTEEN = new BN(16);
var EIGHT = new BN(8);
var TEN = new BN(10);
var THREE = new BN(3);
var SEVEN = new BN(7);
var ELEVEN = new BN(11);
var FOUR = new BN(4);
var TWELVE = new BN(12);
var primes = null;

function _getPrimes() {
  if (primes !== null)
    return primes;

  var limit = 0x100000;
  var res = [];
  res[0] = 2;
  for (var i = 1, k = 3; k < limit; k += 2) {
    var sqrt = Math.ceil(Math.sqrt(k));
    for (var j = 0; j < i && res[j] <= sqrt; j++)
      if (k % res[j] === 0)
        break;

    if (i !== j && res[j] <= sqrt)
      continue;

    res[i++] = k;
  }
  primes = res;
  return res;
}

function simpleSieve(p) {
  var primes = _getPrimes();

  for (var i = 0; i < primes.length; i++)
    if (p.modn(primes[i]) === 0) {
      if (p.cmpn(primes[i]) === 0) {
        return true;
      } else {
        return false;
      }
    }

  return true;
}

function fermatTest(p) {
  var red = BN.mont(p);
  return TWO.toRed(red).redPow(p.subn(1)).fromRed().cmpn(1) === 0;
}

function findPrime(bits, gen) {
  if (bits < 16) {
    // this is what openssl does
    if (gen === 2 || gen === 5) {
      return new BN([0x8c, 0x7b]);
    } else {
      return new BN([0x8c, 0x27]);
    }
  }
  gen = new BN(gen);

  var num, n2;

  while (true) {
    num = new BN(randomBytes(Math.ceil(bits / 8)));
    while (num.bitLength() > bits) {
      num.ishrn(1);
    }
    if (num.isEven()) {
      num.iadd(ONE);
    }
    if (!num.testn(1)) {
      num.iadd(TWO);
    }
    if (!gen.cmp(TWO)) {
      while (num.mod(TWENTYFOUR).cmp(ELEVEN)) {
        num.iadd(FOUR);
      }
    } else if (!gen.cmp(FIVE)) {
      while (num.mod(TEN).cmp(THREE)) {
        num.iadd(FOUR);
      }
    }
    n2 = num.shrn(1);
    if (simpleSieve(n2) && simpleSieve(num) &&
      fermatTest(n2) && fermatTest(num) &&
      millerRabin.test(n2) && millerRabin.test(num)) {
      return num;
    }
  }

}


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(8);
var common = __webpack_require__(24);
var shaCommon = __webpack_require__(73);
var assert = __webpack_require__(6);

var sum32 = utils.sum32;
var sum32_4 = utils.sum32_4;
var sum32_5 = utils.sum32_5;
var ch32 = shaCommon.ch32;
var maj32 = shaCommon.maj32;
var s0_256 = shaCommon.s0_256;
var s1_256 = shaCommon.s1_256;
var g0_256 = shaCommon.g0_256;
var g1_256 = shaCommon.g1_256;

var BlockHash = common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash);
module.exports = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];
  var f = this.h[5];
  var g = this.h[6];
  var h = this.h[7];

  assert(this.k.length === W.length);
  for (i = 0; i < W.length; i++) {
    var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
    var T2 = sum32(s0_256(a), maj32(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32(T1, T2);
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
  this.h[5] = sum32(this.h[5], f);
  this.h[6] = sum32(this.h[6], g);
  this.h[7] = sum32(this.h[7], h);
};

SHA256.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(8);
var common = __webpack_require__(24);
var assert = __webpack_require__(6);

var rotr64_hi = utils.rotr64_hi;
var rotr64_lo = utils.rotr64_lo;
var shr64_hi = utils.shr64_hi;
var shr64_lo = utils.shr64_lo;
var sum64 = utils.sum64;
var sum64_hi = utils.sum64_hi;
var sum64_lo = utils.sum64_lo;
var sum64_4_hi = utils.sum64_4_hi;
var sum64_4_lo = utils.sum64_4_lo;
var sum64_5_hi = utils.sum64_5_hi;
var sum64_5_lo = utils.sum64_5_lo;

var BlockHash = common.BlockHash;

var sha512_K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function SHA512() {
  if (!(this instanceof SHA512))
    return new SHA512();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xf3bcc908,
    0xbb67ae85, 0x84caa73b,
    0x3c6ef372, 0xfe94f82b,
    0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1,
    0x9b05688c, 0x2b3e6c1f,
    0x1f83d9ab, 0xfb41bd6b,
    0x5be0cd19, 0x137e2179 ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash);
module.exports = SHA512;

SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;

SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
  var W = this.W;

  // 32 x 32bit words
  for (var i = 0; i < 32; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i += 2) {
    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
    var c1_hi = W[i - 14];  // i - 7
    var c1_lo = W[i - 13];
    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
    var c3_hi = W[i - 32];  // i - 16
    var c3_lo = W[i - 31];

    W[i] = sum64_4_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
    W[i + 1] = sum64_4_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
  }
};

SHA512.prototype._update = function _update(msg, start) {
  this._prepareBlock(msg, start);

  var W = this.W;

  var ah = this.h[0];
  var al = this.h[1];
  var bh = this.h[2];
  var bl = this.h[3];
  var ch = this.h[4];
  var cl = this.h[5];
  var dh = this.h[6];
  var dl = this.h[7];
  var eh = this.h[8];
  var el = this.h[9];
  var fh = this.h[10];
  var fl = this.h[11];
  var gh = this.h[12];
  var gl = this.h[13];
  var hh = this.h[14];
  var hl = this.h[15];

  assert(this.k.length === W.length);
  for (var i = 0; i < W.length; i += 2) {
    var c0_hi = hh;
    var c0_lo = hl;
    var c1_hi = s1_512_hi(eh, el);
    var c1_lo = s1_512_lo(eh, el);
    var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
    var c3_hi = this.k[i];
    var c3_lo = this.k[i + 1];
    var c4_hi = W[i];
    var c4_lo = W[i + 1];

    var T1_hi = sum64_5_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);
    var T1_lo = sum64_5_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);

    c0_hi = s0_512_hi(ah, al);
    c0_lo = s0_512_lo(ah, al);
    c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

    var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
    var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);

    hh = gh;
    hl = gl;

    gh = fh;
    gl = fl;

    fh = eh;
    fl = el;

    eh = sum64_hi(dh, dl, T1_hi, T1_lo);
    el = sum64_lo(dl, dl, T1_hi, T1_lo);

    dh = ch;
    dl = cl;

    ch = bh;
    cl = bl;

    bh = ah;
    bl = al;

    ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
  }

  sum64(this.h, 0, ah, al);
  sum64(this.h, 2, bh, bl);
  sum64(this.h, 4, ch, cl);
  sum64(this.h, 6, dh, dl);
  sum64(this.h, 8, eh, el);
  sum64(this.h, 10, fh, fl);
  sum64(this.h, 12, gh, gl);
  sum64(this.h, 14, hh, hl);
};

SHA512.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function ch64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ ((~xh) & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function ch64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ ((~xl) & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 28);
  var c1_hi = rotr64_hi(xl, xh, 2);  // 34
  var c2_hi = rotr64_hi(xl, xh, 7);  // 39

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 28);
  var c1_lo = rotr64_lo(xl, xh, 2);  // 34
  var c2_lo = rotr64_lo(xl, xh, 7);  // 39

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 14);
  var c1_hi = rotr64_hi(xh, xl, 18);
  var c2_hi = rotr64_hi(xl, xh, 9);  // 41

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 14);
  var c1_lo = rotr64_lo(xh, xl, 18);
  var c2_lo = rotr64_lo(xl, xh, 9);  // 41

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 1);
  var c1_hi = rotr64_hi(xh, xl, 8);
  var c2_hi = shr64_hi(xh, xl, 7);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 1);
  var c1_lo = rotr64_lo(xh, xl, 8);
  var c2_lo = shr64_lo(xh, xl, 7);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 19);
  var c1_hi = rotr64_hi(xl, xh, 29);  // 61
  var c2_hi = shr64_hi(xh, xl, 6);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 19);
  var c1_lo = rotr64_lo(xl, xh, 29);  // 61
  var c2_lo = shr64_lo(xh, xl, 6);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(8);
var rotr32 = utils.rotr32;

function ft_1(s, x, y, z) {
  if (s === 0)
    return ch32(x, y, z);
  if (s === 1 || s === 3)
    return p32(x, y, z);
  if (s === 2)
    return maj32(x, y, z);
}
exports.ft_1 = ft_1;

function ch32(x, y, z) {
  return (x & y) ^ ((~x) & z);
}
exports.ch32 = ch32;

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
exports.maj32 = maj32;

function p32(x, y, z) {
  return x ^ y ^ z;
}
exports.p32 = p32;

function s0_256(x) {
  return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
}
exports.s0_256 = s0_256;

function s1_256(x) {
  return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
}
exports.s1_256 = s1_256;

function g0_256(x) {
  return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
}
exports.g0_256 = g0_256;

function g1_256(x) {
  return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
}
exports.g1_256 = g1_256;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var bn = __webpack_require__(3);
var brorand = __webpack_require__(61);

function MillerRabin(rand) {
  this.rand = rand || new brorand.Rand();
}
module.exports = MillerRabin;

MillerRabin.create = function create(rand) {
  return new MillerRabin(rand);
};

MillerRabin.prototype._randbelow = function _randbelow(n) {
  var len = n.bitLength();
  var min_bytes = Math.ceil(len / 8);

  // Generage random bytes until a number less than n is found.
  // This ensures that 0..n-1 have an equal probability of being selected.
  do
    var a = new bn(this.rand.generate(min_bytes));
  while (a.cmp(n) >= 0);

  return a;
};

MillerRabin.prototype._randrange = function _randrange(start, stop) {
  // Generate a random number greater than or equal to start and less than stop.
  var size = stop.sub(start);
  return start.add(this._randbelow(size));
};

MillerRabin.prototype.test = function test(n, k, cb) {
  var len = n.bitLength();
  var red = bn.mont(n);
  var rone = new bn(1).toRed(red);

  if (!k)
    k = Math.max(1, (len / 48) | 0);

  // Find d and s, (n - 1) = (2 ^ s) * d;
  var n1 = n.subn(1);
  for (var s = 0; !n1.testn(s); s++) {}
  var d = n.shrn(s);

  var rn1 = n1.toRed(red);

  var prime = true;
  for (; k > 0; k--) {
    var a = this._randrange(new bn(2), n1);
    if (cb)
      cb(a);

    var x = a.toRed(red).redPow(d);
    if (x.cmp(rone) === 0 || x.cmp(rn1) === 0)
      continue;

    for (var i = 1; i < s; i++) {
      x = x.redSqr();

      if (x.cmp(rone) === 0)
        return false;
      if (x.cmp(rn1) === 0)
        break;
    }

    if (i === s)
      return false;
  }

  return prime;
};

MillerRabin.prototype.getDivisor = function getDivisor(n, k) {
  var len = n.bitLength();
  var red = bn.mont(n);
  var rone = new bn(1).toRed(red);

  if (!k)
    k = Math.max(1, (len / 48) | 0);

  // Find d and s, (n - 1) = (2 ^ s) * d;
  var n1 = n.subn(1);
  for (var s = 0; !n1.testn(s); s++) {}
  var d = n.shrn(s);

  var rn1 = n1.toRed(red);

  for (; k > 0; k--) {
    var a = this._randrange(new bn(2), n1);

    var g = n.gcd(a);
    if (g.cmpn(1) !== 0)
      return g;

    var x = a.toRed(red).redPow(d);
    if (x.cmp(rone) === 0 || x.cmp(rn1) === 0)
      continue;

    for (var i = 1; i < s; i++) {
      x = x.redSqr();

      if (x.cmp(rone) === 0)
        return x.fromRed().subn(1).gcd(n);
      if (x.cmp(rn1) === 0)
        break;
    }

    if (i === s) {
      x = x.redSqr();
      return x.fromRed().subn(1).gcd(n);
    }
  }

  return false;
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = exports;

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg !== 'string') {
    for (var i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
    return res;
  }
  if (enc === 'hex') {
    msg = msg.replace(/[^a-z0-9]+/ig, '');
    if (msg.length % 2 !== 0)
      msg = '0' + msg;
    for (var i = 0; i < msg.length; i += 2)
      res.push(parseInt(msg[i] + msg[i + 1], 16));
  } else {
    for (var i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i);
      var hi = c >> 8;
      var lo = c & 0xff;
      if (hi)
        res.push(hi, lo);
      else
        res.push(lo);
    }
  }
  return res;
}
utils.toArray = toArray;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
utils.zero2 = zero2;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
utils.toHex = toHex;

utils.encode = function encode(arr, enc) {
  if (enc === 'hex')
    return toHex(arr);
  else
    return arr;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {


exports.pbkdf2 = __webpack_require__(180)

exports.pbkdf2Sync = __webpack_require__(80)


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var defaultEncoding
/* istanbul ignore next */
if (process.browser) {
  defaultEncoding = 'utf-8'
} else {
  var pVersionMajor = parseInt(process.version.split('.')[0].slice(1), 10)

  defaultEncoding = pVersionMajor >= 6 ? 'utf-8' : 'binary'
}
module.exports = defaultEncoding

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 79 */
/***/ (function(module, exports) {

var MAX_ALLOC = Math.pow(2, 30) - 1 // default in iojs
module.exports = function (iterations, keylen) {
  if (typeof iterations !== 'number') {
    throw new TypeError('Iterations not a number')
  }

  if (iterations < 0) {
    throw new TypeError('Bad iterations')
  }

  if (typeof keylen !== 'number') {
    throw new TypeError('Key length not a number')
  }

  if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen) { /* eslint no-self-compare: 0 */
    throw new TypeError('Bad key length')
  }
}


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var md5 = __webpack_require__(41)
var rmd160 = __webpack_require__(48)
var sha = __webpack_require__(49)

var checkParameters = __webpack_require__(79)
var defaultEncoding = __webpack_require__(78)
var Buffer = __webpack_require__(2).Buffer
var ZEROS = Buffer.alloc(128)
var sizes = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
}

function Hmac (alg, key, saltLen) {
  var hash = getDigest(alg)
  var blocksize = (alg === 'sha512' || alg === 'sha384') ? 128 : 64

  if (key.length > blocksize) {
    key = hash(key)
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = Buffer.allocUnsafe(blocksize + sizes[alg])
  var opad = Buffer.allocUnsafe(blocksize + sizes[alg])
  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var ipad1 = Buffer.allocUnsafe(blocksize + saltLen + 4)
  ipad.copy(ipad1, 0, 0, blocksize)
  this.ipad1 = ipad1
  this.ipad2 = ipad
  this.opad = opad
  this.alg = alg
  this.blocksize = blocksize
  this.hash = hash
  this.size = sizes[alg]
}

Hmac.prototype.run = function (data, ipad) {
  data.copy(ipad, this.blocksize)
  var h = this.hash(ipad)
  h.copy(this.opad, this.blocksize)
  return this.hash(this.opad)
}

function getDigest (alg) {
  function shaFunc (data) {
    return sha(alg).update(data).digest()
  }

  if (alg === 'rmd160' || alg === 'ripemd160') return rmd160
  if (alg === 'md5') return md5
  return shaFunc
}

function pbkdf2 (password, salt, iterations, keylen, digest) {
  if (!Buffer.isBuffer(password)) password = Buffer.from(password, defaultEncoding)
  if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, defaultEncoding)

  checkParameters(iterations, keylen)

  digest = digest || 'sha1'

  var hmac = new Hmac(digest, password, salt.length)

  var DK = Buffer.allocUnsafe(keylen)
  var block1 = Buffer.allocUnsafe(salt.length + 4)
  salt.copy(block1, 0, 0, salt.length)

  var destPos = 0
  var hLen = sizes[digest]
  var l = Math.ceil(keylen / hLen)

  for (var i = 1; i <= l; i++) {
    block1.writeUInt32BE(i, salt.length)

    var T = hmac.run(block1, hmac.ipad1)
    var U = T

    for (var j = 1; j < iterations; j++) {
      U = hmac.run(U, hmac.ipad2)
      for (var k = 0; k < hLen; k++) T[k] ^= U[k]
    }

    T.copy(DK, destPos)
    destPos += hLen
  }

  return DK
}

module.exports = pbkdf2


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(23);
module.exports = function (seed, len) {
  var t = new Buffer('');
  var  i = 0, c;
  while (t.length < len) {
    c = i2ops(i++);
    t = Buffer.concat([t, createHash('sha1').update(seed).update(c).digest()]);
  }
  return t.slice(0, len);
};

function i2ops(c) {
  var out = new Buffer(4);
  out.writeUInt32BE(c,0);
  return out;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var bn = __webpack_require__(3);
function withPublic(paddedMsg, key) {
  return new Buffer(paddedMsg
    .toRed(bn.mont(key.modulus))
    .redPow(new bn(key.publicExponent))
    .fromRed()
    .toArray());
}

module.exports = withPublic;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = function xor(a, b) {
  var len = a.length;
  var i = -1;
  while (++i < len) {
    a[i] ^= b[i];
  }
  return a
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var processNextTick = __webpack_require__(32);
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(74);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(43).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(87);
/*</replacement>*/

// TODO(bmeurer): Change this back to const once hole checks are
// properly optimized away early in Ignition+TurboFan.
/*<replacement>*/
var Buffer = __webpack_require__(2).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(22);
util.inherits = __webpack_require__(0);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(204);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(186);
var destroyImpl = __webpack_require__(86);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(12);

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(45).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(12);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(45).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(10)))

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(12);

/*<replacement>*/
var util = __webpack_require__(22);
util.inherits = __webpack_require__(0);
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return stream.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var processNextTick = __webpack_require__(32);
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextTick(emitErrorNT, this, err);
    }
    return;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(43).EventEmitter;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = __webpack_require__(0)
var Hash = __webpack_require__(16)
var Buffer = __webpack_require__(2).Buffer

var K = [
  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
]

var W = new Array(64)

function Sha256 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha256, Hash)

Sha256.prototype.init = function () {
  this._a = 0x6a09e667
  this._b = 0xbb67ae85
  this._c = 0x3c6ef372
  this._d = 0xa54ff53a
  this._e = 0x510e527f
  this._f = 0x9b05688c
  this._g = 0x1f83d9ab
  this._h = 0x5be0cd19

  return this
}

function ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x) {
  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
}

function sigma1 (x) {
  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
}

function gamma0 (x) {
  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)
}

function gamma1 (x) {
  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10)
}

Sha256.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0
  var f = this._f | 0
  var g = this._g | 0
  var h = this._h | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 64; ++i) W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0

  for (var j = 0; j < 64; ++j) {
    var T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0
    var T2 = (sigma0(a) + maj(a, b, c)) | 0

    h = g
    g = f
    f = e
    e = (d + T1) | 0
    d = c
    c = b
    b = a
    a = (T1 + T2) | 0
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
  this._f = (f + this._f) | 0
  this._g = (g + this._g) | 0
  this._h = (h + this._h) | 0
}

Sha256.prototype._hash = function () {
  var H = Buffer.allocUnsafe(32)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)
  H.writeInt32BE(this._h, 28)

  return H
}

module.exports = Sha256


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(0)
var Hash = __webpack_require__(16)
var Buffer = __webpack_require__(2).Buffer

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
]

var W = new Array(160)

function Sha512 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha512, Hash)

Sha512.prototype.init = function () {
  this._ah = 0x6a09e667
  this._bh = 0xbb67ae85
  this._ch = 0x3c6ef372
  this._dh = 0xa54ff53a
  this._eh = 0x510e527f
  this._fh = 0x9b05688c
  this._gh = 0x1f83d9ab
  this._hh = 0x5be0cd19

  this._al = 0xf3bcc908
  this._bl = 0x84caa73b
  this._cl = 0xfe94f82b
  this._dl = 0x5f1d36f1
  this._el = 0xade682d1
  this._fl = 0x2b3e6c1f
  this._gl = 0xfb41bd6b
  this._hl = 0x137e2179

  return this
}

function Ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x, xl) {
  return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
}

function sigma1 (x, xl) {
  return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
}

function Gamma0 (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7)
}

function Gamma0l (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
}

function Gamma1 (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6)
}

function Gamma1l (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
}

function getCarry (a, b) {
  return (a >>> 0) < (b >>> 0) ? 1 : 0
}

Sha512.prototype._update = function (M) {
  var W = this._w

  var ah = this._ah | 0
  var bh = this._bh | 0
  var ch = this._ch | 0
  var dh = this._dh | 0
  var eh = this._eh | 0
  var fh = this._fh | 0
  var gh = this._gh | 0
  var hh = this._hh | 0

  var al = this._al | 0
  var bl = this._bl | 0
  var cl = this._cl | 0
  var dl = this._dl | 0
  var el = this._el | 0
  var fl = this._fl | 0
  var gl = this._gl | 0
  var hl = this._hl | 0

  for (var i = 0; i < 32; i += 2) {
    W[i] = M.readInt32BE(i * 4)
    W[i + 1] = M.readInt32BE(i * 4 + 4)
  }
  for (; i < 160; i += 2) {
    var xh = W[i - 15 * 2]
    var xl = W[i - 15 * 2 + 1]
    var gamma0 = Gamma0(xh, xl)
    var gamma0l = Gamma0l(xl, xh)

    xh = W[i - 2 * 2]
    xl = W[i - 2 * 2 + 1]
    var gamma1 = Gamma1(xh, xl)
    var gamma1l = Gamma1l(xl, xh)

    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
    var Wi7h = W[i - 7 * 2]
    var Wi7l = W[i - 7 * 2 + 1]

    var Wi16h = W[i - 16 * 2]
    var Wi16l = W[i - 16 * 2 + 1]

    var Wil = (gamma0l + Wi7l) | 0
    var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0
    Wil = (Wil + gamma1l) | 0
    Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0
    Wil = (Wil + Wi16l) | 0
    Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0

    W[i] = Wih
    W[i + 1] = Wil
  }

  for (var j = 0; j < 160; j += 2) {
    Wih = W[j]
    Wil = W[j + 1]

    var majh = maj(ah, bh, ch)
    var majl = maj(al, bl, cl)

    var sigma0h = sigma0(ah, al)
    var sigma0l = sigma0(al, ah)
    var sigma1h = sigma1(eh, el)
    var sigma1l = sigma1(el, eh)

    // t1 = h + sigma1 + ch + K[j] + W[j]
    var Kih = K[j]
    var Kil = K[j + 1]

    var chh = Ch(eh, fh, gh)
    var chl = Ch(el, fl, gl)

    var t1l = (hl + sigma1l) | 0
    var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0
    t1l = (t1l + chl) | 0
    t1h = (t1h + chh + getCarry(t1l, chl)) | 0
    t1l = (t1l + Kil) | 0
    t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0
    t1l = (t1l + Wil) | 0
    t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0

    // t2 = sigma0 + maj
    var t2l = (sigma0l + majl) | 0
    var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0

    hh = gh
    hl = gl
    gh = fh
    gl = fl
    fh = eh
    fl = el
    el = (dl + t1l) | 0
    eh = (dh + t1h + getCarry(el, dl)) | 0
    dh = ch
    dl = cl
    ch = bh
    cl = bl
    bh = ah
    bl = al
    al = (t1l + t2l) | 0
    ah = (t1h + t2h + getCarry(al, t1l)) | 0
  }

  this._al = (this._al + al) | 0
  this._bl = (this._bl + bl) | 0
  this._cl = (this._cl + cl) | 0
  this._dl = (this._dl + dl) | 0
  this._el = (this._el + el) | 0
  this._fl = (this._fl + fl) | 0
  this._gl = (this._gl + gl) | 0
  this._hl = (this._hl + hl) | 0

  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0
  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0
  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0
  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0
  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0
  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0
  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0
  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0
}

Sha512.prototype._hash = function () {
  var H = Buffer.allocUnsafe(64)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)
  writeInt64BE(this._gh, this._gl, 48)
  writeInt64BE(this._hh, this._hl, 56)

  return H
}

module.exports = Sha512


/***/ }),
/* 90 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 11/06/2017.
 */
// Source: https://gist.github.com/k-gun/c2ea7c49edf7b757fe9561ba37cb19ca
(function() {
    // helpers
    var regExp = function(name) {
        return new RegExp('(^| )'+ name +'( |$)');
    };
    var forEach = function(list, fn, scope) {
        for (var i = 0; i < list.length; i++) {
            fn.call(scope, list[i]);
        }
    };

    // class list object with basic methods
    function ClassList(element) {
        this.element = element;
    }

    ClassList.prototype = {
        add: function() {
            forEach(arguments, function(name) {
                if (!this.contains(name)) {
                    this.element.className += this.element.className.length > 0 ? ' ' + name : name;
                }
            }, this);
        },
        remove: function() {
            forEach(arguments, function(name) {
                this.element.className =
                    this.element.className.replace(regExp(name), '');
            }, this);
        },
        toggle: function(name) {
            return this.contains(name)
                ? (this.remove(name), false) : (this.add(name), true);
        },
        contains: function(name) {
            return regExp(name).test(this.element.className);
        },
        // bonus..
        replace: function(oldName, newName) {
            this.remove(oldName), this.add(newName);
        }
    };

    // IE8/9, Safari
    if (!('classList' in Element.prototype)) {
        Object.defineProperty(Element.prototype, 'classList', {
            get: function() {
                return new ClassList(this);
            }
        });
    }

    // replace() support for others
    if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
        DOMTokenList.prototype.replace = ClassList.prototype.replace;
    }
})();
module.exports = {};

/***/ }),
/* 91 */
/***/ (function(module, exports) {


(function() {
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(func) {
            func();
        };
}());


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description -A component displaying the number of levels the user has gone through
 *
 */



var

    display = function (level_num) {
        var
            text_text = document.getElementById('level');
        text_text.textContent = level_num;
    };
module.exports = {
    /**
     *
     * @param {number} num - The level to display
     */
    set: function (num) {
        display(num);
    }
};




/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 11/04/2017.
 */


var
    IntervalManager = __webpack_require__(26),
    PauseManager = __webpack_require__(14),
    SvgUtils = __webpack_require__(7),
    startTime_num,
    time_num = 0,
    text_el = document.getElementById('time'),
    interval,
    onTimeElapsed_fun,
    clockPos = {
        x: 24.112,
        y: 17.695,
        holeRadius: 0,
        radius: 6.2515
    },
    container_el = document.getElementById('game_js'),
    clock_el = SvgUtils.getSlice(clockPos.x, clockPos.y, clockPos.radius, clockPos.holeRadius, 0, 0),
countDown = function () {
    if (PauseManager.pauseButton) {

        if (time_num === 0) {
            display(time_num);
            if (onTimeElapsed_fun) {
                onTimeElapsed_fun();
            }
        } else {
            display(--time_num);
        }
    }
},
    display = function (remainTime_num) {
        var angle_num = 360 - (360 * (remainTime_num / startTime_num));
        if (remainTime_num) {
            clock_el.setAttribute('d', SvgUtils.getSliceAttribute(clockPos.x, clockPos.y, clockPos.radius, clockPos.holeRadius, 0, angle_num));
        }
        text_el.textContent = remainTime_num!==undefined?remainTime_num:'';
    };

clock_el.setAttribute('fill', '#b0b0b0');
container_el.appendChild(clock_el);

module.exports = {
    start: function (p_startTime_num) {
        if (interval) {
            interval.clear();
        }
        display(startTime_num);
        startTime_num = time_num = p_startTime_num;
        interval = IntervalManager.set(countDown, 1000);
    },
    get remaining() {
        return time_num;
    },
    set onTimeElapsed(fun) {
        onTimeElapsed_fun = fun;
    }
};




/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 26/02/2017.
 */


var Configs = __webpack_require__(4),
    ObjectListManager = __webpack_require__(15),
    SvgUtils = __webpack_require__(7),
    MovingObject = __webpack_require__(56),
    directionFromTo = __webpack_require__(54),
    PlayerAvatar = __webpack_require__(51),
    LivesManager = __webpack_require__(34),
    PauseManager = __webpack_require__(14),
    CollisionManager = __webpack_require__(37),
    ID_STR = 'badGuy',
    gridSize_num = Configs('stage').gridSize,
    items_array = ObjectListManager.createList(ID_STR);

module.exports = {
    itemList: items_array,
    add: function (point) {
        var vibrate = (function () {
                var STEP = 0.2,
                    direction = {
                        x: Math.random() > .5 ? -1 : 1,
                        y: Math.random() > .5 ? -1 : 1
                    },
                    move = {
                        x: -2,
                        y: -2
                    };
                return function (vibration_num) {
                    if (vibration_num) {
                        move.x = -2 + vibration_num;
                        move.y = -2 + vibration_num;
                    } else {
                        move.x += STEP * direction.x;
                        move.y += STEP * direction.y;
                        if (Math.abs(move.y + 2) > STEP * 5) {
                            direction.y *= -1;
                        }
                        if (Math.abs(move.x + 2) > STEP * 10) {
                            direction.x *= -1;
                        }
                    }
                    window.requestAnimationFrame(function () {
                        config.dom_el.setAttribute('transform', 'translate(' + move.x + ',' + move.y + ')');
                    });
                }
            }()),
            origin_point = point,
            config = JSON.parse(JSON.stringify(Configs(ID_STR))),
            applyOriginPoint = function () {
                config.position.x = origin_point.x * stageConfig.gridSize;
                config.position.y = origin_point.y * stageConfig.gridSize;
                if (config.dom_el) {
                    config.dom_el.setAttribute('x', config.position.x);
                    config.dom_el.setAttribute('y', config.position.y);
                }
            },
            stageConfig = Configs('stage');
        applyOriginPoint();
        config.dom_el = SvgUtils.createElement('use', {
            width: "14",
            height: "14",
            transform: 'translate(-2,-2)',
            overflow: "visible",
            x: config.position.x,
            y: config.position.y
        }, [
            {
                nameSpace: "http://www.w3.org/1999/xlink",
                name: "href",
                value: "#badguy"
            }
        ]);
        config.setDirection = function (findPos) {
            var
                direction_obj,
                playerAvatar_api = ObjectListManager.getList('playerAvatar')[0],
                forbidden_obj,
                temptativePosition_point,
                isMySelf = function () {
                    return forbidden_obj.config === config;
                },
                temptativeDirection_obj = directionFromTo(config.position, playerAvatar_api.position);


            temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
            if (PauseManager.playing && CollisionManager.isAvatar(temptativePosition_point)) {
                playerAvatar_api = CollisionManager.isAvatar(temptativePosition_point);
                PauseManager.playing = false;
                playerAvatar_api.config.avatarLost();
                config.show(false);
                window.setTimeout(function () {
                    var badGuys_array = ObjectListManager.getList('badGuy');
                    playerAvatar_api.position = {x: 0, y: 0};
                    config.show(true);
                    badGuys_array.forEach(function (badGuy_mo) {
                        badGuy_mo.config.reset();
                    });
                    playerAvatar_api.config.restoreDefaultLook();
                    LivesManager.decrement();
                    PauseManager.playing = true;
                }, 2000);
            }

            forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
            if (forbidden_obj && isMySelf(forbidden_obj)) {
                forbidden_obj = null;
            }
            if (temptativeDirection_obj && !forbidden_obj) {
                direction_obj = temptativeDirection_obj;
                config.targetPosition = temptativePosition_point;
            } else {
                temptativeDirection_obj = directionFromTo(config.position, playerAvatar_api.position, true);
                temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
                if (temptativeDirection_obj && !forbidden_obj) {
                    direction_obj = temptativeDirection_obj;
                    config.targetPosition = temptativePosition_point;
                } else {
                    direction_obj = null;
                }
            }
            if (!direction_obj || !PlayerAvatar.isStarted()) {
                vibrate();
            } else {
                vibrate(0);
            }
            if (PlayerAvatar.isStarted()) {
                return direction_obj;
            }
        };

        config.reset = function () {
            applyOriginPoint();
        };
        config.show = function (visible_bool) {
            if (!visible_bool) {
                SvgUtils.applyAttributes(config.dom_el, {
                    'display': 'none'
                });
            } else {
                SvgUtils.applyAttributes(config.dom_el, {
                    'display': 'inline'
                });
            }
        };
        stageConfig.dom_el.appendChild(config.dom_el);
        var badGuy_obj = MovingObject.add(config);
        ObjectListManager.pushItem(ID_STR, badGuy_obj);
    },
    resetToOrigins: function () {
        items_array.forEach(function (el) {
            el.reset();
        });
    }
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 25/02/2017.
 * @module
 * @description The goodies (scores and bonus lives) appearing in the game.
 */

var
    Config = __webpack_require__(4),
    stageConfig = Config('stage'),
    ObjectListManager = __webpack_require__(15),
    SvgUtils = __webpack_require__(7),
    LiveManager = __webpack_require__(34),
    ScoreManager = __webpack_require__(27),
    playSound = __webpack_require__(17),
    CollisionManager = __webpack_require__(37),
    layer_g = SvgUtils.createElement('g'),
    onCollected_fun,
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'goodie',
    parent_el = layer_g,
    items_array = ObjectListManager.createList(ID_STR),
    add = function (point) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            bonusLive_bool = Math.random() < (LiveManager.maxLives - LiveManager.lives)/70,
            dom_el;
        config.position = point;
        config.position.width = gridSize_num;
        config.position.height = gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('use', {
                width: 10,
                height: 10,
                x: config.position.x,
                y: config.position.y
            },
            [
                {
                    nameSpace: "http://www.w3.org/1999/xlink",
                    name: "href",
                    value: bonusLive_bool ? "#earth" : "#goodie"
                }]
        );
        config.remove = function () {
            parent_el.removeChild(dom_el);
            items_array = ObjectListManager.disableItemFromList(ID_STR, config);
            playSound('bon_2');
            if (!bonusLive_bool) {
                ScoreManager.increment();

            } else {
                LiveManager.increment();
            }

            if (items_array.length === 0 && onCollected_fun) {
                onCollected_fun();
            }
            return items_array.length;
        };
        items_array.push(config);
        parent_el.appendChild(dom_el);
    };

stageConfig.dom_el.appendChild(layer_g);

module.exports = {
    /**
     * @type Function
     * @writeonly
     * @description Sets the callback called when all goodies are collected
     */
    set onCollected(fun) {
        onCollected_fun = fun;
    },
    /**
     * @type Array
     * @readonly
     * @description The list of goodies on the screen
     */
    get itemList() {
        return items_array;
    },
    /**
     * Add all the goodies on the stage on a grid of 6 by 6, if the square is not occupied by another object (wall, ...).
     */
    addAll: function () {
        var line_num,
            column_num,
            lineTotal_num = stageConfig.linesNum,
            colTotal_num = stageConfig.columnsNum;
        for (column_num = 0; column_num < colTotal_num; column_num++) {
            for (line_num = 0; line_num < lineTotal_num; line_num++) {
                if (line_num % 6 === 0 && column_num % 6 === 0) {
                    var position_point = {
                        x: column_num * gridSize_num,
                        y: line_num * gridSize_num
                    };
                    if (!CollisionManager.isOccupied(position_point)) {
                        add(position_point);
                    }
                }

            }
        }
    }
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 25/02/2017.
 *
 * @module
 * @description The Factory generating obstacles: The walls encountered by the user
 */
/**
 * @typedef Rectangle
 * @description A rectangle used to convey coordinates.
 * @property {Number} width - The width of the rectangle
 * @property {Number} height - The height
 * @property {Number} x - The position on the X-axis
 * @property {Number} y - The position on the Y-axis
 *
 */

var
    Config = __webpack_require__(4),
    stageConfig = Config('stage'),
    ObjectListManager = __webpack_require__(15),
    SvgUtils = __webpack_require__(7),
    ColorUtils = __webpack_require__(108),
    TimeoutManager = __webpack_require__(36),
    ArrayUtils = __webpack_require__(18),
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'obstacle',
    layer_g = SvgUtils.createElement('g'),
    playSound = __webpack_require__(17),
    Languages = __webpack_require__(50),
    COLORS_ARRAY = ['#170c59', '#752995', '#ff5a19', '#006830'],
    items_array = ObjectListManager.createList(ID_STR);

stageConfig.dom_el.appendChild (layer_g);

module.exports = {
    /**
     * The list of obstacles on the screen
     */
    get itemList() {
        return items_array;
    },
    /**
     * Creates a new obstacle and adds it to the Obstacle List.
     * @param {Rectangle} rect -The coordinates of the wall.
     */
    add: function (rect) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            dom_el,
            blocks_num,
            language_obj,
            color_hex = ArrayUtils.getRandomCel(COLORS_ARRAY),
            string_array,
            shades_array = [],
            n;

        config.direction = rect.width > rect.height ? 'width' : 'height';
        config.position.x = rect.x * gridSize_num;
        config.position.y = rect.y * gridSize_num;
        config.position.width = rect.width * gridSize_num;
        config.position.height = rect.height * gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('g');


        blocks_num = rect[config.direction];

        language_obj = Languages.getRandomLanguageOfLength(blocks_num);
        if (language_obj) {
            config.language = language_obj.id;
            string_array = language_obj.label.split('');
        } else {
            config.blocked = true;
        }
        for (n = 0; n < blocks_num; n++) {
            var baseShade_num = 1;
            if (blocks_num < 5) {
                baseShade_num = 1.5;
            }
            shades_array.push(baseShade_num + (0.15 * n));
        }
        if (Math.random() > .5) {
            shades_array.reverse();
        }
        for (n = 0; n < blocks_num; n++) {
            (function () {
                var brick_el = SvgUtils.createElement('rect', {
                    width: gridSize_num,
                    height: gridSize_num,
                    fill: ColorUtils.multiply(color_hex, shades_array[n]),
                    x: config.position.x + n * gridSize_num * Number(config.direction === 'width'),
                    y: config.position.y + n * gridSize_num * Number(config.direction === 'height')
                });
                if (string_array) {
                    var
                        textHeight_num = 9,
                        text_el = SvgUtils.createElement('text',
                            {
                                width: gridSize_num,
                                height: gridSize_num,
                                'text-anchor':'middle',
                                fill: 'white',
                                "font-size": "9",
                                x: gridSize_num/2 + config.position.x + n * gridSize_num * Number(config.direction === 'width'),
                                y: 0.5  + textHeight_num-0.7 + config.position.y + n * gridSize_num * Number(config.direction === 'height')
                            }
                        ),
                        text_node = document.createTextNode(string_array.shift().toUpperCase());
                    text_el.appendChild(text_node);
                }
                config.brick_array.push(
                    {
                        brick_el: brick_el,
                        text_el: text_el
                    });
                TimeoutManager.set(function () {
                    dom_el.appendChild(brick_el);
                    if (string_array) {
                        dom_el.appendChild(text_el);
                    }
                }, 1 + 50 * n);
            }());
        }
        config.openDoor = function (openOrLock_bool) {
            if (!config.blocked) {
                if (openOrLock_bool) {
                    config.open = true;
                    //ObjectListManager.disableItemFromList(ID_STR, config);
                } else {
                    config.blocked = true;
                }
                config.brick_array.forEach(function (brick_obj, index) {
                    TimeoutManager.set(function () {
                        if (openOrLock_bool) {
                            brick_obj.brick_el.setAttribute('fill', 'rgba(255,255,255,0.2)');
                            brick_obj.text_el.setAttribute('fill', 'rgba(255,255,255,0.2)');
                        } else {
                            playSound('mauvais_2', true);
                            brick_obj.brick_el.setAttribute('fill', '#c5c5c5');
                        }
                    }, 50 + (100 * index));
                });
                if (openOrLock_bool) {
                    playSound('bon_1');
                    TimeoutManager.set(function () {
                        playSound(config.language);
                    }, 100 * (config.brick_array.length - 1));
                }
            }
        };

        ObjectListManager.pushItem(ID_STR, config);
        items_array.push(config);
        layer_g.appendChild(dom_el);
    }
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 14/05/2017.
 * @module
 * @description Stores and distributes the different levels
 */
var
    levels_array = __webpack_require__(104),
    ArrayUtils = __webpack_require__(18),
    randomLevels_array,
    setRandomArray = function () {
        randomLevels_array = levels_array.slice(2);
    },

    getRandomCel = function () {
        if (randomLevels_array.length === 0) {
            setRandomArray();
        }
        return ArrayUtils.getRandomCel(randomLevels_array, true);
    };
setRandomArray();

module.exports = {
    /**
     * @property remaining
     * @readonly
     * @description {number} The remaining available levels
     */
    get remaining() {
        return randomLevels_array.length;
    },
    /**
     *
     * @description Returns a random level
     * @return {Object} A JSON-description of a level
     */
    get: function (level_num) {
        if (level_num < 2) {
            return levels_array [level_num];
        } else {
            return getRandomCel();
        }
    }
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description Displays the screen ate the end of the game.
 * @param {function} p_callback_fun -The function called when the user closes the screen
 *
 */
var
    Labels = __webpack_require__(13),
    Config = __webpack_require__(4),
    ScoreManager = __webpack_require__(27),
    SvgUtils = __webpack_require__(7),
    Animation = __webpack_require__(35),
    stage_el = Config('game').dom_el,
    TEXT_MARGIN_NUM = 150,
    callback_fun,
    yesYouDidiIt_block,
    yourScore_block,
    yourRank_block,
    playAgain_block,
    saveScore_block,
    popup_el = document.querySelector('.endScreen'),
    closePopup = function () {
        continueButton_el.removeEventListener('click', closePopup);
        continueButton_el.removeEventListener('touchstart', closePopup);
        saveButton_el.removeEventListener('click', sendScore);
        saveButton_el.removeEventListener('touchstart', sendScore);
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun();
    },
    sendScore = function () {
        ScoreManager.promptScore(ScoreManager.score, function(){
            closePopup();
        }, function() {
            closePopup();
        }, function() {
            //callback cancel. Do nothing...
        })
    },
    open_bool = false;

popup_el.removeAttribute('style');
popup_el.parentNode.removeChild(popup_el);
module.exports = function (p_callback_fun) {
    callback_fun = p_callback_fun;

    if (!open_bool) {
        if (yourScore_block) {
            popup_el.removeChild(yourScore_block);
        }
        if (yourRank_block) {
            popup_el.removeChild(yourRank_block);
        }
        Animation.fadeIn (popup_el);
        stage_el.appendChild(popup_el);
        (function setYourScore() {
            var
                lineHeight_num = 8,
                baseFormat_obj =
                    {
                        x: TEXT_MARGIN_NUM ,
                        y: 160,
                        fill: '#ffffff',
                        'text-anchor': 'left',
                        'font-size': '6px'
                    },
                yourScore_str = Labels.getLabel('you_scored'),
                yourScore_array = yourScore_str.split('XXX'),
                firstLine_text = SvgUtils.createElement("text", baseFormat_obj),
                secondLine_text = SvgUtils.createElement("text", baseFormat_obj),
                suffix_tspan = SvgUtils.createElement("tspan"),
                score_tspan = SvgUtils.createElement("tspan", {
                    'font-size': '8px',
                    'fill': '#f3d332'
                });

            var baseFormat_rank =
                    {
                        x: TEXT_MARGIN_NUM ,
                        y: 176,
                        fill: '#ffffff',
                        'text-anchor': 'left',
                        'font-size': '6px'
                    },
                yourRank_str = Labels.getLabel('your_rank'),
                yourRank_array = yourRank_str.split('XXX'),
                thirdLine_text = SvgUtils.createElement("text", baseFormat_rank),
                suffix_rank_tspan = SvgUtils.createElement("tspan"),
                middlefix_rank_tspan = SvgUtils.createElement("tspan"),
                prefix_rank_tspan = SvgUtils.createElement("tspan"),
                rank_tspan = SvgUtils.createElement("tspan", {
                    'font-size': '8px',
                    'fill': '#f3d332'
                }),
                overall_tspan = SvgUtils.createElement("tspan", {
                    'font-size': '8px',
                    'fill': '#f3d332'
                });

            yourScore_block = SvgUtils.createElement('g');
            score_tspan.textContent = ScoreManager.score;
            suffix_tspan.textContent = yourScore_array[1];


            ScoreManager.getRank(ScoreManager.score, function(ret, tot){
                yourRank_block = SvgUtils.createElement('g');
                rank_tspan.textContent = ret;
                overall_tspan.textContent = tot;
                prefix_rank_tspan.textContent = yourRank_array[0];
                middlefix_rank_tspan.textContent = yourRank_array[1];
                suffix_rank_tspan.textContent = yourRank_array[2];
                thirdLine_text.setAttribute('dy', lineHeight_num);
                thirdLine_text.appendChild(prefix_rank_tspan);
                thirdLine_text.appendChild(rank_tspan);
                thirdLine_text.appendChild(middlefix_rank_tspan);
                thirdLine_text.appendChild(overall_tspan);
                thirdLine_text.appendChild(suffix_rank_tspan);
                yourRank_block.appendChild(thirdLine_text);
                popup_el.appendChild(yourRank_block);
            },
            function(){
                console.error("Error retrieving your rank");
            });

            secondLine_text.setAttribute('dy', lineHeight_num);
            firstLine_text.textContent = yourScore_array[0];
            secondLine_text.appendChild(score_tspan);
            secondLine_text.appendChild(suffix_tspan);
            yourScore_block.appendChild(firstLine_text);
            yourScore_block.appendChild(secondLine_text);
            popup_el.appendChild(yourScore_block);

    

        }());

        if (!saveScore_block) {
            saveScore_block = SvgUtils.getMultilineText(popup_el, Labels.getLabel("save_score"),
                {
                    x: TEXT_MARGIN_NUM + 24,
                    y: 216 , color: '#ffffff',
                    'text-anchor': 'left',
                    width: 20,
                    lineHeight: 6,
                    'font-size': '5px'
                })
        }
        if (!playAgain_block) {
            playAgain_block = SvgUtils.getMultilineText(popup_el, Labels.getLabel("play_again"),
                {
                    x: TEXT_MARGIN_NUM + 24,
                    y: 196, color: '#ffffff',
                    'text-anchor': 'left',
                    width: 20,
                    lineHeight: 6,
                    'font-size': '5px'
                })
        }
        if (!yesYouDidiIt_block) {
            yesYouDidiIt_block = SvgUtils.getMultilineText(popup_el, Labels.getLabel('you_did_it'), {
                    x: TEXT_MARGIN_NUM ,
                    y: 111,
                    'forceLineBreakChar': '!',
                    color: 'black',
                    'text-anchor': 'left',
                    width: 80,
                    'font-weight': '800',
                    'stroke': 'white',
                    'stroke-width': 0.001,
                    lineHeight: 12,
                    'font-size': '12px'
                }
            )
        }
        continueButton_el = popup_el.querySelector('.playAgain');
        saveButton_el = popup_el.querySelector('.sendScore');

        

        open_bool = true;
        SvgUtils.simulateEnterClick(continueButton_el, closePopup);
        SvgUtils.simulateEnterClick(saveButton_el, sendScore);
        continueButton_el.addEventListener('click', closePopup);
        continueButton_el.addEventListener('touchstart', closePopup);
        saveButton_el.addEventListener('click', sendScore);
        saveButton_el.addEventListener('touchstart', sendScore);

        continueButton_el_paths = popup_el.querySelectorAll('.playAgain path');
        saveButton_el_paths = popup_el.querySelectorAll('.sendScore path');

        transform1 = getComputedStyle(continueButton_el_paths[0]).getPropertyValue('transform');
        transform2 = getComputedStyle(saveButton_el_paths[0]).getPropertyValue('transform');

        for (i = 0; i < continueButton_el_paths.length; i++) { 
           continueButton_el_paths[i].setAttribute('transform', transform1);
        }

        for (i = 0; i < saveButton_el_paths.length; i++) { 
           saveButton_el_paths[i].setAttribute('transform', transform2);
        }

    }
}
;




/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @module
 * @description Manages the display of the language-menu when the user must select another language for the languages displayed in the answers-menu.
 */


var languages_array = __webpack_require__(53),
    Labels = __webpack_require__(13),
    Config = __webpack_require__(4),
    stage_el = Config('game').dom_el,
    Animation = __webpack_require__(35),
    SvgUtils = __webpack_require__(7),
    XLINK_STR = "http://www.w3.org/1999/xlink",
    dom_el = SvgUtils.createElement('svg'),
    COLS_NUM = 4,
    MARGIN_BUTTONS = {
        top: 107.5,
        left: 21.3
    },
    POSITION = {
        width: 79.756,
        height: 22.71
    },
    callBack_fun,
    usedLanguages_array = [],
    logoContainer_el = SvgUtils.createElement('svg',{
        x:20.63,
        y:40
    }),
    explanationTextBlock_el,
    logo_el = SvgUtils.createElement('use', {
            width: "132.996",
            height: "35.583",
            x: "0",
            y: "-35.583",
            transform: "scale (1,-1)",
            overflow: "visible"
        },
        [
            {
                nameSpace: XLINK_STR,
                name: "href",
                value: "#linguagoLogo"
            }]),
    registerLanguage = function (languageId_str) {
        var button_el = (function () {
            var index_num;
            languages_array.forEach(function (element, index) {
                if (element.id === languageId_str) {
                    index_num = index;
                }
            });
            return dom_el.childNodes[index_num];
        }());
        button_el.setAttribute('aria-disabled', true);
        button_el.setAttribute('tabindex', -1);
        Labels.fetchLanguages(languageId_str);
        usedLanguages_array.push(languageId_str);
    };
dom_el.appendChild(logoContainer_el);
logoContainer_el.appendChild(logo_el);
languages_array.forEach(function (element, index) {
    var
        col_num = index % COLS_NUM,
        line_num = Math.floor(index / COLS_NUM),
        button_el = SvgUtils.createElement('svg', {
            x: MARGIN_BUTTONS.left + col_num * POSITION.width,
            y: MARGIN_BUTTONS.top + line_num * POSITION.height
        }),
        button_text = SvgUtils.createElement('text', {
            y: 7,
            x: 12.5,
            fill: 'white',
            'font-size': '5px'
        }),
        bg_el = SvgUtils.createElement('use', {
                width: 50,
                height: 11,
                class: 'background'
            },
            [
                {
                    nameSpace: XLINK_STR,
                    name: "href",
                    value: "#lgButton"
                }
            ]);

    button_text.textContent = element.label;
    button_el.setAttribute('class', 'button');
    button_el.setAttribute('tabindex', 0);
    button_el.appendChild(bg_el);
    button_el.appendChild(button_text);
    button_el.addEventListener('click', function () {
        registerLanguage(element.id);
        callBack_fun();
        dom_el.parentNode.removeChild(dom_el);
    });
    dom_el.setAttribute('class', 'languageChoice_popup');
    dom_el.appendChild(button_el);
});

module.exports = {
    /**
     * Displays the language menu
     * @param {function} p_callBack_fun - The function called when the user has choosen his language;
     */
    display: function (p_callBack_fun) {
        callBack_fun = p_callBack_fun;
        stage_el.appendChild(dom_el);
        Animation.fadeIn (dom_el);
        dom_el.childNodes[0].focus ();
        if (!explanationTextBlock_el) {
            explanationTextBlock_el =  SvgUtils.getMultilineText(
                dom_el,
       Labels.getLabel("choose_another_language"),
                {
                    width:100,
                    x:179.6,
                    y:48.3,
                    lineHeight:8,
                    'font-size':'7.09px',
                    color:'white'
                }
            );
        }

    },
    /**
     * @method
     * @description The function called when the language of the popup changes. This method is called only once from outside this module : when the language is set to the page's language at the start of the application.
     * @todo Check if the first language selection can be integrated in this moduleso this method does not need to be exposed anymore.
     * @param {string} languageId_str - The selected language.
     */
    registerLanguage: registerLanguage
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description Displays the screen the end of each level.
 * @param {function} p_callback_fun -The function called when the user closes the screen
 *
 *
 */
var
    Labels = __webpack_require__(13),
    Config = __webpack_require__(4),
    stage_el = Config('game').dom_el,
    SvgUtils = __webpack_require__(7),
    Animation = __webpack_require__(35),
    callback_fun,
    continueButton_el,
    removeEnterClick_fun,
    popup_el = document.getElementsByClassName('levelPopup')[0],
    closePopup = function () {
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun();
        continueButton_el.removeEventListener('click', closePopup);
        continueButton_el.removeEventListener('touchstart', closePopup);
        document.body.removeEventListener('keydown',listenKey);
    },
    listenKey = function (evt) {
        if (evt.key === "Enter") {
            closePopup();
        }
    },
    textBlock,
    open_bool = false;
popup_el.removeAttribute('style');
popup_el.parentNode.removeChild(popup_el);


module.exports = function (p_callback_fun) {
    callback_fun = p_callback_fun;
    if (!open_bool) {
        Animation.fadeIn (popup_el);
        continueButton_el = popup_el.querySelector('.goButton');
        stage_el.appendChild(popup_el);
        if (!textBlock) {
            textBlock = SvgUtils.getMultilineText(popup_el, Labels.getLabel('nice_work'),
                {
                    x: 125,
                    y: 132,
                    'text-anchor': 'middle',
                    width: 80,
                    lineHeight: 9,
                    'font-size': '7px'
                }
            )
        }
        open_bool = true;
        removeEnterClick_fun =  SvgUtils.simulateEnterClick(continueButton_el, closePopup);
        continueButton_el.addEventListener('click', closePopup);
        continueButton_el.addEventListener('touchstart', closePopup);
        document.body.addEventListener('keydown',listenKey);
    }
};




/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 06/05/2017.
 * @module
 * @description This componenent handles the state and display of the pause button. It is managed by PauseManager.
 */

var
    paused_bool = false,
    Config = __webpack_require__(4),
    PauseManager = __webpack_require__(14),
    SvgUtils = __webpack_require__(7),
    pauseButton = Config('interface').dom_el.querySelector('.pauseButton'),
    togglePause = function (evt) {
            paused_bool = !paused_bool;
            PauseManager.pauseButton = paused_bool;
            pauseButton.setAttribute('aria-selected', paused_bool);
            evt.stopPropagation();
    };
pauseButton.addEventListener('mousedown', togglePause);
pauseButton.addEventListener('touchstart', togglePause);
SvgUtils.simulateEnterClick(pauseButton, togglePause);
module.exports = {};


/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = "  <svg id='game_js' viewBox=\"0 0 336 244\" preserveAspectRatio=\"xMidYMin\" width=\"336\" version=\"1.1\"\r\n         xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" height=\"244\">\r\n        <symbol id=\"linguagoLogo\" viewBox=\"0 -35.583 132.996 35.583\">\r\n            <path fill=\"#FDD302\"\r\n                  d=\"M81.623-10.017c1.916,0.468,2.642,0.572,3.574,0.572c0.932,0,0.005-4.517,0.005-4.517L81.623-10.017z\"/>\r\n            <path fill=\"#253B8C\" d=\"M93.93-2.671l-2.884,0.526c-0.769,0.123-1.446-0.479-0.761-1.89c0.685-1.412,2.171-2.427,2.171-2.427\r\n\t\tl2.911,2.699L93.93-2.671z\"/>\r\n            <path fill=\"#FDD302\"\r\n                  d=\"M92.59-4.653l-0.438,0.365c-0.229,0.191-0.261,0.533-0.069,0.763s0.533,0.261,0.763,0.07l0.438-0.365\"/>\r\n            <path fill=\"#D6B406\" d=\"M92.351-3.952c0.124,0.148,0.393,0.128,0.601-0.045c0.141-0.118,0.218-0.276,0.214-0.412\r\n\t\tc0.132,0.175,0.052,0.47-0.187,0.668c-0.242,0.202-0.557,0.226-0.701,0.052c-0.104-0.125-0.09-0.316,0.016-0.49\r\n\t\tC92.281-4.093,92.3-4.014,92.351-3.952\"/>\r\n            <path fill=\"#FDD302\"\r\n                  d=\"M97.047-8.467l0.438-0.365c0.229-0.191,0.571-0.16,0.763,0.07S98.408-8.191,98.179-8L97.74-7.634\"/>\r\n            <path fill=\"#D6B406\" d=\"M97.779-8.576c0.123,0.148,0.055,0.409-0.153,0.583c-0.142,0.118-0.311,0.165-0.444,0.136\r\n\t\tc0.148,0.162,0.454,0.136,0.691-0.062c0.243-0.202,0.323-0.507,0.179-0.68c-0.104-0.125-0.295-0.147-0.484-0.075\r\n\t\tC97.652-8.669,97.729-8.637,97.779-8.576\"/>\r\n            <path fill=\"#FDD302\" d=\"M92.24-18.146l7.162,13.708c0.894,1.697-1.904,4.025-3.441,2.864l-9.54-7.273\r\n\t\tc-2.825-2.235-0.003-9.437-0.003-9.437\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M94.295-7.248c-0.42-0.641-1.265-0.784-1.887-0.318c-0.623,0.465-0.787,1.362-0.367,2.003\r\n\t\ts1.266,0.784,1.888,0.318S94.715-6.606,94.295-7.248\"/>\r\n            <path fill=\"#22274F\" d=\"M93.349-4.672c0,0,0.033,0.013,0.095,0.031c0.062,0.019,0.15,0.039,0.263,0.047\r\n\t\tc0.111,0.008,0.246,0.005,0.386-0.031c0.14-0.033,0.284-0.102,0.41-0.193c0.062-0.042,0.127-0.099,0.182-0.151\r\n\t\tc0.057-0.054,0.105-0.114,0.145-0.177c0.078-0.128,0.115-0.263,0.129-0.378c0.015-0.116,0.009-0.212-0.004-0.279\r\n\t\tc-0.012-0.066-0.025-0.103-0.025-0.103l-0.028-0.002c0,0-0.019,0.035-0.046,0.092c-0.027,0.055-0.065,0.134-0.111,0.228\r\n\t\tc-0.046,0.091-0.101,0.189-0.163,0.291c-0.03,0.052-0.061,0.105-0.096,0.158c-0.036,0.056-0.073,0.099-0.122,0.147\r\n\t\tc-0.189,0.183-0.449,0.278-0.656,0.299c-0.104,0.013-0.191,0.007-0.252,0.003c-0.063-0.004-0.098-0.01-0.098-0.01L93.349-4.672z\"/>\r\n            <path fill=\"#22274F\" d=\"M96.867-7.728c0,0,0,0.037-0.008,0.098c-0.007,0.061-0.018,0.148-0.049,0.247\r\n\t\tc-0.058,0.2-0.199,0.438-0.413,0.591c-0.056,0.039-0.106,0.068-0.167,0.094c-0.059,0.025-0.116,0.046-0.172,0.065\r\n\t\tc-0.111,0.043-0.219,0.079-0.316,0.108c-0.102,0.028-0.186,0.051-0.244,0.067c-0.063,0.016-0.1,0.028-0.1,0.028l-0.003,0.028\r\n\t\tc0,0,0.034,0.02,0.097,0.044c0.063,0.024,0.156,0.048,0.273,0.055c0.115,0.007,0.256-0.005,0.396-0.058\r\n\t\tc0.069-0.027,0.138-0.065,0.2-0.111c0.063-0.043,0.129-0.098,0.182-0.151c0.113-0.107,0.207-0.236,0.265-0.368\r\n\t\tc0.062-0.13,0.089-0.262,0.101-0.373c0.012-0.111,0.009-0.203,0.001-0.268c-0.007-0.063-0.013-0.099-0.013-0.099L96.867-7.728z\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M94.125-7.105c-0.555-0.529-0.542-1.386,0.029-1.914c0.57-0.527,1.482-0.526,2.036,0.003\r\n\t\tc0.555,0.529,0.542,1.386-0.029,1.914C95.59-6.575,94.679-6.576,94.125-7.105\"/>\r\n            <path fill=\"#22274F\" d=\"M93.964-6.924c-0.243-0.292-0.677-0.332-0.97-0.089c-0.292,0.243-0.332,0.677-0.089,0.97\r\n\t\ts0.678,0.332,0.97,0.088C94.168-6.197,94.207-6.631,93.964-6.924\"/>\r\n            <path fill=\"#22274F\" d=\"M95.591-8.278c-0.243-0.292-0.677-0.332-0.97-0.089c-0.292,0.244-0.332,0.678-0.088,0.97\r\n\t\tc0.242,0.292,0.677,0.332,0.969,0.089C95.795-7.552,95.834-7.986,95.591-8.278\"/>\r\n            <path fill=\"#FFFFFF\"\r\n                  d=\"M93.838-10.761c-3.259-0.714-3.18,2.557-3.18,2.557C91.082-8.77,92.852-10.449,93.838-10.761\"/>\r\n            <path fill=\"#EA7D00\" d=\"M94.484-11.011l-0.582-0.09l-0.301-0.046c-0.111-0.01-0.225-0.023-0.336-0.029\r\n\t\tc-0.111,0-0.22-0.01-0.332-0.001c-0.111,0.005-0.223,0.012-0.334,0.031c-0.111,0.012-0.223,0.043-0.333,0.067\r\n\t\tc-0.109,0.036-0.22,0.067-0.324,0.117c-0.106,0.043-0.208,0.103-0.306,0.162l-0.144,0.098l-0.134,0.11\r\n\t\tc-0.084,0.078-0.164,0.16-0.236,0.248c-0.072,0.088-0.138,0.18-0.195,0.275c-0.117,0.191-0.206,0.394-0.273,0.6\r\n\t\tc-0.068,0.206-0.115,0.416-0.146,0.626c-0.014,0.105-0.025,0.211-0.033,0.317c-0.006,0.108-0.01,0.209-0.005,0.326l0.021,0.575\r\n\t\tl0.32-0.466c0.088-0.129,0.197-0.261,0.307-0.388c0.109-0.128,0.223-0.253,0.34-0.377c0.232-0.247,0.475-0.488,0.725-0.719\r\n\t\tc0.25-0.231,0.508-0.455,0.78-0.661c0.272-0.203,0.556-0.4,0.876-0.524L94.484-11.011z M93.268-10.518\r\n\t\tc-0.122,0.065-0.242,0.132-0.359,0.204c-0.293,0.182-0.574,0.384-0.849,0.594c-0.274,0.21-0.541,0.431-0.801,0.661\r\n\t\tc-0.13,0.115-0.258,0.232-0.384,0.354c-0.125,0.123-0.248,0.245-0.367,0.389l0.34,0.109c0.003-0.085,0.012-0.186,0.023-0.279\r\n\t\tc0.014-0.095,0.029-0.189,0.049-0.283c0.039-0.187,0.094-0.369,0.164-0.542c0.069-0.173,0.156-0.337,0.26-0.484\r\n\t\tc0.051-0.074,0.107-0.143,0.168-0.208c0.061-0.065,0.126-0.123,0.193-0.177l0.105-0.076l0.111-0.066\r\n\t\tc0.076-0.039,0.152-0.079,0.236-0.105c0.08-0.033,0.166-0.049,0.25-0.072c0.088-0.012,0.173-0.032,0.264-0.035\r\n\t\tc0.088-0.01,0.178-0.009,0.27-0.007c0.09-0.002,0.182,0.014,0.273,0.019C93.232-10.523,93.25-10.52,93.268-10.518\"/>\r\n            <path fill=\"#017BBC\" d=\"M99.837-1.528l-1.13,0.94c-1.078,0.897-2.68,0.751-3.578-0.328l-1.36-1.634\r\n\t\tc-0.079-0.095-0.065-0.236,0.028-0.315l4.691-3.905c0.096-0.079,0.236-0.066,0.315,0.029l1.36,1.634\r\n\t\tC101.063-4.028,100.915-2.426,99.837-1.528\"/>\r\n            <polygon fill=\"#0072BF\" points=\"85.48,-7.951 93.014,-28.665 77.5,-28.755 \t\"/>\r\n            <path fill=\"#FF00FF\" d=\"M12.236-3.931c1.451,0,2.902-0.193,4.063-0.193c1.258,0,2.709,0.193,3.531,0.193\r\n\t\tc0.581,0,0.774-0.145,0.774-0.242c0-0.194-0.193-0.339-0.581-0.436c-2.128-0.435-2.176-0.726-2.37-4.208\r\n\t\tc-0.048-0.822-0.048-4.982-0.048-9.384c0-4.741,0.048-9.723,0.097-10.642c0.146-1.983,0.242-3.387,0.677-3.918\r\n\t\tc0.532-0.678,1.838-1.21,5.998-1.21c2.564,0,3.822,0.097,4.547,0.242c1.112,0.193,2.031,1.209,2.999,2.999\r\n\t\tc0.242,0.436,0.532,0.678,0.726,0.678s0.097-0.678-0.097-1.21c-0.145-0.436-0.967-2.902-1.209-3.241\r\n\t\tc-0.29-0.387-0.629-0.483-0.822-0.483c-0.484,0-4.257-0.048-6.627,0.097c-2.467,0.097-6.095,0.242-7.546,0.242\r\n\t\tc-1.5,0-3.58-0.242-4.208-0.242c-0.581,0-0.968,0.097-0.968,0.338c0,0.194,0.436,0.34,0.822,0.388\r\n\t\tc2.177,0.388,2.419,1.112,2.564,2.563c0.193,1.983,0.193,5.176,0.193,11.9c0,6.578-0.048,10.013-0.145,11.561\r\n\t\tc-0.145,2.854-0.242,3.145-2.467,3.531c-0.532,0.097-0.677,0.242-0.677,0.436C11.462-4.076,11.704-3.931,12.236-3.931\"/>\r\n            <path fill=\"#00ACE4\" d=\"M26.684-16.444l-1.785-8.432c-0.075-0.322-0.099-0.57-0.099-0.793c0-0.694,0.322-0.918,1.016-0.918\r\n\t\tc0.446,0,0.645,0.075,0.794,0.149c-0.124-1.761-1.389-2.554-2.728-2.554c-1.488,0-2.653,0.893-2.653,2.975\r\n\t\tc0,0.472,0.075,1.018,0.199,1.612l1.686,7.96H26.684z M25.568-11.163c1.091,0,1.983-0.893,1.983-1.983\r\n\t\tc0-1.091-0.893-1.959-1.983-1.959s-1.959,0.868-1.959,1.959C23.609-12.056,24.478-11.163,25.568-11.163\"/>\r\n            <path fill=\"#FF9300\" d=\"M40.72-28.843v0.789c2.544,0.176,2.895,1.447,2.895,2.939v10.043c0,3.816-1.403,5.746-3.903,5.746\r\n\t\tc-3.158,0-5.351-2.105-6.097-4.298v-11.491c0-1.447,0.132-2.764,2.851-2.895v-0.834h-9.079v0.789\r\n\t\tc2.544,0.176,2.895,1.447,2.895,2.939v12.587c0,1.009-0.219,2.062-2.851,2.281v0.921l6.184,1.667v-4.254\r\n\t\tc0.79,1.842,3.465,4.254,6.755,4.254c6.184,0,6.579-5.526,6.579-7.983v-9.473c0-1.447,0.132-2.764,2.851-2.895v-0.834H40.72z\"/>\r\n            <path fill=\"#D6E000\" d=\"M49.606-32.544c0.823-0.576,1.974-0.959,3.509-0.959c2.413,0,4.332,1.288,5.264,5.428l0.548,2.521h-0.082\r\n\t\tc-1.234-2.248-3.098-3.344-5.072-3.344c-2.659,0-3.893,2.303-3.893,4.496c0,4.551,3.399,9.019,8.087,9.019\r\n\t\tc1.316,0,2.988-0.466,3.811-0.905L59.75-27.198c-0.576-3.016-1.343-4.797-2.604-5.922c-1.233-1.15-2.933-1.452-4.276-1.452\r\n\t\tc-1.508,0-2.961,0.411-3.729,0.987L49.606-32.544z M60.408-17.027c-0.494,0.247-1.48,0.576-2.687,0.576\r\n\t\tc-3.893,0-6.524-3.975-6.552-7.704c-0.027-1.535,0.466-3.674,2.988-3.674c2.357,0,4.77,3.099,5.291,5.867L60.408-17.027z\"/>\r\n            <path fill=\"#FFAE00\" d=\"M74.99-27.148c0-0.524,0.096-1.694-1.121-1.694c-0.979,0-1.146,0.812-1.146,1.6v0.381l-1.861-1.217\r\n\t\tc-0.739-0.478-1.359-0.764-1.98-0.764h-1.694c-0.645,0-1.36,0.191-2.124,0.836c-1.027,0.883-1.002,1.861-1.05,3.102l-0.239,7.208\r\n\t\tc-0.024,0.835,0.096,1.719,1.146,1.719c0.979,0,1.098-0.835,1.122-1.575l0.238-7.041c0.024-0.525,0.048-1.146,0.239-1.479\r\n\t\tc0.191-0.335,0.788-0.478,1.336-0.478h0.764c0.263,0,0.501,0.072,0.716,0.215l3.365,2.124v6.659c0,0.787,0.168,1.575,1.146,1.575\r\n\t\ts1.145-0.788,1.145-1.575V-27.148z\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M81.049-21.231l-2.676-7.611h-1.58l7.869,21.738h1.483l7.837-21.738h-1.58l-2.742,7.611H81.049z\r\n\t\t M89.177-19.941l-2.645,7.257c-0.517,1.516-0.806,2.612-1.129,3.838h-0.064c-0.322-1.258-0.677-2.387-1.128-3.773l-2.678-7.321\r\n\t\tH89.177z\"/>\r\n            <path fill=\"#FF5A19\" d=\"M100.939-31.036c0.871-0.516,2.773-0.871,4.128-0.871c2.322,0,4.032,1.033,4.709,4.193l0.258,1.354h-0.064\r\n\t\tc-1.226-1.612-2.645-2.354-4.515-2.354c-3.129,0-5.031,2.548-5.064,5.645c-0.031,5.192,3.709,10.353,10.579,10.353\r\n\t\tc2.226,0,4.161-0.419,5.837-1.097l-2.387-12.998c-0.548-2.902-1.451-5.482-3.321-6.998c-1.71-1.354-3.999-1.773-6.095-1.773\r\n\t\tc-2.129,0-4.064,0.387-5.161,1L100.939-31.036z M111.776-16.555c-0.354,0.161-1.032,0.29-1.678,0.29\r\n\t\tc-2.806,0-4.806-3.129-4.806-6.096c0-1.612,0.71-2.773,2.129-2.773c1.516,0,3.031,1.709,3.548,4.354L111.776-16.555z\"/>\r\n            <path fill=\"#FF9300\" d=\"M125.224-29.198c-4.192,0-7.481,3.097-7.481,8.031c0,5.225,3.45,8.289,7.74,8.289\r\n\t\tc4.482,0,7.514-3.257,7.514-7.998c0-5.807-4.031-8.322-7.74-8.322H125.224z M125.354-27.069c2.709,0,4.74,2.549,4.74,6.096\r\n\t\tc0,2.645-1.322,5.967-4.676,5.967c-3.322,0-4.773-3.096-4.773-6.063c0-3.419,1.935-5.999,4.676-5.999H125.354z\"/>\r\n            <path d=\"M82.038-10.475l0.969-0.613c0.787-0.823,2.218-4.304,1.098-4.101l-3.896,0.066C79.5-12.759,80.537-11.664,82.038-10.475\"/>\r\n            <path d=\"M92.168-19.072l-0.838-0.782c-0.996-0.554-3.768,0.985-3.287,2.018l0.872,1.163C91.11-17.287,92.015-17.319,92.168-19.072\"\r\n            />\r\n            <path fill=\"#FDD302\" d=\"M81.623-10.017l3.811-3.985c0.787-0.823,0.061-2.173-1.06-1.969l-4.683,0.849\r\n\t\tC78.982-12.759,80.121-11.206,81.623-10.017\"/>\r\n            <path fill=\"#FDD302\" d=\"M92.079-22.808l-5.598,4.921c-0.575,0.983,0.442,2.128,1.485,1.672l4.36-1.906\r\n\t\tC92.982-19.063,93.436-21.419,92.079-22.808\"/>\r\n            <path fill=\"#ADC80C\" d=\"M8.148-22.754c0,0,0.013,0.693-0.022,1.731c-0.016,0.52-0.042,1.125-0.079,1.772\r\n\t\tc-0.038,0.646-0.083,1.34-0.169,2.015c-0.013,0.083-0.022,0.169-0.038,0.248c-0.015,0.081-0.027,0.159-0.055,0.226\r\n\t\tc-0.019,0.052-0.057,0.106-0.063,0.099c-0.004-0.003,0.01-0.013,0.02-0.019c0.008-0.006,0.009-0.005-0.005-0.013\r\n\t\tc-0.026-0.012-0.08-0.048-0.131-0.09c-0.052-0.042-0.106-0.094-0.16-0.147c-0.107-0.109-0.213-0.229-0.319-0.35\r\n\t\ts-0.212-0.244-0.325-0.365l-0.051-0.05c-0.013-0.013-0.044-0.039-0.066-0.057c-0.048-0.039-0.087-0.067-0.134-0.096\r\n\t\tc-0.09-0.057-0.184-0.105-0.284-0.141c-0.199-0.072-0.422-0.1-0.644-0.063c-0.222,0.036-0.431,0.14-0.585,0.273\r\n\t\tc-0.156,0.132-0.265,0.283-0.345,0.424c-0.079,0.142-0.136,0.279-0.175,0.404c-0.082,0.253-0.114,0.466-0.137,0.639\r\n\t\tc-0.022,0.174-0.029,0.307-0.032,0.397s-0.005,0.139-0.005,0.139c-0.012,0.328,0.244,0.604,0.572,0.617\r\n\t\tc0.328,0.012,0.604-0.244,0.617-0.572c0.001-0.026,0-0.052-0.002-0.077l-0.001-0.016c0,0-0.004-0.039-0.011-0.11\r\n\t\tC5.509-16.006,5.501-16.111,5.5-16.24c-0.001-0.128,0.002-0.284,0.03-0.44c0.025-0.155,0.08-0.311,0.151-0.397\r\n\t\tc0.035-0.045,0.072-0.074,0.125-0.096c0.053-0.021,0.127-0.029,0.213-0.013c0.042,0.007,0.086,0.022,0.129,0.04\r\n\t\tc0.021,0.008,0.045,0.022,0.06,0.029c0.008,0.006,0.009,0.002,0.025,0.015l0.023,0.018l0.012,0.009l0.005,0.004\r\n\t\tc0.01,0.009-0.01-0.009-0.007-0.007l0.003,0.002c0.115,0.092,0.235,0.195,0.361,0.301s0.257,0.217,0.402,0.327\r\n\t\tc0.074,0.055,0.151,0.109,0.239,0.161c0.09,0.051,0.184,0.104,0.323,0.136c0.068,0.016,0.155,0.022,0.248,0.003\r\n\t\tc0.095-0.019,0.185-0.077,0.243-0.138c0.115-0.129,0.142-0.242,0.169-0.355c0.036-0.201,0.046-0.373,0.058-0.552\r\n\t\tc0.033-0.706,0.023-1.398,0.011-2.051c-0.014-0.651-0.037-1.258-0.061-1.778C8.216-22.063,8.148-22.754,8.148-22.754\"/>\r\n            <path fill=\"#ADC80C\" d=\"M16.853-22.754c0,0-0.068,0.69-0.114,1.73c-0.024,0.521-0.047,1.127-0.061,1.778\r\n\t\tc-0.013,0.652-0.022,1.345,0.011,2.051c0.011,0.179,0.021,0.352,0.057,0.552c0.027,0.113,0.055,0.226,0.17,0.355\r\n\t\tc0.058,0.061,0.147,0.119,0.243,0.138c0.093,0.02,0.18,0.013,0.249-0.003c0.139-0.032,0.233-0.085,0.323-0.136\r\n\t\tc0.088-0.052,0.165-0.106,0.239-0.161c0.146-0.109,0.277-0.22,0.402-0.327c0.126-0.106,0.246-0.209,0.361-0.301l0.002-0.002\r\n\t\tc0.003-0.002-0.017,0.016-0.007,0.007l0.006-0.004l0.012-0.009l0.023-0.018c0.017-0.012,0.017-0.009,0.026-0.015\r\n\t\tc0.014-0.007,0.039-0.021,0.06-0.029c0.042-0.018,0.086-0.033,0.129-0.04c0.085-0.016,0.16-0.007,0.213,0.013\r\n\t\tc0.053,0.022,0.089,0.051,0.125,0.096c0.071,0.087,0.126,0.242,0.151,0.397c0.027,0.156,0.031,0.312,0.03,0.44\r\n\t\tc-0.001,0.129-0.01,0.234-0.017,0.306c-0.007,0.072-0.011,0.11-0.011,0.11l-0.001,0.012c-0.032,0.327,0.208,0.618,0.535,0.649\r\n\t\tc0.327,0.032,0.618-0.208,0.65-0.534c0.002-0.026,0.003-0.055,0.002-0.08c0,0-0.001-0.048-0.005-0.139\r\n\t\tc-0.004-0.09-0.011-0.224-0.033-0.397c-0.022-0.173-0.055-0.386-0.136-0.639c-0.039-0.125-0.096-0.262-0.175-0.404\r\n\t\tc-0.08-0.142-0.188-0.292-0.345-0.424c-0.154-0.133-0.363-0.238-0.585-0.273c-0.222-0.037-0.445-0.009-0.644,0.063\r\n\t\tc-0.101,0.036-0.195,0.083-0.285,0.141c-0.047,0.029-0.085,0.058-0.134,0.096c-0.022,0.018-0.053,0.044-0.066,0.057l-0.052,0.05\r\n\t\tc-0.112,0.122-0.219,0.244-0.325,0.365c-0.106,0.121-0.212,0.241-0.319,0.35c-0.054,0.054-0.107,0.105-0.16,0.147\r\n\t\tc-0.051,0.042-0.105,0.078-0.131,0.09c-0.014,0.008-0.014,0.006-0.005,0.013c0.01,0.005,0.023,0.015,0.02,0.019\r\n\t\tc-0.006,0.007-0.045-0.047-0.063-0.099c-0.027-0.067-0.04-0.145-0.055-0.226c-0.016-0.079-0.025-0.165-0.038-0.248\r\n\t\tc-0.085-0.675-0.131-1.369-0.169-2.015c-0.037-0.647-0.063-1.253-0.079-1.772C16.84-22.061,16.853-22.754,16.853-22.754\"/>\r\n            <path fill=\"#ADC80C\" d=\"M19.547-24.547c0-3.901-3.162-7.063-7.063-7.063c-3.901,0-7.063,3.162-7.063,7.063\r\n\t\tc0,3.9,3.162,7.063,7.063,7.063C16.385-17.484,19.547-20.646,19.547-24.547\"/>\r\n            <path fill=\"#ADC80C\" d=\"M23.121-25.177c-0.173-1.094-1.252-3.286-2.349-3.286c-0.922,0-1.095,0.634-1.671,1.614l-0.23,1.728\r\n\t\tl0.676,0.574c0,0,0.534-1.323,0.764-1.784s0.576-0.922,0.864-0.402c0.288,0.518,1.051,1.765,1.051,1.765s0.318,0.558-0.144,0.671\r\n\t\tc-0.461,0.113-1.231,0.303-1.13,0.713c0.101,0.411,0.434,0.438,0.871,0.222s0.718-0.177,0.833,0.067\r\n\t\tc0.114,0.244-0.003,0.871-0.273,1.102c-0.27,0.229,0.549,0.463,0.883,0.271c0.334-0.19,0.324-0.896-0.085-1.23\r\n\t\tc0.486,0.207,0.741,0.58,0.688,1.028s0.808-0.253,0.732-0.562c-0.076-0.308-0.573-1.002-0.906-1.028\r\n\t\tc0.518-0.146,0.531-0.017,0.75,0.255c0.219,0.271,0.598-0.129,0.2-0.584s-1.171-0.647-1.337-0.625\r\n\t\tC23.142-24.647,23.192-24.888,23.121-25.177\"/>\r\n            <path fill=\"#ADC80C\" d=\"M1.699-25.177c0.173-1.094,1.252-3.286,2.349-3.286c0.922,0,1.095,0.634,1.671,1.614l0.23,1.728\r\n\t\tl-0.444,0.544c0,0-0.766-1.293-0.997-1.754s-0.576-0.922-0.864-0.402c-0.288,0.518-1.051,1.765-1.051,1.765\r\n\t\ts-0.319,0.558,0.143,0.671s1.231,0.303,1.13,0.713c-0.101,0.411-0.434,0.438-0.871,0.222s-0.718-0.177-0.833,0.067\r\n\t\ts0.003,0.871,0.273,1.102c0.27,0.229-0.549,0.463-0.883,0.271c-0.334-0.19-0.324-0.896,0.085-1.23\r\n\t\tc-0.486,0.207-0.741,0.58-0.688,1.028c0.053,0.448-0.808-0.253-0.732-0.562c0.076-0.308,0.573-1.002,0.906-1.028\r\n\t\tc-0.518-0.146-0.531-0.017-0.75,0.255c-0.219,0.271-0.599-0.129-0.2-0.584s1.171-0.647,1.337-0.625\r\n\t\tC1.678-24.647,1.628-24.888,1.699-25.177\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M12.585-20.941c0-1.368-1.086-2.478-2.427-2.478S7.73-22.31,7.73-20.941s1.087,2.478,2.428,2.478\r\n\t\tS12.585-19.573,12.585-20.941\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M17.238-20.941c0-1.368-1.087-2.478-2.428-2.478c-1.34,0-2.427,1.109-2.427,2.478s1.087,2.478,2.427,2.478\r\n\t\tC16.151-18.463,17.238-19.573,17.238-20.941\"/>\r\n            <path fill=\"#1C1C1B\" d=\"M12.543-21.275c0-0.798-0.634-1.444-1.416-1.444s-1.415,0.646-1.415,1.444s0.633,1.444,1.415,1.444\r\n\t\tS12.543-20.478,12.543-21.275\"/>\r\n            <path fill=\"#1C1C1B\" d=\"M15.256-21.275c0-0.798-0.634-1.444-1.416-1.444s-1.415,0.646-1.415,1.444s0.633,1.444,1.415,1.444\r\n\t\tS15.256-20.478,15.256-21.275\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M11.752-25.542c0.715-1.603-1.601-3.344-2.644-0.48\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M12.198-25.808c-0.822-1.928,1.674-3.506,2.886-0.102\"/>\r\n            <path fill=\"#ADC80C\" d=\"M9.045-30.233c-0.741-0.803-1.111-0.927-1.05-1.421s1.42-1.297,1.544-1.976\r\n\t\tc0.123-0.68-0.618-0.309-1.112-0.371c-0.25-0.031-0.452-0.252-0.591-0.463c-0.114-0.172,0.015-0.401,0.221-0.401h2.717\r\n\t\tc0.081,0.632,0.056,1.04-0.353,1.651c-0.383,0.575-0.791,0.816-0.821,1.313c-0.028,0.475,1.433,0.729,1.433,0.729\"/>\r\n            <path fill=\"#ADC80C\" d=\"M15.83-30.233c0.741-0.803,1.111-0.927,1.05-1.421c-0.062-0.494-1.42-1.297-1.544-1.976\r\n\t\tc-0.124-0.68,0.618-0.309,1.111-0.371c0.25-0.031,0.452-0.252,0.591-0.463c0.114-0.172-0.015-0.401-0.221-0.401h-2.716\r\n\t\tc-0.081,0.632-0.056,1.04,0.353,1.651c0.383,0.575,0.791,0.816,0.821,1.313c0.028,0.475-1.433,0.729-1.433,0.729\"/>\r\n            <path fill=\"#ADC80C\" d=\"M5.455-24.729c3.526-1.736,7.53-2.367,14.053,0.102\"/>\r\n            <path fill=\"#E3007D\" d=\"M5.455-24.729c0,0,0.219-0.066,0.596-0.197c0.188-0.067,0.421-0.128,0.68-0.215\r\n\t\tc0.129-0.045,0.272-0.078,0.42-0.119c0.149-0.038,0.302-0.088,0.465-0.129c0.328-0.072,0.679-0.164,1.056-0.229\r\n\t\tc0.188-0.037,0.379-0.076,0.579-0.098s0.399-0.061,0.606-0.08s0.417-0.038,0.629-0.057c0.212-0.017,0.429-0.018,0.646-0.03\r\n\t\tc0.217-0.016,0.437-0.005,0.656-0.005c0.22,0.002,0.441-0.003,0.663,0.017c0.221,0.013,0.442,0.024,0.663,0.036\r\n\t\tc0.22,0.023,0.439,0.045,0.656,0.067c0.218,0.018,0.433,0.052,0.646,0.082s0.423,0.061,0.63,0.09\r\n\t\tc0.207,0.037,0.408,0.077,0.608,0.109c0.199,0.034,0.395,0.063,0.583,0.108c0.189,0.041,0.373,0.08,0.55,0.117\r\n\t\tc0.179,0.035,0.352,0.067,0.515,0.11c0.328,0.081,0.632,0.149,0.901,0.208c0.269,0.067,0.502,0.126,0.695,0.174\r\n\t\tc0.387,0.094,0.612,0.141,0.612,0.141s-0.202-0.107-0.562-0.279c-0.181-0.085-0.398-0.195-0.655-0.304\r\n\t\tc-0.257-0.106-0.548-0.226-0.87-0.348c-0.319-0.127-0.676-0.235-1.051-0.356c-0.375-0.121-0.781-0.218-1.199-0.326\r\n\t\tc-0.21-0.049-0.427-0.086-0.646-0.129c-0.219-0.043-0.44-0.088-0.667-0.111c-0.226-0.027-0.454-0.057-0.682-0.086\r\n\t\tc-0.231-0.014-0.462-0.029-0.694-0.044c-0.231-0.019-0.464-0.013-0.695-0.012s-0.462,0.001-0.69,0.022\r\n\t\tc-0.229,0.019-0.455,0.03-0.678,0.059c-0.222,0.033-0.441,0.064-0.657,0.097c-0.427,0.083-0.839,0.171-1.22,0.29\r\n\t\tc-0.385,0.101-0.735,0.243-1.059,0.363c-0.319,0.134-0.608,0.26-0.858,0.389c-0.25,0.129-0.467,0.24-0.637,0.344\r\n\t\tC5.647-24.854,5.455-24.729,5.455-24.729\"/>\r\n        </symbol>\r\n        <svg id=\"app_js\" overflow=\"visible\" width=\"330\" height=\"200\" x=\"3\" y=\"40\">\r\n            <rect id='background' width=\"500\" y='-100' x='-100' height=\"344\"></rect>\r\n            <symbol id=\"lgButton\" viewBox=\"-25.043 -5.537 50.087 11.075\">\r\n                <path fill=\"#689B4A\" d=\"M23.908-3.779h-42.279c-0.627,0-1.136,0.509-1.136,1.136v5.622c0,0.627,0.508,1.136,1.136,1.136h42.279\r\n\t\tc0.627,0,1.136-0.509,1.136-1.136v-5.622C25.044-3.271,24.536-3.779,23.908-3.779\"/>\r\n                <path fill=\"#B5C832\" d=\"M-14.13,0c0-2.969-2.407-5.375-5.376-5.375c-2.969,0-5.376,2.406-5.376,5.375s2.407,5.376,5.376,5.376\r\n\t\tC-16.538,5.376-14.13,2.969-14.13,0\"/>\r\n                <g>\r\n                    <path fill=\"#FFFFFF\" d=\"M-19.506-5.537c-3.053,0-5.537,2.484-5.537,5.537c0,3.054,2.484,5.537,5.537,5.537S-13.969,3.054-13.969,0\r\n\t\t\tC-13.969-3.053-16.453-5.537-19.506-5.537z M-19.506,5.215c-2.875,0-5.215-2.34-5.215-5.215s2.339-5.215,5.215-5.215\r\n\t\t\ts5.215,2.34,5.215,5.215S-16.631,5.215-19.506,5.215z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"#FFFFFF\" d=\"M-20.205-3.387c-0.124,0-0.248,0.047-0.342,0.143c-0.189,0.188-0.189,0.494,0,0.684L-17.986,0\r\n\t\t\tl-2.561,2.561c-0.189,0.189-0.189,0.496,0,0.685c0.189,0.189,0.495,0.189,0.684,0l2.903-2.903c0.188-0.188,0.188-0.494,0-0.684\r\n\t\t\tl-2.903-2.902C-19.958-3.34-20.082-3.387-20.205-3.387z\"/>\r\n                </g>\r\n\r\n                <g opacity=\"0.15\">\r\n                    <g>\r\n                        <defs>\r\n                            <polygon id=\"SVGID_1a_\"\r\n                                     points=\"-24.787,-4.74 -17.302,-4.74 -17.302,3.238 -24.787,3.238 \t\t\t\t\"/>\r\n                        </defs>\r\n                        <clipPath id=\"SVGID_2b_\">\r\n                            <use xlink:href=\"#SVGID_1a_\" overflow=\"visible\"/>\r\n                        </clipPath>\r\n                        <path clip-path=\"url(#SVGID_2b_)\"\r\n                              d=\"M-22.043-4.74L-17.302,0l-3.237,3.238l-4.248-4.248C-24.429-2.758-23.401-3.981-22.043-4.74\"\r\n                        />\r\n                    </g>\r\n                </g>\r\n            </symbol>\r\n            <symbol id=\"avatar\" viewBox=\"-47.703 -47.703 95.406 95.406\">\r\n                <path fill=\"#00FFFF\" d=\"M12.141-43.059L47.324-5.924C44.753-26.66,28.884-43.26,8.509-46.931\r\n\t\tC10.03-45.977,11.288-44.646,12.141-43.059z\"/>\r\n                <path fill=\"#00FFFF\" d=\"M-28.956,12.614c0.559-1.427,3.951-1.411,4.786-0.351c0.063,0.079,0.142,0.191,0.225,0.312\r\n\t\tc1.868-0.192,3.474-1.454,4.063-3.267l5.377-23.467c-1.897-0.292-3.934-0.792-5.819-1.644c-5.817-2.632-5.263-6.279-2.54-7.895\r\n\t\tl9.654-5.449c-0.052-0.114-0.084-0.239-0.084-0.373v-8.655c0-3.707,1.957-6.949,4.888-8.774C-30.741-42.976-47.703-23.476-47.703,0\r\n\t\tc0,4.368,0.599,8.595,1.698,12.614H-28.956z\"/>\r\n                <path fill=\"#00D9D7\" d=\"M13.366-38.175v8.655c0,0.502-0.407,0.909-0.909,0.909h-1.001l1.066,4.655h2.166\r\n\t\tc1.217,0,2.205,0.988,2.205,2.205c0,1.218-0.988,2.205-2.205,2.205h-1.156l6.611,28.854c0.59,1.813,2.196,3.075,4.064,3.267\r\n\t\tc0.083-0.12,0.163-0.232,0.225-0.312c0.834-1.06,4.226-1.076,4.785,0.351h16.787c1.1-4.019,1.698-8.246,1.698-12.614\r\n\t\tc0-2.007-0.139-3.981-0.379-5.924L12.141-43.059C12.921-41.604,13.366-39.942,13.366-38.175z\"/>\r\n                <path fill=\"#253A8E\" d=\"M-14.455-19.546c-1.218,0-2.205-0.987-2.205-2.205c0-1.217,0.987-2.205,2.205-2.205h2.194l1.066-4.655\r\n\t\th-1.191c-0.369,0-0.683-0.221-0.825-0.536l-9.654,5.449c-2.723,1.616-3.277,5.263,2.54,7.895c1.885,0.853,3.922,1.353,5.819,1.644\r\n\t\tl1.234-5.387H-14.455z\"/>\r\n                <path fill=\"#FED402\" d=\"M-16.66-21.751c0,1.218,0.987,2.205,2.205,2.205h1.183l0.683-2.979c-0.042-0.001-0.08-0.012-0.122-0.012\r\n\t\tc-1.102,0-1.995,0.637-1.995,1.423c0,0.323,0.153,0.62,0.407,0.859c-0.781-0.268-1.321-0.836-1.321-1.496\r\n\t\tc0-0.917,1.042-1.661,2.327-1.661c0.312,0,0.608,0.044,0.879,0.124l0.153-0.667h-2.194C-15.673-23.956-16.66-22.968-16.66-21.751z\"\r\n                />\r\n                <path fill=\"#D7B606\" d=\"M-15.62-21.751c0,0.66,0.54,1.228,1.321,1.496c-0.254-0.239-0.407-0.536-0.407-0.859\r\n\t\tc0-0.786,0.893-1.423,1.995-1.423c0.042,0,0.081,0.01,0.122,0.012l0.175-0.763c-0.271-0.079-0.568-0.124-0.879-0.124\r\n\t\tC-14.578-23.412-15.62-22.668-15.62-21.751z\"/>\r\n                <path fill=\"#FED402\" d=\"M13.526-23.412c1.285,0,2.326,0.744,2.326,1.661c0,0.66-0.539,1.228-1.32,1.496\r\n\t\tc0.254-0.239,0.406-0.536,0.406-0.859c0-0.786-0.893-1.423-1.994-1.423c-0.033,0-0.062,0.008-0.095,0.009l0.683,2.981h1.156\r\n\t\tc1.217,0,2.205-0.987,2.205-2.205c0-1.217-0.988-2.205-2.205-2.205h-2.166l0.152,0.662C12.938-23.369,13.225-23.412,13.526-23.412z\r\n\t\t\"/>\r\n                <path fill=\"#D7B606\" d=\"M14.938-21.114c0,0.323-0.152,0.62-0.406,0.859c0.781-0.268,1.32-0.836,1.32-1.496\r\n\t\tc0-0.917-1.041-1.661-2.326-1.661c-0.302,0-0.588,0.043-0.852,0.118l0.175,0.767c0.033-0.001,0.062-0.009,0.095-0.009\r\n\t\tC14.046-22.537,14.938-21.9,14.938-21.114z\"/>\r\n                <path fill=\"#FED402\" d=\"M-18.063,23.707c-1.837-4.345-4.757-9.511-5.882-11.132c1.868-0.192,3.474-1.454,4.063-3.267l5.377-23.467\r\n\t\tl1.234-5.387l0.683-2.979l0.175-0.763l0.153-0.667l1.066-4.655h22.65l1.066,4.655l0.152,0.662l0.175,0.767l0.683,2.981\r\n\t\tl6.611,28.854c0.59,1.813,2.196,3.075,4.064,3.267c-1.125,1.621-4.044,6.788-5.881,11.132L0.131,23.863L-18.063,23.707z\r\n\t\t M10.759-4.675L8.301-4.019c-0.339,0.09-0.665,0.213-1.008,0.274s-0.679,0.146-1.026,0.18C5.579-3.467,4.886-3.416,4.192-3.381\r\n\t\tc-1.385,0.067-2.775,0.038-4.16-0.035C-1.353-3.49-2.736-3.61-4.108-3.778c-0.686-0.085-1.37-0.181-2.046-0.295\r\n\t\tc-0.673-0.116-1.351-0.245-1.968-0.416l-2.202-0.609l1.419,1.837c0.291,0.377,0.566,0.683,0.866,1.004\r\n\t\tC-7.741-1.943-7.431-1.642-7.11-1.35c0.643,0.58,1.338,1.113,2.087,1.581c0.748,0.467,1.555,0.867,2.416,1.161\r\n\t\ts1.779,0.478,2.716,0.513c0.469,0.011,0.939-0.007,1.408-0.067c0.463-0.07,0.933-0.148,1.379-0.291\r\n\t\tC3.353,1.43,3.778,1.241,4.213,1.068c0.409-0.211,0.839-0.403,1.218-0.657c0.398-0.232,0.764-0.499,1.125-0.773\r\n\t\tc0.375-0.263,0.688-0.577,1.035-0.866c0.332-0.308,0.652-0.643,0.977-0.968L9.386-3.12L10.759-4.675z M1.821-21.71l0.082,0.079\r\n\t\tc0,0,0.148-0.061,0.381-0.172c0.229-0.102,0.553-0.248,0.943-0.423c0.379-0.163,0.811-0.33,1.27-0.484\r\n\t\tc0.227-0.086,0.463-0.172,0.709-0.245c0.258-0.078,0.489-0.117,0.768-0.141c1.07-0.098,2.13,0.304,2.83,0.772\r\n\t\tc0.354,0.229,0.617,0.476,0.798,0.646c0.181,0.174,0.28,0.286,0.28,0.286l0.091-0.069c0,0-0.07-0.127-0.216-0.344\r\n\t\tc-0.144-0.22-0.371-0.517-0.698-0.835c-0.628-0.651-1.79-1.288-3.072-1.368c-0.303-0.029-0.655-0.024-0.961,0.001\r\n\t\tc-0.317,0.02-0.629,0.079-0.917,0.175c-0.574,0.199-1.045,0.524-1.389,0.849c-0.344,0.327-0.58,0.639-0.707,0.886\r\n\t\tC1.874-21.862,1.821-21.71,1.821-21.71z M-9.71-21.462l0.091,0.069c0,0,0.098-0.111,0.28-0.285c0.18-0.171,0.444-0.417,0.798-0.647\r\n\t\tc0.699-0.467,1.759-0.87,2.83-0.772c0.278,0.024,0.509,0.063,0.767,0.141c0.247,0.073,0.482,0.16,0.709,0.245\r\n\t\tc0.459,0.155,0.89,0.321,1.269,0.484c0.391,0.176,0.716,0.321,0.943,0.423c0.234,0.113,0.382,0.172,0.382,0.172l0.082-0.079\r\n\t\tc0,0-0.053-0.15-0.191-0.386c-0.128-0.247-0.364-0.56-0.708-0.887c-0.343-0.325-0.814-0.65-1.389-0.849\r\n\t\tc-0.287-0.096-0.599-0.155-0.917-0.175c-0.305-0.025-0.658-0.03-0.961,0c-1.281,0.079-2.443,0.716-3.072,1.368\r\n\t\tc-0.327,0.318-0.555,0.614-0.699,0.835C-9.64-21.588-9.71-21.462-9.71-21.462z M-4.492-10.288c2.113-0.11,3.825-1.334,4.623-3.059\r\n\t\tc0.798,1.725,2.51,2.949,4.623,3.059c3.159,0.164,6.008-2.214,6.362-5.313c0.356-3.099-1.916-5.745-5.074-5.91\r\n\t\tc-2.564-0.133-4.923,1.408-5.911,3.65c-0.988-2.242-3.347-3.783-5.911-3.65c-3.158,0.165-5.431,2.811-5.075,5.91\r\n\t\tC-10.5-12.501-7.651-10.124-4.492-10.288z\"/>\r\n                <path fill=\"#FED402\" d=\"M-24.035,25.858c-0.13-0.97,0.476-1.842,1.36-2.101c-1.955-4.146-4.939-9.468-6.313-11.078\r\n\t\tc0.007-0.023,0.022-0.043,0.031-0.066h-17.049c3.355,12.263,11.476,22.547,22.253,28.75\r\n\t\tC-23.528,36.167-23.464,30.096-24.035,25.858z\"/>\r\n                <path fill=\"#FED402\" d=\"M29.249,12.68c-1.373,1.61-4.357,6.932-6.312,11.078c0.884,0.258,1.489,1.131,1.359,2.101\r\n\t\tc-0.565,4.197-0.507,10.194-0.289,15.358c10.65-6.217,18.669-16.437,21.998-28.603H29.218\r\n\t\tC29.227,12.637,29.242,12.657,29.249,12.68z\"/>\r\n                <path fill=\"#017BBD\" d=\"M0.131,23.863l-18.194-0.156c0.637,1.506,1.145,2.913,1.399,4.035c0.08,0.351,0.099,0.663,0.09,0.952\r\n\t\tc0.38,3.236-3.831,3.5-4.312-0.066c-0.063-0.466-0.229-1.085-0.457-1.791c-0.327-0.866-0.787-1.923-1.332-3.079\r\n\t\tc-0.884,0.259-1.49,1.131-1.36,2.101c0.571,4.237,0.506,10.309,0.283,15.505c6.76,3.89,14.56,6.169,22.883,6.318L0.131,23.863\r\n\t\tL0.131,23.863z\"/>\r\n                <path fill=\"#017BBD\" d=\"M24.296,25.858c0.13-0.97-0.475-1.842-1.359-2.101c-0.543,1.151-1.001,2.204-1.329,3.068\r\n\t\tc-0.23,0.71-0.397,1.333-0.461,1.802c-0.481,3.567-4.694,3.301-4.312,0.063c-0.008-0.289,0.011-0.599,0.091-0.949\r\n\t\tc0.254-1.122,0.763-2.529,1.399-4.035L0.131,23.863h0l-0.999,23.818c0.29,0.005,0.577,0.022,0.868,0.022\r\n\t\tc8.756,0,16.954-2.37,24.007-6.487C23.789,36.053,23.731,30.056,24.296,25.858z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-10.855-15.6c-0.356-3.099,1.917-5.745,5.075-5.91c2.564-0.133,4.923,1.408,5.911,3.65\r\n\t\tc-0.229,0.521-0.385,1.079-0.452,1.663c-0.117,1.025,0.058,1.998,0.452,2.851c-0.798,1.725-2.51,2.949-4.623,3.059\r\n\t\tC-7.651-10.124-10.5-12.501-10.855-15.6z M-6.9-16.348c0,1.547,1.255,2.802,2.802,2.802c1.548,0,2.802-1.255,2.802-2.802\r\n\t\tc0-1.547-1.254-2.802-2.802-2.802C-5.645-19.149-6.9-17.895-6.9-16.348z\"/>\r\n                <path fill=\"#22274F\" d=\"M-9.339-21.678c0.18-0.171,0.444-0.417,0.798-0.647c0.699-0.467,1.759-0.87,2.83-0.772\r\n\t\tc0.278,0.024,0.509,0.063,0.767,0.141c0.247,0.073,0.482,0.16,0.709,0.245c0.459,0.155,0.89,0.321,1.269,0.484\r\n\t\tc0.391,0.176,0.716,0.321,0.943,0.423c0.234,0.113,0.382,0.172,0.382,0.172l0.082-0.079c0,0-0.053-0.15-0.191-0.386\r\n\t\tc-0.128-0.247-0.364-0.56-0.708-0.887c-0.343-0.325-0.814-0.65-1.389-0.849c-0.287-0.096-0.599-0.155-0.917-0.175\r\n\t\tc-0.305-0.025-0.658-0.03-0.961,0c-1.281,0.079-2.443,0.716-3.072,1.368c-0.327,0.318-0.555,0.614-0.699,0.835\r\n\t\tc-0.144,0.217-0.214,0.343-0.214,0.343l0.091,0.069C-9.619-21.393-9.521-21.504-9.339-21.678z\"/>\r\n                <path fill=\"#22274F\" d=\"M2.284-21.804c0.229-0.102,0.553-0.248,0.943-0.423c0.379-0.163,0.811-0.33,1.27-0.484\r\n\t\tc0.227-0.086,0.463-0.172,0.709-0.245c0.258-0.078,0.489-0.117,0.768-0.141c1.07-0.098,2.13,0.304,2.83,0.772\r\n\t\tc0.354,0.229,0.617,0.476,0.798,0.646c0.181,0.174,0.28,0.286,0.28,0.286l0.091-0.069c0,0-0.07-0.127-0.216-0.344\r\n\t\tc-0.144-0.22-0.371-0.517-0.698-0.835c-0.628-0.651-1.79-1.288-3.072-1.368c-0.303-0.029-0.655-0.024-0.961,0.001\r\n\t\tc-0.317,0.02-0.629,0.079-0.917,0.175c-0.574,0.199-1.045,0.524-1.389,0.849c-0.344,0.327-0.58,0.639-0.707,0.886\r\n\t\tc-0.139,0.236-0.191,0.387-0.191,0.387l0.082,0.079C1.903-21.631,2.052-21.692,2.284-21.804z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-0.321-16.197c0.067-0.584,0.223-1.143,0.452-1.663c0.988-2.242,3.347-3.783,5.911-3.65\r\n\t\tc3.158,0.165,5.431,2.811,5.074,5.91c-0.354,3.099-3.203,5.477-6.362,5.313c-2.113-0.11-3.825-1.334-4.623-3.059\r\n\t\tC-0.264-14.199-0.438-15.172-0.321-16.197z M1.716-16.348c0,1.547,1.255,2.802,2.803,2.802c1.547,0,2.801-1.255,2.801-2.802\r\n\t\tc0-1.547-1.254-2.802-2.801-2.802C2.971-19.149,1.716-17.895,1.716-16.348z\"/>\r\n                <path fill=\"#22274F\" d=\"M-4.098-13.545c1.548,0,2.802-1.255,2.802-2.802c0-1.547-1.254-2.802-2.802-2.802\r\n\t\tc-1.547,0-2.802,1.255-2.802,2.802C-6.9-14.8-5.645-13.545-4.098-13.545z\"/>\r\n                <path fill=\"#22274F\" d=\"M4.519-13.545c1.547,0,2.801-1.255,2.801-2.802c0-1.547-1.254-2.802-2.801-2.802\r\n\t\tc-1.548,0-2.803,1.255-2.803,2.802C1.716-14.8,2.971-13.545,4.519-13.545z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M0.027-2.645c-1.405,0.054-2.813,0.062-4.223,0.02c-0.633-0.021-1.267-0.054-1.902-0.098\r\n\t\tc0.03,0.024,0.058,0.051,0.088,0.076c0.609,0.482,1.254,0.911,1.924,1.271s1.366,0.648,2.075,0.838\r\n\t\tc0.708,0.192,1.426,0.283,2.133,0.264c0.353-0.016,0.702-0.053,1.047-0.12C1.511-0.472,1.854-0.547,2.183-0.68\r\n\t\tc0.334-0.105,0.65-0.279,0.971-0.426C3.46-1.297,3.778-1.455,4.067-1.683c0.302-0.2,0.584-0.437,0.863-0.679\r\n\t\tc0.286-0.227,0.535-0.517,0.807-0.769L5.888-3.3C5.337-3.184,4.785-3.077,4.229-2.998C2.836-2.801,1.433-2.701,0.027-2.645z\"/>\r\n                <path fill=\"#DB4F14\" d=\"M10.759-4.675L9.386-3.12L8.567-2.196c-0.324,0.325-0.645,0.66-0.977,0.968\r\n\t\tc-0.347,0.289-0.66,0.603-1.035,0.866C6.194-0.088,5.829,0.179,5.431,0.411C5.052,0.665,4.622,0.857,4.213,1.068\r\n\t\tC3.778,1.241,3.353,1.43,2.896,1.547C2.449,1.69,1.979,1.768,1.517,1.838c-0.469,0.06-0.938,0.078-1.408,0.067\r\n\t\tC-0.828,1.87-1.746,1.686-2.607,1.392s-1.668-0.694-2.416-1.161C-5.772-0.237-6.467-0.77-7.11-1.35\r\n\t\tc-0.321-0.292-0.631-0.593-0.929-0.907c-0.3-0.321-0.575-0.627-0.866-1.004l-1.419-1.837l2.202,0.609\r\n\t\tc0.617,0.171,1.295,0.3,1.968,0.416c0.676,0.114,1.36,0.21,2.046,0.295c1.372,0.168,2.755,0.288,4.14,0.362\r\n\t\tc1.385,0.073,2.775,0.102,4.16,0.035c0.693-0.035,1.387-0.086,2.074-0.184c0.348-0.033,0.684-0.118,1.026-0.18\r\n\t\ts0.669-0.184,1.008-0.274L10.759-4.675z M5.888-3.3C5.337-3.184,4.785-3.077,4.229-2.998C2.836-2.801,1.433-2.701,0.027-2.645\r\n\t\tc-1.405,0.054-2.813,0.062-4.223,0.02c-0.633-0.021-1.267-0.054-1.902-0.098c0.03,0.024,0.058,0.051,0.088,0.076\r\n\t\tc0.609,0.482,1.254,0.911,1.924,1.271s1.366,0.648,2.075,0.838c0.708,0.192,1.426,0.283,2.133,0.264\r\n\t\tc0.353-0.016,0.702-0.053,1.047-0.12C1.511-0.472,1.854-0.547,2.183-0.68c0.334-0.105,0.65-0.279,0.971-0.426\r\n\t\tC3.46-1.297,3.778-1.455,4.067-1.683c0.302-0.2,0.584-0.437,0.863-0.679c0.286-0.227,0.535-0.517,0.807-0.769L5.888-3.3z\"/>\r\n                <path fill=\"#004373\" d=\"M-20.925,28.098c-0.086-0.342-0.235-0.777-0.417-1.261c0.229,0.706,0.394,1.325,0.457,1.791\r\n\t\tc0.481,3.566,4.692,3.302,4.312,0.066C-16.654,31.34-20.099,31.359-20.925,28.098z\"/>\r\n                <path fill=\"#017BBD\" d=\"M-28.987,12.68c0.007-0.023,0.022-0.043,0.031-0.066c0.559-1.427,3.951-1.411,4.786-0.351\r\n\t\tc0.063,0.079,0.142,0.191,0.225,0.312c1.125,1.621,4.044,6.788,5.882,11.132c0.637,1.506,1.145,2.913,1.399,4.035\r\n\t\tc0.08,0.351,0.099,0.663,0.09,0.952c-0.08,2.646-3.525,2.665-4.352-0.596c-0.086-0.342-0.235-0.777-0.417-1.261\r\n\t\tc-0.327-0.866-0.787-1.923-1.332-3.079C-24.63,19.612-27.614,14.29-28.987,12.68z M-16.967,28.282c0-0.876-0.71-1.586-1.586-1.586\r\n\t\ts-1.586,0.71-1.586,1.586c0,0.876,0.71,1.586,1.586,1.586S-16.967,29.159-16.967,28.282z\"/>\r\n                <path fill=\"#FED402\" d=\"M-18.553,26.696c-0.876,0-1.586,0.71-1.586,1.586c0,0.876,0.71,1.586,1.586,1.586s1.586-0.71,1.586-1.586\r\n\t\tC-16.967,27.406-17.677,26.696-18.553,26.696z\"/>\r\n                <path fill=\"#004373\" d=\"M16.836,28.691c-0.382,3.238,3.83,3.504,4.312-0.063c0.063-0.469,0.23-1.092,0.461-1.802\r\n\t\tc-0.185,0.489-0.334,0.927-0.422,1.272C20.36,31.36,16.914,31.34,16.836,28.691z\"/>\r\n                <path fill=\"#017BBD\" d=\"M18.326,23.707c1.837-4.345,4.757-9.511,5.881-11.132c0.083-0.12,0.163-0.232,0.225-0.312\r\n\t\tc0.834-1.06,4.226-1.076,4.785,0.351c0.009,0.023,0.024,0.043,0.031,0.066c-1.373,1.61-4.357,6.932-6.312,11.078\r\n\t\tc-0.543,1.151-1.001,2.204-1.329,3.068c-0.185,0.489-0.334,0.927-0.422,1.272c-0.826,3.262-4.272,3.242-4.351,0.593\r\n\t\tc-0.008-0.289,0.011-0.599,0.091-0.949C17.181,26.62,17.689,25.213,18.326,23.707z M20.401,28.282c0-0.876-0.711-1.586-1.586-1.586\r\n\t\tc-0.877,0-1.587,0.71-1.587,1.586c0,0.876,0.71,1.586,1.587,1.586C19.69,29.869,20.401,29.159,20.401,28.282z\"/>\r\n                <path fill=\"#FED402\" d=\"M18.815,26.696c-0.877,0-1.587,0.71-1.587,1.586c0,0.876,0.71,1.586,1.587,1.586\r\n\t\tc0.875,0,1.586-0.71,1.586-1.586C20.401,27.406,19.69,26.696,18.815,26.696z\"/>\r\n                <path fill=\"#017BBD\" d=\"M-13.295-38.175v8.655c0,0.134,0.032,0.258,0.084,0.373c0.143,0.315,0.457,0.536,0.825,0.536h1.191h22.65\r\n\t\th1.001c0.502,0,0.909-0.407,0.909-0.909v-8.655c0-1.767-0.445-3.429-1.226-4.883c-0.853-1.587-2.111-2.918-3.632-3.872\r\n\t\tC5.747-47.429,2.906-47.703,0-47.703c-2.87,0-5.677,0.268-8.407,0.753C-11.338-45.124-13.295-41.882-13.295-38.175z\"/>\r\n            </symbol>\r\n            <symbol id=\"avatarLost\" viewBox=\"-68.395 -68.954 136.789 137.907\">\r\n                <polygon points=\"-9.184,-68.954 -26.288,-25.912 -68.395,-6.62 -32.745,22.947 -27.409,68.954 11.728,44.186 57.132,53.328\r\n\t\t45.67,8.454 68.395,-31.904 22.175,-34.87 \t\"/>\r\n                <path fill=\"#017BBC\" d=\"M27.537-25.5l3.025,1.708c0.794,0.471,0.955,1.533-0.739,2.3c-1.694,0.766-3.819,0.564-3.819,0.564\r\n\t\tl-0.605-4.667L27.537-25.5z\"/>\r\n                <path fill=\"#004373\" d=\"M13.131-0.617c0,1.075,4.809,1.947,10.742,1.947c5.933,0,10.743-0.872,10.743-1.947\r\n\t\ts-4.811-1.947-10.743-1.947C17.939-2.564,13.131-1.692,13.131-0.617\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M27.437-22.583h0.678c0.354,0,0.642-0.287,0.642-0.642s-0.287-0.643-0.642-0.643h-0.678\"/>\r\n                <path fill=\"#D6B406\" d=\"M28.187-23.04c0-0.229-0.26-0.414-0.581-0.414c-0.218,0-0.408,0.085-0.507,0.212\r\n\t\tc0.012-0.259,0.31-0.467,0.677-0.467c0.374,0,0.678,0.217,0.678,0.484c0,0.192-0.157,0.357-0.385,0.436\r\n\t\tC28.143-22.858,28.187-22.945,28.187-23.04\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M20.302-22.583h-0.677c-0.355,0-0.643-0.287-0.643-0.642s0.287-0.643,0.643-0.643h0.677\"/>\r\n                <path fill=\"#D6B406\" d=\"M19.552-23.04c0-0.229,0.26-0.414,0.581-0.414c0.218,0,0.408,0.085,0.507,0.212\r\n\t\tc-0.012-0.259-0.31-0.467-0.676-0.467c-0.375,0-0.679,0.217-0.679,0.484c0,0.192,0.157,0.357,0.385,0.436\r\n\t\tC19.596-22.858,19.552-22.945,19.552-23.04\"/>\r\n                <path fill=\"#FFED00\" d=\"M21.212-28.04l-3.177,13.862c-0.187,0.574-0.722,0.963-1.325,0.963H2.134c-1.35,0-1.912,1.727-0.819,2.521\r\n\t\tl11.792,8.567c0.488,0.354,0.692,0.984,0.506,1.558L9.938,29.555c-0.416,1.284,1.054,2.352,2.146,1.559L23.046,6.285\r\n\t\tc0.488-0.355,1.149-0.355,1.639,0l10.962,24.829c1.092,0.793,2.562-0.275,2.145-1.559L34.116-0.568\r\n\t\tc-0.186-0.574,0.018-1.204,0.507-1.558l11.792-8.567c1.092-0.793,0.53-2.521-0.819-2.521H31.02c-0.603,0-1.139-0.39-1.325-0.963\r\n\t\tL26.519-28.04C25.999-30.264,21.685-30.264,21.212-28.04\"/>\r\n                <path fill=\"#00FFFF\" d=\"M23.046,9.604c0.488-0.355,1.149-0.355,1.639,0l9.094,18.868c1.092,0.794,4.475-0.796,4.058-2.081\r\n\t\tL34.614-0.568c-1.783,0.834-3.441,0.274-3.595-1.255c0,0-0.465-4.944-0.115-7.534c0.045-0.338-0.215-0.639-0.557-0.637\r\n\t\tl-6.482,0.057\"/>\r\n                <path fill=\"#00FFFF\" d=\"M24.685,9.604c-0.488-0.355-1.15-0.355-1.639,0l-9.095,18.868c-1.092,0.794-4.475-0.796-4.057-2.081\r\n\t\tl3.221-26.959c1.783,0.834,3.441,0.274,3.595-1.255c0,0,0.465-4.944,0.115-7.534c-0.044-0.338,0.216-0.639,0.558-0.637l6.482,0.057\r\n\t\t\"/>\r\n                <path fill=\"none\" stroke=\"#292D95\" stroke-width=\"0.1658\" stroke-miterlimit=\"10\" d=\"M13.035-0.036\r\n\t\tc0.076,0.035,0.152,0.068,0.229,0.099\"/>\r\n                <path fill=\"none\" stroke=\"#292D95\" stroke-width=\"0.1658\" stroke-miterlimit=\"10\"\r\n                      stroke-dasharray=\"0.5008,0.5008\" d=\"\r\n\t\tM13.741,0.217c1.618,0.413,3.333-0.209,3.467-1.542c0,0,0.462-4.974,0.105-7.558c-0.045-0.326,0.205-0.618,0.535-0.618h12.025\r\n\t\tc0.329,0,0.58,0.292,0.535,0.618c-0.354,2.583,0.112,7.558,0.112,7.558c0.141,1.4,2.024,2.016,3.71,1.472\"/>\r\n                <path fill=\"none\" stroke=\"#292D95\" stroke-width=\"0.1658\" stroke-miterlimit=\"10\" d=\"M34.466,0.063\r\n\t\tc0.077-0.03,0.153-0.064,0.229-0.099\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M23.733-21.607c-0.104,0.903,0.558,1.674,1.479,1.721c0.92,0.048,1.749-0.645,1.853-1.548\r\n\t\tc0.104-0.903-0.559-1.673-1.478-1.721C24.666-23.202,23.836-22.51,23.733-21.607\"/>\r\n                <path fill=\"#22274F\" d=\"M26.731-23.141c0,0-0.111-0.184-0.351-0.395c-0.234-0.216-0.575-0.465-0.986-0.639\r\n\t\tc-0.101-0.042-0.223-0.079-0.349-0.083c-0.115-0.002-0.258,0.022-0.357,0.073c-0.215,0.096-0.351,0.274-0.437,0.425\r\n\t\tc-0.159,0.331-0.055,0.566-0.065,0.558h0.033c0,0,0.053-0.217,0.244-0.417c0.191-0.205,0.487-0.379,0.845-0.29\r\n\t\tc0.378,0.094,0.74,0.309,1,0.467c0.262,0.163,0.397,0.32,0.397,0.32L26.731-23.141z\"/>\r\n                <path fill=\"#22274F\" d=\"M21.024-23.12c0,0,0.136-0.158,0.401-0.317c0.262-0.157,0.627-0.365,1.007-0.465\r\n\t\tc0.092-0.022,0.191-0.034,0.257-0.029c0.109,0.003,0.143,0.025,0.229,0.05c0.139,0.059,0.271,0.146,0.355,0.255\r\n\t\tc0.184,0.206,0.237,0.424,0.237,0.424h0.032c-0.011,0.006,0.095-0.225-0.054-0.561c-0.083-0.152-0.215-0.339-0.438-0.433\r\n\t\tc-0.093-0.052-0.262-0.072-0.357-0.064c-0.139,0.012-0.244,0.051-0.349,0.093c-0.407,0.176-0.754,0.419-0.991,0.633\r\n\t\tc-0.242,0.208-0.354,0.393-0.354,0.393L21.024-23.12z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M23.996-21.607c0.104,0.903-0.558,1.674-1.479,1.721c-0.919,0.048-1.749-0.645-1.853-1.548\r\n\t\ts0.559-1.673,1.478-1.721C23.063-23.202,23.894-22.51,23.996-21.607\"/>\r\n                <path fill=\"#22274F\" d=\"M24.612-21.651c0,0.451,0.365,0.817,0.816,0.817s0.816-0.366,0.816-0.817c0-0.45-0.365-0.816-0.816-0.816\r\n\t\tS24.612-22.101,24.612-21.651\"/>\r\n                <path fill=\"#22274F\" d=\"M21.439-21.651c0,0.451,0.364,0.817,0.816,0.817c0.45,0,0.815-0.366,0.815-0.817\r\n\t\tc0-0.45-0.365-0.816-0.815-0.816C21.804-22.467,21.439-22.101,21.439-21.651\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M26.321-16.651c-2.429-3.122-4.836-0.082-4.836-0.082C22.255-15.133,25.429-14.924,26.321-16.651\"/>\r\n                <path fill=\"#EA7D00\" d=\"M26.505-17.052c-0.118-0.132-0.243-0.275-0.391-0.412c-0.195-0.173-0.397-0.341-0.629-0.478\r\n\t\tc-0.449-0.285-1.003-0.454-1.551-0.435c-0.549,0.02-1.061,0.216-1.494,0.488c-0.438,0.278-0.807,0.609-1.131,1.017l-0.091,0.114\r\n\t\tl0.064,0.123c0.255,0.482,0.692,0.814,1.15,1.017c0.463,0.202,0.962,0.29,1.453,0.287c0.49-0.006,0.982-0.105,1.42-0.322\r\n\t\tc0.438-0.213,0.813-0.561,1.014-0.997L26.505-17.052z M26.065-16.308c-0.223,0.242-0.503,0.432-0.805,0.552\r\n\t\tc-0.434,0.174-0.907,0.231-1.368,0.2c-0.905-0.06-1.863-0.493-2.205-1.274l-0.025,0.236c0.597-0.648,1.448-1.174,2.276-1.147\r\n\t\tc0.411,0.015,0.807,0.16,1.149,0.41c0.175,0.117,0.332,0.269,0.486,0.422c0.141,0.147,0.281,0.32,0.431,0.52L26.065-16.308z\"/>\r\n                <path fill=\"#004373\" d=\"M34.585,0.997c-0.518,1.295-3.137,1.98-4.631,1.323c0.146,2.421,0.413,3.232,1.097,4.024\r\n\t\tc0.899,1.043,3.498,1.968,4.301,0.285L34.585,0.997z\"/>\r\n                <path fill=\"#017BBC\" d=\"M34.67,1.329c-0.526,1.173-3.193,1.792-4.716,1.198c0.148,2.191,0.448,2.869,1.117,3.642\r\n\t\tc0.843,0.973,3.563,1.781,4.38,0.258L34.67,1.329z\"/>\r\n                <path fill=\"none\" stroke=\"#FDD302\" stroke-width=\"0.1719\" stroke-miterlimit=\"10\"\r\n                      stroke-dasharray=\"0.5141,0.5141\" d=\"M34.57,2.54\r\n\t\tc-0.941,0.748-2.752,1.001-4.031,0.534c0.124,1.725,0.507,2.249,0.938,2.867c0.593,0.848,2.995,1.402,3.682,0.204L34.57,2.54z\"/>\r\n                <path fill=\"#004373\" d=\"M13.145,0.997c0.518,1.295,3.137,1.98,4.632,1.323c-0.146,2.421-0.414,3.232-1.097,4.024\r\n\t\tc-0.899,1.043-3.499,1.968-4.301,0.285L13.145,0.997z\"/>\r\n                <path fill=\"#017BBC\" d=\"M13.06,1.329c0.527,1.173,3.193,1.792,4.717,1.198c-0.148,2.191-0.448,2.869-1.118,3.642\r\n\t\tc-0.842,0.973-3.562,1.781-4.379,0.258L13.06,1.329z\"/>\r\n                <path fill=\"none\" stroke=\"#FDD302\" stroke-width=\"0.1719\" stroke-miterlimit=\"10\"\r\n                      stroke-dasharray=\"0.5141,0.5141\" d=\"M13.16,2.54\r\n\t\tc0.94,0.748,2.751,1.001,4.031,0.534c-0.125,1.725-0.508,2.249-0.939,2.867c-0.592,0.848-2.994,1.402-3.682,0.204L13.16,2.54z\"/>\r\n                <path fill=\"#004373\" d=\"M32.116-13.082c-0.145-0.434-1.013-0.413-1.255-0.096c-0.342,0.448-1.834,3.199-2.117,4.542\r\n\t\tc-0.22,1.042,1.097,1.161,1.243,0.084C30.114-9.491,31.553-12.4,32.116-13.082\"/>\r\n                <path fill=\"#00FFFF\" d=\"M32.347-13.196c-0.138-0.437-1.156-0.434-1.403-0.121c-0.349,0.443-1.882,3.169-2.187,4.508\r\n\t\tc-0.235,1.039,0.975,1.158,1.241,0.104C30.23-9.622,31.772-12.522,32.347-13.196\"/>\r\n                <path fill=\"#FDD302\" d=\"M28.845-8.651c0,0.255,0.208,0.462,0.463,0.462c0.254,0,0.462-0.208,0.462-0.462s-0.208-0.462-0.462-0.462\r\n\t\tC29.053-9.113,28.845-8.906,28.845-8.651\"/>\r\n                <path fill=\"#004373\" d=\"M15.613-13.082c0.146-0.434,1.014-0.413,1.255-0.096c0.343,0.448,1.834,3.199,2.117,4.542\r\n\t\tc0.22,1.042-1.097,1.161-1.242,0.084C17.616-9.491,16.178-12.4,15.613-13.082\"/>\r\n                <path fill=\"#00FFFF\" d=\"M15.384-13.196c0.138-0.437,1.155-0.434,1.402-0.121c0.349,0.443,1.883,3.169,2.188,4.508\r\n\t\tc0.234,1.039-0.975,1.158-1.242,0.104C17.499-9.622,15.957-12.522,15.384-13.196\"/>\r\n                <path fill=\"#FDD302\" d=\"M18.885-8.651c0,0.255-0.207,0.462-0.462,0.462s-0.462-0.208-0.462-0.462s0.207-0.462,0.462-0.462\r\n\t\tS18.885-8.906,18.885-8.651\"/>\r\n                <path fill=\"#00FFFF\" d=\"M23.021-31.021h1.743c1.662,0,3.011,1.348,3.011,3.012v2.521c0,0.146-0.118,0.264-0.265,0.264h-7.236\r\n\t\tc-0.146,0-0.265-0.118-0.265-0.264v-2.521C20.01-29.672,21.358-31.021,23.021-31.021\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M5.722,12.026c0.358-1.441,1.695-2.348,2.986-2.027c-0.061,0.796-0.177,1.304-0.976,2.404\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M5.722,12.026\r\n\t\tc0.358-1.441,1.695-2.348,2.986-2.027c-0.061,0.796-0.177,1.304-0.976,2.404\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M0.089,9.068C0.978,7.879,2.562,7.56,3.627,8.356c1.065,0.796,1.208,2.406,0.319,3.594\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M0.089,9.068\r\n\t\tC0.978,7.879,2.562,7.56,3.627,8.356c1.065,0.796,1.208,2.406,0.319,3.594\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M-3.658,6.021c0.914-0.96,2.3-1.123,3.097-0.365c0.796,0.758,0.701,2.15-0.212,3.11\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M-3.658,6.021\r\n\t\tc0.914-0.96,2.3-1.123,3.097-0.365c0.796,0.758,0.701,2.15-0.212,3.11\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M-6.259,1.997c0.956-0.583,2.163-0.349,2.698,0.525c0.533,0.874,0.192,2.055-0.764,2.64\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M-6.259,1.997\r\n\t\tc0.956-0.583,2.163-0.349,2.698,0.525c0.533,0.874,0.192,2.055-0.764,2.64\"/>\r\n                <path fill=\"#ADC80C\" d=\"M-11.111-12.09c0,0-0.008-2.063,0.069-5.154c0.079-3.09,0.203-7.216,0.453-11.32\r\n\t\tc0.073-1.02,0.124-2.061,0.277-3.016c0.048-0.225,0.107-0.438,0.179-0.575c0.025-0.07,0.087-0.091-0.002-0.003\r\n\t\tc-0.045,0.041-0.161,0.093-0.252,0.086c-0.082,0.002-0.12-0.018-0.125-0.015c0,0.009,0.159,0.193,0.258,0.36\r\n\t\tc0.112,0.177,0.222,0.376,0.329,0.578c0.213,0.407,0.416,0.831,0.623,1.252c0.233,0.426,0.327,0.806,0.826,1.38\r\n\t\tc0.223,0.241,0.499,0.472,0.875,0.633c0.374,0.161,0.884,0.211,1.328,0.071c0.904-0.315,1.239-0.923,1.502-1.355\r\n\t\tc0.483-0.919,0.63-1.694,0.769-2.377c0.124-0.682,0.189-1.266,0.23-1.743c0.081-0.955,0.091-1.493,0.091-1.493l0-0.051\r\n\t\tc0.017-0.809-0.626-1.477-1.435-1.493c-0.808-0.016-1.476,0.626-1.492,1.435c-0.001,0.056,0.002,0.121,0.007,0.176\r\n\t\tc0,0,0.05,0.493,0.083,1.341c0.017,0.425,0.02,0.936-0.012,1.501c-0.033,0.555-0.114,1.205-0.295,1.687\r\n\t\tc-0.079,0.241-0.223,0.372-0.127,0.339c0.047-0.008,0.112,0.019,0.083,0.03c-0.026,0.003-0.109-0.029-0.198-0.101\r\n\t\tc-0.128-0.06-0.424-0.524-0.676-0.885c-0.261-0.384-0.528-0.785-0.827-1.198c-0.151-0.207-0.308-0.417-0.492-0.631\r\n\t\tc-0.202-0.215-0.352-0.435-0.785-0.679c-0.115-0.057-0.271-0.118-0.479-0.127c-0.214-0.009-0.457,0.078-0.6,0.197\r\n\t\tc-0.288,0.242-0.347,0.455-0.407,0.618c-0.106,0.334-0.13,0.624-0.151,0.899c-0.071,1.063-0.08,2.085-0.087,3.126\r\n\t\tc-0.007,4.138,0.115,8.261,0.221,11.355C-11.242-14.149-11.111-12.09-11.111-12.09\"/>\r\n                <path fill=\"#ADC80C\" d=\"M-7.729-10.157c0,0-0.007-2.063,0.07-5.154c0.078-3.09,0.202-7.216,0.452-11.32\r\n\t\tc0.073-1.02,0.125-2.061,0.278-3.016c0.047-0.225,0.107-0.438,0.179-0.575c0.025-0.071,0.087-0.092-0.002-0.004\r\n\t\tc-0.045,0.041-0.162,0.092-0.252,0.085c-0.082,0.002-0.12-0.018-0.126-0.015c0,0.01,0.16,0.193,0.258,0.361\r\n\t\tc0.112,0.177,0.222,0.375,0.329,0.578c0.213,0.406,0.417,0.831,0.624,1.252c0.234,0.427,0.326,0.806,0.827,1.38\r\n\t\tc0.223,0.241,0.498,0.471,0.875,0.633c0.374,0.162,0.884,0.212,1.328,0.071c0.903-0.314,1.238-0.923,1.502-1.355\r\n\t\tc0.483-0.92,0.63-1.694,0.769-2.377c0.124-0.682,0.189-1.266,0.23-1.743c0.08-0.955,0.09-1.492,0.09-1.492l0.001-0.052\r\n\t\tc0.017-0.809-0.626-1.477-1.435-1.493c-0.808-0.016-1.476,0.626-1.492,1.435c-0.001,0.056,0.002,0.121,0.007,0.176\r\n\t\tc0,0,0.049,0.493,0.082,1.341c0.017,0.425,0.021,0.936-0.011,1.501c-0.033,0.555-0.114,1.206-0.295,1.687\r\n\t\tc-0.079,0.241-0.223,0.372-0.128,0.338c0.048-0.008,0.112,0.02,0.084,0.03c-0.026,0.003-0.109-0.029-0.199-0.101\r\n\t\tc-0.127-0.06-0.424-0.523-0.675-0.885c-0.261-0.383-0.529-0.785-0.828-1.198c-0.15-0.206-0.307-0.416-0.491-0.63\r\n\t\tc-0.203-0.215-0.353-0.435-0.785-0.679c-0.116-0.057-0.272-0.119-0.48-0.127c-0.213-0.009-0.457,0.078-0.6,0.196\r\n\t\tc-0.288,0.243-0.346,0.455-0.406,0.618c-0.107,0.334-0.129,0.624-0.151,0.899c-0.072,1.063-0.08,2.086-0.087,3.126\r\n\t\tc-0.008,4.138,0.115,8.261,0.221,11.355C-7.86-12.216-7.729-10.157-7.729-10.157\"/>\r\n                <path fill=\"#ADC80C\" d=\"M7.732,12.403c-4.222,5.114-10.609,8.375-17.758,8.375c-12.709,0-23.012-10.302-23.012-23.012\r\n\t\ts10.303-23.012,23.012-23.012c10.778,0,19.825,7.409,22.326,17.412L5.361-5.483c0,0-6.197,1.896-7.865,2.994\r\n\t\tc-1.669,1.097-3.452,3.156-3.07,4.635c0.382,1.479,2.077,6.792,6.294,8.614C4.939,12.581,7.732,12.403,7.732,12.403\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-3.374-9.103C-0.657-5.566,3.86-4.478,6.717-6.67c2.856-2.194,2.971-6.839,0.255-10.376\r\n\t\tc-2.715-3.537-7.232-4.626-10.089-2.433C-5.974-17.285-6.089-12.64-3.374-9.103\"/>\r\n                <path fill=\"#1C1C1B\" d=\"M1.514-11.482c1.583,2.063,4.218,2.697,5.883,1.418c1.666-1.278,1.732-3.987,0.149-6.049\r\n\t\tc-1.584-2.063-4.217-2.698-5.883-1.419C-0.003-16.252-0.07-13.545,1.514-11.482\"/>\r\n                <path fill=\"#ADC80C\" d=\"M1.18,16.295c2.415,2.615,3.622,3.019,3.421,4.628c-0.201,1.61-4.627,4.226-5.029,6.438\r\n\t\tc-0.403,2.213,2.011,1.006,3.621,1.207c0.814,0.102,1.474,0.821,1.927,1.507c0.37,0.561-0.048,1.311-0.721,1.311h-8.851\r\n\t\tc-0.264-2.057-0.182-3.389,1.149-5.384c1.248-1.871,2.578-2.66,2.673-4.274c0.093-1.544-4.669-2.377-4.669-2.377\"/>\r\n                <path fill=\"#ADC80C\" d=\"M-20.925,16.295c-2.415,2.615-3.622,3.019-3.42,4.628c0.201,1.61,4.628,4.226,5.029,6.438\r\n\t\tc0.403,2.213-2.011,1.006-3.621,1.207c-0.814,0.102-1.474,0.821-1.927,1.507c-0.371,0.561,0.049,1.311,0.722,1.311h8.851\r\n\t\tc0.265-2.057,0.182-3.389-1.148-5.384c-1.248-1.871-2.578-2.66-2.674-4.274c-0.093-1.544,4.669-2.377,4.669-2.377\"/>\r\n                <path fill=\"#E3007D\" d=\"M-5.833,0.955c0,0,0.001,0.077,0.002,0.22c0.007,0.144-0.007,0.355,0.019,0.622\r\n\t\tc0.053,0.261,0.078,0.6,0.181,0.963c0.108,0.36,0.208,0.78,0.396,1.207c0.158,0.442,0.381,0.894,0.624,1.373\r\n\t\tC-4.365,5.814-4.073,6.3-3.756,6.793c0.331,0.483,0.674,0.987,1.074,1.458c0.374,0.497,0.822,0.938,1.25,1.407\r\n\t\tc0.462,0.429,0.908,0.889,1.409,1.269c0.487,0.397,0.983,0.773,1.502,1.087c0.495,0.351,1.029,0.604,1.526,0.865\r\n\t\tc0.493,0.272,1.013,0.424,1.468,0.618c0.463,0.183,0.917,0.266,1.31,0.381c0.391,0.122,0.748,0.153,1.04,0.196\r\n\t\tC7.411,14.154,7.747,14.2,7.747,14.2c0.664,0.088,1.274-0.377,1.363-1.041c0.089-0.663-0.377-1.274-1.04-1.363\r\n\t\tc-0.045-0.006-0.091-0.009-0.137-0.01l-0.146-0.002c0,0-0.273-0.004-0.751-0.012c-0.24-0.004-0.535,0.012-0.868-0.053\r\n\t\tc-0.332-0.059-0.72-0.071-1.128-0.179c-0.403-0.121-0.864-0.187-1.318-0.372c-0.458-0.175-0.956-0.335-1.435-0.593\r\n\t\tc-0.497-0.221-0.984-0.504-1.473-0.81c-0.501-0.29-0.959-0.662-1.442-1.007c-0.448-0.384-0.923-0.747-1.33-1.168\r\n\t\tc-0.434-0.398-0.814-0.833-1.187-1.254c-0.36-0.43-0.696-0.861-0.988-1.285c-0.288-0.43-0.558-0.839-0.76-1.243\r\n\t\tC-5.125,3.417-5.27,3.03-5.417,2.692c-0.144-0.34-0.206-0.651-0.291-0.906c-0.059-0.26-0.071-0.473-0.095-0.614\r\n\t\tC-5.823,1.03-5.833,0.955-5.833,0.955\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-3.93,0.02c1.093,2.881,6.456,2.042,4.184-2.821\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M-3.93,0.02\r\n\t\tc1.093,2.881,6.456,2.042,4.184-2.821\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M1.286-3.648c0.552,4.095,7.737,4.933,6.247-2.108\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M1.286-3.648\r\n\t\tc0.552,4.095,7.737,4.933,6.247-2.108\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M8.046-5.815c1.245,3.499,2.521,4.966,3.844,5.401c1.185,0.389,2.366-0.676,2.146-1.904\r\n\t\tc-0.339-1.894-0.974-3.73-1.735-4.963\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M8.046-5.815\r\n\t\tc1.245,3.499,2.521,4.966,3.844,5.401c1.185,0.389,2.366-0.676,2.146-1.904c-0.339-1.894-0.974-3.73-1.735-4.963\"/>\r\n                <path fill=\"#E3007D\" d=\"M12.412-8.47c0,0-0.323,0.08-0.89,0.221c-0.569,0.148-1.37,0.367-2.323,0.653\r\n\t\tC7.293-7.028,4.781-6.193,2.333-5.188c-2.442,1.006-4.839,2.19-6.407,3.444c-0.389,0.313-0.727,0.627-0.99,0.939\r\n\t\tC-5.33-0.498-5.527-0.196-5.641,0.074C-5.756,0.339-5.815,0.565-5.817,0.72c-0.011,0.153-0.017,0.235-0.017,0.235\r\n\t\ts0.016-0.08,0.043-0.231c0.019-0.149,0.104-0.362,0.244-0.602c0.137-0.245,0.358-0.509,0.645-0.772\r\n\t\tc0.284-0.268,0.641-0.529,1.048-0.786c1.639-1.027,4.094-1.909,6.582-2.61c2.494-0.701,5.035-1.23,6.943-1.566\r\n\t\tc0.953-0.168,1.751-0.29,2.303-0.367c0.557-0.072,0.875-0.114,0.875-0.114l0.012-0.001c0.663-0.085,1.132-0.692,1.045-1.355\r\n\t\tc-0.086-0.664-0.692-1.132-1.355-1.045C12.503-8.49,12.456-8.48,12.412-8.47\"/>\r\n                <path fill=\"#006633\" d=\"M-9.169-1.294c-0.688,0.954-1.331,1.96-1.721,3.101c-0.099,0.28-0.165,0.591-0.21,0.88\r\n\t\tc-0.044,0.295-0.113,0.56-0.188,0.845l-0.253,0.841c-0.037,0.161-0.1,0.25-0.1,0.52c0.015,0.079,0.073,0.179,0.142,0.213\r\n\t\tc0.07,0.04,0.221,0.027,0.25,0.006c0.05-0.026,0.113-0.061,0.148-0.089c0.063-0.053,0.133-0.109,0.186-0.163\r\n\t\tc0.441-0.426,0.822-0.867,1.212-1.326C-9.321,3.08-8.951,2.615-8.59,2.145c0.724-0.941,1.396-1.912,2.059-2.901l-0.067,0.081\r\n\t\tc0.449-0.446,0.818-0.923,1.001-1.598C-5.512-2.605-5.512-3-5.653-3.357c-0.142-0.367-0.416-0.623-0.572-0.806\r\n\t\tC-6.588-4.568-6.94-4.976-7.249-5.397c-0.297-0.416-0.579-0.874-0.656-1.26C-7.946-6.852-7.93-6.985-7.868-7.063\r\n\t\tc0.021-0.051,0.283-0.27,0.404-0.316c0.314-0.147,0.536-0.092,0.872,0.196c0.154,0.141,0.301,0.324,0.437,0.523\r\n\t\tc0.132,0.188,0.26,0.424,0.424,0.677C-5.378-5.469-4.997-4.94-4.24-4.616c0.378,0.149,0.877,0.162,1.267-0.006\r\n\t\tc0.102-0.036,0.187-0.086,0.277-0.134c0.159-0.103,0.136-0.093,0.223-0.156c0.186-0.156,0.307-0.297,0.409-0.426\r\n\t\tc0.404-0.539,0.656-1.099,0.831-1.703c0.087-0.301,0.152-0.612,0.175-0.947c0.014-0.165,0.016-0.337-0.001-0.517\r\n\t\tc-0.011-0.091-0.011-0.176-0.035-0.272l-0.031-0.141l-0.015-0.071l-0.004-0.017c0.044,0.207,0.011,0.053,0.021,0.098l-0.001-0.006\r\n\t\tl-0.003-0.025l-0.015-0.103c0-0.01-0.008-0.048-0.003-0.037c0.01,0.029,0.014,0.062,0.013,0.096\r\n\t\tc-0.021,0.142-0.072,0.226-0.145,0.281c-0.105,0.084-0.107,0.044-0.034,0.054c0.132,0.001,0.36,0.048,0.567,0.127\r\n\t\tc0.416,0.146,0.857,0.408,1.093,0.68c0.059,0.045,0.119,0.178,0.108,0.13l0.076,0.192C0.529-7.493,0.522-7.487,0.528-7.473\r\n\t\tc0.013,0.117-0.009,0.308-0.07,0.485C0.33-6.62,0.06-6.251-0.274-5.982c-0.332,0.277-0.731,0.441-1.123,0.493l-0.045,1.415\r\n\t\tc0.598,0.1,1.229,0.136,1.87,0.007c0.637-0.116,1.277-0.414,1.781-0.871c0.249-0.23,0.469-0.492,0.642-0.776\r\n\t\tC2.896-5.785,2.932-5.858,2.972-5.93L3.03-6.039l0.002-0.003c0.048-0.082-0.063,0.106-0.051,0.086l0.003-0.005l0.007-0.011\r\n\t\tl0.015-0.021l0.027-0.042C3.05-6.074,3.166-6.218,3.037-6.047C2.989-6,2.927-5.976,2.869-5.963c-0.061,0.03-0.141,0.04-0.211,0.024\r\n\t\tc-0.125-0.029-0.15-0.039-0.186-0.077C2.475-6,2.478-6.006,2.494-5.988c0.038,0.059,0.083,0.125,0.125,0.223\r\n\t\tC2.707-5.583,2.78-5.363,2.832-5.142C2.888-4.92,2.917-4.694,2.929-4.483C2.935-4.291,2.91-4.06,2.882-4.028\r\n\t\tc-0.004,0.01,0.001-0.023,0.019-0.02c0.013-0.01-0.022,0.023,0.032-0.023l-0.02,0.016L2.875-4.022L2.797-3.958\r\n\t\tC2.705-3.891,2.666-3.861,2.551-3.792C2.358-3.67,2.137-3.56,1.916-3.457C1.468-3.254,0.993-3.088,0.527-2.981\r\n\t\tC0.297-2.936,0.063-2.89-0.141-2.889C-0.34-2.88-0.537-2.912-0.58-2.941l-0.853,1.07C-1.221-1.636-1.004-1.4-0.718-1.168\r\n\t\tc0.141,0.114,0.313,0.233,0.527,0.329c0.217,0.096,0.493,0.152,0.742,0.136c0.497-0.045,0.766-0.194,1.038-0.28l0.197-0.069\r\n\t\tl0.012-0.003C1.661-1.02,1.761-1.047,1.731-1.039h0.003l0.007-0.001l0.027-0.006l0.054-0.012c0.029-0.006,0.083-0.021,0.096-0.02\r\n\t\tc-0.07,0.028-0.066,0-0.098-0.012c-0.06-0.056,0.01-0.035-0.03,0.084C1.762-0.899,1.665-0.76,1.514-0.644\r\n\t\tC1.367-0.521,1.149-0.438,0.931-0.36C0.852-0.342,0.65-0.286,0.543-0.27C0.424-0.255,0.32-0.229,0.182-0.222\r\n\t\tC-0.853-0.13-2.009-0.329-2.994-0.704c-0.109-0.045-0.245-0.11-0.281-0.135L-3.29-0.847l-0.123-0.08l-0.006-0.004l-0.012-0.006\r\n\t\tl-0.026-0.012c-0.037-0.014,0.016-0.002-0.106-0.041c-0.09-0.027-0.196-0.039-0.293-0.032c-0.306,0.046-0.388,0.138-0.493,0.207\r\n\t\tc-0.359,0.292-0.499,0.536-0.694,0.79c-0.352,0.49-0.671,1.003-1.004,1.354l-0.042,0.045l-0.011,0.017\r\n\t\tc-0.995,1.434-1.647,2.951-2.408,4.405c-0.375,0.727-0.758,1.444-1.199,2.11c-0.444,0.649-0.942,1.304-1.572,1.626\r\n\t\tc-0.312,0.153-0.65,0.201-0.986,0.107c-0.164-0.048-0.341-0.133-0.484-0.213c-0.166-0.116-0.355-0.228-0.501-0.349\r\n\t\tc-0.612-0.459-1.075-1.126-1.25-1.9c-0.182-0.774-0.167-1.603-0.152-2.423c0.02-0.822,0.055-1.649,0.059-2.474\r\n\t\tc-0.07,0.822-0.17,1.64-0.256,2.463c-0.077,0.822-0.138,1.66,0.003,2.508c0.075,0.423,0.226,0.837,0.439,1.222\r\n\t\tc0.228,0.377,0.512,0.708,0.851,1.003c0.165,0.15,0.328,0.257,0.492,0.388c0.208,0.139,0.398,0.24,0.626,0.325\r\n\t\tc0.453,0.163,0.989,0.125,1.423-0.064c0.88-0.391,1.435-1.102,1.938-1.78c0.494-0.692,0.917-1.417,1.325-2.142\r\n\t\tc0.815-1.439,1.544-2.941,2.483-4.188l-0.054,0.061c0.497-0.492,0.808-0.989,1.165-1.441c0.163-0.212,0.368-0.46,0.478-0.531\r\n\t\tc0.011-0.021,0.063-0.004-0.1,0.019c-0.06,0.005-0.128-0.008-0.183-0.035c-0.083-0.048-0.004-0.004-0.004-0.004l0.024,0.012\r\n\t\tL-3.93,0.1l0.006,0.003l0.003,0.001c0.026,0.018-0.222-0.146-0.115-0.075l0.075,0.057c0.204,0.146,0.342,0.203,0.5,0.281\r\n\t\tc0.604,0.265,1.204,0.436,1.828,0.554c0.624,0.112,1.265,0.162,1.922,0.114C0.449,1.03,0.634,0.996,0.808,0.971\r\n\t\tc0.185-0.03,0.267-0.055,0.476-0.103C1.623,0.76,1.97,0.636,2.29,0.393C2.607,0.156,2.908-0.178,3.05-0.64\r\n\t\tc0.146-0.433,0.097-1.105-0.444-1.522c-0.269-0.2-0.576-0.265-0.937-0.229L1.548-2.369L1.494-2.358L1.37-2.326L1.146-2.253\r\n\t\tc-0.286,0.099-0.565,0.194-0.663,0.19C0.417-2.06,0.335-2.088,0.148-2.24c-0.169-0.142-0.354-0.343-0.536-0.548l-0.854,1.07\r\n\t\tC-0.8-1.495-0.438-1.497-0.104-1.495c0.336-0.003,0.633-0.061,0.933-0.118c0.584-0.131,1.132-0.322,1.669-0.56\r\n\t\tc0.267-0.122,0.53-0.251,0.794-0.414C3.411-2.653,3.59-2.78,3.713-2.875L3.79-2.94l0.039-0.031l0.02-0.017\r\n\t\tc0.065-0.059,0.039-0.04,0.063-0.064c0.092-0.107,0.195-0.241,0.246-0.352c0.211-0.46,0.187-0.788,0.196-1.128\r\n\t\tc-0.014-0.327-0.057-0.637-0.13-0.939C4.153-5.774,4.06-6.069,3.918-6.375c-0.064-0.15-0.16-0.313-0.275-0.477\r\n\t\tC3.576-6.939,3.48-7.038,3.393-7.122c-0.149-0.1-0.287-0.213-0.544-0.244C2.711-7.38,2.563-7.369,2.435-7.337\r\n\t\tC2.319-7.296,2.204-7.227,2.1-7.144c-0.258,0.23-0.194,0.221-0.255,0.289L1.817-6.812l-0.08,0.131L1.699-6.612\r\n\t\tC1.673-6.567,1.651-6.518,1.622-6.476C1.514-6.299,1.38-6.148,1.234-6.012C0.653-5.465-0.269-5.32-1.195-5.482L-1.24-4.068\r\n\t\tc0.702-0.09,1.353-0.386,1.866-0.817c0.517-0.43,0.931-0.973,1.168-1.649c0.11-0.346,0.178-0.711,0.124-1.143\r\n\t\tc-0.021-0.12-0.05-0.25-0.083-0.359L1.758-8.228C1.613-8.515,1.528-8.619,1.392-8.771c-0.508-0.545-1.066-0.834-1.68-1.061\r\n\t\tc-0.31-0.108-0.627-0.191-1.046-0.191c-0.201,0.006-0.488,0.021-0.816,0.266c-0.171,0.155-0.309,0.345-0.34,0.633\r\n\t\tC-2.5-9.058-2.503-8.992-2.502-8.929C-2.5-8.883-2.497-8.887-2.494-8.864l0.017,0.103l0.051,0.241\r\n\t\tc0.014,0.037,0.012,0.092,0.021,0.137c0.01,0.094,0.013,0.2,0.005,0.309c-0.009,0.217-0.052,0.45-0.113,0.678\r\n\t\tc-0.12,0.457-0.329,0.92-0.581,1.268l-0.15,0.181C-3.268-5.927-3.4-5.831-3.357-5.861c-0.032,0.017-0.064,0.041-0.094,0.048\r\n\t\tc-0.12,0.052-0.208,0.05-0.345,0.009c-0.28-0.095-0.639-0.463-0.897-0.85c-0.142-0.205-0.277-0.455-0.47-0.713\r\n\t\tc-0.184-0.249-0.39-0.494-0.652-0.716c-0.259-0.219-0.591-0.425-1.002-0.5c-0.41-0.079-0.851,0.021-1.171,0.203\r\n\t\tC-8.141-8.302-8.35-8.146-8.426-8.071l-0.078,0.068l-0.02,0.018l-0.033,0.029l-0.013,0.015l-0.053,0.062\r\n\t\tC-8.69-7.795-8.765-7.719-8.815-7.62c-0.239,0.397-0.221,0.865-0.133,1.197c0.184,0.692,0.546,1.166,0.895,1.634\r\n\t\tc0.36,0.456,0.746,0.869,1.133,1.272c0.211,0.223,0.353,0.353,0.416,0.507c0.067,0.156,0.082,0.335,0.041,0.538\r\n\t\tc-0.08,0.402-0.381,0.857-0.702,1.191l-0.047,0.051L-7.232-1.2c-0.607,0.995-1.259,1.974-1.914,2.942\r\n\t\tc-0.328,0.485-0.665,0.963-1.014,1.43c-0.346,0.46-0.71,0.934-1.092,1.349c-0.049,0.056-0.094,0.092-0.139,0.138\r\n\t\tc-0.021,0.019-0.026,0.017-0.037,0.031c0.053-0.041,0.241,0.034,0.231,0.138c-0.006-0.026,0.032-0.221,0.063-0.344l0.205-0.864\r\n\t\tc0.059-0.289,0.118-0.6,0.143-0.889c0.03-0.296,0.069-0.566,0.149-0.847C-10.323,0.77-9.785-0.293-9.169-1.294\"/>\r\n                <path fill=\"#ADC80C\" d=\"M-9.169-1.294c0,0-1.571,2.234-1.759,3.902c-0.189,1.668-1.105,3.165,0.181,1.722\r\n\t\tC-9,2.371-6.881-0.978-6.881-0.978S-5.29-2.471-6.35-3.6c-1.06-1.131-2.826-3.015-1.821-3.957C-7.167-8.499-6.209-7.981-5.4-6.615\r\n\t\ts1.648,1.758,2.394,1.295c0.746-0.463,1.539-2.387,1.209-3.494c-0.33-1.106,2.323-0.29,2.896,0.825\r\n\t\tc0.574,1.114-0.706,3.021-2.418,3.21C0.377-4.48,1.735-5.046,2.387-6.364c0.652-1.319,1.758,2.126,1.005,2.833\r\n\t\tS0.047-1.812-0.911-2.33c1.156,1.319,1.422,0.985,2.501,0.636c1.08-0.35,1.408,1.413-0.49,1.95S-3.248-0.055-3.665-0.41\r\n\t\tc-0.416-0.355-1.304,1.417-2.02,2.113c-2.204,2.947-4.212,9.898-7.208,7.951c-2.518-1.638-1.865-3.675-1.7-7.374\"/>\r\n            </symbol>\r\n            <symbol id=\"avatarQuestion\" viewBox=\"-52.748 -52.747 105.495 105.494\">\r\n                <path fill=\"#00FFFF\" d=\"M-31.22-20.429c-0.617-0.849-0.927-1.786-0.927-2.815c0-1.798,0.478-3.186,1.428-4.163\r\n\t\tc0.951-0.976,2.068-1.465,3.354-1.465c1.079,0,1.979,0.386,2.698,1.157c0.721,0.771,1.31,1.877,1.773,3.315\r\n\t\tc0.154,0.72,0.694,1.079,1.618,1.079c0.297,0,0.62-0.015,0.965-0.043l-6.716,7.088c-0.67-0.549-1.318-1.099-1.919-1.648\r\n\t\tC-29.845-18.745-30.605-19.581-31.22-20.429z\"/>\r\n                <polygon fill=\"#00FFFF\" points=\"-0.989,-25.708 -1.718,-22.528 -1.683,-25.708 \t\"/>\r\n                <path fill=\"#00FFFF\" d=\"M35.512,12.567c0.158-0.219,0.306-0.414,0.435-0.565c-0.433-1.367-3.625-1.364-4.399-0.381\r\n\t\tc-0.057,0.072-0.129,0.175-0.205,0.284c-1.706-0.176-3.173-1.327-3.711-2.984L22.721-12.51c1.732-0.266,3.594-0.723,5.315-1.501\r\n\t\tc5.312-2.404,4.806-5.735,2.319-7.21l-8.739-4.933v-14.563c0-1.75-1.419-3.169-3.169-3.169H0.436c-0.728,0-1.39,0.255-1.925,0.667\r\n\t\tv-0.012h0l-0.053,0.056c-0.247,0.199-0.472,0.422-0.649,0.686L-15.749-28.18c-0.513-0.837-1.249-1.593-2.211-2.265\r\n\t\tc-0.976-0.682-2.171-1.232-3.585-1.651c-1.413-0.42-3.046-0.631-4.897-0.631c-2.105,0-3.957,0.368-5.55,1.103\r\n\t\tc-1.593,0.735-2.916,1.66-3.971,2.775c-1.053,1.116-1.85,2.342-2.39,3.678c-0.54,1.337-0.81,2.648-0.81,3.932\r\n\t\tc0,1.542,0.283,2.904,0.847,4.086c0.567,1.183,1.287,2.236,2.16,3.161c0.875,0.925,1.812,1.787,2.814,2.583\r\n\t\tc0.332,0.264,0.646,0.521,0.964,0.779L-51.81,9.882C-52.417,6.68-52.748,3.379-52.748,0c0-29.132,23.616-52.747,52.747-52.747\r\n\t\tc29.132,0,52.748,23.615,52.748,52.747c0,7.743-1.682,15.09-4.68,21.714L35.512,12.567z\"/>\r\n                <path fill=\"#00D9D7\" d=\"M-30.528-9.096c0.875,0.746,1.595,1.53,2.16,2.351c0.566,0.823,0.848,1.748,0.848,2.776\r\n\t\tc0,2.004-0.436,4.292-1.311,6.861c-0.155,0.462-0.231,0.771-0.231,0.925c0,0.412,0.181,0.784,0.539,1.118\r\n\t\tc0.361,0.335,1.079,0.655,2.159,0.963c4.317-4.83,6.477-8.762,6.477-11.794c0-1.439-0.309-2.724-0.925-3.855\r\n\t\tc-0.617-1.13-1.375-2.159-2.274-3.084c-0.899-0.925-1.876-1.799-2.93-2.622c-0.35-0.273-0.678-0.546-1.011-0.819l6.716-7.088\r\n\t\tc0.314-0.025,0.646-0.061,1.002-0.111c0.745-0.102,1.439-0.243,2.082-0.424c0.643-0.179,1.183-0.411,1.618-0.694\r\n\t\tc0.438-0.282,0.656-0.603,0.656-0.963c0-0.874-0.257-1.736-0.771-2.588c-0.008-0.012-0.018-0.024-0.024-0.036l13.557-14.309\r\n\t\tc-0.342,0.506-0.542,1.115-0.542,1.772v14.73c0,0.154,0.125,0.279,0.279,0.279h0.772l-0.035,3.18l-0.246,1.072H-3.94\r\n\t\tc-1.112,0-2.014,0.901-2.014,2.013c0,1.112,0.901,2.014,2.014,2.014h1.054L-8.923,8.921c-0.191,0.589-0.509,1.106-0.902,1.549\r\n\t\tl-3.396,0.838c-1.129-0.649-3.638-0.507-4.018,0.694c0.059,0.069,0.13,0.165,0.194,0.249l-4.478,1.104\r\n\t\tc-0.04-1.463-0.553-2.72-1.564-3.756c-1.053-1.079-2.353-1.619-3.895-1.619c-1.489,0-2.762,0.54-3.815,1.619\r\n\t\tc-1.053,1.079-1.581,2.391-1.581,3.933c0,0.873,0.174,1.662,0.49,2.38l-1.926,0.476l0.112,0.189\r\n\t\tc-5.084,1.94-0.425,20.318,4.789,25.518c1.877,1.87,3.684,3.791,4.535,4.612c0.043,0.041,0.079,0.086,0.121,0.128\r\n\t\tC-38.373,39.509-48.754,25.997-51.81,9.882l19.434-20.512C-31.735-10.108-31.112-9.594-30.528-9.096z\"/>\r\n                <path fill=\"#D7D8D7\"\r\n                      d=\"M-1.49-43.23L-1.49-43.23l0,0.012c-0.019,0.014-0.036,0.03-0.053,0.044L-1.49-43.23z\"/>\r\n                <path fill=\"#1A4796\" d=\"M22.674-17.43c1.112,0,2.014-0.902,2.014-2.014c0-1.112-0.902-2.013-2.014-2.013H20.67l-0.974-4.252h1.64\r\n\t\tc0.154,0,0.279-0.125,0.279-0.279v-0.167l8.739,4.933c2.487,1.475,2.993,4.806-2.319,7.21c-1.722,0.779-3.583,1.235-5.315,1.501\r\n\t\tl-1.127-4.919H22.674z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M24.688-19.444c0,1.112-0.902,2.014-2.014,2.014h-1.081L20.97-20.15c0.039-0.002,0.073-0.011,0.112-0.011\r\n\t\tc1.006,0,1.822,0.582,1.822,1.3c0,0.295-0.139,0.566-0.371,0.784c0.713-0.245,1.206-0.763,1.206-1.366\r\n\t\tc0-0.837-0.952-1.516-2.126-1.516c-0.285,0-0.555,0.041-0.803,0.113l-0.14-0.609h2.004C23.786-21.457,24.688-20.556,24.688-19.444z\r\n\t\t\"/>\r\n                <path fill=\"#CDAE2C\" d=\"M23.739-19.444c0,0.603-0.493,1.121-1.206,1.366c0.232-0.218,0.371-0.489,0.371-0.784\r\n\t\tc0-0.718-0.816-1.3-1.822-1.3c-0.039,0-0.074,0.009-0.112,0.011l-0.16-0.697c0.248-0.072,0.519-0.113,0.803-0.113\r\n\t\tC22.787-20.96,23.739-20.281,23.739-19.444z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M-2.879-20.96c-1.174,0-2.125,0.679-2.125,1.516c0,0.603,0.493,1.121,1.206,1.366\r\n\t\tc-0.232-0.218-0.371-0.489-0.371-0.784c0-0.718,0.816-1.3,1.822-1.3c0.03,0,0.057,0.007,0.086,0.008l-0.624,2.724H-3.94\r\n\t\tc-1.112,0-2.014-0.902-2.014-2.014c0-1.112,0.901-2.013,2.014-2.013h1.977l-0.138,0.604C-2.342-20.921-2.604-20.96-2.879-20.96z\"/>\r\n                <path fill=\"#CDAE2C\" d=\"M-4.17-18.862c0,0.295,0.139,0.566,0.371,0.784c-0.713-0.245-1.206-0.763-1.206-1.366\r\n\t\tc0-0.837,0.952-1.516,2.125-1.516c0.275,0,0.537,0.039,0.777,0.107l-0.16,0.699c-0.029-0.001-0.056-0.008-0.086-0.008\r\n\t\tC-3.354-20.162-4.17-19.58-4.17-18.862z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M9.354,22.215l0,0.012L9.354,22.215l-1.997-0.018l7.344-8.324c1.081-1.225,1.307-2.705,0.947-4.011\r\n\t\tc0.041-2.6-2.309-5.037-5.327-4.363L7.331,6.237L6.11,4.783C5.544,4.109,4.54,4.022,3.867,4.588\r\n\t\tc-0.6,0.503-0.732,1.352-0.356,2.007C3.457,6.789,3.438,6.991,3.459,7.192L-9.826,10.47c0.394-0.442,0.711-0.96,0.902-1.549\r\n\t\tl6.038-26.351l0.624-2.724l0.16-0.699l0.138-0.604l0.246-1.072l0.729-3.18h20.685l0.974,4.252l0.14,0.609l0.16,0.697l0.624,2.721\r\n\t\tl1.127,4.919l4.911,21.431c0.539,1.657,2.005,2.809,3.711,2.984c-1.027,1.479-3.694,6.198-5.372,10.167L9.354,22.215z M1.815,2.002\r\n\t\tc0.351,0.087,0.706-0.063,0.899-0.344c0.449-0.661,1.739-0.923,2.948-0.945C6.9,0.679,8.186,0.799,9.47,0.927\r\n\t\tc1.286,0.13,2.581,0.284,3.888,0.352c0.652,0.031,1.309,0.043,1.963-0.008c0.651-0.051,1.309-0.162,1.902-0.431l1.662-0.755\r\n\t\tl-0.693-0.487c-0.306-0.214-0.563-0.414-0.91-0.641c-0.342-0.228-0.684-0.452-1.025-0.644c-0.68-0.401-1.397-0.752-2.137-1.05\r\n\t\tc-1.477-0.599-3.074-0.959-4.69-0.994C7.814-3.756,6.182-3.461,4.704-2.76C3.969-2.405,3.263-1.969,2.646-1.385\r\n\t\tC2.039-0.805,1.469-0.1,1.226,0.882L1.201,0.982C1.089,1.434,1.365,1.891,1.815,2.002z M7.749-19.788\r\n\t\tc-0.105-0.239-0.313-0.539-0.624-0.854c-0.31-0.312-0.744-0.624-1.279-0.81c-0.269-0.089-0.56-0.14-0.858-0.153\r\n\t\tc-0.284-0.018-0.617-0.019-0.896,0.013c-1.191,0.09-2.262,0.694-2.829,1.307c-0.297,0.298-0.501,0.574-0.629,0.78\r\n\t\tc-0.128,0.203-0.189,0.319-0.189,0.319l0.1,0.077c0,0,0.093-0.101,0.262-0.255c0.168-0.151,0.413-0.371,0.738-0.573\r\n\t\tc0.646-0.409,1.604-0.754,2.562-0.647c0.251,0.027,0.45,0.066,0.682,0.142c0.218,0.071,0.426,0.153,0.628,0.23\r\n\t\tc0.408,0.137,0.797,0.274,1.147,0.408c0.366,0.141,0.671,0.259,0.884,0.341c0.222,0.091,0.367,0.137,0.367,0.137l0.091-0.088\r\n\t\tC7.906-19.415,7.866-19.561,7.749-19.788z M18.249-19.505c-0.128-0.207-0.333-0.482-0.629-0.781\r\n\t\tc-0.567-0.612-1.638-1.217-2.829-1.307c-0.279-0.032-0.613-0.03-0.896-0.013c-0.298,0.014-0.59,0.065-0.858,0.153\r\n\t\tc-0.535,0.186-0.969,0.499-1.279,0.811c-0.311,0.314-0.519,0.614-0.625,0.854c-0.116,0.227-0.156,0.374-0.156,0.374l0.091,0.087\r\n\t\tc0,0,0.145-0.046,0.367-0.136c0.213-0.083,0.518-0.2,0.884-0.342c0.35-0.133,0.739-0.27,1.147-0.407\r\n\t\tc0.202-0.077,0.41-0.159,0.628-0.23c0.231-0.077,0.43-0.115,0.682-0.143c0.958-0.107,1.916,0.239,2.561,0.648\r\n\t\tc0.326,0.201,0.571,0.421,0.739,0.572c0.169,0.155,0.262,0.256,0.262,0.256l0.1-0.077C18.438-19.186,18.376-19.303,18.249-19.505z\r\n\t\t M19.387-13.826c0.325-2.83-1.751-5.246-4.635-5.397c-2.361-0.123-4.509,1.32-5.398,3.395c-0.889-2.075-3.038-3.518-5.398-3.395\r\n\t\tc-2.884,0.151-4.96,2.567-4.635,5.397c0.325,2.83,2.926,5.003,5.811,4.852c1.944-0.102,3.5-1.244,4.222-2.838\r\n\t\tc0.722,1.594,2.277,2.736,4.222,2.838C16.461-8.823,19.062-10.996,19.387-13.826z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M31.423,24.036c0.12-0.886-0.434-1.682-1.241-1.918c1.602-3.397,3.955-7.648,5.33-9.551l12.556,9.146\r\n\t\tc-3.727,8.236-9.497,15.35-16.679,20.676C31.056,37.136,30.737,29.133,31.423,24.036z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M-28.912,42.095c-5.214-5.199-9.873-23.577-4.789-25.518l1.413,2.381l16.756,29.184l2.661-3.017\r\n\t\tc-0.118,1.569-0.209,2.531-0.209,2.531c-0.125,1.25-0.575,2.287-1.265,3.101c-3.462-0.977-6.777-2.296-9.911-3.922\r\n\t\tc-0.042-0.042-0.078-0.087-0.121-0.128C-25.228,45.886-27.035,43.965-28.912,42.095z\"/>\r\n                <path fill=\"#077FBD\" d=\"M9.354,22.215l16.617-0.143c-0.582,1.375-1.046,2.661-1.278,3.686c-0.073,0.322-0.091,0.607-0.083,0.872\r\n\t\tc-0.345,2.951,3.498,3.192,3.937-0.064c0.057-0.423,0.207-0.983,0.413-1.621c0.299-0.794,0.721-1.764,1.222-2.826\r\n\t\tc0.808,0.236,1.361,1.032,1.241,1.918c-0.686,5.097-0.367,13.1-0.035,18.354c-6.066,4.499-13.129,7.73-20.8,9.293L9.354,22.227\r\n\t\tL9.354,22.215z\"/>\r\n                <path fill=\"#077FBD\" d=\"M-12.871,45.125L7.357,22.197l1.996,0.018l0,0.012l1.235,29.456C7.168,52.38,3.626,52.747,0,52.747\r\n\t\tc-4.974,0-9.781-0.703-14.344-1.99c0.689-0.813,1.14-1.851,1.265-3.101C-13.08,47.656-12.989,46.694-12.871,45.125z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M13.576-8.974c-1.944-0.102-3.5-1.244-4.222-2.838c0.349-0.77,0.519-1.637,0.413-2.559\r\n\t\tc-0.059-0.515-0.216-0.996-0.413-1.457c0.889-2.075,3.037-3.518,5.398-3.395c2.884,0.151,4.96,2.567,4.635,5.397\r\n\t\tC19.062-10.996,16.461-8.823,13.576-8.974z M12.696-18.078c-1.413,0-2.559,1.146-2.559,2.559s1.146,2.559,2.559,2.559\r\n\t\ts2.559-1.146,2.559-2.559S14.109-18.078,12.696-18.078z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M9.354-11.812c-0.722,1.594-2.278,2.736-4.222,2.838c-2.885,0.151-5.486-2.022-5.811-4.852\r\n\t\tc-0.325-2.83,1.751-5.246,4.635-5.397c2.36-0.123,4.509,1.32,5.398,3.395c0.197,0.461,0.354,0.942,0.413,1.457\r\n\t\tC9.873-13.449,9.703-12.582,9.354-11.812z M5.868-18.078c-1.413,0-2.559,1.146-2.559,2.559s1.146,2.559,2.559,2.559\r\n\t\tc1.413,0,2.559-1.146,2.559-2.559S7.281-18.078,5.868-18.078z\"/>\r\n                <path fill=\"#1A2451\" d=\"M12.696-12.959c-1.413,0-2.559-1.146-2.559-2.559s1.146-2.559,2.559-2.559s2.559,1.146,2.559,2.559\r\n\t\tS14.109-12.959,12.696-12.959z\"/>\r\n                <path fill=\"#1A2451\" d=\"M5.868-12.959c-1.413,0-2.559-1.146-2.559-2.559s1.146-2.559,2.559-2.559c1.413,0,2.559,1.146,2.559,2.559\r\n\t\tS7.281-12.959,5.868-12.959z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M5.524-0.848C6.71-1.296,8.021-1.424,9.293-1.297c1.277,0.136,2.527,0.524,3.689,1.112\r\n\t\tc0.582,0.293,1.147,0.627,1.685,1.011c0.088,0.059,0.168,0.126,0.251,0.187c-0.507-0.036-1.013-0.083-1.516-0.164\r\n\t\tc-1.27-0.207-2.527-0.5-3.798-0.772C8.332-0.195,7.05-0.464,5.698-0.579C5.466-0.597,5.229-0.601,4.992-0.605\r\n\t\tC5.168-0.689,5.342-0.778,5.524-0.848z\"/>\r\n                <path fill=\"#F3901E\" d=\"M1.226,0.882C1.469-0.1,2.039-0.805,2.646-1.385C3.263-1.969,3.969-2.405,4.704-2.76\r\n\t\tC6.182-3.461,7.814-3.756,9.43-3.73c1.616,0.035,3.213,0.396,4.69,0.994c0.74,0.298,1.457,0.648,2.137,1.05\r\n\t\tc0.341,0.191,0.683,0.416,1.025,0.644c0.347,0.227,0.604,0.427,0.91,0.641l0.693,0.487L17.223,0.84\r\n\t\tc-0.593,0.269-1.251,0.38-1.902,0.431c-0.654,0.051-1.311,0.039-1.963,0.008c-1.307-0.067-2.602-0.222-3.888-0.352\r\n\t\tC8.186,0.799,6.9,0.679,5.663,0.713C4.454,0.735,3.164,0.997,2.714,1.658C2.521,1.939,2.167,2.089,1.815,2.002\r\n\t\tc-0.451-0.111-0.726-0.568-0.615-1.02L1.226,0.882z M9.604,0.076c1.271,0.272,2.528,0.565,3.798,0.772\r\n\t\tc0.503,0.081,1.009,0.128,1.516,0.164c-0.083-0.061-0.163-0.128-0.251-0.187c-0.538-0.384-1.103-0.718-1.685-1.011\r\n\t\tc-1.162-0.588-2.412-0.977-3.689-1.112C8.021-1.424,6.71-1.296,5.524-0.848C5.342-0.778,5.168-0.689,4.992-0.605\r\n\t\tc0.237,0.005,0.474,0.009,0.706,0.026C7.05-0.464,8.332-0.195,9.604,0.076z\"/>\r\n                <path fill=\"#004B77\" d=\"M28.583,26.083c0.078-0.31,0.212-0.702,0.376-1.139c-0.206,0.638-0.355,1.198-0.413,1.621\r\n\t\tc-0.439,3.257-4.282,3.016-3.937,0.064C24.686,29.043,27.83,29.059,28.583,26.083z\"/>\r\n                <path fill=\"#077FBD\" d=\"M28.96,24.944c-0.164,0.437-0.298,0.829-0.376,1.139c-0.754,2.976-3.897,2.96-3.973,0.547\r\n\t\tc-0.008-0.265,0.009-0.55,0.083-0.872c0.232-1.024,0.696-2.311,1.278-3.686c1.678-3.969,4.345-8.688,5.372-10.167\r\n\t\tc0.076-0.109,0.148-0.212,0.205-0.284c0.774-0.983,3.966-0.986,4.399,0.381c-0.129,0.151-0.277,0.347-0.435,0.565\r\n\t\tc-1.375,1.902-3.728,6.153-5.33,9.551C29.681,23.181,29.259,24.15,28.96,24.944z M26.417,27.698c0.8,0,1.449-0.647,1.449-1.447\r\n\t\tc0-0.801-0.649-1.448-1.449-1.448c-0.799,0-1.448,0.647-1.448,1.448C24.969,27.051,25.618,27.698,26.417,27.698z\"/>\r\n                <path fill=\"#FDD129\" d=\"M26.417,24.803c0.8,0,1.449,0.647,1.449,1.448c0,0.8-0.649,1.447-1.449,1.447\r\n\t\tc-0.799,0-1.448-0.647-1.448-1.447C24.969,25.45,25.618,24.803,26.417,24.803z\"/>\r\n                <path fill=\"#077FBD\"\r\n                      d=\"M-17.044,12.251c-0.064-0.084-0.136-0.18-0.194-0.249c0.38-1.201,2.889-1.344,4.018-0.694L-17.044,12.251z\"\r\n                />\r\n                <path fill=\"#077FBD\" d=\"M21.336-25.708h-1.64H-0.989h-0.694h-0.772c-0.154,0-0.279-0.125-0.279-0.279v-14.73\r\n\t\tc0-0.657,0.2-1.266,0.542-1.772c0.178-0.263,0.403-0.487,0.649-0.686c0.018-0.014,0.035-0.03,0.053-0.044\r\n\t\tc0.535-0.412,1.197-0.667,1.925-0.667h18.011c1.75,0,3.169,1.419,3.169,3.169v14.563v0.167\r\n\t\tC21.616-25.833,21.491-25.708,21.336-25.708z\"/>\r\n                <path fill=\"#1A2451\" d=\"M10.474,6.718L8.167,7.232L7.331,6.237l2.991-0.738c3.019-0.674,5.368,1.764,5.327,4.363\r\n\t\tC15.076,7.784,13.011,6.151,10.474,6.718z\"/>\r\n                <path fill=\"#1A2451\" d=\"M3.459,7.192c0.032,0.305,0.152,0.604,0.364,0.856l0.108,0.129l-25.466,5.682\r\n\t\tc0.006-0.11,0.028-0.214,0.028-0.327c0-0.062-0.014-0.116-0.016-0.177l4.478-1.104l3.823-0.943l3.396-0.838L3.459,7.192z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-31.767,16.143l-1.894,0.423l1.373,2.393l-1.413-2.381l-0.112-0.189l1.926-0.476\r\n\t\tC-31.852,15.992-31.806,16.065-31.767,16.143z\"/>\r\n                <path fill=\"#1A2451\" d=\"M7.433,7.396L6.262,6.002C5.696,5.328,4.692,5.241,4.02,5.806C3.765,6.02,3.594,6.297,3.511,6.595\r\n\t\tC3.135,5.939,3.267,5.091,3.867,4.588C4.54,4.022,5.544,4.109,6.11,4.783l1.221,1.454l0.836,0.995L7.433,7.396z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M-33.661,16.565l1.894-0.423c0.251,0.502,0.559,0.976,0.971,1.398c1.054,1.08,2.326,1.619,3.815,1.619\r\n\t\tc1.542,0,2.842-0.539,3.895-1.619c0.979-1.002,1.482-2.235,1.552-3.682L3.931,8.178l2.165,2.578c0.565,0.673,1.57,0.76,2.243,0.195\r\n\t\tc0.673-0.565,0.761-1.57,0.195-2.243L7.433,7.396l0.733-0.164l2.307-0.515c2.537-0.566,4.603,1.066,5.175,3.145\r\n\t\tc0.36,1.306,0.134,2.786-0.947,4.011l-7.344,8.324l-20.228,22.928l-2.661,3.017l-16.756-29.184L-33.661,16.565z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M6.262,6.002l1.171,1.395l1.101,1.312c0.566,0.673,0.478,1.678-0.195,2.243\r\n\t\tc-0.673,0.564-1.678,0.478-2.243-0.195L3.931,8.178L3.823,8.049C3.611,7.796,3.491,7.497,3.459,7.192\r\n\t\tC3.438,6.991,3.457,6.789,3.511,6.595C3.594,6.297,3.765,6.02,4.02,5.806C4.692,5.241,5.696,5.328,6.262,6.002z\"/>\r\n                <path fill=\"#1A2451\" d=\"M18.075-19.365c-0.168-0.151-0.413-0.371-0.739-0.572c-0.645-0.409-1.603-0.755-2.561-0.648\r\n\t\tc-0.252,0.028-0.451,0.066-0.682,0.143c-0.218,0.071-0.426,0.153-0.628,0.23c-0.408,0.137-0.797,0.274-1.147,0.407\r\n\t\tc-0.366,0.142-0.671,0.259-0.884,0.342c-0.222,0.09-0.367,0.136-0.367,0.136l-0.091-0.087c0,0,0.04-0.147,0.156-0.374\r\n\t\tc0.106-0.24,0.314-0.54,0.625-0.854c0.31-0.312,0.744-0.625,1.279-0.811c0.268-0.088,0.56-0.139,0.858-0.153\r\n\t\tc0.283-0.017,0.617-0.019,0.896,0.013c1.191,0.09,2.262,0.695,2.829,1.307c0.296,0.299,0.501,0.574,0.629,0.781\r\n\t\tc0.128,0.202,0.189,0.319,0.189,0.319l-0.1,0.077C18.337-19.109,18.244-19.21,18.075-19.365z\"/>\r\n                <path fill=\"#1A2451\" d=\"M7.448-19.463c-0.213-0.082-0.518-0.2-0.884-0.341c-0.35-0.134-0.739-0.271-1.147-0.408\r\n\t\tc-0.202-0.077-0.41-0.159-0.628-0.23c-0.232-0.076-0.431-0.115-0.682-0.142c-0.958-0.107-1.916,0.238-2.562,0.647\r\n\t\tc-0.325,0.202-0.57,0.422-0.738,0.573c-0.169,0.154-0.262,0.255-0.262,0.255l-0.1-0.077c0,0,0.061-0.116,0.189-0.319\r\n\t\tc0.128-0.206,0.332-0.482,0.629-0.78c0.567-0.613,1.638-1.217,2.829-1.307c0.279-0.032,0.612-0.031,0.896-0.013\r\n\t\tc0.298,0.013,0.589,0.064,0.858,0.153c0.535,0.186,0.969,0.498,1.279,0.81c0.311,0.315,0.519,0.615,0.624,0.854\r\n\t\tc0.117,0.228,0.157,0.374,0.157,0.374l-0.091,0.088C7.815-19.326,7.67-19.373,7.448-19.463z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-14.953-25.556c0,0.36-0.219,0.681-0.656,0.963c-0.436,0.283-0.976,0.515-1.618,0.694\r\n\t\tc-0.643,0.181-1.337,0.322-2.082,0.424c-0.355,0.05-0.688,0.085-1.002,0.111c-0.345,0.028-0.668,0.043-0.965,0.043\r\n\t\tc-0.924,0-1.464-0.359-1.618-1.079c-0.464-1.438-1.053-2.544-1.773-3.315c-0.719-0.771-1.619-1.157-2.698-1.157\r\n\t\tc-1.285,0-2.402,0.489-3.354,1.465c-0.95,0.977-1.428,2.365-1.428,4.163c0,1.029,0.31,1.966,0.927,2.815\r\n\t\tc0.615,0.848,1.375,1.684,2.274,2.505c0.601,0.55,1.249,1.099,1.919,1.648c0.333,0.273,0.661,0.546,1.011,0.819\r\n\t\tc1.054,0.823,2.03,1.697,2.93,2.622c0.899,0.925,1.657,1.954,2.274,3.084c0.616,1.131,0.925,2.416,0.925,3.855\r\n\t\tc0,3.033-2.159,6.964-6.477,11.794c-1.08-0.308-1.798-0.628-2.159-0.963c-0.358-0.334-0.539-0.706-0.539-1.118\r\n\t\tc0-0.153,0.076-0.463,0.231-0.925c0.875-2.569,1.311-4.857,1.311-6.861c0-1.028-0.281-1.954-0.848-2.776\r\n\t\tc-0.565-0.821-1.285-1.605-2.16-2.351c-0.584-0.498-1.207-1.012-1.849-1.534c-0.317-0.258-0.632-0.515-0.964-0.779\r\n\t\tc-1.003-0.796-1.939-1.658-2.814-2.583c-0.873-0.925-1.593-1.978-2.16-3.161c-0.563-1.182-0.847-2.544-0.847-4.086\r\n\t\tc0-1.284,0.27-2.595,0.81-3.932c0.54-1.336,1.337-2.562,2.39-3.678c1.055-1.115,2.378-2.04,3.971-2.775\r\n\t\tc1.593-0.735,3.444-1.103,5.55-1.103c1.852,0,3.484,0.211,4.897,0.631c1.414,0.419,2.609,0.969,3.585,1.651\r\n\t\tc0.962,0.672,1.698,1.428,2.211,2.265c0.007,0.012,0.017,0.024,0.024,0.036C-15.209-27.292-14.953-26.43-14.953-25.556z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-21.535,13.859c-0.069,1.446-0.573,2.68-1.552,3.682c-1.053,1.08-2.353,1.619-3.895,1.619\r\n\t\tc-1.489,0-2.762-0.539-3.815-1.619c-0.412-0.423-0.72-0.896-0.971-1.398c-0.039-0.077-0.085-0.15-0.12-0.23\r\n\t\tc-0.316-0.718-0.49-1.507-0.49-2.38c0-1.542,0.528-2.854,1.581-3.933c1.054-1.079,2.326-1.619,3.815-1.619\r\n\t\tc1.542,0,2.842,0.54,3.895,1.619c1.012,1.036,1.524,2.293,1.564,3.756c0.002,0.061,0.016,0.115,0.016,0.177\r\n\t\tC-21.506,13.646-21.529,13.749-21.535,13.859z\"/>\r\n            </symbol>\r\n            <symbol id=\"avatarSad\" viewBox=\"-47.702 -47.703 95.404 95.406\">\r\n                <path fill=\"#00FFFF\" d=\"M16.584-15.424c1.087-0.282,2.177-0.644,3.219-1.115c5.853-2.648,5.295-6.318,2.555-7.944l-9.713-5.482\r\n\t\tc0.053-0.115,0.085-0.241,0.085-0.376v-8.708c0-3.083-1.349-5.844-3.479-7.75C31.167-42.49,47.702-23.18,47.702,0\r\n\t\tc0,1.967-0.133,3.9-0.364,5.805L16.584-15.424z\"/>\r\n                <path fill=\"#00FFFF\" d=\"M23.673,11.701c-0.063,0.079-0.142,0.192-0.226,0.313c-1.879-0.192-3.496-1.462-4.089-3.287L17.346-0.06\r\n\t\tl3.74,3.705l6.612,7.632C26.471,10.682,24.316,10.884,23.673,11.701z\"/>\r\n                <path fill=\"#00FFFF\" d=\"M-13.859-41.244l-33.464,35.32c2.463-19.866,17.129-35.935,36.271-40.478\r\n\t\tC-12.439-45.013-13.431-43.234-13.859-41.244z\"/>\r\n                <path fill=\"#00D9D7\" d=\"M-20.917,8.727c-0.592,1.825-2.209,3.094-4.089,3.287c-0.083-0.12-0.163-0.233-0.226-0.313\r\n\t\tc-0.839-1.066-4.25-1.083-4.813,0.352h-0.496l7.286-8.408l4.531-4.489L-20.917,8.727z\"/>\r\n                <path fill=\"#00D9D7\" d=\"M-14.095-39.049v8.708c0,0.505,0.409,0.915,0.915,0.915h1.007l-1.074,4.685h-2.178\r\n\t\tc-1.226,0-2.219,0.993-2.219,2.219c0,1.225,0.993,2.218,2.219,2.218h1.161l-0.977,4.261c-0.175,0.011-0.352,0.026-0.531,0.058\r\n\t\tc-0.745-0.144-1.557-0.11-2.396,0.158l-29.322,20.24C-47.625,2.959-47.702,1.488-47.702,0c0-2.008,0.139-3.981,0.379-5.924\r\n\t\tl33.464-35.32C-14.01-40.536-14.095-39.803-14.095-39.049z\"/>\r\n                <path fill=\"#253B8C\" d=\"M13.693-15.998l-0.987-4.307h1.19c1.226,0,2.219-0.993,2.219-2.218c0-1.226-0.993-2.219-2.219-2.219H11.69\r\n\t\tl-1.074-4.685h1.199c0.37,0,0.686-0.223,0.83-0.539l9.713,5.482c2.74,1.626,3.298,5.296-2.555,7.944\r\n\t\tc-1.042,0.472-2.132,0.833-3.219,1.115l-0.586-0.404C15.193-16.085,14.414-16.123,13.693-15.998z\"/>\r\n                <path fill=\"#FDD302\" d=\"M12.143-23.314c1.108,0,2.007,0.641,2.007,1.432c0,0.325-0.153,0.624-0.409,0.864\r\n\t\tc0.785-0.27,1.329-0.841,1.329-1.505c0-0.923-1.048-1.671-2.342-1.671c-0.313,0-0.611,0.044-0.884,0.124l-0.154-0.671h2.207\r\n\t\tc1.226,0,2.219,0.993,2.219,2.219c0,1.225-0.993,2.218-2.219,2.218h-1.19l-0.687-2.998C12.062-23.304,12.1-23.314,12.143-23.314z\"\r\n                />\r\n                <path fill=\"#D6B406\" d=\"M15.07-22.523c0,0.664-0.544,1.235-1.329,1.505c0.256-0.24,0.409-0.539,0.409-0.864\r\n\t\tc0-0.791-0.899-1.432-2.007-1.432c-0.043,0-0.081,0.01-0.124,0.012l-0.176-0.768c0.273-0.08,0.571-0.124,0.884-0.124\r\n\t\tC14.022-24.194,15.07-23.446,15.07-22.523z\"/>\r\n                <path fill=\"#FDD302\" d=\"M-14.256-24.194c-1.294,0-2.342,0.748-2.342,1.671c0,0.664,0.544,1.235,1.329,1.505\r\n\t\tc-0.256-0.24-0.409-0.539-0.409-0.864c0-0.791,0.899-1.432,2.007-1.432c0.033,0,0.063,0.008,0.095,0.009l-0.688,3h-1.161\r\n\t\tc-1.226,0-2.219-0.993-2.219-2.218c0-1.226,0.993-2.219,2.219-2.219h2.178l-0.152,0.666\r\n\t\tC-13.666-24.151-13.954-24.194-14.256-24.194z\"/>\r\n                <path fill=\"#D6B406\" d=\"M-15.678-21.882c0,0.325,0.153,0.624,0.409,0.864c-0.785-0.27-1.329-0.841-1.329-1.505\r\n\t\tc0-0.923,1.048-1.671,2.342-1.671c0.303,0,0.591,0.043,0.856,0.118l-0.177,0.771c-0.032-0.001-0.062-0.009-0.095-0.009\r\n\t\tC-14.779-23.314-15.678-22.673-15.678-21.882z\"/>\r\n                <path fill=\"#FDD302\" d=\"M23.536,25.38c0.132-0.976-0.478-1.853-1.367-2.113c1.949-4.133,4.91-9.418,6.309-11.091l0.084,0.097\r\n\t\tl4.231,22.354c-2.859,2.709-6.051,5.068-9.512,7.008C23.033,36.269,22.938,29.822,23.536,25.38z\"/>\r\n                <path fill=\"#FDD302\" d=\"M-30.541,12.053h0.496c-0.01,0.023-0.024,0.044-0.032,0.068c1.381,1.619,4.384,6.974,6.351,11.146\r\n\t\tc-0.89,0.261-1.498,1.138-1.367,2.113c0.565,4.202,0.512,10.198,0.295,15.377c-9.523-5.808-16.841-14.864-20.438-25.624\r\n\t\tl10.021,2.315L-30.541,12.053z\"/>\r\n                <path fill=\"#FDD302\" d=\"M11.844-24.07l0.176,0.768l0.687,2.998l0.987,4.307c-0.03,0.005-0.062,0.007-0.092,0.012\r\n\t\tc-1.361-0.241-2.614,0.113-3.591,0.829c0.127-0.378,0.218-0.771,0.265-1.178c0.263-2.294-0.908-4.338-2.81-5.326\r\n\t\tc0.053-0.026,0.121-0.047,0.17-0.075c0.406-0.214,0.71-0.436,0.912-0.608c0.201-0.168,0.304-0.271,0.304-0.271l-0.068-0.092\r\n\t\tc0,0-0.127,0.08-0.352,0.196c-0.222,0.114-0.547,0.277-0.953,0.398c-0.209,0.065-0.442,0.118-0.688,0.155\r\n\t\tc-0.505-0.181-1.048-0.294-1.622-0.324c-0.284-0.015-0.563-0.002-0.841,0.022c-0.174-0.077-0.336-0.158-0.501-0.267\r\n\t\tc-0.217-0.14-0.42-0.291-0.615-0.437c-0.399-0.28-0.768-0.563-1.088-0.829c-0.326-0.279-0.599-0.512-0.79-0.676\r\n\t\tc-0.193-0.174-0.319-0.274-0.319-0.274l-0.102,0.053c0,0,0.009,0.161,0.075,0.428c0.053,0.274,0.192,0.643,0.432,1.056\r\n\t\tc0.239,0.412,0.601,0.859,1.099,1.214c0.059,0.041,0.134,0.063,0.197,0.101c-1.546,0.585-2.829,1.773-3.494,3.281\r\n\t\tc-0.678-1.539-1.999-2.748-3.589-3.319c0.07-0.04,0.153-0.062,0.22-0.106c0.507-0.342,0.881-0.779,1.131-1.184\r\n\t\tc0.251-0.407,0.4-0.772,0.46-1.045c0.074-0.265,0.086-0.425,0.086-0.425l-0.1-0.056c0,0-0.129,0.097-0.327,0.266\r\n\t\tc-0.194,0.158-0.473,0.384-0.808,0.654c-0.326,0.257-0.702,0.53-1.109,0.799c-0.199,0.142-0.404,0.287-0.627,0.421\r\n\t\tc-0.221,0.136-0.428,0.231-0.677,0.322c-0.201-0.01-0.403-0.011-0.607,0c-0.442,0.023-0.866,0.099-1.27,0.214\r\n\t\tc-0.4-0.038-0.784-0.11-1.107-0.221c-0.402-0.132-0.723-0.304-0.942-0.423c-0.222-0.122-0.347-0.206-0.347-0.206l-0.069,0.091\r\n\t\tc0,0,0.1,0.105,0.297,0.279c0.197,0.177,0.495,0.407,0.895,0.631c0.111,0.067,0.254,0.123,0.386,0.183\r\n\t\tc-1.984,0.958-3.218,3.048-2.948,5.399c0.357,3.118,3.224,5.511,6.401,5.345c2.127-0.111,3.849-1.342,4.652-3.077\r\n\t\tc0.803,1.735,2.526,2.966,4.652,3.077c1.602,0.083,3.123-0.484,4.285-1.465c-0.353,1.298-0.181,2.759,0.777,4.063l8.41,8.332\r\n\t\tl2.013,8.786c0.593,1.825,2.21,3.095,4.089,3.287c-1.131,1.629-4.07,6.829-5.919,11.202l-18.307,0.156l-18.308-0.156\r\n\t\tc-1.849-4.373-4.787-9.573-5.919-11.202c1.88-0.193,3.497-1.462,4.089-3.287l2.193-9.571l7.617-7.547\r\n\t\tc2.506-3.409-0.279-7.903-4.135-7.652l0.977-4.261l0.688-3l0.177-0.771l0.152-0.666l1.074-4.685h22.79l1.074,4.685L11.844-24.07z\r\n\t\t M-11.058,1.288l2.24-0.622c0.621-0.172,1.303-0.303,1.979-0.419c0.681-0.115,1.368-0.212,2.058-0.299\r\n\t\tC-3.4-0.221-2.008-0.343-0.614-0.418c1.393-0.074,2.792-0.104,4.186-0.037C4.269-0.42,4.966-0.369,5.659-0.271\r\n\t\tC6.007-0.238,6.346-0.153,6.69-0.091c0.346,0.062,0.674,0.185,1.014,0.275l2.502,0.666L8.809-0.73L7.985-1.659\r\n\t\tC7.659-1.987,7.336-2.324,7.001-2.635C6.652-2.926,6.335-3.241,5.958-3.506C5.596-3.783,5.227-4.051,4.825-4.285\r\n\t\tC4.442-4.541,4.01-4.733,3.598-4.946C3.16-5.12,2.731-5.312,2.27-5.428C1.82-5.573,1.348-5.651,0.88-5.721\r\n\t\tC0.409-5.781-0.064-5.799-0.538-5.788c-0.944,0.035-1.869,0.22-2.735,0.517c-0.867,0.297-1.68,0.7-2.434,1.17\r\n\t\tC-6.46-3.629-7.16-3.093-7.807-2.508C-8.13-2.214-8.443-1.911-8.743-1.595c-0.302,0.323-0.578,0.632-0.871,1.011L-11.058,1.288z\"/>\r\n                <path fill=\"#017BBC\" d=\"M17.528,23.216c-0.641,1.515-1.152,2.931-1.408,4.06c-0.08,0.353-0.1,0.665-0.091,0.956\r\n\t\tc-0.384,3.257,3.853,3.525,4.338-0.064c0.063-0.467,0.228-1.085,0.456-1.79c0.329-0.874,0.793-1.941,1.345-3.11\r\n\t\tc0.89,0.261,1.499,1.138,1.367,2.113c-0.598,4.442-0.503,10.889-0.255,16.254c-6.822,3.823-14.673,6.021-23.04,6.063l-1.02-24.325\r\n\t\tL17.528,23.216z\"/>\r\n                <path fill=\"#017BBC\" d=\"M-25.093,25.38c-0.131-0.976,0.478-1.853,1.367-2.113c0.553,1.171,1.018,2.24,1.347,3.116\r\n\t\tc0.227,0.702,0.391,1.318,0.454,1.784c0.485,3.589,4.722,3.321,4.338,0.065c0.009-0.291-0.011-0.604-0.091-0.957\r\n\t\tc-0.256-1.129-0.768-2.545-1.408-4.06l18.308,0.156l1.02,24.325c-0.081,0-0.16,0.006-0.241,0.006\r\n\t\tc-9.083,0-17.573-2.54-24.798-6.946C-24.582,35.578-24.528,29.582-25.093,25.38z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M4.527-22.171c-0.072-0.028-0.134-0.058-0.199-0.087c0.277-0.024,0.557-0.037,0.841-0.022\r\n\t\tc0.573,0.03,1.117,0.144,1.622,0.324C6.088-21.85,5.271-21.876,4.527-22.171z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M8.158-12.455c-1.162,0.981-2.684,1.549-4.285,1.465c-2.126-0.111-3.849-1.342-4.652-3.077\r\n\t\tc0.397-0.858,0.574-1.837,0.455-2.869c-0.067-0.587-0.224-1.149-0.455-1.673c0.665-1.508,1.947-2.696,3.494-3.281\r\n\t\tc0.203,0.123,0.408,0.245,0.638,0.329c0.288,0.11,0.627,0.215,0.928,0.273c1.181,0.269,2.384,0.028,3.184-0.373\r\n\t\tc1.902,0.988,3.073,3.032,2.81,5.326c-0.047,0.407-0.138,0.8-0.265,1.178C9.108-14.497,8.452-13.535,8.158-12.455z M3.476-19.858\r\n\t\tc-1.557,0-2.819,1.262-2.819,2.819s1.262,2.819,2.819,2.819c1.557,0,2.819-1.262,2.819-2.819S5.033-19.858,3.476-19.858z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-7.996-22.067c0.403-0.115,0.827-0.191,1.27-0.214c0.204-0.011,0.406-0.01,0.607,0\r\n\t\tc-0.012,0.004-0.021,0.009-0.032,0.013C-6.757-22.046-7.4-22.011-7.996-22.067z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-0.779-14.066c-0.803,1.735-2.525,2.966-4.652,3.077c-3.178,0.166-6.044-2.227-6.401-5.345\r\n\t\tc-0.27-2.351,0.964-4.44,2.948-5.399c0.785,0.359,1.87,0.572,2.956,0.355c0.302-0.049,0.643-0.145,0.934-0.248\r\n\t\tc0.225-0.076,0.426-0.189,0.627-0.301c1.59,0.572,2.911,1.78,3.589,3.319c0.231,0.524,0.388,1.085,0.455,1.673\r\n\t\tC-0.205-15.903-0.381-14.924-0.779-14.066z M-5.193-19.858c-1.558,0-2.819,1.262-2.819,2.819s1.262,2.819,2.819,2.819\r\n\t\tc1.557,0,2.819-1.262,2.819-2.819S-3.636-19.858-5.193-19.858z\"/>\r\n                <path fill=\"#1A2451\" d=\"M3.476-14.22c-1.557,0-2.819-1.262-2.819-2.819s1.262-2.819,2.819-2.819c1.557,0,2.819,1.262,2.819,2.819\r\n\t\tS5.033-14.22,3.476-14.22z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-5.193-14.22c-1.558,0-2.819-1.262-2.819-2.819s1.262-2.819,2.819-2.819c1.557,0,2.819,1.262,2.819,2.819\r\n\t\tS-3.636-14.22-5.193-14.22z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-4.87-1.224c-0.628,0.019-1.257,0.053-1.888,0.095c0.024-0.019,0.046-0.041,0.07-0.06\r\n\t\tc0.611-0.484,1.261-0.916,1.935-1.277c0.673-0.361,1.374-0.65,2.085-0.841c0.712-0.192,1.433-0.284,2.143-0.265\r\n\t\tc0.355,0.018,0.706,0.053,1.052,0.121c0.343,0.079,0.687,0.154,1.017,0.288c0.336,0.106,0.653,0.28,0.976,0.428\r\n\t\tc0.307,0.193,0.627,0.352,0.918,0.58c0.302,0.201,0.585,0.44,0.865,0.684c0.289,0.228,0.539,0.52,0.811,0.773L5.25-0.545\r\n\t\tc-0.545-0.114-1.091-0.221-1.642-0.3C2.207-1.044,0.794-1.146-0.62-1.202C-2.034-1.257-3.451-1.266-4.87-1.224z\"/>\r\n                <path fill=\"#EA7D00\" d=\"M-9.614-0.584c0.293-0.379,0.569-0.688,0.871-1.011c0.3-0.316,0.612-0.619,0.936-0.913\r\n\t\tC-7.16-3.093-6.46-3.629-5.707-4.102c0.754-0.47,1.566-0.873,2.434-1.17c0.867-0.297,1.792-0.481,2.735-0.517\r\n\t\tc0.473-0.011,0.946,0.007,1.418,0.067C1.348-5.651,1.82-5.573,2.27-5.428C2.731-5.312,3.16-5.12,3.598-4.946\r\n\t\tC4.01-4.733,4.442-4.541,4.825-4.285c0.402,0.234,0.771,0.502,1.134,0.779c0.377,0.265,0.694,0.58,1.043,0.871\r\n\t\tc0.335,0.311,0.657,0.647,0.984,0.976L8.809-0.73l1.398,1.581L7.705,0.185C7.365,0.094,7.037-0.029,6.69-0.091\r\n\t\tC6.346-0.153,6.007-0.238,5.659-0.271C4.966-0.369,4.269-0.42,3.571-0.455C2.178-0.521,0.778-0.492-0.614-0.418\r\n\t\tC-2.008-0.343-3.4-0.221-4.781-0.052C-5.47,0.035-6.158,0.132-6.838,0.247c-0.677,0.116-1.358,0.247-1.979,0.419l-2.24,0.622\r\n\t\tL-9.614-0.584z M5.25-0.545L5.115-0.697C4.842-0.951,4.592-1.243,4.304-1.471c-0.28-0.243-0.563-0.482-0.865-0.684\r\n\t\tc-0.291-0.229-0.611-0.387-0.918-0.58C2.198-2.882,1.88-3.056,1.544-3.162C1.214-3.296,0.871-3.371,0.527-3.45\r\n\t\tC0.182-3.519-0.169-3.554-0.524-3.571c-0.71-0.02-1.431,0.072-2.143,0.265c-0.711,0.19-1.412,0.479-2.085,0.841\r\n\t\tc-0.674,0.361-1.323,0.793-1.935,1.277c-0.024,0.019-0.046,0.041-0.07,0.06c0.631-0.042,1.26-0.076,1.888-0.095\r\n\t\tc1.419-0.042,2.836-0.033,4.25,0.021c1.414,0.057,2.826,0.158,4.228,0.357C4.16-0.766,4.706-0.659,5.25-0.545z\"/>\r\n                <path fill=\"#004373\" d=\"M20.407,27.635c0.086-0.342,0.234-0.775,0.417-1.258c-0.228,0.705-0.393,1.323-0.456,1.79\r\n\t\tc-0.485,3.59-4.723,3.321-4.338,0.064C16.108,30.896,19.575,30.916,20.407,27.635z\"/>\r\n                <path fill=\"#017BBC\" d=\"M23.673,11.701c0.643-0.817,2.798-1.02,4.025-0.424l0.779,0.898c-1.398,1.673-4.36,6.958-6.309,11.091\r\n\t\tc-0.551,1.169-1.016,2.236-1.345,3.11c-0.182,0.482-0.33,0.916-0.417,1.258c-0.832,3.281-4.299,3.261-4.378,0.597\r\n\t\tc-0.008-0.291,0.011-0.604,0.091-0.956c0.256-1.129,0.767-2.545,1.408-4.06c1.849-4.373,4.788-9.573,5.919-11.202\r\n\t\tC23.531,11.894,23.611,11.78,23.673,11.701z M18.021,29.415c0.881,0,1.596-0.715,1.596-1.596s-0.715-1.596-1.596-1.596\r\n\t\tc-0.882,0-1.596,0.715-1.596,1.596S17.139,29.415,18.021,29.415z\"/>\r\n                <path fill=\"#FDD302\" d=\"M18.021,26.224c0.881,0,1.596,0.715,1.596,1.596s-0.715,1.596-1.596,1.596\r\n\t\tc-0.882,0-1.596-0.715-1.596-1.596S17.139,26.224,18.021,26.224z\"/>\r\n                <path fill=\"#004373\" d=\"M-17.587,28.232c0.384,3.256-3.853,3.523-4.338-0.065c-0.063-0.466-0.228-1.082-0.454-1.784\r\n\t\tc0.181,0.479,0.328,0.912,0.414,1.252C-21.132,30.915-17.667,30.896-17.587,28.232z\"/>\r\n                <path fill=\"#017BBC\" d=\"M-25.231,11.701c0.063,0.079,0.143,0.192,0.226,0.313c1.132,1.629,4.07,6.829,5.919,11.202\r\n\t\tc0.641,1.515,1.152,2.931,1.408,4.06c0.08,0.354,0.1,0.666,0.091,0.957c-0.079,2.663-3.545,2.683-4.378-0.598\r\n\t\tc-0.086-0.34-0.233-0.772-0.414-1.252c-0.329-0.876-0.794-1.945-1.347-3.116c-1.967-4.172-4.97-9.526-6.351-11.146\r\n\t\tc0.008-0.024,0.022-0.045,0.032-0.068C-29.481,10.618-26.07,10.635-25.231,11.701z M-19.579,29.415\r\n\t\tc0.883,0,1.597-0.715,1.597-1.596s-0.714-1.596-1.597-1.596c-0.881,0-1.596,0.715-1.596,1.596S-20.459,29.415-19.579,29.415z\"/>\r\n                <path fill=\"#FDD302\" d=\"M-19.579,26.224c0.883,0,1.597,0.715,1.597,1.596s-0.714,1.596-1.597,1.596\r\n\t\tc-0.881,0-1.596-0.715-1.596-1.596S-20.459,26.224-19.579,26.224z\"/>\r\n                <path fill=\"#017BBC\" d=\"M12.73-39.049v8.708c0,0.135-0.033,0.261-0.085,0.376c-0.144,0.316-0.459,0.539-0.83,0.539h-1.199h-22.79\r\n\t\th-1.007c-0.506,0-0.915-0.41-0.915-0.915v-8.708c0-0.754,0.085-1.487,0.236-2.195c0.428-1.99,1.42-3.769,2.807-5.157\r\n\t\tC-7.503-47.244-3.806-47.703,0-47.703c3.166,0,6.258,0.316,9.251,0.904C11.382-44.893,12.73-42.132,12.73-39.049z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-11.106-8.392l-7.617,7.547l-4.531,4.489l10.429-12.036c2.239-3.048,0.254-6.975-2.946-7.594\r\n\t\tc0.18-0.032,0.356-0.047,0.531-0.058C-11.385-16.295-8.6-11.801-11.106-8.392z\"/>\r\n                <path fill=\"#FDD302\" d=\"M-15.772-15.986c3.2,0.62,5.186,4.546,2.946,7.594L-23.254,3.645l-7.286,8.408l-4.675,5.396l-10.021-2.315\r\n\t\tc-1.143-3.419-1.913-7.006-2.254-10.721l29.322-20.24C-17.329-16.096-16.517-16.13-15.772-15.986z\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M33.045,17.448l12.376-2.859c-2.479,7.726-6.876,14.587-12.629,20.037l-4.231-22.354L33.045,17.448z\"/>\r\n                <path fill=\"#1A2451\" d=\"M8.936-8.392c-0.958-1.304-1.13-2.765-0.777-4.063c0.293-1.08,0.95-2.042,1.852-2.702\r\n\t\tc0.978-0.716,2.23-1.07,3.591-0.829c-3.2,0.62-5.185,4.547-2.946,7.594l10.43,12.037l-3.74-3.705L8.936-8.392z\"/>\r\n                <path fill=\"#FDD302\" d=\"M28.561,12.272l-0.084-0.097l-0.779-0.898l-6.612-7.632L10.656-8.392c-2.239-3.047-0.254-6.974,2.946-7.594\r\n\t\tc0.03-0.005,0.062-0.007,0.092-0.012c0.721-0.125,1.5-0.087,2.305,0.17l0.586,0.404L47.338,5.805\r\n\t\tc-0.367,3.023-1.011,5.962-1.917,8.784l-12.376,2.859L28.561,12.272z\"/>\r\n                <path fill=\"#21264F\" d=\"M4.281-21.288c-0.301-0.058-0.64-0.163-0.928-0.273c-0.23-0.084-0.436-0.206-0.638-0.329\r\n\t\tc-0.063-0.038-0.138-0.06-0.197-0.101c-0.498-0.355-0.86-0.802-1.099-1.214c-0.24-0.413-0.379-0.782-0.432-1.056\r\n\t\tc-0.066-0.267-0.075-0.428-0.075-0.428l0.102-0.053c0,0,0.126,0.1,0.319,0.274c0.191,0.164,0.464,0.397,0.79,0.676\r\n\t\tc0.32,0.266,0.689,0.549,1.088,0.829c0.195,0.146,0.398,0.297,0.615,0.437c0.165,0.108,0.328,0.19,0.501,0.267\r\n\t\tc0.065,0.029,0.127,0.06,0.199,0.087c0.745,0.295,1.561,0.322,2.263,0.214c0.246-0.038,0.479-0.09,0.688-0.155\r\n\t\tc0.406-0.121,0.731-0.284,0.953-0.398c0.225-0.116,0.352-0.196,0.352-0.196l0.068,0.092c0,0-0.103,0.103-0.304,0.271\r\n\t\tc-0.202,0.172-0.506,0.394-0.912,0.608c-0.049,0.028-0.117,0.048-0.17,0.075C6.665-21.26,5.462-21.019,4.281-21.288z\"/>\r\n                <path fill=\"#21264F\" d=\"M-5.928-21.378c-1.086,0.217-2.171,0.004-2.956-0.355c-0.132-0.06-0.274-0.115-0.386-0.183\r\n\t\tc-0.399-0.224-0.697-0.454-0.895-0.631c-0.197-0.174-0.297-0.279-0.297-0.279l0.069-0.091c0,0,0.125,0.084,0.347,0.206\r\n\t\tc0.22,0.119,0.54,0.291,0.942,0.423c0.323,0.11,0.707,0.183,1.107,0.221c0.596,0.056,1.238,0.021,1.845-0.201\r\n\t\tc0.012-0.004,0.021-0.009,0.032-0.013c0.249-0.091,0.456-0.186,0.677-0.322c0.223-0.134,0.428-0.279,0.627-0.421\r\n\t\tc0.407-0.269,0.783-0.542,1.109-0.799c0.335-0.27,0.613-0.496,0.808-0.654c0.198-0.169,0.327-0.266,0.327-0.266l0.1,0.056\r\n\t\tc0,0-0.012,0.16-0.086,0.425c-0.06,0.273-0.209,0.638-0.46,1.045c-0.25,0.405-0.624,0.842-1.131,1.184\r\n\t\tc-0.066,0.044-0.149,0.066-0.22,0.106c-0.201,0.112-0.402,0.226-0.627,0.301C-5.286-21.523-5.626-21.427-5.928-21.378z\"/>\r\n            </symbol>\r\n            <symbol id=\"badguy\" viewBox=\"-48.82 -38.762 97.639 77.522\">\r\n                <g>\r\n                    <path fill=\"#ADC80C\" d=\"M16.766-8.884c0,0-0.053-2.728,0.086-6.812c0.063-2.043,0.163-4.425,0.309-6.972\r\n\t\t\tc0.151-2.542,0.33-5.271,0.666-7.927c0.102-0.646,0.167-1.335,0.364-1.86c0.074-0.204,0.225-0.416,0.25-0.391\r\n\t\t\tc0.016,0.014-0.038,0.052-0.077,0.074c-0.032,0.023-0.034,0.02,0.021,0.049c0.242,0.109,0.743,0.52,1.144,0.935\r\n\t\t\tc0.423,0.428,0.839,0.898,1.257,1.374c0.417,0.477,0.836,0.96,1.279,1.437l0.202,0.2c0.051,0.052,0.175,0.152,0.26,0.224\r\n\t\t\tc0.19,0.15,0.343,0.265,0.526,0.378c0.354,0.225,0.725,0.414,1.119,0.553c0.783,0.283,1.66,0.393,2.533,0.25\r\n\t\t\tc0.873-0.144,1.695-0.554,2.302-1.076c1.229-1.068,1.716-2.291,2.048-3.262c0.32-0.993,0.449-1.831,0.537-2.514\r\n\t\t\tc0.086-0.683,0.113-1.207,0.128-1.563c0.013-0.356,0.02-0.546,0.02-0.546c0.048-1.292-0.959-2.378-2.251-2.428\r\n\t\t\tc-1.292-0.048-2.378,0.96-2.427,2.251c-0.004,0.103-0.001,0.203,0.008,0.302l0.006,0.062c0,0,0.016,0.15,0.042,0.433\r\n\t\t\tc0.028,0.282,0.063,0.696,0.067,1.203c0.007,0.506-0.009,1.117-0.116,1.73c-0.099,0.612-0.315,1.223-0.596,1.563\r\n\t\t\tc-0.257,0.33-0.62,0.547-1.327,0.432c-0.167-0.027-0.34-0.086-0.508-0.157c-0.081-0.03-0.178-0.087-0.235-0.115\r\n\t\t\tc-0.034-0.021-0.037-0.007-0.101-0.056c-0.043-0.03-0.162-0.128-0.144-0.104c-0.455-0.362-0.926-0.767-1.42-1.185\r\n\t\t\tc-0.495-0.419-1.01-0.854-1.583-1.284c-0.603-0.416-1.157-0.888-2.21-1.167c-0.268-0.061-0.611-0.088-0.976-0.011\r\n\t\t\tc-0.376,0.074-0.728,0.301-0.957,0.542c-0.453,0.509-0.561,0.95-0.666,1.395c-0.142,0.79-0.183,1.469-0.228,2.174\r\n\t\t\tc-0.13,2.776-0.092,5.5-0.043,8.066c0.056,2.563,0.145,4.95,0.24,6.996C16.5-11.6,16.766-8.884,16.766-8.884\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M-17.479-8.884c0,0,0.268-2.716,0.45-6.808c0.096-2.046,0.185-4.434,0.24-6.996\r\n\t\t\tc0.049-2.566,0.087-5.29-0.043-8.066c-0.044-0.705-0.085-1.384-0.228-2.174c-0.105-0.444-0.213-0.886-0.666-1.395\r\n\t\t\tc-0.229-0.241-0.581-0.468-0.957-0.542c-0.363-0.077-0.708-0.05-0.976,0.011c-1.054,0.279-1.607,0.751-2.21,1.167\r\n\t\t\tc-0.573,0.43-1.088,0.865-1.583,1.284c-0.494,0.418-0.965,0.822-1.42,1.185c0.019-0.023-0.101,0.074-0.144,0.104\r\n\t\t\tc-0.063,0.049-0.066,0.034-0.101,0.056c-0.058,0.028-0.154,0.085-0.235,0.115c-0.168,0.071-0.341,0.13-0.508,0.157\r\n\t\t\tc-0.707,0.115-1.07-0.102-1.327-0.432c-0.28-0.34-0.497-0.95-0.596-1.563c-0.107-0.613-0.123-1.225-0.116-1.73\r\n\t\t\tc0.005-0.507,0.039-0.921,0.067-1.203c0.026-0.282,0.042-0.433,0.042-0.433l0.005-0.048c0.125-1.287-0.817-2.431-2.104-2.556\r\n\t\t\tc-1.286-0.125-2.431,0.815-2.556,2.103c-0.01,0.101-0.012,0.215-0.009,0.314c0,0,0.007,0.189,0.02,0.546\r\n\t\t\tc0.016,0.355,0.042,0.88,0.128,1.563c0.088,0.683,0.216,1.521,0.537,2.514c0.332,0.971,0.819,2.193,2.048,3.262\r\n\t\t\tc0.606,0.522,1.429,0.933,2.301,1.076c0.873,0.143,1.752,0.033,2.534-0.25c0.395-0.139,0.766-0.328,1.119-0.553\r\n\t\t\tc0.184-0.113,0.336-0.228,0.526-0.378c0.086-0.071,0.209-0.172,0.26-0.224l0.202-0.2c0.442-0.477,0.862-0.96,1.28-1.437\r\n\t\t\tc0.417-0.476,0.833-0.946,1.256-1.374c0.4-0.415,0.901-0.825,1.144-0.935c0.056-0.029,0.054-0.025,0.021-0.049\r\n\t\t\tc-0.039-0.022-0.092-0.061-0.077-0.074c0.026-0.025,0.176,0.187,0.25,0.391c0.197,0.525,0.263,1.214,0.364,1.86\r\n\t\t\tc0.336,2.655,0.515,5.385,0.666,7.927c0.146,2.547,0.244,4.929,0.309,6.972C-17.426-11.612-17.479-8.884-17.479-8.884\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M-28.077-1.831c0,15.344,12.438,27.783,27.782,27.783c15.346,0,27.784-12.439,27.784-27.783\r\n\t\t\tS15.051-29.614-0.294-29.614C-15.638-29.614-28.077-17.174-28.077-1.831\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M-42.137,0.644c0.681,4.308,4.928,12.93,9.24,12.93c3.626,0,4.308-2.493,6.573-6.348l0.907-6.8\r\n\t\t\tl-2.66-2.257c0,0-2.1,5.204-3.007,7.017c-0.907,1.814-2.268,3.627-3.4,1.588c-1.133-2.04-4.132-6.946-4.132-6.946\r\n\t\t\ts-1.254-2.192,0.562-2.64c1.817-0.446,4.846-1.191,4.447-2.806c-0.396-1.615-1.707-1.721-3.424-0.87\r\n\t\t\tc-1.718,0.851-2.826,0.695-3.276-0.265c-0.449-0.959,0.014-3.428,1.075-4.331c1.063-0.903-2.161-1.823-3.475-1.072\r\n\t\t\tc-1.313,0.752-1.273,3.524,0.335,4.841c-1.913-0.813-2.916-2.278-2.707-4.043c0.208-1.764-3.18,0.996-2.882,2.207\r\n\t\t\ts2.254,3.941,3.563,4.047c-2.036,0.575-2.088,0.063-2.95-1.003c-0.862-1.063-2.354,0.506-0.786,2.298\r\n\t\t\tc1.566,1.792,4.606,2.547,5.262,2.461C-42.217-1.434-42.416-0.489-42.137,0.644\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M42.136,0.644c-0.681,4.308-4.928,12.93-9.24,12.93c-3.626,0-4.307-2.493-6.573-6.348l-0.907-6.8\r\n\t\t\tl1.746-2.136c0,0,3.015,5.083,3.921,6.896c0.907,1.814,2.267,3.627,3.4,1.588c1.133-2.04,4.132-6.946,4.132-6.946\r\n\t\t\ts1.254-2.192-0.563-2.64c-1.816-0.446-4.845-1.191-4.446-2.806c0.397-1.615,1.707-1.721,3.424-0.87\r\n\t\t\tc1.718,0.851,2.826,0.695,3.276-0.265c0.45-0.959-0.014-3.428-1.075-4.331s2.161-1.823,3.475-1.072\r\n\t\t\tc1.313,0.752,1.273,3.524-0.335,4.841c1.913-0.813,2.915-2.278,2.707-4.043c-0.208-1.764,3.181,0.996,2.883,2.207\r\n\t\t\tc-0.299,1.211-2.255,3.941-3.564,4.047c2.036,0.575,2.088,0.063,2.95-1.003c0.862-1.063,2.354,0.506,0.787,2.298\r\n\t\t\ts-4.607,2.547-5.263,2.461C42.216-1.434,42.415-0.489,42.136,0.644\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M-0.691-16.015c0,5.385,4.274,9.748,9.549,9.748s9.549-4.363,9.549-9.748c0-5.384-4.274-9.748-9.549-9.748\r\n\t\t\tS-0.691-21.399-0.691-16.015\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M-18.994-16.015c0,5.385,4.274,9.748,9.549,9.748s9.549-4.363,9.549-9.748\r\n\t\t\tc0-5.384-4.274-9.748-9.549-9.748S-18.994-21.399-18.994-16.015\"/>\r\n                    <path fill=\"#1C1C1B\" d=\"M-0.525-14.701c0,3.14,2.493,5.685,5.567,5.685c3.075,0,5.567-2.545,5.567-5.685\r\n\t\t\tc0-3.139-2.492-5.684-5.567-5.684C1.968-20.384-0.525-17.839-0.525-14.701\"/>\r\n                    <path fill=\"#1C1C1B\" d=\"M-11.197-14.701c0,3.14,2.493,5.685,5.568,5.685s5.566-2.545,5.566-5.685c0-3.139-2.491-5.684-5.566-5.684\r\n\t\t\tS-11.197-17.839-11.197-14.701\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M2.589,2.083c-2.815,6.306,6.297,13.155,10.397,1.889\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M0.832,3.127C4.069,10.71-5.754,16.922-10.52,3.526\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M13.236,20.542c2.915,3.157,4.373,3.644,4.13,5.587s-5.588,5.102-6.073,7.773s2.43,1.214,4.372,1.457\r\n\t\t\tc0.983,0.123,1.779,0.991,2.326,1.819c0.448,0.678-0.058,1.582-0.87,1.582H6.434c-0.319-2.483-0.22-4.089,1.387-6.499\r\n\t\t\tc1.507-2.259,3.112-3.212,3.229-5.161c0.11-1.864-5.639-2.869-5.639-2.869\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M-13.454,20.542c-2.915,3.157-4.373,3.644-4.13,5.587c0.242,1.943,5.588,5.102,6.072,7.773\r\n\t\t\tc0.486,2.672-2.429,1.214-4.372,1.457c-0.982,0.123-1.778,0.991-2.325,1.819c-0.448,0.678,0.058,1.582,0.87,1.582h10.687\r\n\t\t\tc0.319-2.483,0.219-4.089-1.387-6.499c-1.507-2.259-3.112-3.212-3.229-5.161c-0.111-1.864,5.639-2.869,5.639-2.869\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M27.36-1.115C13.49,5.721-2.262,8.198-27.922-1.511\"/>\r\n                    <path fill=\"#E3007D\" d=\"M27.36-1.115c0,0-0.859,0.268-2.343,0.777c-0.74,0.266-1.657,0.504-2.678,0.847\r\n\t\t\tc-1.027,0.319-2.214,0.61-3.479,0.974c-1.292,0.287-2.67,0.645-4.153,0.902c-1.468,0.316-3.047,0.472-4.659,0.708\r\n\t\t\tC9.236,3.167,8.41,3.24,7.574,3.315C6.738,3.373,5.885,3.374,5.033,3.429C4.18,3.494,3.316,3.466,2.45,3.458\r\n\t\t\tc-0.866-0.012-1.736,0.001-2.605-0.08c-0.87-0.044-1.741-0.088-2.606-0.133c-0.866-0.09-1.729-0.18-2.583-0.269\r\n\t\t\tc-1.709-0.185-3.391-0.442-5.02-0.674c-1.612-0.335-3.2-0.535-4.681-0.865c-1.477-0.345-2.9-0.578-4.191-0.895\r\n\t\t\tc-1.29-0.321-2.483-0.586-3.546-0.821c-1.055-0.263-1.975-0.492-2.732-0.681c-1.523-0.367-2.407-0.553-2.407-0.553\r\n\t\t\ts0.795,0.415,2.212,1.1c0.711,0.333,1.566,0.766,2.575,1.192c1.012,0.417,2.157,0.888,3.42,1.367\r\n\t\t\tc1.257,0.5,2.659,0.926,4.136,1.402c1.478,0.479,3.074,0.859,4.72,1.273c0.829,0.186,1.682,0.338,2.539,0.513\r\n\t\t\tc0.859,0.175,1.729,0.35,2.622,0.435c0.891,0.11,1.786,0.221,2.687,0.332c0.906,0.063,1.815,0.125,2.727,0.188\r\n\t\t\tC0.625,6.357,1.54,6.329,2.45,6.323c0.91-0.01,1.817,0,2.715-0.083c0.899-0.063,1.791-0.112,2.666-0.229\r\n\t\t\tc0.873-0.129,1.735-0.257,2.583-0.382c1.684-0.317,3.305-0.665,4.8-1.136c1.518-0.394,2.892-0.953,4.165-1.426\r\n\t\t\tc1.256-0.526,2.394-1.024,3.376-1.528c0.981-0.509,1.836-0.947,2.506-1.354C26.603-0.625,27.36-1.115,27.36-1.115\"/>\r\n                </g>\r\n            </symbol>\r\n            <symbol  id=\"earth\" viewBox=\"0 0 69 57\">\r\n                            <path fill=\"#EB6608\" d=\"M34.5,57.823c23.851-8.51,36.89-25.975,34.136-39.361C66.753,9.306,61.32,0,50.189,0\r\n\t\tC43.49,0,36.347,8.177,34.5,16.72C32.652,8.177,25.509,0,18.811,0C7.678,0,2.247,9.306,0.363,18.462\r\n\t\tC-2.391,31.848,10.647,49.313,34.5,57.823\"/>\r\n            </symbol>\r\n            <symbol id=\"goodie\" viewBox=\"-26.111 -34.501 52.223 69.001\">\r\n                <path fill=\"#FF00FF\" d=\"M12.428-33.346c11.046,5.522-5.492,23.319-11.984,23.088c-3.185-0.113-3.442-1.558-3.442-1.558\r\n\t\tS-1.943-40.534,12.428-33.346 M11.605-27.895c-0.428-2.379-2.999-2.459-3.903-2.298c-3.19,0.565-4.584,7.087-5.327,13.875\r\n\t\tC5.863-17.803,12.317-23.936,11.605-27.895\"/>\r\n                <path fill=\"#FF00FF\" d=\"M1.625-16.261c0,0,0.525,1.371-2.147,3.109c-5.445,3.544-28.789-3.185-22.169-13.61\r\n\t\tC-14.079-40.328,1.625-16.261,1.625-16.261 M-5.04-17.239c-4.134-5.435-8.951-10.416-11.976-9.256\r\n\t\tc-0.858,0.328-3.02,1.721-2.161,3.98C-17.747-18.754-8.794-16.714-5.04-17.239\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-24.419-4.732v37.363c0,1.032,0.836,1.869,1.868,1.869h45.103c1.032,0,1.868-0.837,1.868-1.869V-4.732\r\n\t\tH-24.419z\"/>\r\n                <polygon fill=\"#FFFFFF\" points=\"-26.111,-4.732 26.112,-4.732 26.112,-14.074 -26.111,-14.074 \t\"/>\r\n                <g opacity=\"0.5\">\r\n                    <g>\r\n                        <defs>\r\n                            <polygon id=\"SVGID_1b_\"\r\n                                     points=\"9.47,-13.331 -17.682,-13.331 -17.682,-22.38 9.47,-22.38 \t\t\t\t\"/>\r\n                        </defs>\r\n                        <clipPath id=\"SVGID_2a_\">\r\n                            <use xlink:href=\"#SVGID_1b_\" overflow=\"visible\"/>\r\n                        </clipPath>\r\n                        <path clip-path=\"url(#SVGID_2a_)\" fill=\"#B3B3B3\" d=\"M1.654-15.734h-7.347v0.282h-11.988l3.017,1.379h8.971v0.738H5.694v-0.738\r\n\t\t\t\tH7.95l1.52-1.379H5.694v-0.282H3.1c0.114-0.445,0.013-0.71,0.013-0.71s-0.039-0.059-0.115-0.172l-0.623,0.299l0.118-1.026\r\n\t\t\t\tc-0.738-1.041-2.112-2.891-3.985-5.037c-0.541,2.287-0.339,1.492-0.339,1.492c0.338,0.414,2.039,2.592,2.554,3.325\r\n\t\t\t\ts0.695,0.994,0.834,1.201C1.697-16.156,1.655-15.937,1.654-15.734\"/>\r\n                    </g>\r\n                </g>\r\n                <polygon fill=\"#FF00FF\"\r\n                         points=\"-5.693,34.5 5.694,34.5 5.694,-4.96 5.694,-14.355 -5.693,-14.355 -5.693,-4.96 -5.693,-3.574 \t\"/>\r\n                <g opacity=\"0.5\">\r\n                    <g>\r\n                        <defs>\r\n                            <polygon id=\"SVGID_3_\"\r\n                                     points=\"24.42,-3.351 -24.419,-3.351 -24.419,-4.73 24.42,-4.73 \t\t\t\t\"/>\r\n                        </defs>\r\n                        <clipPath id=\"SVGID_4_\">\r\n                            <use xlink:href=\"#SVGID_3_\" overflow=\"visible\"/>\r\n                        </clipPath>\r\n                        <polygon clip-path=\"url(#SVGID_4_)\" fill=\"#B3B3B3\"\r\n                                 points=\"24.42,-3.354 -24.419,-3.354 -24.419,-4.732 24.42,-4.732 \t\t\t\"/>\r\n                    </g>\r\n                </g>\r\n            </symbol>\r\n        </svg>\r\n\r\n        <rect class='interfaceBG' fill=\"#170C59\" width=\"500\" x='-100' height=\"37\"/>\r\n        <svg class='interface' width=\"340\" height=\"37\">\r\n            <symbol id=\"live_x5F_icon\" viewBox=\"-5.541 -7.476 11.082 14.952\">\r\n                <path fill=\"#253B8C\" d=\"M-0.88,6.153l-0.725-0.409c-0.19-0.113-0.229-0.368,0.177-0.551c0.406-0.184,0.916-0.135,0.916-0.135\r\n\t\tl0.144,1.118L-0.88,6.153z\"/>\r\n                <path fill=\"#004373\" d=\"M2.941,0.191c0-0.258-1.521-0.466-2.943-0.466s-2.944,0.208-2.944,0.466s1.522,0.466,2.944,0.466\r\n\t\tS2.941,0.449,2.941,0.191\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M-0.856,5.454h-0.162c-0.085,0-0.154,0.069-0.154,0.154c0,0.085,0.069,0.154,0.154,0.154h0.162\"/>\r\n                <path fill=\"#D6B406\" d=\"M-1.035,5.563c0,0.055,0.062,0.1,0.139,0.1c0.053,0,0.098-0.021,0.121-0.051\r\n\t\tC-0.778,5.674-0.85,5.724-0.937,5.724c-0.089,0-0.163-0.052-0.163-0.116c0-0.046,0.038-0.085,0.092-0.104\r\n\t\tC-1.025,5.521-1.035,5.541-1.035,5.563\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M0.854,5.454h0.162c0.085,0,0.154,0.069,0.154,0.154c0,0.085-0.069,0.154-0.154,0.154H0.854\"/>\r\n                <path fill=\"#D6B406\" d=\"M1.033,5.563c0,0.055-0.062,0.1-0.139,0.1c-0.053,0-0.098-0.021-0.122-0.051\r\n\t\tc0.003,0.062,0.074,0.112,0.162,0.112c0.09,0,0.163-0.052,0.163-0.116c0-0.046-0.039-0.085-0.093-0.104\r\n\t\tC1.023,5.521,1.033,5.541,1.033,5.563\"/>\r\n                <path fill=\"#FFED00\" d=\"M0.636,6.762L1.397,3.44C1.441,3.303,1.57,3.209,1.714,3.209h3.493c0.324,0,0.458-0.413,0.196-0.604\r\n\t\tL2.947,0.553C2.83,0.468,2.781,0.317,2.825,0.18l0.511-7.217c0.1-0.308-0.252-0.563-0.514-0.374L0.196-1.462\r\n\t\tc-0.117,0.084-0.275,0.084-0.392,0l-2.626-5.949c-0.262-0.189-0.614,0.066-0.514,0.374l0.511,7.217\r\n\t\tc0.045,0.137-0.004,0.289-0.121,0.373l-2.456,2.053c-0.262,0.19-0.127,0.604,0.196,0.604h3.492c0.145,0,0.273,0.094,0.318,0.231\r\n\t\tl0.761,3.321C-0.511,7.295,0.522,7.295,0.636,6.762\"/>\r\n                <path fill=\"#00FFFF\" d=\"M0.196-2.257c-0.117,0.084-0.275,0.084-0.392,0l-2.179-4.521c-0.262-0.19-1.071,0.191-0.972,0.499\r\n\t\tl0.402,6.459c0.427-0.2,1.194-0.066,1.23,0.301c0,0,0.112,1.184,0.028,1.805c-0.011,0.081,0.051,0.153,0.133,0.152L0,2.425\"/>\r\n                <path fill=\"#00FFFF\" d=\"M-0.196-2.257c0.117,0.084,0.275,0.084,0.392,0l2.179-4.521c0.262-0.19,1.072,0.191,0.972,0.499L2.945,0.18\r\n\t\tc-0.427-0.2-1.194-0.066-1.231,0.301c0,0-0.111,1.184-0.028,1.805c0.011,0.081-0.051,0.153-0.133,0.152L0,2.425\"/>\r\n                <g>\r\n                    <path fill=\"#292D95\" d=\"M2.916,0.011L2.902,0.048C2.921,0.055,2.938,0.063,2.955,0.07l0.017-0.036\r\n\t\t\tC2.954,0.026,2.935,0.018,2.916,0.011z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"#292D95\" d=\"M2.472-0.059c-0.011,0-0.022,0-0.033,0l0.001,0.04c0.039-0.001,0.079,0,0.117,0.001l0.002-0.04\r\n\t\t\tC2.53-0.058,2.501-0.059,2.472-0.059z M-2.472-0.059c-0.031,0-0.061,0.001-0.09,0.002l0.001,0.04\r\n\t\t\tc0.029-0.001,0.059-0.001,0.089-0.001h0.03l0-0.04L-2.472-0.059z M-2.321-0.052l-0.003,0.04c0.04,0.003,0.079,0.008,0.117,0.014\r\n\t\t\tl0.006-0.039C-2.24-0.044-2.28-0.049-2.321-0.052z M2.318-0.052c-0.041,0.003-0.081,0.008-0.12,0.015l0.006,0.04\r\n\t\t\tc0.038-0.006,0.078-0.011,0.117-0.014L2.318-0.052z M2.68-0.045L2.674-0.006C2.714,0,2.754,0.007,2.79,0.015l0.009-0.039\r\n\t\t\tC2.761-0.033,2.721-0.04,2.68-0.045z M-2.683-0.045C-2.724-0.04-2.764-0.032-2.802-0.023l0.009,0.039\r\n\t\t\tC-2.757,0.007-2.718,0-2.677-0.005L-2.683-0.045z M-2.082-0.015l-0.009,0.039c0.039,0.009,0.077,0.019,0.113,0.031l0.013-0.038\r\n\t\t\tC-2.002,0.005-2.042-0.005-2.082-0.015z M2.079-0.015C2.039-0.005,2,0.005,1.962,0.018l0.012,0.038\r\n\t\t\tc0.036-0.012,0.074-0.022,0.113-0.031L2.079-0.015z M-1.852,0.061l-0.016,0.036c0.038,0.018,0.072,0.036,0.102,0.056l0.021-0.033\r\n\t\t\tC-1.776,0.099-1.813,0.079-1.852,0.061z M1.849,0.062C1.81,0.08,1.773,0.1,1.742,0.121l0.022,0.033\r\n\t\t\tc0.029-0.02,0.064-0.039,0.102-0.056L1.849,0.062z M-1.649,0.2l-0.03,0.026c0.027,0.03,0.045,0.062,0.056,0.095l0.038-0.012\r\n\t\t\tC-1.598,0.271-1.619,0.233-1.649,0.2z M1.647,0.202c-0.03,0.034-0.052,0.071-0.063,0.11l0.038,0.012\r\n\t\t\tc0.01-0.033,0.028-0.065,0.055-0.095L1.647,0.202z M-1.569,0.432l-0.04,0.003c0.002,0.031,0.005,0.071,0.009,0.119l0.04-0.002\r\n\t\t\tC-1.563,0.503-1.566,0.462-1.569,0.432z M1.568,0.435C1.565,0.466,1.563,0.506,1.559,0.553l0.04,0.003\r\n\t\t\tc0.004-0.047,0.007-0.087,0.01-0.119L1.568,0.435z M-1.55,0.67l-0.04,0.003C-1.588,0.71-1.585,0.75-1.583,0.792l0.04-0.002\r\n\t\t\tC-1.545,0.748-1.548,0.708-1.55,0.67z M1.551,0.673C1.548,0.71,1.546,0.75,1.543,0.792l0.04,0.002\r\n\t\t\tC1.585,0.752,1.588,0.713,1.59,0.676L1.551,0.673z M-1.536,0.909l-0.04,0.001l0.006,0.12l0.04-0.002L-1.536,0.909z M1.536,0.912\r\n\t\t\tC1.534,0.951,1.532,0.991,1.53,1.031l0.04,0.002c0.002-0.041,0.004-0.081,0.006-0.119L1.536,0.912z M-1.524,1.147l-0.041,0.002\r\n\t\t\tc0.001,0.039,0.003,0.079,0.004,0.119l0.04-0.001C-1.522,1.228-1.523,1.187-1.524,1.147z M1.526,1.15\r\n\t\t\tc-0.002,0.04-0.003,0.08-0.004,0.12l0.04,0.001c0.002-0.04,0.003-0.08,0.004-0.119L1.526,1.15z M-1.518,1.387l-0.04,0\r\n\t\t\tc0,0.04,0.001,0.08,0.001,0.12l0.04,0C-1.517,1.467-1.517,1.427-1.518,1.387z M1.519,1.39c0,0.04-0.001,0.08-0.001,0.12h0.04\r\n\t\t\tc0-0.04,0.001-0.079,0.002-0.119L1.519,1.39z M-1.556,1.626c0,0.04-0.001,0.08-0.001,0.119l0.04,0.001\r\n\t\t\tc0.001-0.04,0.002-0.079,0.002-0.12H-1.556z M1.557,1.629h-0.04c0,0.041,0.001,0.081,0.002,0.12l0.04,0\r\n\t\t\tC1.559,1.709,1.558,1.669,1.557,1.629z M-1.562,1.864c-0.002,0.041-0.004,0.081-0.007,0.119l0.04,0.002\r\n\t\t\tc0.002-0.039,0.004-0.079,0.006-0.119L-1.562,1.864z M1.563,1.867l-0.04,0.002C1.526,1.91,1.527,1.95,1.53,1.988l0.04-0.003\r\n\t\t\tC1.567,1.947,1.565,1.908,1.563,1.867z M-1.579,2.101c-0.003,0.024-0.006,0.046-0.008,0.069C-1.589,2.176-1.589,2.184-1.589,2.19\r\n\t\t\tc0,0.013,0.002,0.024,0.004,0.036l0.039-0.009C-1.548,2.208-1.549,2.199-1.549,2.19c0-0.005,0-0.011,0.001-0.016\r\n\t\t\tc0.003-0.023,0.005-0.046,0.008-0.07L-1.579,2.101z M1.581,2.104l-0.04,0.004C1.544,2.131,1.547,2.153,1.55,2.175\r\n\t\t\tc0,0.005,0,0.01,0,0.016c0,0.01-0.001,0.019-0.004,0.029l0.039,0.01C1.589,2.216,1.59,2.204,1.59,2.19\r\n\t\t\tc0-0.007,0-0.014-0.001-0.021C1.586,2.148,1.584,2.126,1.581,2.104z M-1.483,2.291l-0.016,0.037C-1.48,2.336-1.46,2.34-1.44,2.34\r\n\t\t\th0.066V2.3H-1.44C-1.455,2.3-1.47,2.297-1.483,2.291z M1.482,2.292C1.469,2.298,1.456,2.3,1.441,2.3H1.372V2.34h0.069\r\n\t\t\tc0.02,0,0.039-0.004,0.056-0.011L1.482,2.292z M1.253,2.3h-0.12V2.34h0.12V2.3z M1.014,2.3H0.895V2.34h0.119V2.3z M0.775,2.3\r\n\t\t\th-0.12V2.34h0.12V2.3z M0.536,2.3H0.417V2.34h0.119V2.3z M0.298,2.3h-0.12V2.34h0.12V2.3z M0.059,2.3H-0.06V2.34h0.119V2.3z\r\n\t\t\t M-0.18,2.3h-0.12V2.34h0.12V2.3z M-0.418,2.3h-0.119V2.34h0.119V2.3z M-0.657,2.3h-0.119V2.34h0.119V2.3z M-0.896,2.3h-0.12V2.34\r\n\t\t\th0.12V2.3z M-1.135,2.3h-0.119V2.34h0.119V2.3z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"none\" d=\"M-2.909,0.029c-0.019,0.007-0.038,0.015-0.055,0.022\"/>\r\n                </g>\r\n                <path fill=\"#FFFFFF\" d=\"M0.032,5.221c0.024-0.216-0.134-0.401-0.354-0.413c-0.221-0.011-0.419,0.155-0.444,0.371\r\n\t\tc-0.025,0.216,0.134,0.4,0.354,0.412S0.007,5.437,0.032,5.221\"/>\r\n                <path fill=\"#22274F\" d=\"M-0.687,5.588c0,0,0.018,0.037,0.063,0.082c0.044,0.046,0.125,0.09,0.214,0.096\r\n\t\tc0.044,0.004,0.09,0,0.131-0.012c0.04-0.014,0.073-0.038,0.097-0.06c0.048-0.045,0.063-0.089,0.063-0.089L-0.124,5.6\r\n\t\tc0,0-0.037,0.017-0.092,0.042c-0.026,0.012-0.057,0.023-0.088,0.033c-0.032,0.013-0.066,0.024-0.103,0.027\r\n\t\tc-0.075,0.006-0.149-0.021-0.198-0.054c-0.05-0.033-0.075-0.065-0.075-0.065L-0.687,5.588z\"/>\r\n                <path fill=\"#22274F\" d=\"M0.68,5.583c0,0-0.025,0.033-0.075,0.065c-0.049,0.032-0.124,0.06-0.198,0.054\r\n\t\tC0.371,5.699,0.336,5.688,0.304,5.675c-0.031-0.01-0.063-0.021-0.088-0.033C0.161,5.617,0.124,5.6,0.124,5.6L0.117,5.605\r\n\t\tc0,0,0.015,0.043,0.063,0.089c0.025,0.022,0.057,0.046,0.097,0.06C0.318,5.766,0.364,5.77,0.409,5.766\r\n\t\tc0.088-0.005,0.17-0.05,0.213-0.096c0.045-0.045,0.064-0.082,0.064-0.082L0.68,5.583z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-0.031,5.221c-0.026-0.216,0.133-0.401,0.354-0.413c0.22-0.011,0.419,0.155,0.444,0.371\r\n\t\tc0.025,0.216-0.133,0.4-0.354,0.412C0.191,5.603-0.007,5.437-0.031,5.221\"/>\r\n                <path fill=\"#22274F\" d=\"M-0.1,5.231c0-0.108-0.087-0.195-0.196-0.195c-0.108,0-0.195,0.087-0.195,0.195\r\n\t\tc0,0.108,0.087,0.195,0.195,0.195C-0.187,5.426-0.1,5.339-0.1,5.231\"/>\r\n                <path fill=\"#22274F\" d=\"M0.501,5.231c0-0.108-0.087-0.195-0.195-0.195S0.11,5.123,0.11,5.231c0,0.108,0.088,0.195,0.196,0.195\r\n\t\tS0.501,5.339,0.501,5.231\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M0.57,4.371c-0.582-0.748-1.159-0.02-1.159-0.02C-0.394,4.305,0.298,4.259,0.57,4.371\"/>\r\n                <path fill=\"#EA7D00\" d=\"M0.755,4.432L0.646,4.308L0.589,4.243L0.52,4.176C0.473,4.134,0.425,4.094,0.37,4.061\r\n\t\tc-0.108-0.068-0.24-0.108-0.371-0.104C-0.133,3.962-0.256,4.009-0.36,4.074c-0.052,0.032-0.101,0.069-0.146,0.11\r\n\t\tc-0.045,0.041-0.086,0.083-0.125,0.133l-0.099,0.127l0.153-0.041c0.087-0.023,0.185-0.038,0.28-0.05\r\n\t\tc0.096-0.011,0.192-0.02,0.289-0.025C0.09,4.324,0.187,4.321,0.283,4.326C0.38,4.332,0.478,4.34,0.57,4.371L0.755,4.432z\r\n\t\t M0.402,4.32C0.363,4.313,0.324,4.305,0.286,4.299C0.189,4.286,0.091,4.279-0.007,4.275c-0.098-0.004-0.196-0.004-0.295-0.001\r\n\t\tc-0.099,0.003-0.196,0.008-0.299,0.025l0.054,0.085c0.07-0.077,0.16-0.148,0.252-0.198C-0.201,4.136-0.1,4.106-0.001,4.109\r\n\t\ts0.194,0.038,0.275,0.099c0.042,0.027,0.08,0.064,0.116,0.101L0.402,4.32z\"/>\r\n                <path fill=\"#004373\" d=\"M-2.938-0.195c0.124-0.311,1.121-0.474,1.479-0.317c-0.035-0.58-0.099-0.774-0.263-0.964\r\n\t\tc-0.215-0.25-1.207-0.471-1.399-0.068L-2.938-0.195z\"/>\r\n                <path fill=\"#017BBC\" d=\"M-2.959-0.274c0.127-0.281,1.135-0.43,1.5-0.287c-0.036-0.525-0.107-0.688-0.268-0.873\r\n\t\tC-1.929-1.667-2.95-1.861-3.146-1.497L-2.959-0.274z\"/>\r\n                <g>\r\n                    <path fill=\"#FDD302\" d=\"M-2.631-1.614c-0.043,0.001-0.086,0.004-0.125,0.009l0.005,0.041c0.038-0.005,0.079-0.008,0.121-0.009\r\n\t\t\tL-2.631-1.614z M-2.507-1.613l-0.002,0.041c0.04,0.002,0.081,0.005,0.122,0.01l0.004-0.041C-2.424-1.607-2.466-1.611-2.507-1.613z\r\n\t\t\t M-2.259-1.585l-0.007,0.041c0.041,0.008,0.081,0.017,0.119,0.026l0.01-0.04C-2.176-1.568-2.217-1.577-2.259-1.585z M-2.88-1.58\r\n\t\t\tC-2.926-1.567-2.965-1.55-2.999-1.53l0.021,0.036c0.03-0.018,0.066-0.033,0.109-0.045L-2.88-1.58z M-2.017-1.522l-0.014,0.04\r\n\t\t\tc0.042,0.015,0.079,0.031,0.109,0.048l0.021-0.035C-1.934-1.488-1.973-1.505-2.017-1.522z M-3.055-1.431l-0.041,0.007l0.02,0.122\r\n\t\t\tl0.041-0.007L-3.055-1.431z M-1.802-1.384L-1.836-1.36c0.022,0.032,0.046,0.066,0.068,0.102l0.035-0.021\r\n\t\t\tC-1.755-1.316-1.779-1.351-1.802-1.384z M-3.015-1.188l-0.041,0.006l0.02,0.122l0.04-0.007L-3.015-1.188z M-1.675-1.168\r\n\t\t\tl-0.038,0.016c0.015,0.037,0.028,0.074,0.04,0.114l0.04-0.011C-1.645-1.091-1.659-1.13-1.675-1.168z M-2.976-0.944l-0.041,0.007\r\n\t\t\tl0.02,0.122l0.041-0.006L-2.976-0.944z M-1.606-0.928L-1.647-0.92c0.006,0.037,0.012,0.078,0.017,0.121l0.041-0.005\r\n\t\t\tC-1.594-0.848-1.6-0.89-1.606-0.928z M-2.102-0.769c-0.041,0-0.083,0.002-0.124,0.005l0.003,0.041\r\n\t\t\tc0.041-0.002,0.082-0.004,0.122-0.005L-2.102-0.769z M-1.978-0.769l-0.001,0.042c0.042,0.001,0.083,0.003,0.123,0.006l0.003-0.041\r\n\t\t\tC-1.893-0.765-1.935-0.768-1.978-0.769z M-2.35-0.754c-0.042,0.004-0.083,0.01-0.124,0.016l0.007,0.041\r\n\t\t\tc0.039-0.006,0.08-0.011,0.121-0.016L-2.35-0.754z M-1.729-0.747l-0.006,0.041c0.044,0.008,0.083,0.017,0.117,0.028l0.013-0.039\r\n\t\t\tC-1.641-0.729-1.683-0.739-1.729-0.747z M-2.595-0.716c-0.043,0.01-0.083,0.02-0.121,0.03l0.011,0.04\r\n\t\t\tc0.037-0.01,0.077-0.021,0.119-0.029L-2.595-0.716z M-2.936-0.701l-0.041,0.007l0.02,0.122l0.015-0.002l0.02,0.025\r\n\t\t\tc0.025-0.02,0.061-0.04,0.103-0.058l-0.016-0.038c-0.032,0.014-0.061,0.029-0.084,0.043L-2.936-0.701z\"/>\r\n                </g>\r\n                <path fill=\"#004373\" d=\"M2.938-0.195C2.814-0.506,1.817-0.669,1.459-0.513c0.035-0.58,0.099-0.774,0.262-0.964\r\n\t\tc0.216-0.25,1.208-0.471,1.4-0.068L2.938-0.195z\"/>\r\n                <path fill=\"#017BBC\" d=\"M2.958-0.274c-0.125-0.281-1.135-0.43-1.5-0.287c0.036-0.525,0.108-0.688,0.269-0.873\r\n\t\tC1.929-1.667,2.95-1.861,3.145-1.497L2.958-0.274z\"/>\r\n                <g>\r\n                    <path fill=\"#FDD302\" d=\"M2.631-1.614L2.63-1.573c0.042,0.001,0.083,0.004,0.121,0.009l0.005-0.041\r\n\t\t\tC2.717-1.609,2.675-1.613,2.631-1.614z M2.506-1.613c-0.041,0.002-0.083,0.005-0.124,0.01l0.004,0.041\r\n\t\t\tc0.041-0.005,0.082-0.008,0.121-0.01L2.506-1.613z M2.258-1.585C2.217-1.577,2.175-1.568,2.137-1.559l0.01,0.04\r\n\t\t\tc0.039-0.009,0.079-0.018,0.119-0.026L2.258-1.585z M2.88-1.58L2.869-1.54c0.042,0.012,0.079,0.027,0.108,0.045L2.999-1.53\r\n\t\t\tC2.966-1.55,2.926-1.567,2.88-1.58z M2.017-1.522C1.972-1.505,1.934-1.488,1.901-1.469l0.021,0.035\r\n\t\t\tc0.03-0.017,0.067-0.034,0.109-0.048L2.017-1.522z M3.055-1.431L3.035-1.31l0.041,0.007l0.02-0.122L3.055-1.431z M1.802-1.384\r\n\t\t\tC1.779-1.351,1.755-1.316,1.733-1.28l0.035,0.021C1.789-1.294,1.813-1.328,1.835-1.36L1.802-1.384z M3.015-1.188l-0.02,0.122\r\n\t\t\tl0.041,0.007l0.02-0.122L3.015-1.188z M1.675-1.168C1.659-1.13,1.646-1.091,1.633-1.049l0.04,0.011\r\n\t\t\tc0.011-0.041,0.024-0.078,0.04-0.114L1.675-1.168z M2.975-0.944l-0.02,0.122l0.041,0.006l0.02-0.122L2.975-0.944z M1.606-0.928\r\n\t\t\tC1.599-0.89,1.593-0.848,1.588-0.804l0.041,0.005C1.634-0.842,1.64-0.883,1.647-0.92L1.606-0.928z M2.101-0.769L2.1-0.729\r\n\t\t\tc0.041,0.001,0.082,0.003,0.123,0.005l0.002-0.041C2.184-0.767,2.142-0.769,2.101-0.769z M1.977-0.769\r\n\t\t\tC1.934-0.768,1.892-0.765,1.853-0.762l0.003,0.041c0.039-0.003,0.08-0.005,0.123-0.006L1.977-0.769z M2.349-0.754L2.345-0.713\r\n\t\t\tc0.041,0.004,0.082,0.009,0.122,0.016l0.006-0.041C2.432-0.744,2.391-0.75,2.349-0.754z M1.729-0.747\r\n\t\t\tc-0.046,0.008-0.088,0.018-0.123,0.03l0.013,0.039c0.033-0.011,0.073-0.021,0.117-0.028L1.729-0.747z M2.595-0.716L2.586-0.676\r\n\t\t\tc0.042,0.009,0.082,0.019,0.119,0.029l0.012-0.04C2.679-0.697,2.638-0.707,2.595-0.716z M2.935-0.701l-0.016,0.1\r\n\t\t\tc-0.023-0.015-0.052-0.03-0.084-0.043L2.819-0.606c0.043,0.018,0.077,0.038,0.103,0.058l0.021-0.025l0.014,0.002l0.02-0.122\r\n\t\t\tL2.935-0.701z\"/>\r\n                </g>\r\n                <path fill=\"#004373\" d=\"M-1.977,3.178c0.035,0.104,0.243,0.098,0.301,0.022c0.082-0.107,0.439-0.767,0.507-1.088\r\n\t\tc0.053-0.25-0.263-0.278-0.297-0.021C-1.498,2.317-1.842,3.015-1.977,3.178\"/>\r\n                <path fill=\"#00FFFF\" d=\"M-2.033,3.205C-2,3.31-1.755,3.31-1.696,3.234c0.084-0.105,0.451-0.759,0.524-1.08\r\n\t\tc0.056-0.249-0.234-0.277-0.298-0.024C-1.525,2.349-1.895,3.044-2.033,3.205\"/>\r\n                <path fill=\"#FDD302\" d=\"M-1.193,2.116c0-0.061-0.049-0.111-0.111-0.111c-0.061,0-0.111,0.05-0.111,0.111\r\n\t\tc0,0.062,0.05,0.111,0.111,0.111C-1.243,2.228-1.193,2.178-1.193,2.116\"/>\r\n                <path fill=\"#004373\" d=\"M1.977,3.178c-0.035,0.104-0.243,0.098-0.3,0.022C1.594,3.093,1.237,2.434,1.169,2.113\r\n\t\tc-0.053-0.25,0.263-0.278,0.297-0.021C1.497,2.317,1.842,3.015,1.977,3.178\"/>\r\n                <path fill=\"#00FFFF\" d=\"M2.032,3.205C1.999,3.31,1.755,3.31,1.696,3.234c-0.083-0.105-0.451-0.759-0.523-1.08\r\n\t\tC1.116,1.905,1.405,1.876,1.469,2.129C1.525,2.349,1.895,3.044,2.032,3.205\"/>\r\n                <path fill=\"#FDD302\" d=\"M1.193,2.116c0-0.061,0.05-0.111,0.11-0.111c0.061,0,0.111,0.05,0.111,0.111\r\n\t\tc0,0.062-0.05,0.111-0.111,0.111C1.243,2.228,1.193,2.178,1.193,2.116\"/>\r\n                <path fill=\"#00FFFF\" d=\"M0.202,7.476h-0.417c-0.399,0-0.722-0.323-0.722-0.722V6.15c0-0.035,0.029-0.064,0.064-0.064H0.86\r\n\t\tc0.036,0,0.064,0.029,0.064,0.064v0.604C0.924,7.153,0.601,7.476,0.202,7.476\"/>\r\n            </symbol>\r\n            <g class='button pauseButton'>\r\n                <path fill=\"#F4911E\" class=\"background\" d=\"M300.093,18.103c0,6.423-5.207,11.63-11.629,11.63c-6.423,0-11.63-5.207-11.63-11.63\r\n\t\ts5.207-11.629,11.63-11.629C294.886,6.473,300.093,11.68,300.093,18.103\"/>\r\n                <g>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M286.507,23.152c-0.599,0-1.085-0.486-1.085-1.085v-8.564c0-0.599,0.486-1.085,1.085-1.085\r\n\t\t\t\tc0.6,0,1.085,0.486,1.085,1.085v8.564C287.593,22.666,287.107,23.152,286.507,23.152z\"/>\r\n                    </g>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M290.612,23.152c-0.599,0-1.085-0.486-1.085-1.085v-8.564c0-0.599,0.486-1.085,1.085-1.085\r\n\t\t\t\tc0.6,0,1.086,0.486,1.086,1.085v8.564C291.698,22.666,291.212,23.152,290.612,23.152z\"/>\r\n                    </g>\r\n                </g>\r\n            </g>\r\n            <a xlink:href='.' class='button homeButton'>\r\n                <path fill=\"#F4911E\" class=\"background\" d=\"M330.406,18.103c0,6.423-5.207,11.63-11.63,11.63c-6.422,0-11.629-5.207-11.629-11.63\r\n\t\ts5.207-11.629,11.629-11.629C325.2,6.473,330.406,11.68,330.406,18.103\"/>\r\n                <g>\r\n                    <polygon fill=\"#FFFFFF\" points=\"327.305,15.9 318.776,8.333 310.249,15.9 318.776,14.039 \t\t\"/>\r\n                    <polygon fill=\"#FFFFFF\" points=\"318.776,15.215 312.889,16.456 312.889,25.904 316.953,26.982 316.953,22.067 320.601,22.067\r\n\t\t\t320.601,26.982 324.666,25.904 324.666,16.456 \t\t\"/>\r\n                </g>\r\n            </a>\r\n            <text class='scoreLabel' x=\"94\" y=\"10\" text-anchor='middle' fill=\"#FFFFFF\" font-size=\"4.3164\">\r\n            </text>\r\n            <path fill=\"#FFFFFF\" d=\"M106.405,22.915H81.67c-3.023,0-5.473-2.45-5.473-5.472c0-3.023,2.45-5.473,5.473-5.473h24.734\r\n\tc3.022,0,5.472,2.45,5.472,5.473C111.877,20.464,109.427,22.915,106.405,22.915\"/>\r\n            <text class='levelLabel' text-anchor='middle' x=\"155\" y=\"10\" fill=\"#FFFFFF\"\r\n                  font-size=\"4.3164\">\r\n            </text>\r\n            <path fill=\"#FFFFFF\" d=\"M158.519,22.915h-6.129c-3.022,0-5.473-2.45-5.473-5.472c0-3.023,2.45-5.473,5.473-5.473h6.129\r\n\tc3.022,0,5.472,2.45,5.472,5.473C163.99,20.464,161.541,22.915,158.519,22.915\"/>\r\n\r\n            <path fill=\"#FFFFFF\" d=\"M56.805,22.915H32.07c-3.022,0-5.472-2.45-5.472-5.472c0-3.023,2.45-5.473,5.472-5.473h24.735\r\n\tc3.022,0,5.472,2.45,5.472,5.473C62.277,20.464,59.827,22.915,56.805,22.915\"/>\r\n            <g>\r\n                <path fill=\"#B0B0B0\" d=\"M24.113,26.574c-4.896,0-8.879-3.983-8.879-8.879c0-4.896,3.983-8.878,8.879-8.878\r\n\t\tc4.895,0,8.878,3.983,8.878,8.878C32.991,22.591,29.008,26.574,24.113,26.574z M24.113,14.069c-2,0-3.626,1.627-3.626,3.625\r\n\t\tc0,1.999,1.626,3.625,3.626,3.625c1.999,0,3.625-1.626,3.625-3.625C27.738,15.696,26.111,14.069,24.113,14.069z\"/>\r\n            </g>\r\n            <g>\r\n                <path fill=\"#FFFFFF\" d=\"M24.113,25.26c-4.172,0-7.566-3.394-7.566-7.565c0-4.171,3.394-7.565,7.566-7.565\r\n\t\tc4.171,0,7.565,3.394,7.565,7.565C31.678,21.867,28.284,25.26,24.113,25.26z M24.113,12.757c-2.723,0-4.939,2.215-4.939,4.938\r\n\t\tc0,2.724,2.216,4.938,4.939,4.938c2.723,0,4.938-2.215,4.938-4.938C29.051,14.972,26.835,12.757,24.113,12.757z\"/>\r\n            </g>\r\n            <path id=\"clockBackground\" fill=\"#eb1c24\" d=\"M30.364,17.695c0,3.453-2.799,6.252-6.251,6.252c-3.453,0-6.252-2.799-6.252-6.252s2.799-6.252,6.252-6.252\r\n\tC27.565,11.443,30.364,14.242,30.364,17.695\"/>\r\n            <g>\r\n                <rect x=\"23.451\" y=\"7.202\" fill=\"#B0B0B0\" width=\"1.323\" height=\"2.327\"/>\r\n            </g>\r\n            <g>\r\n                <rect x=\"21.557\" y=\"6.448\" fill=\"#B0B0B0\" width=\"5.111\" height=\"1.323\"/>\r\n            </g>\r\n            <g>\r\n                <rect x=\"16.354\" y=\"8.686\" transform=\"matrix(0.5883 0.8087 -0.8087 0.5883 15.3447 -10.3562)\"\r\n                      fill=\"#B0B0B0\" width=\"2.977\" height=\"2.408\"/>\r\n            </g>\r\n            <text id='time' x=\"44\" y='20' text-anchor='middle' fill=\"#666666\" font-size=\"7.88\"></text>\r\n            <text id=\"score\" text-anchor='middle' x=\"94\" y=\"20\" fill=\"#666666\"\r\n                  font-size=\"7.88\">0\r\n            </text>\r\n            <text id='level' x=\"153\" y=\"20\" fill=\"#666666\" font-size=\"7.88\">1</text>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 177.4878 16.0083)\" overflow=\"visible\"/>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 190.6787 16.0083)\" overflow=\"visible\"/>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 203.8701 16.0083)\" overflow=\"visible\"/>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 217.061 16.0083)\" overflow=\"visible\"/>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 230.252 16.0083)\" overflow=\"visible\"/>\r\n        </svg>\r\n        <svg x=\"0px\" y=\"37px\" class='levelPopup' style='display:none' width=\"330px\" height=\"200px\">\r\n            <g>\r\n                <polygon fill=\"#FFFFFF\" points=\"165,7.417 195.082,68.37 262.347,78.145 213.674,125.59 225.165,192.583 165,160.952\r\n\t\t104.835,192.583 116.327,125.59 67.653,78.145 134.917,68.37 \t\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M156.425,103.669l-7.794-13.539c-0.547-1.602-2.824-1.566-3.322,0.052l3.117,13.438\"/>\r\n                <path fill=\"#00FFFF\"\r\n                      d=\"M147.751,105.679l-2.329-11.446c0.498-1.616,5.085-2.566,5.634-0.965l6.103,10.401L147.751,105.679z\"/>\r\n                <path fill=\"#274571\" d=\"M178.248,79.869c0,1.348-6.029,2.439-13.467,2.439c-7.437,0-13.466-1.092-13.466-2.439\r\n\t\tc0-1.347,6.029-2.439,13.466-2.439C172.219,77.43,178.248,78.522,178.248,79.869\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M173.157,103.669l7.794-13.539c0.547-1.602,2.825-1.566,3.323,0.052l-3.118,13.438\"/>\r\n                <path fill=\"#00FFFF\"\r\n                      d=\"M181.831,105.679l2.329-11.446c-0.498-1.616-5.085-2.566-5.633-0.965l-6.104,10.401L181.831,105.679z\"/>\r\n                <path fill=\"#303D8A\" d=\"M160.188,48.677l-3.793,2.142c-0.994,0.591-1.196,1.921,0.927,2.881c2.125,0.963,4.788,0.708,4.788,0.708\r\n\t\tl0.758-5.848L160.188,48.677z\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M160.313,52.334h-0.849c-0.444,0-0.805-0.361-0.805-0.806s0.36-0.805,0.805-0.805h0.849\"/>\r\n                <path fill=\"#CDB42C\" d=\"M159.374,51.761c0-0.287,0.326-0.519,0.729-0.519c0.273,0,0.51,0.107,0.635,0.267\r\n\t\tc-0.016-0.326-0.389-0.586-0.849-0.586c-0.469,0-0.85,0.271-0.85,0.605c0,0.241,0.197,0.449,0.482,0.548\r\n\t\tC159.429,51.988,159.374,51.88,159.374,51.761\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M169.258,52.334h0.849c0.444,0,0.805-0.361,0.805-0.806s-0.36-0.805-0.805-0.805h-0.849\"/>\r\n                <path fill=\"#CDB42C\" d=\"M170.198,51.761c0-0.287-0.325-0.519-0.728-0.519c-0.274,0-0.513,0.107-0.637,0.267\r\n\t\tc0.016-0.326,0.389-0.586,0.849-0.586c0.47,0,0.85,0.271,0.85,0.605c0,0.241-0.197,0.449-0.482,0.548\r\n\t\tC170.142,51.988,170.198,51.88,170.198,51.761\"/>\r\n                <path fill=\"#F3D332\" d=\"M178.277,77.978l10.36-29.498c0.089-1.867-2.051-2.311-2.999,0l-9.052,14.498l-2.825,1.099\r\n\t\tc-0.756,0-1.428-0.486-1.662-1.206l-3.982-17.378c-0.297-1.401-1.814-2.097-3.33-2.09c-1.517-0.007-3.032,0.688-3.329,2.09\r\n\t\tl-3.982,17.378c-0.234,0.72-0.905,1.206-1.662,1.206l-2.825-1.099l-9.052-14.498c-0.769-1.479-2.98-2.034-2.852,0l10.212,29.498\r\n\t\tc0.613,0.445,0.87,1.233,0.635,1.953l0.213,19.56c-0.393,1.21,0.549,2.267,1.623,2.296c0.358,0.011,0.73-0.092,1.072-0.341\r\n\t\tl8.922-12.923c0.306-0.223,0.665-0.334,1.024-0.335c0.359,0.001,0.719,0.112,1.023,0.335l9.502,16.351\r\n\t\tc0.343,0.249,0.715,0.354,1.072,0.342c1.075-0.028,2.017-1.085,1.623-2.294l-0.365-22.99\r\n\t\tC177.408,79.211,177.665,78.423,178.277,77.978\"/>\r\n                <polygon fill=\"#274571\" points=\"149.902,92.337 149.204,91.123 148.397,100.658 \t\"/>\r\n                <path fill=\"#00FFFF\" d=\"M165.818,92.683c-0.612-0.444-1.442-0.444-2.055,0l-9.109,15.408c-1.369,0.994-7.444-1.265-6.921-2.875\r\n\t\tl3.582-25.285c2.235,1.046,4.315,0.345,4.506-1.574c0,0,0.583-6.195,0.146-9.443c-0.058-0.423,0.269-0.802,0.696-0.798l8.127,0.07\"\r\n                />\r\n                <polygon fill=\"#274571\" points=\"179.68,92.337 180.378,91.123 181.185,100.658 \t\"/>\r\n                <path fill=\"#00FFFF\" d=\"M163.764,92.683c0.612-0.444,1.442-0.444,2.055,0l9.108,15.408c1.37,0.994,7.445-1.265,6.921-2.875\r\n\t\tl-3.582-25.285c-2.235,1.046-4.314,0.345-4.505-1.574c0,0-0.583-6.195-0.146-9.443c0.058-0.423-0.269-0.802-0.696-0.798\r\n\t\tl-8.127,0.07\"/>\r\n                <g>\r\n                    <path fill=\"#0071BC\" d=\"M178.118,80.818l-0.077-0.193c0.095-0.038,0.188-0.077,0.282-0.122l0.088,0.189\r\n\t\t\tC178.313,80.737,178.217,80.779,178.118,80.818z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"#0071BC\" d=\"M153.356,81.177c-0.001,0-0.002,0-0.003,0l-0.012-0.208c0.211,0.006,0.417-0.012,0.612-0.038l0.027,0.206\r\n\t\t\tC153.776,81.163,153.566,81.177,153.356,81.177z M176.24,81.177h-0.01c-0.212,0-0.424-0.014-0.629-0.041l0.026-0.206\r\n\t\t\tc0.196,0.026,0.399,0.039,0.603,0.039L176.24,81.177z M176.88,81.136l-0.026-0.206c0.203-0.026,0.406-0.066,0.603-0.116\r\n\t\t\tl0.053,0.202C177.302,81.068,177.09,81.108,176.88,81.136z M152.701,81.136c-0.211-0.027-0.422-0.067-0.629-0.121l0.052-0.201\r\n\t\t\tc0.198,0.05,0.401,0.09,0.604,0.116L152.701,81.136z M154.609,81.005l-0.058-0.199c0.202-0.059,0.393-0.132,0.568-0.219\r\n\t\t\tl0.093,0.187C155.026,80.865,154.823,80.944,154.609,81.005z M174.971,81.005c-0.213-0.062-0.416-0.14-0.603-0.232l0.093-0.187\r\n\t\t\tc0.174,0.088,0.366,0.161,0.567,0.22L174.971,81.005z M155.759,80.423l-0.131-0.16c0.159-0.132,0.295-0.279,0.404-0.438\r\n\t\t\tl0.171,0.116C156.085,80.117,155.935,80.278,155.759,80.423z M173.821,80.421c-0.175-0.144-0.325-0.306-0.444-0.48l0.171-0.118\r\n\t\t\tc0.108,0.159,0.245,0.307,0.405,0.438L173.821,80.421z M156.483,79.346l-0.2-0.056c0.028-0.103,0.048-0.21,0.06-0.317l0.001-0.015\r\n\t\t\tc0.003-0.032,0.012-0.126,0.024-0.271l0.207,0.018c-0.01,0.111-0.017,0.193-0.021,0.239l0.001,0.001l-0.005,0.047\r\n\t\t\tC156.538,79.112,156.515,79.231,156.483,79.346z M173.099,79.344c-0.033-0.113-0.055-0.232-0.066-0.352\r\n\t\t\tc0-0.001-0.009-0.104-0.025-0.29l0.207-0.017c0.016,0.184,0.025,0.286,0.025,0.286c0.01,0.107,0.03,0.214,0.059,0.315\r\n\t\t\tL173.099,79.344z M156.625,78.078l-0.207-0.017c0.015-0.187,0.03-0.396,0.046-0.627l0.207,0.016\r\n\t\t\tC156.655,77.68,156.64,77.89,156.625,78.078z M172.957,78.075c-0.014-0.187-0.029-0.397-0.045-0.628l0.207-0.015\r\n\t\t\tc0.017,0.23,0.032,0.44,0.046,0.627L172.957,78.075z M156.713,76.822l-0.208-0.013c0.012-0.201,0.025-0.41,0.037-0.627\r\n\t\t\tl0.208,0.012C156.738,76.412,156.726,76.621,156.713,76.822z M172.871,76.818c-0.012-0.199-0.024-0.41-0.037-0.628l0.208-0.01\r\n\t\t\tc0.013,0.216,0.024,0.425,0.037,0.626L172.871,76.818z M156.782,75.565l-0.208-0.01c0.009-0.205,0.019-0.415,0.027-0.627\r\n\t\t\tl0.208,0.008C156.801,75.149,156.792,75.361,156.782,75.565z M172.804,75.562c-0.009-0.205-0.019-0.415-0.027-0.628l0.208-0.008\r\n\t\t\tc0.008,0.213,0.017,0.423,0.027,0.627L172.804,75.562z M156.832,74.309l-0.208-0.009c0.006-0.206,0.011-0.414,0.016-0.626\r\n\t\t\tl0.208,0.005C156.843,73.889,156.838,74.1,156.832,74.309z M172.755,74.305c-0.006-0.207-0.012-0.418-0.015-0.63l0.208-0.004\r\n\t\t\tc0.003,0.21,0.008,0.42,0.015,0.627L172.755,74.305z M156.856,73.048l-0.208-0.001c0.002-0.127,0.002-0.253,0.002-0.38\r\n\t\t\tl-0.001-0.247l0.209-0.001v0.248C156.858,72.795,156.858,72.921,156.856,73.048z M172.731,73.046c0-0.112,0-0.227,0-0.339\r\n\t\t\tc0-0.097,0-0.194,0-0.291l0.208,0.002c0,0.096,0,0.193,0,0.289c0,0.112,0,0.225,0.001,0.337L172.731,73.046z M156.641,71.793\r\n\t\t\tc-0.005-0.211-0.012-0.419-0.02-0.625l0.208-0.007c0.008,0.205,0.015,0.415,0.02,0.629L156.641,71.793z M172.949,71.791\r\n\t\t\tl-0.208-0.004c0.005-0.214,0.013-0.425,0.021-0.631l0.208,0.011C172.96,71.37,172.954,71.58,172.949,71.791z M156.586,70.544\r\n\t\t\tc-0.015-0.219-0.034-0.427-0.053-0.622l0.207-0.021c0.021,0.196,0.039,0.408,0.055,0.629L156.586,70.544z M173.004,70.541\r\n\t\t\tl-0.207-0.014c0.015-0.22,0.034-0.432,0.054-0.629l0.208,0.021C173.038,70.116,173.019,70.324,173.004,70.541z M156.694,69.306\r\n\t\t\tl-0.205-0.036c0.045-0.242,0.202-0.45,0.42-0.561l0.092,0.187C156.842,68.977,156.727,69.131,156.694,69.306z M172.896,69.304\r\n\t\t\tc-0.033-0.176-0.149-0.328-0.31-0.408l0.092-0.188c0.218,0.108,0.376,0.317,0.422,0.557L172.896,69.304z M172.016,68.836h-0.628\r\n\t\t\tv-0.207h0.628V68.836z M170.76,68.836h-0.628v-0.207h0.628V68.836z M169.504,68.836h-0.628v-0.207h0.628V68.836z M168.248,68.836\r\n\t\t\th-0.628v-0.207h0.628V68.836z M166.993,68.836h-0.628v-0.207h0.628V68.836z M165.736,68.836h-0.628v-0.207h0.628V68.836z\r\n\t\t\t M164.48,68.836h-0.628v-0.207h0.628V68.836z M163.224,68.836h-0.627v-0.207h0.627V68.836z M161.969,68.836h-0.628v-0.207h0.628\r\n\t\t\tV68.836z M160.713,68.836h-0.628v-0.207h0.628V68.836z M159.457,68.836h-0.628v-0.207h0.628V68.836z M158.201,68.836h-0.628\r\n\t\t\tv-0.207h0.628V68.836z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"#0071BC\" d=\"M151.464,80.818c-0.098-0.039-0.197-0.081-0.292-0.126l0.088-0.189c0.093,0.045,0.186,0.084,0.281,0.122\r\n\t\t\tL151.464,80.818z\"/>\r\n                </g>\r\n                <path fill=\"#FFFFFF\" d=\"M164.957,53.557c0.129,1.132-0.701,2.098-1.854,2.158c-1.154,0.061-2.194-0.809-2.323-1.939\r\n\t\tc-0.13-1.132,0.7-2.099,1.853-2.158C163.786,51.557,164.826,52.426,164.957,53.557\"/>\r\n                <path fill=\"#282B4F\" d=\"M161.198,51.635c0,0,0.025-0.046,0.078-0.126c0.052-0.08,0.136-0.189,0.255-0.305\r\n\t\tc0.12-0.113,0.275-0.238,0.471-0.33c0.191-0.095,0.421-0.154,0.651-0.17c0.049-0.006,0.119-0.003,0.176-0.006\r\n\t\tc0.058,0.002,0.117,0.002,0.174,0.006c0.117,0.009,0.23,0.029,0.335,0.064c0.21,0.073,0.382,0.19,0.507,0.311\r\n\t\tc0.064,0.058,0.116,0.119,0.159,0.172c0.043,0.057,0.077,0.106,0.101,0.15c0.049,0.087,0.068,0.142,0.068,0.142l-0.029,0.029\r\n\t\tc0,0-0.055-0.021-0.141-0.062c-0.086-0.04-0.205-0.096-0.343-0.155c-0.14-0.059-0.297-0.12-0.464-0.177\r\n\t\tc-0.082-0.031-0.168-0.063-0.26-0.089c-0.044-0.016-0.09-0.024-0.137-0.035c-0.047-0.007-0.085-0.016-0.142-0.017\r\n\t\tc-0.39-0.03-0.778,0.108-1.033,0.281c-0.129,0.084-0.226,0.175-0.291,0.236c-0.066,0.063-0.103,0.104-0.103,0.104L161.198,51.635z\"\r\n                />\r\n                <path fill=\"#282B4F\" d=\"M168.352,51.66c0,0-0.036-0.04-0.102-0.104c-0.066-0.062-0.163-0.152-0.292-0.236\r\n\t\tc-0.255-0.173-0.644-0.312-1.033-0.281c-0.057,0.001-0.095,0.01-0.142,0.017c-0.046,0.011-0.092,0.02-0.139,0.035\r\n\t\tc-0.089,0.026-0.175,0.058-0.258,0.089c-0.168,0.057-0.324,0.118-0.463,0.177c-0.139,0.06-0.257,0.115-0.344,0.155\r\n\t\tc-0.086,0.04-0.141,0.062-0.141,0.062l-0.03-0.029c0,0,0.02-0.055,0.069-0.142c0.025-0.044,0.058-0.094,0.101-0.15\r\n\t\tc0.043-0.053,0.095-0.114,0.159-0.172c0.126-0.12,0.297-0.237,0.507-0.31c0.105-0.036,0.218-0.057,0.335-0.065\r\n\t\tc0.058-0.004,0.116-0.004,0.174-0.006c0.059,0.003,0.127,0,0.176,0.006c0.23,0.016,0.46,0.075,0.652,0.17\r\n\t\tc0.193,0.092,0.35,0.217,0.47,0.33c0.12,0.115,0.203,0.225,0.255,0.305c0.053,0.08,0.079,0.126,0.079,0.126L168.352,51.66z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M164.626,53.557c-0.13,1.132,0.701,2.098,1.853,2.158c1.153,0.061,2.194-0.809,2.324-1.939\r\n\t\tc0.129-1.132-0.701-2.099-1.854-2.158C165.796,51.557,164.755,52.426,164.626,53.557\"/>\r\n                <path fill=\"#282B4F\" d=\"M164.27,53.503c0,0.564-0.458,1.022-1.023,1.022s-1.023-0.458-1.023-1.022c0-0.565,0.458-1.023,1.023-1.023\r\n\t\tS164.27,52.938,164.27,53.503\"/>\r\n                <path fill=\"#282B4F\" d=\"M167.417,53.503c0,0.564-0.459,1.022-1.024,1.022s-1.023-0.458-1.023-1.022\r\n\t\tc0-0.565,0.458-1.023,1.023-1.023S167.417,52.938,167.417,53.503\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M167.774,58.004c-3.043,3.913-6.062,0.103-6.062,0.103C162.733,58.349,166.351,58.586,167.774,58.004\"/>\r\n                <path fill=\"#D27C1D\" d=\"M168.722,57.688l-0.547,0.639l-0.146,0.171l-0.168,0.186c-0.111,0.115-0.225,0.23-0.345,0.341\r\n\t\tc-0.241,0.221-0.502,0.426-0.787,0.6c-0.287,0.177-0.598,0.319-0.928,0.416c-0.33,0.095-0.676,0.141-1.019,0.128\r\n\t\tc-0.688-0.022-1.331-0.269-1.874-0.61c-0.273-0.171-0.527-0.366-0.761-0.577c-0.118-0.108-0.231-0.218-0.339-0.333\r\n\t\tc-0.11-0.115-0.21-0.228-0.316-0.365l-0.523-0.677l0.809,0.227c0.224,0.064,0.473,0.111,0.718,0.153\r\n\t\tc0.247,0.042,0.497,0.077,0.747,0.108c0.501,0.062,1.006,0.106,1.513,0.133s1.012,0.035,1.519,0.012\r\n\t\tc0.254-0.011,0.507-0.031,0.757-0.066c0.126-0.017,0.251-0.037,0.375-0.066c0.125-0.024,0.247-0.061,0.368-0.101L168.722,57.688z\r\n\t\t M166.892,58.269c-0.2,0.041-0.401,0.081-0.604,0.109c-0.508,0.07-1.022,0.107-1.534,0.128c-0.514,0.021-1.027,0.021-1.542,0.007\r\n\t\tc-0.257-0.007-0.516-0.02-0.774-0.039c-0.261-0.021-0.517-0.044-0.79-0.094l0.285-0.448c0.085,0.095,0.191,0.201,0.293,0.296\r\n\t\tc0.104,0.098,0.212,0.19,0.324,0.277c0.223,0.175,0.458,0.333,0.703,0.465c0.488,0.265,1.02,0.419,1.536,0.402\r\n\t\tc0.517-0.016,1.01-0.203,1.442-0.512c0.217-0.154,0.419-0.335,0.608-0.532C166.857,58.31,166.874,58.288,166.892,58.269\"/>\r\n                <path fill=\"#274571\" d=\"M151.353,81.894c0.649,1.624,3.931,2.482,5.806,1.657c-0.183,3.036-0.519,4.053-1.375,5.045\r\n\t\tc-1.128,1.308-4.386,2.468-5.391,0.358L151.353,81.894z\"/>\r\n                <path fill=\"#457AB9\" d=\"M151.245,82.309c0.661,1.472,4.004,2.247,5.914,1.503c-0.186,2.747-0.563,3.596-1.401,4.564\r\n\t\tc-1.057,1.22-4.466,2.232-5.49,0.324L151.245,82.309z\"/>\r\n                <g>\r\n                    <path fill=\"#F3D332\" d=\"M152.488,89.318h-0.054l0.002-0.214h0.051c0.186,0,0.379-0.015,0.576-0.044l0.03,0.212\r\n\t\t\tC152.888,89.304,152.684,89.318,152.488,89.318z M151.771,89.243c-0.234-0.054-0.446-0.137-0.63-0.244l0.109-0.186\r\n\t\t\tc0.165,0.098,0.356,0.171,0.569,0.22L151.771,89.243z M153.739,89.132l-0.061-0.206c0.207-0.062,0.404-0.137,0.588-0.223\r\n\t\t\tl0.091,0.195C154.164,88.987,153.956,89.066,153.739,89.132z M154.931,88.558l-0.13-0.172c0.154-0.114,0.274-0.234,0.359-0.357\r\n\t\t\tl0.059-0.085l0.176,0.124l-0.059,0.084C155.237,88.292,155.101,88.429,154.931,88.558z M150.633,88.542\r\n\t\t\tc-0.034-0.046-0.064-0.093-0.093-0.144l-0.019-0.033l0.085-0.517l0.212,0.034l-0.073,0.441c0.019,0.032,0.04,0.062,0.062,0.092\r\n\t\t\tL150.633,88.542z M155.754,87.523l-0.186-0.11c0.11-0.186,0.203-0.369,0.281-0.562l0.199,0.083\r\n\t\t\tC155.965,87.135,155.87,87.328,155.754,87.523z M150.921,87.247l-0.211-0.034l0.104-0.637l0.212,0.034L150.921,87.247z\r\n\t\t\t M156.257,86.31l-0.207-0.056c0.05-0.191,0.096-0.398,0.135-0.62l0.211,0.037C156.357,85.897,156.311,86.112,156.257,86.31z\r\n\t\t\t M151.13,85.975l-0.212-0.036l0.104-0.637l0.212,0.035L151.13,85.975z M156.485,85.024l-0.213-0.021\r\n\t\t\tc0.016-0.142,0.029-0.29,0.041-0.447l-0.04-0.12c0.039-0.013,0.078-0.026,0.116-0.04l0.156-0.058l-0.012,0.166\r\n\t\t\tC156.519,84.688,156.503,84.861,156.485,85.024z M154.394,84.896c-0.217-0.008-0.438-0.026-0.653-0.055l0.028-0.213\r\n\t\t\tc0.209,0.027,0.421,0.045,0.632,0.053L154.394,84.896z M155.05,84.885l-0.016-0.215c0.215-0.015,0.426-0.041,0.628-0.078\r\n\t\t\tl0.039,0.21C155.493,84.841,155.273,84.868,155.05,84.885z M153.096,84.725c-0.217-0.053-0.429-0.116-0.63-0.188l0.073-0.201\r\n\t\t\tc0.192,0.069,0.396,0.129,0.606,0.18L153.096,84.725z M151.338,84.7l-0.212-0.034l0.104-0.636l0.212,0.033L151.338,84.7z\r\n\t\t\t M151.863,84.271c-0.207-0.108-0.394-0.229-0.559-0.359l0.134-0.169c0.153,0.123,0.33,0.236,0.524,0.339L151.863,84.271z\"/>\r\n                </g>\r\n                <path fill=\"#274571\" d=\"M178.229,81.894c-0.649,1.624-3.931,2.482-5.806,1.657c0.183,3.036,0.519,4.053,1.376,5.045\r\n\t\tc1.127,1.308,4.385,2.468,5.39,0.358L178.229,81.894z\"/>\r\n                <path fill=\"#457AB9\" d=\"M178.337,82.309c-0.662,1.472-4.005,2.247-5.914,1.503c0.186,2.747,0.562,3.596,1.401,4.564\r\n\t\tc1.057,1.22,4.466,2.232,5.49,0.324L178.337,82.309z\"/>\r\n                <g>\r\n                    <path fill=\"#F3D332\" d=\"M177.092,89.318c-0.195,0-0.399-0.015-0.604-0.046l0.031-0.212c0.194,0.029,0.388,0.044,0.573,0.044\r\n\t\t\tc0,0,0.001,0,0.002,0h0.051l0.002,0.214h-0.054C177.093,89.318,177.092,89.318,177.092,89.318z M177.811,89.243l-0.047-0.21\r\n\t\t\tc0.212-0.049,0.403-0.122,0.568-0.22l0.109,0.186C178.257,89.107,178.045,89.189,177.811,89.243z M175.843,89.132\r\n\t\t\tc-0.216-0.065-0.425-0.145-0.619-0.233l0.091-0.195c0.184,0.086,0.381,0.159,0.588,0.223L175.843,89.132z M174.652,88.558\r\n\t\t\tc-0.171-0.129-0.308-0.266-0.407-0.406l-0.059-0.084l0.176-0.122l0.059,0.083c0.085,0.123,0.207,0.243,0.359,0.357L174.652,88.558\r\n\t\t\tz M178.95,88.542l-0.174-0.126c0.021-0.03,0.042-0.061,0.061-0.092l-0.071-0.441l0.211-0.035l0.085,0.518l-0.019,0.033\r\n\t\t\tC179.013,88.449,178.983,88.496,178.95,88.542z M173.829,87.523c-0.115-0.195-0.212-0.389-0.295-0.589l0.199-0.083\r\n\t\t\tc0.079,0.192,0.17,0.376,0.281,0.562L173.829,87.523z M178.66,87.247l-0.104-0.637l0.212-0.034l0.104,0.637L178.66,87.247z\r\n\t\t\t M173.325,86.31c-0.053-0.195-0.099-0.412-0.139-0.639l0.212-0.037c0.038,0.222,0.083,0.43,0.133,0.62L173.325,86.31z\r\n\t\t\t M178.452,85.975l-0.104-0.638l0.212-0.035l0.105,0.637L178.452,85.975z M173.096,85.024c-0.018-0.163-0.034-0.336-0.046-0.521\r\n\t\t\tl-0.011-0.165l0.155,0.057c0.038,0.014,0.077,0.027,0.116,0.04l-0.04,0.12c0.012,0.157,0.025,0.306,0.041,0.447L173.096,85.024z\r\n\t\t\t M175.188,84.896l-0.007-0.215c0.21-0.008,0.423-0.025,0.632-0.053l0.027,0.213C175.625,84.87,175.405,84.889,175.188,84.896z\r\n\t\t\t M174.533,84.885c-0.224-0.017-0.443-0.044-0.652-0.083l0.039-0.21c0.202,0.037,0.413,0.063,0.628,0.078L174.533,84.885z\r\n\t\t\t M176.486,84.725l-0.05-0.21c0.209-0.051,0.414-0.11,0.606-0.18l0.072,0.201C176.916,84.608,176.705,84.672,176.486,84.725z\r\n\t\t\t M178.246,84.7l-0.105-0.637l0.212-0.035l0.104,0.638L178.246,84.7z M177.72,84.271l-0.101-0.19\r\n\t\t\tc0.194-0.102,0.372-0.215,0.525-0.338l0.133,0.169C178.114,84.042,177.926,84.163,177.72,84.271z\"/>\r\n                </g>\r\n                <path fill=\"#274571\" d=\"M154.655,63.62c0.182-0.545,1.271-0.518,1.574-0.12c0.428,0.562,2.09,4.634,2.445,6.318\r\n\t\tc0.276,1.307-1.375,1.457-1.558,0.106C156.958,68.745,155.361,64.475,154.655,63.62\"/>\r\n                <path fill=\"#00FFFF\" d=\"M154.367,63.478c0.173-0.547,1.448-0.546,1.758-0.152c0.437,0.555,2.152,4.597,2.533,6.276\r\n\t\tc0.296,1.302-1.22,1.45-1.555,0.131C156.812,68.582,155.086,64.32,154.367,63.478\"/>\r\n                <path fill=\"#0071BC\" d=\"M158.548,69.799c0,0.319-0.259,0.578-0.579,0.578c-0.32,0-0.58-0.259-0.58-0.578\r\n\t\tc0-0.32,0.259-0.579,0.58-0.579C158.289,69.22,158.548,69.479,158.548,69.799\"/>\r\n                <path fill=\"#274571\" d=\"M174.926,63.62c-0.182-0.545-1.27-0.518-1.573-0.12c-0.427,0.562-2.09,4.634-2.445,6.318\r\n\t\tc-0.276,1.307,1.375,1.457,1.558,0.106C172.625,68.745,174.221,64.475,174.926,63.62\"/>\r\n                <path fill=\"#00FFFF\" d=\"M175.215,63.478c-0.173-0.547-1.45-0.546-1.759-0.152c-0.436,0.555-2.151,4.597-2.532,6.276\r\n\t\tc-0.295,1.302,1.221,1.45,1.555,0.131C172.771,68.582,174.496,64.32,175.215,63.478\"/>\r\n                <path fill=\"#0071BC\" d=\"M171.034,69.799c0,0.319,0.259,0.578,0.58,0.578c0.319,0,0.579-0.259,0.579-0.578\r\n\t\tc0-0.32-0.259-0.579-0.579-0.579C171.293,69.22,171.034,69.479,171.034,69.799\"/>\r\n                <path fill=\"#00FFFF\" d=\"M165.848,41.756h-2.184c-2.085,0-3.776,1.69-3.776,3.775v3.16c0,0.185,0.149,0.332,0.333,0.332h9.07\r\n\t\tc0.184,0,0.332-0.147,0.332-0.332v-3.16C169.624,43.446,167.934,41.756,165.848,41.756\"/>\r\n                <g class=\"goButton button\">\r\n                    <path fill=\"#9DC44D\" class='background' d=\"M174.857,117.131c0,5.559-4.507,10.065-10.066,10.065c-5.561,0-10.067-4.507-10.067-10.065\r\n\t\t\tc0-5.56,4.507-10.066,10.067-10.066C170.35,107.064,174.857,111.571,174.857,117.131\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M161.697,113.534c-0.59-0.157-1.183-0.044-1.777,0.343c-0.595,0.385-1.088,0.965-1.481,1.734\r\n\t\t\tc-0.387,0.732-0.572,1.486-0.556,2.262c0.016,0.775,0.248,1.391,0.696,1.848c0.299,0.299,0.594,0.456,0.885,0.473\r\n\t\t\tc0.261,0.007,0.528-0.086,0.804-0.284c0.283-0.196,0.546-0.468,0.791-0.813c0.236-0.338,0.433-0.696,0.59-1.075l0.414-1.005\r\n\t\t\tl0.046-0.129l-0.59,0.178c-0.59,0.188-1.181,0.39-1.771,0.603c-0.133,0.054-0.266,0.05-0.395-0.013\r\n\t\t\tc-0.13-0.062-0.221-0.16-0.272-0.295c-0.05-0.134-0.045-0.266,0.018-0.395c0.063-0.131,0.161-0.219,0.295-0.268\r\n\t\t\tc0.599-0.228,1.201-0.437,1.807-0.624c0.44-0.134,0.794-0.229,1.062-0.284c0.173-0.04,0.315-0.063,0.426-0.071\r\n\t\t\tc0.087-0.008,0.162-0.008,0.225,0c0.142,0.024,0.255,0.074,0.342,0.153c0.11,0.096,0.169,0.212,0.177,0.355v0.105\r\n\t\t\tc-0.008,0.016-0.012,0.035-0.012,0.059c-0.007,0.009-0.012,0.021-0.012,0.036c-0.008,0.009-0.011,0.019-0.011,0.036l-0.024,0.07\r\n\t\t\tl-0.094,0.213l-0.26,0.649l-0.401,1.026c-0.189,0.441-0.433,0.873-0.732,1.299c-0.299,0.425-0.637,0.767-1.016,1.027\r\n\t\t\tc-0.473,0.338-0.956,0.5-1.453,0.483c-0.55-0.031-1.073-0.291-1.57-0.779c-0.449-0.448-0.744-0.991-0.886-1.629\r\n\t\t\tc-0.149-0.639-0.169-1.268-0.059-1.89c0.11-0.614,0.315-1.211,0.614-1.794c0.228-0.44,0.492-0.834,0.791-1.181\r\n\t\t\tc0.299-0.36,0.644-0.677,1.033-0.944c0.39-0.268,0.801-0.44,1.233-0.52c0.441-0.086,0.91-0.071,1.405,0.048\r\n\t\t\tc0.133,0.031,0.235,0.11,0.307,0.236c0.07,0.126,0.088,0.257,0.054,0.396c-0.036,0.137-0.117,0.242-0.243,0.313\r\n\t\t\tC161.972,113.559,161.838,113.574,161.697,113.534\"/>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M159.485,121.57c-0.026,0-0.051,0-0.078-0.001c-0.641-0.037-1.243-0.331-1.796-0.875\r\n\t\t\t\tc-0.495-0.496-0.823-1.1-0.978-1.797c-0.159-0.677-0.18-1.359-0.062-2.022c0.116-0.645,0.333-1.281,0.646-1.891\r\n\t\t\t\tc0.239-0.462,0.521-0.881,0.836-1.245c0.312-0.378,0.683-0.719,1.097-1.003c0.428-0.293,0.887-0.485,1.365-0.573\r\n\t\t\t\tc0.475-0.094,1.003-0.077,1.543,0.051c0.225,0.055,0.406,0.191,0.523,0.4c0.114,0.2,0.143,0.423,0.085,0.644\r\n\t\t\t\tc-0.057,0.226-0.196,0.407-0.402,0.523c-0.204,0.113-0.431,0.142-0.658,0.077c-0.483-0.128-0.993-0.031-1.503,0.302\r\n\t\t\t\tc-0.541,0.351-1,0.891-1.365,1.604c-0.358,0.682-0.533,1.388-0.518,2.101c0.015,0.693,0.21,1.223,0.6,1.619\r\n\t\t\t\tc0.235,0.235,0.459,0.36,0.664,0.372h0.012c0.177,0,0.372-0.074,0.576-0.222c0.253-0.175,0.492-0.421,0.712-0.734\r\n\t\t\t\tc0.219-0.315,0.406-0.655,0.555-1.01l0.196-0.477c-0.55,0.177-1.112,0.367-1.666,0.567c-0.219,0.088-0.451,0.081-0.663-0.023\r\n\t\t\t\tc-0.207-0.1-0.359-0.265-0.44-0.478c-0.084-0.221-0.075-0.45,0.029-0.664c0.102-0.209,0.271-0.36,0.487-0.437\r\n\t\t\t\tc0.592-0.227,1.207-0.439,1.818-0.63c0.45-0.136,0.817-0.234,1.095-0.292c0.186-0.043,0.341-0.066,0.469-0.076\r\n\t\t\t\tc0.101-0.009,0.206-0.009,0.289,0.002c0.221,0.036,0.393,0.115,0.527,0.238c0.173,0.147,0.275,0.352,0.288,0.585l0.001,0.205\r\n\t\t\t\tl-0.013,0.024v0.097l-0.011,0.012v0.02l-0.042,0.043l-0.023,0.062l-0.093,0.214l-0.255,0.638l-0.4,1.024\r\n\t\t\t\tc-0.201,0.47-0.459,0.928-0.77,1.37c-0.322,0.457-0.691,0.829-1.101,1.111C160.559,121.385,160.027,121.57,159.485,121.57z\r\n\t\t\t\t M161.151,112.778c-0.175,0-0.346,0.016-0.511,0.048c-0.389,0.071-0.759,0.227-1.108,0.468c-0.362,0.248-0.686,0.545-0.963,0.88\r\n\t\t\t\tc-0.286,0.331-0.537,0.706-0.752,1.121c-0.282,0.548-0.478,1.12-0.582,1.699c-0.102,0.572-0.082,1.162,0.056,1.752\r\n\t\t\t\tc0.128,0.575,0.395,1.066,0.795,1.468c0.438,0.431,0.88,0.654,1.352,0.681c0.01,0,0.028,0.001,0.046,0.001h0.001\r\n\t\t\t\tc0.403,0,0.793-0.139,1.189-0.422c0.348-0.239,0.662-0.557,0.936-0.947c0.284-0.403,0.52-0.82,0.698-1.237l0.657-1.668\r\n\t\t\t\tl0.101-0.235c0.005-0.023,0.012-0.046,0.02-0.068c0.001-0.005,0.003-0.012,0.005-0.017c0.001-0.007,0.002-0.013,0.003-0.019\r\n\t\t\t\tv-0.045c-0.003-0.045-0.021-0.076-0.059-0.11c-0.045-0.039-0.103-0.063-0.179-0.075c-0.011-0.002-0.08-0.003-0.139,0.002\r\n\t\t\t\tc-0.098,0.008-0.224,0.028-0.38,0.065c-0.265,0.054-0.611,0.146-1.04,0.277c-0.595,0.185-1.195,0.393-1.784,0.617\r\n\t\t\t\tc-0.058,0.021-0.088,0.048-0.112,0.098c-0.023,0.047-0.024,0.081-0.006,0.127c0.021,0.054,0.052,0.087,0.104,0.112\r\n\t\t\t\tc0.045,0.021,0.075,0.021,0.12,0.005l0.013-0.007c0.591-0.212,1.19-0.416,1.783-0.605l1.241-0.372l-0.278,0.762l-0.418,1.017\r\n\t\t\t\tc-0.167,0.4-0.377,0.782-0.625,1.139c-0.268,0.379-0.562,0.681-0.876,0.898c-0.318,0.228-0.645,0.345-0.965,0.345l-0.04-0.001\r\n\t\t\t\tc-0.384-0.021-0.756-0.212-1.114-0.57c-0.511-0.521-0.777-1.221-0.795-2.081c-0.017-0.828,0.183-1.645,0.594-2.425\r\n\t\t\t\tc0.417-0.816,0.955-1.444,1.596-1.86c0.672-0.437,1.368-0.566,2.047-0.385c0.066,0.018,0.102,0.013,0.15-0.017\r\n\t\t\t\tc0.045-0.025,0.068-0.054,0.081-0.103c0.014-0.054,0.007-0.096-0.021-0.146c-0.028-0.051-0.056-0.065-0.09-0.073\r\n\t\t\t\tC161.643,112.809,161.39,112.778,161.151,112.778z\"/>\r\n                    </g>\r\n                    <path fill=\"#FFFFFF\" d=\"M166.228,112.602c0.079-0.119,0.184-0.192,0.318-0.225c0.504-0.118,0.925-0.118,1.264,0\r\n\t\t\tc0.236,0.08,0.575,0.289,1.016,0.627c0.739,0.574,1.265,1.302,1.576,2.184c0.311,0.881,0.362,1.78,0.154,2.697\r\n\t\t\tc-0.209,0.917-0.664,1.694-1.364,2.331c-0.252,0.236-0.549,0.441-0.892,0.613c-0.342,0.174-0.678,0.272-1.008,0.297\r\n\t\t\tc-1.22,0.078-2.166-0.297-2.833-1.122c-0.583-0.716-0.862-1.636-0.839-2.764c0.017-0.613,0.123-1.218,0.319-1.811\r\n\t\t\tc0.196-0.594,0.494-1.148,0.892-1.665C165.226,113.25,165.692,112.861,166.228,112.602 M167.089,113.369\r\n\t\t\tc-0.7,0.212-1.275,0.692-1.723,1.44c-0.449,0.747-0.685,1.566-0.708,2.455c-0.016,0.865,0.184,1.559,0.602,2.078\r\n\t\t\tc0.449,0.552,1.102,0.799,1.96,0.744c0.189-0.017,0.401-0.083,0.638-0.201c0.235-0.117,0.444-0.26,0.626-0.425\r\n\t\t\tc0.543-0.496,0.895-1.1,1.057-1.813c0.162-0.712,0.122-1.415-0.119-2.108c-0.241-0.69-0.651-1.263-1.233-1.711\r\n\t\t\tc-0.346-0.268-0.583-0.425-0.709-0.473c-0.087-0.022-0.185-0.034-0.295-0.034C167.152,113.345,167.121,113.361,167.089,113.369\"/>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M166.978,121.473c-1.172,0-2.109-0.422-2.783-1.257c-0.631-0.775-0.939-1.779-0.914-2.982\r\n\t\t\t\tc0.017-0.645,0.13-1.287,0.336-1.91c0.208-0.627,0.526-1.221,0.944-1.765c0.41-0.531,0.895-0.942,1.444-1.223\r\n\t\t\t\tc0.121-0.146,0.279-0.244,0.464-0.288c0.565-0.132,1.053-0.129,1.452,0.011c0.27,0.089,0.633,0.312,1.109,0.677\r\n\t\t\t\tc0.79,0.614,1.358,1.4,1.689,2.34c0.331,0.938,0.387,1.909,0.164,2.884c-0.223,0.981-0.715,1.825-1.465,2.507\r\n\t\t\t\tc-0.271,0.254-0.597,0.479-0.966,0.666c-0.381,0.192-0.764,0.304-1.137,0.331C167.199,121.469,167.087,121.473,166.978,121.473z\r\n\t\t\t\t M167.239,112.625c-0.183,0-0.391,0.028-0.616,0.08c-0.05,0.012-0.084,0.036-0.115,0.082l-0.05,0.078l-0.083,0.04\r\n\t\t\t\tc-0.485,0.235-0.916,0.595-1.279,1.064c-0.373,0.483-0.654,1.011-0.838,1.566c-0.186,0.559-0.287,1.136-0.301,1.714\r\n\t\t\t\tc-0.023,1.037,0.234,1.892,0.763,2.541c0.602,0.744,1.438,1.07,2.55,0.999c0.281-0.021,0.578-0.108,0.879-0.261\r\n\t\t\t\tc0.311-0.157,0.585-0.346,0.813-0.559c0.648-0.591,1.073-1.316,1.265-2.162c0.193-0.849,0.145-1.693-0.143-2.509\r\n\t\t\t\tc-0.287-0.815-0.78-1.499-1.464-2.03c-0.509-0.39-0.778-0.527-0.916-0.572C167.566,112.648,167.412,112.625,167.239,112.625z\r\n\t\t\t\t M166.99,120.432L166.99,120.432c-0.85,0-1.52-0.295-1.992-0.875c-0.467-0.584-0.695-1.354-0.679-2.298\r\n\t\t\t\tc0.025-0.946,0.28-1.828,0.757-2.624c0.489-0.816,1.133-1.351,1.912-1.588l0.079-0.056l0.117-0.008\r\n\t\t\t\tc0.139,0,0.268,0.017,0.383,0.048l0.03,0.01c0.11,0.043,0.301,0.138,0.796,0.521c0.632,0.487,1.085,1.115,1.347,1.868\r\n\t\t\t\tc0.259,0.749,0.302,1.521,0.128,2.292c-0.176,0.778-0.566,1.446-1.159,1.987c-0.204,0.186-0.44,0.347-0.701,0.478\r\n\t\t\t\tc-0.278,0.139-0.527,0.217-0.761,0.235C167.155,120.43,167.072,120.432,166.99,120.432z M167.182,113.693\r\n\t\t\t\tc-0.621,0.19-1.121,0.612-1.526,1.289c-0.417,0.694-0.639,1.464-0.661,2.291c-0.015,0.778,0.163,1.404,0.527,1.857\r\n\t\t\t\tc0.342,0.421,0.823,0.626,1.468,0.626l0,0c0.067,0,0.137-0.002,0.208-0.007c0.138-0.012,0.311-0.067,0.507-0.165\r\n\t\t\t\tc0.207-0.104,0.392-0.23,0.549-0.374c0.496-0.451,0.808-0.987,0.955-1.638c0.147-0.646,0.11-1.293-0.107-1.922\r\n\t\t\t\tc-0.217-0.627-0.595-1.149-1.121-1.556c-0.402-0.31-0.558-0.395-0.609-0.418c-0.031-0.007-0.067-0.013-0.105-0.017\r\n\t\t\t\tC167.239,113.675,167.21,113.686,167.182,113.693z\"/>\r\n                    </g>\r\n                    <path fill=\"#FFFFFF\" d=\"M172.421,112.602c0.079,0.604,0.128,1.298,0.148,2.077c0.019,0.779,0.021,1.384,0.006,1.813\r\n\t\t\tc-0.017,0.429-0.044,1.108-0.083,2.037c-0.008,0.141-0.065,0.262-0.171,0.36c-0.107,0.098-0.231,0.143-0.372,0.136\r\n\t\t\tc-0.142-0.008-0.261-0.065-0.36-0.172c-0.099-0.106-0.144-0.23-0.135-0.371c0.038-0.913,0.066-1.586,0.082-2.019\r\n\t\t\tc0.016-0.435,0.014-1.019-0.005-1.753c-0.02-0.736-0.069-1.393-0.148-1.967c-0.016-0.142,0.02-0.269,0.106-0.384\r\n\t\t\tc0.087-0.114,0.201-0.181,0.342-0.2c0.142-0.02,0.27,0.014,0.383,0.1C172.329,112.346,172.397,112.461,172.421,112.602\r\n\t\t\t M172.338,119.898c0.103,0.102,0.154,0.224,0.154,0.366c0,0.141-0.051,0.263-0.154,0.365c-0.102,0.102-0.224,0.153-0.365,0.153\r\n\t\t\tc-0.142,0-0.264-0.052-0.366-0.153c-0.103-0.103-0.153-0.225-0.153-0.365c0-0.143,0.05-0.265,0.153-0.366\r\n\t\t\tc0.102-0.103,0.224-0.154,0.366-0.154C172.115,119.744,172.237,119.796,172.338,119.898\"/>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M171.973,121.12c-0.231,0-0.44-0.087-0.605-0.252c-0.165-0.165-0.252-0.373-0.252-0.604\r\n\t\t\t\tc0-0.231,0.087-0.44,0.253-0.606c0.165-0.165,0.373-0.252,0.604-0.252c0.23,0,0.439,0.087,0.605,0.252\r\n\t\t\t\tc0.164,0.166,0.252,0.375,0.252,0.606c0,0.229-0.088,0.438-0.252,0.604C172.413,121.033,172.203,121.12,171.973,121.12z\r\n\t\t\t\t M171.973,120.082c-0.052,0-0.088,0.015-0.127,0.054c-0.04,0.039-0.054,0.076-0.054,0.129s0.015,0.087,0.053,0.127\r\n\t\t\t\tc0.04,0.039,0.076,0.055,0.128,0.055c0.052,0,0.088-0.016,0.127-0.055c0.039-0.039,0.055-0.077,0.055-0.127\r\n\t\t\t\tc0-0.053-0.016-0.09-0.055-0.129C172.061,120.097,172.024,120.082,171.973,120.082z M171.981,119.362\r\n\t\t\t\tc-0.017,0-0.034-0.001-0.05-0.001c-0.228-0.013-0.432-0.108-0.589-0.279c-0.161-0.173-0.238-0.388-0.225-0.62\r\n\t\t\t\tc0.039-0.907,0.066-1.579,0.082-2.012c0.016-0.422,0.014-1.005-0.006-1.732c-0.019-0.72-0.067-1.368-0.144-1.93\r\n\t\t\t\tc-0.027-0.233,0.032-0.45,0.171-0.633c0.14-0.184,0.335-0.3,0.565-0.331c0.237-0.031,0.447,0.025,0.634,0.167\r\n\t\t\t\tc0.182,0.137,0.297,0.329,0.335,0.554c0.082,0.628,0.132,1.339,0.152,2.126c0.019,0.781,0.022,1.397,0.005,1.832\r\n\t\t\t\tc-0.016,0.43-0.043,1.11-0.082,2.039c-0.014,0.232-0.109,0.437-0.28,0.594C172.391,119.283,172.194,119.362,171.981,119.362z\r\n\t\t\t\t M171.908,112.49c-0.009,0-0.02,0.001-0.03,0.002c-0.053,0.009-0.087,0.028-0.12,0.07c-0.035,0.046-0.046,0.087-0.04,0.143\r\n\t\t\t\tc0.08,0.577,0.13,1.251,0.149,1.995c0.02,0.741,0.022,1.339,0.006,1.774c-0.016,0.434-0.044,1.107-0.083,2.021\r\n\t\t\t\tc-0.002,0.054,0.01,0.089,0.046,0.127c0.039,0.043,0.078,0.062,0.131,0.063l0.014,0.002c0.031,0,0.066-0.007,0.11-0.048\r\n\t\t\t\tc0.043-0.039,0.061-0.077,0.064-0.132c0.039-0.923,0.066-1.601,0.082-2.029c0.016-0.42,0.014-1.024-0.005-1.792\r\n\t\t\t\tc-0.02-0.763-0.068-1.45-0.145-2.042c-0.008-0.045-0.03-0.083-0.077-0.117C171.977,112.502,171.947,112.49,171.908,112.49z\"/>\r\n                    </g>\r\n                </g>\r\n            </g>\r\n        </svg>\r\n\r\n\r\n        <svg class='endScreen' style=\"display:none;\">\r\n            <g id=\"Layer_2\">\r\n            </g>\r\n            <g id=\"Layer_1\">\r\n                <path fill=\"#9DC44D\" d=\"M190.001,97.03c0,13.93-11.292,25.222-25.222,25.222s-25.222-11.292-25.222-25.222\r\n\t\tc0-13.929,11.292-25.222,25.222-25.222S190.001,83.101,190.001,97.03\"/>\r\n                <path fill=\"#303D8A\" d=\"M158.854,83.181l-5.227,2.95c-1.371,0.813-1.649,2.648,1.278,3.972c2.927,1.324,6.597,0.976,6.597,0.976\r\n\t\tl1.045-8.061L158.854,83.181z\"/>\r\n                <path fill=\"#74A636\" d=\"M190.001,97.03c0-0.243-0.012-0.483-0.019-0.724L168.87,74.022v0.263l0.524,47.538\r\n\t\tC181.119,119.654,190.001,109.383,190.001,97.03z\"/>\r\n                <path fill=\"#F3D332\" d=\"M182.57,105.68c-1.62-1.839-6.855-1.432-7.303-2.942l-5.486-23.945c-0.816-3.841-8.27-3.841-9.167,0\r\n\t\tl-5.487,23.945c-0.322,0.992-1.247,1.664-2.29,1.664l-3.72-0.375c-2.333,0-4.378,5.418-2.491,6.789l-0.004,3.711\r\n\t\tc4.588,4.759,11.024,7.725,18.156,7.725c8.926,0,16.763-4.641,21.246-11.638L182.57,105.68z\"/>\r\n                <path fill=\"#457AB9\" d=\"M164.779,122.252c0.311,0,0.62-0.012,0.928-0.023l-0.51-12.167l-11.198-0.096\r\n\t\tc-0.589-0.005-1.039,0.516-0.96,1.1c0.308,2.283,0.249,5.621,0.117,8.347C156.635,121.223,160.586,122.252,164.779,122.252z\"/>\r\n                <path fill=\"#457AB9\" d=\"M164.779,122.252c4.525,0,8.768-1.198,12.44-3.284c-0.116-2.638-0.154-5.743,0.137-7.903\r\n\t\tc0.079-0.584-0.371-1.104-0.96-1.1l-11.199,0.096l-0.511,12.188C164.717,122.25,164.748,122.252,164.779,122.252z\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M159.028,88.22h-1.169c-0.612,0-1.109-0.497-1.109-1.109s0.497-1.109,1.109-1.109h1.169\"/>\r\n                <path fill=\"#CDB42C\" d=\"M157.732,87.431c0-0.396,0.45-0.716,1.004-0.716c0.377,0,0.705,0.148,0.876,0.367\r\n\t\tc-0.021-0.448-0.536-0.807-1.169-0.807c-0.647,0-1.171,0.374-1.171,0.835c0,0.332,0.272,0.618,0.665,0.752\r\n\t\tC157.809,87.743,157.732,87.594,157.732,87.431\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M171.353,88.22h1.169c0.613,0,1.109-0.497,1.109-1.109s-0.497-1.109-1.109-1.109h-1.169\"/>\r\n                <path fill=\"#CDB42C\" d=\"M172.648,87.431c0-0.396-0.449-0.716-1.003-0.716c-0.377,0-0.705,0.148-0.877,0.367\r\n\t\tc0.021-0.448,0.536-0.807,1.169-0.807c0.647,0,1.171,0.374,1.171,0.835c0,0.332-0.272,0.618-0.665,0.752\r\n\t\tC172.571,87.743,172.648,87.594,172.648,87.431\"/>\r\n                <path fill=\"#F3D332\" d=\"M153.871,115.774c-0.013-1.562-0.089-2.859-0.226-3.856c-0.008-0.056-0.011-0.111-0.011-0.166\r\n\t\tc0-0.591,0.438-1.096,1.021-1.175l0.067,0.495c-0.336,0.045-0.589,0.338-0.589,0.679c0,0.033,0.002,0.066,0.007,0.099\r\n\t\tc0.14,1.018,0.217,2.337,0.23,3.92L153.871,115.774z\"/>\r\n                <path fill=\"#F3D332\" d=\"M175.987,111.192c-0.115-0.083-0.251-0.126-0.395-0.126c0,0-0.001,0-0.002,0h-4.791v-0.5h4.791\r\n\t\tc0.236,0.026,0.487,0.075,0.689,0.221L175.987,111.192z\"/>\r\n                <rect x=\"160.06\" y=\"110.566\" fill=\"#F3D332\" width=\"5.37\" height=\"0.5\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M165.425,89.905c0.179,1.559-0.964,2.891-2.554,2.973c-1.589,0.083-3.022-1.113-3.201-2.673\r\n\t\tc-0.179-1.559,0.964-2.891,2.554-2.973C163.813,87.149,165.246,88.346,165.425,89.905\"/>\r\n                <path fill=\"#232951\" d=\"M160.246,87.256c0,0,0.035-0.063,0.107-0.173c0.036-0.056,0.084-0.12,0.141-0.191\r\n\t\tc0.06-0.07,0.128-0.149,0.21-0.229c0.165-0.158,0.38-0.33,0.648-0.455c0.264-0.132,0.581-0.213,0.898-0.234\r\n\t\tc0.067-0.009,0.163-0.006,0.243-0.009c0.081,0.002,0.161,0.002,0.241,0.01c0.16,0.01,0.316,0.04,0.461,0.088\r\n\t\tc0.289,0.099,0.525,0.264,0.699,0.426c0.087,0.081,0.159,0.164,0.219,0.239c0.059,0.076,0.104,0.146,0.139,0.206\r\n\t\tc0.035,0.059,0.057,0.11,0.072,0.144c0.015,0.034,0.022,0.053,0.022,0.053l-0.042,0.04c0,0-0.075-0.03-0.193-0.085\r\n\t\tc-0.12-0.054-0.282-0.133-0.474-0.213c-0.095-0.042-0.197-0.082-0.304-0.125c-0.108-0.038-0.218-0.083-0.334-0.12\r\n\t\tc-0.114-0.043-0.233-0.087-0.357-0.123c-0.062-0.02-0.125-0.033-0.19-0.047c-0.065-0.01-0.117-0.021-0.195-0.024\r\n\t\tc-0.269-0.019-0.536,0.017-0.782,0.089c-0.124,0.035-0.238,0.083-0.347,0.134c-0.109,0.049-0.206,0.109-0.295,0.166\r\n\t\tc-0.088,0.059-0.166,0.118-0.234,0.174c-0.065,0.057-0.123,0.108-0.167,0.151c-0.092,0.087-0.141,0.144-0.141,0.144L160.246,87.256\r\n\t\tz\"/>\r\n                <path fill=\"#232951\" d=\"M170.104,87.291c0,0-0.05-0.056-0.141-0.144c-0.045-0.043-0.103-0.094-0.168-0.151\r\n\t\tc-0.067-0.056-0.145-0.115-0.233-0.174c-0.089-0.057-0.187-0.117-0.295-0.166c-0.108-0.05-0.224-0.099-0.347-0.134\r\n\t\tc-0.246-0.072-0.513-0.107-0.782-0.088c-0.079,0.003-0.13,0.014-0.195,0.024c-0.065,0.014-0.129,0.027-0.191,0.047\r\n\t\tc-0.125,0.037-0.243,0.08-0.357,0.123c-0.116,0.038-0.226,0.083-0.334,0.12c-0.106,0.042-0.209,0.083-0.304,0.125\r\n\t\tc-0.191,0.08-0.354,0.159-0.474,0.213c-0.118,0.055-0.193,0.085-0.193,0.085l-0.041-0.04c0,0,0.008-0.019,0.022-0.053\r\n\t\tc0.015-0.034,0.037-0.084,0.072-0.144c0.034-0.06,0.08-0.13,0.139-0.206c0.06-0.075,0.131-0.158,0.218-0.239\r\n\t\tc0.173-0.163,0.41-0.327,0.699-0.426c0.145-0.048,0.301-0.078,0.461-0.088c0.08-0.007,0.161-0.007,0.241-0.009\r\n\t\tc0.081,0.003,0.175,0,0.243,0.009c0.317,0.021,0.634,0.102,0.897,0.234c0.268,0.125,0.483,0.296,0.648,0.455\r\n\t\tc0.083,0.08,0.151,0.158,0.21,0.229c0.057,0.072,0.105,0.136,0.141,0.191c0.073,0.109,0.108,0.173,0.108,0.173L170.104,87.291z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M164.97,89.905c-0.179,1.559,0.965,2.891,2.554,2.973c1.589,0.083,3.023-1.113,3.202-2.673\r\n\t\tc0.179-1.559-0.965-2.891-2.554-2.973C166.582,87.149,165.149,88.346,164.97,89.905\"/>\r\n                <path fill=\"#232951\" d=\"M164.479,89.83c0,0.779-0.631,1.41-1.41,1.41c-0.779,0-1.41-0.631-1.41-1.41c0-0.778,0.631-1.41,1.41-1.41\r\n\t\tC163.848,88.42,164.479,89.051,164.479,89.83\"/>\r\n                <path fill=\"#232951\" d=\"M168.814,89.83c0,0.779-0.631,1.41-1.41,1.41s-1.41-0.631-1.41-1.41c0-0.778,0.631-1.41,1.41-1.41\r\n\t\tS168.814,89.051,168.814,89.83\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M169.308,96.033c-4.194,5.393-8.353,0.141-8.353,0.141C162.362,96.508,167.347,96.835,169.308,96.033\"/>\r\n                <path fill=\"#D27C1D\" d=\"M170.614,95.597l-0.753,0.879l-0.202,0.236l-0.23,0.254c-0.154,0.161-0.311,0.32-0.477,0.472\r\n\t\tc-0.167,0.151-0.337,0.299-0.52,0.437c-0.179,0.14-0.37,0.269-0.565,0.391c-0.394,0.241-0.823,0.439-1.277,0.572\r\n\t\tc-0.454,0.13-0.932,0.194-1.403,0.177c-0.472-0.017-0.934-0.108-1.367-0.257c-0.434-0.147-0.84-0.35-1.216-0.585\r\n\t\tc-0.377-0.236-0.726-0.504-1.049-0.796c-0.162-0.146-0.318-0.298-0.468-0.457c-0.151-0.161-0.289-0.315-0.436-0.505l-0.721-0.933\r\n\t\tl1.115,0.315c0.309,0.087,0.651,0.152,0.99,0.21c0.34,0.057,0.685,0.106,1.03,0.148c0.69,0.084,1.386,0.146,2.083,0.183\r\n\t\tc0.697,0.036,1.396,0.049,2.094,0.018c0.349-0.017,0.697-0.043,1.043-0.091c0.173-0.024,0.346-0.052,0.516-0.091\r\n\t\tc0.172-0.035,0.34-0.084,0.506-0.14L170.614,95.597z M168.092,96.397c-0.276,0.058-0.553,0.112-0.833,0.151\r\n\t\tc-0.701,0.097-1.407,0.149-2.114,0.177c-0.708,0.029-1.416,0.03-2.125,0.009c-0.355-0.011-0.71-0.028-1.067-0.055\r\n\t\tc-0.358-0.028-0.711-0.06-1.088-0.129l0.394-0.618c0.116,0.13,0.262,0.277,0.403,0.408c0.144,0.133,0.292,0.261,0.446,0.382\r\n\t\tc0.307,0.243,0.631,0.459,0.968,0.641c0.337,0.181,0.688,0.327,1.044,0.422c0.356,0.096,0.718,0.142,1.073,0.131\r\n\t\tc0.712-0.021,1.392-0.28,1.987-0.705c0.149-0.107,0.294-0.219,0.434-0.343c0.141-0.121,0.274-0.254,0.405-0.389\r\n\t\tC168.044,96.454,168.067,96.424,168.092,96.397\"/>\r\n                <path fill=\"#274571\" d=\"M150.944,104.632c0.25-0.75,1.75-0.713,2.168-0.165c0.59,0.774,3.167,5.524,3.657,7.845\r\n\t\tc0.379,1.8-1.895,2.007-2.146,0.146C154.403,110.834,151.917,105.809,150.944,104.632\"/>\r\n                <path fill=\"#457AB9\" d=\"M150.546,104.435c0.238-0.753,1.997-0.751,2.424-0.209c0.602,0.765,3.252,5.474,3.777,7.788\r\n\t\tc0.407,1.794-1.683,1.999-2.144,0.179C154.202,110.608,151.538,105.597,150.546,104.435\"/>\r\n                <path fill=\"#F3D332\" d=\"M156.595,112.285c0,0.441-0.357,0.798-0.798,0.798c-0.44,0-0.798-0.357-0.798-0.798\r\n\t\tc0-0.44,0.357-0.798,0.798-0.798C156.237,111.487,156.595,111.845,156.595,112.285\"/>\r\n                <path fill=\"#274571\" d=\"M179.45,104.632c-0.25-0.75-1.75-0.713-2.167-0.165c-0.59,0.774-3.167,5.524-3.657,7.845\r\n\t\tc-0.379,1.8,1.895,2.007,2.146,0.146C175.992,110.834,178.478,105.809,179.45,104.632\"/>\r\n                <path fill=\"#457AB9\" d=\"M179.848,104.435c-0.238-0.753-1.997-0.751-2.423-0.209c-0.602,0.765-3.252,5.474-3.777,7.788\r\n\t\tc-0.407,1.794,1.683,1.999,2.144,0.179C176.193,110.608,178.857,105.597,179.848,104.435\"/>\r\n                <path fill=\"#F3D332\" d=\"M173.8,112.285c0,0.441,0.357,0.798,0.798,0.798s0.798-0.357,0.798-0.798c0-0.44-0.357-0.798-0.798-0.798\r\n\t\tS173.8,111.845,173.8,112.285\"/>\r\n                <path fill=\"#457AB9\" d=\"M166.654,73.645h-3.01c-2.873,0-5.202,2.329-5.202,5.202v4.355c0,0.252,0.205,0.458,0.458,0.458h12.499\r\n\t\tc0.253,0,0.458-0.205,0.458-0.458v-4.355C171.856,75.974,169.527,73.645,166.654,73.645\"/>\r\n                <path fill=\"#232951\" d=\"M151.262,117.021c0.895,2.296,0.772,4.488-0.273,4.896c-1.046,0.408-2.619-1.123-3.514-3.419\r\n\t\ts-0.773-4.488,0.273-4.896S150.367,114.726,151.262,117.021\"/>\r\n                <path fill=\"#F3D332\" d=\"M164.27,121.759c0,1.99-1.613,3.603-3.603,3.603s-3.603-1.613-3.603-3.603s1.613-3.603,3.603-3.603\r\n\t\tS164.27,119.77,164.27,121.759\"/>\r\n                <svg class=\"button playAgain\">\r\n                    <path fill=\"white\" class='background' d=\"M160.788,186.008c1.998,0,2.738,0.238,3.337,0.653c0.17,0.118,0.657,0.572,1.631,1.48\r\n\t\tc1,0.932,1.192,1.139,1.631,1.279c0.08,0.026,1.156,0.353,2.007-0.226c0.328-0.222,0.777-0.685,1.004-2.208\r\n\t\tc0.384-2.579-0.396-4.687-0.552-5.094c-0.222-0.578-1.723-4.495-3.689-4.441c-0.483,0.013-1.134,0.27-1.606,0.552\r\n\t\tc-0.61,0.366-0.779,0.691-1.204,1.029c-0.457,0.363-1.437,0.753-2.56,0.753s-2.104-0.39-2.56-0.753\r\n\t\tc-0.425-0.337-0.594-0.663-1.205-1.029c-0.471-0.282-1.123-0.539-1.605-0.552c-1.967-0.054-3.468,3.863-3.689,4.441\r\n\t\tc-0.156,0.407-0.936,2.515-0.552,5.094c0.226,1.523,0.676,1.986,1.003,2.208c0.852,0.579,1.928,0.251,2.007,0.226\r\n\t\tc0.439-0.14,0.632-0.347,1.631-1.279c0.974-0.909,1.46-1.363,1.631-1.48C158.05,186.246,158.79,186.008,160.788,186.008\"/>\r\n                    <g>\r\n                        <path fill=\"#1D2A48\" d=\"M154.183,185.667c-0.283,0-0.513-0.229-0.513-0.513v-3.062c0-0.283,0.229-0.513,0.513-0.513\r\n\t\t\ts0.513,0.229,0.513,0.513v3.062C154.696,185.437,154.466,185.667,154.183,185.667z\"/>\r\n                    </g>\r\n                    <g>\r\n                        <path fill=\"#1D2A48\" d=\"M155.714,184.136h-3.062c-0.283,0-0.513-0.229-0.513-0.513s0.229-0.513,0.513-0.513h3.062\r\n\t\t\tc0.283,0,0.513,0.229,0.513,0.513S155.997,184.136,155.714,184.136z\"/>\r\n                    </g>\r\n                    <g>\r\n                        <path fill=\"#1D2A48\" d=\"M162.153,184.122h-2.9c-0.275,0-0.499-0.224-0.499-0.499c0-0.276,0.224-0.499,0.499-0.499h2.9\r\n\t\t\tc0.276,0,0.499,0.223,0.499,0.499C162.652,183.898,162.429,184.122,162.153,184.122z\"/>\r\n                    </g>\r\n                    <path fill=\"#1D2A48\" d=\"M168.549,182.595c0,0.356-0.289,0.645-0.645,0.645s-0.645-0.289-0.645-0.645s0.289-0.645,0.645-0.645\r\n\t\tS168.549,182.239,168.549,182.595\"/>\r\n                    <path fill=\"#1D2A48\" d=\"M166.924,182.595c0,0.356-0.289,0.645-0.645,0.645s-0.645-0.289-0.645-0.645s0.289-0.645,0.645-0.645\r\n\t\tS166.924,182.239,166.924,182.595\"/>\r\n                    <path fill=\"#1D2A48\" d=\"M169.029,184.651c0,0.356-0.289,0.645-0.645,0.645c-0.356,0-0.645-0.289-0.645-0.645\r\n\t\ts0.288-0.645,0.645-0.645C168.741,184.006,169.029,184.295,169.029,184.651\"/>\r\n                    <path fill=\"#1D2A48\" d=\"M167.404,184.651c0,0.356-0.289,0.645-0.645,0.645s-0.645-0.289-0.645-0.645s0.289-0.645,0.645-0.645\r\n\t\tS167.404,184.295,167.404,184.651\"/>\r\n                </svg>\r\n                <svg class=\"button sendScore\">\r\n                \t<path fill=\"white\" d=\"M15.2,1.4l-1.1-1.1C13.9,0.1,13.6,0,13.4,0h-1.1v5.8c0,0.2-0.2,0.4-0.4,0.4H3.6c-0.2,0-0.4-0.2-0.4-0.4V0H0.4\r\n\t\t\t\t\t\tC0.2,0,0,0.2,0,0.4v14.6c0,0.2,0.2,0.4,0.4,0.4h14.6c0.2,0,0.4-0.2,0.4-0.4v-13C15.5,1.9,15.3,1.5,15.2,1.4z M13.4,13.2\r\n\t\t\t\t\t\tc0,0.2-0.2,0.4-0.4,0.4H2.5c-0.2,0-0.4-0.2-0.4-0.4V10c0-0.2,0.2-0.4,0.4-0.4H13c0.2,0,0.4,0.2,0.4,0.4V13.2z\"/>\r\n\t\t\t\t\t<path fill=\"white\" d=\"M9.3,5h1.3C10.8,5,11,4.8,11,4.5V1.2c0-0.2-0.2-0.4-0.4-0.4H9.3C9.1,0.8,8.9,1,8.9,1.2v3.3\r\n\t\t\t\t\t\tC8.9,4.8,9.1,5,9.3,5z\"/>\r\n                </svg>\r\n                <path fill=\"#F3D332\" d=\"M176.031,116.223v0.07c0,1.003,0.026,2.104,0.073,3.272c0.164-0.083,0.329-0.165,0.491-0.251\r\n\t\tc-0.041-1.075-0.064-2.091-0.064-3.021v-0.07H176.031z\"/>\r\n                <path fill=\"#F3D332\" d=\"M148.945,104.097c-2.147,0.237-4.76,2.275-6.078,5.418c2.007,3.516,4.834,6.5,8.223,8.695\r\n\t\tc0.126-1.582,0.101-3.268-0.069-4.802C150.439,108.139,151.962,103.763,148.945,104.097z\"/>\r\n                <path fill=\"#232951\" d=\"M158.573,113.25l-0.146,0.034c-2.028,0.47-3.611-0.895-4.081-2.923l-3.173-11.69\r\n\t\tc-0.47-2.028,0.793-4.052,2.82-4.521l0.146-0.034c2.027-0.47,4.052,0.793,4.521,2.821l2.23,11.909\r\n\t\tC161.361,110.872,160.601,112.78,158.573,113.25\"/>\r\n                <path fill=\"#F3D332\" d=\"M158.317,112.478L158.317,112.478c-1.824,0.422-3.646-0.713-4.068-2.538l-2.538-10.952\r\n\t\tc-0.422-1.824,0.713-3.646,2.538-4.068c1.824-0.423,3.646,0.713,4.068,2.538l2.537,10.951\r\n\t\tC161.278,110.233,160.142,112.055,158.317,112.478\"/>\r\n                <path fill=\"#232951\" d=\"M156.051,106.463c3.809,0,3.514,2.193,3.708,5.933l0.71,6.255c0.197,3.764,2.434,6.789-1.002,7.585\r\n\t\tl-2.189,0.507c-3.437,0.796-6.086-2.567-7.664-5.986l-2.543-6.227c-1.234-3.303,1.627-8.015,5.155-8.058L156.051,106.463z\"/>\r\n                <path fill=\"#232951\" d=\"M150.961,117.021c0.895,2.296,0.772,4.488-0.273,4.896c-1.046,0.408-2.619-1.123-3.514-3.419\r\n\t\ts-0.773-4.488,0.273-4.896S150.066,114.726,150.961,117.021\"/>\r\n                <path fill=\"#F3D332\" d=\"M151.627,116.861c0.895,2.296,0.772,4.487-0.273,4.895c-1.046,0.408-2.619-1.123-3.514-3.419\r\n\t\ts-0.773-4.487,0.273-4.895S150.732,114.565,151.627,116.861\"/>\r\n                <path fill=\"#232951\" d=\"M163.965,110.376c0,1.99-1.613,3.603-3.603,3.603s-3.603-1.613-3.603-3.603s1.613-3.603,3.603-3.603\r\n\t\tS163.965,108.386,163.965,110.376\"/>\r\n                <path fill=\"#F3D332\" d=\"M160.07,126.236l-2.189,0.507c-3.437,0.796-6.086-2.567-7.664-5.986l-2.542-6.227\r\n\t\tc-1.234-3.303,1.894-7.578,4.781-7.664l4.003-0.394c2.888-0.01,5.072,0.82,6.319,2.139c0.689,0.729-1.893,3.551-1.833,4.693\r\n\t\tl-0.172,5.346c0.08,1.53,3.562,2.694,3.287,3.967C163.664,124.441,162.109,125.764,160.07,126.236\"/>\r\n                <path fill=\"#F3D332\" d=\"M163.664,110.979c0,1.99-1.613,3.603-3.603,3.603s-3.603-1.613-3.603-3.603s1.613-3.603,3.603-3.603\r\n\t\tS163.664,108.989,163.664,110.979\"/>\r\n                <path fill=\"#F3D332\" d=\"M165.133,116.908c0,1.99-1.613,3.603-3.603,3.603s-3.603-1.613-3.603-3.603s1.613-3.603,3.603-3.603\r\n\t\tS165.133,114.918,165.133,116.908\"/>\r\n            </g>\r\n        </svg>\r\n    </svg>"

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(139);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(195)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./linguago.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./linguago.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = [[{"id":"boite_8_","rect":{"x":"6.95","y":"16.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.123","height":"0.874"}},{"id":"boite_1_","rect":{"x":"3.1","y":"4.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.191","height":"0.875"}},{"id":"boite_2_","rect":{"x":"11","y":"2.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10.011","height":"0.875"}},{"id":"boite_12_","rect":{"x":"28.95","y":"8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1.001","height":"9.006"}},{"id":"boite_4_","rect":{"x":"2","y":"7","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1.001","height":"11.025"}},{"id":"boite_3_","rect":{"x":"21.45","y":"3.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.19","height":"0.874"}},{"id":"boite_6_","rect":{"x":"7","y":"8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.123","height":"0.874"}},{"id":"boite_7_","rect":{"x":"14.2","y":"9.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1.003","height":"7.022"}},{"id":"boite_5_","rect":{"x":"5.85","y":"9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"0.999","height":"6.994"}},{"id":"boite_11_","rect":{"x":"19.9","y":"14.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.04","height":"1.187"}},{"id":"boite_9_","rect":{"x":"18.9","y":"9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.935"}},{"id":"boite_10_","rect":{"x":"19.9","y":"8.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.048","height":"0.999"}},{"id":"boite","rect":{"x":"24.95","y":"8.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"0.998","height":"4.946"}},{"id":"badGuy","rect":{"x":"30","y":"18","width":"1","height":"1"}}],[{"id":"Layer_18","rect":{"x":"30.95","y":"2.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"11.05"}},{"id":"Layer_17","rect":{"x":"22.1","y":"10.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"Layer_16","rect":{"x":"20.95","y":"2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"Layer_15","rect":{"x":"21.85","y":"18.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.851"}},{"id":"Layer_14","rect":{"x":"12.1","y":"6.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7","height":"1"}},{"id":"Layer_13","rect":{"x":"11.9","y":"2.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"Layer_12","rect":{"x":"1.85","y":"2.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"Layer_11","rect":{"x":"0.95","y":"6.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"Layer_10","rect":{"x":"11.85","y":"13.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.851"}},{"id":"Layer_9","rect":{"x":"10.9","y":"7.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"Layer_8","rect":{"x":"19.05","y":"7.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"Layer_7","rect":{"x":"2.95","y":"9.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"Layer_6","rect":{"x":"1.05","y":"17.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"Layer_5","rect":{"x":"12.95","y":"17.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.199"}},{"id":"badGuy","rect":{"x":"27","y":"15","fill-rule":"evenodd","clip-rule":"evenodd","width":"1.05","height":"1"}}],[{"id":"boite","rect":{"x":"21.05","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_1_","rect":{"x":"22.25","y":"11.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"10.65","height":"1.2"}},{"id":"boite_2_","rect":{"x":"24.25","y":"13.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.7","height":"1.2"}},{"id":"boite_3_","rect":{"x":"23.2","y":"14.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_4_","rect":{"x":"24.2","y":"17.45","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.899","height":"1"}},{"id":"boite_5_","rect":{"x":"29.95","y":"14.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_6_","rect":{"x":"21.05","y":"1.8","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_7_","rect":{"x":"22.05","y":"9","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9.7","height":"1.2"}},{"id":"boite_8_","rect":{"x":"25","y":"3","width":"5.7","height":"1.2"}},{"id":"boite_9_","rect":{"x":"23.95","y":"3.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_10_","rect":{"x":"24.95","y":"7.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.899","height":"1"}},{"id":"boite_11_","rect":{"x":"30.9","y":"4.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_12_","rect":{"x":"22.25","y":"0.8","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9.7","height":"1.2"}},{"id":"boite_13_","rect":{"x":"9.1","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_14_","rect":{"x":"2","y":"11","-fill":"#FF0000","width":"6.8","height":"1.2"}},{"id":"boite_15_","rect":{"x":"4","y":"13","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"3.05","height":"1.2"}},{"id":"boite_16_","rect":{"x":"3.1","y":"14.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"3.8"}},{"id":"boite_17_","rect":{"x":"4.25","y":"18.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.65","height":"1"}},{"id":"boite_18_","rect":{"x":"7","y":"14.3","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.8"}},{"id":"boite_19_","rect":{"x":"1.15","y":"1.8","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_20_","rect":{"x":"-0.35","y":"9.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"10.2","height":"1.2"}},{"id":"boite_21_","rect":{"x":"4.1","y":"2.9","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.7","height":"1.2"}},{"id":"boite_22_","rect":{"x":"3.05","y":"4","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_23_","rect":{"x":"4.05","y":"7.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.9","height":"1"}},{"id":"boite_24_","rect":{"x":"9.8","y":"3.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_25_","rect":{"x":"2.35","y":"0.8","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"16.55","height":"1.2"}},{"id":"boite_26_","rect":{"x":"1.1","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_27_","rect":{"x":"19.05","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"8.05"}},{"id":"boite_28_","rect":{"x":"12.05","y":"10.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"6.8","height":"1.2"}},{"id":"boite_29_","rect":{"x":"14.5","y":"13.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.55","height":"1.2"}},{"id":"boite_30_","rect":{"x":"13.45","y":"14.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_31_","rect":{"x":"14.45","y":"17.45","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.649","height":"1"}},{"id":"boite_32_","rect":{"x":"17.15","y":"14.3","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_33_","rect":{"x":"11.25","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_34_","rect":{"x":"19.1","y":"0.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"10.1"}},{"id":"boite_35_","rect":{"x":"17.15","y":"3.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_36_","rect":{"x":"13.95","y":"3.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"badGuy","rect":{"x":"3","y":"12","width":"1","height":"1"}},{"id":"badGuy","rect":{"x":"23","y":"3","width":"1","height":"1"}},{"id":"badGuy","rect":{"x":"22","y":"12","width":"1","height":"1"}}],[{"rect":{"x":"26.85","y":"17.05","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"1.05","height":"1.05"},"id":"badGuy"},{"rect":{"x":"4.1","y":"17.05","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"1.05","height":"1.05"},"id":"badGuy"},{"rect":{"x":"13","y":"8.85","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"0.996","height":"3.23"},"id":"boite"},{"rect":{"x":"13.95","y":"7.9","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1.991","height":"1.17"},"id":"boite_7_"},{"rect":{"x":"15.85","y":"8.85","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"0.996","height":"2.173"},"id":"boite_8_"},{"rect":{"x":"14.2","y":"11.95","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"5","height":"1"},"id":"boite_10_"},{"rect":{"x":"26.85","y":"2","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"1.05","height":"1.05"},"id":"badGuy_2_"},{"rect":{"x":"19","y":"7.05","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"0.995","height":"4.845"},"id":"boite_6_"}],[{"id":"boite","rect":{"x":"8.75","y":"17.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"14.5","height":"0.851"}},{"id":"boite_1_","rect":{"x":"21.25","y":"5.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_2_","rect":{"x":"12","y":"4.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9.45","height":"0.85"}},{"id":"boite_3_","rect":{"x":"11.1","y":"6.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_4_","rect":{"x":"12","y":"14.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9.45","height":"0.85"}},{"id":"boite_5_","rect":{"x":"10","y":"2.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"13.05","height":"0.85"}},{"id":"boite_6_","rect":{"x":"8.95","y":"2.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"13.149"}},{"id":"boite_7_","rect":{"x":"23","y":"4.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"13.15"}},{"id":"boite_8_","rect":{"x":"7","y":"2.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"17.15"}},{"id":"boite_9_","rect":{"x":"8.15","y":"19","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"15.85","height":"1.1"}},{"id":"boite_10_","rect":{"x":"25.05","y":"1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"17.15"}},{"id":"boite_11_","rect":{"x":"9.15","y":"0.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"15.85","height":"0.85"}},{"id":"boite_12_","rect":{"x":"14.35","y":"6","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.1","height":"1.2"}},{"id":"boite_13_","rect":{"x":"13","y":"7.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.85"}},{"id":"badGuy","rect":{"x":"29.1","y":"14","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.9","height":"1"}},{"id":"boite_14_","rect":{"x":"19.1","y":"8.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.7"}},{"id":"boite_15_","rect":{"x":"14.2","y":"12.85","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.1","height":"1.2"}},{"id":"badGuy_1_","rect":{"x":"2","y":"13.1","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.9","height":"1"}}],[{"id":"boite","rect":{"x":"12.15","y":"3.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"5","y":"11.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.1","height":"0.85"}},{"id":"boite_2_","rect":{"x":"9.9","y":"11.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.3","height":"0.851"}},{"id":"boite_3_","rect":{"x":"22.05","y":"10.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.95","height":"0.85"}},{"id":"boite_4_","rect":{"x":"5","y":"17","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"4.9","height":"0.85"}},{"id":"boite_5_","rect":{"x":"12","y":"14.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_6_","rect":{"x":"17.95","y":"8.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.149","height":"0.85"}},{"id":"boite_7_","rect":{"x":"12","y":"13.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"0.85"}},{"id":"boite_8_","rect":{"x":"12","y":"16","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_9_","rect":{"x":"12","y":"11.85","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.851"}},{"id":"boite_10_","rect":{"x":"11.05","y":"6","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"1.9"}},{"id":"boite_11_","rect":{"x":"11.05","y":"5.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_12_","rect":{"x":"11.05","y":"4.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_13_","rect":{"x":"19.05","y":"4.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_14_","rect":{"x":"19.05","y":"5.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_15_","rect":{"x":"19.05","y":"6.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_16_","rect":{"x":"24.9","y":"10.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.3","height":"0.85"}},{"id":"boite_17_","rect":{"x":"26.25","y":"17","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_18_","rect":{"x":"25.05","y":"17.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.851"}},{"id":"boite_19_","rect":{"x":"22.2","y":"17.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.899","height":"0.851"}},{"id":"boite_20_","rect":{"x":"10","y":"17","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.1","height":"0.85"}},{"id":"boite_21_","rect":{"x":"12","y":"12.9","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_22_","rect":{"x":"11.9","y":"8.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"3.3","height":"0.85"}},{"id":"boite_23_","rect":{"x":"14.9","y":"8.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"3.3","height":"0.85"}},{"id":"boite_24_","rect":{"x":"20.85","y":"15.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_25_","rect":{"x":"20.95","y":"14.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"0.85"}},{"id":"boite_26_","rect":{"x":"20.9","y":"16.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.149","height":"0.85"}},{"id":"boite_27_","rect":{"x":"20.85","y":"12.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.851"}},{"id":"boite_28_","rect":{"x":"20.9","y":"13.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.149","height":"0.85"}},{"id":"boite_29_","rect":{"x":"20.9","y":"11.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.149","height":"0.851"}},{"id":"boite_30_","rect":{"x":"19.05","y":"7.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"badGuy","rect":{"x":"29.95","y":"17.95","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.899","height":"0.899"}},{"id":"boite_31_","rect":{"x":"27.1","y":"11.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_32_","rect":{"x":"3.9","y":"12","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.95"}},{"id":"badGuy_1_","rect":{"x":"3","y":"18.25","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.9","height":"0.9"}}],[{"rect":{"x":"4.4","y":"11.85","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"7.1","height":"0.851"},"id":"boite"},{"rect":{"x":"20.85","y":"12.8","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"8.2","height":"0.851"},"id":"boite_1_"},{"rect":{"x":"4.15","y":"3","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"9","height":"0.85"},"id":"boite_2_"},{"rect":{"x":"4.2","y":"16.05","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"24.649","height":"0.851"},"id":"boite_3_"},{"rect":{"x":"20","y":"5.75","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"7"},"id":"boite_4_"},{"rect":{"x":"3.2","y":"4","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"7.95"},"id":"boite_5_"},{"rect":{"x":"29.05","y":"3.8","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"9"},"id":"boite_6_"},{"rect":{"x":"13.2","y":"3.9","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"10"},"id":"boite_7_"},{"rect":{"x":"17.95","y":"3.75","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"11.05"},"id":"boite_8_"},{"rect":{"x":"18.9","y":"2.9","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"10","height":"0.85"},"id":"boite_9_"},{"rect":{"x":"12.25","y":"17.85","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"9","height":"0.851"},"id":"boite_10_"},{"rect":{"x":"20.05","y":"17","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"7.101","height":"0.85"},"id":"boite_11_"},{"rect":{"x":"1.1","y":"1.05","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"8.2","height":"0.85"},"id":"boite_12_"},{"rect":{"x":"23.65","y":"1.1","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"8.199","height":"0.85"},"id":"boite_13_"},{"rect":{"x":"24","y":"8","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"0.9","height":"0.9"},"id":"badGuy"},{"rect":{"x":"11.45","y":"5.9","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"5.95"},"id":"boite_14_"},{"rect":{"x":"5.45","y":"5.95","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"4.95"},"id":"boite_15_"},{"rect":{"x":"27.1","y":"6","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"4.95"},"id":"boite_16_"},{"rect":{"x":"6.4","y":"4.65","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"5.05","height":"1.2"},"id":"boite_17_"},{"rect":{"x":"7.35","y":"16.8","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"6","height":"1.15"},"id":"boite_18_"},{"rect":{"x":"21.15","y":"4.6","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"6","height":"1.2"},"id":"boite_19_"},{"rect":{"x":"8","y":"8.1","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"0.9","height":"0.9"},"id":"badGuy_1_"},{"rect":{"x":"14.4","y":"18.65","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"5.05","height":"1.199"},"id":"boite_20_"}],[{"id":"boite","rect":{"x":"23.9","y":"9.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"2","y":"18.35","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9","height":"0.851"}},{"id":"boite_2_","rect":{"x":"1.15","y":"1.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_3_","rect":{"x":"0.9","y":"10.7","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7.95"}},{"id":"boite_4_","rect":{"x":"31","y":"2.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_5_","rect":{"x":"14.05","y":"1.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_6_","rect":{"x":"2.1","y":"1.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_7_","rect":{"x":"13.95","y":"18.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"7.1","height":"0.851"}},{"id":"boite_8_","rect":{"x":"21.05","y":"9.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_9_","rect":{"x":"23.95","y":"1.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_10_","rect":{"x":"13","y":"1.85","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_11_","rect":{"x":"2.1","y":"10.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"10","height":"0.85"}},{"id":"boite_12_","rect":{"x":"30.85","y":"10.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7.95"}},{"id":"badGuy","rect":{"x":"27.15","y":"5.05","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.949","height":"0.95"}},{"id":"boite_13_","rect":{"x":"25.95","y":"17.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_14_","rect":{"x":"14.1","y":"8.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_15_","rect":{"x":"10.9","y":"2.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_16_","rect":{"x":"23","y":"2.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.95"}},{"id":"badGuy_1_","rect":{"x":"5.6","y":"14.35","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.95","height":"0.95"}},{"id":"boite_17_","rect":{"x":"13.15","y":"12.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.95"}}],[{"id":"boite","rect":{"x":"4.85","y":"10.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"21.3","y":"11.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_2_","rect":{"x":"20.15","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_3_","rect":{"y":"1","x":2,"fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_4_","rect":{"x":"24.8","y":"1.25","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_5_","rect":{"x":"13.5","y":"17.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.851"}},{"id":"badGuy","rect":{"x":"24.45","y":"7.2","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.85","height":"0.85"}},{"id":"boite_6_","rect":{"x":"11.9","y":"4.25","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_7_","rect":{"x":"5.9","y":"4.3","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_8_","rect":{"x":"27.1","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_9_","rect":{"x":"6.85","y":"3","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_10_","rect":{"x":"19.05","y":"15.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.199"}},{"id":"badGuy_1_","rect":{"x":"9.05","y":"7.1","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.85","height":"0.85"}},{"id":"boite_11_","rect":{"x":"9.45","y":"15.75","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_12_","rect":{"x":"26.75","y":"13.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.149"}},{"id":"boite_13_","rect":{"x":"26.75","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.149"}},{"id":"boite_14_","rect":{"x":"1.5","y":"12","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.15"}},{"id":"boite_15_","rect":{"x":"1.5","y":"13.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.149"}},{"id":"boite_16_","rect":{"x":"1.5","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.149"}},{"id":"boite_17_","rect":{"x":"21.15","y":"2.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_18_","rect":{"x":"23.75","y":"17","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_19_","rect":{"x":"4.9","y":"17.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}}],[{"id":"boite","rect":{"x":"10.15","y":"3.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"20.05","y":"1.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_2_","rect":{"x":"8.05","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_3_","rect":{"x":"3.9","y":"11.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.85"}},{"id":"boite_4_","rect":{"x":"17.85","y":"15.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"11","height":"0.851"}},{"id":"boite_5_","rect":{"x":"7.95","y":"2.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_6_","rect":{"x":"18.9","y":"2.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7.95"}},{"id":"boite_7_","rect":{"x":"31.25","y":"4.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"10"}},{"id":"boite_8_","rect":{"x":"21.2","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_9_","rect":{"x":"20.05","y":"1.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_10_","rect":{"x":"21.9","y":"2.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_11_","rect":{"x":"17.25","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"10"}},{"id":"boite_12_","rect":{"x":"0.9","y":"11.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_13_","rect":{"x":"28.95","y":"5","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_14_","rect":{"x":"7.05","y":"18.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_15_","rect":{"x":"2.85","y":"12.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_16_","rect":{"x":"19.05","y":"17.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_17_","rect":{"x":"9.05","y":"0.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"badGuy","rect":{"x":"25.15","y":"7.15","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.899","height":"0.9"}},{"id":"boite_18_","rect":{"x":"1","y":"6.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_19_","rect":{"x":"6.15","y":"0.7","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_20_","rect":{"x":"5.95","y":"13","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_21_","rect":{"x":"10.05","y":"4.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_22_","rect":{"x":"1.9","y":"8.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_23_","rect":{"x":"15.05","y":"6.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_24_","rect":{"x":"22","y":"11.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_25_","rect":{"x":"30","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.949"}},{"id":"badGuy_1_","rect":{"x":"24","y":"19.1","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.9","height":"0.9"}}],[{"id":"boite","rect":{"x":"10.15","y":"3.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"6.2","y":"13.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_2_","rect":{"x":"3.95","y":"18","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_3_","rect":{"x":"3.9","y":"11.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.85"}},{"id":"boite_4_","rect":{"x":"7.95","y":"2.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_5_","rect":{"x":"30.95","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"10"}},{"id":"boite_6_","rect":{"x":"21.2","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_7_","rect":{"x":"21.9","y":"2.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_8_","rect":{"x":"19.05","y":"0.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"10"}},{"id":"boite_9_","rect":{"x":"0.95","y":"10.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_10_","rect":{"x":"28.95","y":"5","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_11_","rect":{"x":"14.95","y":"6.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_12_","rect":{"x":"19.15","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_13_","rect":{"x":"15.9","y":"16.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.851"}},{"id":"boite_14_","rect":{"x":"16.9","y":"5.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_15_","rect":{"x":"9.05","y":"0.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"badGuy","rect":{"x":"24.55","y":"8.6","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.95","height":"0.95"}},{"id":"boite_16_","rect":{"x":"1","y":"6.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_17_","rect":{"x":"6","y":"1.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_18_","rect":{"x":"2.9","y":"12.25","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_19_","rect":{"x":"9.95","y":"4.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_20_","rect":{"x":"23.2","y":"5.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.8","height":"1.2"}},{"id":"boite_21_","rect":{"x":"0.05","y":"3","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_22_","rect":{"x":"1.9","y":"8.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_23_","rect":{"x":"27.05","y":"6.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_24_","rect":{"x":"21.15","y":"11.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.199"}},{"id":"badGuy_1_","rect":{"x":"21.85","y":"18","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.95","height":"0.95"}},{"id":"boite_25_","rect":{"x":"28.15","y":"15.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_27_","rect":{"x":"14.15","y":"14","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"badGuy_2_","rect":{"x":"9.75","y":"15.3","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.95","height":"0.95"}}],[{"id":"boite","rect":{"x":"14.95","y":"2.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"5.9","y":"9.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_2_","rect":{"x":"22.9","y":"5.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.899","height":"0.85"}},{"id":"boite_3_","rect":{"x":"4.95","y":"7.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_4_","rect":{"x":"7.85","y":"11.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.851"}},{"id":"boite_5_","rect":{"x":"23.05","y":"1.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.9","height":"0.85"}},{"id":"boite_6_","rect":{"x":"0.75","y":"1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"14.3","height":"1"}},{"id":"boite_7_","rect":{"x":"0.05","y":"11.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.851"}},{"id":"boite_8_","rect":{"x":"15.1","y":"8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_9_","rect":{"x":"22.25","y":"3.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.9","height":"0.85"}},{"id":"boite_10_","rect":{"x":"23.95","y":"9.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_11_","rect":{"x":"14.1","y":"4.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.1","height":"0.85"}},{"id":"boite_12_","rect":{"x":"21.75","y":"11.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.95","height":"0.851"}},{"id":"boite_13_","rect":{"x":"0.05","y":"13.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.1","height":"0.85"}},{"id":"boite_14_","rect":{"x":"8.9","y":"14.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6.1","height":"0.851"}},{"id":"boite_15_","rect":{"x":"16","y":"13.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.9","height":"0.851"}},{"id":"boite_16_","rect":{"x":"7.95","y":"16","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.899","height":"0.85"}},{"id":"boite_17_","rect":{"x":"0.15","y":"18","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.95","height":"0.85"}},{"id":"boite_18_","rect":{"x":"15.15","y":"0.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_19_","rect":{"x":"15.15","y":"5.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.8","height":"1.2"}},{"id":"boite_20_","rect":{"x":"0.95","y":"2.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"11","height":"1.2"}},{"id":"boite_21_","rect":{"y":"7.85","x":0,"fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_22_","rect":{"x":"0.1","y":"5","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"13.35","height":"1"}},{"id":"boite_23_","rect":{"x":"16.05","y":"9.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"badGuy","rect":{"x":"15","y":"16","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"badGuy_1_","rect":{"x":"30","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_24_","rect":{"x":"25.05","y":"6.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6.8","height":"1.2"}},{"id":"boite_25_","rect":{"x":"27.15","y":"13.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_26_","rect":{"x":"0.95","y":"14.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6.95","height":"1.2"}},{"id":"boite_27_","rect":{"x":"19","y":"15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"14.05","height":"1.2"}},{"id":"boite_28_","rect":{"x":"17.85","y":"17.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"12.7","height":"0.9"}}],[{"id":"boite","rect":{"x":"10.85","y":"2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_1_","rect":{"x":"30.05","y":"0.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7.95"}},{"id":"boite_2_","rect":{"x":"14.95","y":"1.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"11.05"}},{"id":"boite_3_","rect":{"x":"19.05","y":"12.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_4_","rect":{"x":"18.95","y":"0.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_5_","rect":{"x":"1.9","y":"10.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_6_","rect":{"x":"21.05","y":"10.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.85"}},{"id":"boite_7_","rect":{"x":"10.85","y":"12.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_8_","rect":{"x":"2.85","y":"3.75","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.05"}},{"id":"boite_9_","rect":{"x":"15.1","y":"13.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"badGuy","rect":{"x":"4.55","y":"4.15","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_10_","rect":{"x":"4.8","y":"5.5","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"1.3"}},{"id":"boite_11_","rect":{"x":"3.8","y":"2.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"2","height":"1.15"}},{"id":"boite_12_","rect":{"x":"5.7","y":"3.75","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"2.15"}},{"id":"boite_13_","rect":{"x":"4.05","y":"7.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.7","height":"1.15"}},{"id":"boite_14_","rect":{"x":"29.05","y":"14","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.05"}},{"id":"badGuy_1_","rect":{"x":"27.75","y":"14.35","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_15_","rect":{"x":"26.9","y":"15.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"1.1"}},{"id":"boite_16_","rect":{"x":"26.95","y":"13","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"2.1","height":"1.15"}},{"id":"boite_17_","rect":{"x":"25.95","y":"14.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"2.15"}},{"id":"boite_18_","rect":{"x":"25.1","y":"18.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.851","height":"1.15"}},{"id":"boite_19_","rect":{"x":"7.65","y":"2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_20_","rect":{"x":"22.05","y":"4.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"2.9"}},{"id":"badGuy_2_","rect":{"x":"23.5","y":"5.55","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_21_","rect":{"x":"25.05","y":"5.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"1.65"}},{"id":"boite_22_","rect":{"x":"23","y":"4","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"2.2","height":"1.3"}},{"id":"boite_23_","rect":{"x":"23.35","y":"7.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.7","height":"1.15"}},{"id":"boite_24_","rect":{"x":"27.05","y":"3","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.85"}},{"id":"boite_25_","rect":{"x":"7.05","y":"14.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"3.05"}},{"id":"badGuy_3_","rect":{"x":"5.45","y":"15.7","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_26_","rect":{"x":"3.85","y":"14.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"1.3"}},{"id":"boite_27_","rect":{"x":"4.7","y":"13.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"2.2","height":"1.3"}},{"id":"boite_28_","rect":{"x":"3.05","y":"17.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"4.05","height":"1.15"}},{"id":"boite_29_","rect":{"x":"2","y":"13.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.75"}}]]

/***/ }),
/* 105 */
/***/ (function(module, exports) {

/**
 * Created by Lucas Arcuri on 05/11/2017.
 * @module
 * @description This is the configuration file where you set up the base URL of the API
 */

var baseURL = "https://dhc3.intrasoft-intl.com/timemachine/public/index.php/";
var baseURL2 = "http://dhc3.intrasoft-intl.com/timemachine/public/index.php/";


module.exports = {
    /**
     * The API base URL endpoint
     * @readonly
     * @type string
     *
     */
    get baseURL() {
        return baseURL;
    },

    /**
     * A second API base URL endpoint, in case of http / https issues during dev
     * @readonly
     * @type string
     *
     */
    get baseURL2() {
      return baseURL2;
    }


};



/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/21/2017.
 */

var pressedKey_str,
    lastPressedKey_str;

document.addEventListener('keydown', function (evt) {
    lastPressedKey_str = pressedKey_str = evt.key;
});
document.addEventListener ('keyup', function (evt) {
    if (pressedKey_str === evt.key) {
        pressedKey_str = null;
    }
});
module.exports = {
    get pressedKey() {
        return pressedKey_str;
    },
    get lastPressedKey() {
        return lastPressedKey_str;
    }
};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/21/2017.
 */


var preventDefaults = function (evt) {
    evt.preventDefault();
};

var
    position_point = null,
    app_el = document.getElementById('game_js'),
    setCoordinates = function (evt) {
        var isMouse_bool = !evt.changedTouches;
        if (isMouse_bool) {
            position_point = {x: evt.clientX, y: evt.clientY};
        } else {
            var touch = evt.changedTouches[0];
            position_point = {x: touch.clientX, y: touch.clientY};
        }
    },
    stopListening = function (evt) {
        evt.preventDefault();
        app_el.removeEventListener("mousemove", mouseMove);
        app_el.removeEventListener("touchMove", mouseMove);
        position_point = null;
    },
    mouseMove = function (evt) {
        evt.preventDefault();
        setCoordinates(evt);
    },
    mouseDown = function (evt) {
        evt.preventDefault();
        app_el.addEventListener("mousemove", mouseMove);
        setCoordinates(evt);
    };
app_el.addEventListener("mouseleave", stopListening);
app_el.addEventListener("touchmove", mouseMove);
app_el.addEventListener("mousedown", mouseDown);
app_el.addEventListener("touchstart", mouseDown);
app_el.addEventListener("mouseup", stopListening);
app_el.addEventListener("touchend", stopListening);

module.exports = {
    get position() {
       return position_point;
    }
};

/***/ }),
/* 108 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 29/04/2017.
 * @module
 * @description Utility function to handle colors
 */


module.exports = {
    /**
     * Applies a "multiply" - filter
     * @param {number} hex - The input color in hexadecimal format
     * @param {number} percent_dec - The multiply modifier in decimal form (<1 = darker, >1 = brighter)
     */
    multiply: function (hex, percent_dec) {
        var
            hexToRgb = function (hex) {
                var res = hex.match(/[a-f0-9]{2}/gi);
                return res && res.length === 3
                    ? res.map(function (v) {
                        return parseInt(v, 16)
                    })
                    : null;
            },
            rgbToRGBA = function (rgb_array) {
                return ('rgb(' + rgb_array.join(',') + ')');
            },
            rgb_array = hexToRgb(hex),
            result_array = [];
        rgb_array.forEach(function (element) {
            result_array.push(Math.round(Number(element) * percent_dec));
        });
        return rgbToRGBA(result_array);
    }
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/20/2017.
 */

__webpack_require__(103);
__webpack_require__(90);
__webpack_require__(91);

/**
 * @module
 * @description The core of the application. Manages the game framework:
 * - Fetches the necessary ressources before launching the game.
 * - Launches a new level when all goodies are collected.
 * - Stops the game when the user has lost all is lives.
 */

var svgContent = __webpack_require__(102),
    svg_xml = (new DOMParser().parseFromString(svgContent, "application/xml")),
    svg_xml = document.importNode(svg_xml.documentElement, true),
    app_el = document.getElementById('linguagoApplication');

app_el.innerHTML = '';
app_el.appendChild(svg_xml);

__webpack_require__(101);

var
    languageChoice = __webpack_require__(99),
    Labels = __webpack_require__(13),
    getParameterByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    setLabels = function () {
        var
            scoreLabel_el = document.querySelector('#linguagoApplication .scoreLabel'),
            levelLabel_el = document.querySelector('#linguagoApplication .levelLabel');
        scoreLabel_el.textContent = Labels.getLabel('score');
        levelLabel_el.textContent = Labels.getLabel('level');
    },
    pageLanguage_str = getParameterByName("lang");
if (!pageLanguage_str) {
    pageLanguage_str = 'en';
}

languageChoice.registerLanguage(pageLanguage_str);
Labels.fetchLabels(pageLanguage_str, function () {
    Labels.fetchLanguages(pageLanguage_str, function () {
        console.log("loaded");
        var
            Obstacle = __webpack_require__(96),
            Goodie = __webpack_require__(95),
            BadGuy = __webpack_require__(94),
            PlayerAvatar = __webpack_require__(51),
            Config = __webpack_require__(4),
            LevelOverPopup = __webpack_require__(100),
            QuestionPopup = __webpack_require__(52),
            GameOverPopup = __webpack_require__(98),
            IntervalManager = __webpack_require__(26),
            ScoreManager = __webpack_require__(27),
            Timer = __webpack_require__(93),
            LiveManager = __webpack_require__(34),
            PauseManager = __webpack_require__(14),
            LevelCounter = __webpack_require__(92),
            playSound = __webpack_require__(17),
            ObjectlistManager = __webpack_require__(15),
            LevelsManager = __webpack_require__(97),
            Languages = __webpack_require__(50),
            app_el = Config('app').dom_el,
            playerAvatar_obj,
            level_num = 0,
            newGame = function () {
                ScoreManager.reset();
                LiveManager.reset();
                level_num = 0;
                languageChoice.registerLanguage(pageLanguage_str);
                createLevel();
            },
            togglePauseButton = function (enable_bool) {
                var pauseButton_el = app_el.querySelector('.pauseButton');
                if (enable_bool) {
                    app_el.classList.add('playing');
                    pauseButton_el.setAttribute('tabindex', 0);
                } else {
                    app_el.classList.remove('playing');
                    pauseButton_el.setAttribute('tabindex', -1);
                }
            },
            createLevel = function () {
                var
                    level_array = LevelsManager.get(level_num++),
                    obstacles_array = level_array.filter(function (element) {
                        return element.id.indexOf('badGuy') === -1;
                    }),
                    badGuys_array = level_array.filter(function (element) {
                        return element.id.indexOf('badGuy') !== -1;
                    });
                Languages.refresh();
                togglePauseButton(true);
                Timer.start(30 + (30 * (level_num)));
                LevelCounter.set(level_num);
                ObjectlistManager.cleanAll();
                obstacles_array.forEach(function (element) {
                    Obstacle.add({
                        width: Math.round(element.rect.width),
                        height: Math.round(element.rect.height),
                        x: Math.round(element.rect.x),
                        y: Math.round(element.rect.y)
                    });
                });
                playerAvatar_obj = PlayerAvatar.add();
                badGuys_array.forEach(function (element) {
                    for (var n = 0; n <= Math.floor(level_num / 4); n++) {
                        BadGuy.add({
                            x: Math.round(element.rect.x),
                            y: Math.round(element.rect.y)
                        });
                    }
                    playSound('bon_1');
                });
                Goodie.addAll();
            };

        newGame();
        app_el.querySelector('.homeButton').addEventListener('mousedown', function (evt) {
            evt.stopPropagation();
        });
        app_el.querySelector('.homeButton').setAttribute("xlink:href", ".?lang="+pageLanguage_str); 
        LiveManager.onLivesLost = function () {
            togglePauseButton(false);
            QuestionPopup.remove();
            PauseManager.playing = true;
            IntervalManager.clearAll();
            ObjectlistManager.cleanAll();
            GameOverPopup(newGame);
        };
        Goodie.onCollected = function () {
            console.log("All Goodies collected");
            togglePauseButton(false);
            ScoreManager.add(Timer.remaining);
            LevelOverPopup(function () {
                    if (level_num % 4 === 0) {
                        ObjectlistManager.cleanAll();
                        languageChoice.display(createLevel);
                    } else {
                        createLevel();
                    }
                }
            );
        };
        setLabels();
    });
});

module.exports = {};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var asn1 = __webpack_require__(19);
var inherits = __webpack_require__(0);

var api = exports;

api.define = function define(name, body) {
  return new Entity(name, body);
};

function Entity(name, body) {
  this.name = name;
  this.body = body;

  this.decoders = {};
  this.encoders = {};
};

Entity.prototype._createNamed = function createNamed(base) {
  var named;
  try {
    named = __webpack_require__(199).runInThisContext(
      '(function ' + this.name + '(entity) {\n' +
      '  this._initNamed(entity);\n' +
      '})'
    );
  } catch (e) {
    named = function (entity) {
      this._initNamed(entity);
    };
  }
  inherits(named, base);
  named.prototype._initNamed = function initnamed(entity) {
    base.call(this, entity);
  };

  return new named(this);
};

Entity.prototype._getDecoder = function _getDecoder(enc) {
  enc = enc || 'der';
  // Lazily create decoder
  if (!this.decoders.hasOwnProperty(enc))
    this.decoders[enc] = this._createNamed(asn1.decoders[enc]);
  return this.decoders[enc];
};

Entity.prototype.decode = function decode(data, enc, options) {
  return this._getDecoder(enc).decode(data, options);
};

Entity.prototype._getEncoder = function _getEncoder(enc) {
  enc = enc || 'der';
  // Lazily create encoder
  if (!this.encoders.hasOwnProperty(enc))
    this.encoders[enc] = this._createNamed(asn1.encoders[enc]);
  return this.encoders[enc];
};

Entity.prototype.encode = function encode(data, enc, /* internal */ reporter) {
  return this._getEncoder(enc).encode(data, reporter);
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var Reporter = __webpack_require__(20).Reporter;
var EncoderBuffer = __webpack_require__(20).EncoderBuffer;
var DecoderBuffer = __webpack_require__(20).DecoderBuffer;
var assert = __webpack_require__(6);

// Supported tags
var tags = [
  'seq', 'seqof', 'set', 'setof', 'objid', 'bool',
  'gentime', 'utctime', 'null_', 'enum', 'int', 'objDesc',
  'bitstr', 'bmpstr', 'charstr', 'genstr', 'graphstr', 'ia5str', 'iso646str',
  'numstr', 'octstr', 'printstr', 't61str', 'unistr', 'utf8str', 'videostr'
];

// Public methods list
var methods = [
  'key', 'obj', 'use', 'optional', 'explicit', 'implicit', 'def', 'choice',
  'any', 'contains'
].concat(tags);

// Overrided methods list
var overrided = [
  '_peekTag', '_decodeTag', '_use',
  '_decodeStr', '_decodeObjid', '_decodeTime',
  '_decodeNull', '_decodeInt', '_decodeBool', '_decodeList',

  '_encodeComposite', '_encodeStr', '_encodeObjid', '_encodeTime',
  '_encodeNull', '_encodeInt', '_encodeBool'
];

function Node(enc, parent) {
  var state = {};
  this._baseState = state;

  state.enc = enc;

  state.parent = parent || null;
  state.children = null;

  // State
  state.tag = null;
  state.args = null;
  state.reverseArgs = null;
  state.choice = null;
  state.optional = false;
  state.any = false;
  state.obj = false;
  state.use = null;
  state.useDecoder = null;
  state.key = null;
  state['default'] = null;
  state.explicit = null;
  state.implicit = null;
  state.contains = null;

  // Should create new instance on each method
  if (!state.parent) {
    state.children = [];
    this._wrap();
  }
}
module.exports = Node;

var stateProps = [
  'enc', 'parent', 'children', 'tag', 'args', 'reverseArgs', 'choice',
  'optional', 'any', 'obj', 'use', 'alteredUse', 'key', 'default', 'explicit',
  'implicit', 'contains'
];

Node.prototype.clone = function clone() {
  var state = this._baseState;
  var cstate = {};
  stateProps.forEach(function(prop) {
    cstate[prop] = state[prop];
  });
  var res = new this.constructor(cstate.parent);
  res._baseState = cstate;
  return res;
};

Node.prototype._wrap = function wrap() {
  var state = this._baseState;
  methods.forEach(function(method) {
    this[method] = function _wrappedMethod() {
      var clone = new this.constructor(this);
      state.children.push(clone);
      return clone[method].apply(clone, arguments);
    };
  }, this);
};

Node.prototype._init = function init(body) {
  var state = this._baseState;

  assert(state.parent === null);
  body.call(this);

  // Filter children
  state.children = state.children.filter(function(child) {
    return child._baseState.parent === this;
  }, this);
  assert.equal(state.children.length, 1, 'Root node can have only one child');
};

Node.prototype._useArgs = function useArgs(args) {
  var state = this._baseState;

  // Filter children and args
  var children = args.filter(function(arg) {
    return arg instanceof this.constructor;
  }, this);
  args = args.filter(function(arg) {
    return !(arg instanceof this.constructor);
  }, this);

  if (children.length !== 0) {
    assert(state.children === null);
    state.children = children;

    // Replace parent to maintain backward link
    children.forEach(function(child) {
      child._baseState.parent = this;
    }, this);
  }
  if (args.length !== 0) {
    assert(state.args === null);
    state.args = args;
    state.reverseArgs = args.map(function(arg) {
      if (typeof arg !== 'object' || arg.constructor !== Object)
        return arg;

      var res = {};
      Object.keys(arg).forEach(function(key) {
        if (key == (key | 0))
          key |= 0;
        var value = arg[key];
        res[value] = key;
      });
      return res;
    });
  }
};

//
// Overrided methods
//

overrided.forEach(function(method) {
  Node.prototype[method] = function _overrided() {
    var state = this._baseState;
    throw new Error(method + ' not implemented for encoding: ' + state.enc);
  };
});

//
// Public methods
//

tags.forEach(function(tag) {
  Node.prototype[tag] = function _tagMethod() {
    var state = this._baseState;
    var args = Array.prototype.slice.call(arguments);

    assert(state.tag === null);
    state.tag = tag;

    this._useArgs(args);

    return this;
  };
});

Node.prototype.use = function use(item) {
  assert(item);
  var state = this._baseState;

  assert(state.use === null);
  state.use = item;

  return this;
};

Node.prototype.optional = function optional() {
  var state = this._baseState;

  state.optional = true;

  return this;
};

Node.prototype.def = function def(val) {
  var state = this._baseState;

  assert(state['default'] === null);
  state['default'] = val;
  state.optional = true;

  return this;
};

Node.prototype.explicit = function explicit(num) {
  var state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.explicit = num;

  return this;
};

Node.prototype.implicit = function implicit(num) {
  var state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.implicit = num;

  return this;
};

Node.prototype.obj = function obj() {
  var state = this._baseState;
  var args = Array.prototype.slice.call(arguments);

  state.obj = true;

  if (args.length !== 0)
    this._useArgs(args);

  return this;
};

Node.prototype.key = function key(newKey) {
  var state = this._baseState;

  assert(state.key === null);
  state.key = newKey;

  return this;
};

Node.prototype.any = function any() {
  var state = this._baseState;

  state.any = true;

  return this;
};

Node.prototype.choice = function choice(obj) {
  var state = this._baseState;

  assert(state.choice === null);
  state.choice = obj;
  this._useArgs(Object.keys(obj).map(function(key) {
    return obj[key];
  }));

  return this;
};

Node.prototype.contains = function contains(item) {
  var state = this._baseState;

  assert(state.use === null);
  state.contains = item;

  return this;
};

//
// Decoding
//

Node.prototype._decode = function decode(input, options) {
  var state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return input.wrapResult(state.children[0]._decode(input, options));

  var result = state['default'];
  var present = true;

  var prevKey = null;
  if (state.key !== null)
    prevKey = input.enterKey(state.key);

  // Check if tag is there
  if (state.optional) {
    var tag = null;
    if (state.explicit !== null)
      tag = state.explicit;
    else if (state.implicit !== null)
      tag = state.implicit;
    else if (state.tag !== null)
      tag = state.tag;

    if (tag === null && !state.any) {
      // Trial and Error
      var save = input.save();
      try {
        if (state.choice === null)
          this._decodeGeneric(state.tag, input, options);
        else
          this._decodeChoice(input, options);
        present = true;
      } catch (e) {
        present = false;
      }
      input.restore(save);
    } else {
      present = this._peekTag(input, tag, state.any);

      if (input.isError(present))
        return present;
    }
  }

  // Push object on stack
  var prevObj;
  if (state.obj && present)
    prevObj = input.enterObject();

  if (present) {
    // Unwrap explicit values
    if (state.explicit !== null) {
      var explicit = this._decodeTag(input, state.explicit);
      if (input.isError(explicit))
        return explicit;
      input = explicit;
    }

    var start = input.offset;

    // Unwrap implicit and normal values
    if (state.use === null && state.choice === null) {
      if (state.any)
        var save = input.save();
      var body = this._decodeTag(
        input,
        state.implicit !== null ? state.implicit : state.tag,
        state.any
      );
      if (input.isError(body))
        return body;

      if (state.any)
        result = input.raw(save);
      else
        input = body;
    }

    if (options && options.track && state.tag !== null)
      options.track(input.path(), start, input.length, 'tagged');

    if (options && options.track && state.tag !== null)
      options.track(input.path(), input.offset, input.length, 'content');

    // Select proper method for tag
    if (state.any)
      result = result;
    else if (state.choice === null)
      result = this._decodeGeneric(state.tag, input, options);
    else
      result = this._decodeChoice(input, options);

    if (input.isError(result))
      return result;

    // Decode children
    if (!state.any && state.choice === null && state.children !== null) {
      state.children.forEach(function decodeChildren(child) {
        // NOTE: We are ignoring errors here, to let parser continue with other
        // parts of encoded data
        child._decode(input, options);
      });
    }

    // Decode contained/encoded by schema, only in bit or octet strings
    if (state.contains && (state.tag === 'octstr' || state.tag === 'bitstr')) {
      var data = new DecoderBuffer(result);
      result = this._getUse(state.contains, input._reporterState.obj)
          ._decode(data, options);
    }
  }

  // Pop object
  if (state.obj && present)
    result = input.leaveObject(prevObj);

  // Set key
  if (state.key !== null && (result !== null || present === true))
    input.leaveKey(prevKey, state.key, result);
  else if (prevKey !== null)
    input.exitKey(prevKey);

  return result;
};

Node.prototype._decodeGeneric = function decodeGeneric(tag, input, options) {
  var state = this._baseState;

  if (tag === 'seq' || tag === 'set')
    return null;
  if (tag === 'seqof' || tag === 'setof')
    return this._decodeList(input, tag, state.args[0], options);
  else if (/str$/.test(tag))
    return this._decodeStr(input, tag, options);
  else if (tag === 'objid' && state.args)
    return this._decodeObjid(input, state.args[0], state.args[1], options);
  else if (tag === 'objid')
    return this._decodeObjid(input, null, null, options);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._decodeTime(input, tag, options);
  else if (tag === 'null_')
    return this._decodeNull(input, options);
  else if (tag === 'bool')
    return this._decodeBool(input, options);
  else if (tag === 'objDesc')
    return this._decodeStr(input, tag, options);
  else if (tag === 'int' || tag === 'enum')
    return this._decodeInt(input, state.args && state.args[0], options);

  if (state.use !== null) {
    return this._getUse(state.use, input._reporterState.obj)
        ._decode(input, options);
  } else {
    return input.error('unknown tag: ' + tag);
  }
};

Node.prototype._getUse = function _getUse(entity, obj) {

  var state = this._baseState;
  // Create altered use decoder if implicit is set
  state.useDecoder = this._use(entity, obj);
  assert(state.useDecoder._baseState.parent === null);
  state.useDecoder = state.useDecoder._baseState.children[0];
  if (state.implicit !== state.useDecoder._baseState.implicit) {
    state.useDecoder = state.useDecoder.clone();
    state.useDecoder._baseState.implicit = state.implicit;
  }
  return state.useDecoder;
};

Node.prototype._decodeChoice = function decodeChoice(input, options) {
  var state = this._baseState;
  var result = null;
  var match = false;

  Object.keys(state.choice).some(function(key) {
    var save = input.save();
    var node = state.choice[key];
    try {
      var value = node._decode(input, options);
      if (input.isError(value))
        return false;

      result = { type: key, value: value };
      match = true;
    } catch (e) {
      input.restore(save);
      return false;
    }
    return true;
  }, this);

  if (!match)
    return input.error('Choice not matched');

  return result;
};

//
// Encoding
//

Node.prototype._createEncoderBuffer = function createEncoderBuffer(data) {
  return new EncoderBuffer(data, this.reporter);
};

Node.prototype._encode = function encode(data, reporter, parent) {
  var state = this._baseState;
  if (state['default'] !== null && state['default'] === data)
    return;

  var result = this._encodeValue(data, reporter, parent);
  if (result === undefined)
    return;

  if (this._skipDefault(result, reporter, parent))
    return;

  return result;
};

Node.prototype._encodeValue = function encode(data, reporter, parent) {
  var state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return state.children[0]._encode(data, reporter || new Reporter());

  var result = null;

  // Set reporter to share it with a child class
  this.reporter = reporter;

  // Check if data is there
  if (state.optional && data === undefined) {
    if (state['default'] !== null)
      data = state['default']
    else
      return;
  }

  // Encode children first
  var content = null;
  var primitive = false;
  if (state.any) {
    // Anything that was given is translated to buffer
    result = this._createEncoderBuffer(data);
  } else if (state.choice) {
    result = this._encodeChoice(data, reporter);
  } else if (state.contains) {
    content = this._getUse(state.contains, parent)._encode(data, reporter);
    primitive = true;
  } else if (state.children) {
    content = state.children.map(function(child) {
      if (child._baseState.tag === 'null_')
        return child._encode(null, reporter, data);

      if (child._baseState.key === null)
        return reporter.error('Child should have a key');
      var prevKey = reporter.enterKey(child._baseState.key);

      if (typeof data !== 'object')
        return reporter.error('Child expected, but input is not object');

      var res = child._encode(data[child._baseState.key], reporter, data);
      reporter.leaveKey(prevKey);

      return res;
    }, this).filter(function(child) {
      return child;
    });
    content = this._createEncoderBuffer(content);
  } else {
    if (state.tag === 'seqof' || state.tag === 'setof') {
      // TODO(indutny): this should be thrown on DSL level
      if (!(state.args && state.args.length === 1))
        return reporter.error('Too many args for : ' + state.tag);

      if (!Array.isArray(data))
        return reporter.error('seqof/setof, but data is not Array');

      var child = this.clone();
      child._baseState.implicit = null;
      content = this._createEncoderBuffer(data.map(function(item) {
        var state = this._baseState;

        return this._getUse(state.args[0], data)._encode(item, reporter);
      }, child));
    } else if (state.use !== null) {
      result = this._getUse(state.use, parent)._encode(data, reporter);
    } else {
      content = this._encodePrimitive(state.tag, data);
      primitive = true;
    }
  }

  // Encode data itself
  var result;
  if (!state.any && state.choice === null) {
    var tag = state.implicit !== null ? state.implicit : state.tag;
    var cls = state.implicit === null ? 'universal' : 'context';

    if (tag === null) {
      if (state.use === null)
        reporter.error('Tag could be ommited only for .use()');
    } else {
      if (state.use === null)
        result = this._encodeComposite(tag, primitive, cls, content);
    }
  }

  // Wrap in explicit
  if (state.explicit !== null)
    result = this._encodeComposite(state.explicit, false, 'context', result);

  return result;
};

Node.prototype._encodeChoice = function encodeChoice(data, reporter) {
  var state = this._baseState;

  var node = state.choice[data.type];
  if (!node) {
    assert(
        false,
        data.type + ' not found in ' +
            JSON.stringify(Object.keys(state.choice)));
  }
  return node._encode(data.value, reporter);
};

Node.prototype._encodePrimitive = function encodePrimitive(tag, data) {
  var state = this._baseState;

  if (/str$/.test(tag))
    return this._encodeStr(data, tag);
  else if (tag === 'objid' && state.args)
    return this._encodeObjid(data, state.reverseArgs[0], state.args[1]);
  else if (tag === 'objid')
    return this._encodeObjid(data, null, null);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._encodeTime(data, tag);
  else if (tag === 'null_')
    return this._encodeNull();
  else if (tag === 'int' || tag === 'enum')
    return this._encodeInt(data, state.args && state.reverseArgs[0]);
  else if (tag === 'bool')
    return this._encodeBool(data);
  else if (tag === 'objDesc')
    return this._encodeStr(data, tag);
  else
    throw new Error('Unsupported tag: ' + tag);
};

Node.prototype._isNumstr = function isNumstr(str) {
  return /^[0-9 ]*$/.test(str);
};

Node.prototype._isPrintstr = function isPrintstr(str) {
  return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(str);
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(0);

function Reporter(options) {
  this._reporterState = {
    obj: null,
    path: [],
    options: options || {},
    errors: []
  };
}
exports.Reporter = Reporter;

Reporter.prototype.isError = function isError(obj) {
  return obj instanceof ReporterError;
};

Reporter.prototype.save = function save() {
  var state = this._reporterState;

  return { obj: state.obj, pathLen: state.path.length };
};

Reporter.prototype.restore = function restore(data) {
  var state = this._reporterState;

  state.obj = data.obj;
  state.path = state.path.slice(0, data.pathLen);
};

Reporter.prototype.enterKey = function enterKey(key) {
  return this._reporterState.path.push(key);
};

Reporter.prototype.exitKey = function exitKey(index) {
  var state = this._reporterState;

  state.path = state.path.slice(0, index - 1);
};

Reporter.prototype.leaveKey = function leaveKey(index, key, value) {
  var state = this._reporterState;

  this.exitKey(index);
  if (state.obj !== null)
    state.obj[key] = value;
};

Reporter.prototype.path = function path() {
  return this._reporterState.path.join('/');
};

Reporter.prototype.enterObject = function enterObject() {
  var state = this._reporterState;

  var prev = state.obj;
  state.obj = {};
  return prev;
};

Reporter.prototype.leaveObject = function leaveObject(prev) {
  var state = this._reporterState;

  var now = state.obj;
  state.obj = prev;
  return now;
};

Reporter.prototype.error = function error(msg) {
  var err;
  var state = this._reporterState;

  var inherited = msg instanceof ReporterError;
  if (inherited) {
    err = msg;
  } else {
    err = new ReporterError(state.path.map(function(elem) {
      return '[' + JSON.stringify(elem) + ']';
    }).join(''), msg.message || msg, msg.stack);
  }

  if (!state.options.partial)
    throw err;

  if (!inherited)
    state.errors.push(err);

  return err;
};

Reporter.prototype.wrapResult = function wrapResult(result) {
  var state = this._reporterState;
  if (!state.options.partial)
    return result;

  return {
    result: this.isError(result) ? null : result,
    errors: state.errors
  };
};

function ReporterError(path, msg) {
  this.path = path;
  this.rethrow(msg);
};
inherits(ReporterError, Error);

ReporterError.prototype.rethrow = function rethrow(msg) {
  this.message = msg + ' at: ' + (this.path || '(shallow)');
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, ReporterError);

  if (!this.stack) {
    try {
      // IE only adds stack when thrown
      throw new Error(this.message);
    } catch (e) {
      this.stack = e.stack;
    }
  }
  return this;
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(58);

exports.tagClass = {
  0: 'universal',
  1: 'application',
  2: 'context',
  3: 'private'
};
exports.tagClassByName = constants._reverse(exports.tagClass);

exports.tag = {
  0x00: 'end',
  0x01: 'bool',
  0x02: 'int',
  0x03: 'bitstr',
  0x04: 'octstr',
  0x05: 'null_',
  0x06: 'objid',
  0x07: 'objDesc',
  0x08: 'external',
  0x09: 'real',
  0x0a: 'enum',
  0x0b: 'embed',
  0x0c: 'utf8str',
  0x0d: 'relativeOid',
  0x10: 'seq',
  0x11: 'set',
  0x12: 'numstr',
  0x13: 'printstr',
  0x14: 't61str',
  0x15: 'videostr',
  0x16: 'ia5str',
  0x17: 'utctime',
  0x18: 'gentime',
  0x19: 'graphstr',
  0x1a: 'iso646str',
  0x1b: 'genstr',
  0x1c: 'unistr',
  0x1d: 'charstr',
  0x1e: 'bmpstr'
};
exports.tagByName = constants._reverse(exports.tag);


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var decoders = exports;

decoders.der = __webpack_require__(59);
decoders.pem = __webpack_require__(115);


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(0);
var Buffer = __webpack_require__(1).Buffer;

var DERDecoder = __webpack_require__(59);

function PEMDecoder(entity) {
  DERDecoder.call(this, entity);
  this.enc = 'pem';
};
inherits(PEMDecoder, DERDecoder);
module.exports = PEMDecoder;

PEMDecoder.prototype.decode = function decode(data, options) {
  var lines = data.toString().split(/[\r\n]+/g);

  var label = options.label.toUpperCase();

  var re = /^-----(BEGIN|END) ([^-]+)-----$/;
  var start = -1;
  var end = -1;
  for (var i = 0; i < lines.length; i++) {
    var match = lines[i].match(re);
    if (match === null)
      continue;

    if (match[2] !== label)
      continue;

    if (start === -1) {
      if (match[1] !== 'BEGIN')
        break;
      start = i;
    } else {
      if (match[1] !== 'END')
        break;
      end = i;
      break;
    }
  }
  if (start === -1 || end === -1)
    throw new Error('PEM section not found for: ' + label);

  var base64 = lines.slice(start + 1, end).join('');
  // Remove excessive symbols
  base64.replace(/[^a-z0-9\+\/=]+/gi, '');

  var input = new Buffer(base64, 'base64');
  return DERDecoder.prototype.decode.call(this, input, options);
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var encoders = exports;

encoders.der = __webpack_require__(60);
encoders.pem = __webpack_require__(117);


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(0);

var DEREncoder = __webpack_require__(60);

function PEMEncoder(entity) {
  DEREncoder.call(this, entity);
  this.enc = 'pem';
};
inherits(PEMEncoder, DEREncoder);
module.exports = PEMEncoder;

PEMEncoder.prototype.encode = function encode(data, options) {
  var buf = DEREncoder.prototype.encode.call(this, data);

  var p = buf.toString('base64');
  var out = [ '-----BEGIN ' + options.label + '-----' ];
  for (var i = 0; i < p.length; i += 64)
    out.push(p.slice(i, i + 64));
  out.push('-----END ' + options.label + '-----');
  return out.join('\n');
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var AuthCipher = __webpack_require__(62)
var Buffer = __webpack_require__(2).Buffer
var MODES = __webpack_require__(39)
var StreamCipher = __webpack_require__(66)
var Transform = __webpack_require__(9)
var aes = __webpack_require__(28)
var ebtk = __webpack_require__(30)
var inherits = __webpack_require__(0)

function Decipher (mode, key, iv) {
  Transform.call(this)

  this._cache = new Splitter()
  this._last = void 0
  this._cipher = new aes.AES(key)
  this._prev = Buffer.from(iv)
  this._mode = mode
  this._autopadding = true
}

inherits(Decipher, Transform)

Decipher.prototype._update = function (data) {
  this._cache.add(data)
  var chunk
  var thing
  var out = []
  while ((chunk = this._cache.get(this._autopadding))) {
    thing = this._mode.decrypt(this, chunk)
    out.push(thing)
  }
  return Buffer.concat(out)
}

Decipher.prototype._final = function () {
  var chunk = this._cache.flush()
  if (this._autopadding) {
    return unpad(this._mode.decrypt(this, chunk))
  } else if (chunk) {
    throw new Error('data not multiple of block length')
  }
}

Decipher.prototype.setAutoPadding = function (setTo) {
  this._autopadding = !!setTo
  return this
}

function Splitter () {
  this.cache = Buffer.allocUnsafe(0)
}

Splitter.prototype.add = function (data) {
  this.cache = Buffer.concat([this.cache, data])
}

Splitter.prototype.get = function (autoPadding) {
  var out
  if (autoPadding) {
    if (this.cache.length > 16) {
      out = this.cache.slice(0, 16)
      this.cache = this.cache.slice(16)
      return out
    }
  } else {
    if (this.cache.length >= 16) {
      out = this.cache.slice(0, 16)
      this.cache = this.cache.slice(16)
      return out
    }
  }

  return null
}

Splitter.prototype.flush = function () {
  if (this.cache.length) return this.cache
}

function unpad (last) {
  var padded = last[15]
  var i = -1
  while (++i < padded) {
    if (last[(i + (16 - padded))] !== padded) {
      throw new Error('unable to decrypt data')
    }
  }
  if (padded === 16) return

  return last.slice(0, 16 - padded)
}

function createDecipheriv (suite, password, iv) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  if (typeof iv === 'string') iv = Buffer.from(iv)
  if (config.mode !== 'GCM' && iv.length !== config.iv) throw new TypeError('invalid iv length ' + iv.length)

  if (typeof password === 'string') password = Buffer.from(password)
  if (password.length !== config.key / 8) throw new TypeError('invalid key length ' + password.length)

  if (config.type === 'stream') {
    return new StreamCipher(config.module, password, iv, true)
  } else if (config.type === 'auth') {
    return new AuthCipher(config.module, password, iv, true)
  }

  return new Decipher(config.module, password, iv)
}

function createDecipher (suite, password) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  var keys = ebtk(password, false, config.key, config.iv)
  return createDecipheriv(suite, keys.key, keys.iv)
}

exports.createDecipher = createDecipher
exports.createDecipheriv = createDecipheriv


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var MODES = __webpack_require__(39)
var AuthCipher = __webpack_require__(62)
var Buffer = __webpack_require__(2).Buffer
var StreamCipher = __webpack_require__(66)
var Transform = __webpack_require__(9)
var aes = __webpack_require__(28)
var ebtk = __webpack_require__(30)
var inherits = __webpack_require__(0)

function Cipher (mode, key, iv) {
  Transform.call(this)

  this._cache = new Splitter()
  this._cipher = new aes.AES(key)
  this._prev = Buffer.from(iv)
  this._mode = mode
  this._autopadding = true
}

inherits(Cipher, Transform)

Cipher.prototype._update = function (data) {
  this._cache.add(data)
  var chunk
  var thing
  var out = []

  while ((chunk = this._cache.get())) {
    thing = this._mode.encrypt(this, chunk)
    out.push(thing)
  }

  return Buffer.concat(out)
}

var PADDING = Buffer.alloc(16, 0x10)

Cipher.prototype._final = function () {
  var chunk = this._cache.flush()
  if (this._autopadding) {
    chunk = this._mode.encrypt(this, chunk)
    this._cipher.scrub()
    return chunk
  }

  if (!chunk.equals(PADDING)) {
    this._cipher.scrub()
    throw new Error('data not multiple of block length')
  }
}

Cipher.prototype.setAutoPadding = function (setTo) {
  this._autopadding = !!setTo
  return this
}

function Splitter () {
  this.cache = Buffer.allocUnsafe(0)
}

Splitter.prototype.add = function (data) {
  this.cache = Buffer.concat([this.cache, data])
}

Splitter.prototype.get = function () {
  if (this.cache.length > 15) {
    var out = this.cache.slice(0, 16)
    this.cache = this.cache.slice(16)
    return out
  }
  return null
}

Splitter.prototype.flush = function () {
  var len = 16 - this.cache.length
  var padBuff = Buffer.allocUnsafe(len)

  var i = -1
  while (++i < len) {
    padBuff.writeUInt8(len, i)
  }

  return Buffer.concat([this.cache, padBuff])
}

function createCipheriv (suite, password, iv) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  if (typeof password === 'string') password = Buffer.from(password)
  if (password.length !== config.key / 8) throw new TypeError('invalid key length ' + password.length)

  if (typeof iv === 'string') iv = Buffer.from(iv)
  if (config.mode !== 'GCM' && iv.length !== config.iv) throw new TypeError('invalid iv length ' + iv.length)

  if (config.type === 'stream') {
    return new StreamCipher(config.module, password, iv)
  } else if (config.type === 'auth') {
    return new AuthCipher(config.module, password, iv)
  }

  return new Cipher(config.module, password, iv)
}

function createCipher (suite, password) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  var keys = ebtk(password, false, config.key, config.iv)
  return createCipheriv(suite, keys.key, keys.iv)
}

exports.createCipheriv = createCipheriv
exports.createCipher = createCipher


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(2).Buffer
var ZEROES = Buffer.alloc(16, 0)

function toArray (buf) {
  return [
    buf.readUInt32BE(0),
    buf.readUInt32BE(4),
    buf.readUInt32BE(8),
    buf.readUInt32BE(12)
  ]
}

function fromArray (out) {
  var buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0] >>> 0, 0)
  buf.writeUInt32BE(out[1] >>> 0, 4)
  buf.writeUInt32BE(out[2] >>> 0, 8)
  buf.writeUInt32BE(out[3] >>> 0, 12)
  return buf
}

function GHASH (key) {
  this.h = key
  this.state = Buffer.alloc(16, 0)
  this.cache = Buffer.allocUnsafe(0)
}

// from http://bitwiseshiftleft.github.io/sjcl/doc/symbols/src/core_gcm.js.html
// by Juho Vähä-Herttua
GHASH.prototype.ghash = function (block) {
  var i = -1
  while (++i < block.length) {
    this.state[i] ^= block[i]
  }
  this._multiply()
}

GHASH.prototype._multiply = function () {
  var Vi = toArray(this.h)
  var Zi = [0, 0, 0, 0]
  var j, xi, lsbVi
  var i = -1
  while (++i < 128) {
    xi = (this.state[~~(i / 8)] & (1 << (7 - (i % 8)))) !== 0
    if (xi) {
      // Z_i+1 = Z_i ^ V_i
      Zi[0] ^= Vi[0]
      Zi[1] ^= Vi[1]
      Zi[2] ^= Vi[2]
      Zi[3] ^= Vi[3]
    }

    // Store the value of LSB(V_i)
    lsbVi = (Vi[3] & 1) !== 0

    // V_i+1 = V_i >> 1
    for (j = 3; j > 0; j--) {
      Vi[j] = (Vi[j] >>> 1) | ((Vi[j - 1] & 1) << 31)
    }
    Vi[0] = Vi[0] >>> 1

    // If LSB(V_i) is 1, V_i+1 = (V_i >> 1) ^ R
    if (lsbVi) {
      Vi[0] = Vi[0] ^ (0xe1 << 24)
    }
  }
  this.state = fromArray(Zi)
}

GHASH.prototype.update = function (buf) {
  this.cache = Buffer.concat([this.cache, buf])
  var chunk
  while (this.cache.length >= 16) {
    chunk = this.cache.slice(0, 16)
    this.cache = this.cache.slice(16)
    this.ghash(chunk)
  }
}

GHASH.prototype.final = function (abl, bl) {
  if (this.cache.length) {
    this.ghash(Buffer.concat([this.cache, ZEROES], 16))
  }

  this.ghash(fromArray([0, abl, 0, bl]))
  return this.state
}

module.exports = GHASH


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var xor = __webpack_require__(21)

exports.encrypt = function (self, block) {
  var data = xor(block, self._prev)

  self._prev = self._cipher.encryptBlock(data)
  return self._prev
}

exports.decrypt = function (self, block) {
  var pad = self._prev

  self._prev = block
  var out = self._cipher.decryptBlock(block)

  return xor(out, pad)
}


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(2).Buffer
var xor = __webpack_require__(21)

function encryptStart (self, data, decrypt) {
  var len = data.length
  var out = xor(data, self._cache)
  self._cache = self._cache.slice(len)
  self._prev = Buffer.concat([self._prev, decrypt ? data : out])
  return out
}

exports.encrypt = function (self, data, decrypt) {
  var out = Buffer.allocUnsafe(0)
  var len

  while (data.length) {
    if (self._cache.length === 0) {
      self._cache = self._cipher.encryptBlock(self._prev)
      self._prev = Buffer.allocUnsafe(0)
    }

    if (self._cache.length <= data.length) {
      len = self._cache.length
      out = Buffer.concat([out, encryptStart(self, data.slice(0, len), decrypt)])
      data = data.slice(len)
    } else {
      out = Buffer.concat([out, encryptStart(self, data, decrypt)])
      break
    }
  }

  return out
}


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(2).Buffer

function encryptByte (self, byteParam, decrypt) {
  var pad
  var i = -1
  var len = 8
  var out = 0
  var bit, value
  while (++i < len) {
    pad = self._cipher.encryptBlock(self._prev)
    bit = (byteParam & (1 << (7 - i))) ? 0x80 : 0
    value = pad[0] ^ bit
    out += ((value & 0x80) >> (i % 8))
    self._prev = shiftIn(self._prev, decrypt ? bit : value)
  }
  return out
}

function shiftIn (buffer, value) {
  var len = buffer.length
  var i = -1
  var out = Buffer.allocUnsafe(buffer.length)
  buffer = Buffer.concat([buffer, Buffer.from([value])])

  while (++i < len) {
    out[i] = buffer[i] << 1 | buffer[i + 1] >> (7)
  }

  return out
}

exports.encrypt = function (self, chunk, decrypt) {
  var len = chunk.length
  var out = Buffer.allocUnsafe(len)
  var i = -1

  while (++i < len) {
    out[i] = encryptByte(self, chunk[i], decrypt)
  }

  return out
}


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(2).Buffer

function encryptByte (self, byteParam, decrypt) {
  var pad = self._cipher.encryptBlock(self._prev)
  var out = pad[0] ^ byteParam

  self._prev = Buffer.concat([
    self._prev.slice(1),
    Buffer.from([decrypt ? byteParam : out])
  ])

  return out
}

exports.encrypt = function (self, chunk, decrypt) {
  var len = chunk.length
  var out = Buffer.allocUnsafe(len)
  var i = -1

  while (++i < len) {
    out[i] = encryptByte(self, chunk[i], decrypt)
  }

  return out
}


/***/ }),
/* 126 */
/***/ (function(module, exports) {

exports.encrypt = function (self, block) {
  return self._cipher.encryptBlock(block)
}

exports.decrypt = function (self, block) {
  return self._cipher.decryptBlock(block)
}


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var xor = __webpack_require__(21)

function getBlock (self) {
  self._prev = self._cipher.encryptBlock(self._prev)
  return self._prev
}

exports.encrypt = function (self, chunk) {
  while (self._cache.length < chunk.length) {
    self._cache = Buffer.concat([self._cache, getBlock(self)])
  }

  var pad = self._cache.slice(0, chunk.length)
  self._cache = self._cache.slice(chunk.length)
  return xor(chunk, pad)
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var ebtk = __webpack_require__(30)
var aes = __webpack_require__(38)
var DES = __webpack_require__(129)
var desModes = __webpack_require__(130)
var aesModes = __webpack_require__(39)
function createCipher (suite, password) {
  var keyLen, ivLen
  suite = suite.toLowerCase()
  if (aesModes[suite]) {
    keyLen = aesModes[suite].key
    ivLen = aesModes[suite].iv
  } else if (desModes[suite]) {
    keyLen = desModes[suite].key * 8
    ivLen = desModes[suite].iv
  } else {
    throw new TypeError('invalid suite type')
  }
  var keys = ebtk(password, false, keyLen, ivLen)
  return createCipheriv(suite, keys.key, keys.iv)
}
function createDecipher (suite, password) {
  var keyLen, ivLen
  suite = suite.toLowerCase()
  if (aesModes[suite]) {
    keyLen = aesModes[suite].key
    ivLen = aesModes[suite].iv
  } else if (desModes[suite]) {
    keyLen = desModes[suite].key * 8
    ivLen = desModes[suite].iv
  } else {
    throw new TypeError('invalid suite type')
  }
  var keys = ebtk(password, false, keyLen, ivLen)
  return createDecipheriv(suite, keys.key, keys.iv)
}

function createCipheriv (suite, key, iv) {
  suite = suite.toLowerCase()
  if (aesModes[suite]) {
    return aes.createCipheriv(suite, key, iv)
  } else if (desModes[suite]) {
    return new DES({
      key: key,
      iv: iv,
      mode: suite
    })
  } else {
    throw new TypeError('invalid suite type')
  }
}
function createDecipheriv (suite, key, iv) {
  suite = suite.toLowerCase()
  if (aesModes[suite]) {
    return aes.createDecipheriv(suite, key, iv)
  } else if (desModes[suite]) {
    return new DES({
      key: key,
      iv: iv,
      mode: suite,
      decrypt: true
    })
  } else {
    throw new TypeError('invalid suite type')
  }
}
exports.createCipher = exports.Cipher = createCipher
exports.createCipheriv = exports.Cipheriv = createCipheriv
exports.createDecipher = exports.Decipher = createDecipher
exports.createDecipheriv = exports.Decipheriv = createDecipheriv
function getCiphers () {
  return Object.keys(desModes).concat(aes.getCiphers())
}
exports.listCiphers = exports.getCiphers = getCiphers


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var CipherBase = __webpack_require__(9)
var des = __webpack_require__(42)
var inherits = __webpack_require__(0)

var modes = {
  'des-ede3-cbc': des.CBC.instantiate(des.EDE),
  'des-ede3': des.EDE,
  'des-ede-cbc': des.CBC.instantiate(des.EDE),
  'des-ede': des.EDE,
  'des-cbc': des.CBC.instantiate(des.DES),
  'des-ecb': des.DES
}
modes.des = modes['des-cbc']
modes.des3 = modes['des-ede3-cbc']
module.exports = DES
inherits(DES, CipherBase)
function DES (opts) {
  CipherBase.call(this)
  var modeName = opts.mode.toLowerCase()
  var mode = modes[modeName]
  var type
  if (opts.decrypt) {
    type = 'decrypt'
  } else {
    type = 'encrypt'
  }
  var key = opts.key
  if (modeName === 'des-ede' || modeName === 'des-ede-cbc') {
    key = Buffer.concat([key, key.slice(0, 8)])
  }
  var iv = opts.iv
  this._des = mode.create({
    key: key,
    iv: iv,
    type: type
  })
}
DES.prototype._update = function (data) {
  return new Buffer(this._des.update(data))
}
DES.prototype._final = function () {
  return new Buffer(this._des.final())
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 130 */
/***/ (function(module, exports) {

exports['des-ecb'] = {
  key: 8,
  iv: 0
}
exports['des-cbc'] = exports.des = {
  key: 8,
  iv: 8
}
exports['des-ede3-cbc'] = exports.des3 = {
  key: 24,
  iv: 8
}
exports['des-ede3'] = {
  key: 24,
  iv: 0
}
exports['des-ede-cbc'] = {
  key: 16,
  iv: 8
}
exports['des-ede'] = {
  key: 16,
  iv: 0
}


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(67)


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(23)
var stream = __webpack_require__(33)
var inherits = __webpack_require__(0)
var sign = __webpack_require__(133)
var verify = __webpack_require__(134)

var algorithms = __webpack_require__(67)
Object.keys(algorithms).forEach(function (key) {
  algorithms[key].id = new Buffer(algorithms[key].id, 'hex')
  algorithms[key.toLowerCase()] = algorithms[key]
})

function Sign (algorithm) {
  stream.Writable.call(this)

  var data = algorithms[algorithm]
  if (!data) throw new Error('Unknown message digest')

  this._hashType = data.hash
  this._hash = createHash(data.hash)
  this._tag = data.id
  this._signType = data.sign
}
inherits(Sign, stream.Writable)

Sign.prototype._write = function _write (data, _, done) {
  this._hash.update(data)
  done()
}

Sign.prototype.update = function update (data, enc) {
  if (typeof data === 'string') data = new Buffer(data, enc)

  this._hash.update(data)
  return this
}

Sign.prototype.sign = function signMethod (key, enc) {
  this.end()
  var hash = this._hash.digest()
  var sig = sign(hash, key, this._hashType, this._signType, this._tag)

  return enc ? sig.toString(enc) : sig
}

function Verify (algorithm) {
  stream.Writable.call(this)

  var data = algorithms[algorithm]
  if (!data) throw new Error('Unknown message digest')

  this._hash = createHash(data.hash)
  this._tag = data.id
  this._signType = data.sign
}
inherits(Verify, stream.Writable)

Verify.prototype._write = function _write (data, _, done) {
  this._hash.update(data)
  done()
}

Verify.prototype.update = function update (data, enc) {
  if (typeof data === 'string') data = new Buffer(data, enc)

  this._hash.update(data)
  return this
}

Verify.prototype.verify = function verifyMethod (key, sig, enc) {
  if (typeof sig === 'string') sig = new Buffer(sig, enc)

  this.end()
  var hash = this._hash.digest()
  return verify(sig, hash, key, this._signType, this._tag)
}

function createSign (algorithm) {
  return new Sign(algorithm)
}

function createVerify (algorithm) {
  return new Verify(algorithm)
}

module.exports = {
  Sign: createSign,
  Verify: createVerify,
  createSign: createSign,
  createVerify: createVerify
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// much of this based on https://github.com/indutny/self-signed/blob/gh-pages/lib/rsa.js
var createHmac = __webpack_require__(69)
var crt = __webpack_require__(40)
var EC = __webpack_require__(5).ec
var BN = __webpack_require__(3)
var parseKeys = __webpack_require__(31)
var curves = __webpack_require__(68)

function sign (hash, key, hashType, signType, tag) {
  var priv = parseKeys(key)
  if (priv.curve) {
    // rsa keys can be interpreted as ecdsa ones in openssl
    if (signType !== 'ecdsa' && signType !== 'ecdsa/rsa') throw new Error('wrong private key type')
    return ecSign(hash, priv)
  } else if (priv.type === 'dsa') {
    if (signType !== 'dsa') throw new Error('wrong private key type')
    return dsaSign(hash, priv, hashType)
  } else {
    if (signType !== 'rsa' && signType !== 'ecdsa/rsa') throw new Error('wrong private key type')
  }
  hash = Buffer.concat([tag, hash])
  var len = priv.modulus.byteLength()
  var pad = [ 0, 1 ]
  while (hash.length + pad.length + 1 < len) pad.push(0xff)
  pad.push(0x00)
  var i = -1
  while (++i < hash.length) pad.push(hash[i])

  var out = crt(pad, priv)
  return out
}

function ecSign (hash, priv) {
  var curveId = curves[priv.curve.join('.')]
  if (!curveId) throw new Error('unknown curve ' + priv.curve.join('.'))

  var curve = new EC(curveId)
  var key = curve.keyFromPrivate(priv.privateKey)
  var out = key.sign(hash)

  return new Buffer(out.toDER())
}

function dsaSign (hash, priv, algo) {
  var x = priv.params.priv_key
  var p = priv.params.p
  var q = priv.params.q
  var g = priv.params.g
  var r = new BN(0)
  var k
  var H = bits2int(hash, q).mod(q)
  var s = false
  var kv = getKey(x, q, hash, algo)
  while (s === false) {
    k = makeKey(q, kv, algo)
    r = makeR(g, k, p, q)
    s = k.invm(q).imul(H.add(x.mul(r))).mod(q)
    if (s.cmpn(0) === 0) {
      s = false
      r = new BN(0)
    }
  }
  return toDER(r, s)
}

function toDER (r, s) {
  r = r.toArray()
  s = s.toArray()

  // Pad values
  if (r[0] & 0x80) r = [ 0 ].concat(r)
  if (s[0] & 0x80) s = [ 0 ].concat(s)

  var total = r.length + s.length + 4
  var res = [ 0x30, total, 0x02, r.length ]
  res = res.concat(r, [ 0x02, s.length ], s)
  return new Buffer(res)
}

function getKey (x, q, hash, algo) {
  x = new Buffer(x.toArray())
  if (x.length < q.byteLength()) {
    var zeros = new Buffer(q.byteLength() - x.length)
    zeros.fill(0)
    x = Buffer.concat([ zeros, x ])
  }
  var hlen = hash.length
  var hbits = bits2octets(hash, q)
  var v = new Buffer(hlen)
  v.fill(1)
  var k = new Buffer(hlen)
  k.fill(0)
  k = createHmac(algo, k).update(v).update(new Buffer([ 0 ])).update(x).update(hbits).digest()
  v = createHmac(algo, k).update(v).digest()
  k = createHmac(algo, k).update(v).update(new Buffer([ 1 ])).update(x).update(hbits).digest()
  v = createHmac(algo, k).update(v).digest()
  return { k: k, v: v }
}

function bits2int (obits, q) {
  var bits = new BN(obits)
  var shift = (obits.length << 3) - q.bitLength()
  if (shift > 0) bits.ishrn(shift)
  return bits
}

function bits2octets (bits, q) {
  bits = bits2int(bits, q)
  bits = bits.mod(q)
  var out = new Buffer(bits.toArray())
  if (out.length < q.byteLength()) {
    var zeros = new Buffer(q.byteLength() - out.length)
    zeros.fill(0)
    out = Buffer.concat([ zeros, out ])
  }
  return out
}

function makeKey (q, kv, algo) {
  var t
  var k

  do {
    t = new Buffer(0)

    while (t.length * 8 < q.bitLength()) {
      kv.v = createHmac(algo, kv.k).update(kv.v).digest()
      t = Buffer.concat([ t, kv.v ])
    }

    k = bits2int(t, q)
    kv.k = createHmac(algo, kv.k).update(kv.v).update(new Buffer([ 0 ])).digest()
    kv.v = createHmac(algo, kv.k).update(kv.v).digest()
  } while (k.cmp(q) !== -1)

  return k
}

function makeR (g, k, p, q) {
  return g.toRed(BN.mont(p)).redPow(k).fromRed().mod(q)
}

module.exports = sign
module.exports.getKey = getKey
module.exports.makeKey = makeKey

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// much of this based on https://github.com/indutny/self-signed/blob/gh-pages/lib/rsa.js
var BN = __webpack_require__(3)
var EC = __webpack_require__(5).ec
var parseKeys = __webpack_require__(31)
var curves = __webpack_require__(68)

function verify (sig, hash, key, signType, tag) {
  var pub = parseKeys(key)
  if (pub.type === 'ec') {
    // rsa keys can be interpreted as ecdsa ones in openssl
    if (signType !== 'ecdsa' && signType !== 'ecdsa/rsa') throw new Error('wrong public key type')
    return ecVerify(sig, hash, pub)
  } else if (pub.type === 'dsa') {
    if (signType !== 'dsa') throw new Error('wrong public key type')
    return dsaVerify(sig, hash, pub)
  } else {
    if (signType !== 'rsa' && signType !== 'ecdsa/rsa') throw new Error('wrong public key type')
  }
  hash = Buffer.concat([tag, hash])
  var len = pub.modulus.byteLength()
  var pad = [ 1 ]
  var padNum = 0
  while (hash.length + pad.length + 2 < len) {
    pad.push(0xff)
    padNum++
  }
  pad.push(0x00)
  var i = -1
  while (++i < hash.length) {
    pad.push(hash[i])
  }
  pad = new Buffer(pad)
  var red = BN.mont(pub.modulus)
  sig = new BN(sig).toRed(red)

  sig = sig.redPow(new BN(pub.publicExponent))
  sig = new Buffer(sig.fromRed().toArray())
  var out = padNum < 8 ? 1 : 0
  len = Math.min(sig.length, pad.length)
  if (sig.length !== pad.length) out = 1

  i = -1
  while (++i < len) out |= sig[i] ^ pad[i]
  return out === 0
}

function ecVerify (sig, hash, pub) {
  var curveId = curves[pub.data.algorithm.curve.join('.')]
  if (!curveId) throw new Error('unknown curve ' + pub.data.algorithm.curve.join('.'))

  var curve = new EC(curveId)
  var pubkey = pub.data.subjectPrivateKey.data

  return curve.verify(hash, sig, pubkey)
}

function dsaVerify (sig, hash, pub) {
  var p = pub.data.p
  var q = pub.data.q
  var g = pub.data.g
  var y = pub.data.pub_key
  var unpacked = parseKeys.signature.decode(sig, 'der')
  var s = unpacked.s
  var r = unpacked.r
  checkValue(s, q)
  checkValue(r, q)
  var montp = BN.mont(p)
  var w = s.invm(q)
  var v = g.toRed(montp)
    .redPow(new BN(hash).mul(w).mod(q))
    .fromRed()
    .mul(y.toRed(montp).redPow(r.mul(w).mod(q)).fromRed())
    .mod(p)
    .mod(q)
  return v.cmp(r) === 0
}

function checkValue (b, q) {
  if (b.cmpn(0) <= 0) throw new Error('invalid sig')
  if (b.cmp(q) >= q) throw new Error('invalid sig')
}

module.exports = verify

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var elliptic = __webpack_require__(5);
var BN = __webpack_require__(3);

module.exports = function createECDH(curve) {
	return new ECDH(curve);
};

var aliases = {
	secp256k1: {
		name: 'secp256k1',
		byteLength: 32
	},
	secp224r1: {
		name: 'p224',
		byteLength: 28
	},
	prime256v1: {
		name: 'p256',
		byteLength: 32
	},
	prime192v1: {
		name: 'p192',
		byteLength: 24
	},
	ed25519: {
		name: 'ed25519',
		byteLength: 32
	},
	secp384r1: {
		name: 'p384',
		byteLength: 48
	},
	secp521r1: {
		name: 'p521',
		byteLength: 66
	}
};

aliases.p224 = aliases.secp224r1;
aliases.p256 = aliases.secp256r1 = aliases.prime256v1;
aliases.p192 = aliases.secp192r1 = aliases.prime192v1;
aliases.p384 = aliases.secp384r1;
aliases.p521 = aliases.secp521r1;

function ECDH(curve) {
	this.curveType = aliases[curve];
	if (!this.curveType ) {
		this.curveType = {
			name: curve
		};
	}
	this.curve = new elliptic.ec(this.curveType.name);
	this.keys = void 0;
}

ECDH.prototype.generateKeys = function (enc, format) {
	this.keys = this.curve.genKeyPair();
	return this.getPublicKey(enc, format);
};

ECDH.prototype.computeSecret = function (other, inenc, enc) {
	inenc = inenc || 'utf8';
	if (!Buffer.isBuffer(other)) {
		other = new Buffer(other, inenc);
	}
	var otherPub = this.curve.keyFromPublic(other).getPublic();
	var out = otherPub.mul(this.keys.getPrivate()).getX();
	return formatReturnValue(out, enc, this.curveType.byteLength);
};

ECDH.prototype.getPublicKey = function (enc, format) {
	var key = this.keys.getPublic(format === 'compressed', true);
	if (format === 'hybrid') {
		if (key[key.length - 1] % 2) {
			key[0] = 7;
		} else {
			key [0] = 6;
		}
	}
	return formatReturnValue(key, enc);
};

ECDH.prototype.getPrivateKey = function (enc) {
	return formatReturnValue(this.keys.getPrivate(), enc);
};

ECDH.prototype.setPublicKey = function (pub, enc) {
	enc = enc || 'utf8';
	if (!Buffer.isBuffer(pub)) {
		pub = new Buffer(pub, enc);
	}
	this.keys._importPublic(pub);
	return this;
};

ECDH.prototype.setPrivateKey = function (priv, enc) {
	enc = enc || 'utf8';
	if (!Buffer.isBuffer(priv)) {
		priv = new Buffer(priv, enc);
	}
	var _priv = new BN(priv);
	_priv = _priv.toString(16);
	this.keys._importPrivate(_priv);
	return this;
};

function formatReturnValue(bn, enc, len) {
	if (!Array.isArray(bn)) {
		bn = bn.toArray();
	}
	var buf = new Buffer(bn);
	if (len && buf.length < len) {
		var zeros = new Buffer(len - buf.length);
		zeros.fill(0);
		buf = Buffer.concat([zeros, buf]);
	}
	if (!enc) {
		return buf;
	} else {
		return buf.toString(enc);
	}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
var intSize = 4
var zeroBuffer = new Buffer(intSize)
zeroBuffer.fill(0)

var charSize = 8
var hashSize = 16

function toArray (buf) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize))
    buf = Buffer.concat([buf, zeroBuffer], len)
  }

  var arr = new Array(buf.length >>> 2)
  for (var i = 0, j = 0; i < buf.length; i += intSize, j++) {
    arr[j] = buf.readInt32LE(i)
  }

  return arr
}

module.exports = function hash (buf, fn) {
  var arr = fn(toArray(buf), buf.length * charSize)
  buf = new Buffer(hashSize)
  for (var i = 0; i < arr.length; i++) {
    buf.writeInt32LE(arr[i], i << 2, true)
  }
  return buf
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var inherits = __webpack_require__(0)
var Buffer = __webpack_require__(2).Buffer

var Base = __webpack_require__(9)

var ZEROS = Buffer.alloc(128)
var blocksize = 64

function Hmac (alg, key) {
  Base.call(this, 'digest')
  if (typeof key === 'string') {
    key = Buffer.from(key)
  }

  this._alg = alg
  this._key = key

  if (key.length > blocksize) {
    key = alg(key)
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = this._ipad = Buffer.allocUnsafe(blocksize)
  var opad = this._opad = Buffer.allocUnsafe(blocksize)

  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  this._hash = [ipad]
}

inherits(Hmac, Base)

Hmac.prototype._update = function (data) {
  this._hash.push(data)
}

Hmac.prototype._final = function () {
  var h = this._alg(Buffer.concat(this._hash))
  return this._alg(Buffer.concat([this._opad, h]))
}
module.exports = Hmac


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.randomBytes = exports.rng = exports.pseudoRandomBytes = exports.prng = __webpack_require__(25)
exports.createHash = exports.Hash = __webpack_require__(23)
exports.createHmac = exports.Hmac = __webpack_require__(69)

var algos = __webpack_require__(131)
var algoKeys = Object.keys(algos)
var hashes = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160'].concat(algoKeys)
exports.getHashes = function () {
  return hashes
}

var p = __webpack_require__(77)
exports.pbkdf2 = p.pbkdf2
exports.pbkdf2Sync = p.pbkdf2Sync

var aes = __webpack_require__(128)

exports.Cipher = aes.Cipher
exports.createCipher = aes.createCipher
exports.Cipheriv = aes.Cipheriv
exports.createCipheriv = aes.createCipheriv
exports.Decipher = aes.Decipher
exports.createDecipher = aes.createDecipher
exports.Decipheriv = aes.Decipheriv
exports.createDecipheriv = aes.createDecipheriv
exports.getCiphers = aes.getCiphers
exports.listCiphers = aes.listCiphers

var dh = __webpack_require__(146)

exports.DiffieHellmanGroup = dh.DiffieHellmanGroup
exports.createDiffieHellmanGroup = dh.createDiffieHellmanGroup
exports.getDiffieHellman = dh.getDiffieHellman
exports.createDiffieHellman = dh.createDiffieHellman
exports.DiffieHellman = dh.DiffieHellman

var sign = __webpack_require__(132)

exports.createSign = sign.createSign
exports.Sign = sign.Sign
exports.createVerify = sign.createVerify
exports.Verify = sign.Verify

exports.createECDH = __webpack_require__(135)

var publicEncrypt = __webpack_require__(181)

exports.publicEncrypt = publicEncrypt.publicEncrypt
exports.privateEncrypt = publicEncrypt.privateEncrypt
exports.publicDecrypt = publicEncrypt.publicDecrypt
exports.privateDecrypt = publicEncrypt.privateDecrypt

// the least I can do is make error messages for the rest of the node.js/crypto api.
// ;[
//   'createCredentials'
// ].forEach(function (name) {
//   exports[name] = function () {
//     throw new Error([
//       'sorry, ' + name + ' is not implemented yet',
//       'we accept pull requests',
//       'https://github.com/crypto-browserify/crypto-browserify'
//     ].join('\n'))
//   }
// })

exports.createCredentials = function () {
  throw new Error([
    'sorry, createCredentials is not implemented yet',
    'we accept pull requests',
    'https://github.com/crypto-browserify/crypto-browserify'
  ].join('\n'))
}

exports.constants = {
  'DH_CHECK_P_NOT_SAFE_PRIME': 2,
  'DH_CHECK_P_NOT_PRIME': 1,
  'DH_UNABLE_TO_CHECK_GENERATOR': 4,
  'DH_NOT_SUITABLE_GENERATOR': 8,
  'NPN_ENABLED': 1,
  'ALPN_ENABLED': 1,
  'RSA_PKCS1_PADDING': 1,
  'RSA_SSLV23_PADDING': 2,
  'RSA_NO_PADDING': 3,
  'RSA_PKCS1_OAEP_PADDING': 4,
  'RSA_X931_PADDING': 5,
  'RSA_PKCS1_PSS_PADDING': 6,
  'POINT_CONVERSION_COMPRESSED': 2,
  'POINT_CONVERSION_UNCOMPRESSED': 4,
  'POINT_CONVERSION_HYBRID': 6
}


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(140)(undefined);
// imports


// module
exports.push([module.i, "\r\n\r\n@keyframes fade {\r\n    0% {\r\n        opacity: 0;\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n    }\r\n}\r\n\r\n@keyframes wipeFromRight_kf {\r\n    0% {\r\n        opacity: 0;\r\n        transform: translate(-15px, 0);\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        transform: translate(0, 0);\r\n    }\r\n}\r\n\r\n@keyframes wipeFromLeft_kf  {\r\n    0% {\r\n        opacity: 0;\r\n        transform: translate(15px, 0);\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        transform: translate(0, 0);\r\n    }\r\n}\r\n\r\n.wipeFromRight {\r\n    animation: wipeFromRight_kf .5s;\r\n}\r\n\r\n.wipeFromLeft {\r\n    animation: wipeFromLeft_kf .5s;\r\n}\r\n\r\nhtml, body {\r\n    position: fixed;\r\n    height: 100%;\r\n    width: 100%\r\n}\r\n\r\nbody {\r\n    margin: 0;\r\n    touch-action: none;\r\n    height: 99%;\r\n    background-color: #0071c0;\r\n\r\n}\r\n\r\n#linguagoApplication .languageChoice_popup .button[aria-disabled=true] {\r\n    pointer-events: none;\r\n    opacity: .8;\r\n}\r\n\r\n\r\n#linguagoApplication .pauseButton {\r\n    pointer-events: none;\r\n}\r\n#linguagoApplication.playing .pauseButton {\r\n    pointer-events:auto;\r\n}\r\n\r\n\r\n#linguagoApplication {\r\n    height: 100%;\r\n    width: 100%;\r\n    font-family: \"AppFont\", Geneva, Verdana, sans-serif;\r\n}\r\n\r\n#linguagoApplication *:focus {\r\n    outline: none;\r\n}\r\n\r\n#linguagoApplication .button {\r\n    cursor: pointer;\r\n    display: block;\r\n}\r\n\r\n#linguagoApplication .button:focus .background {\r\n    stroke:white;\r\n    stroke-width: .5px;\r\n}\r\n\r\n#linguagoApplication .button:focus .background {\r\n    opacity: .9;\r\n}\r\n\r\n#linguagoApplication .button[aria-selected='true'] .background {\r\n    fill:#f05a28;\r\n}\r\n\r\n.question_popup ul {\r\n    font-family: \"AppFont\", Geneva, Verdana, sans-serif !important;\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n.question_popup ul li {\r\nmargin:0;\r\n}\r\n\r\n#linguagoApplication svg {\r\n    user-select: none;\r\n    background: #0071c0;\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n#linguagoApplication #background {\r\n    fill: #0071c0;\r\n}\r\n\r\n.question_popup {\r\n    width:170px;\r\n    position: absolute;\r\n    min-height:80px;\r\n    background-color: #ffffff;\r\n    padding: 0;\r\n    user-select:none;\r\n}\r\n\r\n.pauseButtonTriggered .question_popup  .answer  {\r\n    pointer-events: none;\r\n}\r\n\r\n\r\n.question_popup .question_title, .question_popup .answer {\r\n    font-size: 1em;\r\n    padding: 0 20px;\r\n    color: #0071bc;\r\n    display: block;\r\n    font-family: AppFont, Sans-Serif;\r\n}\r\n\r\n\r\n.question_popup .question_title {\r\n    margin-top: 20px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.question_popup {\r\n    border-radius: 30px;\r\n    padding-bottom: 30px;\r\n    border:1px solid #ffffff;\r\n    line-height: 15px;\r\n    font-size: 15px;\r\n}\r\n\r\n.question_popup:before {\r\n    content: ' ';\r\n\r\n    position: absolute;\r\n    display: block;\r\n    height: 50px;\r\n    width: 27px;\r\n    z-index: 1;\r\n    top: 40%;\r\n    background-size: 100%;\r\n    background-image: url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2016.0.3%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-//W3C//DTD%20SVG%201.1//EN%22%20%22http%3A//www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd%22%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20width%3D%2257.992px%22%20height%3D%22103.504px%22%20viewBox%3D%220%200%2057.992%20103.504%22%20enable-background%3D%22new%200%200%2057.992%20103.504%22%0A%09%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M57.166%2C0C51.855%2C22.842%2C32.707%2C44.544%2C1.79%2C25.105c0%2C32.864%2C46.357%2C36.039%2C55.375%2C74.989V0z%22/%3E%0A%3C/svg%3E%0A);\r\n}\r\n\r\n.question_popup:focus {\r\n    outline:none;\r\n}\r\n\r\n.question_popup.top:before {\r\n    top: 20px;\r\n}\r\n\r\n.question_popup .answers {\r\n    position:relative;\r\n    z-index: 10;\r\n}\r\n\r\n.question_popup.bottom:before {\r\n    top:auto;\r\n    bottom: 20px;\r\n}\r\n\r\n.question_popup.wipeFromRight:before {\r\n    left: -23px;\r\n}\r\n\r\n.question_popup.wipeFromLeft:before {\r\n\r\n    transform: scaleX(-1);\r\n    right: -26px;\r\n}\r\n\r\n.question_popup .answer {\r\n    cursor: pointer;\r\n    background: white;\r\n    border: 1px solid lightGrey;\r\n    border-left:none;\r\n    border-right:none;\r\n    margin:-1px 0 0 0;\r\n    text-align: left;\r\n    width: 100%;\r\n    animation: fade 1s;\r\n    transition: background .2s;\r\n}\r\n\r\n.question_popup .answer:hover, .question_popup .answer:focus {\r\n    color: white;\r\n    background: #0071bc;\r\n}\r\n\r\n#linguagoApplication .gameover_popup {\r\n    min-width: 200px;\r\n    top: 100px;\r\n    left: 100px;\r\n}\r\n\r\n\r\n.answer:focus,\r\n.answer:hover {\r\n    background-color: #0071bc;\r\n}\r\n\r\n#linguagoApplication .live_icon {\r\n    fill: 'red'\r\n}\r\n\r\n/* End screen button manual transform */\r\n.button.sendScore path{\r\n    -ms-transform: translate(152px, 218px); \r\n    -webkit-transform: translate(152px, 218px); \r\n    transform: translate(152px, 218px);\r\n}\r\n\r\n.button.playAgain path {\r\n    -ms-transform: translate(0px, 20px); \r\n    -webkit-transform: translate(0px, 20px); \r\n    transform: translate(0px, 20px);\r\n}", ""]);

// exports


/***/ }),
/* 140 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(6);
var inherits = __webpack_require__(0);

var proto = {};

function CBCState(iv) {
  assert.equal(iv.length, 8, 'Invalid IV length');

  this.iv = new Array(8);
  for (var i = 0; i < this.iv.length; i++)
    this.iv[i] = iv[i];
}

function instantiate(Base) {
  function CBC(options) {
    Base.call(this, options);
    this._cbcInit();
  }
  inherits(CBC, Base);

  var keys = Object.keys(proto);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    CBC.prototype[key] = proto[key];
  }

  CBC.create = function create(options) {
    return new CBC(options);
  };

  return CBC;
}

exports.instantiate = instantiate;

proto._cbcInit = function _cbcInit() {
  var state = new CBCState(this.options.iv);
  this._cbcState = state;
};

proto._update = function _update(inp, inOff, out, outOff) {
  var state = this._cbcState;
  var superProto = this.constructor.super_.prototype;

  var iv = state.iv;
  if (this.type === 'encrypt') {
    for (var i = 0; i < this.blockSize; i++)
      iv[i] ^= inp[inOff + i];

    superProto._update.call(this, iv, 0, out, outOff);

    for (var i = 0; i < this.blockSize; i++)
      iv[i] = out[outOff + i];
  } else {
    superProto._update.call(this, inp, inOff, out, outOff);

    for (var i = 0; i < this.blockSize; i++)
      out[outOff + i] ^= iv[i];

    for (var i = 0; i < this.blockSize; i++)
      iv[i] = inp[inOff + i];
  }
};


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(6);

function Cipher(options) {
  this.options = options;

  this.type = this.options.type;
  this.blockSize = 8;
  this._init();

  this.buffer = new Array(this.blockSize);
  this.bufferOff = 0;
}
module.exports = Cipher;

Cipher.prototype._init = function _init() {
  // Might be overrided
};

Cipher.prototype.update = function update(data) {
  if (data.length === 0)
    return [];

  if (this.type === 'decrypt')
    return this._updateDecrypt(data);
  else
    return this._updateEncrypt(data);
};

Cipher.prototype._buffer = function _buffer(data, off) {
  // Append data to buffer
  var min = Math.min(this.buffer.length - this.bufferOff, data.length - off);
  for (var i = 0; i < min; i++)
    this.buffer[this.bufferOff + i] = data[off + i];
  this.bufferOff += min;

  // Shift next
  return min;
};

Cipher.prototype._flushBuffer = function _flushBuffer(out, off) {
  this._update(this.buffer, 0, out, off);
  this.bufferOff = 0;
  return this.blockSize;
};

Cipher.prototype._updateEncrypt = function _updateEncrypt(data) {
  var inputOff = 0;
  var outputOff = 0;

  var count = ((this.bufferOff + data.length) / this.blockSize) | 0;
  var out = new Array(count * this.blockSize);

  if (this.bufferOff !== 0) {
    inputOff += this._buffer(data, inputOff);

    if (this.bufferOff === this.buffer.length)
      outputOff += this._flushBuffer(out, outputOff);
  }

  // Write blocks
  var max = data.length - ((data.length - inputOff) % this.blockSize);
  for (; inputOff < max; inputOff += this.blockSize) {
    this._update(data, inputOff, out, outputOff);
    outputOff += this.blockSize;
  }

  // Queue rest
  for (; inputOff < data.length; inputOff++, this.bufferOff++)
    this.buffer[this.bufferOff] = data[inputOff];

  return out;
};

Cipher.prototype._updateDecrypt = function _updateDecrypt(data) {
  var inputOff = 0;
  var outputOff = 0;

  var count = Math.ceil((this.bufferOff + data.length) / this.blockSize) - 1;
  var out = new Array(count * this.blockSize);

  // TODO(indutny): optimize it, this is far from optimal
  for (; count > 0; count--) {
    inputOff += this._buffer(data, inputOff);
    outputOff += this._flushBuffer(out, outputOff);
  }

  // Buffer rest of the input
  inputOff += this._buffer(data, inputOff);

  return out;
};

Cipher.prototype.final = function final(buffer) {
  var first;
  if (buffer)
    first = this.update(buffer);

  var last;
  if (this.type === 'encrypt')
    last = this._finalEncrypt();
  else
    last = this._finalDecrypt();

  if (first)
    return first.concat(last);
  else
    return last;
};

Cipher.prototype._pad = function _pad(buffer, off) {
  if (off === 0)
    return false;

  while (off < buffer.length)
    buffer[off++] = 0;

  return true;
};

Cipher.prototype._finalEncrypt = function _finalEncrypt() {
  if (!this._pad(this.buffer, this.bufferOff))
    return [];

  var out = new Array(this.blockSize);
  this._update(this.buffer, 0, out, 0);
  return out;
};

Cipher.prototype._unpad = function _unpad(buffer) {
  return buffer;
};

Cipher.prototype._finalDecrypt = function _finalDecrypt() {
  assert.equal(this.bufferOff, this.blockSize, 'Not enough data to decrypt');
  var out = new Array(this.blockSize);
  this._flushBuffer(out, 0);

  return this._unpad(out);
};


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(6);
var inherits = __webpack_require__(0);

var des = __webpack_require__(42);
var utils = des.utils;
var Cipher = des.Cipher;

function DESState() {
  this.tmp = new Array(2);
  this.keys = null;
}

function DES(options) {
  Cipher.call(this, options);

  var state = new DESState();
  this._desState = state;

  this.deriveKeys(state, options.key);
}
inherits(DES, Cipher);
module.exports = DES;

DES.create = function create(options) {
  return new DES(options);
};

var shiftTable = [
  1, 1, 2, 2, 2, 2, 2, 2,
  1, 2, 2, 2, 2, 2, 2, 1
];

DES.prototype.deriveKeys = function deriveKeys(state, key) {
  state.keys = new Array(16 * 2);

  assert.equal(key.length, this.blockSize, 'Invalid key length');

  var kL = utils.readUInt32BE(key, 0);
  var kR = utils.readUInt32BE(key, 4);

  utils.pc1(kL, kR, state.tmp, 0);
  kL = state.tmp[0];
  kR = state.tmp[1];
  for (var i = 0; i < state.keys.length; i += 2) {
    var shift = shiftTable[i >>> 1];
    kL = utils.r28shl(kL, shift);
    kR = utils.r28shl(kR, shift);
    utils.pc2(kL, kR, state.keys, i);
  }
};

DES.prototype._update = function _update(inp, inOff, out, outOff) {
  var state = this._desState;

  var l = utils.readUInt32BE(inp, inOff);
  var r = utils.readUInt32BE(inp, inOff + 4);

  // Initial Permutation
  utils.ip(l, r, state.tmp, 0);
  l = state.tmp[0];
  r = state.tmp[1];

  if (this.type === 'encrypt')
    this._encrypt(state, l, r, state.tmp, 0);
  else
    this._decrypt(state, l, r, state.tmp, 0);

  l = state.tmp[0];
  r = state.tmp[1];

  utils.writeUInt32BE(out, l, outOff);
  utils.writeUInt32BE(out, r, outOff + 4);
};

DES.prototype._pad = function _pad(buffer, off) {
  var value = buffer.length - off;
  for (var i = off; i < buffer.length; i++)
    buffer[i] = value;

  return true;
};

DES.prototype._unpad = function _unpad(buffer) {
  var pad = buffer[buffer.length - 1];
  for (var i = buffer.length - pad; i < buffer.length; i++)
    assert.equal(buffer[i], pad);

  return buffer.slice(0, buffer.length - pad);
};

DES.prototype._encrypt = function _encrypt(state, lStart, rStart, out, off) {
  var l = lStart;
  var r = rStart;

  // Apply f() x16 times
  for (var i = 0; i < state.keys.length; i += 2) {
    var keyL = state.keys[i];
    var keyR = state.keys[i + 1];

    // f(r, k)
    utils.expand(r, state.tmp, 0);

    keyL ^= state.tmp[0];
    keyR ^= state.tmp[1];
    var s = utils.substitute(keyL, keyR);
    var f = utils.permute(s);

    var t = r;
    r = (l ^ f) >>> 0;
    l = t;
  }

  // Reverse Initial Permutation
  utils.rip(r, l, out, off);
};

DES.prototype._decrypt = function _decrypt(state, lStart, rStart, out, off) {
  var l = rStart;
  var r = lStart;

  // Apply f() x16 times
  for (var i = state.keys.length - 2; i >= 0; i -= 2) {
    var keyL = state.keys[i];
    var keyR = state.keys[i + 1];

    // f(r, k)
    utils.expand(l, state.tmp, 0);

    keyL ^= state.tmp[0];
    keyR ^= state.tmp[1];
    var s = utils.substitute(keyL, keyR);
    var f = utils.permute(s);

    var t = l;
    l = (r ^ f) >>> 0;
    r = t;
  }

  // Reverse Initial Permutation
  utils.rip(l, r, out, off);
};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(6);
var inherits = __webpack_require__(0);

var des = __webpack_require__(42);
var Cipher = des.Cipher;
var DES = des.DES;

function EDEState(type, key) {
  assert.equal(key.length, 24, 'Invalid key length');

  var k1 = key.slice(0, 8);
  var k2 = key.slice(8, 16);
  var k3 = key.slice(16, 24);

  if (type === 'encrypt') {
    this.ciphers = [
      DES.create({ type: 'encrypt', key: k1 }),
      DES.create({ type: 'decrypt', key: k2 }),
      DES.create({ type: 'encrypt', key: k3 })
    ];
  } else {
    this.ciphers = [
      DES.create({ type: 'decrypt', key: k3 }),
      DES.create({ type: 'encrypt', key: k2 }),
      DES.create({ type: 'decrypt', key: k1 })
    ];
  }
}

function EDE(options) {
  Cipher.call(this, options);

  var state = new EDEState(this.type, this.options.key);
  this._edeState = state;
}
inherits(EDE, Cipher);

module.exports = EDE;

EDE.create = function create(options) {
  return new EDE(options);
};

EDE.prototype._update = function _update(inp, inOff, out, outOff) {
  var state = this._edeState;

  state.ciphers[0]._update(inp, inOff, out, outOff);
  state.ciphers[1]._update(out, outOff, out, outOff);
  state.ciphers[2]._update(out, outOff, out, outOff);
};

EDE.prototype._pad = DES.prototype._pad;
EDE.prototype._unpad = DES.prototype._unpad;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.readUInt32BE = function readUInt32BE(bytes, off) {
  var res =  (bytes[0 + off] << 24) |
             (bytes[1 + off] << 16) |
             (bytes[2 + off] << 8) |
             bytes[3 + off];
  return res >>> 0;
};

exports.writeUInt32BE = function writeUInt32BE(bytes, value, off) {
  bytes[0 + off] = value >>> 24;
  bytes[1 + off] = (value >>> 16) & 0xff;
  bytes[2 + off] = (value >>> 8) & 0xff;
  bytes[3 + off] = value & 0xff;
};

exports.ip = function ip(inL, inR, out, off) {
  var outL = 0;
  var outR = 0;

  for (var i = 6; i >= 0; i -= 2) {
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inR >>> (j + i)) & 1;
    }
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inL >>> (j + i)) & 1;
    }
  }

  for (var i = 6; i >= 0; i -= 2) {
    for (var j = 1; j <= 25; j += 8) {
      outR <<= 1;
      outR |= (inR >>> (j + i)) & 1;
    }
    for (var j = 1; j <= 25; j += 8) {
      outR <<= 1;
      outR |= (inL >>> (j + i)) & 1;
    }
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.rip = function rip(inL, inR, out, off) {
  var outL = 0;
  var outR = 0;

  for (var i = 0; i < 4; i++) {
    for (var j = 24; j >= 0; j -= 8) {
      outL <<= 1;
      outL |= (inR >>> (j + i)) & 1;
      outL <<= 1;
      outL |= (inL >>> (j + i)) & 1;
    }
  }
  for (var i = 4; i < 8; i++) {
    for (var j = 24; j >= 0; j -= 8) {
      outR <<= 1;
      outR |= (inR >>> (j + i)) & 1;
      outR <<= 1;
      outR |= (inL >>> (j + i)) & 1;
    }
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.pc1 = function pc1(inL, inR, out, off) {
  var outL = 0;
  var outR = 0;

  // 7, 15, 23, 31, 39, 47, 55, 63
  // 6, 14, 22, 30, 39, 47, 55, 63
  // 5, 13, 21, 29, 39, 47, 55, 63
  // 4, 12, 20, 28
  for (var i = 7; i >= 5; i--) {
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inR >> (j + i)) & 1;
    }
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inL >> (j + i)) & 1;
    }
  }
  for (var j = 0; j <= 24; j += 8) {
    outL <<= 1;
    outL |= (inR >> (j + i)) & 1;
  }

  // 1, 9, 17, 25, 33, 41, 49, 57
  // 2, 10, 18, 26, 34, 42, 50, 58
  // 3, 11, 19, 27, 35, 43, 51, 59
  // 36, 44, 52, 60
  for (var i = 1; i <= 3; i++) {
    for (var j = 0; j <= 24; j += 8) {
      outR <<= 1;
      outR |= (inR >> (j + i)) & 1;
    }
    for (var j = 0; j <= 24; j += 8) {
      outR <<= 1;
      outR |= (inL >> (j + i)) & 1;
    }
  }
  for (var j = 0; j <= 24; j += 8) {
    outR <<= 1;
    outR |= (inL >> (j + i)) & 1;
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.r28shl = function r28shl(num, shift) {
  return ((num << shift) & 0xfffffff) | (num >>> (28 - shift));
};

var pc2table = [
  // inL => outL
  14, 11, 17, 4, 27, 23, 25, 0,
  13, 22, 7, 18, 5, 9, 16, 24,
  2, 20, 12, 21, 1, 8, 15, 26,

  // inR => outR
  15, 4, 25, 19, 9, 1, 26, 16,
  5, 11, 23, 8, 12, 7, 17, 0,
  22, 3, 10, 14, 6, 20, 27, 24
];

exports.pc2 = function pc2(inL, inR, out, off) {
  var outL = 0;
  var outR = 0;

  var len = pc2table.length >>> 1;
  for (var i = 0; i < len; i++) {
    outL <<= 1;
    outL |= (inL >>> pc2table[i]) & 0x1;
  }
  for (var i = len; i < pc2table.length; i++) {
    outR <<= 1;
    outR |= (inR >>> pc2table[i]) & 0x1;
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.expand = function expand(r, out, off) {
  var outL = 0;
  var outR = 0;

  outL = ((r & 1) << 5) | (r >>> 27);
  for (var i = 23; i >= 15; i -= 4) {
    outL <<= 6;
    outL |= (r >>> i) & 0x3f;
  }
  for (var i = 11; i >= 3; i -= 4) {
    outR |= (r >>> i) & 0x3f;
    outR <<= 6;
  }
  outR |= ((r & 0x1f) << 1) | (r >>> 31);

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

var sTable = [
  14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1,
  3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8,
  4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7,
  15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13,

  15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14,
  9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5,
  0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2,
  5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9,

  10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10,
  1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1,
  13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7,
  11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12,

  7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3,
  1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9,
  10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8,
  15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14,

  2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1,
  8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6,
  4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13,
  15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3,

  12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5,
  0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8,
  9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10,
  7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13,

  4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10,
  3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6,
  1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7,
  10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12,

  13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4,
  10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2,
  7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13,
  0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11
];

exports.substitute = function substitute(inL, inR) {
  var out = 0;
  for (var i = 0; i < 4; i++) {
    var b = (inL >>> (18 - i * 6)) & 0x3f;
    var sb = sTable[i * 0x40 + b];

    out <<= 4;
    out |= sb;
  }
  for (var i = 0; i < 4; i++) {
    var b = (inR >>> (18 - i * 6)) & 0x3f;
    var sb = sTable[4 * 0x40 + i * 0x40 + b];

    out <<= 4;
    out |= sb;
  }
  return out >>> 0;
};

var permuteTable = [
  16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22,
  30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7
];

exports.permute = function permute(num) {
  var out = 0;
  for (var i = 0; i < permuteTable.length; i++) {
    out <<= 1;
    out |= (num >>> permuteTable[i]) & 0x1;
  }
  return out >>> 0;
};

exports.padSplit = function padSplit(num, size, group) {
  var str = num.toString(2);
  while (str.length < size)
    str = '0' + str;

  var out = [];
  for (var i = 0; i < size; i += group)
    out.push(str.slice(i, i + group));
  return out.join(' ');
};


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var generatePrime = __webpack_require__(70)
var primes = __webpack_require__(148)

var DH = __webpack_require__(147)

function getDiffieHellman (mod) {
  var prime = new Buffer(primes[mod].prime, 'hex')
  var gen = new Buffer(primes[mod].gen, 'hex')

  return new DH(prime, gen)
}

var ENCODINGS = {
  'binary': true, 'hex': true, 'base64': true
}

function createDiffieHellman (prime, enc, generator, genc) {
  if (Buffer.isBuffer(enc) || ENCODINGS[enc] === undefined) {
    return createDiffieHellman(prime, 'binary', enc, generator)
  }

  enc = enc || 'binary'
  genc = genc || 'binary'
  generator = generator || new Buffer([2])

  if (!Buffer.isBuffer(generator)) {
    generator = new Buffer(generator, genc)
  }

  if (typeof prime === 'number') {
    return new DH(generatePrime(prime, generator), generator, true)
  }

  if (!Buffer.isBuffer(prime)) {
    prime = new Buffer(prime, enc)
  }

  return new DH(prime, generator, true)
}

exports.DiffieHellmanGroup = exports.createDiffieHellmanGroup = exports.getDiffieHellman = getDiffieHellman
exports.createDiffieHellman = exports.DiffieHellman = createDiffieHellman

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var BN = __webpack_require__(3);
var MillerRabin = __webpack_require__(75);
var millerRabin = new MillerRabin();
var TWENTYFOUR = new BN(24);
var ELEVEN = new BN(11);
var TEN = new BN(10);
var THREE = new BN(3);
var SEVEN = new BN(7);
var primes = __webpack_require__(70);
var randomBytes = __webpack_require__(25);
module.exports = DH;

function setPublicKey(pub, enc) {
  enc = enc || 'utf8';
  if (!Buffer.isBuffer(pub)) {
    pub = new Buffer(pub, enc);
  }
  this._pub = new BN(pub);
  return this;
}

function setPrivateKey(priv, enc) {
  enc = enc || 'utf8';
  if (!Buffer.isBuffer(priv)) {
    priv = new Buffer(priv, enc);
  }
  this._priv = new BN(priv);
  return this;
}

var primeCache = {};
function checkPrime(prime, generator) {
  var gen = generator.toString('hex');
  var hex = [gen, prime.toString(16)].join('_');
  if (hex in primeCache) {
    return primeCache[hex];
  }
  var error = 0;

  if (prime.isEven() ||
    !primes.simpleSieve ||
    !primes.fermatTest(prime) ||
    !millerRabin.test(prime)) {
    //not a prime so +1
    error += 1;

    if (gen === '02' || gen === '05') {
      // we'd be able to check the generator
      // it would fail so +8
      error += 8;
    } else {
      //we wouldn't be able to test the generator
      // so +4
      error += 4;
    }
    primeCache[hex] = error;
    return error;
  }
  if (!millerRabin.test(prime.shrn(1))) {
    //not a safe prime
    error += 2;
  }
  var rem;
  switch (gen) {
    case '02':
      if (prime.mod(TWENTYFOUR).cmp(ELEVEN)) {
        // unsuidable generator
        error += 8;
      }
      break;
    case '05':
      rem = prime.mod(TEN);
      if (rem.cmp(THREE) && rem.cmp(SEVEN)) {
        // prime mod 10 needs to equal 3 or 7
        error += 8;
      }
      break;
    default:
      error += 4;
  }
  primeCache[hex] = error;
  return error;
}

function DH(prime, generator, malleable) {
  this.setGenerator(generator);
  this.__prime = new BN(prime);
  this._prime = BN.mont(this.__prime);
  this._primeLen = prime.length;
  this._pub = undefined;
  this._priv = undefined;
  this._primeCode = undefined;
  if (malleable) {
    this.setPublicKey = setPublicKey;
    this.setPrivateKey = setPrivateKey;
  } else {
    this._primeCode = 8;
  }
}
Object.defineProperty(DH.prototype, 'verifyError', {
  enumerable: true,
  get: function () {
    if (typeof this._primeCode !== 'number') {
      this._primeCode = checkPrime(this.__prime, this.__gen);
    }
    return this._primeCode;
  }
});
DH.prototype.generateKeys = function () {
  if (!this._priv) {
    this._priv = new BN(randomBytes(this._primeLen));
  }
  this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed();
  return this.getPublicKey();
};

DH.prototype.computeSecret = function (other) {
  other = new BN(other);
  other = other.toRed(this._prime);
  var secret = other.redPow(this._priv).fromRed();
  var out = new Buffer(secret.toArray());
  var prime = this.getPrime();
  if (out.length < prime.length) {
    var front = new Buffer(prime.length - out.length);
    front.fill(0);
    out = Buffer.concat([front, out]);
  }
  return out;
};

DH.prototype.getPublicKey = function getPublicKey(enc) {
  return formatReturnValue(this._pub, enc);
};

DH.prototype.getPrivateKey = function getPrivateKey(enc) {
  return formatReturnValue(this._priv, enc);
};

DH.prototype.getPrime = function (enc) {
  return formatReturnValue(this.__prime, enc);
};

DH.prototype.getGenerator = function (enc) {
  return formatReturnValue(this._gen, enc);
};

DH.prototype.setGenerator = function (gen, enc) {
  enc = enc || 'utf8';
  if (!Buffer.isBuffer(gen)) {
    gen = new Buffer(gen, enc);
  }
  this.__gen = gen;
  this._gen = new BN(gen);
  return this;
};

function formatReturnValue(bn, enc) {
  var buf = new Buffer(bn.toArray());
  if (!enc) {
    return buf;
  } else {
    return buf.toString(enc);
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 148 */
/***/ (function(module, exports) {

module.exports = {"modp1":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"},"modp2":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"},"modp5":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"},"modp14":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"},"modp15":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"},"modp16":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"},"modp17":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"},"modp18":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"}}

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(3);
var elliptic = __webpack_require__(5);
var utils = elliptic.utils;
var getNAF = utils.getNAF;
var getJSF = utils.getJSF;
var assert = utils.assert;

function BaseCurve(type, conf) {
  this.type = type;
  this.p = new BN(conf.p, 16);

  // Use Montgomery, when there is no fast reduction for the prime
  this.red = conf.prime ? BN.red(conf.prime) : BN.mont(this.p);

  // Useful for many curves
  this.zero = new BN(0).toRed(this.red);
  this.one = new BN(1).toRed(this.red);
  this.two = new BN(2).toRed(this.red);

  // Curve configuration, optional
  this.n = conf.n && new BN(conf.n, 16);
  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

  // Temporary arrays
  this._wnafT1 = new Array(4);
  this._wnafT2 = new Array(4);
  this._wnafT3 = new Array(4);
  this._wnafT4 = new Array(4);

  // Generalized Greg Maxwell's trick
  var adjustCount = this.n && this.p.div(this.n);
  if (!adjustCount || adjustCount.cmpn(100) > 0) {
    this.redN = null;
  } else {
    this._maxwellTrick = true;
    this.redN = this.n.toRed(this.red);
  }
}
module.exports = BaseCurve;

BaseCurve.prototype.point = function point() {
  throw new Error('Not implemented');
};

BaseCurve.prototype.validate = function validate() {
  throw new Error('Not implemented');
};

BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
  assert(p.precomputed);
  var doubles = p._getDoubles();

  var naf = getNAF(k, 1);
  var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
  I /= 3;

  // Translate into more windowed form
  var repr = [];
  for (var j = 0; j < naf.length; j += doubles.step) {
    var nafW = 0;
    for (var k = j + doubles.step - 1; k >= j; k--)
      nafW = (nafW << 1) + naf[k];
    repr.push(nafW);
  }

  var a = this.jpoint(null, null, null);
  var b = this.jpoint(null, null, null);
  for (var i = I; i > 0; i--) {
    for (var j = 0; j < repr.length; j++) {
      var nafW = repr[j];
      if (nafW === i)
        b = b.mixedAdd(doubles.points[j]);
      else if (nafW === -i)
        b = b.mixedAdd(doubles.points[j].neg());
    }
    a = a.add(b);
  }
  return a.toP();
};

BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
  var w = 4;

  // Precompute window
  var nafPoints = p._getNAFPoints(w);
  w = nafPoints.wnd;
  var wnd = nafPoints.points;

  // Get NAF form
  var naf = getNAF(k, w);

  // Add `this`*(N+1) for every w-NAF index
  var acc = this.jpoint(null, null, null);
  for (var i = naf.length - 1; i >= 0; i--) {
    // Count zeroes
    for (var k = 0; i >= 0 && naf[i] === 0; i--)
      k++;
    if (i >= 0)
      k++;
    acc = acc.dblp(k);

    if (i < 0)
      break;
    var z = naf[i];
    assert(z !== 0);
    if (p.type === 'affine') {
      // J +- P
      if (z > 0)
        acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
      else
        acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
    } else {
      // J +- J
      if (z > 0)
        acc = acc.add(wnd[(z - 1) >> 1]);
      else
        acc = acc.add(wnd[(-z - 1) >> 1].neg());
    }
  }
  return p.type === 'affine' ? acc.toP() : acc;
};

BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
                                                       points,
                                                       coeffs,
                                                       len,
                                                       jacobianResult) {
  var wndWidth = this._wnafT1;
  var wnd = this._wnafT2;
  var naf = this._wnafT3;

  // Fill all arrays
  var max = 0;
  for (var i = 0; i < len; i++) {
    var p = points[i];
    var nafPoints = p._getNAFPoints(defW);
    wndWidth[i] = nafPoints.wnd;
    wnd[i] = nafPoints.points;
  }

  // Comb small window NAFs
  for (var i = len - 1; i >= 1; i -= 2) {
    var a = i - 1;
    var b = i;
    if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
      naf[a] = getNAF(coeffs[a], wndWidth[a]);
      naf[b] = getNAF(coeffs[b], wndWidth[b]);
      max = Math.max(naf[a].length, max);
      max = Math.max(naf[b].length, max);
      continue;
    }

    var comb = [
      points[a], /* 1 */
      null, /* 3 */
      null, /* 5 */
      points[b] /* 7 */
    ];

    // Try to avoid Projective points, if possible
    if (points[a].y.cmp(points[b].y) === 0) {
      comb[1] = points[a].add(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].add(points[b].neg());
    } else {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    }

    var index = [
      -3, /* -1 -1 */
      -1, /* -1 0 */
      -5, /* -1 1 */
      -7, /* 0 -1 */
      0, /* 0 0 */
      7, /* 0 1 */
      5, /* 1 -1 */
      1, /* 1 0 */
      3  /* 1 1 */
    ];

    var jsf = getJSF(coeffs[a], coeffs[b]);
    max = Math.max(jsf[0].length, max);
    naf[a] = new Array(max);
    naf[b] = new Array(max);
    for (var j = 0; j < max; j++) {
      var ja = jsf[0][j] | 0;
      var jb = jsf[1][j] | 0;

      naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
      naf[b][j] = 0;
      wnd[a] = comb;
    }
  }

  var acc = this.jpoint(null, null, null);
  var tmp = this._wnafT4;
  for (var i = max; i >= 0; i--) {
    var k = 0;

    while (i >= 0) {
      var zero = true;
      for (var j = 0; j < len; j++) {
        tmp[j] = naf[j][i] | 0;
        if (tmp[j] !== 0)
          zero = false;
      }
      if (!zero)
        break;
      k++;
      i--;
    }
    if (i >= 0)
      k++;
    acc = acc.dblp(k);
    if (i < 0)
      break;

    for (var j = 0; j < len; j++) {
      var z = tmp[j];
      var p;
      if (z === 0)
        continue;
      else if (z > 0)
        p = wnd[j][(z - 1) >> 1];
      else if (z < 0)
        p = wnd[j][(-z - 1) >> 1].neg();

      if (p.type === 'affine')
        acc = acc.mixedAdd(p);
      else
        acc = acc.add(p);
    }
  }
  // Zeroify references
  for (var i = 0; i < len; i++)
    wnd[i] = null;

  if (jacobianResult)
    return acc;
  else
    return acc.toP();
};

function BasePoint(curve, type) {
  this.curve = curve;
  this.type = type;
  this.precomputed = null;
}
BaseCurve.BasePoint = BasePoint;

BasePoint.prototype.eq = function eq(/*other*/) {
  throw new Error('Not implemented');
};

BasePoint.prototype.validate = function validate() {
  return this.curve.validate(this);
};

BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  bytes = utils.toArray(bytes, enc);

  var len = this.p.byteLength();

  // uncompressed, hybrid-odd, hybrid-even
  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
      bytes.length - 1 === 2 * len) {
    if (bytes[0] === 0x06)
      assert(bytes[bytes.length - 1] % 2 === 0);
    else if (bytes[0] === 0x07)
      assert(bytes[bytes.length - 1] % 2 === 1);

    var res =  this.point(bytes.slice(1, 1 + len),
                          bytes.slice(1 + len, 1 + 2 * len));

    return res;
  } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
              bytes.length - 1 === len) {
    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
  }
  throw new Error('Unknown point format');
};

BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
  return this.encode(enc, true);
};

BasePoint.prototype._encode = function _encode(compact) {
  var len = this.curve.p.byteLength();
  var x = this.getX().toArray('be', len);

  if (compact)
    return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

  return [ 0x04 ].concat(x, this.getY().toArray('be', len)) ;
};

BasePoint.prototype.encode = function encode(enc, compact) {
  return utils.encode(this._encode(compact), enc);
};

BasePoint.prototype.precompute = function precompute(power) {
  if (this.precomputed)
    return this;

  var precomputed = {
    doubles: null,
    naf: null,
    beta: null
  };
  precomputed.naf = this._getNAFPoints(8);
  precomputed.doubles = this._getDoubles(4, power);
  precomputed.beta = this._getBeta();
  this.precomputed = precomputed;

  return this;
};

BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
  if (!this.precomputed)
    return false;

  var doubles = this.precomputed.doubles;
  if (!doubles)
    return false;

  return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
};

BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;

  var doubles = [ this ];
  var acc = this;
  for (var i = 0; i < power; i += step) {
    for (var j = 0; j < step; j++)
      acc = acc.dbl();
    doubles.push(acc);
  }
  return {
    step: step,
    points: doubles
  };
};

BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;

  var res = [ this ];
  var max = (1 << wnd) - 1;
  var dbl = max === 1 ? null : this.dbl();
  for (var i = 1; i < max; i++)
    res[i] = res[i - 1].add(dbl);
  return {
    wnd: wnd,
    points: res
  };
};

BasePoint.prototype._getBeta = function _getBeta() {
  return null;
};

BasePoint.prototype.dblp = function dblp(k) {
  var r = this;
  for (var i = 0; i < k; i++)
    r = r.dbl();
  return r;
};


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = __webpack_require__(29);
var elliptic = __webpack_require__(5);
var BN = __webpack_require__(3);
var inherits = __webpack_require__(0);
var Base = curve.base;

var assert = elliptic.utils.assert;

function EdwardsCurve(conf) {
  // NOTE: Important as we are creating point in Base.call()
  this.twisted = (conf.a | 0) !== 1;
  this.mOneA = this.twisted && (conf.a | 0) === -1;
  this.extended = this.mOneA;

  Base.call(this, 'edwards', conf);

  this.a = new BN(conf.a, 16).umod(this.red.m);
  this.a = this.a.toRed(this.red);
  this.c = new BN(conf.c, 16).toRed(this.red);
  this.c2 = this.c.redSqr();
  this.d = new BN(conf.d, 16).toRed(this.red);
  this.dd = this.d.redAdd(this.d);

  assert(!this.twisted || this.c.fromRed().cmpn(1) === 0);
  this.oneC = (conf.c | 0) === 1;
}
inherits(EdwardsCurve, Base);
module.exports = EdwardsCurve;

EdwardsCurve.prototype._mulA = function _mulA(num) {
  if (this.mOneA)
    return num.redNeg();
  else
    return this.a.redMul(num);
};

EdwardsCurve.prototype._mulC = function _mulC(num) {
  if (this.oneC)
    return num;
  else
    return this.c.redMul(num);
};

// Just for compatibility with Short curve
EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
  return this.point(x, y, z, t);
};

EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new BN(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var x2 = x.redSqr();
  var rhs = this.c2.redSub(this.a.redMul(x2));
  var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));

  var y2 = rhs.redMul(lhs.redInvm());
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
  y = new BN(y, 16);
  if (!y.red)
    y = y.toRed(this.red);

  // x^2 = (y^2 - 1) / (d y^2 + 1)
  var y2 = y.redSqr();
  var lhs = y2.redSub(this.one);
  var rhs = y2.redMul(this.d).redAdd(this.one);
  var x2 = lhs.redMul(rhs.redInvm());

  if (x2.cmp(this.zero) === 0) {
    if (odd)
      throw new Error('invalid point');
    else
      return this.point(this.zero, y);
  }

  var x = x2.redSqrt();
  if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  if (x.isOdd() !== odd)
    x = x.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.validate = function validate(point) {
  if (point.isInfinity())
    return true;

  // Curve: A * X^2 + Y^2 = C^2 * (1 + D * X^2 * Y^2)
  point.normalize();

  var x2 = point.x.redSqr();
  var y2 = point.y.redSqr();
  var lhs = x2.redMul(this.a).redAdd(y2);
  var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));

  return lhs.cmp(rhs) === 0;
};

function Point(curve, x, y, z, t) {
  Base.BasePoint.call(this, curve, 'projective');
  if (x === null && y === null && z === null) {
    this.x = this.curve.zero;
    this.y = this.curve.one;
    this.z = this.curve.one;
    this.t = this.curve.zero;
    this.zOne = true;
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    this.z = z ? new BN(z, 16) : this.curve.one;
    this.t = t && new BN(t, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
    if (this.t && !this.t.red)
      this.t = this.t.toRed(this.curve.red);
    this.zOne = this.z === this.curve.one;

    // Use extended coordinates
    if (this.curve.extended && !this.t) {
      this.t = this.x.redMul(this.y);
      if (!this.zOne)
        this.t = this.t.redMul(this.z.redInvm());
    }
  }
}
inherits(Point, Base.BasePoint);

EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
  return Point.fromJSON(this, obj);
};

EdwardsCurve.prototype.point = function point(x, y, z, t) {
  return new Point(this, x, y, z, t);
};

Point.fromJSON = function fromJSON(curve, obj) {
  return new Point(curve, obj[0], obj[1], obj[2]);
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.x.cmpn(0) === 0 &&
         this.y.cmp(this.z) === 0;
};

Point.prototype._extDbl = function _extDbl() {
  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
  //     #doubling-dbl-2008-hwcd
  // 4M + 4S

  // A = X1^2
  var a = this.x.redSqr();
  // B = Y1^2
  var b = this.y.redSqr();
  // C = 2 * Z1^2
  var c = this.z.redSqr();
  c = c.redIAdd(c);
  // D = a * A
  var d = this.curve._mulA(a);
  // E = (X1 + Y1)^2 - A - B
  var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
  // G = D + B
  var g = d.redAdd(b);
  // F = G - C
  var f = g.redSub(c);
  // H = D - B
  var h = d.redSub(b);
  // X3 = E * F
  var nx = e.redMul(f);
  // Y3 = G * H
  var ny = g.redMul(h);
  // T3 = E * H
  var nt = e.redMul(h);
  // Z3 = F * G
  var nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point.prototype._projDbl = function _projDbl() {
  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
  //     #doubling-dbl-2008-bbjlp
  //     #doubling-dbl-2007-bl
  // and others
  // Generally 3M + 4S or 2M + 4S

  // B = (X1 + Y1)^2
  var b = this.x.redAdd(this.y).redSqr();
  // C = X1^2
  var c = this.x.redSqr();
  // D = Y1^2
  var d = this.y.redSqr();

  var nx;
  var ny;
  var nz;
  if (this.curve.twisted) {
    // E = a * C
    var e = this.curve._mulA(c);
    // F = E + D
    var f = e.redAdd(d);
    if (this.zOne) {
      // X3 = (B - C - D) * (F - 2)
      nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
      // Y3 = F * (E - D)
      ny = f.redMul(e.redSub(d));
      // Z3 = F^2 - 2 * F
      nz = f.redSqr().redSub(f).redSub(f);
    } else {
      // H = Z1^2
      var h = this.z.redSqr();
      // J = F - 2 * H
      var j = f.redSub(h).redISub(h);
      // X3 = (B-C-D)*J
      nx = b.redSub(c).redISub(d).redMul(j);
      // Y3 = F * (E - D)
      ny = f.redMul(e.redSub(d));
      // Z3 = F * J
      nz = f.redMul(j);
    }
  } else {
    // E = C + D
    var e = c.redAdd(d);
    // H = (c * Z1)^2
    var h = this.curve._mulC(this.c.redMul(this.z)).redSqr();
    // J = E - 2 * H
    var j = e.redSub(h).redSub(h);
    // X3 = c * (B - E) * J
    nx = this.curve._mulC(b.redISub(e)).redMul(j);
    // Y3 = c * E * (C - D)
    ny = this.curve._mulC(e).redMul(c.redISub(d));
    // Z3 = E * J
    nz = e.redMul(j);
  }
  return this.curve.point(nx, ny, nz);
};

Point.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  // Double in extended coordinates
  if (this.curve.extended)
    return this._extDbl();
  else
    return this._projDbl();
};

Point.prototype._extAdd = function _extAdd(p) {
  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
  //     #addition-add-2008-hwcd-3
  // 8M

  // A = (Y1 - X1) * (Y2 - X2)
  var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
  // B = (Y1 + X1) * (Y2 + X2)
  var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
  // C = T1 * k * T2
  var c = this.t.redMul(this.curve.dd).redMul(p.t);
  // D = Z1 * 2 * Z2
  var d = this.z.redMul(p.z.redAdd(p.z));
  // E = B - A
  var e = b.redSub(a);
  // F = D - C
  var f = d.redSub(c);
  // G = D + C
  var g = d.redAdd(c);
  // H = B + A
  var h = b.redAdd(a);
  // X3 = E * F
  var nx = e.redMul(f);
  // Y3 = G * H
  var ny = g.redMul(h);
  // T3 = E * H
  var nt = e.redMul(h);
  // Z3 = F * G
  var nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point.prototype._projAdd = function _projAdd(p) {
  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
  //     #addition-add-2008-bbjlp
  //     #addition-add-2007-bl
  // 10M + 1S

  // A = Z1 * Z2
  var a = this.z.redMul(p.z);
  // B = A^2
  var b = a.redSqr();
  // C = X1 * X2
  var c = this.x.redMul(p.x);
  // D = Y1 * Y2
  var d = this.y.redMul(p.y);
  // E = d * C * D
  var e = this.curve.d.redMul(c).redMul(d);
  // F = B - E
  var f = b.redSub(e);
  // G = B + E
  var g = b.redAdd(e);
  // X3 = A * F * ((X1 + Y1) * (X2 + Y2) - C - D)
  var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
  var nx = a.redMul(f).redMul(tmp);
  var ny;
  var nz;
  if (this.curve.twisted) {
    // Y3 = A * G * (D - a * C)
    ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
    // Z3 = F * G
    nz = f.redMul(g);
  } else {
    // Y3 = A * G * (D - C)
    ny = a.redMul(g).redMul(d.redSub(c));
    // Z3 = c * F * G
    nz = this.curve._mulC(f).redMul(g);
  }
  return this.curve.point(nx, ny, nz);
};

Point.prototype.add = function add(p) {
  if (this.isInfinity())
    return p;
  if (p.isInfinity())
    return this;

  if (this.curve.extended)
    return this._extAdd(p);
  else
    return this._projAdd(p);
};

Point.prototype.mul = function mul(k) {
  if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else
    return this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function mulAdd(k1, p, k2) {
  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, false);
};

Point.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, true);
};

Point.prototype.normalize = function normalize() {
  if (this.zOne)
    return this;

  // Normalize coordinates
  var zi = this.z.redInvm();
  this.x = this.x.redMul(zi);
  this.y = this.y.redMul(zi);
  if (this.t)
    this.t = this.t.redMul(zi);
  this.z = this.curve.one;
  this.zOne = true;
  return this;
};

Point.prototype.neg = function neg() {
  return this.curve.point(this.x.redNeg(),
                          this.y,
                          this.z,
                          this.t && this.t.redNeg());
};

Point.prototype.getX = function getX() {
  this.normalize();
  return this.x.fromRed();
};

Point.prototype.getY = function getY() {
  this.normalize();
  return this.y.fromRed();
};

Point.prototype.eq = function eq(other) {
  return this === other ||
         this.getX().cmp(other.getX()) === 0 &&
         this.getY().cmp(other.getY()) === 0;
};

Point.prototype.eqXToP = function eqXToP(x) {
  var rx = x.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(this.z);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
  return false;
};

// Compatibility with BaseCurve
Point.prototype.toP = Point.prototype.normalize;
Point.prototype.mixedAdd = Point.prototype.add;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = __webpack_require__(29);
var BN = __webpack_require__(3);
var inherits = __webpack_require__(0);
var Base = curve.base;

var elliptic = __webpack_require__(5);
var utils = elliptic.utils;

function MontCurve(conf) {
  Base.call(this, 'mont', conf);

  this.a = new BN(conf.a, 16).toRed(this.red);
  this.b = new BN(conf.b, 16).toRed(this.red);
  this.i4 = new BN(4).toRed(this.red).redInvm();
  this.two = new BN(2).toRed(this.red);
  this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
inherits(MontCurve, Base);
module.exports = MontCurve;

MontCurve.prototype.validate = function validate(point) {
  var x = point.normalize().x;
  var x2 = x.redSqr();
  var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
  var y = rhs.redSqrt();

  return y.redSqr().cmp(rhs) === 0;
};

function Point(curve, x, z) {
  Base.BasePoint.call(this, curve, 'projective');
  if (x === null && z === null) {
    this.x = this.curve.one;
    this.z = this.curve.zero;
  } else {
    this.x = new BN(x, 16);
    this.z = new BN(z, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
  }
}
inherits(Point, Base.BasePoint);

MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  return this.point(utils.toArray(bytes, enc), 1);
};

MontCurve.prototype.point = function point(x, z) {
  return new Point(this, x, z);
};

MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
  return Point.fromJSON(this, obj);
};

Point.prototype.precompute = function precompute() {
  // No-op
};

Point.prototype._encode = function _encode() {
  return this.getX().toArray('be', this.curve.p.byteLength());
};

Point.fromJSON = function fromJSON(curve, obj) {
  return new Point(curve, obj[0], obj[1] || curve.one);
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};

Point.prototype.dbl = function dbl() {
  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#doubling-dbl-1987-m-3
  // 2M + 2S + 4A

  // A = X1 + Z1
  var a = this.x.redAdd(this.z);
  // AA = A^2
  var aa = a.redSqr();
  // B = X1 - Z1
  var b = this.x.redSub(this.z);
  // BB = B^2
  var bb = b.redSqr();
  // C = AA - BB
  var c = aa.redSub(bb);
  // X3 = AA * BB
  var nx = aa.redMul(bb);
  // Z3 = C * (BB + A24 * C)
  var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
  return this.curve.point(nx, nz);
};

Point.prototype.add = function add() {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.diffAdd = function diffAdd(p, diff) {
  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#diffadd-dadd-1987-m-3
  // 4M + 2S + 6A

  // A = X2 + Z2
  var a = this.x.redAdd(this.z);
  // B = X2 - Z2
  var b = this.x.redSub(this.z);
  // C = X3 + Z3
  var c = p.x.redAdd(p.z);
  // D = X3 - Z3
  var d = p.x.redSub(p.z);
  // DA = D * A
  var da = d.redMul(a);
  // CB = C * B
  var cb = c.redMul(b);
  // X5 = Z1 * (DA + CB)^2
  var nx = diff.z.redMul(da.redAdd(cb).redSqr());
  // Z5 = X1 * (DA - CB)^2
  var nz = diff.x.redMul(da.redISub(cb).redSqr());
  return this.curve.point(nx, nz);
};

Point.prototype.mul = function mul(k) {
  var t = k.clone();
  var a = this; // (N / 2) * Q + Q
  var b = this.curve.point(null, null); // (N / 2) * Q
  var c = this; // Q

  for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
    bits.push(t.andln(1));

  for (var i = bits.length - 1; i >= 0; i--) {
    if (bits[i] === 0) {
      // N * Q + Q = ((N / 2) * Q + Q)) + (N / 2) * Q
      a = a.diffAdd(b, c);
      // N * Q = 2 * ((N / 2) * Q + Q))
      b = b.dbl();
    } else {
      // N * Q = ((N / 2) * Q + Q) + ((N / 2) * Q)
      b = a.diffAdd(b, c);
      // N * Q + Q = 2 * ((N / 2) * Q + Q)
      a = a.dbl();
    }
  }
  return b;
};

Point.prototype.mulAdd = function mulAdd() {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.jumlAdd = function jumlAdd() {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.eq = function eq(other) {
  return this.getX().cmp(other.getX()) === 0;
};

Point.prototype.normalize = function normalize() {
  this.x = this.x.redMul(this.z.redInvm());
  this.z = this.curve.one;
  return this;
};

Point.prototype.getX = function getX() {
  // Normalize coordinates
  this.normalize();

  return this.x.fromRed();
};


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = __webpack_require__(29);
var elliptic = __webpack_require__(5);
var BN = __webpack_require__(3);
var inherits = __webpack_require__(0);
var Base = curve.base;

var assert = elliptic.utils.assert;

function ShortCurve(conf) {
  Base.call(this, 'short', conf);

  this.a = new BN(conf.a, 16).toRed(this.red);
  this.b = new BN(conf.b, 16).toRed(this.red);
  this.tinv = this.two.redInvm();

  this.zeroA = this.a.fromRed().cmpn(0) === 0;
  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

  // If the curve is endomorphic, precalculate beta and lambda
  this.endo = this._getEndomorphism(conf);
  this._endoWnafT1 = new Array(4);
  this._endoWnafT2 = new Array(4);
}
inherits(ShortCurve, Base);
module.exports = ShortCurve;

ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
  // No efficient endomorphism
  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
    return;

  // Compute beta and lambda, that lambda * P = (beta * Px; Py)
  var beta;
  var lambda;
  if (conf.beta) {
    beta = new BN(conf.beta, 16).toRed(this.red);
  } else {
    var betas = this._getEndoRoots(this.p);
    // Choose the smallest beta
    beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
    beta = beta.toRed(this.red);
  }
  if (conf.lambda) {
    lambda = new BN(conf.lambda, 16);
  } else {
    // Choose the lambda that is matching selected beta
    var lambdas = this._getEndoRoots(this.n);
    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
      lambda = lambdas[0];
    } else {
      lambda = lambdas[1];
      assert(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
    }
  }

  // Get basis vectors, used for balanced length-two representation
  var basis;
  if (conf.basis) {
    basis = conf.basis.map(function(vec) {
      return {
        a: new BN(vec.a, 16),
        b: new BN(vec.b, 16)
      };
    });
  } else {
    basis = this._getEndoBasis(lambda);
  }

  return {
    beta: beta,
    lambda: lambda,
    basis: basis
  };
};

ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
  // Find roots of for x^2 + x + 1 in F
  // Root = (-1 +- Sqrt(-3)) / 2
  //
  var red = num === this.p ? this.red : BN.mont(num);
  var tinv = new BN(2).toRed(red).redInvm();
  var ntinv = tinv.redNeg();

  var s = new BN(3).toRed(red).redNeg().redSqrt().redMul(tinv);

  var l1 = ntinv.redAdd(s).fromRed();
  var l2 = ntinv.redSub(s).fromRed();
  return [ l1, l2 ];
};

ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
  // aprxSqrt >= sqrt(this.n)
  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

  // 3.74
  // Run EGCD, until r(L + 1) < aprxSqrt
  var u = lambda;
  var v = this.n.clone();
  var x1 = new BN(1);
  var y1 = new BN(0);
  var x2 = new BN(0);
  var y2 = new BN(1);

  // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
  var a0;
  var b0;
  // First vector
  var a1;
  var b1;
  // Second vector
  var a2;
  var b2;

  var prevR;
  var i = 0;
  var r;
  var x;
  while (u.cmpn(0) !== 0) {
    var q = v.div(u);
    r = v.sub(q.mul(u));
    x = x2.sub(q.mul(x1));
    var y = y2.sub(q.mul(y1));

    if (!a1 && r.cmp(aprxSqrt) < 0) {
      a0 = prevR.neg();
      b0 = x1;
      a1 = r.neg();
      b1 = x;
    } else if (a1 && ++i === 2) {
      break;
    }
    prevR = r;

    v = u;
    u = r;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
  }
  a2 = r.neg();
  b2 = x;

  var len1 = a1.sqr().add(b1.sqr());
  var len2 = a2.sqr().add(b2.sqr());
  if (len2.cmp(len1) >= 0) {
    a2 = a0;
    b2 = b0;
  }

  // Normalize signs
  if (a1.negative) {
    a1 = a1.neg();
    b1 = b1.neg();
  }
  if (a2.negative) {
    a2 = a2.neg();
    b2 = b2.neg();
  }

  return [
    { a: a1, b: b1 },
    { a: a2, b: b2 }
  ];
};

ShortCurve.prototype._endoSplit = function _endoSplit(k) {
  var basis = this.endo.basis;
  var v1 = basis[0];
  var v2 = basis[1];

  var c1 = v2.b.mul(k).divRound(this.n);
  var c2 = v1.b.neg().mul(k).divRound(this.n);

  var p1 = c1.mul(v1.a);
  var p2 = c2.mul(v2.a);
  var q1 = c1.mul(v1.b);
  var q2 = c2.mul(v2.b);

  // Calculate answer
  var k1 = k.sub(p1).sub(p2);
  var k2 = q1.add(q2).neg();
  return { k1: k1, k2: k2 };
};

ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new BN(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  // XXX Is there any way to tell if the number is odd without converting it
  // to non-red form?
  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

ShortCurve.prototype.validate = function validate(point) {
  if (point.inf)
    return true;

  var x = point.x;
  var y = point.y;

  var ax = this.a.redMul(x);
  var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
  return y.redSqr().redISub(rhs).cmpn(0) === 0;
};

ShortCurve.prototype._endoWnafMulAdd =
    function _endoWnafMulAdd(points, coeffs, jacobianResult) {
  var npoints = this._endoWnafT1;
  var ncoeffs = this._endoWnafT2;
  for (var i = 0; i < points.length; i++) {
    var split = this._endoSplit(coeffs[i]);
    var p = points[i];
    var beta = p._getBeta();

    if (split.k1.negative) {
      split.k1.ineg();
      p = p.neg(true);
    }
    if (split.k2.negative) {
      split.k2.ineg();
      beta = beta.neg(true);
    }

    npoints[i * 2] = p;
    npoints[i * 2 + 1] = beta;
    ncoeffs[i * 2] = split.k1;
    ncoeffs[i * 2 + 1] = split.k2;
  }
  var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

  // Clean-up references to points and coefficients
  for (var j = 0; j < i * 2; j++) {
    npoints[j] = null;
    ncoeffs[j] = null;
  }
  return res;
};

function Point(curve, x, y, isRed) {
  Base.BasePoint.call(this, curve, 'affine');
  if (x === null && y === null) {
    this.x = null;
    this.y = null;
    this.inf = true;
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    // Force redgomery representation when loading from JSON
    if (isRed) {
      this.x.forceRed(this.curve.red);
      this.y.forceRed(this.curve.red);
    }
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    this.inf = false;
  }
}
inherits(Point, Base.BasePoint);

ShortCurve.prototype.point = function point(x, y, isRed) {
  return new Point(this, x, y, isRed);
};

ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
  return Point.fromJSON(this, obj, red);
};

Point.prototype._getBeta = function _getBeta() {
  if (!this.curve.endo)
    return;

  var pre = this.precomputed;
  if (pre && pre.beta)
    return pre.beta;

  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
  if (pre) {
    var curve = this.curve;
    var endoMul = function(p) {
      return curve.point(p.x.redMul(curve.endo.beta), p.y);
    };
    pre.beta = beta;
    beta.precomputed = {
      beta: null,
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(endoMul)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(endoMul)
      }
    };
  }
  return beta;
};

Point.prototype.toJSON = function toJSON() {
  if (!this.precomputed)
    return [ this.x, this.y ];

  return [ this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1)
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1)
    }
  } ];
};

Point.fromJSON = function fromJSON(curve, obj, red) {
  if (typeof obj === 'string')
    obj = JSON.parse(obj);
  var res = curve.point(obj[0], obj[1], red);
  if (!obj[2])
    return res;

  function obj2point(obj) {
    return curve.point(obj[0], obj[1], red);
  }

  var pre = obj[2];
  res.precomputed = {
    beta: null,
    doubles: pre.doubles && {
      step: pre.doubles.step,
      points: [ res ].concat(pre.doubles.points.map(obj2point))
    },
    naf: pre.naf && {
      wnd: pre.naf.wnd,
      points: [ res ].concat(pre.naf.points.map(obj2point))
    }
  };
  return res;
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  return this.inf;
};

Point.prototype.add = function add(p) {
  // O + P = P
  if (this.inf)
    return p;

  // P + O = P
  if (p.inf)
    return this;

  // P + P = 2P
  if (this.eq(p))
    return this.dbl();

  // P + (-P) = O
  if (this.neg().eq(p))
    return this.curve.point(null, null);

  // P + Q = O
  if (this.x.cmp(p.x) === 0)
    return this.curve.point(null, null);

  var c = this.y.redSub(p.y);
  if (c.cmpn(0) !== 0)
    c = c.redMul(this.x.redSub(p.x).redInvm());
  var nx = c.redSqr().redISub(this.x).redISub(p.x);
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.dbl = function dbl() {
  if (this.inf)
    return this;

  // 2P = O
  var ys1 = this.y.redAdd(this.y);
  if (ys1.cmpn(0) === 0)
    return this.curve.point(null, null);

  var a = this.curve.a;

  var x2 = this.x.redSqr();
  var dyinv = ys1.redInvm();
  var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

  var nx = c.redSqr().redISub(this.x.redAdd(this.x));
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.getX = function getX() {
  return this.x.fromRed();
};

Point.prototype.getY = function getY() {
  return this.y.fromRed();
};

Point.prototype.mul = function mul(k) {
  k = new BN(k, 16);

  if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else if (this.curve.endo)
    return this.curve._endoWnafMulAdd([ this ], [ k ]);
  else
    return this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2);
};

Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs, true);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
};

Point.prototype.eq = function eq(p) {
  return this === p ||
         this.inf === p.inf &&
             (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
};

Point.prototype.neg = function neg(_precompute) {
  if (this.inf)
    return this;

  var res = this.curve.point(this.x, this.y.redNeg());
  if (_precompute && this.precomputed) {
    var pre = this.precomputed;
    var negate = function(p) {
      return p.neg();
    };
    res.precomputed = {
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(negate)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(negate)
      }
    };
  }
  return res;
};

Point.prototype.toJ = function toJ() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);

  var res = this.curve.jpoint(this.x, this.y, this.curve.one);
  return res;
};

function JPoint(curve, x, y, z) {
  Base.BasePoint.call(this, curve, 'jacobian');
  if (x === null && y === null && z === null) {
    this.x = this.curve.one;
    this.y = this.curve.one;
    this.z = new BN(0);
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    this.z = new BN(z, 16);
  }
  if (!this.x.red)
    this.x = this.x.toRed(this.curve.red);
  if (!this.y.red)
    this.y = this.y.toRed(this.curve.red);
  if (!this.z.red)
    this.z = this.z.toRed(this.curve.red);

  this.zOne = this.z === this.curve.one;
}
inherits(JPoint, Base.BasePoint);

ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
  return new JPoint(this, x, y, z);
};

JPoint.prototype.toP = function toP() {
  if (this.isInfinity())
    return this.curve.point(null, null);

  var zinv = this.z.redInvm();
  var zinv2 = zinv.redSqr();
  var ax = this.x.redMul(zinv2);
  var ay = this.y.redMul(zinv2).redMul(zinv);

  return this.curve.point(ax, ay);
};

JPoint.prototype.neg = function neg() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};

JPoint.prototype.add = function add(p) {
  // O + P = P
  if (this.isInfinity())
    return p;

  // P + O = P
  if (p.isInfinity())
    return this;

  // 12M + 4S + 7A
  var pz2 = p.z.redSqr();
  var z2 = this.z.redSqr();
  var u1 = this.x.redMul(pz2);
  var u2 = p.x.redMul(z2);
  var s1 = this.y.redMul(pz2.redMul(p.z));
  var s2 = p.y.redMul(z2.redMul(this.z));

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(p.z).redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mixedAdd = function mixedAdd(p) {
  // O + P = P
  if (this.isInfinity())
    return p.toJ();

  // P + O = P
  if (p.isInfinity())
    return this;

  // 8M + 3S + 7A
  var z2 = this.z.redSqr();
  var u1 = this.x;
  var u2 = p.x.redMul(z2);
  var s1 = this.y;
  var s2 = p.y.redMul(z2).redMul(this.z);

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.dblp = function dblp(pow) {
  if (pow === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!pow)
    return this.dbl();

  if (this.curve.zeroA || this.curve.threeA) {
    var r = this;
    for (var i = 0; i < pow; i++)
      r = r.dbl();
    return r;
  }

  // 1M + 2S + 1A + N * (4S + 5M + 8A)
  // N = 1 => 6M + 6S + 9A
  var a = this.curve.a;
  var tinv = this.curve.tinv;

  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  // Reuse results
  var jyd = jy.redAdd(jy);
  for (var i = 0; i < pow; i++) {
    var jx2 = jx.redSqr();
    var jyd2 = jyd.redSqr();
    var jyd4 = jyd2.redSqr();
    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

    var t1 = jx.redMul(jyd2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var dny = c.redMul(t2);
    dny = dny.redIAdd(dny).redISub(jyd4);
    var nz = jyd.redMul(jz);
    if (i + 1 < pow)
      jz4 = jz4.redMul(jyd4);

    jx = nx;
    jz = nz;
    jyd = dny;
  }

  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
};

JPoint.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  if (this.curve.zeroA)
    return this._zeroDbl();
  else if (this.curve.threeA)
    return this._threeDbl();
  else
    return this._dbl();
};

JPoint.prototype._zeroDbl = function _zeroDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 14A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a; a = 0
    var m = xx.redAdd(xx).redIAdd(xx);
    // T = M ^ 2 - 2*S
    var t = m.redSqr().redISub(s).redISub(s);

    // 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);

    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2*Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-dbl-2009-l
    // 2M + 5S + 13A

    // A = X1^2
    var a = this.x.redSqr();
    // B = Y1^2
    var b = this.y.redSqr();
    // C = B^2
    var c = b.redSqr();
    // D = 2 * ((X1 + B)^2 - A - C)
    var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
    d = d.redIAdd(d);
    // E = 3 * A
    var e = a.redAdd(a).redIAdd(a);
    // F = E^2
    var f = e.redSqr();

    // 8 * C
    var c8 = c.redIAdd(c);
    c8 = c8.redIAdd(c8);
    c8 = c8.redIAdd(c8);

    // X3 = F - 2 * D
    nx = f.redISub(d).redISub(d);
    // Y3 = E * (D - X3) - 8 * C
    ny = e.redMul(d.redISub(nx)).redISub(c8);
    // Z3 = 2 * Y1 * Z1
    nz = this.y.redMul(this.z);
    nz = nz.redIAdd(nz);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._threeDbl = function _threeDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 15A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a
    var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
    // T = M^2 - 2 * S
    var t = m.redSqr().redISub(s).redISub(s);
    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2 * Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
    // 3M + 5S

    // delta = Z1^2
    var delta = this.z.redSqr();
    // gamma = Y1^2
    var gamma = this.y.redSqr();
    // beta = X1 * gamma
    var beta = this.x.redMul(gamma);
    // alpha = 3 * (X1 - delta) * (X1 + delta)
    var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
    alpha = alpha.redAdd(alpha).redIAdd(alpha);
    // X3 = alpha^2 - 8 * beta
    var beta4 = beta.redIAdd(beta);
    beta4 = beta4.redIAdd(beta4);
    var beta8 = beta4.redAdd(beta4);
    nx = alpha.redSqr().redISub(beta8);
    // Z3 = (Y1 + Z1)^2 - gamma - delta
    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
    // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
    var ggamma8 = gamma.redSqr();
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._dbl = function _dbl() {
  var a = this.curve.a;

  // 4M + 6S + 10A
  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  var jx2 = jx.redSqr();
  var jy2 = jy.redSqr();

  var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

  var jxd4 = jx.redAdd(jx);
  jxd4 = jxd4.redIAdd(jxd4);
  var t1 = jxd4.redMul(jy2);
  var nx = c.redSqr().redISub(t1.redAdd(t1));
  var t2 = t1.redISub(nx);

  var jyd8 = jy2.redSqr();
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  var ny = c.redMul(t2).redISub(jyd8);
  var nz = jy.redAdd(jy).redMul(jz);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.trpl = function trpl() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);

  // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
  // 5M + 10S + ...

  // XX = X1^2
  var xx = this.x.redSqr();
  // YY = Y1^2
  var yy = this.y.redSqr();
  // ZZ = Z1^2
  var zz = this.z.redSqr();
  // YYYY = YY^2
  var yyyy = yy.redSqr();
  // M = 3 * XX + a * ZZ2; a = 0
  var m = xx.redAdd(xx).redIAdd(xx);
  // MM = M^2
  var mm = m.redSqr();
  // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
  var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
  e = e.redIAdd(e);
  e = e.redAdd(e).redIAdd(e);
  e = e.redISub(mm);
  // EE = E^2
  var ee = e.redSqr();
  // T = 16*YYYY
  var t = yyyy.redIAdd(yyyy);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  // U = (M + E)^2 - MM - EE - T
  var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
  // X3 = 4 * (X1 * EE - 4 * YY * U)
  var yyu4 = yy.redMul(u);
  yyu4 = yyu4.redIAdd(yyu4);
  yyu4 = yyu4.redIAdd(yyu4);
  var nx = this.x.redMul(ee).redISub(yyu4);
  nx = nx.redIAdd(nx);
  nx = nx.redIAdd(nx);
  // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
  var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  // Z3 = (Z1 + E)^2 - ZZ - EE
  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mul = function mul(k, kbase) {
  k = new BN(k, kbase);

  return this.curve._wnafMul(this, k);
};

JPoint.prototype.eq = function eq(p) {
  if (p.type === 'affine')
    return this.eq(p.toJ());

  if (this === p)
    return true;

  // x1 * z2^2 == x2 * z1^2
  var z2 = this.z.redSqr();
  var pz2 = p.z.redSqr();
  if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
    return false;

  // y1 * z2^3 == y2 * z1^3
  var z3 = z2.redMul(this.z);
  var pz3 = pz2.redMul(p.z);
  return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
};

JPoint.prototype.eqXToP = function eqXToP(x) {
  var zs = this.z.redSqr();
  var rx = x.toRed(this.curve.red).redMul(zs);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(zs);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
  return false;
};

JPoint.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC JPoint Infinity>';
  return '<EC JPoint x: ' + this.x.toString(16, 2) +
      ' y: ' + this.y.toString(16, 2) +
      ' z: ' + this.z.toString(16, 2) + '>';
};

JPoint.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curves = exports;

var hash = __webpack_require__(44);
var elliptic = __webpack_require__(5);

var assert = elliptic.utils.assert;

function PresetCurve(options) {
  if (options.type === 'short')
    this.curve = new elliptic.curve.short(options);
  else if (options.type === 'edwards')
    this.curve = new elliptic.curve.edwards(options);
  else
    this.curve = new elliptic.curve.mont(options);
  this.g = this.curve.g;
  this.n = this.curve.n;
  this.hash = options.hash;

  assert(this.g.validate(), 'Invalid curve');
  assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
}
curves.PresetCurve = PresetCurve;

function defineCurve(name, options) {
  Object.defineProperty(curves, name, {
    configurable: true,
    enumerable: true,
    get: function() {
      var curve = new PresetCurve(options);
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        value: curve
      });
      return curve;
    }
  });
}

defineCurve('p192', {
  type: 'short',
  prime: 'p192',
  p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
  b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
  n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
  hash: hash.sha256,
  gRed: false,
  g: [
    '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
    '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811'
  ]
});

defineCurve('p224', {
  type: 'short',
  prime: 'p224',
  p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
  b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
  n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
  hash: hash.sha256,
  gRed: false,
  g: [
    'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
    'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34'
  ]
});

defineCurve('p256', {
  type: 'short',
  prime: null,
  p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
  a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
  b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
  n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
  hash: hash.sha256,
  gRed: false,
  g: [
    '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5'
  ]
});

defineCurve('p384', {
  type: 'short',
  prime: null,
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 ffffffff',
  a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 fffffffc',
  b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' +
     '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
  n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' +
     'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
  hash: hash.sha384,
  gRed: false,
  g: [
    'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' +
    '5502f25d bf55296c 3a545e38 72760ab7',
    '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' +
    '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f'
  ]
});

defineCurve('p521', {
  type: 'short',
  prime: null,
  p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff',
  a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff fffffffc',
  b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' +
     '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' +
     '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
  n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' +
     'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
  hash: hash.sha512,
  gRed: false,
  g: [
    '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' +
    '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' +
    'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
    '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' +
    '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' +
    '3fad0761 353c7086 a272c240 88be9476 9fd16650'
  ]
});

defineCurve('curve25519', {
  type: 'mont',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '76d06',
  b: '1',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash.sha256,
  gRed: false,
  g: [
    '9'
  ]
});

defineCurve('ed25519', {
  type: 'edwards',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '-1',
  c: '1',
  // -121665 * (121666^(-1)) (mod P)
  d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash.sha256,
  gRed: false,
  g: [
    '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

    // 4/5
    '6666666666666666666666666666666666666666666666666666666666666658'
  ]
});

var pre;
try {
  pre = __webpack_require__(160);
} catch (e) {
  pre = undefined;
}

defineCurve('secp256k1', {
  type: 'short',
  prime: 'k256',
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
  a: '0',
  b: '7',
  n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
  h: '1',
  hash: hash.sha256,

  // Precomputed endomorphism
  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
  basis: [
    {
      a: '3086d221a7d46bcde86c90e49284eb15',
      b: '-e4437ed6010e88286f547fa90abfe4c3'
    },
    {
      a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
      b: '3086d221a7d46bcde86c90e49284eb15'
    }
  ],

  gRed: false,
  g: [
    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
    pre
  ]
});


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(3);
var HmacDRBG = __webpack_require__(170);
var elliptic = __webpack_require__(5);
var utils = elliptic.utils;
var assert = utils.assert;

var KeyPair = __webpack_require__(155);
var Signature = __webpack_require__(156);

function EC(options) {
  if (!(this instanceof EC))
    return new EC(options);

  // Shortcut `elliptic.ec(curve-name)`
  if (typeof options === 'string') {
    assert(elliptic.curves.hasOwnProperty(options), 'Unknown curve ' + options);

    options = elliptic.curves[options];
  }

  // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
  if (options instanceof elliptic.curves.PresetCurve)
    options = { curve: options };

  this.curve = options.curve.curve;
  this.n = this.curve.n;
  this.nh = this.n.ushrn(1);
  this.g = this.curve.g;

  // Point on curve
  this.g = options.curve.g;
  this.g.precompute(options.curve.n.bitLength() + 1);

  // Hash for function for DRBG
  this.hash = options.hash || options.curve.hash;
}
module.exports = EC;

EC.prototype.keyPair = function keyPair(options) {
  return new KeyPair(this, options);
};

EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
  return KeyPair.fromPrivate(this, priv, enc);
};

EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
  return KeyPair.fromPublic(this, pub, enc);
};

EC.prototype.genKeyPair = function genKeyPair(options) {
  if (!options)
    options = {};

  // Instantiate Hmac_DRBG
  var drbg = new HmacDRBG({
    hash: this.hash,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
    entropy: options.entropy || elliptic.rand(this.hash.hmacStrength),
    entropyEnc: options.entropy && options.entropyEnc || 'utf8',
    nonce: this.n.toArray()
  });

  var bytes = this.n.byteLength();
  var ns2 = this.n.sub(new BN(2));
  do {
    var priv = new BN(drbg.generate(bytes));
    if (priv.cmp(ns2) > 0)
      continue;

    priv.iaddn(1);
    return this.keyFromPrivate(priv);
  } while (true);
};

EC.prototype._truncateToN = function truncateToN(msg, truncOnly) {
  var delta = msg.byteLength() * 8 - this.n.bitLength();
  if (delta > 0)
    msg = msg.ushrn(delta);
  if (!truncOnly && msg.cmp(this.n) >= 0)
    return msg.sub(this.n);
  else
    return msg;
};

EC.prototype.sign = function sign(msg, key, enc, options) {
  if (typeof enc === 'object') {
    options = enc;
    enc = null;
  }
  if (!options)
    options = {};

  key = this.keyFromPrivate(key, enc);
  msg = this._truncateToN(new BN(msg, 16));

  // Zero-extend key to provide enough entropy
  var bytes = this.n.byteLength();
  var bkey = key.getPrivate().toArray('be', bytes);

  // Zero-extend nonce to have the same byte size as N
  var nonce = msg.toArray('be', bytes);

  // Instantiate Hmac_DRBG
  var drbg = new HmacDRBG({
    hash: this.hash,
    entropy: bkey,
    nonce: nonce,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8'
  });

  // Number of bytes to generate
  var ns1 = this.n.sub(new BN(1));

  for (var iter = 0; true; iter++) {
    var k = options.k ?
        options.k(iter) :
        new BN(drbg.generate(this.n.byteLength()));
    k = this._truncateToN(k, true);
    if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
      continue;

    var kp = this.g.mul(k);
    if (kp.isInfinity())
      continue;

    var kpX = kp.getX();
    var r = kpX.umod(this.n);
    if (r.cmpn(0) === 0)
      continue;

    var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
    s = s.umod(this.n);
    if (s.cmpn(0) === 0)
      continue;

    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
                        (kpX.cmp(r) !== 0 ? 2 : 0);

    // Use complement of `s`, if it is > `n / 2`
    if (options.canonical && s.cmp(this.nh) > 0) {
      s = this.n.sub(s);
      recoveryParam ^= 1;
    }

    return new Signature({ r: r, s: s, recoveryParam: recoveryParam });
  }
};

EC.prototype.verify = function verify(msg, signature, key, enc) {
  msg = this._truncateToN(new BN(msg, 16));
  key = this.keyFromPublic(key, enc);
  signature = new Signature(signature, 'hex');

  // Perform primitive values validation
  var r = signature.r;
  var s = signature.s;
  if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
    return false;
  if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
    return false;

  // Validate signature
  var sinv = s.invm(this.n);
  var u1 = sinv.mul(msg).umod(this.n);
  var u2 = sinv.mul(r).umod(this.n);

  if (!this.curve._maxwellTrick) {
    var p = this.g.mulAdd(u1, key.getPublic(), u2);
    if (p.isInfinity())
      return false;

    return p.getX().umod(this.n).cmp(r) === 0;
  }

  // NOTE: Greg Maxwell's trick, inspired by:
  // https://git.io/vad3K

  var p = this.g.jmulAdd(u1, key.getPublic(), u2);
  if (p.isInfinity())
    return false;

  // Compare `p.x` of Jacobian point with `r`,
  // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
  // inverse of `p.z^2`
  return p.eqXToP(r);
};

EC.prototype.recoverPubKey = function(msg, signature, j, enc) {
  assert((3 & j) === j, 'The recovery param is more than two bits');
  signature = new Signature(signature, enc);

  var n = this.n;
  var e = new BN(msg);
  var r = signature.r;
  var s = signature.s;

  // A set LSB signifies that the y-coordinate is odd
  var isYOdd = j & 1;
  var isSecondKey = j >> 1;
  if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
    throw new Error('Unable to find sencond key candinate');

  // 1.1. Let x = r + jn.
  if (isSecondKey)
    r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
  else
    r = this.curve.pointFromX(r, isYOdd);

  var rInv = signature.r.invm(n);
  var s1 = n.sub(e).mul(rInv).umod(n);
  var s2 = s.mul(rInv).umod(n);

  // 1.6.1 Compute Q = r^-1 (sR -  eG)
  //               Q = r^-1 (sR + -eG)
  return this.g.mulAdd(s1, r, s2);
};

EC.prototype.getKeyRecoveryParam = function(e, signature, Q, enc) {
  signature = new Signature(signature, enc);
  if (signature.recoveryParam !== null)
    return signature.recoveryParam;

  for (var i = 0; i < 4; i++) {
    var Qprime;
    try {
      Qprime = this.recoverPubKey(e, signature, i);
    } catch (e) {
      continue;
    }

    if (Qprime.eq(Q))
      return i;
  }
  throw new Error('Unable to find valid recovery factor');
};


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(3);
var elliptic = __webpack_require__(5);
var utils = elliptic.utils;
var assert = utils.assert;

function KeyPair(ec, options) {
  this.ec = ec;
  this.priv = null;
  this.pub = null;

  // KeyPair(ec, { priv: ..., pub: ... })
  if (options.priv)
    this._importPrivate(options.priv, options.privEnc);
  if (options.pub)
    this._importPublic(options.pub, options.pubEnc);
}
module.exports = KeyPair;

KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
  if (pub instanceof KeyPair)
    return pub;

  return new KeyPair(ec, {
    pub: pub,
    pubEnc: enc
  });
};

KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
  if (priv instanceof KeyPair)
    return priv;

  return new KeyPair(ec, {
    priv: priv,
    privEnc: enc
  });
};

KeyPair.prototype.validate = function validate() {
  var pub = this.getPublic();

  if (pub.isInfinity())
    return { result: false, reason: 'Invalid public key' };
  if (!pub.validate())
    return { result: false, reason: 'Public key is not a point' };
  if (!pub.mul(this.ec.curve.n).isInfinity())
    return { result: false, reason: 'Public key * N != O' };

  return { result: true, reason: null };
};

KeyPair.prototype.getPublic = function getPublic(compact, enc) {
  // compact is optional argument
  if (typeof compact === 'string') {
    enc = compact;
    compact = null;
  }

  if (!this.pub)
    this.pub = this.ec.g.mul(this.priv);

  if (!enc)
    return this.pub;

  return this.pub.encode(enc, compact);
};

KeyPair.prototype.getPrivate = function getPrivate(enc) {
  if (enc === 'hex')
    return this.priv.toString(16, 2);
  else
    return this.priv;
};

KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
  this.priv = new BN(key, enc || 16);

  // Ensure that the priv won't be bigger than n, otherwise we may fail
  // in fixed multiplication method
  this.priv = this.priv.umod(this.ec.curve.n);
};

KeyPair.prototype._importPublic = function _importPublic(key, enc) {
  if (key.x || key.y) {
    // Montgomery points only have an `x` coordinate.
    // Weierstrass/Edwards points on the other hand have both `x` and
    // `y` coordinates.
    if (this.ec.curve.type === 'mont') {
      assert(key.x, 'Need x coordinate');
    } else if (this.ec.curve.type === 'short' ||
               this.ec.curve.type === 'edwards') {
      assert(key.x && key.y, 'Need both x and y coordinate');
    }
    this.pub = this.ec.curve.point(key.x, key.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(key, enc);
};

// ECDH
KeyPair.prototype.derive = function derive(pub) {
  return pub.mul(this.priv).getX();
};

// ECDSA
KeyPair.prototype.sign = function sign(msg, enc, options) {
  return this.ec.sign(msg, this, enc, options);
};

KeyPair.prototype.verify = function verify(msg, signature) {
  return this.ec.verify(msg, signature, this);
};

KeyPair.prototype.inspect = function inspect() {
  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
         ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
};


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(3);

var elliptic = __webpack_require__(5);
var utils = elliptic.utils;
var assert = utils.assert;

function Signature(options, enc) {
  if (options instanceof Signature)
    return options;

  if (this._importDER(options, enc))
    return;

  assert(options.r && options.s, 'Signature without r or s');
  this.r = new BN(options.r, 16);
  this.s = new BN(options.s, 16);
  if (options.recoveryParam === undefined)
    this.recoveryParam = null;
  else
    this.recoveryParam = options.recoveryParam;
}
module.exports = Signature;

function Position() {
  this.place = 0;
}

function getLength(buf, p) {
  var initial = buf[p.place++];
  if (!(initial & 0x80)) {
    return initial;
  }
  var octetLen = initial & 0xf;
  var val = 0;
  for (var i = 0, off = p.place; i < octetLen; i++, off++) {
    val <<= 8;
    val |= buf[off];
  }
  p.place = off;
  return val;
}

function rmPadding(buf) {
  var i = 0;
  var len = buf.length - 1;
  while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
    i++;
  }
  if (i === 0) {
    return buf;
  }
  return buf.slice(i);
}

Signature.prototype._importDER = function _importDER(data, enc) {
  data = utils.toArray(data, enc);
  var p = new Position();
  if (data[p.place++] !== 0x30) {
    return false;
  }
  var len = getLength(data, p);
  if ((len + p.place) !== data.length) {
    return false;
  }
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var rlen = getLength(data, p);
  var r = data.slice(p.place, rlen + p.place);
  p.place += rlen;
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var slen = getLength(data, p);
  if (data.length !== slen + p.place) {
    return false;
  }
  var s = data.slice(p.place, slen + p.place);
  if (r[0] === 0 && (r[1] & 0x80)) {
    r = r.slice(1);
  }
  if (s[0] === 0 && (s[1] & 0x80)) {
    s = s.slice(1);
  }

  this.r = new BN(r);
  this.s = new BN(s);
  this.recoveryParam = null;

  return true;
};

function constructLength(arr, len) {
  if (len < 0x80) {
    arr.push(len);
    return;
  }
  var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
  arr.push(octets | 0x80);
  while (--octets) {
    arr.push((len >>> (octets << 3)) & 0xff);
  }
  arr.push(len);
}

Signature.prototype.toDER = function toDER(enc) {
  var r = this.r.toArray();
  var s = this.s.toArray();

  // Pad values
  if (r[0] & 0x80)
    r = [ 0 ].concat(r);
  // Pad values
  if (s[0] & 0x80)
    s = [ 0 ].concat(s);

  r = rmPadding(r);
  s = rmPadding(s);

  while (!s[0] && !(s[1] & 0x80)) {
    s = s.slice(1);
  }
  var arr = [ 0x02 ];
  constructLength(arr, r.length);
  arr = arr.concat(r);
  arr.push(0x02);
  constructLength(arr, s.length);
  var backHalf = arr.concat(s);
  var res = [ 0x30 ];
  constructLength(res, backHalf.length);
  res = res.concat(backHalf);
  return utils.encode(res, enc);
};


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hash = __webpack_require__(44);
var elliptic = __webpack_require__(5);
var utils = elliptic.utils;
var assert = utils.assert;
var parseBytes = utils.parseBytes;
var KeyPair = __webpack_require__(158);
var Signature = __webpack_require__(159);

function EDDSA(curve) {
  assert(curve === 'ed25519', 'only tested with ed25519 so far');

  if (!(this instanceof EDDSA))
    return new EDDSA(curve);

  var curve = elliptic.curves[curve].curve;
  this.curve = curve;
  this.g = curve.g;
  this.g.precompute(curve.n.bitLength() + 1);

  this.pointClass = curve.point().constructor;
  this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
  this.hash = hash.sha512;
}

module.exports = EDDSA;

/**
* @param {Array|String} message - message bytes
* @param {Array|String|KeyPair} secret - secret bytes or a keypair
* @returns {Signature} - signature
*/
EDDSA.prototype.sign = function sign(message, secret) {
  message = parseBytes(message);
  var key = this.keyFromSecret(secret);
  var r = this.hashInt(key.messagePrefix(), message);
  var R = this.g.mul(r);
  var Rencoded = this.encodePoint(R);
  var s_ = this.hashInt(Rencoded, key.pubBytes(), message)
               .mul(key.priv());
  var S = r.add(s_).umod(this.curve.n);
  return this.makeSignature({ R: R, S: S, Rencoded: Rencoded });
};

/**
* @param {Array} message - message bytes
* @param {Array|String|Signature} sig - sig bytes
* @param {Array|String|Point|KeyPair} pub - public key
* @returns {Boolean} - true if public key matches sig of message
*/
EDDSA.prototype.verify = function verify(message, sig, pub) {
  message = parseBytes(message);
  sig = this.makeSignature(sig);
  var key = this.keyFromPublic(pub);
  var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
  var SG = this.g.mul(sig.S());
  var RplusAh = sig.R().add(key.pub().mul(h));
  return RplusAh.eq(SG);
};

EDDSA.prototype.hashInt = function hashInt() {
  var hash = this.hash();
  for (var i = 0; i < arguments.length; i++)
    hash.update(arguments[i]);
  return utils.intFromLE(hash.digest()).umod(this.curve.n);
};

EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
  return KeyPair.fromPublic(this, pub);
};

EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
  return KeyPair.fromSecret(this, secret);
};

EDDSA.prototype.makeSignature = function makeSignature(sig) {
  if (sig instanceof Signature)
    return sig;
  return new Signature(this, sig);
};

/**
* * https://tools.ietf.org/html/draft-josefsson-eddsa-ed25519-03#section-5.2
*
* EDDSA defines methods for encoding and decoding points and integers. These are
* helper convenience methods, that pass along to utility functions implied
* parameters.
*
*/
EDDSA.prototype.encodePoint = function encodePoint(point) {
  var enc = point.getY().toArray('le', this.encodingLength);
  enc[this.encodingLength - 1] |= point.getX().isOdd() ? 0x80 : 0;
  return enc;
};

EDDSA.prototype.decodePoint = function decodePoint(bytes) {
  bytes = utils.parseBytes(bytes);

  var lastIx = bytes.length - 1;
  var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80);
  var xIsOdd = (bytes[lastIx] & 0x80) !== 0;

  var y = utils.intFromLE(normed);
  return this.curve.pointFromY(y, xIsOdd);
};

EDDSA.prototype.encodeInt = function encodeInt(num) {
  return num.toArray('le', this.encodingLength);
};

EDDSA.prototype.decodeInt = function decodeInt(bytes) {
  return utils.intFromLE(bytes);
};

EDDSA.prototype.isPoint = function isPoint(val) {
  return val instanceof this.pointClass;
};


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elliptic = __webpack_require__(5);
var utils = elliptic.utils;
var assert = utils.assert;
var parseBytes = utils.parseBytes;
var cachedProperty = utils.cachedProperty;

/**
* @param {EDDSA} eddsa - instance
* @param {Object} params - public/private key parameters
*
* @param {Array<Byte>} [params.secret] - secret seed bytes
* @param {Point} [params.pub] - public key point (aka `A` in eddsa terms)
* @param {Array<Byte>} [params.pub] - public key point encoded as bytes
*
*/
function KeyPair(eddsa, params) {
  this.eddsa = eddsa;
  this._secret = parseBytes(params.secret);
  if (eddsa.isPoint(params.pub))
    this._pub = params.pub;
  else
    this._pubBytes = parseBytes(params.pub);
}

KeyPair.fromPublic = function fromPublic(eddsa, pub) {
  if (pub instanceof KeyPair)
    return pub;
  return new KeyPair(eddsa, { pub: pub });
};

KeyPair.fromSecret = function fromSecret(eddsa, secret) {
  if (secret instanceof KeyPair)
    return secret;
  return new KeyPair(eddsa, { secret: secret });
};

KeyPair.prototype.secret = function secret() {
  return this._secret;
};

cachedProperty(KeyPair, 'pubBytes', function pubBytes() {
  return this.eddsa.encodePoint(this.pub());
});

cachedProperty(KeyPair, 'pub', function pub() {
  if (this._pubBytes)
    return this.eddsa.decodePoint(this._pubBytes);
  return this.eddsa.g.mul(this.priv());
});

cachedProperty(KeyPair, 'privBytes', function privBytes() {
  var eddsa = this.eddsa;
  var hash = this.hash();
  var lastIx = eddsa.encodingLength - 1;

  var a = hash.slice(0, eddsa.encodingLength);
  a[0] &= 248;
  a[lastIx] &= 127;
  a[lastIx] |= 64;

  return a;
});

cachedProperty(KeyPair, 'priv', function priv() {
  return this.eddsa.decodeInt(this.privBytes());
});

cachedProperty(KeyPair, 'hash', function hash() {
  return this.eddsa.hash().update(this.secret()).digest();
});

cachedProperty(KeyPair, 'messagePrefix', function messagePrefix() {
  return this.hash().slice(this.eddsa.encodingLength);
});

KeyPair.prototype.sign = function sign(message) {
  assert(this._secret, 'KeyPair can only verify');
  return this.eddsa.sign(message, this);
};

KeyPair.prototype.verify = function verify(message, sig) {
  return this.eddsa.verify(message, sig, this);
};

KeyPair.prototype.getSecret = function getSecret(enc) {
  assert(this._secret, 'KeyPair is public only');
  return utils.encode(this.secret(), enc);
};

KeyPair.prototype.getPublic = function getPublic(enc) {
  return utils.encode(this.pubBytes(), enc);
};

module.exports = KeyPair;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(3);
var elliptic = __webpack_require__(5);
var utils = elliptic.utils;
var assert = utils.assert;
var cachedProperty = utils.cachedProperty;
var parseBytes = utils.parseBytes;

/**
* @param {EDDSA} eddsa - eddsa instance
* @param {Array<Bytes>|Object} sig -
* @param {Array<Bytes>|Point} [sig.R] - R point as Point or bytes
* @param {Array<Bytes>|bn} [sig.S] - S scalar as bn or bytes
* @param {Array<Bytes>} [sig.Rencoded] - R point encoded
* @param {Array<Bytes>} [sig.Sencoded] - S scalar encoded
*/
function Signature(eddsa, sig) {
  this.eddsa = eddsa;

  if (typeof sig !== 'object')
    sig = parseBytes(sig);

  if (Array.isArray(sig)) {
    sig = {
      R: sig.slice(0, eddsa.encodingLength),
      S: sig.slice(eddsa.encodingLength)
    };
  }

  assert(sig.R && sig.S, 'Signature without R or S');

  if (eddsa.isPoint(sig.R))
    this._R = sig.R;
  if (sig.S instanceof BN)
    this._S = sig.S;

  this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
  this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
}

cachedProperty(Signature, 'S', function S() {
  return this.eddsa.decodeInt(this.Sencoded());
});

cachedProperty(Signature, 'R', function R() {
  return this.eddsa.decodePoint(this.Rencoded());
});

cachedProperty(Signature, 'Rencoded', function Rencoded() {
  return this.eddsa.encodePoint(this.R());
});

cachedProperty(Signature, 'Sencoded', function Sencoded() {
  return this.eddsa.encodeInt(this.S());
});

Signature.prototype.toBytes = function toBytes() {
  return this.Rencoded().concat(this.Sencoded());
};

Signature.prototype.toHex = function toHex() {
  return utils.encode(this.toBytes(), 'hex').toUpperCase();
};

module.exports = Signature;


/***/ }),
/* 160 */
/***/ (function(module, exports) {

module.exports = {
  doubles: {
    step: 4,
    points: [
      [
        'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
        'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821'
      ],
      [
        '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
        '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf'
      ],
      [
        '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
        'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695'
      ],
      [
        '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
        '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9'
      ],
      [
        '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
        '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36'
      ],
      [
        '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
        '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f'
      ],
      [
        'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
        '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999'
      ],
      [
        '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
        'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09'
      ],
      [
        'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
        '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d'
      ],
      [
        'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
        'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088'
      ],
      [
        'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
        '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d'
      ],
      [
        '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
        '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8'
      ],
      [
        '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
        '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a'
      ],
      [
        '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
        '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453'
      ],
      [
        '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
        '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160'
      ],
      [
        '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
        '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0'
      ],
      [
        '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
        '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6'
      ],
      [
        '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
        '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589'
      ],
      [
        '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
        'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17'
      ],
      [
        'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
        '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda'
      ],
      [
        'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
        '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd'
      ],
      [
        '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
        '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2'
      ],
      [
        '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
        '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6'
      ],
      [
        'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
        '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f'
      ],
      [
        '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
        'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01'
      ],
      [
        'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
        '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3'
      ],
      [
        'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
        'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f'
      ],
      [
        'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
        '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7'
      ],
      [
        'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
        'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78'
      ],
      [
        'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
        '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1'
      ],
      [
        '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
        'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150'
      ],
      [
        '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
        '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82'
      ],
      [
        'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
        '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc'
      ],
      [
        '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
        'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b'
      ],
      [
        'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
        '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51'
      ],
      [
        'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
        '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45'
      ],
      [
        'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
        'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120'
      ],
      [
        '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
        '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84'
      ],
      [
        '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
        '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d'
      ],
      [
        '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
        'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d'
      ],
      [
        '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
        '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8'
      ],
      [
        'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
        '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8'
      ],
      [
        '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
        '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac'
      ],
      [
        '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
        'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f'
      ],
      [
        '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
        '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962'
      ],
      [
        'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
        '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907'
      ],
      [
        '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
        'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec'
      ],
      [
        'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
        'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d'
      ],
      [
        'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
        '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414'
      ],
      [
        '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
        'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd'
      ],
      [
        '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
        'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0'
      ],
      [
        'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
        '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811'
      ],
      [
        'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
        '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1'
      ],
      [
        'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
        '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c'
      ],
      [
        '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
        'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73'
      ],
      [
        '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
        '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd'
      ],
      [
        'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
        'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405'
      ],
      [
        '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
        'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589'
      ],
      [
        '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
        '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e'
      ],
      [
        '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
        '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27'
      ],
      [
        'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
        'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1'
      ],
      [
        '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
        '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482'
      ],
      [
        '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
        '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945'
      ],
      [
        'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
        '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573'
      ],
      [
        'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
        'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82'
      ]
    ]
  },
  naf: {
    wnd: 7,
    points: [
      [
        'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
        '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672'
      ],
      [
        '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
        'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6'
      ],
      [
        '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
        '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da'
      ],
      [
        'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
        'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37'
      ],
      [
        '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
        'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b'
      ],
      [
        'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
        'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81'
      ],
      [
        'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
        '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58'
      ],
      [
        'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
        '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77'
      ],
      [
        '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
        '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a'
      ],
      [
        '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
        '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c'
      ],
      [
        '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
        '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67'
      ],
      [
        '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
        '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402'
      ],
      [
        'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
        'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55'
      ],
      [
        'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
        '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482'
      ],
      [
        '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
        'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82'
      ],
      [
        '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
        'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396'
      ],
      [
        '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
        '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49'
      ],
      [
        '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
        '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf'
      ],
      [
        '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
        '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a'
      ],
      [
        '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
        'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7'
      ],
      [
        'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
        'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933'
      ],
      [
        '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
        '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a'
      ],
      [
        '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
        '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6'
      ],
      [
        'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
        'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37'
      ],
      [
        '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
        '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e'
      ],
      [
        'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
        'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6'
      ],
      [
        'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
        'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476'
      ],
      [
        '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
        '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40'
      ],
      [
        '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
        '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61'
      ],
      [
        '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
        '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683'
      ],
      [
        'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
        '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5'
      ],
      [
        '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
        '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b'
      ],
      [
        'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
        '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417'
      ],
      [
        '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
        'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868'
      ],
      [
        '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
        'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a'
      ],
      [
        'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
        'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6'
      ],
      [
        '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
        '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996'
      ],
      [
        '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
        'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e'
      ],
      [
        'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
        'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d'
      ],
      [
        '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
        '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2'
      ],
      [
        '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
        'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e'
      ],
      [
        '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
        '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437'
      ],
      [
        '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
        'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311'
      ],
      [
        'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
        '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4'
      ],
      [
        '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
        '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575'
      ],
      [
        '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
        'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d'
      ],
      [
        '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
        'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d'
      ],
      [
        'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
        'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629'
      ],
      [
        'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
        'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06'
      ],
      [
        '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
        '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374'
      ],
      [
        '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
        '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee'
      ],
      [
        'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
        '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1'
      ],
      [
        'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
        'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b'
      ],
      [
        '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
        '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661'
      ],
      [
        '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
        '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6'
      ],
      [
        'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
        '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e'
      ],
      [
        '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
        '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d'
      ],
      [
        'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
        'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc'
      ],
      [
        '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
        'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4'
      ],
      [
        '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
        '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c'
      ],
      [
        'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
        '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b'
      ],
      [
        'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
        '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913'
      ],
      [
        '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
        '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154'
      ],
      [
        '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
        '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865'
      ],
      [
        '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
        'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc'
      ],
      [
        '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
        'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224'
      ],
      [
        '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
        '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e'
      ],
      [
        '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
        '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6'
      ],
      [
        '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
        '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511'
      ],
      [
        '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
        'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b'
      ],
      [
        'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
        'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2'
      ],
      [
        '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
        'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c'
      ],
      [
        'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
        '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3'
      ],
      [
        'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
        '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d'
      ],
      [
        'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
        '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700'
      ],
      [
        'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
        '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4'
      ],
      [
        '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
        'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196'
      ],
      [
        '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
        '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4'
      ],
      [
        '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
        'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257'
      ],
      [
        'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
        'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13'
      ],
      [
        'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
        '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096'
      ],
      [
        'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
        'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38'
      ],
      [
        'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
        '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f'
      ],
      [
        '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
        '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448'
      ],
      [
        'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
        '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a'
      ],
      [
        'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
        '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4'
      ],
      [
        '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
        '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437'
      ],
      [
        '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
        'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7'
      ],
      [
        'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
        '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d'
      ],
      [
        'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
        '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a'
      ],
      [
        'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
        '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54'
      ],
      [
        '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
        '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77'
      ],
      [
        'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
        'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517'
      ],
      [
        '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
        'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10'
      ],
      [
        'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
        'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125'
      ],
      [
        'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
        '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e'
      ],
      [
        '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
        'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1'
      ],
      [
        'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
        '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2'
      ],
      [
        'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
        '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423'
      ],
      [
        'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
        '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8'
      ],
      [
        '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
        'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758'
      ],
      [
        '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
        'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375'
      ],
      [
        'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
        '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d'
      ],
      [
        '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
        'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec'
      ],
      [
        '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
        '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0'
      ],
      [
        '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
        'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c'
      ],
      [
        'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
        'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4'
      ],
      [
        '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
        'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f'
      ],
      [
        '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
        '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649'
      ],
      [
        '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
        'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826'
      ],
      [
        '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
        '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5'
      ],
      [
        'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
        'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87'
      ],
      [
        '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
        '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b'
      ],
      [
        'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
        '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc'
      ],
      [
        '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
        '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c'
      ],
      [
        'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
        'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f'
      ],
      [
        'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
        '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a'
      ],
      [
        'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
        'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46'
      ],
      [
        '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
        'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f'
      ],
      [
        '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
        '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03'
      ],
      [
        '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
        'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08'
      ],
      [
        '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
        '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8'
      ],
      [
        '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
        '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373'
      ],
      [
        '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
        'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3'
      ],
      [
        '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
        '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8'
      ],
      [
        '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
        '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1'
      ],
      [
        '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
        '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9'
      ]
    ]
  }
};


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = exports;
var BN = __webpack_require__(3);
var minAssert = __webpack_require__(6);
var minUtils = __webpack_require__(76);

utils.assert = minAssert;
utils.toArray = minUtils.toArray;
utils.zero2 = minUtils.zero2;
utils.toHex = minUtils.toHex;
utils.encode = minUtils.encode;

// Represent num in a w-NAF form
function getNAF(num, w) {
  var naf = [];
  var ws = 1 << (w + 1);
  var k = num.clone();
  while (k.cmpn(1) >= 0) {
    var z;
    if (k.isOdd()) {
      var mod = k.andln(ws - 1);
      if (mod > (ws >> 1) - 1)
        z = (ws >> 1) - mod;
      else
        z = mod;
      k.isubn(z);
    } else {
      z = 0;
    }
    naf.push(z);

    // Optimization, shift by word if possible
    var shift = (k.cmpn(0) !== 0 && k.andln(ws - 1) === 0) ? (w + 1) : 1;
    for (var i = 1; i < shift; i++)
      naf.push(0);
    k.iushrn(shift);
  }

  return naf;
}
utils.getNAF = getNAF;

// Represent k1, k2 in a Joint Sparse Form
function getJSF(k1, k2) {
  var jsf = [
    [],
    []
  ];

  k1 = k1.clone();
  k2 = k2.clone();
  var d1 = 0;
  var d2 = 0;
  while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {

    // First phase
    var m14 = (k1.andln(3) + d1) & 3;
    var m24 = (k2.andln(3) + d2) & 3;
    if (m14 === 3)
      m14 = -1;
    if (m24 === 3)
      m24 = -1;
    var u1;
    if ((m14 & 1) === 0) {
      u1 = 0;
    } else {
      var m8 = (k1.andln(7) + d1) & 7;
      if ((m8 === 3 || m8 === 5) && m24 === 2)
        u1 = -m14;
      else
        u1 = m14;
    }
    jsf[0].push(u1);

    var u2;
    if ((m24 & 1) === 0) {
      u2 = 0;
    } else {
      var m8 = (k2.andln(7) + d2) & 7;
      if ((m8 === 3 || m8 === 5) && m14 === 2)
        u2 = -m24;
      else
        u2 = m24;
    }
    jsf[1].push(u2);

    // Second phase
    if (2 * d1 === u1 + 1)
      d1 = 1 - d1;
    if (2 * d2 === u2 + 1)
      d2 = 1 - d2;
    k1.iushrn(1);
    k2.iushrn(1);
  }

  return jsf;
}
utils.getJSF = getJSF;

function cachedProperty(obj, name, computer) {
  var key = '_' + name;
  obj.prototype[name] = function cachedProperty() {
    return this[key] !== undefined ? this[key] :
           this[key] = computer.call(this);
  };
}
utils.cachedProperty = cachedProperty;

function parseBytes(bytes) {
  return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
                                     bytes;
}
utils.parseBytes = parseBytes;

function intFromLE(bytes) {
  return new BN(bytes, 'hex', 'le');
}
utils.intFromLE = intFromLE;



/***/ }),
/* 162 */
/***/ (function(module, exports) {

module.exports = {"_args":[[{"raw":"elliptic@^6.0.0","scope":null,"escapedName":"elliptic","name":"elliptic","rawSpec":"^6.0.0","spec":">=6.0.0 <7.0.0","type":"range"},"C:\\Users\\Jean-Baptiste\\WebstormProjects\\pacman_master\\node_modules\\browserify-sign"]],"_from":"elliptic@>=6.0.0 <7.0.0","_id":"elliptic@6.4.0","_inCache":true,"_installable":true,"_location":"/elliptic","_nodeVersion":"7.0.0","_npmOperationalInternal":{"host":"packages-18-east.internal.npmjs.com","tmp":"tmp/elliptic-6.4.0.tgz_1487798866428_0.30510620190761983"},"_npmUser":{"name":"indutny","email":"fedor@indutny.com"},"_npmVersion":"3.10.8","_phantomChildren":{},"_requested":{"raw":"elliptic@^6.0.0","scope":null,"escapedName":"elliptic","name":"elliptic","rawSpec":"^6.0.0","spec":">=6.0.0 <7.0.0","type":"range"},"_requiredBy":["/browserify-sign","/create-ecdh"],"_resolved":"https://registry.npmjs.org/elliptic/-/elliptic-6.4.0.tgz","_shasum":"cac9af8762c85836187003c8dfe193e5e2eae5df","_shrinkwrap":null,"_spec":"elliptic@^6.0.0","_where":"C:\\Users\\Jean-Baptiste\\WebstormProjects\\pacman_master\\node_modules\\browserify-sign","author":{"name":"Fedor Indutny","email":"fedor@indutny.com"},"bugs":{"url":"https://github.com/indutny/elliptic/issues"},"dependencies":{"bn.js":"^4.4.0","brorand":"^1.0.1","hash.js":"^1.0.0","hmac-drbg":"^1.0.0","inherits":"^2.0.1","minimalistic-assert":"^1.0.0","minimalistic-crypto-utils":"^1.0.0"},"description":"EC cryptography","devDependencies":{"brfs":"^1.4.3","coveralls":"^2.11.3","grunt":"^0.4.5","grunt-browserify":"^5.0.0","grunt-cli":"^1.2.0","grunt-contrib-connect":"^1.0.0","grunt-contrib-copy":"^1.0.0","grunt-contrib-uglify":"^1.0.1","grunt-mocha-istanbul":"^3.0.1","grunt-saucelabs":"^8.6.2","istanbul":"^0.4.2","jscs":"^2.9.0","jshint":"^2.6.0","mocha":"^2.1.0"},"directories":{},"dist":{"shasum":"cac9af8762c85836187003c8dfe193e5e2eae5df","tarball":"https://registry.npmjs.org/elliptic/-/elliptic-6.4.0.tgz"},"files":["lib"],"gitHead":"6b0d2b76caae91471649c8e21f0b1d3ba0f96090","homepage":"https://github.com/indutny/elliptic","keywords":["EC","Elliptic","curve","Cryptography"],"license":"MIT","main":"lib/elliptic.js","maintainers":[{"name":"indutny","email":"fedor@indutny.com"}],"name":"elliptic","optionalDependencies":{},"readme":"ERROR: No README data found!","repository":{"type":"git","url":"git+ssh://git@github.com/indutny/elliptic.git"},"scripts":{"jscs":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","jshint":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","lint":"npm run jscs && npm run jshint","test":"npm run lint && npm run unit","unit":"istanbul test _mocha --reporter=spec test/index.js","version":"grunt dist && git add dist/"},"version":"6.4.0"}

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
var Transform = __webpack_require__(33).Transform
var inherits = __webpack_require__(0)

function HashBase (blockSize) {
  Transform.call(this)

  this._block = new Buffer(blockSize)
  this._blockSize = blockSize
  this._blockOffset = 0
  this._length = [0, 0, 0, 0]

  this._finalized = false
}

inherits(HashBase, Transform)

HashBase.prototype._transform = function (chunk, encoding, callback) {
  var error = null
  try {
    if (encoding !== 'buffer') chunk = new Buffer(chunk, encoding)
    this.update(chunk)
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype._flush = function (callback) {
  var error = null
  try {
    this.push(this._digest())
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype.update = function (data, encoding) {
  if (!Buffer.isBuffer(data) && typeof data !== 'string') throw new TypeError('Data must be a string or a buffer')
  if (this._finalized) throw new Error('Digest already called')
  if (!Buffer.isBuffer(data)) data = new Buffer(data, encoding || 'binary')

  // consume data
  var block = this._block
  var offset = 0
  while (this._blockOffset + data.length - offset >= this._blockSize) {
    for (var i = this._blockOffset; i < this._blockSize;) block[i++] = data[offset++]
    this._update()
    this._blockOffset = 0
  }
  while (offset < data.length) block[this._blockOffset++] = data[offset++]

  // update length
  for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
    this._length[j] += carry
    carry = (this._length[j] / 0x0100000000) | 0
    if (carry > 0) this._length[j] -= 0x0100000000 * carry
  }

  return this
}

HashBase.prototype._update = function (data) {
  throw new Error('_update is not implemented')
}

HashBase.prototype.digest = function (encoding) {
  if (this._finalized) throw new Error('Digest already called')
  this._finalized = true

  var digest = this._digest()
  if (encoding !== undefined) digest = digest.toString(encoding)
  return digest
}

HashBase.prototype._digest = function () {
  throw new Error('_digest is not implemented')
}

module.exports = HashBase

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(8);
var assert = __webpack_require__(6);

function Hmac(hash, key, enc) {
  if (!(this instanceof Hmac))
    return new Hmac(hash, key, enc);
  this.Hash = hash;
  this.blockSize = hash.blockSize / 8;
  this.outSize = hash.outSize / 8;
  this.inner = null;
  this.outer = null;

  this._init(utils.toArray(key, enc));
}
module.exports = Hmac;

Hmac.prototype._init = function init(key) {
  // Shorten key, if needed
  if (key.length > this.blockSize)
    key = new this.Hash().update(key).digest();
  assert(key.length <= this.blockSize);

  // Add padding to key
  for (var i = key.length; i < this.blockSize; i++)
    key.push(0);

  for (i = 0; i < key.length; i++)
    key[i] ^= 0x36;
  this.inner = new this.Hash().update(key);

  // 0x36 ^ 0x5c = 0x6a
  for (i = 0; i < key.length; i++)
    key[i] ^= 0x6a;
  this.outer = new this.Hash().update(key);
};

Hmac.prototype.update = function update(msg, enc) {
  this.inner.update(msg, enc);
  return this;
};

Hmac.prototype.digest = function digest(enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(8);
var common = __webpack_require__(24);

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_3 = utils.sum32_3;
var sum32_4 = utils.sum32_4;
var BlockHash = common.BlockHash;

function RIPEMD160() {
  if (!(this instanceof RIPEMD160))
    return new RIPEMD160();

  BlockHash.call(this);

  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
  this.endian = 'little';
}
utils.inherits(RIPEMD160, BlockHash);
exports.ripemd160 = RIPEMD160;

RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;

RIPEMD160.prototype._update = function update(msg, start) {
  var A = this.h[0];
  var B = this.h[1];
  var C = this.h[2];
  var D = this.h[3];
  var E = this.h[4];
  var Ah = A;
  var Bh = B;
  var Ch = C;
  var Dh = D;
  var Eh = E;
  for (var j = 0; j < 80; j++) {
    var T = sum32(
      rotl32(
        sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
        s[j]),
      E);
    A = E;
    E = D;
    D = rotl32(C, 10);
    C = B;
    B = T;
    T = sum32(
      rotl32(
        sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
        sh[j]),
      Eh);
    Ah = Eh;
    Eh = Dh;
    Dh = rotl32(Ch, 10);
    Ch = Bh;
    Bh = T;
  }
  T = sum32_3(this.h[1], C, Dh);
  this.h[1] = sum32_3(this.h[2], D, Eh);
  this.h[2] = sum32_3(this.h[3], E, Ah);
  this.h[3] = sum32_3(this.h[4], A, Bh);
  this.h[4] = sum32_3(this.h[0], B, Ch);
  this.h[0] = T;
};

RIPEMD160.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'little');
  else
    return utils.split32(this.h, 'little');
};

function f(j, x, y, z) {
  if (j <= 15)
    return x ^ y ^ z;
  else if (j <= 31)
    return (x & y) | ((~x) & z);
  else if (j <= 47)
    return (x | (~y)) ^ z;
  else if (j <= 63)
    return (x & z) | (y & (~z));
  else
    return x ^ (y | (~z));
}

function K(j) {
  if (j <= 15)
    return 0x00000000;
  else if (j <= 31)
    return 0x5a827999;
  else if (j <= 47)
    return 0x6ed9eba1;
  else if (j <= 63)
    return 0x8f1bbcdc;
  else
    return 0xa953fd4e;
}

function Kh(j) {
  if (j <= 15)
    return 0x50a28be6;
  else if (j <= 31)
    return 0x5c4dd124;
  else if (j <= 47)
    return 0x6d703ef3;
  else if (j <= 63)
    return 0x7a6d76e9;
  else
    return 0x00000000;
}

var r = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
];

var rh = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
];

var s = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
];

var sh = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
];


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.sha1 = __webpack_require__(167);
exports.sha224 = __webpack_require__(168);
exports.sha256 = __webpack_require__(71);
exports.sha384 = __webpack_require__(169);
exports.sha512 = __webpack_require__(72);


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(8);
var common = __webpack_require__(24);
var shaCommon = __webpack_require__(73);

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_5 = utils.sum32_5;
var ft_1 = shaCommon.ft_1;
var BlockHash = common.BlockHash;

var sha1_K = [
  0x5A827999, 0x6ED9EBA1,
  0x8F1BBCDC, 0xCA62C1D6
];

function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();

  BlockHash.call(this);
  this.h = [
    0x67452301, 0xefcdab89, 0x98badcfe,
    0x10325476, 0xc3d2e1f0 ];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash);
module.exports = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];

  for(; i < W.length; i++)
    W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];

  for (i = 0; i < W.length; i++) {
    var s = ~~(i / 20);
    var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
};

SHA1.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(8);
var SHA256 = __webpack_require__(71);

function SHA224() {
  if (!(this instanceof SHA224))
    return new SHA224();

  SHA256.call(this);
  this.h = [
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
}
utils.inherits(SHA224, SHA256);
module.exports = SHA224;

SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;

SHA224.prototype._digest = function digest(enc) {
  // Just truncate output
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 7), 'big');
  else
    return utils.split32(this.h.slice(0, 7), 'big');
};



/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(8);

var SHA512 = __webpack_require__(72);

function SHA384() {
  if (!(this instanceof SHA384))
    return new SHA384();

  SHA512.call(this);
  this.h = [
    0xcbbb9d5d, 0xc1059ed8,
    0x629a292a, 0x367cd507,
    0x9159015a, 0x3070dd17,
    0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31,
    0x8eb44a87, 0x68581511,
    0xdb0c2e0d, 0x64f98fa7,
    0x47b5481d, 0xbefa4fa4 ];
}
utils.inherits(SHA384, SHA512);
module.exports = SHA384;

SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;

SHA384.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 12), 'big');
  else
    return utils.split32(this.h.slice(0, 12), 'big');
};


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hash = __webpack_require__(44);
var utils = __webpack_require__(76);
var assert = __webpack_require__(6);

function HmacDRBG(options) {
  if (!(this instanceof HmacDRBG))
    return new HmacDRBG(options);
  this.hash = options.hash;
  this.predResist = !!options.predResist;

  this.outLen = this.hash.outSize;
  this.minEntropy = options.minEntropy || this.hash.hmacStrength;

  this._reseed = null;
  this.reseedInterval = null;
  this.K = null;
  this.V = null;

  var entropy = utils.toArray(options.entropy, options.entropyEnc || 'hex');
  var nonce = utils.toArray(options.nonce, options.nonceEnc || 'hex');
  var pers = utils.toArray(options.pers, options.persEnc || 'hex');
  assert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
  this._init(entropy, nonce, pers);
}
module.exports = HmacDRBG;

HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
  var seed = entropy.concat(nonce).concat(pers);

  this.K = new Array(this.outLen / 8);
  this.V = new Array(this.outLen / 8);
  for (var i = 0; i < this.V.length; i++) {
    this.K[i] = 0x00;
    this.V[i] = 0x01;
  }

  this._update(seed);
  this._reseed = 1;
  this.reseedInterval = 0x1000000000000;  // 2^48
};

HmacDRBG.prototype._hmac = function hmac() {
  return new hash.hmac(this.hash, this.K);
};

HmacDRBG.prototype._update = function update(seed) {
  var kmac = this._hmac()
                 .update(this.V)
                 .update([ 0x00 ]);
  if (seed)
    kmac = kmac.update(seed);
  this.K = kmac.digest();
  this.V = this._hmac().update(this.V).digest();
  if (!seed)
    return;

  this.K = this._hmac()
               .update(this.V)
               .update([ 0x01 ])
               .update(seed)
               .digest();
  this.V = this._hmac().update(this.V).digest();
};

HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
  // Optional entropy enc
  if (typeof entropyEnc !== 'string') {
    addEnc = add;
    add = entropyEnc;
    entropyEnc = null;
  }

  entropy = utils.toArray(entropy, entropyEnc);
  add = utils.toArray(add, addEnc);

  assert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

  this._update(entropy.concat(add || []));
  this._reseed = 1;
};

HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
  if (this._reseed > this.reseedInterval)
    throw new Error('Reseed is required');

  // Optional encoding
  if (typeof enc !== 'string') {
    addEnc = add;
    add = enc;
    enc = null;
  }

  // Optional additional data
  if (add) {
    add = utils.toArray(add, addEnc || 'hex');
    this._update(add);
  }

  var temp = [];
  while (temp.length < len) {
    this.V = this._hmac().update(this.V).digest();
    temp = temp.concat(this.V);
  }

  var res = temp.slice(0, len);
  this._update(add);
  this._reseed++;
  return utils.encode(res, enc);
};


/***/ }),
/* 171 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 172 */
/***/ (function(module, exports) {


var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * [js-sha1]{@link https://github.com/emn178/js-sha1}
 *
 * @version 0.4.1
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2016
 * @license MIT
 */
/*jslint bitwise: true */
(function() {
  'use strict';

  var root = typeof window === 'object' ? window : {};
  var NODE_JS = !root.JS_SHA1_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  }
  var COMMON_JS = !root.JS_SHA1_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = "function" === 'function' && __webpack_require__(200);
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  var createOutputMethod = function (outputType) {
    return function (message) {
      return new Sha1(true).update(message)[outputType]();
    };
  };

  var createMethod = function () {
    var method = createOutputMethod('hex');
    if (NODE_JS) {
      method = nodeWrap(method);
    }
    method.create = function () {
      return new Sha1();
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type);
    }
    return method;
  };

  var nodeWrap = function (method) {
    var crypto = __webpack_require__(138);
    var Buffer = __webpack_require__(1).Buffer;
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash('sha1').update(message, 'utf8').digest('hex');
      } else if (message.constructor === ArrayBuffer) {
        message = new Uint8Array(message);
      } else if (message.length === undefined) {
        return method(message);
      }
      return crypto.createHash('sha1').update(new Buffer(message)).digest('hex');
    };
    return nodeMethod;
  };

  function Sha1(sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    this.h0 = 0x67452301;
    this.h1 = 0xEFCDAB89;
    this.h2 = 0x98BADCFE;
    this.h3 = 0x10325476;
    this.h4 = 0xC3D2E1F0;

    this.block = this.start = this.bytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
  }

  Sha1.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString = typeof(message) !== 'string';
    if (notString && message.constructor === root.ArrayBuffer) {
      message = new Uint8Array(message);
    }
    var code, index = 0, i, length = message.length || 0, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if(notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Sha1.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha1.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4;
    var f, j, t, blocks = this.blocks;

    for(j = 16; j < 80; ++j) {
      t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
      blocks[j] =  (t << 1) | (t >>> 31);
    }

    for(j = 0; j < 20; j += 5) {
      f = (b & c) | ((~b) & d);
      t = (a << 5) | (a >>> 27);
      e = t + f + e + 1518500249 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = (a & b) | ((~a) & c);
      t = (e << 5) | (e >>> 27);
      d = t + f + d + 1518500249 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = (e & a) | ((~e) & b);
      t = (d << 5) | (d >>> 27);
      c = t + f + c + 1518500249 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = (d & e) | ((~d) & a);
      t = (c << 5) | (c >>> 27);
      b = t + f + b + 1518500249 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = (c & d) | ((~c) & e);
      t = (b << 5) | (b >>> 27);
      a = t + f + a + 1518500249 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    for(; j < 40; j += 5) {
      f = b ^ c ^ d;
      t = (a << 5) | (a >>> 27);
      e = t + f + e + 1859775393 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = a ^ b ^ c;
      t = (e << 5) | (e >>> 27);
      d = t + f + d + 1859775393 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = e ^ a ^ b;
      t = (d << 5) | (d >>> 27);
      c = t + f + c + 1859775393 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = d ^ e ^ a;
      t = (c << 5) | (c >>> 27);
      b = t + f + b + 1859775393 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = c ^ d ^ e;
      t = (b << 5) | (b >>> 27);
      a = t + f + a + 1859775393 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    for(; j < 60; j += 5) {
      f = (b & c) | (b & d) | (c & d);
      t = (a << 5) | (a >>> 27);
      e = t + f + e - 1894007588 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = (a & b) | (a & c) | (b & c);
      t = (e << 5) | (e >>> 27);
      d = t + f + d - 1894007588 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = (e & a) | (e & b) | (a & b);
      t = (d << 5) | (d >>> 27);
      c = t + f + c - 1894007588 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = (d & e) | (d & a) | (e & a);
      t = (c << 5) | (c >>> 27);
      b = t + f + b - 1894007588 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = (c & d) | (c & e) | (d & e);
      t = (b << 5) | (b >>> 27);
      a = t + f + a - 1894007588 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    for(; j < 80; j += 5) {
      f = b ^ c ^ d;
      t = (a << 5) | (a >>> 27);
      e = t + f + e - 899497514 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = a ^ b ^ c;
      t = (e << 5) | (e >>> 27);
      d = t + f + d - 899497514 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = e ^ a ^ b;
      t = (d << 5) | (d >>> 27);
      c = t + f + c - 899497514 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = d ^ e ^ a;
      t = (c << 5) | (c >>> 27);
      b = t + f + b - 899497514 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = c ^ d ^ e;
      t = (b << 5) | (b >>> 27);
      a = t + f + a - 899497514 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
  };

  Sha1.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;

    return HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
           HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
           HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
           HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
           HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
           HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
           HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
           HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
           HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
           HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
           HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
           HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
           HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
           HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
           HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
           HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
           HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
           HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
           HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
           HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F];
  };

  Sha1.prototype.toString = Sha1.prototype.hex;

  Sha1.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;

    return [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF
    ];
  };

  Sha1.prototype.array = Sha1.prototype.digest;

  Sha1.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(20);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    return buffer;
  };

  var exports = createMethod();

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha1 = exports;
    if (AMD) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
        return exports;
      }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }
})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10), __webpack_require__(11)))

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
var inherits = __webpack_require__(0)
var HashBase = __webpack_require__(175)

var ARRAY16 = new Array(16)

function MD5 () {
  HashBase.call(this, 64)

  // state
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
}

inherits(MD5, HashBase)

MD5.prototype._update = function () {
  var M = ARRAY16
  for (var i = 0; i < 16; ++i) M[i] = this._block.readInt32LE(i * 4)

  var a = this._a
  var b = this._b
  var c = this._c
  var d = this._d

  a = fnF(a, b, c, d, M[0], 0xd76aa478, 7)
  d = fnF(d, a, b, c, M[1], 0xe8c7b756, 12)
  c = fnF(c, d, a, b, M[2], 0x242070db, 17)
  b = fnF(b, c, d, a, M[3], 0xc1bdceee, 22)
  a = fnF(a, b, c, d, M[4], 0xf57c0faf, 7)
  d = fnF(d, a, b, c, M[5], 0x4787c62a, 12)
  c = fnF(c, d, a, b, M[6], 0xa8304613, 17)
  b = fnF(b, c, d, a, M[7], 0xfd469501, 22)
  a = fnF(a, b, c, d, M[8], 0x698098d8, 7)
  d = fnF(d, a, b, c, M[9], 0x8b44f7af, 12)
  c = fnF(c, d, a, b, M[10], 0xffff5bb1, 17)
  b = fnF(b, c, d, a, M[11], 0x895cd7be, 22)
  a = fnF(a, b, c, d, M[12], 0x6b901122, 7)
  d = fnF(d, a, b, c, M[13], 0xfd987193, 12)
  c = fnF(c, d, a, b, M[14], 0xa679438e, 17)
  b = fnF(b, c, d, a, M[15], 0x49b40821, 22)

  a = fnG(a, b, c, d, M[1], 0xf61e2562, 5)
  d = fnG(d, a, b, c, M[6], 0xc040b340, 9)
  c = fnG(c, d, a, b, M[11], 0x265e5a51, 14)
  b = fnG(b, c, d, a, M[0], 0xe9b6c7aa, 20)
  a = fnG(a, b, c, d, M[5], 0xd62f105d, 5)
  d = fnG(d, a, b, c, M[10], 0x02441453, 9)
  c = fnG(c, d, a, b, M[15], 0xd8a1e681, 14)
  b = fnG(b, c, d, a, M[4], 0xe7d3fbc8, 20)
  a = fnG(a, b, c, d, M[9], 0x21e1cde6, 5)
  d = fnG(d, a, b, c, M[14], 0xc33707d6, 9)
  c = fnG(c, d, a, b, M[3], 0xf4d50d87, 14)
  b = fnG(b, c, d, a, M[8], 0x455a14ed, 20)
  a = fnG(a, b, c, d, M[13], 0xa9e3e905, 5)
  d = fnG(d, a, b, c, M[2], 0xfcefa3f8, 9)
  c = fnG(c, d, a, b, M[7], 0x676f02d9, 14)
  b = fnG(b, c, d, a, M[12], 0x8d2a4c8a, 20)

  a = fnH(a, b, c, d, M[5], 0xfffa3942, 4)
  d = fnH(d, a, b, c, M[8], 0x8771f681, 11)
  c = fnH(c, d, a, b, M[11], 0x6d9d6122, 16)
  b = fnH(b, c, d, a, M[14], 0xfde5380c, 23)
  a = fnH(a, b, c, d, M[1], 0xa4beea44, 4)
  d = fnH(d, a, b, c, M[4], 0x4bdecfa9, 11)
  c = fnH(c, d, a, b, M[7], 0xf6bb4b60, 16)
  b = fnH(b, c, d, a, M[10], 0xbebfbc70, 23)
  a = fnH(a, b, c, d, M[13], 0x289b7ec6, 4)
  d = fnH(d, a, b, c, M[0], 0xeaa127fa, 11)
  c = fnH(c, d, a, b, M[3], 0xd4ef3085, 16)
  b = fnH(b, c, d, a, M[6], 0x04881d05, 23)
  a = fnH(a, b, c, d, M[9], 0xd9d4d039, 4)
  d = fnH(d, a, b, c, M[12], 0xe6db99e5, 11)
  c = fnH(c, d, a, b, M[15], 0x1fa27cf8, 16)
  b = fnH(b, c, d, a, M[2], 0xc4ac5665, 23)

  a = fnI(a, b, c, d, M[0], 0xf4292244, 6)
  d = fnI(d, a, b, c, M[7], 0x432aff97, 10)
  c = fnI(c, d, a, b, M[14], 0xab9423a7, 15)
  b = fnI(b, c, d, a, M[5], 0xfc93a039, 21)
  a = fnI(a, b, c, d, M[12], 0x655b59c3, 6)
  d = fnI(d, a, b, c, M[3], 0x8f0ccc92, 10)
  c = fnI(c, d, a, b, M[10], 0xffeff47d, 15)
  b = fnI(b, c, d, a, M[1], 0x85845dd1, 21)
  a = fnI(a, b, c, d, M[8], 0x6fa87e4f, 6)
  d = fnI(d, a, b, c, M[15], 0xfe2ce6e0, 10)
  c = fnI(c, d, a, b, M[6], 0xa3014314, 15)
  b = fnI(b, c, d, a, M[13], 0x4e0811a1, 21)
  a = fnI(a, b, c, d, M[4], 0xf7537e82, 6)
  d = fnI(d, a, b, c, M[11], 0xbd3af235, 10)
  c = fnI(c, d, a, b, M[2], 0x2ad7d2bb, 15)
  b = fnI(b, c, d, a, M[9], 0xeb86d391, 21)

  this._a = (this._a + a) | 0
  this._b = (this._b + b) | 0
  this._c = (this._c + c) | 0
  this._d = (this._d + d) | 0
}

MD5.prototype._digest = function () {
  // create padding and handle blocks
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 56) {
    this._block.fill(0, this._blockOffset, 64)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 56)
  this._block.writeUInt32LE(this._length[0], 56)
  this._block.writeUInt32LE(this._length[1], 60)
  this._update()

  // produce result
  var buffer = new Buffer(16)
  buffer.writeInt32LE(this._a, 0)
  buffer.writeInt32LE(this._b, 4)
  buffer.writeInt32LE(this._c, 8)
  buffer.writeInt32LE(this._d, 12)
  return buffer
}

function rotl (x, n) {
  return (x << n) | (x >>> (32 - n))
}

function fnF (a, b, c, d, m, k, s) {
  return (rotl((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + b) | 0
}

function fnG (a, b, c, d, m, k, s) {
  return (rotl((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + b) | 0
}

function fnH (a, b, c, d, m, k, s) {
  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + b) | 0
}

function fnI (a, b, c, d, m, k, s) {
  return (rotl((a + ((c ^ (b | (~d)))) + m + k) | 0, s) + b) | 0
}

module.exports = MD5

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(2).Buffer
var Transform = __webpack_require__(33).Transform
var inherits = __webpack_require__(0)

function throwIfNotStringOrBuffer (val, prefix) {
  if (!Buffer.isBuffer(val) && typeof val !== 'string') {
    throw new TypeError(prefix + ' must be a string or a buffer')
  }
}

function HashBase (blockSize) {
  Transform.call(this)

  this._block = Buffer.allocUnsafe(blockSize)
  this._blockSize = blockSize
  this._blockOffset = 0
  this._length = [0, 0, 0, 0]

  this._finalized = false
}

inherits(HashBase, Transform)

HashBase.prototype._transform = function (chunk, encoding, callback) {
  var error = null
  try {
    this.update(chunk, encoding)
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype._flush = function (callback) {
  var error = null
  try {
    this.push(this.digest())
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype.update = function (data, encoding) {
  throwIfNotStringOrBuffer(data, 'Data')
  if (this._finalized) throw new Error('Digest already called')
  if (!Buffer.isBuffer(data)) data = Buffer.from(data, encoding)

  // consume data
  var block = this._block
  var offset = 0
  while (this._blockOffset + data.length - offset >= this._blockSize) {
    for (var i = this._blockOffset; i < this._blockSize;) block[i++] = data[offset++]
    this._update()
    this._blockOffset = 0
  }
  while (offset < data.length) block[this._blockOffset++] = data[offset++]

  // update length
  for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
    this._length[j] += carry
    carry = (this._length[j] / 0x0100000000) | 0
    if (carry > 0) this._length[j] -= 0x0100000000 * carry
  }

  return this
}

HashBase.prototype._update = function () {
  throw new Error('_update is not implemented')
}

HashBase.prototype.digest = function (encoding) {
  if (this._finalized) throw new Error('Digest already called')
  this._finalized = true

  var digest = this._digest()
  if (encoding !== undefined) digest = digest.toString(encoding)

  // reset state
  this._block.fill(0)
  this._blockOffset = 0
  for (var i = 0; i < 4; ++i) this._length[i] = 0

  return digest
}

HashBase.prototype._digest = function () {
  throw new Error('_digest is not implemented')
}

module.exports = HashBase


/***/ }),
/* 176 */
/***/ (function(module, exports) {

module.exports = {"2.16.840.1.101.3.4.1.1":"aes-128-ecb","2.16.840.1.101.3.4.1.2":"aes-128-cbc","2.16.840.1.101.3.4.1.3":"aes-128-ofb","2.16.840.1.101.3.4.1.4":"aes-128-cfb","2.16.840.1.101.3.4.1.21":"aes-192-ecb","2.16.840.1.101.3.4.1.22":"aes-192-cbc","2.16.840.1.101.3.4.1.23":"aes-192-ofb","2.16.840.1.101.3.4.1.24":"aes-192-cfb","2.16.840.1.101.3.4.1.41":"aes-256-ecb","2.16.840.1.101.3.4.1.42":"aes-256-cbc","2.16.840.1.101.3.4.1.43":"aes-256-ofb","2.16.840.1.101.3.4.1.44":"aes-256-cfb"}

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// from https://github.com/indutny/self-signed/blob/gh-pages/lib/asn1.js
// Fedor, you are amazing.


var asn1 = __webpack_require__(19)

exports.certificate = __webpack_require__(178)

var RSAPrivateKey = asn1.define('RSAPrivateKey', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('modulus').int(),
    this.key('publicExponent').int(),
    this.key('privateExponent').int(),
    this.key('prime1').int(),
    this.key('prime2').int(),
    this.key('exponent1').int(),
    this.key('exponent2').int(),
    this.key('coefficient').int()
  )
})
exports.RSAPrivateKey = RSAPrivateKey

var RSAPublicKey = asn1.define('RSAPublicKey', function () {
  this.seq().obj(
    this.key('modulus').int(),
    this.key('publicExponent').int()
  )
})
exports.RSAPublicKey = RSAPublicKey

var PublicKey = asn1.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  )
})
exports.PublicKey = PublicKey

var AlgorithmIdentifier = asn1.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('none').null_().optional(),
    this.key('curve').objid().optional(),
    this.key('params').seq().obj(
      this.key('p').int(),
      this.key('q').int(),
      this.key('g').int()
    ).optional()
  )
})

var PrivateKeyInfo = asn1.define('PrivateKeyInfo', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPrivateKey').octstr()
  )
})
exports.PrivateKey = PrivateKeyInfo
var EncryptedPrivateKeyInfo = asn1.define('EncryptedPrivateKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').seq().obj(
      this.key('id').objid(),
      this.key('decrypt').seq().obj(
        this.key('kde').seq().obj(
          this.key('id').objid(),
          this.key('kdeparams').seq().obj(
            this.key('salt').octstr(),
            this.key('iters').int()
          )
        ),
        this.key('cipher').seq().obj(
          this.key('algo').objid(),
          this.key('iv').octstr()
        )
      )
    ),
    this.key('subjectPrivateKey').octstr()
  )
})

exports.EncryptedPrivateKey = EncryptedPrivateKeyInfo

var DSAPrivateKey = asn1.define('DSAPrivateKey', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('p').int(),
    this.key('q').int(),
    this.key('g').int(),
    this.key('pub_key').int(),
    this.key('priv_key').int()
  )
})
exports.DSAPrivateKey = DSAPrivateKey

exports.DSAparam = asn1.define('DSAparam', function () {
  this.int()
})

var ECPrivateKey = asn1.define('ECPrivateKey', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('privateKey').octstr(),
    this.key('parameters').optional().explicit(0).use(ECParameters),
    this.key('publicKey').optional().explicit(1).bitstr()
  )
})
exports.ECPrivateKey = ECPrivateKey

var ECParameters = asn1.define('ECParameters', function () {
  this.choice({
    namedCurve: this.objid()
  })
})

exports.signature = asn1.define('signature', function () {
  this.seq().obj(
    this.key('r').int(),
    this.key('s').int()
  )
})


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// from https://github.com/Rantanen/node-dtls/blob/25a7dc861bda38cfeac93a723500eea4f0ac2e86/Certificate.js
// thanks to @Rantanen



var asn = __webpack_require__(19)

var Time = asn.define('Time', function () {
  this.choice({
    utcTime: this.utctime(),
    generalTime: this.gentime()
  })
})

var AttributeTypeValue = asn.define('AttributeTypeValue', function () {
  this.seq().obj(
    this.key('type').objid(),
    this.key('value').any()
  )
})

var AlgorithmIdentifier = asn.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional()
  )
})

var SubjectPublicKeyInfo = asn.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  )
})

var RelativeDistinguishedName = asn.define('RelativeDistinguishedName', function () {
  this.setof(AttributeTypeValue)
})

var RDNSequence = asn.define('RDNSequence', function () {
  this.seqof(RelativeDistinguishedName)
})

var Name = asn.define('Name', function () {
  this.choice({
    rdnSequence: this.use(RDNSequence)
  })
})

var Validity = asn.define('Validity', function () {
  this.seq().obj(
    this.key('notBefore').use(Time),
    this.key('notAfter').use(Time)
  )
})

var Extension = asn.define('Extension', function () {
  this.seq().obj(
    this.key('extnID').objid(),
    this.key('critical').bool().def(false),
    this.key('extnValue').octstr()
  )
})

var TBSCertificate = asn.define('TBSCertificate', function () {
  this.seq().obj(
    this.key('version').explicit(0).int(),
    this.key('serialNumber').int(),
    this.key('signature').use(AlgorithmIdentifier),
    this.key('issuer').use(Name),
    this.key('validity').use(Validity),
    this.key('subject').use(Name),
    this.key('subjectPublicKeyInfo').use(SubjectPublicKeyInfo),
    this.key('issuerUniqueID').implicit(1).bitstr().optional(),
    this.key('subjectUniqueID').implicit(2).bitstr().optional(),
    this.key('extensions').explicit(3).seqof(Extension).optional()
  )
})

var X509Certificate = asn.define('X509Certificate', function () {
  this.seq().obj(
    this.key('tbsCertificate').use(TBSCertificate),
    this.key('signatureAlgorithm').use(AlgorithmIdentifier),
    this.key('signatureValue').bitstr()
  )
})

module.exports = X509Certificate


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// adapted from https://github.com/apatil/pemstrip
var findProc = /Proc-Type: 4,ENCRYPTED\n\r?DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)\n\r?\n\r?([0-9A-z\n\r\+\/\=]+)\n\r?/m
var startRegex = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----\n/m
var fullRegex = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----\n\r?([0-9A-z\n\r\+\/\=]+)\n\r?-----END \1-----$/m
var evp = __webpack_require__(30)
var ciphers = __webpack_require__(38)
module.exports = function (okey, password) {
  var key = okey.toString()
  var match = key.match(findProc)
  var decrypted
  if (!match) {
    var match2 = key.match(fullRegex)
    decrypted = new Buffer(match2[2].replace(/\r?\n/g, ''), 'base64')
  } else {
    var suite = 'aes' + match[1]
    var iv = new Buffer(match[2], 'hex')
    var cipherText = new Buffer(match[3].replace(/\r?\n/g, ''), 'base64')
    var cipherKey = evp(password, iv.slice(0, 8), parseInt(match[1], 10)).key
    var out = []
    var cipher = ciphers.createDecipheriv(suite, cipherKey, iv)
    out.push(cipher.update(cipherText))
    out.push(cipher.final())
    decrypted = Buffer.concat(out)
  }
  var tag = key.match(startRegex)[1]
  return {
    tag: tag,
    data: decrypted
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {var checkParameters = __webpack_require__(79)
var defaultEncoding = __webpack_require__(78)
var sync = __webpack_require__(80)
var Buffer = __webpack_require__(2).Buffer

var ZERO_BUF
var subtle = global.crypto && global.crypto.subtle
var toBrowser = {
  'sha': 'SHA-1',
  'sha-1': 'SHA-1',
  'sha1': 'SHA-1',
  'sha256': 'SHA-256',
  'sha-256': 'SHA-256',
  'sha384': 'SHA-384',
  'sha-384': 'SHA-384',
  'sha-512': 'SHA-512',
  'sha512': 'SHA-512'
}
var checks = []
function checkNative (algo) {
  if (global.process && !global.process.browser) {
    return Promise.resolve(false)
  }
  if (!subtle || !subtle.importKey || !subtle.deriveBits) {
    return Promise.resolve(false)
  }
  if (checks[algo] !== undefined) {
    return checks[algo]
  }
  ZERO_BUF = ZERO_BUF || Buffer.alloc(8)
  var prom = browserPbkdf2(ZERO_BUF, ZERO_BUF, 10, 128, algo)
    .then(function () {
      return true
    }).catch(function () {
      return false
    })
  checks[algo] = prom
  return prom
}
function browserPbkdf2 (password, salt, iterations, length, algo) {
  return subtle.importKey(
    'raw', password, {name: 'PBKDF2'}, false, ['deriveBits']
  ).then(function (key) {
    return subtle.deriveBits({
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: {
        name: algo
      }
    }, key, length << 3)
  }).then(function (res) {
    return Buffer.from(res)
  })
}
function resolvePromise (promise, callback) {
  promise.then(function (out) {
    process.nextTick(function () {
      callback(null, out)
    })
  }, function (e) {
    process.nextTick(function () {
      callback(e)
    })
  })
}
module.exports = function (password, salt, iterations, keylen, digest, callback) {
  if (!Buffer.isBuffer(password)) password = Buffer.from(password, defaultEncoding)
  if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, defaultEncoding)

  checkParameters(iterations, keylen)
  if (typeof digest === 'function') {
    callback = digest
    digest = undefined
  }
  if (typeof callback !== 'function') throw new Error('No callback provided to pbkdf2')

  digest = digest || 'sha1'
  var algo = toBrowser[digest.toLowerCase()]
  if (!algo || typeof global.Promise !== 'function') {
    return process.nextTick(function () {
      var out
      try {
        out = sync(password, salt, iterations, keylen, digest)
      } catch (e) {
        return callback(e)
      }
      callback(null, out)
    })
  }
  resolvePromise(checkNative(algo).then(function (resp) {
    if (resp) {
      return browserPbkdf2(password, salt, iterations, keylen, algo)
    } else {
      return sync(password, salt, iterations, keylen, digest)
    }
  }), callback)
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(10)))

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

exports.publicEncrypt = __webpack_require__(183);
exports.privateDecrypt = __webpack_require__(182);

exports.privateEncrypt = function privateEncrypt(key, buf) {
  return exports.publicEncrypt(key, buf, true);
};

exports.publicDecrypt = function publicDecrypt(key, buf) {
  return exports.privateDecrypt(key, buf, true);
};

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var parseKeys = __webpack_require__(31);
var mgf = __webpack_require__(81);
var xor = __webpack_require__(83);
var bn = __webpack_require__(3);
var crt = __webpack_require__(40);
var createHash = __webpack_require__(23);
var withPublic = __webpack_require__(82);
module.exports = function privateDecrypt(private_key, enc, reverse) {
  var padding;
  if (private_key.padding) {
    padding = private_key.padding;
  } else if (reverse) {
    padding = 1;
  } else {
    padding = 4;
  }
  
  var key = parseKeys(private_key);
  var k = key.modulus.byteLength();
  if (enc.length > k || new bn(enc).cmp(key.modulus) >= 0) {
    throw new Error('decryption error');
  }
  var msg;
  if (reverse) {
    msg = withPublic(new bn(enc), key);
  } else {
    msg = crt(enc, key);
  }
  var zBuffer = new Buffer(k - msg.length);
  zBuffer.fill(0);
  msg = Buffer.concat([zBuffer, msg], k);
  if (padding === 4) {
    return oaep(key, msg);
  } else if (padding === 1) {
    return pkcs1(key, msg, reverse);
  } else if (padding === 3) {
    return msg;
  } else {
    throw new Error('unknown padding');
  }
};

function oaep(key, msg){
  var n = key.modulus;
  var k = key.modulus.byteLength();
  var mLen = msg.length;
  var iHash = createHash('sha1').update(new Buffer('')).digest();
  var hLen = iHash.length;
  var hLen2 = 2 * hLen;
  if (msg[0] !== 0) {
    throw new Error('decryption error');
  }
  var maskedSeed = msg.slice(1, hLen + 1);
  var maskedDb =  msg.slice(hLen + 1);
  var seed = xor(maskedSeed, mgf(maskedDb, hLen));
  var db = xor(maskedDb, mgf(seed, k - hLen - 1));
  if (compare(iHash, db.slice(0, hLen))) {
    throw new Error('decryption error');
  }
  var i = hLen;
  while (db[i] === 0) {
    i++;
  }
  if (db[i++] !== 1) {
    throw new Error('decryption error');
  }
  return db.slice(i);
}

function pkcs1(key, msg, reverse){
  var p1 = msg.slice(0, 2);
  var i = 2;
  var status = 0;
  while (msg[i++] !== 0) {
    if (i >= msg.length) {
      status++;
      break;
    }
  }
  var ps = msg.slice(2, i - 1);
  var p2 = msg.slice(i - 1, i);

  if ((p1.toString('hex') !== '0002' && !reverse) || (p1.toString('hex') !== '0001' && reverse)){
    status++;
  }
  if (ps.length < 8) {
    status++;
  }
  if (status) {
    throw new Error('decryption error');
  }
  return  msg.slice(i);
}
function compare(a, b){
  a = new Buffer(a);
  b = new Buffer(b);
  var dif = 0;
  var len = a.length;
  if (a.length !== b.length) {
    dif++;
    len = Math.min(a.length, b.length);
  }
  var i = -1;
  while (++i < len) {
    dif += (a[i] ^ b[i]);
  }
  return dif;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var parseKeys = __webpack_require__(31);
var randomBytes = __webpack_require__(25);
var createHash = __webpack_require__(23);
var mgf = __webpack_require__(81);
var xor = __webpack_require__(83);
var bn = __webpack_require__(3);
var withPublic = __webpack_require__(82);
var crt = __webpack_require__(40);

var constants = {
  RSA_PKCS1_OAEP_PADDING: 4,
  RSA_PKCS1_PADDIN: 1,
  RSA_NO_PADDING: 3
};

module.exports = function publicEncrypt(public_key, msg, reverse) {
  var padding;
  if (public_key.padding) {
    padding = public_key.padding;
  } else if (reverse) {
    padding = 1;
  } else {
    padding = 4;
  }
  var key = parseKeys(public_key);
  var paddedMsg;
  if (padding === 4) {
    paddedMsg = oaep(key, msg);
  } else if (padding === 1) {
    paddedMsg = pkcs1(key, msg, reverse);
  } else if (padding === 3) {
    paddedMsg = new bn(msg);
    if (paddedMsg.cmp(key.modulus) >= 0) {
      throw new Error('data too long for modulus');
    }
  } else {
    throw new Error('unknown padding');
  }
  if (reverse) {
    return crt(paddedMsg, key);
  } else {
    return withPublic(paddedMsg, key);
  }
};

function oaep(key, msg){
  var k = key.modulus.byteLength();
  var mLen = msg.length;
  var iHash = createHash('sha1').update(new Buffer('')).digest();
  var hLen = iHash.length;
  var hLen2 = 2 * hLen;
  if (mLen > k - hLen2 - 2) {
    throw new Error('message too long');
  }
  var ps = new Buffer(k - mLen - hLen2 - 2);
  ps.fill(0);
  var dblen = k - hLen - 1;
  var seed = randomBytes(hLen);
  var maskedDb = xor(Buffer.concat([iHash, ps, new Buffer([1]), msg], dblen), mgf(seed, dblen));
  var maskedSeed = xor(seed, mgf(maskedDb, hLen));
  return new bn(Buffer.concat([new Buffer([0]), maskedSeed, maskedDb], k));
}
function pkcs1(key, msg, reverse){
  var mLen = msg.length;
  var k = key.modulus.byteLength();
  if (mLen > k - 11) {
    throw new Error('message too long');
  }
  var ps;
  if (reverse) {
    ps = new Buffer(k - mLen - 3);
    ps.fill(0xff);
  } else {
    ps = nonZero(k - mLen - 3);
  }
  return new bn(Buffer.concat([new Buffer([0, reverse?1:2]), ps, new Buffer([0]), msg], k));
}
function nonZero(len, crypto) {
  var out = new Buffer(len);
  var i = 0;
  var cache = randomBytes(len*2);
  var cur = 0;
  var num;
  while (i < len) {
    if (cur === cache.length) {
      cache = randomBytes(len*2);
      cur = 0;
    }
    num = cache[cur++];
    if (num) {
      out[i++] = num;
    }
  }
  return out;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(85);

/*<replacement>*/
var util = __webpack_require__(22);
util.inherits = __webpack_require__(0);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = __webpack_require__(2).Buffer;
/*</replacement>*/

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(47).PassThrough


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(47).Transform


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(46);


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(10)))

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
 * in FIPS PUB 180-1
 * This source code is derived from sha1.js of the same repository.
 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
 * operation was added.
 */

var inherits = __webpack_require__(0)
var Hash = __webpack_require__(16)
var Buffer = __webpack_require__(2).Buffer

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha, Hash)

Sha.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var inherits = __webpack_require__(0)
var Hash = __webpack_require__(16)
var Buffer = __webpack_require__(2).Buffer

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha1 () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha1, Hash)

Sha1.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl1 (num) {
  return (num << 1) | (num >>> 31)
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha1.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha1.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha1


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = __webpack_require__(0)
var Sha256 = __webpack_require__(88)
var Hash = __webpack_require__(16)
var Buffer = __webpack_require__(2).Buffer

var W = new Array(64)

function Sha224 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha224, Sha256)

Sha224.prototype.init = function () {
  this._a = 0xc1059ed8
  this._b = 0x367cd507
  this._c = 0x3070dd17
  this._d = 0xf70e5939
  this._e = 0xffc00b31
  this._f = 0x68581511
  this._g = 0x64f98fa7
  this._h = 0xbefa4fa4

  return this
}

Sha224.prototype._hash = function () {
  var H = Buffer.allocUnsafe(28)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)

  return H
}

module.exports = Sha224


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(0)
var SHA512 = __webpack_require__(89)
var Hash = __webpack_require__(16)
var Buffer = __webpack_require__(2).Buffer

var W = new Array(160)

function Sha384 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha384, SHA512)

Sha384.prototype.init = function () {
  this._ah = 0xcbbb9d5d
  this._bh = 0x629a292a
  this._ch = 0x9159015a
  this._dh = 0x152fecd8
  this._eh = 0x67332667
  this._fh = 0x8eb44a87
  this._gh = 0xdb0c2e0d
  this._hh = 0x47b5481d

  this._al = 0xc1059ed8
  this._bl = 0x367cd507
  this._cl = 0x3070dd17
  this._dl = 0xf70e5939
  this._el = 0xffc00b31
  this._fl = 0x68581511
  this._gl = 0x64f98fa7
  this._hl = 0xbefa4fa4

  return this
}

Sha384.prototype._hash = function () {
  var H = Buffer.allocUnsafe(48)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)

  return H
}

module.exports = Sha384


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(196);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 196 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(190);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

var indexOf = __webpack_require__(172);

var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    var wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        wEval = win.eval;
    }
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    forEach(Object_keys(ctx), function (key) {
        context[key] = ctx[key];
    });

    return res;
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};


/***/ }),
/* 200 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 201 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 202 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 203 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 204 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);
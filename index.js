const fs = require('fs')
const writeJS = require('./writer')
const morphStr = require('./morph_string')
const makeTree = require('./token_tree')

const schemeSourceCode = fs.readFileSync('src.scm', 'utf8')

function compile(str) {
	let result = writeJS(makeTree(str), false)
	return morphStr.postProcessStr(result)
}

const jsSourceCode = compile(schemeSourceCode)
console.log(jsSourceCode)

const fdx = fs.openSync('library.js', 'r')
let lib = fs.readFileSync(fdx, 'utf8')
let final = lib + jsSourceCode
fs.closeSync(fdx)

const fd = fs.openSync('src.js', 'w')
fs.writeFileSync(fd, final)
fs.closeSync(fd)

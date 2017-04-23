function _scmjs_add() {
	return Array.prototype.slice.call(arguments).reduce((prev, next) => prev + next)
}

function _scmjs_subtract() {
	return Array.prototype.slice.call(arguments).reduce((prev, next) => prev - next)
}

function _scmjs_mult() {
	return Array.prototype.slice.call(arguments).reduce((prev, next) => prev * next)
}

function _scmjs_divide(x, y) {
	return x / y
}

function _scmjs_equals(x, y) {
	return x === y
}

function _scmjs_greater(x, y) {
	return x > y
}

function _scmjs_less(x, y) {
	return x < y
}

function _scmjs_greaterOrEqual(x, y) {
	return x >= y
}

function _scmjs_lessOrEqual(x, y) {
	return x <= y
}

function _scmjs_isNull(x) {
	return x === null
}

function _scmjs_if(bool, exp1, exp2) {
	if (bool) {
		return exp1
	} else {
		return exp2
	}
}

function _scmjs_cond() {
	let args = Array.prototype.slice.call(arguments)
	for (let i=0; i< args.length; i++) {
		if (args[i] === true) return args[i+1]
		if (args[i] === false) {
			i++
			continue
		}
		if (args[i].length === 1) return args[i][0]
		if (args[i][0]) return args[i][1]
	}
}

function _scmjs_else(arg) {
	return [true, arg]
}

function _scmjs_car(arr) {
	return arr[0]
}

function _scmjs_cdr(arr) {
	arr.shift()
	return arr
}

function _scmjs_cons(add, list) {
	list.unshift(add)
	return list
}

function _scmjs_and() {
	let args = Array.prototype.slice.call(arguments)
	if (args.length === 0) return true
	if (args.length === 1) return args[0]
	let i
	for (i=0; i<args.length; i++) {
		if (args[i] !== false) {
			continue
		} else {
			return false
		}
	}
	return args[i-1]
}

function _scmjs_or() {
	let args = Array.prototype.slice.call(arguments)
	if (args.length === 0) return false
	for (let i=0; i<args.length; i++) {
		if (args[i] !== false) return args[i]
	}
	return false
}

function _scmjs_set(varname, val) {
	return `${varname} = ${val};`
}


// END LIBRARY
replaceLetStr
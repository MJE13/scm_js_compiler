function _schemeAdd() {
	return Array.prototype.slice.call(arguments).reduce((prev, next) => prev + next)
}

function _schemeSubtract() {
	return Array.prototype.slice.call(arguments).reduce((prev, next) => prev - next)
}

function _schemeMult() {
	return Array.prototype.slice.call(arguments).reduce((prev, next) => prev * next)
}

function _schemeDivide(x, y) {
	return x / y
}

function _schemeEquals(x, y) {
	return x === y
}

function _schemeGreater(x, y) {
	return x > y
}

function _schemeLess(x, y) {
	return x < y
}

function _schemeGreaterOrEqual(x, y) {
	return x >= y
}

function _schemeLessOrEqual(x, y) {
	return x <= y
}

function _schemeIsNull(x) {
	return Array.isArray(x) && x.length === 0
}

function _schemePair(expr) {
	if (Array.isArray(expr) && expr.length === 2) return true
	return false
}

function _schemeIf(bool, exp1, exp2) {
	if (bool) {
		if (Array.isArray(exp1) && typeof exp1[0] === 'function') {
			let func = exp1.shift()
			return func.apply(this, exp1)
		}
		return exp1
	} else {
		if (Array.isArray(exp2) && typeof exp2[0] === 'function') {
			let func = exp2.shift()
			return func.apply(this, exp2)
		}
		return exp2
	}
}

function _schemeNot(arg) {
	return (arg) ? false : true;
}

function _schemeCond() {
	let args = Array.prototype.slice.call(arguments)
	for (let i=0; i< args.length; i++) {
		if (args[i] === true) {
			if (Array.isArray(args[i+1][1]) && typeof args[i+1][1][0] === 'function') {
				let func = args[i+1][0].shift()
				return func.apply(this, args[i+1][0])
			} else {
				return args[i+1]
			}

		}
		if (args[i] === false) {
			i++
			continue
		}
		if (args[i].length === 1) {
			if (Array.isArray(args[i][0]) && typeof args[i][0][0] === 'function') {
				let func = args[i][0].shift()
				return func.apply(this, args[i][0])
			} else {
				return args[i][0]
			}
		}
		if (args[i][0]) {
			if (Array.isArray(args[i][1]) && typeof args[i][1][0] === 'function') {
				let func = args[i][1].shift()
				return func.apply(this, args[i][1])
			} else {
				return args[i][1]
			}
		}
	}
}

function _schemeElse(arg) {
	if (Array.isArray(arg) && typeof arg[0] === 'function') {
		return [true, arg[0](arg[1])]
	}
	return [true, arg]
}

function _schemeCar(arr) {
	if (arr === undefined) return false
	return arr[0]
}

function _schemeCdr(arr) {
	if(arr.length === 0) return []
	arr.shift()
	return arr
}

function _schemeCons(add, list) {
	if (Array.isArray(list) && typeof list[0] === 'function') {
		let func = list.shift()
		return func.apply(this, list)
	}
	list.unshift(add)
	return list
}

function _schemeAnd() {
	let args = Array.prototype.slice.call(arguments)
	if (args.length === 0) return true
	if (args.length === 1) {
		if (Array.isArray(args[0]) && typeof args[0][0] === 'function') {
			let func = args[0].shift()
			return func.apply(this, args[0])
		}
		return args[0]
	}
	let i
	for (i=0; i<args.length; i++) {
		if (args[i] !== false) {
			continue
		} else {
			return false
		}
	}
	if (Array.isArray(args[i-1]) && typeof args[i-1][0] === 'function') {
		let func = args[i-1].shift()
		return func.apply(this, args[i-1])
	}
	return args[i-1]
}

function _schemeOr() {
	let args = Array.prototype.slice.call(arguments)
	if (args.length === 0) return false
	for (let i=0; i<args.length; i++) {
		if (Array.isArray(args[i]) && typeof args[i][0] === 'function') {
			let func = args[i][0].shift
			return func.apply(this, args[i][0])
		}
		if (args[i] !== false) return args[i]
	}
	return false
}

function _schemeSet(varname, val) {
	return `${varname} = ${val};`
}


// END LIBRARY

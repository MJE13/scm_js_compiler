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
		return exp1
	} else {
		return exp2
	}
}

function _schemeNot(arg) {
	return (arg) ? false : true;
}

function _schemeCond() {
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

function _schemeElse(arg) {
	return [true, arg]
}

function _schemeCar(arr) {
	return arr[0]
}

function _schemeCdr(arr) {
	arr.shift()
	return arr
}

function _schemeCons(add, list) {
	list.unshift(add)
	return list
}

function _schemeAnd() {
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

function _schemeOr() {
	let args = Array.prototype.slice.call(arguments)
	if (args.length === 0) return false
	for (let i=0; i<args.length; i++) {
		if (args[i] !== false) return args[i]
	}
	return false
}

function _schemeSet(varname, val) {
	return `${varname} = ${val};`
}


// END LIBRARY
let basicRec = (x) => {
	//if(x === 0) return 'done';
	let recResult = basicRec(_schemeSubtract(x, 1))
	if(recResult === "done") return 'let me out!!'
	console.log('recResult?', recResult)
	return _schemeIf(
		_schemeEquals(x, 0),
		"done",
		recResult
	);
};

basicRec(2)

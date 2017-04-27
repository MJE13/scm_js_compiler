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
	console.log('EQUAL REALLY?', x, y)
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
	console.log('NULL', x, Array.isArray(x) && x.length === 0)
	return Array.isArray(x) && x.length === 0
}

function _schemePair(expr) {
	if (Array.isArray(expr) && expr.length === 2) return true
	return false
}

function _schemeIf(bool, exp1, exp2) {
	if (bool) {
		if (Array.isArray(exp1)) {
			return exp1[0](exp1[1])
		}
		return exp1
	} else {
		if (Array.isArray(exp2)) {
			return exp2[0](exp2[1])
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
			console.log('in first cond', args[i])
			if (Array.isArray(args[i+1][1])) {
				return args[i+1][0](args[i+1][1])
			} else {
				return args[i+1]
			}

		}
		if (args[i] === false) {
			console.log('in second cond', args[i])
			i++
			continue
		}
		if (args[i].length === 1) {
			console.log('in third cond', args[i])
			if (Array.isArray(args[i][1])) {
				return args[i][0](args[i][1])
			} else {
				return args[i][0]
			}
		}
		if (args[i][0]) {
			console.log('in fourth cond', args[i])
			if (Array.isArray(args[i][1])) {
				return args[i][1][0](args[i][1][1])
			} else {
				return args[i][1]
			}
		}
	}
}

function _schemeElse(arg) {
	return [true, arg]
}

function _schemeCar(arr) {
	console.log('car trouble', arr)
	if (arr === undefined) return false
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
		if (Array.isArray(args[i])) {
			return args[i][0](args[i][1], args[i][2])
		}
		if (args[i] !== false) return args[i]
	}
	return false
}

function _schemeSet(varname, val) {
	return `${varname} = ${val};`
}


// END LIBRARY
(()=>{ let _topLevelScope = 0; let member = (a, lat)=>{ return _schemeCond([_schemeIsNull(lat), false], _schemeElse(_schemeOr(_schemeEquals(_schemeCar(lat), a), [member, a, _schemeCdr(lat)]))); }; return member(4, [1, 2, 3]); })(); 
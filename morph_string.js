

function preProcessStr(str) {
	str = '(let ((_topLevelScope 0)) ' + str + ')'
	str = str.replace(/".*?"/g, match => match.replace(/ /g, '#$%&!?@'))
	str = str.replace(/"/g, '@?&@%&!')
	str = str.replace(/\(|'\(/g, '",["')
	str = str.replace(/\)/g, '"],"')
	str = str.replace(/\n/g, ' ')
	str = str.replace(/\s{2,}/g, ' ')
	str = str.replace(/,""|"",|," "/g, '')
	str = str.replace(/ "|" /g, '"')
	str = str.replace(/^",|,"$/g, '')
	str = str.replace(/^/, '[')
	str = str.replace(/$/, ']')

	return str
}

function replaceLetStr(match, inner) {
	let bracketCount = 0
	let i

	for (i=0; i<inner.length; i++) {
		if (inner.charAt(i) === '[') {
			bracketCount++
		} else if (inner.charAt(i) === ']') {
			bracketCount--
		}
		if (bracketCount === -1) break
	}

	inner = inner.replace(inner.substring(0, i), (fullMatch) => {
		return '(()=>{ ' + fullMatch.replace(/\[(\w{1,30}), ([^\]]{1,500})\](,|)/g, (full, key, val) => {
			return `let ${key} = ${val};`
		})
	})
	inner = inner.replace(/\],/, '')

	return inner
}

let cpArgs = {
	numToParen: null,
	innerRegEx: null,
	replaceStr: null,
	outerRegEx: null,
	endChars: null
}
function countParens(match) {
	match = match.split('')

	let parCount = 0
	for (let i=cpArgs.numToParen; i<match.length; i++) {
		if (match[i] === '(') {
			parCount++
		} else if (match[i] === ')') {
			parCount--
		}
		if (parCount === 0) {
			match[i] = cpArgs.endChars
			break
		}
	}

	match = match.join('')
	match = match.replace(cpArgs.innerRegEx, cpArgs.replaceStr)
	match = match.replace(cpArgs.outerRegEx, countParens)

	return match
}

function postProcessStr(result) {
	result = result.replace(/, \)/g, ')')
	result = result.replace(/, \]/g, ']')
	result = result.replace(/, $/, '')

	cpArgs.numToParen = 10
	cpArgs.innerRegEx = /_schemeLet\(\[(.*)$/
	cpArgs.replaceStr = replaceLetStr
	cpArgs.endChars = '})()'
	cpArgs.outerRegEx = /_schemeLet.*$/
	result = result.replace(cpArgs.outerRegEx, countParens)

	cpArgs.numToParen = 13
	cpArgs.innerRegEx = /_schemeLambda\(\[(.*?)\],/
	cpArgs.replaceStr = '($1)=>{'
	cpArgs.endChars = '}'
	cpArgs.outerRegEx = /_schemeLambda.*$/
	result = result.replace(cpArgs.outerRegEx, countParens)

	result = result.replace(/#t/g, 'true')
	result = result.replace(/#f/g, 'false')

	return result
}

module.exports = {
	preProcessStr,
	postProcessStr
}

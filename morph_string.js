

function preProcessStr(str) {
	str = '(let ((_topLevelScope 0)) ' + str + ')'

	str = str.replace(/".*?"/g, match => match.replace(/ /g, '#$%&!?@'))
	str = str.replace(/"/g, '@?&@%&!')
	str = str.replace(/\(|'\(/g, '",["')
	str = str.replace(/\)/g, '"],"')
	str = str.replace(/\n/g, ' ')
	str = str.replace(/\s{2,}/g, ' ')
	str = str.replace(/,""|"",|," "|" ",/g, '')
	str = str.replace(/\[\["lambda/g, '[["autoLambda')
	str = str.replace(/ "|" /g, '"')
	str = str.replace(/\[, /g, '[')
	str = str.replace(/^",|,"$/g, '')

	return str
}

function findRecursion() {

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

function replaceLambdaArgs(match, inner) {


	inner = '(' + inner + ')=>{'

	return inner
}

function autoLambdaParser(match) {
	let bracketCount = 0
	let i

	for (i=0; i<match.length; i++) {
		if (match.charAt(i) === '[') {
			bracketCount++
		} else if (match.charAt(i) === ']') {
			bracketCount--
		}
		if (bracketCount === 0) {
			break
		}
	}
	let end

	match = match.replace(match.substring(1, i), (fullMatch) => {

		end = fullMatch.match(/_schemeAutoLambda\(\[(.*?)\],(.*), (.*)$/)
		fullMatch = fullMatch.replace(/, .*$/, '')

		return `((${end[1]})=>{ ${end[2]}`
	})

	match = match.substring(1, match.length-1)
	match = match.replace(/\)\]/, ` })(${end[3]});`)

	return match

}

let cpArgs = {
	numToParen: null,
	innerRegEx: null,
	replaceStr: null,
	outerRegEx: null,
	endChars: null,
	searchChars: {
		begin: null,
		end: null
	}
}

function countParens(match) {
	match = match.split('')
	let i
	let parCount = 0

	for (i=cpArgs.numToParen; i<match.length; i++) {
		if (match[i] === cpArgs.searchChars.begin) {
			parCount++
		} else if (match[i] === cpArgs.searchChars.end) {
			parCount--
		}
		if (parCount === 0) {
			match[i] = cpArgs.endChars
			break
		}
	}

	match = match.join('')

	if(/^_schemeDefine/.test(match)) {
		let theSub = match.substring(0, i)
		let subMatch = theSub.match(/_schemeDefine\((.*?),/)[1]
		let recCall = theSub.match(new RegExp(subMatch, 'g'))
		let matchCount = recCall.length
		if (matchCount > 1) {
			if(/_schemeIf/.test(match)) {
				let therex = '_schemeIf.*?' + subMatch
				let ifReg = new RegExp(therex)
				let ifStr = theSub.match(ifReg)[0]

				let killRecursion = theSub.replace(/36ldv9nw6f5s15/, '')

				match = match.replace(/_schemeDefine(.*?)}/, killRecursion)
			} else if (/_schemeCond/.test(match)) {
				let condRex = new RegExp('36ldv9nw6f5s15' + subMatch)
				let killCondRecursion = theSub.replace(condRex, subMatch)
				match = match.replace(/_schemeDefine(.*?)}/, killCondRecursion)

			}
		}
	}
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
	cpArgs.searchChars = { begin: '(', end: ')'}
	cpArgs.replaceStr = replaceLetStr
	cpArgs.endChars = '})()'
	cpArgs.outerRegEx = /_schemeLet.*$/
	result = result.replace(cpArgs.outerRegEx, countParens)

	cpArgs.numToParen = 13
	cpArgs.innerRegEx = /_schemeLambda\(\[(.*?)\],/
	cpArgs.searchChars = { begin: '(', end: ')'}
	cpArgs.replaceStr = (match, inner) => (	`(${inner})=>{` )
	cpArgs.endChars = '}'
	cpArgs.outerRegEx = /_schemeLambda.*$/
	result = result.replace(cpArgs.outerRegEx, countParens)

	cpArgs.numToParen = 0
	cpArgs.innerRegEx = /\[_schemeAutoLambda\(\[(.*?)\],/
	cpArgs.searchChars = { begin: '[', end: ']'}
	cpArgs.endChars = '})()'
	cpArgs.outerRegEx = /\[_schemeAutoLambda.*$/
	result = result.replace(cpArgs.outerRegEx, autoLambdaParser)

	cpArgs.numToParen = 13
	cpArgs.innerRegEx = /_schemeDefine\((.*?),/
	cpArgs.searchChars = { begin: '(', end: ')'}
	//cpArgs.replaceStr = findRecursion
	cpArgs.replaceStr = 'let $1 ='
	cpArgs.endChars = ''
	cpArgs.outerRegEx = /_schemeDefine.*$/
	result = result.replace(cpArgs.outerRegEx, countParens)

	cpArgs.numToParen = 0
	cpArgs.innerRegEx = /\[36ldv9nw6f5s15(.*?), /
	cpArgs.searchChars = { begin: '[', end: ']'}
	cpArgs.replaceStr = '$1('
	cpArgs.endChars = ')'
	cpArgs.outerRegEx = /\[36ldv9nw6f5s15.*$/
	result = result.replace(cpArgs.outerRegEx, countParens)

	result = result.replace(/#t/g, 'true')
	result = result.replace(/#f/g, 'false')

	result = result.replace(/@\?&@%&!/g, '"')
	result = result.replace(/#\$%&!\?@/g, ' ')

	return result
}

module.exports = {
	preProcessStr,
	postProcessStr
}

/**
 * Execute a string as a function
 * 
 * @param {string} str
 * @param {any} obj
 * @returns
 */
export function execute(str, obj) {
	let finalString = `return (${str})`
	if (str.split(/[\n\r]+/).length > 1) {
		finalString = str
	}
	if (str.indexOf("return ") > -1) {
		finalString = str
	}
	return new Function(...Object.keys(obj), `return ${str}`)(...Object.values(obj))
}

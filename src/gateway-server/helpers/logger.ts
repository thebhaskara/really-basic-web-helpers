export const LogIdByRef = new Map<any, number>()
const commonRef = Symbol("commonRef")
LogIdByRef.set(commonRef, 0)

export function log(reference: any, ...messages: any[]) {
	const id = LogIdByRef.get(reference ?? commonRef)
	const timestamp = new Date().toISOString()
	const stack = new Error().stack || ""
	const stackLines = stack.split("\n")
	const lines = stackLines
		.reverse()
		.map((line) => {
			if (!line.includes("at ")) return
			if (line.includes("node:")) return
			if (line.includes("node_modules/")) return
			const [, functionName, fileDetail] = line.trim().split(" ")
			if (functionName === "log") return
			if (functionName === "processTicksAndRejections") return
			const [col, row, fileName] =
				fileDetail
					?.split(/[\(\)\/\:]/)
					.filter((a) => a)
					.reverse() ?? []
			return `${functionName}(${fileName}:${row})`
		})
		.filter((line) => line)
		.join(" -> ")

	console.log(`${timestamp} - ${lines}`, ...messages)
}

// @ts-check
import express, { Request, Response } from "express"
import mongoose from "mongoose"
import { LogIdByRef, log } from "./helpers/logger"
import { ConfigurationModel, connectMongodb } from "./helpers/mongodb"

const app = express()
const port = 3000

connectMongodb()

// add a middleware to parse json
app.use(express.json())

// add a middleware to parse urlencoded
app.use(express.urlencoded({ extended: true }))

// add a middleware to log requests
app.use((req, res, next) => {
	LogIdByRef.set(req, LogIdByRef.size + 1)
	res.on("finish", () => {
		LogIdByRef.delete(req)
	})
	next()
})

// add an options route to enable CORS
app.options("*", (req, res) => {
	respond(res, "ok")
})

app.get("/gateway/v1/configurations/:id", async (req, res) => {
	try {
		const configuration = await ConfigurationModel.findById(req.params.id)

		respond(res, { message: "Configuration fetched successfully!", payload: configuration })
	} catch (error) {
		respond(res, { message: "Configuration fetch failed!", error }, 500)
	}
})

app.get("/gateway/v1/configurations", async (req, res) => {
	try {
		const configurations = await ConfigurationModel.find(req.body)

		respond(res, { message: "Configurations fetched successfully!", payload: configurations })
	} catch (error) {
		respond(res, { message: "Configurations fetch failed!", error }, 500)
	}
})

app.post("/gateway/v1/configurations", async (req, res) => {
	try {
		if (req.body._id) {
			const configuration = await ConfigurationModel.updateOne({ _id: req.body._id }, req.body)
			respond(res, { message: "Configuration updated successfully!", payload: configuration })
		} else {
			const configuration = await ConfigurationModel.create(req.body)
			respond(res, { message: "Configuration created successfully!", payload: configuration })
		}
	} catch (error) {
		respond(res, { message: "Configuration creation failed!", error }, 500)
	}
})

app.put("/gateway/v1/configurations/:id", async (req, res) => {
	try {
		if (req.params.id) res.status(400).send({ message: "Configuration id is required!" })

		const configuration = await ConfigurationModel.updateOne({ _id: req.params.id }, req.body)

		respond(res, { message: "Configuration updated successfully!", payload: configuration })
	} catch (error) {
		respond(res, { message: "Configuration update failed!", error }, 500)
	}
})

app.delete("/gateway/v1/configurations/:id", async (req, res) => {
	try {
		const configuration = await ConfigurationModel.deleteOne({ _id: req.params.id })

		respond(res, { message: "Configuration deleted successfully!", payload: configuration })
	} catch (error) {
		respond(res, { message: "Configuration deletion failed!", error }, 500)
	}
})

app.all("*", async (req, res) => {
	let configuration = await ConfigurationModel.findOne({ src: new RegExp(req.path) })
	if (!configuration) return respond(res, { message: "Invalid route!" }, 404)

	let output: any = {}
	let lastReturnName: string | undefined | null = undefined
	for (const func of configuration.functions) {
		switch (func.mode) {
			case "fetch":
				let response = await fetch(func.fetchSettings?.url!, {
					method: func.fetchSettings?.method ?? "GET",
					headers: func.fetchSettings?.headers,
					body: func.fetchSettings?.body,
				})
				let data = await response.json()
				func.returnName && (output[func.returnName] = data)
				lastReturnName = func.returnName
				break
			case "static":
				func.returnName && (output[func.returnName] = func.staticSettings?.payload)
				lastReturnName = func.returnName
				break
			case "function":
				let fn = eval(func.functionSettings?.functionName!)
				let args = func.functionSettings?.functionArgs?.map((arg) => eval(arg))
				let result = fn(...args!)
				func.returnName && (output[func.returnName] = result)
				lastReturnName = func.returnName
				break
		}
	}
})

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
	log(null, `App listening at http://localhost:${port}`)
})

function respond(res: Response, body: any, code: number = 200) {
	res.set("Access-Control-Allow-Origin", "*")
	res.set("Access-Control-Allow-Headers", "*")
	res.set("Access-Control-Allow-Methods", "*")
	res.send(body).sendStatus(code)
}

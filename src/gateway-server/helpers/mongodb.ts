import mongoose, { InferSchemaType } from "mongoose"
import { log } from "./logger"
import { query } from "express"

// Connection URL
const url = "mongodb://trip_analytics:t22XQCpb3bvqSwzvYk7sSShdQjt4rX65@127.0.0.2:27017,127.0.0.3:27017/trip_analytics?replicaSet=production-replica-set&authSource=trip_analytics";

//?replicaSet=rs0

export const connectMongodb = async () => {
	try {
		await mongoose.connect(url, {})
		log(null, "mongodb connected!")

		// // Define a schema
		// const testSchema = new mongoose.Schema({ name: String });
	  
		// // Create a model
		// const TestModel = mongoose.model('Test', testSchema);
	  
		// // Create a change stream
		// const changeStream = TestModel.watch();
	  
		// // Listen for change events
		// changeStream.on('change', function(change) {
		//   console.log('A change occurred:', change);
		// });

	} catch (error) {
		log("mongodb error", error)
	}
}

// Configuration Schema
const configurationSchema = new mongoose.Schema({
	src: String,
	mode: String, // STARTS_WITH, EQUALS, PATTERN
	method: String, // GET, POST, PUT, DELETE
	functions: [
		{
			mode: String, // fetch, static, function
			fetchSettings: {
				urlMode: String, // FORWARD, EXACT
				url: String,
				method: String, // GET, POST, PUT, DELETE
				headers: Object,
				body: Object,
				query: Object,
			},
			staticSettings: {
				payload: Object,
			},
			functionSettings: {
				functionName: String,
				functionArgs: [String],
			},
			returnName: String,
		},
	],
})

// Configuration Model
export const ConfigurationModel = mongoose.model("Configuration", configurationSchema, "configurations")

export type ConfigurationType = InferSchemaType<typeof configurationSchema>

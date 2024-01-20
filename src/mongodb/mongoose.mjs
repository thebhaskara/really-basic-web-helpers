import mongoose from 'mongoose';
mongoose.connect('mongodb://tripAnalytics:tripAtZipTrrip@localhost:27017/trip_analytics', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to the database!");

  // Define a schema
  const testSchema = new mongoose.Schema({ name: String });

  // Create a model
  const TestModel = mongoose.model('Test', testSchema, 'test');

  // Create a change stream
  const changeStream = TestModel.watch();

  // Listen for change events
  changeStream.on('change', function(change) {
    console.log('A change occurred:', change);
  });
});
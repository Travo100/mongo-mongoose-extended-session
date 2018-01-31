var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new StudentSchema object
// This is similar to a Sequelize model
var StudentSchema = new Schema({
    schedule: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    isHonorRoll: {
        type: Boolean,
        default: false
    }
});

// This creates our model from the above schema, using mongoose's model method
var Student = mongoose.model("Student", StudentSchema);

// Export the Student model
module.exports = Student;

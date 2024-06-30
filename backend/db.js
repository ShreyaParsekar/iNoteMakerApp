const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/iNoteMaker"

// const connectToMongo = () => {
//     mongoose.connect(mongoURI, () =>{
//         console.log('connected to mongo successfully');
//     })
// }

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

module.exports = connectToMongo;
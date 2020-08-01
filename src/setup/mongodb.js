const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to mongodb'))
    .catch((err) => console.log("Couldn't connect to mongodb", err));
}
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Database connected successfully ✅");
})
.catch((err) => {
    console.log("Database didn't connect ❌");
});

module.exports = mongoose;
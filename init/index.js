require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.MONGO_URL;

const initDB = async () => {
    if (!MONGO_URL) {
        throw new Error("MONGO_URL is not set. Add it to the project .env file.");
    }

    await mongoose.connect(MONGO_URL);
    console.log("connected to DB");
    const owner = await User.findOne();
    if (!owner) {
        throw new Error("Create an account in the app before loading listing data.");
    }

    await Listing.deleteMany({});
    const listings = initData.data.map((listing) => ({
        ...listing,
        owner: owner._id
    }));
    await Listing.insertMany(listings);
    console.log("data was initialized");
};

initDB()
    .catch((error) => {
        console.error("Failed to initialize data:", error);
        process.exitCode = 1;
    })
    .finally(() => mongoose.connection.close());
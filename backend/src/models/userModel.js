const mongoose = require("mongoose");

const userSchema = new mongoose.Schema( 
    {
        username: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
            
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        address: {
            street: { type: String },
            postalCode: { type: String },
            city: { type: String },
            country: { type: String, default: "Finland" },
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        
        favorites: [
            {
            eventId: {
                type: String,
                required: true,
            },
            title: String,
            date: String,
            image: String,
            },
        ],

        subscriptions: [
            {
                type: {
                    type: String,
                    enum: ["category", "venue", "event"],
                    required: true,
                },
                targetId: {
                    type: String,
                    require: true,
                },
            },
        ],

        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },

    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
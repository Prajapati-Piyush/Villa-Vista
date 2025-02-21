import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            enum: ['General', 'Service', 'Product', 'Other'],
            default: 'General',
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
            default: 5,
        },
        feedback: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;

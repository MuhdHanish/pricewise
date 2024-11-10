import { Product as TProduct } from "@/types";
import mongoose, { Model, Schema } from "mongoose";

const ProductSchema = new Schema<TProduct>(
    {
        url: { type: String, required: true, unique: true },
        currency: { type: String, default: '$' },
        image: { type: String, default: null },
        imageUrls: { type: [String], default: [] },
        title: { type: String, required: true },
        currentPrice: { type: Number, required: true },
        originalPrice: { type: Number, required: true },
        priceHistory: [
            {
                price: {
                    type: Number,
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            },
        ],
        discountRate: { type: Number },
        reviewsCount: { type: Number, default: 0 },
        stars: { type: Number, default: 0 },
        isOutOfStock: { type: Boolean, default: false },
        description: { type: String },
        lowestPrice: { type: Number },
        highestPrice: { type: Number },
        averagePrice: { type: Number },
        users: [
            {
                email: {
                    type: String,
                    required: true
                }
            },
        ],
    },
    { timestamps: true }
);

const Product: Model<TProduct> = mongoose.models.Product || mongoose.model<TProduct>("Product", ProductSchema);

export default Product;

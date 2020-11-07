import mongoose, { Schema, Model, Document } from 'mongoose';

export interface SliderDocument extends Document {
    url: string;
   
};


const SliderSchema = new Schema({
    url: String
},{timestamps: true});

export const Slider: Model<SliderDocument> = mongoose.model("Slider", SliderSchema)
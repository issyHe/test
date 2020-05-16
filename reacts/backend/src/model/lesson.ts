import mongoose, { Schema, Model, Document } from 'mongoose';

export interface LessonDocument extends Document {
    order: number,
    title: string;
    video: string;
    poster: string;
    url: string;
    price: number;
    category: string;
};


const LessonSchema = new Schema({
    order: Number,
    title: String,
    video: String,
    poster: String,
    url: String,
    price: Number,
    category: String
},{timestamps: true,
    toJSON: {
        transform: function(_doc: any, result: any){
            result.id = result._id;
            delete result._id;
            delete result.__v;
            delete result.createdAt;
            delete result.updatedAt;
            return result;            
        }
    }
});

export const Lesson: Model<LessonDocument> = mongoose.model("Lesson", LessonSchema)
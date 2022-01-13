import mongoose, { Mongoose, Types, Document } from "mongoose";

export interface Category extends Document  {
    name: string;
    public: boolean;
}

const CategorySchema = new mongoose.Schema<Category>({
    name: String,
    public: Boolean
});

export default mongoose.models.Category as mongoose.Model<Category, {}, {}, {}> || mongoose.model('Category', CategorySchema)
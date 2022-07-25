import mongoose, {  Document } from "mongoose";

export interface Category extends Document  {
    name: string;
    public: boolean;
    owner: string;
}

const CategorySchema = new mongoose.Schema<Category>({
    name: String,
    public: Boolean,
    owner: String,
});

export default mongoose.models.Category as mongoose.Model<Category, {}, {}, {}> || mongoose.model('Category', CategorySchema)
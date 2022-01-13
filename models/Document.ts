import mongoose, { Mongoose, Types, Document as D } from "mongoose";

export interface Document extends D {
    name: string;
    folder: boolean;
    parent?: Types.ObjectId;
}

const DocumentSchema = new mongoose.Schema<Document>({
    name: String,
    folder: Boolean,
    parent: Types.ObjectId
});

export default mongoose.models.Document as mongoose.Model<Document, {}, {}, {}> || mongoose.model('Document', DocumentSchema)
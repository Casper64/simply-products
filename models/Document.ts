import mongoose, { Mongoose, Types, Document as D } from "mongoose";

export interface Document extends D {
    name: string;
    folder: boolean;
    parent: string;
    project: string;
}

const DocumentSchema = new mongoose.Schema<Document>({
    name: String,
    folder: Boolean,
    parent: String,
    project: String
});

export default mongoose.models.Document as mongoose.Model<Document, {}, {}, {}> || mongoose.model('Document', DocumentSchema)
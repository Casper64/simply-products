import mongoose, { Mongoose, Types, Document } from "mongoose";

export interface Project extends Document {
    name: string;
    public: boolean;
    category: string;
    owner: string;
}

const ProjectSchema = new mongoose.Schema<Project>({
    name: String,
    public: Boolean,
    category: String,
    owner: String,
});

export default mongoose.models.Project as mongoose.Model<Project, {}, {}, {}> || mongoose.model('Project', ProjectSchema)
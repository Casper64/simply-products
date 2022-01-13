import dbConnect from 'lib/dbConnect'
import Project from 'models/Project'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    await dbConnect();

    switch(method) {
        case 'GET':
            try {
                // Find all the data in the database
                const projects = await Project.find();
                res.status(200).json({ success: true, data: projects })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST':
            try {
                // Create a n ew model in the database
                const project = await Project.create(req.body)
                res.status(200).json({ success: true, data: project })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        default:
            res.status(400).json({ success: false });
            break
    }
}

export default handler;
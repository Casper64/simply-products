import dbConnect from 'lib/dbConnect'
import Project from 'models/Project'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let s  = getSession(req, res);
    const owner: string = s?.user.sub;
    if (!owner) {
        res.status(400).json({ success: false, message: "User id is invalid!"});
        return
    }

    const { method } = req
    await dbConnect();

    switch(method) {
        case 'GET':
            try {
                // Find all the data in the database
                const projects = await Project.find({owner});
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

export default withApiAuthRequired(handler);
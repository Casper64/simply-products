import dbConnect from 'lib/dbConnect'
import Document from 'models/Document'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'

const handler: NextApiHandler = async (req, res) => {
    let s  = getSession(req, res);
    const id: string = s?.user.sub;
    if (!id) {
        res.status(400).json({ success: false, message: "User id is invalid!"});
        return
    }

    const { method } = req
    await dbConnect();

    switch(method) {
        case 'GET':
            try {
                // Find all the data in the database
                const documents = await Document.find({owner: id});
                res.status(200).json({ success: true, data: documents })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST':
            try {
                // Create a new model in the database
                const document = await Document.create(req.body)
                res.status(200).json({ success: true, data: document })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'DELETE':
            try {
                // Delete multiple documents from the database
                const deletedDocuments = await Document.deleteMany(req.body);
                if (!deletedDocuments) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: {} })
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
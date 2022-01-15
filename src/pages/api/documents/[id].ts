import dbConnect from 'lib/dbConnect'
import Document from 'models/Document'
import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let s  = getSession(req, res);
    const owner: string = s?.user.sub;
    if (!owner) {
        res.status(400).json({ success: false, message: "User id is invalid!"});
        return
    }

    const {
        query: { id },
        method
    } = req;
    await dbConnect();

    switch(method) {
        case 'GET': /* Get a model by its ID */
            try {
                const document = await Document.findOne({_id: id, owner})
                if (!document) {
                    return res.status(400).json({ success: false, message: "Document doesn't exist or you have no access to this project" })
                }
                res.status(200).json({ success: true, data: document })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST': /* Get a document by its Project ID */
            try {
                const documents = await Document.find({project: id, owner})
                if (!documents) {
                    return res.status(400).json({ success: false, message: "Project doesn't exist or you have no access to this project" })
                }
                res.status(200).json({ success: true, data: documents })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break

        case 'PUT': /* Edit a model by its ID */
            try {
                const document = await Document.findOneAndUpdate({_id: id, owner}, req.body, {
                    new: true,
                    runValidators: true,
                })
                if (!document) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: document })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break

        case 'DELETE': /* Delete a model by its ID */
            try {
                const deletedDocument = await Document.deleteOne({ _id: id, owner })
                if (!deletedDocument) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: {} })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break

        default:
            res.status(400).json({ success: false })
            break
    }
}

export default withApiAuthRequired(handler)
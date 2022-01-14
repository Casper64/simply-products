import dbConnect from 'lib/dbConnect'
import Document from 'models/Document'
import { NextApiRequest, NextApiResponse } from 'next'


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { id },
        method
    } = req;
    await dbConnect();

    switch(method) {
        case 'GET': /* Get a model by its ID */
            try {
                const document = await Document.findById(id)
                if (!document) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: document })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST': /* Get a document by its Project ID */
            try {
                const documents = await Document.find({project: id})
                if (!documents) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: documents })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break

        case 'PUT': /* Edit a model by its ID */
            try {
                const document = await Document.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
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
                const deletedDocument = await Document.deleteOne({ _id: id })
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

export default handler
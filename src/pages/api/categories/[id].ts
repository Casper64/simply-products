import dbConnect from 'lib/dbConnect'
import Category from 'models/Category'
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
                const category = await Category.findById(id)
                if (!category) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: category })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break

        case 'PUT': /* Edit a model by its ID */
            try {
                const category = await Category.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                })
                if (!document) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: category })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'DELETE': /* Delete a model by its ID */
            try {
                const deletedCategory = await Category.deleteOne({ _id: id })
                if (!deletedCategory) {
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
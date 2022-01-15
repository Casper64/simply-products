import dbConnect from 'lib/dbConnect'
import Category from 'models/Category'
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
                const category = await Category.findOne({_id: id, owner})
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
                const category = await Category.findOneAndUpdate({_id: id, owner}, req.body, {
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

export default withApiAuthRequired(handler)
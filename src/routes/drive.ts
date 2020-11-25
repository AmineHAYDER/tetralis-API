import {Router} from 'express'
import {authorize} from "../lib/oath2Services";
import DriveServices from '../services/Drive'

const router = Router()

router.get("/spreadsheets",authorize, async (req:any, res:any) => {
try {
    const token = req.token
    const data:any = await DriveServices.getSpreadsheets(token)
    if (data.files.length) {
        let filesList: any = []
        data.files.map((file: any) => {
            filesList.push({name: file.name, id: file.id})
        });
        return res.send(filesList).status(200)
    } else {
         res.send('No files found.').status(404)
    }
}catch (e) {
    console.log(e)
     return res.status(500).send(e)
}
})

export default router

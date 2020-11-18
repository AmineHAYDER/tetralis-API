import {Router} from 'express'
import {authorize} from "../lib/oath2Services";
import SpreadsheetsService from "../services/Spreadsheet";

const router = Router()

router.get("/:id",authorize, async (req:any, res:any) => {
    try {
        const token = req.token
        const {id:spreadsheetId} = req.params
        const data:any = await SpreadsheetsService.getSpreadsheet(spreadsheetId,token)
        const tables = data.valueRanges;
        if (tables.length) {
            const rowsMap = SpreadsheetsService.deduplicate(tables[0],tables[1],tables[2])
            const update = await SpreadsheetsService.mergeTable(spreadsheetId,token,rowsMap)
            return res.json(update)
        } else {
            console.log('No data found.');
        }
    }catch (e) {
         res.status(500).send()
    }
})

export default router

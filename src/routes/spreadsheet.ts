import {Router} from 'express'
import {authorize} from "../lib/oath2Services";
import SpreadsheetsService from "../services/Spreadsheet";
import Deduplication from "../lib/DeduplicationService";
import DeduplicationService from "../lib/DeduplicationService";

const router = Router()

router.get("/:id/tables", authorize, async (req: any, res: any) => {
    try {
        const token = req.token
        const {id: spreadsheetId} = req.params
        const data: any = await SpreadsheetsService.getSpreadsheetSheets(spreadsheetId, token)
        return res.json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
})
router.get("/:id/keys", authorize, async (req: any, res: any) => {
    try {
        const token = req.token
        const Sheets = req.query.tables
        const {id: spreadsheetId} = req.params
        if (Sheets) {
            let sheets = Sheets.split(',').map((sheet: any) => sheet)
            const data: any = await SpreadsheetsService.getSpreadsheetKeys(spreadsheetId, sheets, token)
            return res.json(data)
        }
        const sheets: any = await SpreadsheetsService.getSpreadsheetSheets(spreadsheetId, token)
        const data: any = await SpreadsheetsService.getSpreadsheetKeys(spreadsheetId, sheets, token)
        return res.json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
})
router.get("/:id/Deduplicate", authorize, async (req: any, res: any) => {
    try {
        const token = req.token
        const Sheets: any = req.query.tables
        const Keys: any = req.query.keys
        console.log(req.query)
        const {id: spreadsheetId} = req.params
        if (Keys) {
            let keys = Keys.split(',').map((key: any) => key)
            let ranges: any = []

            if (!Sheets) {
                ranges = await SpreadsheetsService.getSpreadsheetSheets(spreadsheetId, token)
            } else ranges = Sheets.split(',').map((sheet: any) => sheet)

            console.log(ranges)
            const data: any = await SpreadsheetsService.getSpreadsheetRows(spreadsheetId, token, ranges)
            const AllKeys: any = await SpreadsheetsService.getSpreadsheetKeys(spreadsheetId, ranges, token)
            const KeyIndexes: any = await DeduplicationService.formatKey(keys, AllKeys)
            const rows: any = await DeduplicationService.deduplicate(data, KeyIndexes)
            const success: any = await SpreadsheetsService.mergeTable(spreadsheetId, token, rows)
            return res.json(success)
        }
        return res.status(500).send("keys not found")

    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
})


export default router

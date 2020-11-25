import {oAuth2Client} from "../lib/oath2Services";
import {google} from "googleapis";
import {Max} from '../lib'

class SpreadsheetsService {
    public async getSpreadsheet(spreadsheetId: string, token: string) {//request rows in the three tables to merge

        oAuth2Client.setCredentials({
            access_token: token
        })
        const request = {
            spreadsheetId: spreadsheetId,
            includeGridData: false,
            auth: oAuth2Client,
        };
        const sheets = google.sheets({version: 'v4', auth: oAuth2Client});
        return (await sheets.spreadsheets.get(request)).data;
    }

    public async getSpreadsheetSheets(spreadsheetId: string, token: string) {//request rows in the three tables to merge

        const spreadsheet = await this.getSpreadsheet(spreadsheetId, token);
        return spreadsheet.sheets?.map(sheet => sheet.properties?.title);

    }

    public async getSpreadsheetKeys(spreadsheetId: string, Sheets: string[], token: string) {//request rows in the three tables to merge
        oAuth2Client.setCredentials({
            access_token: token
        })
        const sheets = google.sheets({version: 'v4', auth: oAuth2Client});
        let ranges = Sheets.map(sheet => sheet + '!1:1');
        const data: any = (await sheets.spreadsheets.values.batchGet({spreadsheetId: spreadsheetId, ranges})).data;
        const sheetsKeys = data.valueRanges.map((sheet: any) => sheet.values[0])
        return Max(sheetsKeys)
    }

    public async getSpreadsheetRows(spreadsheetId: string, token: string, ranges: any) {//request rows in the three tables to merge
        oAuth2Client.setCredentials({
            access_token: token
        })
        const sheets = google.sheets({version: 'v4', auth: oAuth2Client});
        const data: any = (await sheets.spreadsheets.values.batchGet({spreadsheetId: spreadsheetId, ranges})).data;
        return data.valueRanges?.map((sheet: any) => sheet.values);
    }

    public async mergeTable(spreadsheetId: string, token: string, rows: any) {
        oAuth2Client.setCredentials({
            access_token: token
        });
        const sheets = google.sheets({version: 'v4', auth: oAuth2Client});
        const request: any = {
            spreadsheetId: spreadsheetId,
            range: `C!A:Z`,
            valueInputOption: "RAW",
            resource: {
                "majorDimension": "ROWS",
                "values": rows
            },
            auth: oAuth2Client,
        };
        return (await sheets.spreadsheets.values.update(request)).data; //merging all data in C

    }
}

export default new SpreadsheetsService()

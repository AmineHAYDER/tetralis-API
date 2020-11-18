import {oAuth2Client} from "../lib/oath2Services";
import {google} from "googleapis";
import {arrayToMap} from "../lib";

class SpreadsheetsService {
    public async getSpreadsheet(spreadsheetId: string, token: string) {//request rows in the three tables to merge
        oAuth2Client.setCredentials({
            access_token: token
        })

        const sheets = google.sheets({version: 'v4', auth: oAuth2Client});
        let ranges = ['A!A2:F', 'B!A2:F', 'C!A2:F'];   //range for C to make sure data won't be duplicated
        return (await sheets.spreadsheets.values.batchGet({
            spreadsheetId: spreadsheetId,
            ranges,
        })).data;
    }
    public deduplicate(aTable: any, bTable: any,cTable: any) {
        let rowsMap = {}
        if (cTable.values)  rowsMap = {...arrayToMap(cTable.values)}   //using map to simplify searching for data by key
        rowsMap = this.fusionTable(rowsMap,aTable)//supposing A is higher priority
        rowsMap = this.fusionTable(rowsMap,bTable)
        return Object.values(rowsMap)
    }
    public fusionTable(rowsMap: any, Table: any) {
        Table.values.map((row: any) => {
            const mapKey = row[0] + row[1] + row[2]
            if (rowsMap.hasOwnProperty(mapKey)) { //duplicated key detected
                if (!rowsMap[mapKey][5] && row[5]) { // check if company exits only in the lower priority table so it will be updated
                    if (!rowsMap[mapKey][3] && !rowsMap[mapKey][4]) rowsMap[mapKey] = row //check if city and country doesn't exists
                    else rowsMap[mapKey][5] = row[5]
                }else if (!rowsMap[mapKey][3] && !rowsMap[mapKey][4]){
                        rowsMap[mapKey][3]=row[3]
                        rowsMap[mapKey][4]=row[4]
                    }
            }else rowsMap ={
                ...rowsMap,
                [mapKey]:row
            }
        })
        return rowsMap
    }

    public async mergeTable(spreadsheetId:string,token:string,rowsMap:any) {
        oAuth2Client.setCredentials({
            access_token: token
        });
        const sheets = google.sheets({version: 'v4', auth: oAuth2Client});
        const request:any = {
            spreadsheetId:spreadsheetId,
            range: 'C!A2:F',
            valueInputOption: "RAW",
            resource:  {
                "majorDimension": "ROWS",
                "values": rowsMap
            },
            auth: oAuth2Client,
        };
        return (await sheets.spreadsheets.values.update(request)).data; //merging all data in C

    }
}

export default new SpreadsheetsService()

import {arrayToMap} from "../lib";

class DeduplicationService {
    public formatKey(keys: any, AllKeys: string[]) {

        let keysIndexes: any = []
        for (let i = 0; i < keys.length; i++) {
            keysIndexes.push(AllKeys.indexOf(keys[i]))
        }
        return keysIndexes
    }

    public deduplicate(rows: any, keysIndexes: number[]) {

        let rowsMap = {}
        for (let i = 0; i < rows.length; i++) {
            rowsMap = this.fusionTable(rowsMap, rows[i], keysIndexes)
        }
        return Object.values(rowsMap)
    }

    public fusionTable(rowsMap: any, Table: any, keys: any) {

        Table.map((row: any) => {
            let mapKey = ""
            for (let i = 0; i < keys.length; i++) {
                mapKey += row[keys[i]]
            }
            if (rowsMap.hasOwnProperty(mapKey)) { //duplicated key detected
                if (!rowsMap[mapKey][5] && row[5]) { // check if company exits only in the lower priority table so it will be updated
                    if (!rowsMap[mapKey][3] && !rowsMap[mapKey][4]) rowsMap[mapKey] = row //check if city and country doesn't exists
                    else rowsMap[mapKey][5] = row[5]
                } else if (!rowsMap[mapKey][3] && !rowsMap[mapKey][4]) {
                    rowsMap[mapKey][3] = row[3]
                    rowsMap[mapKey][4] = row[4]
                }
            } else rowsMap = {
                ...rowsMap,
                [mapKey]: row
            }
        })
        return rowsMap
    }

}

export default new DeduplicationService()

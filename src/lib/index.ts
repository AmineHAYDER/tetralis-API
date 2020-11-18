export function arrayToMap(array:any) {
    const map:any = {}
    for (const item of array)
        map[item[0]+item[1]+item[2]] = item
    return map
}

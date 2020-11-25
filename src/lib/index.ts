export function arrayToMap(array: any) {
    const map: any = {}
    for (const item of array)
        map[item[0] + item[1] + item[2]] = item
    return map
}

export function Max(arrays: any) {
    let index = -1
    let max = 0
    arrays.map((array: any, i: any) => {
            if (array.length > max) {
                max = array.length
                index = i
            }
        }
    )
    return arrays[index]
}


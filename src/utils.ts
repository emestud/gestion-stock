/**
 * This function prints nicely proxy objects
 * @param object object to print
 */
export function proxyPrint(object: any) {
    if (object === undefined || object === null) {
        return;
    }
    console.log(JSON.parse(JSON.stringify(object)));
}
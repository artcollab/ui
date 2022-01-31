/* generates a random color background for the user if they don't have a profile picture */
export function ColorName(name: string | String | undefined) {

    /* initial variables */
    let hash = 0
    let idx = 0
    let color = '#'

    /* default color in unexpected undefined name */
    if(name === undefined) {
        return color + 'f8f8ff'
    }

    /* generates hash value dependent on username */
    while (idx < name.length) {
        hash = name.charCodeAt(idx) + ((hash << 5) - hash)
        idx++
    }

    /* generates the color based on the hash value obtained previously */
    for (idx = 0; idx <= 2; idx++) {
        const randomColVal = (hash >> (idx * 8)) & 0xFF
        color += randomColVal.toString(16)
    }

    return color

}
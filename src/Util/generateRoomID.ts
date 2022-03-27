export { }

/* alphabet constant which includes alphabetical characters from a-z & A-Z */
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* initial empty string for the roomID */
let roomID = '';

export function generateRoomID() {
    /* generates 6 random alphabetical characters [a-Z] as a string */
    roomID = '';
    while (roomID.length < 6) {
        roomID += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return roomID;
}
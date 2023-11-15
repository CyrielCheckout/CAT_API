function delay(ms) {
    const date = Date.now();
    let currentDate = null;
 
    do {
        currentDate = Date.now();
    } while (currentDate - date < ms);
}
module.exports = {
    delay
};
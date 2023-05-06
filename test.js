const os = require('os');

const checkIP = () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const iface in interfaces) {
        for (const address of interfaces[iface]) {
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }

    return (addresses[0] === '10.0.4.161')
}

console.log(checkIP());

// console.log(addresses[0]);

// const date = new Date();
// console.log(date.getDay());
// console.log(date.getHours());
// console.log(date.getMinutes());
// console.log(date.getSeconds());

// const checkTimeCheckIn = (date) => {
//     if (date.getHours() > 9) return false;
//     if (date.getHours() === 9 && date.getMinutes() > 5) return false;
//     return true;
// }

// const date = new Date();

// console.log(checkTimeCheckIn(date));

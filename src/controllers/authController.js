const os = require('os');
const config = require('../config/config');

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

    // addresses[0];
    return (addresses[0] === config.IP)
}

const checkTimeCheckIn = (date) => {
    if (date.getHours() > 21) return false;
    if (date.getHours() === 21 && date.getMinutes() > 20) return false;
    return true;
}

const checkIPv2 = (req, res) => {
    const userIp = req.ips;
    return userIp[0];
}

module.exports = { checkIP, checkTimeCheckIn, checkIPv2 };

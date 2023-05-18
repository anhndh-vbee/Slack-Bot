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
  return addresses[0] === config.IP;
};

const checkTimeCheckIn = (date) => {
  if (date.getHours() > 22) return false;
  if (date.getHours() === 22 && date.getMinutes() > 20) return false;
  return true;
};

const checkIPv2 = (req, res) => {
  const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.socket?.remoteAddress;
  return parseIp(req);
};

module.exports = { checkIP, checkTimeCheckIn, checkIPv2 };

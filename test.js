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

  // addresses[0];
  return addresses[0];
};

console.log(checkIP());

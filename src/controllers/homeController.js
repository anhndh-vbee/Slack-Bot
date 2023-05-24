const home = (req, res) => {
    res.status(200).send("welcome to Check In app!");
};

module.exports = { home };

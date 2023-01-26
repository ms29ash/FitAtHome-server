const jwt = require('jsonwebtoken');

const fetchIds = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).send({ success: false, errorMessage: "Access Denied" })
        } else {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data;
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, errorMessage: "Access Denied" })
    }
}

module.exports = fetchIds
const jwt = require("jsonwebtoken");
const db = require('./db');

async function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: "No credentials sent!" });
    } else {
        if (req.headers.authorization.split(" ")[0] !== "Bearer") {
            return res.status(403).json({ error: "Invalid token!" });
        }

        try {
            let jwtSecretKey = "fsdjfsldkj34#$%#$%#$%#$5#$%#$5jslf!@#@!#!2132";
            // check if the token is valid or not
            req.authData = jwt.verify(
                req.headers.authorization.split(" ")[1], // auth token
                jwtSecretKey
            );
            req.user = await db.getUserById(req.authData.id);
        } catch (error) {
            console.error(error);
            return res
                .status(403)
                .json({ message: "Invalid token!", success: false });
        }
    }
    next();
}

module.exports = verifyToken;

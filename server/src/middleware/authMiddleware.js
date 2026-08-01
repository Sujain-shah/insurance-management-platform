const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        console.log("Authorization:", req.headers.authorization);

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const decoded = jwt.verify(token, "mysecretkey");

        req.user = decoded;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access Denied",
            });
        }

        next();
    };
};

module.exports = {
    auth,
    authorizeRoles,
};
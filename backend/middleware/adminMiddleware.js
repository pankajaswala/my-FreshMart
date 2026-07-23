
const adminOnly = (req, res, next) => {
    try {
        // protect middleware already sets req.user
        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized, no user found"
            });
        }

        // check admin role
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                message: "Admin access only"
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Server error in admin middleware"
        });
    }
};

module.exports = adminOnly;
const prisma = require("../config/prisma");

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        res.status(200).json({
            success: true,
            data: users,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Change User Role
const updateUserRole = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { role } = req.body;

        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                role,
            },
        });

        res.status(200).json({
            success: true,
            message: "Role Updated Successfully",
            data: user,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
};
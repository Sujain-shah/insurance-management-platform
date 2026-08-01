const prisma = require("../config/prisma");

// Add Policy
const addPolicy = async (req, res) => {
    try {
        const {
            policyName,
            policyType,
            premiumAmount,
            startDate,
            endDate,
            status,
            customerId,
        } = req.body;

        const customer = await prisma.customer.findUnique({
            where: {
                id: Number(customerId),
            },
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer Not Found",
            });
        }

        const policy = await prisma.policy.create({
            data: {
                policyNumber: `POL${Date.now()}`,   // 👈 ye line add karo
                policyName,
                policyType,
                premiumAmount: Number(premiumAmount),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status,
                customerId: Number(customerId),
            },
        });

        res.status(201).json({
            success: true,
            message: "Policy Added Successfully",
            data: policy,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get All Policies
const getAllPolicies = async (req, res) => {
    try {
        const policies = await prisma.policy.findMany({
            include: {
                customer: true,
            },
        });

        res.status(200).json({
            success: true,
            data: policies,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get My Policies (Customer)
const getMyPolicies = async (req, res) => {
    try {
        const userId = req.user.id;

        const customer = await prisma.customer.findUnique({
            where: {
                userId,
            },
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer Not Found",
            });
        }

        const policies = await prisma.policy.findMany({
            where: {
                customerId: customer.id,
            },
        });

        res.status(200).json({
            success: true,
            data: policies,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get Policy By ID
const getPolicyById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const policy = await prisma.policy.findUnique({
            where: { id },
            include: {
                customer: true,
            },
        });

        if (!policy) {
            return res.status(404).json({
                success: false,
                message: "Policy Not Found",
            });
        }

        res.status(200).json({
            success: true,
            data: policy,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Update Policy
const updatePolicy = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const {
            policyName,
            policyType,
            premiumAmount,
            startDate,
            endDate,
            status,
        } = req.body;

        const policy = await prisma.policy.update({
            where: { id },
            data: {
                policyName,
                policyType,
                premiumAmount: Number(premiumAmount),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status,
            },
        });

        res.status(200).json({
            success: true,
            message: "Policy Updated Successfully",
            data: policy,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Delete Policy
const deletePolicy = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.policy.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: "Policy Deleted Successfully",
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
    addPolicy,
    getAllPolicies,
    getMyPolicies,
    getPolicyById,
    updatePolicy,
    deletePolicy,
};
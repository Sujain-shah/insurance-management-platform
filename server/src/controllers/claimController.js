const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create Claim
const addClaim = async (req, res) => {
    try {
        const {
            claimNumber,
            claimAmount,
            reason,
            policyId,
        } = req.body;

        // Logged in customer
        const customer = await prisma.customer.findUnique({
            where: {
                userId: req.user.id,
            },
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer Not Found",
            });
        }

        // Check policy belongs to customer
        const policy = await prisma.policy.findFirst({
            where: {
                id: Number(policyId),
                customerId: customer.id,
            },
        });

        if (!policy) {
            return res.status(403).json({
                success: false,
                message: "Invalid Policy",
            });
        }

        const claim = await prisma.claim.create({
            data: {
                claimNumber,
                claimAmount: Number(claimAmount),
                reason,
                status: "PENDING",
                policyId: policy.id,
            },
        });

        res.status(201).json({
            success: true,
            message: "Claim Submitted Successfully",
            data: claim,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get All Claims
const getAllClaims = async (req, res) => {
    try {
        const claims = await prisma.claim.findMany({
            include: {
                policy: true,
            },
        });

        res.status(200).json({
            success: true,
            data: claims,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// Get My Claims (Customer)
const getMyClaims = async (req, res) => {
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

        const claims = await prisma.claim.findMany({
            where: {
                policy: {
                    customerId: customer.id,
                },
            },
            include: {
                policy: true,
            },
        });

        res.status(200).json({
            success: true,
            data: claims,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get Claim By ID
const getClaimById = async (req, res) => {
    try {
        const { id } = req.params;

        const claim = await prisma.claim.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                policy: true,
            },
        });

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found",
            });
        }

        res.status(200).json({
            success: true,
            data: claim,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Verify Claim (Admin & Agent)
const verifyClaim = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        const claim = await prisma.claim.update({
            where: {
                id: Number(id),
            },
            data: {
                status,
                remarks,
                verifiedAt: new Date(),
                verifiedBy: req.user.id,
            },
        });

        res.status(200).json({
            success: true,
            message: "Claim Verified Successfully",
            data: claim,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Update Claim
const updateClaim = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            claimNumber,
            claimAmount,
            reason,
            status,
            policyId,
        } = req.body;

        const claim = await prisma.claim.update({
            where: {
                id: Number(id),
            },
            data: {
                claimNumber,
                claimAmount,
                reason,
                status,
                policyId,
            },
        });

        res.status(200).json({
            success: true,
            message: "Claim updated successfully",
            data: claim,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Delete Claim
const deleteClaim = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.claimDocument.deleteMany({
            where: {
                claimId: id,
            },
        });

        await prisma.claim.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            success: true,
            message: "Claim Deleted Successfully",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addClaim,
    getAllClaims,
    getMyClaims,
    getClaimById,
    verifyClaim,
    updateClaim,
    deleteClaim,
};
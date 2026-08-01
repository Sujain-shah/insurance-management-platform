const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create Claim
const addClaim = async (req, res) => {
    try {
        const {
            claimNumber,
            claimAmount,
            reason,
            status,
            policyId,
        } = req.body;
        console.log(req.body);

        const claim = await prisma.claim.create({
            data: {
                claimNumber,
                claimAmount: Number(claimAmount),
                reason,
                status,
                policyId: Number(policyId),
            }
        });

        res.status(201).json({
            success: true,
            message: "Claim created successfully",
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
        const { id } = req.params;

        await prisma.claim.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(200).json({
            success: true,
            message: "Claim deleted successfully",
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
    addClaim,
    getAllClaims,
    getClaimById,
    updateClaim,
    deleteClaim,
};
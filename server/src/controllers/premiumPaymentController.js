const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create Premium Payment
const addPremiumPayment = async (req, res) => {
    try {
        const {
            amount,
            paymentDate,
            paymentStatus,
            paymentMethod,
            policyId,
        } = req.body;

        const payment = await prisma.premiumPayment.create({
            data: {
                amount: Number(amount),
                paymentDate: new Date(paymentDate),
                paymentStatus,
                paymentMethod,
                policyId: Number(policyId),
            },
        });

        res.status(201).json({
            success: true,
            message: "Premium Payment Added Successfully",
            data: payment,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get All Premium Payments
const getAllPremiumPayments = async (req, res) => {
    try {
        const payments = await prisma.premiumPayment.findMany({
            include: {
                policy: true,
            },
        });

        res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get Premium Payment By ID
const getPremiumPaymentById = async (req, res) => {
    try {
        const { id } = req.params;

        const payment = await prisma.premiumPayment.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                policy: true,
            },
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Premium Payment not found",
            });
        }

        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Update Premium Payment
const updatePremiumPayment = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            amount,
            paymentDate,
            paymentStatus,
            paymentMethod,
            policyId,
        } = req.body;

        const payment = await prisma.premiumPayment.update({
            where: {
                id: Number(id),
            },
            data: {
                amount: Number(amount),
                paymentDate: new Date(paymentDate),
                paymentStatus,
                paymentMethod,
                policyId: Number(policyId),
            },
        });

        res.status(200).json({
            success: true,
            message: "Premium Payment Updated Successfully",
            data: payment,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Delete Premium Payment
const deletePremiumPayment = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.premiumPayment.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(200).json({
            success: true,
            message: "Premium Payment Deleted Successfully",
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
    addPremiumPayment,
    getAllPremiumPayments,
    getPremiumPaymentById,
    updatePremiumPayment,
    deletePremiumPayment,
};
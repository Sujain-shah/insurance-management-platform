const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create Premium Payment
const addPremiumPayment = async (req, res) => {
    try {
        const {
            amount,
            paymentDate,
            dueDate,
            paymentStatus,
            paymentMethod,
            policyId,
        } = req.body;

        const payment = await prisma.premiumPayment.create({
            data: {
                amount: Number(amount),
                paymentDate: new Date(paymentDate),
                dueDate: dueDate ? new Date(dueDate) : null,
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
            message: error.message,
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

        const today = new Date();

        const updatedPayments = payments.map((payment) => {

            if (
                payment.paymentStatus === "PENDING" &&
                payment.dueDate &&
                new Date(payment.dueDate) < today
            ) {
                payment.paymentStatus = "OVERDUE";
            }

            return payment;
        });

        res.status(200).json({
            success: true,
            data: updatedPayments,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};

// Get My Premium Payments
const getMyPremiumPayments = async (req, res) => {
    try {

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

        const payments = await prisma.premiumPayment.findMany({
            where: {
                policy: {
                    customerId: customer.id,
                },
            },
            include: {
                policy: true,
            },
        });

        const today = new Date();

        const updatedPayments = payments.map((payment) => {

            if (
                payment.paymentStatus === "PENDING" &&
                payment.dueDate &&
                new Date(payment.dueDate) < today
            ) {
                payment.paymentStatus = "OVERDUE";
            }

            return payment;
        });

        res.status(200).json({
            success: true,
            data: updatedPayments,
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
                message: "Premium Payment Not Found",
            });
        }

        if (
            payment.paymentStatus === "PENDING" &&
            payment.dueDate &&
            new Date(payment.dueDate) < new Date()
        ) {
            payment.paymentStatus = "OVERDUE";
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
            dueDate,
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
                dueDate: dueDate ? new Date(dueDate) : null,
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
            message: error.message,
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
    getMyPremiumPayments,
    getPremiumPaymentById,
    updatePremiumPayment,
    deletePremiumPayment,
};
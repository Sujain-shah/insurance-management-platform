const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
// Add Customer
const addCustomer = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phone,
            address,
            dob,
        } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "CUSTOMER",
            },
        });

        const customer = await prisma.customer.create({
            data: {
                fullName,
                phone,
                address,
                dob: new Date(dob),
                userId: user.id,
            },
        });

        res.status(201).json({
            success: true,
            message: "Customer Added Successfully",
            data: customer,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                user: true,
            },
        });

        res.status(200).json({
            success: true,
            data: customers,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get Customer By ID
const getCustomerById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer Not Found",
            });
        }

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Update Customer
const updateCustomer = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { fullName, phone, address, dob } = req.body;

        const customer = await prisma.customer.update({
            where: { id },
            data: {
                fullName,
                phone,
                address,
                dob: new Date(dob),
            },
        });

        res.status(200).json({
            success: true,
            message: "Customer Updated Successfully",
            data: customer,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Delete Customer

const deleteCustomer = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Pehle customer ki saari claims delete karo
        await prisma.claim.deleteMany({
            where: {
                policy: {
                    customerId: id,
                },
            },
        });

        // Fir customer ki saari policies delete karo
        await prisma.policy.deleteMany({
            where: {
                customerId: id,
            },
        });

        // Ab customer delete karo
        await prisma.customer.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            success: true,
            message: "Customer Deleted Successfully",
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
    addCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};
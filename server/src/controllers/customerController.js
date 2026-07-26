const prisma = require("../config/prisma");

// Add Customer
const addCustomer = async (req, res) => {
  try {
    const { fullName, phone, address, dob, userId } = req.body;

    const customer = await prisma.customer.create({
      data: {
        fullName,
        phone,
        address,
        dob: new Date(dob),
        userId,
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
      message: "Server Error",
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

    await prisma.customer.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Customer Deleted Successfully",
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
  addCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
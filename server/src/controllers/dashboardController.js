const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getDashboardData = async (req, res) => {
  try {

    const totalCustomers = await prisma.customer.count();

    const totalPolicies = await prisma.policy.count();

    const totalClaims = await prisma.claim.count();

    const totalPremiumPayments = await prisma.premiumPayment.count();

    const totalDocuments = await prisma.document.count();

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalPolicies,
        totalClaims,
        totalPremiumPayments,
        totalDocuments,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

module.exports = {
  getDashboardData,
};
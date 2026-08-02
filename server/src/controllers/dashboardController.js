const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getDashboardData = async (req, res) => {

  try {

    const totalCustomers = await prisma.customer.count();

    const totalPolicies = await prisma.policy.count();

    const activePolicies = await prisma.policy.count({
      where: {
        status: "ACTIVE",
      },
    });

    const expiredPolicies = await prisma.policy.count({
      where: {
        status: "EXPIRED",
      },
    });

    const totalClaims = await prisma.claim.count();

    const pendingClaims = await prisma.claim.count({
      where: {
        status: "PENDING",
      },
    });

    const approvedClaims = await prisma.claim.count({
      where: {
        status: "APPROVED",
      },
    });

    const rejectedClaims = await prisma.claim.count({
      where: {
        status: "REJECTED",
      },
    });

    const totalDocuments = await prisma.document.count();

    const totalPremiumPayments = await prisma.premiumPayment.count();

    const paidPayments = await prisma.premiumPayment.count({
      where: {
        paymentStatus: "PAID",
      },
    });

    const pendingPayments = await prisma.premiumPayment.count({
      where: {
        paymentStatus: "PENDING",
      },
    });

    const overduePayments = await prisma.premiumPayment.count({
      where: {
        paymentStatus: "OVERDUE",
      },
    });

    const premiumCollection =
      await prisma.premiumPayment.aggregate({

        _sum: {
          amount: true,
        },

        where: {
          paymentStatus: "PAID",
        },

      });
    const customerGrowth = await prisma.customer.count({
      where: {
        createdAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
        },
      },
    });

    const monthlyPolicies = await prisma.policy.count({
      where: {
        createdAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
        },
      },
    });

    const monthlyClaims = await prisma.claim.count({
      where: {
        createdAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalPolicies,
        activePolicies,
        expiredPolicies,

        totalClaims,
        pendingClaims,
        approvedClaims,
        rejectedClaims,

        totalPremiumPayments,
        paidPayments,
        pendingPayments,
        overduePayments,

        premiumCollection:
          premiumCollection._sum.amount || 0,

        totalDocuments,

        customerGrowth,
        monthlyPolicies,
        monthlyClaims,
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
console.log("DOCUMENT CONTROLLER LOADED");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const uploadDocument = async (req, res) => {
  try {
    console.log("=== UPLOAD API HIT ===");
    console.log(req.body);
    console.log(req.file);
    const { policyId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const document = await prisma.document.create({
      data: {
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        policyId: Number(policyId),
      },
    });
    console.log("Saved document:", document);

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      data: document,
    });
  } catch (error) {
    console.log(error);
    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      include: {
        policy: true,
      },
    });

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    await prisma.document.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
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
  uploadDocument,
  getAllDocuments,
  deleteDocument,
};
const prisma = require("../config/prisma");

const uploadClaimDocument = async (req, res) => {
    try {
        const { claimId } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const claim = await prisma.claim.findUnique({
            where: {
                id: Number(claimId),
            },
        });

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim Not Found",
            });
        }

        const document = await prisma.claimDocument.create({
            data: {
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                claimId: Number(claimId),
            },
        });

        res.status(201).json({
            success: true,
            message: "Document Uploaded Successfully",
            data: document,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getClaimDocuments = async (req, res) => {
    try {
        const { claimId } = req.params;

        const documents = await prisma.claimDocument.findMany({
            where: {
                claimId: Number(claimId),
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
            message: "Server Error",
        });
    }
};

module.exports = {
    uploadClaimDocument,
    getClaimDocuments,
};
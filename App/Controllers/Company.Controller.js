const Company = require("../Models/Company.model.js");
const { isAuthenticated } = require("../Middleware/Authentication.js");
const cloudinary = require('../cloudinary');
const getDataUri = require("../datauri.js");

const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ message: "Company name is required" });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({ message: "This Company already exists" });
    } 

    company = await Company.create({ name: companyName, userId: req.user._id });
    return res
      .status(201)
      .json({ message: "Company registered successfully", company });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    const companies = await Company.find({ userId });

    if (!companies) {
      return res.status(404).json({ message: "No companies found" });
    }

    res.status(200).json({ companies });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ company });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, description, location, website } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    // here comes cloudinary logic;

    const updatedData = { name, description, location, website, logo };
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company info updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerCompany, getCompany, getCompanyById, updateCompany };

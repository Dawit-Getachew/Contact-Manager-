const asyncHandler = require("express-async-handler");
const Contact = require("../models/contact-model");
const {
  validateEmail,
  validatePhone,
} = require("../utils/email-phone-validator");

//@desc Get All Contact
//@route GET /api/contacts
//@access private
const getContact = asyncHandler(async (req, res) => {
    if (!req.user.id) {
    res.status(400).json({ message: "Please provide user id!" });
    throw new Error("Please provide user id!");
    }
  const contacts = await Contact.find({ user_id: req.user.id });
  console.log(req.user.id);
  res.status(200).json(contacts);
});

//@desc Create Contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("Request Body is: ", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).json({ message: "All fields are required!" });
    throw new Error("All fileds are required!");
  }
  if (!validatePhone(phone)) {
    res.status(400).json({ message: "Please enter a valid phone number!" });
    throw new Error("Please enter a valid phone number!");
  }
  if (!validateEmail(email)) {
    res.status(400).json({ message: "Please enter a valid email address!" });
    throw new Error("Please enter a valid email address!");
  }
  const contacts = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  console.log(contacts);
  res.status(201).json(contacts);
});

//@desc delete Contact
//@route DELETE /api/contacts:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Please provide contact id!" });
    throw new Error("Please provide contact id!");
  }
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "Contact does not exist" });
    throw new Error("Contact does not exist!");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403).json({
      error: "User doesn't have permission to delete other user's contact",
    });
    throw new Error("User don't have permission to delete other user contacts");
  }
  await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json(contact);
});


//@desc Update Contact
//@route PUT /api/contacts:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "Contact does not exist" });
    throw new Error("Contact does not exist!");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403).json({
      error: "User doesn't have permission to update other user's contact",
    });
    throw new Error("User don't have permission to update other user contacts");
  }
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).json({ message: "All fields are required!" });
    throw new Error("All fileds are required!");
  }
  if (
    contact.name === name &&
    contact.email === email &&
    contact.phone === phone
  ) {
    res.status(400).json({ message: "No changes made!" });
    throw new Error("No changes made!");
  }
  if (!validatePhone(phone)) {
    res.status(400).json({ message: "Please enter a valid phone number!" });
    throw new Error("Please enter a valid phone number!");
  }
  if (!validateEmail(email)) {
    res.status(400).json({ message: "Please enter a valid email address!" });
    throw new Error("Please enter a valid email address!");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc Get Single Contact
//@route GET /api/contacts:id
//@access private
const getSingleContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: "Contact Not Found" });
    throw new Error("Contact Not Found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403).json({
      error: "User doesn't have permission to view other user's contact",
    });
    throw new Error("User don't have permission to view other user contacts");
  }

  res.status(200).json(contact);
});

module.exports = {
  getContact,
  createContact,
  deleteContact,
  updateContact,
  getSingleContact,
};

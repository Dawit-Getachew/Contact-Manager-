const updateContact =
  require("../controllers/contact-controller").updateContact;
const Contact = require("../models/contact-model");

jest.mock("../models/contact-model");

// const updateContact = asyncHandler(async (req, res) => {
//   const contact = await Contact.findById(req.params.id);
//   if (!contact) {
//     res.status(404);
//     throw new Error("Contact does not exist!");
//   }
//   if (contact.user_id.toString() !== req.user.id) {
//     res.status(403);
//     throw new Error("User don't have permission to update other user contacts");
//   }
//   const updatedContact = await Contact.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true }
//   );
//   res.status(200).json(updatedContact);
// });

const mockRequest = {
  user: {
    id: "123456",
  },
  params: {
    id: "123456",
  },
  body: {
    name: "John Doe",
    email: "John@gmail.com",
    phone: "1234567890",
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn((x) => x),
};

test("should update a contact", async () => {
  // mock the Contact.findById() method
  Contact.findById.mockImplementationOnce((x) => {
    return {
      name: "John Doe",
      email: "John@gmail.com",
      phone: "1234567890",
      user_id: x,
    };
  });

  // mock the Contact.findByIdAndUpdate() method
  Contact.findByIdAndUpdate.mockImplementationOnce((x) => {
    return {
      name: "John Doe",
      email: "John@gmail.com",
      phone: "1234567890",
      user_id: x,
    };
  });

  await updateContact(mockRequest, mockResponse);
  expect(mockResponse.status.mock.calls[0][0]).toBe(200);
  expect(mockResponse.json.mock.calls[0][0]).toEqual({
    name: "John Doe",
    email: "John@gmail.com",
    phone: "1234567890",
    user_id: mockRequest.user.id,
  });
});

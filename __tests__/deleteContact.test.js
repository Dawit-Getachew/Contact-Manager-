const { deleteContact } = require("../controllers/contact-controller");
const Contact = require("../models/contact-model");

jest.mock("../models/contact-model");

const mockRequest = {
  user: {
    id: "123456",
  },
  params: {
    id: "123456",
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn((x) => x),
};

// Test case: Contact exists and is deleted successfully
test("should delete a contact successfully", async () => {
  // Mock the Contact.findById method to return the contact
  const mockContact = {
    _id: "123456",
    name: "John Doe",
    email: "jhon@gmailcom",
    phone: "1234567890",
    user_id: mockRequest.user.id,
  };
  Contact.findById.mockResolvedValueOnce(mockContact);

  // Mock the Contact.findByIdAndDelete method to return the deleted contact
  Contact.findByIdAndDelete.mockResolvedValueOnce(mockContact);

  await deleteContact(mockRequest, mockResponse);

  expect(Contact.findById).toHaveBeenCalledWith(mockRequest.params.id);
  expect(Contact.findByIdAndDelete).toHaveBeenCalledWith(mockRequest.params.id);
  expect(mockResponse.status).toHaveBeenCalledWith(200);
  expect(mockResponse.json).toHaveBeenCalledWith(mockContact);
});

// Test case: Contact does not exist
test("should return an error when the contact does not exist", async () => {
  Contact.findById.mockResolvedValueOnce(null);
  try {
    await deleteContact(mockRequest, mockResponse);
  } catch (error) {
    expect(Contact.findById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Contact does not exist",
    });
  }
});

// Test case: User does not have permission to delete other user's contact
test("should return an error when the user does not have permission to delete the contact", async () => {
  const mockContact = {
    _id: "123456",
    name: "John Doe",
    email: "jhon@gmailcom",
    phone: "1234567890",
    user_id: "otherUserId",
  };
  Contact.findById.mockResolvedValueOnce(mockContact);

  try {
    await deleteContact(mockRequest, mockResponse);
  } catch (error) {
    expect(Contact.findById).toHaveBeenCalledWith(mockRequest.params.id);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "User doesn't have permission to delete other user's contact",
    });
  }
});

// Test case: when id is not valid
test("should return an error when the id is not valid", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    params: {},
  };

  try {
    await deleteContact(mockRequest, mockResponse);
    fail("Expected an error to be thrown");
  } catch (error) {
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "Please provide contact id!",
    });
  }
});

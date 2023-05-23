const { getContact } = require("../controllers/contact-controller");
const Contact = require("../models/contact-model.js");

jest.mock("../models/contact-model.js");

const mockRequest = {
  user: {
    id: "123456",
  },
};

mockResponse = {
  json: jest.fn((x) => x),
  status: jest.fn().mockReturnThis(),
};


it("should return contacts for a specific user", async () => {
  const userId = "123456"; // replace with a valid user ID

  // Create a mock Contact.find() method that returns a predefined list of contacts
  Contact.find.mockImplementationOnce(() => [
    { name: "John Doe", email: "john@example.com", user_id: userId },
    { name: "Jane Smith", email: "jane@example.com", user_id: userId },
  ]);

  await getContact(mockRequest, mockResponse);

  // Verify the response
  expect(mockResponse.status.mock.calls[0][0]).toBe(200);
  expect(mockResponse.json.mock.calls[0][0]).toEqual([
    { name: "John Doe", email: "john@example.com", user_id: userId },
    { name: "Jane Smith", email: "jane@example.com", user_id: userId },
  ]);

  // Verify that Contact.find() was called with the correct user ID
  expect(Contact.find).toHaveBeenCalledWith({ user_id: userId });
});

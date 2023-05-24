// const deleteContact = require('../controllers/contact-controller').getContact;
// const Contact = require('../models/contact-model');

// jest.mock('../models/contact-model');


// const mockRequest = {
//     user: {
//         id: "123456",
//     },
//     params: {
//         id: "123456",
//     },
// }

// const mockResponse = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn((x) => x),
// }

// test("should delete a contact", async () => {
//     // mock the Contact.findById() method
//     Contact.findById.mockImplementationOnce((x) => x);

//     // mock the Contact.findByIdAndDelete() method
//     Contact.findByIdAndDelete.mockImplementationOnce((x) => x);

//     await (deleteContact(mockRequest, mockResponse));
//     expect(mockResponse.status.mock.calls[0][0]).toBe(200);
//     // expect(mockResponse.json).toEqual({
//     //     name: "John Doe",
//     //     email: "jhon@gmailcom",
//     //     phone: "1234567890",
//     //     user_id: mockRequest.user.id,
//     // });

// })

const { deleteContact } = require('../controllers/contact-controller');
const Contact = require('../models/contact-model');

jest.mock('../models/contact-model');

const mockRequest = {
  user: {
    id: '123456',
  },
  params: {
    id: '123456',
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn((x) => x),
};

// Test case: Contact exists and is deleted successfully
it('should delete a contact', async () => {
  // Mock the Contact.findById method to return the contact
  const mockContact = {
    _id: '123456',
    name: 'John Doe',
    email: 'jhon@gmailcom',
    phone: '1234567890',
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
it('should return an error when the contact does not exist', async () => {
  const mockError = new Error('Contact does not exist');
  Contact.findById.mockResolvedValueOnce(null);

  try{await deleteContact(mockRequest, mockResponse);}catch(error){

  expect(Contact.findById).toHaveBeenCalledWith(mockRequest.params.id);
  expect(mockResponse.status).toHaveBeenCalledWith(404);
  expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });
  }
});

// Test case: User does not have permission to delete other user's contact
it('should return an error when the user does not have permission to delete the contact', async () => {
  const mockContact = {
    _id: '123456',
    name: 'John Doe',
    email: 'jhon@gmailcom',
    phone: '1234567890',
    user_id: 'otherUserId',
  };
  const mockError = new Error("User doesn't have permission to delete other user's contact");
  Contact.findById.mockResolvedValueOnce(mockContact);

  try{
    await deleteContact(mockRequest, mockResponse);
}catch(error){

  expect(Contact.findById).toHaveBeenCalledWith(mockRequest.params.id);
  expect(mockResponse.status).toHaveBeenCalledWith(403);
  expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });}
});

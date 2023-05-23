const deleteContact = require('../controllers/contact-controller').getContact;
const Contact = require('../models/contact-model');

jest.mock('../models/contact-model');


const mockRequest = {
    user: {
        id: "123456",
    },
    params: {
        id: "123456",
    },
}

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((x) => x),
}

test("should delete a contact", async () => {
    // mock the Contact.findById() method
    Contact.findById.mockImplementationOnce((x) => x);

    // mock the Contact.findByIdAndDelete() method
    Contact.findByIdAndDelete.mockImplementationOnce((x) => x);

    await (deleteContact(mockRequest, mockResponse));
    expect(mockResponse.status.mock.calls[0][0]).toBe(200);
    // expect(mockResponse.json).toEqual({
    //     name: "John Doe",
    //     email: "jhon@gmailcom",
    //     phone: "1234567890",
    //     user_id: mockRequest.user.id,
    // });

})

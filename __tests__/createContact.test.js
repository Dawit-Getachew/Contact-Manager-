const createContact = require('../controllers/contact-controller').createContact;
// const asyncHandler = require('express-async-handler');
const Contact = require('../models/contact-model');

jest.mock('../models/contact-model');
// jest.mock('../middleware/error-handler', () => fn => fn);
// jest.mock('express-async-handler', () => fn => fn); // Mock express-async-handler


const mockRequest = {
    user: {
        id: "123456",
    },
    body: {
        name: "John Doe",
        email: "john@gmail.com",
        phone: "1234567890",
    },
}

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((x) => x),
}

test("should create a new contact", async () => {
    // mock the Contact.create() method
    Contact.create.mockImplementationOnce((x) => x);

    await (createContact(mockRequest, mockResponse));
    expect(mockResponse.status.mock.calls[0][0]).toBe(201);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
        name: "John Doe",
        email: "john@gmail.com",
        phone: "1234567890",
        user_id: mockRequest.user.id,
    });
})

// test("should return 400 if name is missing", async () => {
//     const mockRequest = {
//         user: {
//             id: "123456",
//         },
//         body: {
//             email: "john@gmail.com",
//             phone: "1234567890",
//         },
//     }


//     await errorHandler(async (mockRequest, mockResponse) => createContact(mockRequest, mockResponse));

//     // expect(mockResponse).toThrow();
//     console.log(mockResponse.status.mock.calls)
//     expect(mockResponse.status.mock.calls[0][0]).toBe(400);
//     // expect(mockResponse.json.mock.calls[0][0]).toEqual({
//     //     message: "All fields are required!",
//     // });
// })

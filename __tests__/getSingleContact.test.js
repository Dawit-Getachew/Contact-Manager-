const getSingleContact = require('../controllers/contact-controller').getSingleContact;
const Contact = require('../models/contact-model');

jest.mock('../models/contact-model');

// const getSingleContact = asyncHandler(async (req, res) => {
//     const contact = await Contact.findById(req.params.id);
//     if (!contact){
//         res.status(404)
//         throw new Error("Contact Not Found");
//     }
//     if(contact.user_id.toString() !== req.user.id){
//         res.status(403)
//         throw new Error("User don't have permission to view other user contacts")
//     }

//     res.status(200).json(contact)
// });

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

test("should get a contact", async () => {
    // mock the Contact.findById() method
    Contact.findById.mockImplementationOnce((x) => { return {
        name: "John Doe",
        email: "John@gmail.com",
        phone: "1234567890",
        user_id: x,
    }
});


    // mock toString() method
    // mockRequest.user.id.toString.mockImplementationOnce((x) => x);

    await (getSingleContact(mockRequest, mockResponse));
    expect(mockResponse.status.mock.calls[0][0]).toBe(200);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
        name: "John Doe",
        email: "John@gmail.com",
        phone: "1234567890",
        user_id: mockRequest.user.id,
    });
})


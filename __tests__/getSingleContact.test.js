const getSingleContact =
  require("../controllers/contact-controller").getSingleContact;
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

test("should get a contact", async () => {
  // mock the Contact.findById() method
  Contact.findById.mockImplementationOnce((x) => {
    return {
      name: "John Doe",
      email: "John@gmail.com",
      phone: "1234567890",
      user_id: x,
    };
  });
  // mockRequest.user.id.toString.mockImplementationOnce((x) => x);
  await getSingleContact(mockRequest, mockResponse);
  expect(mockResponse.status.mock.calls[0][0]).toBe(200);
  expect(mockResponse.json.mock.calls[0][0]).toEqual({
    name: "John Doe",
    email: "John@gmail.com",
    phone: "1234567890",
    user_id: mockRequest.user.id,
  });
});

test("should return 404 if contact not found", async () => {
  // mock the Contact.findById() method
  Contact.findById.mockImplementationOnce(() => {
    return null;
  });

  try {
    await getSingleContact(mockRequest, mockResponse);
  } catch (err) {
    expect(mockResponse.status.mock.calls[0][0]).toBe(404);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      error: "Contact Not Found",
    });
  }
});

test("should return permission denied if user id does not match", async () => {
    // mock the Contact.findById() method
    Contact.findById.mockImplementationOnce((x) => {
        return {
        name: "John Doe",
        email: "john@gmail.com",
        phone: "1234567890",
        user_id: "123456",
        };
    });
    const mockRequest = {
        user: {
            id: "not the same id",
        },
        params: {  
            id: "12345678",
        },
    };
    try{
        await getSingleContact(mockRequest, mockResponse);
    }
    catch (err) {
        expect(mockResponse.status.mock.calls[0][0]).toBe(403);
        expect(mockResponse.json.mock.calls[0][0]).toEqual({
            error: "User doesn't have permission to view other user\'s contact",
        });
    }
});


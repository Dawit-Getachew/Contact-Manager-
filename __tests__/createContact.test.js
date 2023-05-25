const createContact =
  require("../controllers/contact-controller").createContact;
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contact-model");

jest.mock("../models/contact-model");

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn((x) => x),
};

test("should create a new contact successfully", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    body: {
      name: "John Doe",
      email: "john@gmail.com",
      phone: "1234567890",
    },
  };
  // mock the Contact.create() method
  Contact.create.mockImplementationOnce((x) => x);

  await createContact(mockRequest, mockResponse);
  expect(mockResponse.status.mock.calls[0][0]).toBe(201);
  expect(mockResponse.json.mock.calls[0][0]).toEqual({
    name: "John Doe",
    email: "john@gmail.com",
    phone: "1234567890",
    user_id: mockRequest.user.id,
  });
});
test("should return 400 if phone is missing", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    body: {
      name: "John Doe",
      email: "john@gmail.com",
      phone: "",
    },
  };

  try {
    await createContact(mockRequest, mockResponse);
  } catch (err) {
    console.log(mockResponse.status.mock.calls);
    expect(mockResponse.status.mock.calls[0][0]).toBe(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "All fields are required!",
    });
  }
});
test("should return 400 if name is missing", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    body: {
      name: "",
      email: "john@gmail.com",
      phone: "1234567890",
    },
  };

  try {
    await createContact(mockRequest, mockResponse);
  } catch (err) {
    console.log(mockResponse.status.mock.calls);
    expect(mockResponse.status.mock.calls[0][0]).toBe(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "All fields are required!",
    });
  }
});
test("should return 400 if email is missing", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    body: {
      name: "John Doe",
      email: "",
      phone: "1234567890",
    },
  };

  try {
    await createContact(mockRequest, mockResponse);
  } catch (err) {
    console.log(mockResponse.status.mock.calls);
    expect(mockResponse.status.mock.calls[0][0]).toBe(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "All fields are required!",
    });
  }
});
test("should return 400 if all name, email, phone are missing", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    body: {
      name: "",
      email: "",
      phone: "",
    },
  };

  try {
    await createContact(mockRequest, mockResponse);
  } catch (err) {
    console.log(mockResponse.status.mock.calls);
    expect(mockResponse.status.mock.calls[0][0]).toBe(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "All fields are required!",
    });
  }
});

test("should return invalid email if email is invalid", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    body: {
      name: "John Doe",
      email: "john",
      phone: "1234567890",
    },
  };
  try {
    await createContact(mockRequest, mockResponse);
  } catch (error) {
    expect(mockResponse.status.mock.calls[0][0]).toBe(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "Please enter a valid email address!",
    });
  }
});

test("should return invalid phone if phone is invalid", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    body: {
      name: "John Doe",
      email: "john@gmail.com",
      phone: "9349834",
    },
  };
  try {
    await createContact(mockRequest, mockResponse);
  } catch (error) {
    expect(mockResponse.status.mock.calls[0][0]).toBe(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "Please enter a valid phone number!",
    });
  }
});

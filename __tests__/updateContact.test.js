const updateContact =
  require("../controllers/contact-controller").updateContact;
const Contact = require("../models/contact-model");

jest.mock("../models/contact-model");

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
    phone: "+2519854323",
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn((x) => x),
};

test("should update a contact successfully", async () => {
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
test("should return an error if the email is invalid", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    params: {
      id: "123456",
    },
    body: {
      name: "John Doe",
      email: "Johngmailcom",
      phone: "+2519854323",
    },
  };
  // mock the Contact.findById() method
  Contact.findById.mockImplementationOnce((x) => {
    return {
      name: "John Doe",
      email: "John@gmail.com",
      phone: "1234567890",
      user_id: x,
    };
  });
  try {
    await updateContact(mockRequest, mockResponse);
  } catch (error) {
    expect(mockResponse.status.mock.calls[0][0]).toBe(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "Please enter a valid email address!",
    });
  }
});
test("should return an error if the phone number is invalid", async () => {
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
      phone: "4342",
    },
  };
  // mock the Contact.findById() method
  Contact.findById.mockImplementationOnce((x) => {
    return {
      name: "John Doe",
      email: "John@gmail.com",
      phone: "1234567890",
      user_id: x,
    };
  });
  try {
    await updateContact(mockRequest, mockResponse);
  } catch (error) {
    expect(mockResponse.status.mock.calls[0][0]).toBe(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "Please enter a valid phone number!",
    });
  }
});
test("should return an error if the name is invalid", async () => {
  const mockRequest = {
    user: {
      id: "123456",
    },
    params: {
      id: "123456",
    },
    body: {
      name: "",
      email: "John@gmail.com",
      phone: "+2519854323",
    },
  };
  // mock the Contact.findById() method
  Contact.findById.mockImplementationOnce((x) => {
    return {
      name: "John Doe",
      email: "John@gmail.com",
      phone: "1234567890",
      user_id: x,
    };
  });
  try {
    await updateContact(mockRequest, mockResponse);
  } catch (error) {
    expect(mockResponse.status.mock.calls[0][0]).toBe(400);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "All fields are required!",
    });
  }
});
test("should return no change made when the contact is not updated", async () => {
  // mock the Contact.findById() method
  Contact.findById.mockImplementationOnce((x) => {
    return {
      name: "John Doe",
      email: "john@gmail.com",
      phone: "1234567890",
      user_id: x,
    };});
    try{
      await updateContact(mockRequest, mockResponse);
    }catch(error){
      expect(mockResponse.status.mock.calls[0][0]).toBe(400);
      expect(mockResponse.json.mock.calls[0][0]).toEqual({
        message: "No changes made!",
      });
    }
});
test("should return an error if the contact is not found", async () => {
  //mock the Contact.findById() method
  Contact.findById.mockImplementationOnce((x) => undefined);

  try{
    await updateContact(mockRequest, mockResponse);
  }catch(error){
    expect(mockResponse.status.mock.calls[0][0]).toBe(404);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      error: "Contact does not exist",
    });
  }
});
test("should return an error if the user is not authorized", async () => {
  // mock the Contact.findById() method
  Contact.findById.mockImplementationOnce((x) => {
    return {
      name: "John Doe",
      email: "John@gmail.com",
      phone: "1234567890",
      user_id: "not same user id",
    };});
    try{
      await updateContact(mockRequest, mockResponse);
    }catch(error){
      expect(mockResponse.status.mock.calls[0][0]).toBe(403);
      expect(mockResponse.json.mock.calls[0][0]).toEqual({
        error:"User doesn't have permission to update other user\'s contact",
      });
    }
});
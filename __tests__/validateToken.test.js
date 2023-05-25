const validateToken = require("../middleware/validate-token-handler");
const jwt = require("jsonwebtoken");

jest.mock("express-async-handler"); // Mock the asyncHandler module
jest.mock("jsonwebtoken"); // Mock the jsonwebtoken module

const mockRequest = {
  headers: {
    authorization: "Bearer YOUR_TOKEN",
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
};

const next = jest.fn();

test("should verify the token and set req.user if it is valid", async () => {
  const mockDecoded = { user: { id: "user123" } };
  jwt.verify.mockImplementation((token, secret, callback) => {
    callback(null, mockDecoded);
  });

  await validateToken(mockRequest, mockResponse, next);

  // Verify that jwt.verify was called with the correct token and secret
  expect(jwt.verify).toHaveBeenCalledWith(
    "YOUR_TOKEN",
    process.env.ACCESS_TOKEN_SECRET,
    expect.any(Function)
  );

  // Verify that req.user was set correctly
  expect(mockRequest.user).toEqual(mockDecoded.user);

  // Verify that next was called
  expect(next).toHaveBeenCalled();
});

// Tests that the function correctly validates a valid token.
test("test_valid_token", async () => {
  const mockRequest = {
    headers: {
      Authorization: "Bearer valid_token",
    },
  };
  const mockResponse = {};
  const next = jest.fn();

  await validateToken(mockRequest, mockResponse, next);

  expect(next).toHaveBeenCalled();
});

// Tests that the function throws an error when token is not included in the request header.
test("test_missing_token", async () => {
  const mockRequest = {
    headers: {},
  };
  const mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
  };
  const next = jest.fn();
  try {
    await validateToken(mockRequest, mockResponse, next);
    
  } catch (error) {
    expect(error.message).toBe(
      "User is not authorized or token is not included in the request"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User is not authorized or token is not included in the request",
    });
    expect(next).not.toHaveBeenCalled();
  }
});

test("should throw an error if the user is not authorized", async ()=> {
  const mockRequest = {
    headers: {
      authorization:
        "Bearer invalid_token",
      },
  };
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();
  
  const mockDecoded = { user: { id: "user123" } };
  jwt.verify.mockImplementation((token, secret, callback) => {
    callback(Error, mockDecoded);
  });
  try {
    await validateToken(mockRequest, mockResponse, next);
  }
  catch (error) {
    expect(error.message).toBe(
      "User is not authorized"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json.mock.calls[0][0]).toEqual({
      message: "User is not authorized",
    });
    expect(next).not.toHaveBeenCalled();
  }
})
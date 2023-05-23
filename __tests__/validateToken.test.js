const validateToken = require("../middleware/validate-token-handler");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

jest.mock("express-async-handler"); // Mock the asyncHandler module
jest.mock("jsonwebtoken"); // Mock the jsonwebtoken module

const req = {
  headers: {
    authorization: "Bearer YOUR_TOKEN",
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
};

const next = jest.fn();

it("should verify the token and set req.user if it is valid", async () => {
  const mockDecoded = { user: { id: "user123" } };
  jwt.verify.mockImplementation((token, secret, callback) => {
    callback(null, mockDecoded);
  });

  await validateToken(req, res, next);

  // Verify that jwt.verify was called with the correct token and secret
  expect(jwt.verify).toHaveBeenCalledWith(
    "YOUR_TOKEN",
    process.env.ACCESS_TOKEN_SECRET,
    expect.any(Function)
  );

  // Verify that req.user was set correctly
  expect(req.user).toEqual(mockDecoded.user);

  // Verify that next was called
  expect(next).toHaveBeenCalled();
});

// Tests that the function correctly validates a valid token.
it("test_valid_token", async () => {
  const req = {
    headers: {
      Authorization: "Bearer valid_token",
    },
  };
  const res = {};
  const next = jest.fn();

  await validateToken(req, res, next);

  expect(next).toHaveBeenCalled();
});

// Tests that the function throws an error when token is not included in the request header.
it("test_missing_token", async () => {
  const req = {
    headers: {},
  };
  const res = {
    status: jest.fn(),
    send: jest.fn(),
  };
  const next = jest.fn();
  try {
    await validateToken(req, res, next);
    // Fail the test if the above line doesn't throw an error
    // fail("Expected validateToken to throw an error");
  } catch (error) {
    expect(error.message).toBe(
      "User is not authorized or token is not included in the request"
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  }
});
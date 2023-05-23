// const {loginUser, registerUser, currentUser} = require("../controllers/user-controller");

const { registerUser } = require('../controllers/user-controller');
const User = require('../models/user-model');

  it('should register a new user successfully', async () => {
    const mockRequest = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    // Mock the User.findOne and User.create functions
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'create').mockResolvedValue(mockUser);

    // Call the registerUser function with the mockRequest and mockResponse
    await registerUser(mockRequest, mockResponse);

    // Assert that the expected functions were called with the expected arguments
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      _id: undefined || mockUser._id ,
      email: mockUser.email,
    });
    expect(User.findOne).toHaveBeenCalledWith({ email: mockRequest.body.email });
    expect(User.create).toHaveBeenCalledWith({
      username: mockRequest.body.username,
      email: mockRequest.body.email,
      password: expect.any(String),
    });
  });

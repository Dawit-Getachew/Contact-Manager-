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

  it('should return an error when required fields are missing', async () => {
    const mockRequest = {
      body: {},
    };
  
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    try {
      await registerUser(mockRequest, mockResponse);
    } catch (error) {
      // Expectations for error handling
    }
  
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'All fields are mandatory!',
    });
  });
  
  
  it('should return an error when user already exists', async () => {
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
  
    // Mock the User.findOne function to simulate an existing user
    jest.spyOn(User, 'findOne').mockResolvedValue(true);
  
    try {
      await registerUser(mockRequest, mockResponse);
    } catch (error) {
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User already registered!',
      });
    }
  });
  
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
      _id: '123',
      username: 'testuser',
      email: 'test@example.com',
    };
  
    // Mock the User.findOne and User.create functions
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'create').mockResolvedValue(mockUser);
  
    await registerUser(mockRequest, mockResponse);
  
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      _id: undefined,
      email: mockUser.email,
    });
    expect(User.findOne).toHaveBeenCalledWith({ email: mockRequest.body.email });
    expect(User.create).toHaveBeenCalledWith({
      username: mockRequest.body.username,
      email: mockRequest.body.email,
      password: expect.any(String),
    });
  });
  
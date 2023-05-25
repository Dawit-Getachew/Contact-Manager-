const { registerUser } = require('../controllers/user-controller');
const User = require('../models/user-model');

  test('should register a new user successfully', async () => {
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
  test('should return when database error occurs', async () => {
    const mockRequest = {
      body: {
        username: 'testuser',
        email: 'daje@e.com',
        password: 'dfd',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(User, 'create').mockResolvedValue(undefined);
    try{
      await registerUser(mockRequest, mockResponse);
    }catch(error){
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error occurred!',
      });
    }
  });
  test('should return an error when required fields are missing', async () => {
    const mockRequest = {
      body: {
        username: '',
        email: '',
        password: '',
      },
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
  test('should return an error when user already exists', async () => {
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
  test('should return an error when email is invalid', async () => {
    const mockRequest = {
    body: {
      username: 'testuser',
      email: 'test@example',
      password: 'password123',
    },
    }
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    try{
      await registerUser(mockRequest, mockResponse);
    }catch(error){
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Please enter a valid email address!",
      });
    }
  });
  test('should return an error when password field is missing', async () => {
    const mockRequest = {
      body: {
        username: 'abebe',
        email: 'abebe@ber.ced',
        password: '',
      },
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
  test('should return an error when username field is missing', async () => {
    const mockRequest = {
      body: {
        username: '',
        email: 'abebe@ber.ced',
        password: 'dfsfd',
      },
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
  test('should return an error when email field is missing', async () => {
    const mockRequest = {
      body: {
        username: 'abebe',
        email: '',
        password: 'dsgsdf',
      },
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

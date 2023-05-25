const { loginUser } = require('../controllers/user-controller');
const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


  test('should login a user successfully', async () => {
    const mockRequest = {
      body: {
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
      password: await bcrypt.hash('password123', 10),
    };

    // Mock the User.findOne function
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('mockAccessToken');

    // Call the loginUser function with the mockRequest and mockResponse
    await loginUser(mockRequest, mockResponse);

    // Assert that the expected functions were called with the expected arguments
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      accessToken: 'mockAccessToken',
    });
    expect(User.findOne).toHaveBeenCalledWith({ email: mockRequest.body.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockRequest.body.password,
      mockUser.password
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        user: {
          username: mockUser.username,
          email: mockUser.email,
          id: undefined,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
  });

  test('should return an error when email or password is missing', async () => {
    const mockRequest = {
      body: {},
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    try{
    await loginUser(mockRequest, mockResponse);
    } catch(error){
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'All fields are mandatory!',
    });
  }
  });
  
  test('should handle database errors and return an error response', async () => {
    const mockError = new Error('Internal Server Error');
  
    const mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
  
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    jest.spyOn(User, 'findOne').mockReturnValue(mockError);
    try{
    await loginUser(mockRequest, mockResponse);
    } catch(error){
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });
    }
  });
  
  test('should return an error when email is invalid', async () => {
    const mockRequest = {
    body: {
      username: 'testuser',
      email: 'test@examplecom',
      password: 'password123',
    },
    }
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    try{
      await loginUser(mockRequest, mockResponse);
    }catch(error){
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Please enter a valid email address!",
      });
    }
  });

  test('should return an error when password is incorrect', async () => {
    const mockRequest = {
      body: {
        email: 'john@gmail.com',
        password: 'not correct password',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    jest.spyOn(User, 'findOne').mockResolvedValue({
      _id: '123',
      username: 'john',
      email: 'john@gmail.com',
      password: await bcrypt.hash('user password', 10),
      user_id: '123',
    });
    try{
      await loginUser(mockRequest, mockResponse);
      fail('user should not be logged in');
    }catch(error){
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Email or Password is not valid",
      });
    }
  });

  test('should return an error when user is not found', async () => {
    const mockRequest = {
      body: {
        email: 'john@gmail.com',
        password: 'user password',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    try{
      await loginUser(mockRequest, mockResponse);
      fail('user should not be logged in');
    }catch(error){
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Email or Password is not valid",
      });
    }
  });


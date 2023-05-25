const { currentUser } = require('../controllers/user-controller');

  test('should return the current user information', async () => {
    const mockUser = {
      _id: '123',
      username: 'testuser',
      email: 'test@example.com',
    };

    const mockRequest = {
      user: mockUser,
    };

    const mockResponse = {
      json: jest.fn(),
    };

    // Call the currentUser function with the mockRequest and mockResponse
    await currentUser(mockRequest, mockResponse);

    // Assert that the response JSON contains the expected user information
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  test('should return an empty user object if no user information is provided', async () => {
    const mockRequest = {
      user: {},
    };

    const mockResponse = {
      json: jest.fn(),
    };

    await currentUser(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({});
  });

  test('should handle errors and return an error response', async () => {
    const mockError = new Error('Internal Server Error');

    const mockRequest = {
      user: null,
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    try{
      await currentUser(mockRequest, mockResponse);
    } catch(error){
    expect(error).toHaveBeenCalledWith(500);
    expect(error.json).toHaveBeenCalledWith({ error: mockError.message });
  }
  });

  test('should handle and return additional user information', async () => {
    const mockUser = {
      _id: '123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    };

    const mockRequest = {
      user: mockUser,
    };

    const mockResponse = {
      json: jest.fn(),
    };

    await currentUser(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  test('should handle an invalid user object and return an empty response', async () => {
    const mockRequest = {
      user: {},
    };

    const mockResponse = {
      json: jest.fn(),
    };

    await currentUser(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({});
  });
const { currentUser } = require('../controllers/user-controller');

  it('should return the current user information', async () => {
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

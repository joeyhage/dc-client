const authUtil = jest.createMockFromModule('auth-util');

const isLoggedIn = () => true;

authUtil.isLoggedIn = isLoggedIn;

module.exports = authUtil;

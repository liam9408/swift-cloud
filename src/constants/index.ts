const SERVICE_IDENTIFIER = {
  SERVER_CONFIG: Symbol('ServerConfig'),
  DEFAULT_SERVICE: Symbol('DefaultService'),
};

const DTO_VALIDATOR = {
  PASSWORD_REGEX:
    /^(?=.*\d)(?=.*[!@#$%^&_.*<>/':"+])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  PASSWORD_VALIDATOR_MESSAGE:
    'Password must be longer than or equal to 8 characters, contain at least one uppercase and lowercase letter, a number and a symbol.',
};

export { SERVICE_IDENTIFIER, DTO_VALIDATOR };

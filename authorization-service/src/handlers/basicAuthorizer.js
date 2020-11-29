const SECURITY_CREDENTIALS = process.env.CREDENTIALS.split("=");

const generatePolicy = (principalId = 'anonymous', effect = 'Deny', resource) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }]
    }
  };
};

const tokenDecoder = (token) => {
  const encodedString = token.split(' ')[1];
  const buff = Buffer.from(encodedString, 'base64');
  const credentials = buff.toString('ascii').split("=");
  if(!credentials || credentials.length !== 2 || !credentials[0] || !credentials[1]) {
    throw new Error('failed to decode token');
  }
  return credentials;
};

const handler = (event, _, callback) => {
  try {
    const token = event.authorizationToken;
    console.log('Token in request', token);


    if (!token) {
      return callback('Unauthorized');
    }

    const [user, password] = tokenDecoder(token);

    console.log('decoded value', user, password);


    if (SECURITY_CREDENTIALS[1] === password && SECURITY_CREDENTIALS[0] === user) {
      console.log('Specified token is valid. Access granted');
      return callback(null, generatePolicy(user, 'Allow', event.methodArn));
    }
    console.log('User with specified credentials does not have access to service');
    return callback(null, generatePolicy(user, 'Deny', event.methodArn));
  } catch (err) {
    console.log('Error was thrown during authorization process', err);
    callback('Unauthorized');
  }
};

export default handler;

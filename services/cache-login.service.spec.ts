import CacheLogin from './cache-login.service';

jest.mock('afip-apis', () => {
    return {
        LoginCmsSoap: jest.fn().mockImplementation(() => { }),
        LoginTicket: jest.fn().mockImplementation(() => {
            return {
                wsaaLogin: jest.fn().mockResolvedValue({ test: 'login test' })
            }
        })
    }
});

jest.mock('fs', () => {
    return {
        writeFileSync: jest.fn().mockReturnValue(() => { }),
        readFileSync: jest.fn().mockReturnValue(JSON.stringify({
            header: {
                expirationTime: new Date()
            }
        })),
        existsSync: jest.fn().mockReturnValue(true),
        mkdirSync: jest.fn()
    }
});

jest.mock('./logger.service', () => {
    return {
      logger: {
        log: jest.fn()
      }
    }
  });

describe('cache login service', () => {

    let cacheLogin = new CacheLogin();

    it('should validate getTicket method', async () => {
        const result = await cacheLogin.getTicket();
        expect(result).toEqual({ test: 'login test' });
    });

});
import {isProdEnvironment, getVerificationCode} from './common.service'

describe('Common service', () => {

    it('should validate isProdEnvironment - true', () => {
        process.argv = ['--prod'];
        expect(isProdEnvironment()).toBeTruthy();
    });

    it('should validate isProdEnvironment - false', () => {
        process.argv = [];
        expect(isProdEnvironment()).toBeFalsy();
    });

    it('should validate getVerificationCode method', () => {
        expect(getVerificationCode('20321075666011000026935627406699920190908')).toEqual(2);
    });
});
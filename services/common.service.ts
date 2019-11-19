export const isProdEnvironment = () => process.argv.includes('--prod');
export const currencyFormat = (num) => {
    return Number(num).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export const getVerificationCode = (val) => {
    let evenNum = [];
    let oddNum = [];
    for (const iterator of val) {
        if (iterator % 2 === 0) {
            evenNum.push(parseInt(iterator));
        } else {
            oddNum.push(parseInt(iterator));
        }
    }
    const step1 = oddNum.reduce((a, b) => a + b, 0);
    const step2 = step1 * 3;
    const step3 = evenNum.reduce((a, b) => a + b, 0);
    const step4 = step2 + step3;
    let step5 = 10 - (step4 % 10);
    return step5 === 10 ? 0 : step5;
}
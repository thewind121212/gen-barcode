export const calculateCheckDigit = (code12: string): number => {
    if (code12.length !== 12) return 0;
    let sumOdd = 0, sumEven = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(code12[i]);
        ((i + 1) % 2 === 1) ? sumOdd += digit : sumEven += digit;
    }
    const total = sumOdd + (sumEven * 3);
    return total % 10 === 0 ? 0 : 10 - (total % 10);
};

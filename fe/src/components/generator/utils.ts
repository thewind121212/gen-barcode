/**
 * Calculate EAN-13 check digit using modulo 10 algorithm
 * @param code12 - The first 12 digits of the barcode
 * @returns The check digit (0-9)
 */
export const calculateCheckDigit = (code12: string): number => {
    if (code12.length !== 12) return 0;

    let sumOdd = 0;
    let sumEven = 0;

    for (let i = 0; i < 12; i++) {
        const digit = parseInt(code12[i]);
        if ((i + 1) % 2 === 1) {
            sumOdd += digit;
        } else {
            sumEven += digit;
        }
    }

    const total = sumOdd + (sumEven * 3);
    const remainder = total % 10;
    return remainder === 0 ? 0 : 10 - remainder;
};

/**
 * Generate a random 5-digit product detail code
 * @returns A random 5-digit string
 */
export const generateRandomDetail = (): string => {
    return Math.floor(Math.random() * 99999).toString().padStart(5, '0');
};

/**
 * Copy text to clipboard
 * @param text - The text to copy
 */
export const copyToClipboard = (text: string): void => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert(`Đã copy mã: ${text}`);
};

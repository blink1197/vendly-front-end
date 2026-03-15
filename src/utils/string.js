export function formatMoney(amount, currency = 'PHP', locale = 'en-PH') {
    if (amount === null || amount === undefined || isNaN(amount)) return '₱0.00';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

export function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
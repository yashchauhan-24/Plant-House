export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const STRONG_PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

export const INDIAN_PHONE_REGEX = /^\d{10}$/;

export const PINCODE_REGEX = /^\d{6}$/;

export const isValidEmail = (value = "") => EMAIL_REGEX.test(value.trim());

export const isStrongPassword = (value = "") => STRONG_PASSWORD_REGEX.test(value);

export const isValidIndianPhone = (value = "") => INDIAN_PHONE_REGEX.test(value.trim());

export const isValidPincode = (value = "") => PINCODE_REGEX.test(value.trim());

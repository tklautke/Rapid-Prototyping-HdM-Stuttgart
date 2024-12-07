export function shared(): string {
    return 'shared';
}

/**
 * Checks if the given email address is valid.
 * A valid email must match the following pattern:
 * - Starts with a combination of letters, numbers, periods, or hyphens.
 * - Followed by an @ symbol.
 * - After the @ symbol, a domain part must follow consisting of letters, numbers, periods, or hyphens.
 * - Ends with a top-level domain (TLD) consisting of at least two letters.
 *
 * @param email - The email address to validate.
 * @returns true if the email address is valid, otherwise false.
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Checks if the given password is valid.
 * A valid password must meet the following criteria:
 * - Contains at least one uppercase letter.
 * - Contains at least one lowercase letter.
 * - Contains at least one number.
 * - Has a minimum length of 4 characters.
 *
 * @param password - The password to validate.
 * @returns true if the password meets the criteria, otherwise false.
 */
export function isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{4,}$/;
    return passwordRegex.test(password);
}

/**
 * Checks if the given input is not empty.
 * A valid string is considered one that is not just whitespace and contains at least one non-whitespace character.
 *
 * @param input - The string to validate.
 * @returns true if the string is valid, otherwise false.
 */
export function isNotEmpty(input: string): boolean {
    const nameRegex = /^\s*\S+/;
    return nameRegex.test(input);
}

/**
 * Checks if the provided status is one of the accepted status strings: "OPEN", "IN_PROGRESS", or "COMPLETED".
 *
 * @param status - The status string to validate.
 * @returns true if the status is valid, otherwise false.
 */
export function isValidStatus(status: string): boolean {
    const validStatuses = ["OPEN", "IN_PROGRESS", "COMPLETED"];
    return validStatuses.includes(status);
}

/**
 * Checks if the given vehicle registration number (license plate) is valid.
 * A valid German license plate format typically follows this pattern:
 * - Begins with 1-3 uppercase letters for the city/region code (e.g., "M" for Munich).
 * - Followed by a hyphen ("-").
 * - After the hyphen, 1-2 uppercase letters as the district code.
 * - Ends with 1-4 numbers as the unique identifier.
 *
 * Examples of valid license plates: "M-XY 5678", "B-A 123", "HH-AB 1234".
 *
 * @param vehicleRegNo - The vehicle registration number to validate.
 * @returns true if the license plate format is valid, otherwise false.
 */
export function isValidVehicleRegNo(vehicleRegNo: string): boolean {
    const regNoRegex = /^[A-Z]{1,3}-[A-Z]{1,2} \d{1,4}$/;
    return regNoRegex.test(vehicleRegNo);
}

export function isInOpeningTime(openingTime: string, closingTime: string, bookedTime: string): boolean {
    const [openHours, openMinutes] = openingTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closingTime.split(':').map(Number);
    const [bookedHours, bookedMinutes] = bookedTime.split(':').map(Number);

    const openDate = new Date(0, 0, 0, openHours, openMinutes);
    const closeDate = new Date(0, 0, 0, closeHours, closeMinutes);
    const bookedDate = new Date(0, 0, 0, bookedHours, bookedMinutes);

    return bookedDate >= openDate && bookedDate <= closeDate;
}


/**
 * Checks if the given postcode is a valid German postcode.
 * A valid German postcode consists of exactly 5 digits.
 *
 * @param postcode - The postcode to validate.
 * @returns true if the postcode is valid, otherwise false.
 */
export function isValidGermanPostcode(postcode: number): boolean {
    const postcodeStr = postcode.toString();
    const postcodeRegex = /^[0-9]{5}$/;
    return postcodeRegex.test(postcodeStr);
}


/**
 * Checks if the opening time is before the closing time.
 * Both times should be in the format "HH:mm".
 *
 * @param openingtime - The opening time in "HH:mm" format.
 * @param closingtime - The closing time in "HH:mm" format.
 * @returns true if the opening time is before the closing time, otherwise false.
 */
export function isOpeningtimeBeforeClosingtime(openingtime: string, closingtime: string): boolean {
    const [openHours, openMinutes] = openingtime.split(':').map(Number);
    const [closeHours, closeMinutes] = closingtime.split(':').map(Number);

    const openDate = new Date(0, 0, 0, openHours, openMinutes);
    const closeDate = new Date(0, 0, 0, closeHours, closeMinutes);

    return openDate < closeDate;
}

/**
 * Checks if the given number is not empty or invalid.
 * A valid number is considered one that is not NaN and is greater than 0.
 *
 * @param num - The number to check.
 * @returns true if the number is valid and not empty, otherwise false.
 */
export function isNotEmptyNumber(num: number): boolean {
    return !isNaN(num) && num !== 0;
}


const {validateEmail, validatePhone} = require("../utils/email-phone-validator");

test("should return true if the email is valid", () => {
    const email = "john@gmil.com";
    const email2 = "j@j.com";
    const email3 = "john123@233ssa.com";
    const email4 = "john@gmail.io";
    expect(validateEmail(email)).toBe(true);
    expect(validateEmail(email2)).toBe(true);
    expect(validateEmail(email3)).toBe(true);
    expect(validateEmail(email4)).toBe(true);
});
test("should return false if the email is invalid", () => {
    const email = "john";
    const email2 = "john@gmail";
    const email3 = "john@gmail.";
    const email4 = "johngmail.com";
    const email5 = "john@gmailcom";
    const email6 = "john@gmail,com";
    expect(validateEmail(email)).toBe(false);
    expect(validateEmail(email2)).toBe(false);
    expect(validateEmail(email3)).toBe(false);
    expect(validateEmail(email4)).toBe(false);
    expect(validateEmail(email5)).toBe(false);
    expect(validateEmail(email6)).toBe(false);

});
test("should return true if the phone is valid", () => {
    const phone1 = "1234567890";
    const phone2 = "+1234567890";
    const phone3 = "+123 456 7890";
    const phone4 = "+25197465334";
    const phone5 = "0974567890";
    expect(validatePhone(phone1)).toBe(true);
    expect(validatePhone(phone2)).toBe(true);
    expect(validatePhone(phone3)).toBe(true);
    expect(validatePhone(phone4)).toBe(true);
    expect(validatePhone(phone5)).toBe(true);
});
test('should return false if the phone is invalid', () => {
    const phone1 = "12345689";
    const phone2 = "+1234567890-";
    const phone3 = "+123 456 7890-";
    const phone4 = "+123-456-7890-";
    expect(validatePhone(phone1)).toBe(false);
    expect(validatePhone(phone2)).toBe(false);
    expect(validatePhone(phone3)).toBe(false);
    expect(validatePhone(phone4)).toBe(false);
});
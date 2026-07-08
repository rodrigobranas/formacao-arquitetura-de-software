export function validateEmail (email: string) {
    if (!email) return false;
    return !!email.match(/.+@.+\..+/);
}
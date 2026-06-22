export function validateName (name: string) {
    if (!name) return false;
    return !!name.match(/[a-zA-Z]+ [a-zA-Z]+/);
}
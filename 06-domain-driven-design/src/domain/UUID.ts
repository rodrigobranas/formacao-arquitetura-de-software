import crypto from "crypto";

export default class UUID {
    private value: string;

    constructor (uuid: string) {
        if (!uuid || !uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) throw new Error("Invalid UUID");
        this.value = uuid;
    }

    static create () {
        const uuid = crypto.randomUUID();
        return new UUID(uuid);
    }

    getValue () {
        return this.value;
    }
}

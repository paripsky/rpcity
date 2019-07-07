let id = 0;

export function generateId(): string {
    return (id++).toString();
}

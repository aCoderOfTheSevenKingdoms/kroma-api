export function requireEnvVars<const T extends string>(
    names: readonly T[]
): Record<T, string> {
    return names.reduce((values, name) => {
        const value = process.env[name];

        if (!value) {
            throw new Error(`${name} is not defined in environment variables`);
        }

        values[name] = value;
        return values;
    }, {} as Record<T, string>);
}

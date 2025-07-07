export const joinRoute = (parts: (string | undefined | null)[]): string => {
    return '/' + parts
        .filter(Boolean)
        .map(p => p!.replace(/^\/|\/$/g, ''))
        .join('/');
};
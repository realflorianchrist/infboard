export const formatDate = (date?: Date | null) => {
    if (date) {
        return new Date(date).toLocaleDateString('de-CH', {year: 'numeric', month: '2-digit', day: '2-digit'});
    }
}

export const formatFileSize = (bytes?: number | null) => {
    if (bytes) {
        if (bytes === 0) return '0 Bytes';
        const units = ['Bytes', 'kB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const size = bytes / Math.pow(1024, i);
        return `${size.toFixed(1)} ${units[i]}`;
    }
};
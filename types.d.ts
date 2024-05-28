export interface CustomError extends Error {
    status?: number;
    isJoi?: boolean;
}

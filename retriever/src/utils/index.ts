interface IResponse {
    statusCode: number;
    body: string;
}

export const errorResponse = (message: any, statusCode: number = 400): IResponse => {
    return {
        statusCode,
        body: JSON.stringify({ message })
    }
}
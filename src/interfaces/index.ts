
interface IDocument {
    [key: string]: any;
}

interface ICustomDocument {
    id: string,
    createdAt: number,
    alreadyUsed: boolean,
}

export type { IDocument, ICustomDocument }
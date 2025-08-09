export class CommonResponse {
    public data: any;
    public total: number;
}

export class TypedCommonResponse<T> {
    public data: T[];
    public total: number;
}

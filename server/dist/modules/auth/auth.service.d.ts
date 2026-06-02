export declare function register(email: string, password: string, name: string): Promise<{
    user: {
        _id: any;
        email: any;
        name: any;
        theme: any;
        createdAt: any;
        updatedAt: any;
    };
    token: string;
}>;
export declare function login(email: string, password: string): Promise<{
    user: {
        _id: any;
        email: any;
        name: any;
        theme: any;
        createdAt: any;
        updatedAt: any;
    };
    token: string;
}>;
export declare function updateTheme(userId: string, theme: 'light' | 'dark'): Promise<{
    _id: any;
    email: any;
    name: any;
    theme: any;
    createdAt: any;
    updatedAt: any;
}>;
//# sourceMappingURL=auth.service.d.ts.map
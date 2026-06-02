export declare function listAll(): Promise<{
    ownerName: any;
    _id: any;
    name: any;
    description: any;
    owner: any;
    createdAt: any;
    updatedAt: any;
}[]>;
export declare function getByIdPublic(projectId: string): Promise<{
    ownerName: any;
    _id: any;
    name: any;
    description: any;
    owner: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function list(userId: string): Promise<{
    _id: any;
    name: any;
    description: any;
    owner: any;
    createdAt: any;
    updatedAt: any;
}[]>;
export declare function getById(projectId: string, userId: string): Promise<{
    _id: any;
    name: any;
    description: any;
    owner: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function create(name: string, description: string, userId: string): Promise<{
    _id: any;
    name: any;
    description: any;
    owner: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function update(projectId: string, userId: string, data: {
    name?: string;
    description?: string;
}): Promise<{
    _id: any;
    name: any;
    description: any;
    owner: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function remove(projectId: string, userId: string): Promise<void>;
//# sourceMappingURL=project.service.d.ts.map
export declare function listByTask(taskId: string): Promise<{
    _id: any;
    content: any;
    task: any;
    author: {
        _id: any;
        name: any;
    };
    createdAt: any;
}[]>;
export declare function create(content: string, taskId: string, userId: string): Promise<{
    _id: any;
    content: any;
    task: any;
    author: {
        _id: any;
        name: any;
    };
    createdAt: any;
}>;
export declare function remove(commentId: string, userId: string): Promise<void>;
//# sourceMappingURL=comment.service.d.ts.map
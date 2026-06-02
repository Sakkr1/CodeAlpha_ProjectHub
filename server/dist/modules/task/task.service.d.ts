import type { TaskStatus } from './task.model.js';
export declare function listByProject(projectId: string): Promise<{
    _id: any;
    title: any;
    description: any;
    status: any;
    project: any;
    createdBy: any;
    createdAt: any;
    updatedAt: any;
}[]>;
export declare function create(title: string, description: string, projectId: string, userId: string): Promise<{
    _id: any;
    title: any;
    description: any;
    status: any;
    project: any;
    createdBy: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function update(taskId: string, data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
}): Promise<{
    _id: any;
    title: any;
    description: any;
    status: any;
    project: any;
    createdBy: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function remove(taskId: string): Promise<void>;
//# sourceMappingURL=task.service.d.ts.map
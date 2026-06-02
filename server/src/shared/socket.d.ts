declare module 'socket.io' {
  import { Server as HttpServer } from 'http';
  import { EventEmitter } from 'events';

  interface ServerOptions {
    cors?: { origin?: string | string[] | boolean; methods?: string[]; allowedHeaders?: string[]; credentials?: boolean };
  }

  interface Socket {
    id: string;
    rooms: Set<string>;
    handshake: { auth: Record<string, any> };
    join(room: string): void;
    leave(room: string): void;
    emit(event: string, ...args: any[]): void;
    on(event: string, callback: (...args: any[]) => void): void;
    disconnect(): void;
  }

  class Server extends EventEmitter {
    constructor(httpServer?: HttpServer, options?: ServerOptions);
    on(event: 'connection', callback: (socket: Socket) => void): this;
    use(fn: (socket: Socket, next: (err?: Error) => void) => void): void;
    to(room: string): { emit: (event: string, ...args: any[]) => void };
  }

  export { Server, Socket, ServerOptions };
}

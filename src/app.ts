import config from "@/common/config";
import BaseExceptionHandler from "@/common/exception/handler/BaseExceptionHandler";
import router from "@/routes/routes";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { connect } from "./databases";
import http from "http"; // Import the 'http' module
import { Server as SocketIOServer } from "socket.io"; // Import Socket.IO

export class App {
  public app: Application;
  public server: http.Server;
  public io: SocketIOServer; // Add a property for Socket.IO server

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app); // Create an HTTP server

    // Initialize Socket.IO with CORS options
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.CLIENT_URI, // Replace with your client URL
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });

    this.middlewares();
    this.routes();
    this.errorHandler();
    this.socketIO(); // Initialize Socket.IO events
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes() {
    this.app.use(config.contextPath, router);
  }

  private errorHandler() {
    this.app.use(
      (error: Error, _req: Request, res: Response, _next: NextFunction) => {
        BaseExceptionHandler.handleError(error, res);
      }
    );
  }

  public socketIO() {
    this.io.on("connection", (socket) => {
      console.log("Client connected via WebSocket");

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  public async listen() {
    try {
      await connect();
      const HOST = config.hostServer;
      const PORT = config.portServer;
      this.server.listen(PORT, () => {
        console.log(
          `Server running at http://${HOST}:${PORT}${config.contextPath}`
        );
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new App();

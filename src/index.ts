import dotenv from "dotenv";
import "reflect-metadata";
import WebSocket from "ws";
import App from "@/app";
dotenv.config();
void App.listen();

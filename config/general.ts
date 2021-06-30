import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";
import * as swaggerUi from "swagger-ui-express";
import { docs } from "../docs/index";

export default function config(app: Application): void {
    app.set("port", process.env.PORT || 4000);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(morgan("dev"));
    app.use(cors());
    app.use("/api-docs", swaggerUi.serve ,swaggerUi.setup(docs))
}
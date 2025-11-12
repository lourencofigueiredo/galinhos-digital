import "dotenv/config"; import express from "express"; import cors from "cors"; import helmet from "helmet";
import { authRouter } from "./routes/auth.js"; import { ticketRouter } from "./routes/tickets.js";
import { healthRouter } from "./routes/health.js"; import { transportRouter } from "./routes/transport.js"; import { webhookRouter } from "./routes/webhooks.js";
const app = express(); app.use(helmet()); app.use(cors({origin:true,credentials:true})); app.use(express.json({limit:"5mb"}));
app.get("/healthcheck", (_req,res)=>res.json({ok:true}));
app.use("/auth", authRouter); app.use("/tickets", ticketRouter); app.use("/health", healthRouter); app.use("/transport", transportRouter); app.use("/webhooks", webhookRouter);
const port = process.env.PORT || 4000; app.listen(port, ()=>console.log(`Server listening on :${port}`));

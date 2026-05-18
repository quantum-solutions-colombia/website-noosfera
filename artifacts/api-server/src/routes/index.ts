import { Router, type IRouter } from "express";
import healthRouter from "./health";
import noosferaRouter from "./noosfera";
import demoRouter from "./demo";

const router: IRouter = Router();

router.use(healthRouter);
router.use(noosferaRouter);
router.use(demoRouter);

export default router;

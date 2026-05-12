import { Router, type IRouter } from "express";
import healthRouter from "./health";
import noosferaRouter from "./noosfera";

const router: IRouter = Router();

router.use(healthRouter);
router.use(noosferaRouter);

export default router;

import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const tenantFromPath = req.path.split("/")[1] || "default";
    req.headers["x-tenant-id"] = String(req.headers["x-tenant-id"] ?? tenantFromPath);
    next();
  }
}

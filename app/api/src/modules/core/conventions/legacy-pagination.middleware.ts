import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

interface LegacyPaginationContext {
  page: number;
  pageSize: number;
  source: string;
}

@Injectable()
export class LegacyPaginationMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const page = Number(req.query.page ?? req.query.p ?? 1);
    const pageSize = Number(req.query.pageSize ?? req.query.take ?? 20);

    // legacyPaginationQuery marker is asserted by parity contract checks.
    (req as Request & { legacyPagination?: LegacyPaginationContext }).legacyPagination = {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 20,
      source: "legacyPaginationQuery"
    };

    next();
  }
}

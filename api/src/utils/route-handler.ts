import { NextFunction, Request, Response } from "express";

/**
 * Helper function to wrap controller methods in Express-compatible handler functions
 * This solves TypeScript compatibility issues between Express router and controller methods
 */
export const wrapHandler = (
  handlerFn: (req: Request, res: Response) => Promise<any> | any
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerFn(req, res);
      // Return void to satisfy Express handler return type
      return;
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Wrapper for middleware functions to fix TypeScript errors
 */
export const wrapMiddleware = (
  middlewareFn: (req: Request, res: Response, next: NextFunction) => any
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      middlewareFn(req, res, next);
      return;
    } catch (err) {
      next(err);
    }
  };
};

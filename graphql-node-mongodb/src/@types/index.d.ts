import * as express from "express";

declare global {
  interface Error {
    statusCode?: number;
    error?: any;
  }
}

import { Router } from 'express';

export interface APIRouter {
    router: Router;
    setRouter: () => void;
    getRouter: () => Router
}

export abstract class BaseRouter implements APIRouter {
    router: Router;
    constructor () {
        this.router = Router();
        this.setRouter();
    }
    abstract setRouter(): void;

    public getRouter = () => {
        return this.router;
    }
}

import { Router } from 'express';

export interface APIRouter {
    router: Router;
    getRouter: () => Router;
}

export class BaseRouter implements APIRouter {
    router: Router;
    constructor(router: Router) {
        this.router = router;
    }
    
    getRouter () {
        return this.router;
    }
}
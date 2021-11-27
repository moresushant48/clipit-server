import { RequestContext } from "./request-context";
import { getNamespace, createNamespace } from 'node-request-context';

export function RequestContextMiddleware(req, res, next) {
    let rc = new RequestContext(req, res);

    const namespace = getNamespace('myapp.mynamespace') || createNamespace('myapp.mynamespace');

    namespace.run(() => {
        namespace.set('tid', rc);
        next();
    });
};
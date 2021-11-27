import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly common: CommonService,
    ) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = this.getPayload(context);
        // sandesh check user type & its roles
        if (user) {
            request.user = user;
            // if (!isPublic) {
            //   if (request.body && request.body.deviceId) {
            //     this.usersService.getUser(request.body.userId, request.body.deviceId).then((userData) => {
            //       if (!userData) {
            //         return new UnauthorizedException('You have been forced logout');
            //         // return Promise.reject(new UnauthorizedException('You have been forced logout'));
            //       }
            //     }).catch(error => {
            //        return new Error(error);
            //     });
            //   }
            // }
        }
        return true;
    }

    getPayload(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (typeof request.headers.authorization !== 'undefined') {
            const authorization = request.headers.authorization.split(' ')[1];
            try {
                return this.common.jwtVerify(authorization);
            } catch (e) {
                throw new UnauthorizedException('Unauthorized Get Payload');
            }
        } else {
            throw new UnauthorizedException('Unauthorized authorization header');
        }
    }

}

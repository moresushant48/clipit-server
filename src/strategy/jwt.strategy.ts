import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GLOBAL } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly reflector: Reflector,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: GLOBAL.JWT.secret,
        });
    }

    async validate(payload: any): Promise<any> {
        if (payload && payload.userType) {
            switch (payload.userType) {
                case 'Admin':
                    // sandesh need to check if current admin is still active
                    return { id: payload.id, email: payload.email, fullName: payload.full_name, role: payload.role };

                case 'User':
                    // sandesh need to check if current user is still active
                    return { id: payload.id, email: payload.email, planExipiryDate: payload.planExipiryDate };
            }
        }
        throw new UnauthorizedException('Unauthorized JWT Strategy');

    }
}

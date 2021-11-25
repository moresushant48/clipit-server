import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { GLOBAL } from 'src/constants';

@Injectable()
export class CommonService {
    constructor(private readonly jwtService: JwtService) { }

    async getHash(password: string | undefined): Promise<string> {
        return bcrypt.hash(password, GLOBAL.bcrypt.saltRounds);
    }

    async compareHash(password: string | undefined, hash: string | undefined): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    jwtSignup(payload: any) {
        return this.jwtService.sign(payload);
    }

    jwtVerify(token: string) {
        return this.jwtService.verify(token);
    }
}

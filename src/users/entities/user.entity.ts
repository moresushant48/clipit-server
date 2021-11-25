import { genSaltSync, hashSync } from "bcrypt";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true, nullable: false })
    enabled: boolean;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ nullable: true, unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    createdBy: number;

    @CreateDateColumn()
    createdTimestamp: string;

    @Column({ nullable: true })
    updatedBy: number;

    @UpdateDateColumn()
    updatedTimestamp: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hashSync(this.password, genSaltSync(10));
    }
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true, nullable: false })
    enabled: boolean;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ nullable: false, unique: true })
    sessionId: string;

    @Column({ nullable: true, unique: true })
    userID: string;

    @Column({ nullable: true })
    createdBy: number;

    @CreateDateColumn()
    createdTimestamp: string;

    @Column({ nullable: true })
    updatedBy: number;

    @UpdateDateColumn()
    updatedTimestamp: string;
}

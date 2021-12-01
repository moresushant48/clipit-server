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

    @Column({ nullable: false, default: '' })
    content: string;

    @Column({ nullable: true })
    userID: number;

    @Column({ nullable: true })
    createdBy: number;

    @CreateDateColumn()
    createdTimestamp: string;

    @Column({ nullable: true })
    updatedBy: number;

    @UpdateDateColumn()
    updatedTimestamp: string;
}

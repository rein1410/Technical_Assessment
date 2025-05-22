import { Column, CreateDateColumn, DeepPartial, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

abstract class BaseEntity {
    protected constructor(input?: DeepPartial<BaseEntity>) {
        if (input) {
            Object.assign(this, input);
        }
    }
    @PrimaryGeneratedColumn('identity', { generatedIdentity: 'BY DEFAULT' })
    id: number;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity()
export class Csv extends BaseEntity {
    constructor(input?: DeepPartial<Csv>) {
        super(input);
    }
    @Column()
    postId: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column("text")
    body: string;
}

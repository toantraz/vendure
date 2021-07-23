import { JobState } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity } from 'typeorm';

import { VendureEntity } from '../../entity/base/base.entity';
import { TIMESTAMP } from '../../entity/column-types';

@Entity()
export class JobRecord extends VendureEntity {
    constructor(input: DeepPartial<JobRecord>) {
        super(input);
    }

    @Column()
    queueName: string;

    @Column('simple-json', { nullable: true })
    data: any;

    @Column('varchar')
    state: JobState;

    @Column()
    progress: number;

    @Column('simple-json', { nullable: true })
    result: any;

    @Column({ nullable: true })
    error: string;

    @Column({ type: TIMESTAMP, nullable: true, precision: 6 })
    startedAt?: Date;

    @Column({ type: TIMESTAMP, nullable: true, precision: 6 })
    settledAt?: Date;

    @Column()
    isSettled: boolean;

    @Column()
    retries: number;

    @Column()
    attempts: number;
}

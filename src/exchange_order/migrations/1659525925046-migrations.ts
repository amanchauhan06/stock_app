import { MigrationInterface, QueryRunner } from "typeorm"

export class migrations1659525925046 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("SELECT create_hypertable('order', 'updated_at');");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

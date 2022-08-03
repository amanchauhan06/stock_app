import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1658929819838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_detail_entity" ALTER COLUMN open TYPE float`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_detail_entity" ALTER COLUMN open TYPE integer`);
    }

}

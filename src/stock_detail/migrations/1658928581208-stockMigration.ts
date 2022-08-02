import { MigrationInterface, QueryRunner } from "typeorm";

export class stockMigration1658928581208 implements MigrationInterface {
    name = 'stockMigration1658928581208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_detail_entity" ALTER COLUMN "open" TYPE "float"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stock_detail_entity"`);
    }

}

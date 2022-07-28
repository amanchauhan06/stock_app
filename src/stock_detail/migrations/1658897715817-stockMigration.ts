import { MigrationInterface, QueryRunner } from "typeorm";

export class stockMigration1658897715817 implements MigrationInterface {
    name = 'stockMigration1658897715817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock_detail_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timestamp" TIMESTAMP NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "volume" integer NOT NULL, "companyId" uuid, CONSTRAINT "PK_aaf20c18ab7e402059a7fe9b08f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tradingsymbol" character varying NOT NULL, "name" character varying NOT NULL, "instrument_type" character varying NOT NULL, "segment" character varying NOT NULL, "exchange" character varying NOT NULL, "data_type" character varying NOT NULL, "key" character varying NOT NULL, "from" character varying NOT NULL, "to" character varying NOT NULL, CONSTRAINT "PK_ea73e3c936cd569cf091620b7fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_detail_entity" ADD CONSTRAINT "FK_7eb1044c7445d2203ec0cb9345c" FOREIGN KEY ("companyId") REFERENCES "master_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_detail_entity" DROP CONSTRAINT "FK_7eb1044c7445d2203ec0cb9345c"`);
        await queryRunner.query(`DROP TABLE "master_entity"`);
        await queryRunner.query(`DROP TABLE "stock_detail_entity"`);
    }

}

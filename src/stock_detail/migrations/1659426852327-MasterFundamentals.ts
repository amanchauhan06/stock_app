import { MigrationInterface, QueryRunner } from "typeorm";

export class MasterFundamentals1659426852327 implements MigrationInterface {
    name = 'MasterFundamentals1659426852327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "mobile" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master_fundamentals_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "marketCap" integer NOT NULL, "roe" integer NOT NULL, "peRatio" integer NOT NULL, "pbRatio" integer NOT NULL, "eps" integer NOT NULL, "debtToEquity" integer NOT NULL, "industryPE" integer NOT NULL, "bookValue" integer NOT NULL, "faceValue" integer NOT NULL, "dividendYield" integer NOT NULL, CONSTRAINT "PK_8e285b0556b9450d0804756d0f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock_detail_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timestamp" TIMESTAMP NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "volume" integer NOT NULL, "companyId" uuid, CONSTRAINT "PK_aaf20c18ab7e402059a7fe9b08f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tradingsymbol" character varying NOT NULL, "name" character varying NOT NULL, "instrument_type" character varying NOT NULL, "segment" character varying NOT NULL, "exchange" character varying NOT NULL, "data_type" character varying NOT NULL, "key" character varying NOT NULL, "from" character varying NOT NULL, "to" character varying NOT NULL, "financeId" uuid, CONSTRAINT "REL_d5a40e60729e9c9ff0cd9077df" UNIQUE ("financeId"), CONSTRAINT "PK_ea73e3c936cd569cf091620b7fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity_companies_master" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_4bff1b1ce5366b493e01d6b935b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity_companies_master_entity" ("userEntityId" uuid NOT NULL, "masterEntityId" uuid NOT NULL, CONSTRAINT "PK_013ce50a4f5c3f42bce5aec0c1f" PRIMARY KEY ("userEntityId", "masterEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_74b53325d6218967e9e6005feb" ON "user_entity_companies_master_entity" ("userEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cb949ea9f4e1b53bd5e4d31d05" ON "user_entity_companies_master_entity" ("masterEntityId") `);
        await queryRunner.query(`ALTER TABLE "stock_detail_entity" ADD CONSTRAINT "FK_7eb1044c7445d2203ec0cb9345c" FOREIGN KEY ("companyId") REFERENCES "master_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "master_entity" ADD CONSTRAINT "FK_d5a40e60729e9c9ff0cd9077df3" FOREIGN KEY ("financeId") REFERENCES "master_fundamentals_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity_companies_master_entity" ADD CONSTRAINT "FK_74b53325d6218967e9e6005feb1" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_entity_companies_master_entity" ADD CONSTRAINT "FK_cb949ea9f4e1b53bd5e4d31d05e" FOREIGN KEY ("masterEntityId") REFERENCES "master_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity_companies_master_entity" DROP CONSTRAINT "FK_cb949ea9f4e1b53bd5e4d31d05e"`);
        await queryRunner.query(`ALTER TABLE "user_entity_companies_master_entity" DROP CONSTRAINT "FK_74b53325d6218967e9e6005feb1"`);
        await queryRunner.query(`ALTER TABLE "master_entity" DROP CONSTRAINT "FK_d5a40e60729e9c9ff0cd9077df3"`);
        await queryRunner.query(`ALTER TABLE "stock_detail_entity" DROP CONSTRAINT "FK_7eb1044c7445d2203ec0cb9345c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb949ea9f4e1b53bd5e4d31d05"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74b53325d6218967e9e6005feb"`);
        await queryRunner.query(`DROP TABLE "user_entity_companies_master_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity_companies_master"`);
        await queryRunner.query(`DROP TABLE "master_entity"`);
        await queryRunner.query(`DROP TABLE "stock_detail_entity"`);
        await queryRunner.query(`DROP TABLE "master_fundamentals_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}

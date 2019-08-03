import { MigrationInterface, QueryRunner } from 'typeorm'

export class blog1564785645730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "page" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "uri" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "page" ADD CONSTRAINT "FK_ae1d917992dd0c9d9bbdad06c4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "page" DROP CONSTRAINT "FK_ae1d917992dd0c9d9bbdad06c4a"`)
    await queryRunner.query(`DROP TABLE "page"`)
  }
}

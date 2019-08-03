import { MigrationInterface, QueryRunner } from 'typeorm'

export class initial1564757196714 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" text NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "reset_password_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expires" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "REL_3fde3055d9d16236c05d030915" UNIQUE ("userId"), CONSTRAINT "PK_c6f6eb8f5c88ac0233eceb8d385" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "reset_password_token" ADD CONSTRAINT "FK_3fde3055d9d16236c05d030915e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "reset_password_token" DROP CONSTRAINT "FK_3fde3055d9d16236c05d030915e"`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`
    )
    await queryRunner.query(`DROP TABLE "reset_password_token"`)
    await queryRunner.query(`DROP TABLE "refresh_token"`)
    await queryRunner.query(`DROP TABLE "user"`)
  }
}

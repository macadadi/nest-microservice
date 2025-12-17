import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRevokedTokensTable1734567890125 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'revoked_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'token',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'expiresAt',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'tokenType',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'revoked_tokens',
      new TableIndex({
        name: 'IDX_revoked_tokens_token',
        columnNames: ['token'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'revoked_tokens',
      new TableIndex({
        name: 'IDX_revoked_tokens_expiresAt',
        columnNames: ['expiresAt'],
      }),
    );

    await queryRunner.createIndex(
      'revoked_tokens',
      new TableIndex({
        name: 'IDX_revoked_tokens_userId',
        columnNames: ['userId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('revoked_tokens', 'IDX_revoked_tokens_userId');
    await queryRunner.dropIndex(
      'revoked_tokens',
      'IDX_revoked_tokens_expiresAt',
    );
    await queryRunner.dropIndex('revoked_tokens', 'IDX_revoked_tokens_token');
    await queryRunner.dropTable('revoked_tokens');
  }
}

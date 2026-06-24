import { entity, role, text, uuid, boolean, date } from '@microsoft/rayfin-core';

@entity()
@role('authenticated', '*')
export class EtlConfigIngestion {
  @uuid() id!: string;

  @boolean() isEnabled!: boolean;

  @text({ max: 100 }) sourceConnectionName!: string;
  @text({ max: 128 }) sourceSchemaName!: string;
  @text({ max: 128 }) sourceTableName!: string;

  @text({ max: 20 }) loadMode!: string;
  @text({ max: 128, optional: true }) incrementalColumnName?: string;

  @text({ max: 100 }) targetWorkspaceName!: string;
  @text({ max: 100 }) targetLakehouseName!: string;
  @text({ max: 128, optional: true }) targetSchemaName?: string;
  @text({ max: 128 }) targetTableName!: string;

  @date() createdAt!: Date;
  @date({ optional: true }) updatedAt?: Date;
  @text({ max: 100, optional: true }) updatedByUserId?: string;
}

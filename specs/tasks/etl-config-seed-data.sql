-- Seed data for EtlConfigIngestData
-- Execute this script in the target SQL database where the table exists.

INSERT INTO EtlConfigIngestData (
    IsEnabled,
    SourceConnectionName,
    SourceSchemaName,
    SourceTableName,
    LoadMode,
    IncrementalColumnName,
    TargetWorkspaceName,
    TargetLakehouseName,
    TargetSchemaName,
    TargetTableName,
    CreatedAt,
    UpdatedAt,
    UpdatedByUserId
)
VALUES (
    1,
    'SalesSqlProd',
    'dbo',
    'SalesOrders',
    'Incremental',
    'OrderDate',
    'FabricWorkspaceSales',
    'LakehouseSales',
    'dbo',
    'SalesOrdersStaged',
    SYSDATETIME(),
    NULL,
    NULL
);

INSERT INTO EtlConfigIngestData (
    IsEnabled,
    SourceConnectionName,
    SourceSchemaName,
    SourceTableName,
    LoadMode,
    IncrementalColumnName,
    TargetWorkspaceName,
    TargetLakehouseName,
    TargetSchemaName,
    TargetTableName,
    CreatedAt,
    UpdatedAt,
    UpdatedByUserId
)
VALUES (
    1,
    'FinanceSqlDev',
    'finance',
    'InvoiceHeader',
    'Full',
    NULL,
    'FabricWorkspaceFinance',
    'LakehouseFinance',
    'finance',
    'InvoiceHeaderStaged',
    SYSDATETIME(),
    NULL,
    NULL
);

INSERT INTO EtlConfigIngestData (
    IsEnabled,
    SourceConnectionName,
    SourceSchemaName,
    SourceTableName,
    LoadMode,
    IncrementalColumnName,
    TargetWorkspaceName,
    TargetLakehouseName,
    TargetSchemaName,
    TargetTableName,
    CreatedAt,
    UpdatedAt,
    UpdatedByUserId
)
VALUES (
    0,
    'MarketingSqlUat',
    'marketing',
    'CampaignPerformance',
    'Incremental',
    'ModifiedAt',
    'FabricWorkspaceMarketing',
    'LakehouseMarketing',
    'marketing',
    'CampaignPerformanceStaged',
    SYSDATETIME(),
    NULL,
    NULL
);

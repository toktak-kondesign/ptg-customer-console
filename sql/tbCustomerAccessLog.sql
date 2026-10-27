-- =============================================================
-- tbCustomerAccessLog — Access log ของระบบ PTG Customer Web
-- Database: DBWEBPTG (DATABASE_URL)
-- รัน script นี้ครั้งเดียวบน DBWEBPTG ก่อน deploy โค้ด logging
-- =============================================================

IF NOT EXISTS (
  SELECT 1 FROM sys.tables
  WHERE name = 'tbCustomerAccessLog' AND schema_id = SCHEMA_ID('dbo')
)
BEGIN
  CREATE TABLE dbo.tbCustomerAccessLog (
    ItemID        BIGINT IDENTITY(1,1) NOT NULL
                  CONSTRAINT PK_tbCustomerAccessLog PRIMARY KEY,
    CustID        NVARCHAR(20)  NULL,  -- รหัสลูกค้าที่ทำรายการ/ถูกกระทำ
    Username      NVARCHAR(50)  NULL,  -- user ที่ login ทำรายการ
    Module        NVARCHAR(50)  NOT NULL, -- เช่น 'payment-list', 'truck-list'
    ActionName    NVARCHAR(20)  NOT NULL, -- CREATE / UPDATE / DELETE / CANCEL / VIEW
    ActionDetail  NVARCHAR(500) NULL,  -- รายละเอียดกิจกรรมที่ทำ
    RefNo         NVARCHAR(50)  NULL,  -- เลขอ้างอิง เช่น Runno, IDCode, CardID
    Result        NVARCHAR(10)  NOT NULL
                  CONSTRAINT DF_tbCustomerAccessLog_Result DEFAULT 'SUCCESS', -- SUCCESS / FAIL
    ErrorMessage  NVARCHAR(500) NULL,  -- ข้อความ error เมื่อ Result = 'FAIL'
    IPAddress     NVARCHAR(45)  NULL,
    UserAgent     NVARCHAR(300) NULL,
    CreatedDate   DATETIME2     NOT NULL
                  CONSTRAINT DF_tbCustomerAccessLog_CreatedDate DEFAULT SYSDATETIME()
  );
END
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_tbCustomerAccessLog_CustID_CreatedDate'
    AND object_id = OBJECT_ID('dbo.tbCustomerAccessLog')
)
  CREATE INDEX IX_tbCustomerAccessLog_CustID_CreatedDate
    ON dbo.tbCustomerAccessLog (CustID, CreatedDate DESC);
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_tbCustomerAccessLog_Module_Action'
    AND object_id = OBJECT_ID('dbo.tbCustomerAccessLog')
)
  CREATE INDEX IX_tbCustomerAccessLog_Module_Action
    ON dbo.tbCustomerAccessLog (Module, ActionName);
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_tbCustomerAccessLog_CreatedDate'
    AND object_id = OBJECT_ID('dbo.tbCustomerAccessLog')
)
  CREATE INDEX IX_tbCustomerAccessLog_CreatedDate
    ON dbo.tbCustomerAccessLog (CreatedDate DESC);
GO

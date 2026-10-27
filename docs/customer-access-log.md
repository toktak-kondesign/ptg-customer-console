# Customer Access Log — คู่มือการใช้งาน

ระบบบันทึก log การใช้งานของ user ลงตาราง `dbo.tbCustomerAccessLog` บนฐาน **DBWEBPTG** (`DATABASE_URL`)

ใช้สำหรับ audit ทุก write action ในโปรเจกต์ เช่น สร้างใบนำจ่าย, ขอบัตรรถชั่วคราว, ยกเลิกบัตร

## 1. ติดตั้ง (ครั้งเดียว)

รัน SQL script บน DBWEBPTG:

```
sql/tbCustomerAccessLog.sql
```

Script เป็น idempotent (`IF NOT EXISTS`) — รันซ้ำได้โดยไม่ error

## 2. โครงสร้างตาราง

| Column | Type | คำอธิบาย |
|---|---|---|
| `ItemID` | BIGINT IDENTITY PK | running number |
| `CustID` | NVARCHAR(20) | รหัสลูกค้าที่ทำรายการ/ถูกกระทำ |
| `Username` | NVARCHAR(50) | user ที่ login ทำรายการ |
| `Module` | NVARCHAR(50) | ระบบ/หน้า เช่น `payment-list`, `truck-list` |
| `ActionName` | NVARCHAR(20) | `CREATE` / `UPDATE` / `DELETE` / `CANCEL` / `VIEW` |
| `ActionDetail` | NVARCHAR(500) | รายละเอียดกิจกรรม (ภาษาไทยได้) |
| `RefNo` | NVARCHAR(50) | เลขอ้างอิง เช่น Runno, IDCode, CardID |
| `Result` | NVARCHAR(10) | `SUCCESS` / `FAIL` (default `SUCCESS`) |
| `ErrorMessage` | NVARCHAR(500) | ข้อความ error เมื่อ `Result = 'FAIL'` |
| `IPAddress` | NVARCHAR(45) | client IP (จาก `x-forwarded-for` / `x-real-ip`) |
| `UserAgent` | NVARCHAR(300) | browser user-agent |
| `CreatedDate` | DATETIME2 | default `SYSDATETIME()` |

Index: `(CustID, CreatedDate DESC)`, `(Module, ActionName)`, `(CreatedDate DESC)`

## 3. วิธีเรียกใช้ใน API route

```ts
import { getClientIp, logCustomerAccess } from "@/lib/access-log";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const created = await doSomething(body);

    // log สำเร็จ — fire-and-forget ไม่ต้อง await
    logCustomerAccess({
      custID: body.custID,
      username: body.userCreate,
      module: "my-module",          // ตั้งชื่อตามระบบของคุณ
      action: "CREATE",
      detail: `สร้างเอกสาร ${created.docNo}`,
      refNo: created.docNo,
      result: "SUCCESS",
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // log ล้มเหลวด้วย เพื่อ audit ครบ
    logCustomerAccess({
      custID: body.custID,
      module: "my-module",
      action: "CREATE",
      detail: "สร้างเอกสารไม่สำเร็จ",
      result: "FAIL",
      errorMessage: error instanceof Error ? error.message : String(error),
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
    });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

## 4. กฎสำคัญ

- **Fire-and-forget** — `logCustomerAccess()` ไม่ throw และไม่ต้อง `await`; logging ล้มเหลวจะ `console.error` อย่างเดียว ไม่กระทบ response หลัก
- **ห้ามใส่ข้อมูล sensitive** ใน `detail`/`errorMessage` — OTP, token, password, เลขบัตรเต็ม
- **เก็บ field สั้น** — utility truncate ให้อัตโนมัติตามขนาด column แต่ควรส่งข้อความกะทัดรัด
- **ตั้ง `module` ให้สอดคล้อง** — ใช้ชื่อ route/page เช่น `payment-list`, `truck-list`, `customer-info`
- **`action` ใช้ค่ามาตรฐาน** — `CREATE` / `UPDATE` / `DELETE` / `CANCEL` / `VIEW` เพื่อ query รวมได้ง่าย

## 5. ตัวอย่าง query ตรวจสอบ

```sql
-- log ล่าสุด 100 รายการ
SELECT TOP 100 * FROM dbo.tbCustomerAccessLog ORDER BY ItemID DESC;

-- รายการล้มเหลวของลูกค้ารายหนึ่ง
SELECT * FROM dbo.tbCustomerAccessLog
WHERE CustID = 'C2309241' AND Result = 'FAIL'
ORDER BY CreatedDate DESC;

-- สรุปจำนวน action ต่อ module วันนี้
SELECT Module, ActionName, COUNT(*) AS Total
FROM dbo.tbCustomerAccessLog
WHERE CreatedDate >= CAST(GETDATE() AS DATE)
GROUP BY Module, ActionName;
```

## 6. จุดที่ติดตั้งอยู่แล้ว

| Route | Module | Action |
|---|---|---|
| `POST /api/paying-bill` | `payment-list` | CREATE |
| `POST /api/car-card/create` | `truck-list` | CREATE |
| `POST /api/car-card/cancel` | `truck-list` | CANCEL |
| `POST /api/truck-card/cancel` | `truck-list` | CANCEL |

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button, DatePicker, Input, Select, Table, Tag, Tooltip } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAccessLogService } from "@/services/customer/access-log";
import type { AccessLogQuery, AccessLogRow } from "@/interfaces/access-log";

const { RangePicker } = DatePicker;

const MODULE_OPTIONS = [
  { value: "payment-list", label: "payment-list" },
  { value: "truck-list", label: "truck-list" },
];

const ACTION_OPTIONS = ["CREATE", "UPDATE", "DELETE", "CANCEL", "VIEW"].map(
  (value) => ({ value, label: value }),
);

const RESULT_OPTIONS = ["SUCCESS", "FAIL"].map((value) => ({
  value,
  label: value,
}));

const PAGE_SIZE = 50;

const formatDateTime = (value: string) => {
  const d = dayjs(value);
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm:ss") : "-";
};

const columns: ColumnsType<AccessLogRow> = [
  {
    title: "ลำดับ",
    dataIndex: "itemId",
    width: 90,
    align: "center",
  },
  {
    title: "วันที่-เวลา",
    dataIndex: "createdDate",
    width: 160,
    render: formatDateTime,
  },
  {
    title: "รหัสลูกค้า",
    dataIndex: "custId",
    width: 120,
    render: (v) => v || "-",
  },
  {
    title: "ผู้ทำรายการ",
    dataIndex: "username",
    width: 130,
    render: (v) => v || "-",
  },
  {
    title: "ระบบ",
    dataIndex: "module",
    width: 120,
  },
  {
    title: "กิจกรรม",
    dataIndex: "actionName",
    width: 100,
    align: "center",
    render: (v: string) => {
      const color =
        v === "CREATE"
          ? "green"
          : v === "UPDATE"
            ? "blue"
            : v === "DELETE" || v === "CANCEL"
              ? "red"
              : "default";
      return <Tag color={color}>{v}</Tag>;
    },
  },
  {
    title: "รายละเอียด",
    dataIndex: "actionDetail",
    ellipsis: { showTitle: false },
    render: (v: string | null, row) => (
      <Tooltip title={row.errorMessage ? `${v ?? ""} — ${row.errorMessage}` : v}>
        <span>{v || "-"}</span>
        {row.result === "FAIL" && row.errorMessage && (
          <span className="ml-1 text-xs text-red-500">
            ({row.errorMessage})
          </span>
        )}
      </Tooltip>
    ),
  },
  {
    title: "เลขอ้างอิง",
    dataIndex: "refNo",
    width: 140,
    render: (v) => v || "-",
  },
  {
    title: "ผลลัพธ์",
    dataIndex: "result",
    width: 100,
    align: "center",
    render: (v: string) => (
      <Tag color={v === "SUCCESS" ? "success" : "error"}>{v}</Tag>
    ),
  },
  {
    title: "IP",
    dataIndex: "ipAddress",
    width: 130,
    render: (v) => v || "-",
  },
];

export default function AccessLogPage() {
  const [rows, setRows] = useState<AccessLogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [custId, setCustId] = useState("");
  const [username, setUsername] = useState("");
  const [module, setModule] = useState<string>();
  const [actionName, setActionName] = useState<string>();
  const [result, setResult] = useState<string>();
  const [refNo, setRefNo] = useState("");
  const [keyword, setKeyword] = useState("");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const load = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    const query: AccessLogQuery = {
      custId: custId || undefined,
      username: username || undefined,
      module,
      actionName,
      result,
      refNo: refNo || undefined,
      keyword: keyword || undefined,
      dateFrom: dateRange?.[0]?.format("YYYY-MM-DD"),
      dateTo: dateRange?.[1]?.format("YYYY-MM-DD"),
      page: targetPage,
      pageSize: PAGE_SIZE,
    };
    const res = await getAccessLogService(query);
    if (res.status === "success") {
      setRows(res.results);
      setTotal(res.total);
      setPage(res.page);
    } else {
      setRows([]);
      setTotal(0);
      setError(res.error ?? "ไม่สามารถโหลด log ได้");
    }
    setLoading(false);
  }, [custId, username, module, actionName, result, refNo, keyword, dateRange]);

  useEffect(() => {
    void load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => void load(1);

  const handleReset = () => {
    setCustId("");
    setUsername("");
    setModule(undefined);
    setActionName(undefined);
    setResult(undefined);
    setRefNo("");
    setKeyword("");
    setDateRange(null);
    void getAccessLogService({ page: 1, pageSize: PAGE_SIZE }).then((res) => {
      if (res.status === "success") {
        setRows(res.results);
        setTotal(res.total);
        setPage(1);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6">
          <p className="text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              หน้าหลัก
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-blue-600 font-medium">
              Log การใช้งานระบบ
            </span>
          </p>

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <h1 className="text-xl font-semibold text-gray-800">
                Log การใช้งานระบบ
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                ประวัติการทำรายการของผู้ใช้ทั้งหมด (tbCustomerAccessLog)
              </p>

              {/* Filters */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                <Input
                  placeholder="รหัสลูกค้า"
                  value={custId}
                  onChange={(e) => setCustId(e.target.value)}
                  onPressEnter={handleSearch}
                  allowClear
                />
                <Input
                  placeholder="ผู้ทำรายการ"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onPressEnter={handleSearch}
                  allowClear
                />
                <Select
                  placeholder="ระบบ"
                  value={module}
                  onChange={setModule}
                  options={MODULE_OPTIONS}
                  allowClear
                  className="w-full"
                />
                <Select
                  placeholder="กิจกรรม"
                  value={actionName}
                  onChange={setActionName}
                  options={ACTION_OPTIONS}
                  allowClear
                  className="w-full"
                />
                <Select
                  placeholder="ผลลัพธ์"
                  value={result}
                  onChange={setResult}
                  options={RESULT_OPTIONS}
                  allowClear
                  className="w-full"
                />
                <Input
                  placeholder="เลขอ้างอิง"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  onPressEnter={handleSearch}
                  allowClear
                />
                <Input
                  placeholder="ค้นหารายละเอียด"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onPressEnter={handleSearch}
                  allowClear
                />
                <RangePicker
                  value={dateRange as never}
                  onChange={(v) => setDateRange(v)}
                  className="w-full"
                  placeholder={["จากวันที่", "ถึงวันที่"]}
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={loading}
                >
                  ค้นหา
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  ล้างตัวกรอง
                </Button>
                <span className="ml-auto text-sm text-gray-500">
                  ทั้งหมด {total.toLocaleString()} รายการ
                </span>
              </div>
            </div>

            {error && (
              <div className="px-5 sm:px-8 pb-4">
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <div className="px-5 sm:px-8 pb-8">
              <Table<AccessLogRow>
                columns={columns}
                dataSource={rows}
                rowKey="itemId"
                loading={loading}
                size="middle"
                scroll={{ x: 1400 }}
                pagination={{
                  current: page,
                  pageSize: PAGE_SIZE,
                  total,
                  showSizeChanger: false,
                  showTotal: (t) => `${t.toLocaleString()} รายการ`,
                  onChange: (p) => void load(p),
                }}
              />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

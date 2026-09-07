import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import { getApiBaseUrl } from "../lib/env";

const services = [
  {
    image: "/images/banner/e-tax_lnvoice.png",
    title: "e-TAX Invoice\n& Delivery note",
    desc: "ใบกำกับภาษีและใบส่งสินค้า",
    href: getApiBaseUrl() + "PTGWeb/CalendarBill",
  },
  {
    image: "/images/banner/My_credit.png",
    title: "My\nCredit",
    desc: "ข้อมูลวงเงินและเครดิตเทอม",
    href: getApiBaseUrl() + "PTGWeb/CustomerCredit",
  },
  {
    image: "/images/banner/Overdue_ltems.png",
    title: "Payment\nList",
    desc: "รายการชำระเงิน",
    href: "/payment-list",
  },
  {
    image: "/images/banner/Reward_Point.png",
    title: "Reward\nPoint",
    desc: "ยอดคะแนนสะสม",
    highlight: true,
    href: getApiBaseUrl() + "http://deprewards.ptg.co.th/home",
  },
  {
    image: "/images/banner/PTG_L-M.png",
    title: "ระบบ PTG\nLubricant",
    desc: "บริการงานหล่อลื่นบำรุงรักษา",
    disabled: true,
  },
  {
    image: "/images/banner/ptg_truck.png",
    title: "ข้อมูลรายการ\nรถบรรทุก",
    desc: "ข้อมูลรายการรถบรรทุก",
    href: getApiBaseUrl() + "PTGWeb/TruckList",
  },
  {
    image: "/images/banner/tracking_logistic.png",
    title: "รายงาน\nส่งสินค้า",
    desc: "รายงานส่งสินค้า",
    href: getApiBaseUrl() + "Logistics/DeliveryProduct",
  },
  {
    image: "/images/banner/Order_purchase.png",
    title: "รายการ Order\nสินค้า",
    desc: "รายการ Order สินค้า",
    href: getApiBaseUrl() + "PTGWeb/Orderpicker",
  },
  {
    image: "/images/banner/PTG-Messages.png",
    title: "PTG\nMessages",
    desc: "ข้อความจาก PTG",
    badge: 1,
  },
  {
    image: "/images/banner/Order-online.png",
    title: "สั่งซื้อสินค้า\nออนไลน์",
    desc: "สั่งซื้อสินค้าผ่านออนไลน์",
  },
];

export default function CustomerService() {
  return (
    <section className="py-12 bg-white">
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900">
              CUSTOMER SERVICE
            </h1>
            <h4 className="text-blue-500 text-base">ระบบบริการลูกค้า</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {services.map((service) => (
              <div
                key={service.title}
                className={`service-card border border-gray-200 rounded-xl p-3 sm:p-4 text-center shadow-md relative ${
                  service.disabled
                    ? "bg-gray-100 grayscale opacity-60 cursor-not-allowed pointer-events-none"
                    : "bg-white hover:shadow-sm cursor-pointer"
                }`}
                aria-disabled={service.disabled || undefined}
              >
                {service.href && !service.disabled && (
                  <Link
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10 rounded-xl"
                    aria-label={`เปิด ${service.title.replace(/\n/g, " ")} ในแท็บใหม่`}
                  />
                )}
                {service.badge && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {service.badge}
                  </div>
                )}
                <div
                  className={`service-card-icon bg-gradient-to-br rounded-xl flex items-center justify-center mx-auto mb-4 relative w-full h-20 sm:h-24`}
                >
                  <Image
                    src={service.image}
                    alt={service.title.replace(/\n/g, " ")}
                    fill
                    sizes="(max-width: 768px) 25vw, 200px"
                    className="object-contain p-2"
                  />
                </div>
                <p className="text-gray-500 text-xs">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

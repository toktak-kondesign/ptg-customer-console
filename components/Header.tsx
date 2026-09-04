import Link from "next/link";
import { Row, Col } from "antd";
import Image from "next/image";
import CustomerMenu from "./CustomerMenu";

const NAV_HOME_URL = "https://depwn2021.ptg.co.th/Site/main";
const NAV_PRODUCTS_URL = "https://depwn2021.ptg.co.th/Site/product?l=UgOcGc9";
const NAV_ABOUT_URL =
  "https://depwn2021.ptg.co.th/Site/AboutUs?l=f0141405-7c4b-4144-8e37-4b11e1b2edc2";
const NAV_CONTACT_URL =
  "https://depwn2021.ptg.co.th/Site/contact?l=c07ba89e-d7bc-4a77-8f42-7083c361da6b";
const NAV_CART_URL = "https://depwn2021.ptg.co.th/Site/mycart";
const CART_COUNT = 0;

const navLinks = [
  { label: "หน้าหลัก", href: NAV_HOME_URL },
  { label: "สินค้าของเรา", href: NAV_PRODUCTS_URL },
  { label: "สินค้าแลกแต้ม", href: "/" },
  { label: "เกี่ยวกับเรา", href: NAV_ABOUT_URL },
  { label: "ติดต่อเรา", href: NAV_CONTACT_URL },
];

export default function Header() {
  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <Row align="middle" justify="space-between">
            <Col xs={12} sm={6} md={4} lg={3}>
              <div className="relative h-8 w-[120px]">
                <Image
                  src="/logo/logo.svg"
                  alt="PTG Logo"
                  fill
                  sizes="120px"
                  className="object-contain"
                  priority
                />
              </div>
            </Col>

            <Col xs={12} sm={18} md={20} lg={21}>
              <Row align="middle" justify="end" gutter={[28, 0]}>
                <Col xs={0} lg={4} style={{ width: "auto", flex: "none" }}>
                  <div style={{ textAlign: "left" }}>
                    <div
                      className="text-gray-600 mb-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Call Us
                    </div>
                    <div
                      className="font-semibold"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <a style={{ color: "black" }} href="tel:1634">
                        1634
                      </a>
                    </div>
                  </div>
                </Col>

                <Col xs={0} lg={5} style={{ width: "auto", flex: "none" }}>
                  <div style={{ textAlign: "left" }}>
                    <div
                      className="text-gray-600 mb-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Email Us
                    </div>
                    <div
                      className="font-semibold"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <a style={{ color: "black" }} href="mailto:cs@ptg.co.th">
                        cs@ptg.co.th
                      </a>
                    </div>
                  </div>
                </Col>

                <Col xs={0} lg={6} style={{ width: "auto", flex: "none" }}>
                  <div style={{ textAlign: "left" }}>
                    <div
                      className="text-gray-600 mb-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Global Certificate
                    </div>
                    <div
                      className="font-semibold text-gray-900"
                      style={{ fontSize: "0.85rem" }}
                    >
                      ISO 14001:2015
                    </div>
                  </div>
                </Col>

                <Col
                  xs={12}
                  sm={24}
                  md={8}
                  lg={7}
                  style={{ width: "auto", flex: "none" }}
                >
                  <CustomerMenu />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#0B132B] w-full px-4 sm:px-6 py-3 sm:py-4 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5 sm:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white text-[13px] sm:text-[14px] opacity-80 hover:opacity-100 transition shrink-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href={NAV_CART_URL}
            className="relative shrink-0"
            aria-label="ตะกร้าของฉัน"
          >
            <Image
              src="/images/carts-yellow.png"
              alt="ตะกร้าของฉัน"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 bg-red-500 text-white text-[11px] font-medium rounded-full flex items-center justify-center">
              {CART_COUNT}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

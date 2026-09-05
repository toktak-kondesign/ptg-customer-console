import { Suspense } from "react";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CustomerService from "@/components/CustomerService";
import StatusDelivery from "@/components/StatusDelivery";
import Reward from "@/components/Reward";
import BannerFooter from "@/components/BannerFooter";
import Footer from "@/components/Footer";
import AuthHandler from "@/components/AuthHandler";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthHandler />
      </Suspense>
      <Header />
      <main className="flex-1">
        <HeroSlider />
        <CustomerService />
        <StatusDelivery />
        <Reward />
        <BannerFooter />
      </main>
      <Footer />
    </>
  );
}

import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CustomerService from "@/components/CustomerService";
import StatusDelivery from "@/components/StatusDelivery";
import Reward from "@/components/Reward";
import BannerFooter from "@/components/BannerFooter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
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

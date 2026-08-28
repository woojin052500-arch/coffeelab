import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Brand from "@/components/Brand";
import Process from "@/components/Process";
import Flavor from "@/components/Flavor";
import Products from "@/components/Products";
import Proof from "@/components/Proof";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ToTop from "@/components/ToTop";
import MobileBar from "@/components/MobileBar";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Brand />
        <Process />
        <Flavor />
        <Products />
        <Proof />
        <Contact />
      </main>
      <Footer />
      <ToTop />
      <MobileBar />
    </>
  );
}

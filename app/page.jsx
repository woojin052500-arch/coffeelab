import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Brand from "@/components/Brand";
import Band from "@/components/Band";
import Collage from "@/components/Collage";
import Process from "@/components/Process";
import Flavor from "@/components/Flavor";
import Taste from "@/components/Taste";
import Products from "@/components/Products";
import Proof from "@/components/Proof";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ToTop from "@/components/ToTop";
import MobileBar from "@/components/MobileBar";
import CoffeeTestRoot from "@/components/CoffeeTestRoot";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Brand />
        <Band name="process" />
        <Process />
        <Flavor />
        <Taste />
        <Collage />
        <Products />
        <Proof />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <ToTop />
      <MobileBar />
      <CoffeeTestRoot />
    </>
  );
}

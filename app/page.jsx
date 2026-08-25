import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Brand from "@/components/Brand";
import Why from "@/components/Why";
import Process from "@/components/Process";
import Design from "@/components/Design";
import Flavor from "@/components/Flavor";
import Local from "@/components/Local";
import Products from "@/components/Products";
import Proof from "@/components/Proof";
import Roadmap from "@/components/Roadmap";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ToTop from "@/components/ToTop";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Brand />
        <Why />
        <Process />
        <Design />
        <Flavor />
        <Local />
        <Products />
        <Proof />
        <Roadmap />
        <Contact />
      </main>
      <Footer />
      <ToTop />
    </>
  );
}

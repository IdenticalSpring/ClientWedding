import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Hero from "./components/Hero";
import LogoCollection from "./components/LogoCollection";
import Highlights from "./components/Highlights";
import Pricing from "./components/Pricing";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import AppTheme from "../components/shared-theme/AppTheme";
import FloatingButtons from "./components/FloatingButtons";
import AppAppBar from "../layout/navbar";
import Footer from "../layout/footer";
export default function LandingPage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection id="logo-collection" />
        <Features id="features" />
        <Divider />
        <Testimonials id="testimonials" />
        <Divider />
        <Highlights id="highlights" />
        <Divider />
        <Pricing id="pricing" />
        <Divider />
        <FAQ />
        <FloatingButtons />
        <FAQ id="faq" />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}

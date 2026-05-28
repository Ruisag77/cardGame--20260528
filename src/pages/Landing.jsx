import Header from '../components/landing/Header.jsx'
import Hero from '../components/landing/Hero.jsx'
import FeatureGrid from '../components/landing/FeatureGrid.jsx'
import RulesSection from '../components/landing/RulesSection.jsx'
import GrowthChart from '../components/landing/GrowthChart.jsx'
import Testimonials from '../components/landing/Testimonials.jsx'
import Footer from '../components/landing/Footer.jsx'

export default function Landing() {
  return (
    <div className="relative">
      <Header />
      <Hero />
      <FeatureGrid />
      <RulesSection />
      <GrowthChart />
      <Testimonials />
      <Footer />
    </div>
  )
}

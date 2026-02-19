import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'

const RTI_LOGO = 'https://vernon-tech-media.s3.us-east-1.amazonaws.com/RTI-agency/logos/RTI-logo.png'
const HERO_SLIDES = [
  'https://vernon-tech-media.s3.us-east-1.amazonaws.com/RTI-agency/website-images/slider-1.png',
  'https://vernon-tech-media.s3.us-east-1.amazonaws.com/RTI-agency/website-images/slider-2.png'
]
const STAFF_IMAGES = [
  'https://vernon-tech-media.s3.us-east-1.amazonaws.com/RTI-agency/website-images/staff-1.jpeg',
  'https://vernon-tech-media.s3.us-east-1.amazonaws.com/RTI-agency/website-images/staff-2.png'
]

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)
  const [currentStaffSlide, setCurrentStaffSlide] = useState(0)
  const [currentILSSlide, setCurrentILSSlide] = useState(0)

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    const staffInterval = setInterval(() => {
      setCurrentStaffSlide((prev) => (prev + 1) % STAFF_IMAGES.length)
    }, 5000)
    const ilsInterval = setInterval(() => {
      setCurrentILSSlide((prev) => (prev + 1) % 2)
    }, 5000)
    return () => {
      clearInterval(heroInterval)
      clearInterval(staffInterval)
      clearInterval(ilsInterval)
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#fe9226] opacity-15 blur-[60px] top-[10%] left-[5%] animate-pulse" style={{ animationDuration: '20s' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#003d5c] opacity-15 blur-[60px] top-[60%] right-[10%] animate-pulse" style={{ animationDuration: '25s', animationDelay: '5s' }} />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[#00b8d4] opacity-15 blur-[60px] bottom-[20%] left-[50%] animate-pulse" style={{ animationDuration: '22s', animationDelay: '10s' }} />
      </div>

      {/* Top Info Bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#fe9226] text-white text-center py-2 text-sm z-[60]">
        <span className="font-medium">Road to Independence</span> 45030 Trevor Ave. Suite B Lancaster, CA 93534 Phone 661-948-6760
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 left-0 right-0 bg-white/85 backdrop-blur-lg shadow-lg z-50 border-b border-white/30">
        <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center h-20">
          <Link to="/home" className="transition-transform hover:scale-105">
            <img src={RTI_LOGO} alt="RTI Logo" className="h-[50px] w-auto" />
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-10">
            <li>
              <button onClick={() => scrollToSection('services')} className="text-gray-800 font-medium relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#fe9226] after:to-[#e67e1a] hover:after:w-full after:transition-all">
                Services
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('faq')} className="text-gray-800 font-medium relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#fe9226] after:to-[#e67e1a] hover:after:w-full after:transition-all">
                FAQ
              </button>
            </li>
            <li>
              <Link to="/contact" className="text-gray-800 font-medium relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#fe9226] after:to-[#e67e1a] hover:after:w-full after:transition-all">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="text-gray-800 font-medium relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#fe9226] after:to-[#e67e1a] hover:after:w-full after:transition-all">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/login" className="bg-gradient-to-br from-[#fe9226] to-[#e67e1a] text-white px-7 py-3 rounded-full font-medium shadow-lg shadow-[#fe9226]/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#fe9226]/40 transition-all">
                Staff Portal
              </Link>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
            <button onClick={() => scrollToSection('services')} className="block w-full text-left text-gray-800 py-2">Services</button>
            <button onClick={() => scrollToSection('faq')} className="block w-full text-left text-gray-800 py-2">FAQ</button>
            <Link to="/contact" className="block w-full text-left text-gray-800 py-2">Contact</Link>
            <Link to="/jobs" className="block w-full text-left text-gray-800 py-2">Careers</Link>
            <Link to="/login" className="block w-full text-center bg-gradient-to-br from-[#fe9226] to-[#e67e1a] text-white px-4 py-3 rounded-full">
              Staff Portal
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] mt-28 flex items-center overflow-hidden">
        {/* Hero Slider */}
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ${currentHeroSlide === index ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url('${slide}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#003d5c]/85 to-[#002840]/75" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(254,146,38,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(0,184,212,0.15),transparent_50%)]" />
            </div>
          ))}
        </div>

        {/* Shimmer overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-[#fe9226]/15 to-transparent animate-[shimmer_8s_infinite]" />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[10, 25, 40, 55, 70, 85].map((left, i) => (
            <div
              key={i}
              className="absolute w-[3px] h-[3px] bg-[#fe9226]/60 rounded-full animate-[floatParticle_15s_linear_infinite]"
              style={{ left: `${left}%`, animationDelay: `${i * 1}s` }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full text-center px-5 animate-[fadeInUp_1s_ease-out]">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-6 leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            Road to <span className="bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent">Independence</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-[800px] mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            Committed to providing quality service to individuals with special needs
          </p>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`w-3 h-3 rounded-full border-2 transition-all ${
                currentHeroSlide === index 
                  ? 'bg-[#fe9226] border-[#fe9226] scale-[1.3]' 
                  : 'bg-white/40 border-white/60 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-gradient-to-br from-[#fe9226] to-[#e67e1a] text-white py-20 text-center relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="max-w-[1000px] mx-auto px-5 relative z-10">
          <p className="text-2xl md:text-3xl font-semibold leading-relaxed tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            Road to Independence is committed to providing quality service to individuals with special needs.
          </p>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-24 bg-white/70 backdrop-blur-lg relative overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(254,146,38,0.3),transparent_70%)] rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(0,184,212,0.25),transparent_70%)] rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '10s' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <h2 className="text-center text-4xl font-bold bg-gradient-to-br from-[#fe9226] to-[#e67e1a] bg-clip-text text-transparent mb-4">
            Our Promise To You
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16">You will receive staff who:</p>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Promise Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'First Aid & CPR Certified', desc: 'All our staff members are certified in First Aid and CPR to ensure safety and emergency preparedness.' },
                { title: 'Personalized Care', desc: "Provide services with care to fit all of our client's needs with individualized attention." },
                { title: 'Professional & Responsible', desc: 'Our team maintains the highest standards of professionalism and accountability.' },
                { title: 'Support & Guidance', desc: 'Provide support & guidance to individuals with special needs & their families.' }
              ].map((card, i) => (
                <div key={i} className="bg-gradient-to-br from-[rgba(13,71,97,0.95)] to-[rgba(8,51,68,0.98)] backdrop-blur-xl p-8 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10 relative overflow-hidden group hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_15px_45px_rgba(254,146,38,0.2),0_10px_30px_rgba(0,0,0,0.4)] hover:border-[#fe9226]/30 transition-all duration-400">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#fe9226] to-[#ffb366] opacity-80" />
                  <h3 className="bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent font-bold text-lg mb-3">{card.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Image Slider */}
            <div className="relative rounded-[25px] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.15)] h-[500px]">
              {STAFF_IMAGES.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${currentStaffSlide === index ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: `url('${img}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fe9226]/30 to-[#003d5c]/30 mix-blend-overlay" />
                </div>
              ))}
              
              {/* Arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-5 z-10">
                <button onClick={() => setCurrentStaffSlide((prev) => (prev - 1 + STAFF_IMAGES.length) % STAFF_IMAGES.length)} className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-lg flex items-center justify-center text-[#fe9226] shadow-lg hover:bg-[#fe9226] hover:text-white hover:scale-110 transition-all">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={() => setCurrentStaffSlide((prev) => (prev + 1) % STAFF_IMAGES.length)} className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-lg flex items-center justify-center text-[#fe9226] shadow-lg hover:bg-[#fe9226] hover:text-white hover:scale-110 transition-all">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {STAFF_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStaffSlide(index)}
                    className={`w-3 h-3 rounded-full border-2 transition-all ${
                      currentStaffSlide === index 
                        ? 'bg-[#fe9226] border-[#fe9226] scale-[1.3]' 
                        : 'bg-white/50 border-white/80 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-br from-[#003d5c] to-[#002840] relative overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(254,146,38,0.2),transparent_70%)] rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(0,184,212,0.2),transparent_70%)] rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '12s' }} />

        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <h2 className="text-center text-4xl font-bold bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent mb-16">
            Our Services
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Independent Living Skills */}
            <div className="bg-gradient-to-br from-[rgba(13,71,97,0.95)] to-[rgba(8,51,68,0.98)] backdrop-blur-xl p-12 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10 relative overflow-hidden group hover:-translate-y-2.5 hover:shadow-[0_25px_70px_rgba(254,146,38,0.2),0_10px_30px_rgba(0,0,0,0.4)] hover:border-[#fe9226]/30 transition-all duration-400">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe9226] via-[#ffb366] to-[#00b8d4] opacity-80" />
              <h3 className="text-2xl font-bold text-white mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                <span className="bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(254,146,38,0.5)]">Independent</span> Living Skills
              </h3>
              
              <div className="min-h-[300px] relative">
                <div className={`transition-opacity duration-500 ${currentILSSlide === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
                  <h4 className="text-[#fe9226] font-semibold text-sm uppercase tracking-wider mb-4">COMMUNITY</h4>
                  <ul className="space-y-2">
                    {['AFDC', 'Accessing Community Resources', 'DCFS Support', 'Shopping', 'Travel/Transportation', 'Social Security'].map((item, i) => (
                      <li key={i} className="text-white/90 pl-7 relative before:content-['◆'] before:absolute before:left-0 before:text-[#fe9226] before:text-sm hover:text-white hover:pl-9 hover:translate-x-1 transition-all">{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={`transition-opacity duration-500 ${currentILSSlide === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
                  <h4 className="text-[#fe9226] font-semibold text-sm uppercase tracking-wider mb-4">HOME MANAGEMENT</h4>
                  <ul className="space-y-2">
                    {['Bill Paying', 'Budgeting', 'Money Management', 'Meal/Menu Preparation', 'Cleaning', 'Locating Suitable Housing'].map((item, i) => (
                      <li key={i} className="text-white/90 pl-7 relative before:content-['◆'] before:absolute before:left-0 before:text-[#fe9226] before:text-sm hover:text-white hover:pl-9 hover:translate-x-1 transition-all">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2 justify-center mt-6">
                {[0, 1].map((i) => (
                  <button key={i} onClick={() => setCurrentILSSlide(i)} className={`w-2.5 h-2.5 rounded-full border transition-all ${currentILSSlide === i ? 'bg-[#fe9226] border-[#fe9226] scale-[1.3] shadow-[0_0_10px_#fe9226]' : 'bg-white/30 border-white/50'}`} />
                ))}
              </div>
            </div>

            {/* Supported Living Skills */}
            <div className="bg-gradient-to-br from-[rgba(13,71,97,0.95)] to-[rgba(8,51,68,0.98)] backdrop-blur-xl p-12 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10 relative overflow-hidden group hover:-translate-y-2.5 hover:shadow-[0_25px_70px_rgba(254,146,38,0.2),0_10px_30px_rgba(0,0,0,0.4)] hover:border-[#fe9226]/30 transition-all duration-400">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe9226] via-[#ffb366] to-[#00b8d4] opacity-80" />
              <h3 className="text-2xl font-bold text-white mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                <span className="bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent">Supported</span> Living Skills
              </h3>
              <ul className="space-y-3">
                {['Choosing personal attendants and housemates', 'Acquiring household furnishings', 'Common daily living activities and emergencies', 'Assist in participating in community life', 'Manage personal finances', 'Provide ongoing support'].map((item, i) => (
                  <li key={i} className="text-white/90 pl-7 relative before:content-['◆'] before:absolute before:left-0 before:text-[#fe9226] before:text-sm hover:text-white hover:pl-9 hover:translate-x-1 transition-all">{item}</li>
                ))}
              </ul>
            </div>

            {/* Respite Services */}
            <div className="bg-gradient-to-br from-[rgba(13,71,97,0.95)] to-[rgba(8,51,68,0.98)] backdrop-blur-xl p-12 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10 relative overflow-hidden group hover:-translate-y-2.5 hover:shadow-[0_25px_70px_rgba(254,146,38,0.2),0_10px_30px_rgba(0,0,0,0.4)] hover:border-[#fe9226]/30 transition-all duration-400">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe9226] via-[#ffb366] to-[#00b8d4] opacity-80" />
              <h3 className="text-2xl font-bold text-white mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                <span className="bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent">Respite</span> Services
              </h3>
              <ul className="space-y-3">
                {[
                  'Assisting family members to enable an individual with intellectual disabilities to stay at home',
                  "Providing appropriate care and supervision to protect that person's safety in the absence of a family member(s)",
                  'Relieving family members from the constantly demanding responsibility of providing care'
                ].map((item, i) => (
                  <li key={i} className="text-white/90 pl-7 relative before:content-['◆'] before:absolute before:left-0 before:text-[#fe9226] before:text-sm hover:text-white hover:pl-9 hover:translate-x-1 transition-all">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white/80">
        <div className="max-w-[900px] mx-auto px-5">
          <h2 className="text-center text-4xl font-bold bg-gradient-to-br from-[#fe9226] to-[#e67e1a] bg-clip-text text-transparent mb-16">
            FAQ
          </h2>

          <div className="bg-gradient-to-br from-[rgba(13,71,97,0.95)] to-[rgba(8,51,68,0.98)] backdrop-blur-xl p-12 rounded-[30px] shadow-[0_8px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10 relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(254,146,38,0.2),0_8px_25px_rgba(0,0,0,0.4)] hover:border-[#fe9226]/30 transition-all">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#fe9226] via-[#ffb366] to-[#00b8d4] opacity-80" />
            <h3 className="text-2xl font-bold bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent mb-6">
              What is an Intellectual Disability?
            </h3>
            <p className="text-white/90 leading-relaxed mb-6">
              Intellectual disabilities are a group of conditions due to an impairment in physical, learning, language, or behavior areas. These conditions begin during the developmental period, may impact day-to-day functioning, and usually last throughout a person's lifetime.
            </p>
            <p className="text-white/90 leading-relaxed mb-6">
              A "substantial disability" means the existence of significant functional limitations in three or more of the following areas of major life activity, as determined by a regional center, and as appropriate to the age of the person:
            </p>
            <ul className="space-y-2">
              {['Self-care', 'Receptive and expressive language', 'Learning', 'Mobility', 'Self-direction', 'Capacity for independent living', 'Economic self-sufficiency'].map((item, i) => (
                <li key={i} className="text-white/90 pl-8 relative before:content-['•'] before:absolute before:left-0 before:text-[#fe9226] before:font-bold before:text-2xl">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-[#003d5c] to-[#002840] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,146,38,0.2),transparent_70%)] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="max-w-[1200px] mx-auto px-5 relative z-10">
          <h2 className="text-4xl font-bold mb-4">Join Our Team of Caregivers</h2>
          <p className="text-xl opacity-95 mb-10">Make a difference in the lives of individuals with special needs</p>
          <Link to="/jobs" className="inline-block px-10 py-4 bg-gradient-to-br from-[#fe9226] to-[#e67e1a] text-white rounded-full font-semibold text-lg shadow-[0_6px_25px_rgba(254,146,38,0.4)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_35px_rgba(254,146,38,0.5)] transition-all">
            Apply Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002840] text-white py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-12 mb-10">
            <div>
              <h3 className="bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent font-semibold mb-4">Road to Independence</h3>
              <p className="text-white/80 leading-relaxed">Providing quality care and support to individuals with special needs and their families.</p>
            </div>
            <div>
              <h3 className="bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent font-semibold mb-4">Services</h3>
              <p className="text-white/80 leading-relaxed">Independent Living Skills<br />Supported Living Skills<br />Respite Services</p>
            </div>
            <div>
              <h3 className="bg-gradient-to-br from-[#fe9226] to-[#ffb366] bg-clip-text text-transparent font-semibold mb-4">Contact</h3>
              <p className="text-white/80 leading-relaxed">For more information about our services or to join our team, please contact us.</p>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/20 text-white/70">
            <p>&copy; {new Date().getFullYear()} Road to Independence. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom animations */}
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }
        @keyframes floatParticle {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default LandingPage

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Lightbulb, Target, ArrowRight, Shield, Activity, Smartphone, Gamepad2 } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        
        {/* Intro Section */}
        <section className="container mx-auto px-4 md:px-6 mb-20 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 font-display text-4xl md:text-6xl font-bold text-foreground">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">EdgeZen Labs</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: "0.1s" }}>
              We are a team of passionate engineers, designers, and innovators dedicated to building the future of digital experiences.
            </p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="container mx-auto px-4 md:px-6 mb-24">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-card border-2 border-border p-8 md:p-12 shadow-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Lightbulb className="text-primary h-8 w-8" />
              Our Philosophy
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                At EdgeZen Labs, we believe technology should be elegant, powerful, and accessible. We don't just write code—we craft experiences.
              </p>
              <p>
                Every project is an opportunity to push boundaries, challenge conventions, and deliver solutions that make a real difference. Whether it's a mobile app, web platform, or cloud service, we approach each challenge with the same rigor and creativity.
              </p>
              <p>
                Our clients trust us because we combine technical excellence with design thinking, ensuring products that are not only functional but delightful to use.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="container mx-auto px-4 md:px-6 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Mission</h3>
              <p className="text-muted-foreground">To engineer digital excellence by creating intelligent, scalable solutions that empower businesses and transform user experiences.</p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Vision</h3>
              <p className="text-muted-foreground">To be the global leader in innovative software development, setting new standards for quality, design, and technological advancement.</p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Passion</h3>
              <p className="text-muted-foreground">We are driven by a love for technology and a commitment to craft. Every line of code is written with care and precision.</p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Excellence</h3>
              <p className="text-muted-foreground">We don't compromise on quality. From architecture to UI/UX, we deliver products that exceed expectations.</p>
            </div>

          </div>
        </section>

        {/* Our Approach */}
        <section className="container mx-auto px-4 md:px-6 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Approach</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            
            <div className="flex-1 rounded-2xl p-8 bg-card border border-border relative overflow-hidden group">
              <span className="absolute -top-4 -right-4 text-9xl font-black text-muted/20 group-hover:text-primary/10 transition-colors duration-500">01</span>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Design</h3>
                <p className="text-muted-foreground">We start with deep user research and create beautiful, intuitive interfaces in Figma. Every pixel matters.</p>
              </div>
            </div>

            <div className="flex-1 rounded-2xl p-8 bg-card border border-border relative overflow-hidden group">
              <span className="absolute -top-4 -right-4 text-9xl font-black text-muted/20 group-hover:text-primary/10 transition-colors duration-500">02</span>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Development</h3>
                <p className="text-muted-foreground">Using modern tech stacks, we build scalable, secure, and performant applications with clean architecture.</p>
              </div>
            </div>

            <div className="flex-1 rounded-2xl p-8 bg-card border border-border relative overflow-hidden group">
              <span className="absolute -top-4 -right-4 text-9xl font-black text-muted/20 group-hover:text-primary/10 transition-colors duration-500">03</span>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Deployment</h3>
                <p className="text-muted-foreground">Cloud-native deployment with CI/CD pipelines, monitoring, and continuous optimization for peak performance.</p>
              </div>
            </div>

          </div>
        </section>

        {/* Products Section (Based on Image) */}
        <section className="container mx-auto px-4 md:px-6 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Products</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Engineering Digital Excellence. Building intelligent, beautiful, and scalable products.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* CredoSafe */}
            <a href="#" className="group block p-8 rounded-2xl bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-600">CredoSafe</h3>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
              </div>
              <p className="text-muted-foreground">Complete loan processing & ERP system. Mobile-first platform managing applications, verifications, credit checks, approvals & disbursals.</p>
            </a>

            {/* Briktra */}
            <a href="#" className="group block p-8 rounded-2xl bg-card border border-primary hover:border-primary/80 transition-all duration-300 shadow-lg shadow-primary/5 hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Briktra</h3>
                </div>
                <ArrowRight className="h-6 w-6 text-primary transition-colors transform group-hover:translate-x-1" />
              </div>
              <p className="text-muted-foreground">Construction & Contractor ERP. Field-optimized mobile platform for projects, labour, materials, vendors. Offline-first & multilingual.</p>
            </a>

            {/* Expeniqo */}
            <a href="#" className="group block p-8 rounded-2xl bg-card border border-border hover:border-yellow-500 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <Activity className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-600">Expeniqo</h3>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-yellow-500 transition-colors transform group-hover:translate-x-1" />
              </div>
              <p className="text-muted-foreground">Smart AI-powered expense tracker. Automatically reads SMS, identifies transactions, categorizes spending, and generates insights.</p>
            </a>

            {/* Card Clash Legends Arena */}
            <a href="#" className="group block p-8 rounded-2xl bg-card border border-border hover:border-purple-500 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <Gamepad2 className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-600">Card Clash Legends Arena</h3>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-purple-500 transition-colors transform group-hover:translate-x-1" />
              </div>
              <p className="text-muted-foreground">Competitive PvP collectible card battle game built in Unity. AAA fantasy UI with strategic gameplay and multiplayer modes.</p>
            </a>

          </div>
        </section>

        {/* Stats & Trust */}
        <section className="container mx-auto px-4 md:px-6 mb-24">
          <div className="mx-auto max-w-5xl rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-10 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20">
              <div className="py-4 md:py-0">
                <p className="text-5xl font-black mb-2">100+</p>
                <p className="text-primary-foreground/80 font-medium tracking-wide uppercase">Projects Delivered</p>
              </div>
              <div className="py-4 md:py-0">
                <p className="text-5xl font-black mb-2">50+</p>
                <p className="text-primary-foreground/80 font-medium tracking-wide uppercase">Happy Clients</p>
              </div>
              <div className="py-4 md:py-0">
                <p className="text-5xl font-black mb-2">10+</p>
                <p className="text-primary-foreground/80 font-medium tracking-wide uppercase">Years Experience</p>
              </div>
            </div>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl font-medium leading-relaxed">
                We've built a reputation for delivering exceptional results on time, every time. Our team's expertise spans the entire technology stack, from mobile to cloud to AI.
              </p>
            </div>
          </div>
        </section>

        {/* Contact info */}
        <section className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">Get in Touch with Us</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-lg text-muted-foreground">
            <a href="mailto:support@briktra.com" className="hover:text-primary transition-colors hover:underline">support@briktra.com</a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;

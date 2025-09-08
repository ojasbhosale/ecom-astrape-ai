import Link from "next/link"
import { ShoppingBag, Star, Shield, Zap, Crown, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="relative h-screen overflow-hidden bg-grid ">
      {/* Prominent Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 orb-orange animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 orb-cyan animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] orb-white animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Hero Section - Takes remaining space after navbar */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Premium Badge */}
              <div className="inline-flex items-center space-x-2 glass-strong rounded-full px-6 py-3 glow-white animate-fade-in">
                <Crown className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-bold uppercase tracking-wider">Premium Collections</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              
              {/* Main Headline - Single line, bold impact */}
              <div className="animate-slide-up">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none">
                  <span className="text-gradient-rainbow block">ASTRAPE</span>
                  <span className="text-white/90">LUXURY</span>
                </h1>
              </div>
              
              {/* Subheading */}
              <p className="text-xl sm:text-2xl text-white/80 font-medium max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Exclusive designer collections that redefine 
                <span className="text-gradient-orange font-bold"> premium shopping</span>
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Link href="/products">
                  <button className="btn-primary group min-w-[200px]">
                    <span className="flex items-center justify-center space-x-3">
                      <ShoppingBag className="w-5 h-5" />
                      <span>Shop Collection</span>
                    </span>
                  </button>
                </Link>
                
                <Link href="/signup">
                  <button className="btn-secondary group min-w-[200px]">
                    <span className="flex items-center justify-center space-x-3">
                      <Sparkles className="w-5 h-5" />
                      <span>Get Started</span>
                    </span>
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Right Content - Stats & Features */}
            <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.6s' }}>
              
              {/* Premium Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-strong rounded-3xl p-6 text-center glow-orange">
                  <div className="text-3xl font-black text-gradient-orange">100K+</div>
                  <div className="text-sm text-white/70 font-medium uppercase tracking-wide">Elite Members</div>
                </div>
                <div className="glass-strong rounded-3xl p-6 text-center glow-cyan">
                  <div className="text-3xl font-black text-gradient-cyan">5★</div>
                  <div className="text-sm text-white/70 font-medium uppercase tracking-wide">Rating</div>
                </div>
              </div>
              
              {/* Feature Cards */}
              <div className="space-y-4">
                <div className="glass rounded-2xl p-6 group hover:glass-strong transition-all duration-300 hover:glow-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Authenticated Luxury</h3>
                      <p className="text-white/60 text-sm">100% genuine designer pieces</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass rounded-2xl p-6 group hover:glass-strong transition-all duration-300 hover:glow-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Express Delivery</h3>
                      <p className="text-white/60 text-sm">Same-day luxury service</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Proof */}
              <div className="glass-strong rounded-2xl p-6 text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-white/80 font-medium">&quot;The most exclusive shopping experience&quot;</p>
                <p className="text-white/50 text-sm mt-1">- Forbes Magazine</p>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Bottom Trust Indicators */}
        <div className="pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="glass rounded-2xl p-6">
              <div className="flex justify-between items-center text-center">
                <div className="flex-1">
                  <div className="text-2xl font-black text-gradient-pink">24/7</div>
                  <div className="text-xs text-white/60 font-medium uppercase">Concierge</div>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex-1">
                  <div className="text-2xl font-black text-gradient-purple">48H</div>
                  <div className="text-xs text-white/60 font-medium uppercase">Returns</div>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex-1">
                  <div className="text-2xl font-black text-gradient-cyan">∞</div>
                  <div className="text-xs text-white/60 font-medium uppercase">Warranty</div>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex-1">
                  <div className="text-2xl font-black text-gradient-rainbow">VIP</div>
                  <div className="text-xs text-white/60 font-medium uppercase">Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
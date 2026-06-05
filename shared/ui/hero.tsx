import { ShoppingBag, PlayCircle } from 'lucide-react';
import { Button } from './button';
export default function Hero() {
  return (
    <section className="relative min-h-[600px] bg-cover" style={{ backgroundImage: "url('/food-app.png')" }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-xl">
           <div className="bg-gradient-to-b from-accent-yellow/60 to-accent-orange rounded-3xl p-8 border-4 border-accent-blue shadow-2xl">
            <div className="space-y-6">
              <div className='space-y-2'>
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Hungry?
                </h1>
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  <span className="text-accent-yellow">Order Food</span> You
                  <br/>
                  Love
                </h2>
                <p className="text-xl text-white leading-relaxed pt-2">
                  Discover the best food spots in Baybay and get your favorite meals delivered to your doorstep in minutes.
                </p>
                <div className='pt-10'>
                  <Button className="flex items-center gap-2 bg-accent-orange hover:bg-hover-orange text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg border-2 border-accent-blue">
                    <ShoppingBag className="w-5 h-5" />
                    Order Now
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-5">
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">100+</div>
                    <div className="text-white/80 text-sm">Restaurants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">5K+</div>
                    <div className="text-white/80 text-sm">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">30 min</div>
                    <div className="text-white/80 text-sm">Avg. Delivery</div>
                  </div>
                </div>
              </div>
            </div>
           </div>
           
        </div>
      </div>
    </section>
  );
}

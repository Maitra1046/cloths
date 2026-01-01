import { motion } from 'framer-motion';
// Using brand photo (poster) and video from local `photos` folder
import product6 from '../../../photos/475448481_18490117453055333_8221004949663647852_n.jpg';
import { fadeInLeft, fadeInRight } from '@/lib/animations';

// Video file copied to public/photos so Vite can serve it directly
const promoVideo =
  '/photos/AQNniptYsPFBYInVo0Ak3tyiTIn3zSrEPDHfxzZmSUtMX0sp8EOKY8myFMB-yYPtogPQKoF7_EzpeCMorvl9mcLVAmjJQs1erihge10.mp4';

export const CustomSizingPromo = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            {...fadeInLeft}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={product6}
              className="w-full h-full object-cover"
              aria-label="Custom sizing showcase video"
            >
              <source src={promoVideo} type="video/mp4" />
              {/* Fallback image if video doesn't load */}
              <img
                src={product6}
                alt="Custom sized silk dress"
                className="w-full h-full object-cover"
              />
            </video>
          </motion.div>

          {/* Content */}
          <motion.div
            {...fadeInRight}
            transition={{ ...fadeInRight.transition, delay: 0.2 }}
            className="lg:pl-8"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-taupe mb-4 block">
              Made for You
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground leading-tight mb-6">
              Custom Sizing,
              <br />
              Perfect Fit
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              Every body is unique. Our custom sizing service ensures each piece 
              is crafted to your exact measurements, for a fit that feels like 
              it was made just for you — because it was.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Provide your measurements once, use them forever',
                'Each piece handcrafted to your specifications',
                'Complimentary alterations if needed',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>

            <a
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground text-sm tracking-wider hover:bg-brown/90 transition-all duration-300"
            >
              Explore Custom Fit
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const InstagramGrid: React.FC = () => {
  const { settings } = useSalon();

  const posts = [
    {
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80',
      likes: '1,420',
      comments: '84',
      caption: 'Low taper fade & textured brush back by Master Vance.',
    },
    {
      image: 'https://images.unsplash.com/photo-1517832606589-7929c392f566?auto=format&fit=crop&w=700&q=80',
      likes: '2,150',
      comments: '132',
      caption: 'Straight razor alignment. The cleanest edge in the city.',
    },
    {
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&q=80',
      likes: '980',
      comments: '45',
      caption: 'Precision debulking & matte sea salt spray finish.',
    },
    {
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=700&q=80',
      likes: '3,210',
      comments: '210',
      caption: 'Our private lounge. Single malt scotch & custom leather seats.',
    },
    {
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80',
      likes: '1,890',
      comments: '97',
      caption: 'Skin fade transition. Note the zero-foil gradient blur.',
    },
    {
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
      likes: '1,640',
      comments: '79',
      caption: 'Natural beard growth sculpted with botanical sandalwood balm.',
    },
  ];

  return (
    <section className="py-24 bg-salon-950 relative border-t border-salon-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 text-salon-gold text-xs font-semibold uppercase tracking-[0.25em] mb-2">
              <Instagram className="w-4 h-4 text-salon-gold" />
              <span>Visual Journal</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-salon-beigelight tracking-wide">
              FOLLOW OUR ARCHIVE
            </h2>
          </div>

          <a
            href={`https://instagram.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-salon-gold hover:text-salon-goldlight font-heading uppercase tracking-widest text-xs border border-salon-gold/40 hover:border-salon-gold px-4 py-2.5 rounded transition"
          >
            <span>{settings.instagramHandle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-xl overflow-hidden bg-salon-900 border border-salon-800 cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-salon-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                <div className="flex items-center space-x-3 text-salon-gold text-xs font-bold mb-2">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3.5 h-3.5 fill-salon-gold" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.comments}</span>
                  </span>
                </div>
                <p className="text-[11px] text-salon-beige line-clamp-2 leading-tight">
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

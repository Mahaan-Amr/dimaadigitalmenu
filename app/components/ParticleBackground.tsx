import React, { useEffect, useState } from 'react';
import { MenuCategory } from '../types/menu';

interface ParticleBackgroundProps {
  category?: MenuCategory;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ category }) => {
  console.log("🎬 ParticleBackground component initializing with category:", category);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number, rotation: number}>>([]);

  // Generate particles on mount
  useEffect(() => {
    console.log("🚀 ParticleBackground - useEffect called for initial setup");
    setMounted(true);
    
    // Generate particles
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 15 + 10, // Size between 10-25px
        delay: Math.random() * 10,
        rotation: Math.random() * 360, // Random initial rotation
      });
    }
    setParticles(newParticles);
    console.log("✅ Generated", newParticles.length, "themed particles");
    
    // Add a small delay to ensure the animation is visible
    const timeout = setTimeout(() => {
      console.log("⏱️ Animation visibility timeout fired");
      
      // Force animation visibility with direct DOM manipulation
      const container = document.getElementById('particle-animation-container');
      if (container) {
        console.log("✅ Animation container found, forcing visibility");
        container.style.opacity = '1';
        container.style.zIndex = '5';
      } else {
        console.error("❌ Animation container NOT found in DOM!");
        
        // Log DOM structure for debugging
        console.log("📃 Document body children:", document.body.children);
      }
    }, 500);
    
    return () => {
      console.log("🛑 ParticleBackground unmounting");
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    console.log("🔄 Category changed in ParticleBackground:", category);
  }, [category]);

  // Get themed emoji based on category
  const getCategoryEmoji = () => {
    switch (category) {
      case "coffee-based": return ["☕", "🫖", "🧋"]; 
      case "brewing-bar": return ["☕", "🧃", "🧋"];
      case "smoothies": return ["🥤", "🧃", "🍹"];
      case "milkshakes": return ["🥛", "🧁", "🍦"];
      case "food-and-salad": return ["🥗", "🥙", "🍲"];
      case "panini-and-sandwiches": return ["🥪", "🥖", "🍞"];
      case "breakfast": return ["🍳", "🥐", "🥞"];
      case "cake-desserts": return ["🍰", "🧁", "🍪"];
      case "hot-drinks": return ["☕", "🍵", "🫖"];
      case "herbal-tea": return ["🍵", "🌿", "🫖"];
      case "mocktails": return ["🍹", "🧉", "🍸"];
      default: return ["✨", "⭐", "🌟"];
    }
  };

  // Get color based on category
  const getCategoryColor = () => {
    switch (category) {
      case "coffee-based": return "#FFC887"; // Brighter orange
      case "brewing-bar": return "#FFD700"; // Gold
      case "smoothies": return "#FF8080"; // Brighter red
      case "milkshakes": return "#FFECF4"; // Light pink
      case "food-and-salad": return "#CAFFB9"; // Light green
      case "cake-desserts": return "#FFDDE1"; // Light pink
      case "hot-drinks": return "#FFAE42"; // Orange
      case "mocktails": return "#7DF9FF"; // Bright blue
      default: return "#FFFFFF"; // White
    }
  };

  // Get a random emoji from the category's emoji array
  const getRandomEmoji = () => {
    const emojis = getCategoryEmoji();
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // If component not mounted yet, don't render anything
  if (!mounted) {
    console.log("⏳ ParticleBackground not mounted yet, returning null");
    return null;
  }

  console.log("🎨 Rendering ParticleBackground with", particles.length, "themed particles");

  return (
    <div 
      id="particle-animation-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Actual themed elements */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="themed-particle"
          style={{
            position: 'absolute',
            fontSize: `${particle.size}px`,
            top: `${particle.y}%`,
            left: `${particle.x}%`,
            textShadow: `0 0 5px ${getCategoryColor()}`,
            animation: `float ${5 + particle.delay}s ease-in-out infinite, rotate ${8 + particle.delay}s linear infinite`,
            opacity: 0.7,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        >
          {getRandomEmoji()}
        </div>
      ))}

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) scale(1);
          }
          25% {
            transform: translateY(-15px) translateX(5px) scale(1.05);
          }
          50% {
            transform: translateY(-30px) translateX(15px) scale(1.1);
          }
          75% {
            transform: translateY(-15px) translateX(5px) scale(1.05);
          }
          100% {
            transform: translateY(0) translateX(0) scale(1);
          }
        }
        
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .themed-particle {
          user-select: none;
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default ParticleBackground; 
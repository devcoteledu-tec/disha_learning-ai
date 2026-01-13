
import React, { useEffect, useRef } from 'react';

const StarBackground: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById('star-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const starCount = 120; // Increased count for better density
    const mouse = { x: -1000, y: -1000 };

    class Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      glowColor: string;
      opacity: number;

      constructor() {
        this.reset();
        // Give some initial random position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1.5; // Slightly larger
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.5 + 0.3;
        // Brighter, more vibrant blues for a white background
        const blueShades = [
          'rgba(59, 130, 246,', 
          'rgba(37, 99, 235,', 
          'rgba(96, 165, 250,',
          'rgba(147, 197, 253,'
        ];
        this.color = blueShades[Math.floor(Math.random() * blueShades.length)];
        this.glowColor = 'rgba(59, 130, 246, 0.3)';
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${this.opacity})`;
        
        // Soft glow for each star
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.glowColor;
        
        ctx.fill();
        ctx.restore();
      }

      update() {
        // Continuous drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.y > canvas.height + 10) this.y = -10;
        if (this.y < -10) this.y = canvas.height + 10;

        // Mouse interaction (Repulsion)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const directionX = dx / distance;
          const directionY = dy / distance;
          
          // Smoothly move away from cursor
          this.x -= directionX * force * 4;
          this.y -= directionY * force * 4;
          
          // Brighten up when near mouse
          this.opacity = Math.min(1, this.opacity + 0.05);
        } else {
            // Fade back to normal opacity
            if (this.opacity > 0.4) this.opacity -= 0.01;
        }
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null;
};

export default StarBackground;

import { useRef, useEffect, useCallback } from 'react';

export default function FloatingParticles({ decibel = 0, isListening = false }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((width, height) => {
    const particles = [];
    const count = Math.min(60, Math.floor((width * height) / 20000));
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.5,
        baseRadius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        hue: 180 + Math.random() * 20, // Cyan range
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particlesRef.current = initParticles(width, height);
    };

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const soundBoost = isListening ? Math.min(decibel / 120, 1) : 0;
      
      particlesRef.current.forEach((p, i) => {
        // Sound reactivity
        const speedMultiplier = 1 + soundBoost * 2;
        p.radius = p.baseRadius + soundBoost * 3;
        
        // Move
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;
        
        // Add slight drift toward mouse
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += (dx / dist) * 0.01;
          p.vy += (dy / dist) * 0.01;
        }
        
        // Dampen velocity
        p.vx *= 0.999;
        p.vy *= 0.999;
        
        // Wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        
        // Draw particle
        const alpha = p.opacity + soundBoost * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
        ctx.fill();
        
        // Draw glow
        if (p.radius > 1.5 || soundBoost > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
          gradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${alpha * 0.3})`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
        
        // Draw connections
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const connDist = Math.sqrt((p.x - other.x) ** 2 + (p.y - other.y) ** 2);
          const maxDist = 100 + soundBoost * 50;
          
          if (connDist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${(1 - connDist / maxDist) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [decibel, isListening, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "../../lib/utils.js";

const SparklesCore = (props) => {
  const {
    background = "transparent",
    minSize,
    maxSize,
    speed = "fast",
    particleDensity = 1200,
    className,
    particleColor = "#FFFFFF",
  } = props;

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const noise = createNoise3D();
  const particleCount = Math.floor(particleDensity * 0.1);
  const particles = useRef([]);
  const animationFrameRef = useRef();

  const initializeParticles = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    particles.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        noiseOffset: Math.random() * 1000,
      });
    }
  }, [particleCount, minSize, maxSize]);

  const updateParticles = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    particles.current.forEach((particle) => {
      // Update noise offset
      particle.noiseOffset += 0.01;
      
      // Apply noise-based movement
      const noiseX = noise(particle.noiseOffset, 0, 0) * 0.5;
      const noiseY = noise(0, particle.noiseOffset, 0) * 0.5;
      
      // Update position
      particle.x += particle.speedX + noiseX;
      particle.y += particle.speedY + noiseY;
      
      // Boundary checks
      if (particle.x > width) particle.x = 0;
      if (particle.x < 0) particle.x = width;
      if (particle.y > height) particle.y = 0;
      if (particle.y < 0) particle.y = height;
    });
  }, [noise]);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    
    const ctx = canvas.getContext("2d");
    const container = containerRef.current;
    
    // Set canvas size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw particles
    particles.current.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    });
  }, [particleColor]);

  const animate = useCallback(() => {
    updateParticles();
    drawParticles();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  useEffect(() => {
    initializeParticles();
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeParticles, animate]);

  useEffect(() => {
    const handleResize = () => {
      initializeParticles();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initializeParticles]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 w-full h-full", className)}
      style={{ background }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export { SparklesCore };
export default SparklesCore;
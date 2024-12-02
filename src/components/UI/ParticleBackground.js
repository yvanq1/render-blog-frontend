import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let startTime = Date.now();
    const ANIMATION_DURATION = 15000; // 增加到15秒

    // 设置画布尺寸
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 初始化设置
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 获取文字像素点
    const getTextPixels = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      const text = 'AIGC';
      const maxWidth = canvas.width * 0.9;
      let fontSize = Math.min(canvas.width / 2, 800);
      
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      
      // 调整字体大小
      do {
        // 使用Chakra Petch作为主字体
        tempCtx.font = `900 ${fontSize}px "Chakra Petch", "Play", "Rajdhani", "Share Tech Mono", sans-serif`;
        if (tempCtx.measureText(text).width <= maxWidth) break;
        fontSize -= 10;
      } while (fontSize > 100);
      
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // 增强发光效果
      tempCtx.shadowColor = 'rgba(0, 255, 255, 0.75)';
      tempCtx.shadowBlur = 35;
      tempCtx.lineWidth = 6;
      
      // 多次绘制文字增加发光强度和立体感
      for (let i = 0; i < 4; i++) {
        tempCtx.fillStyle = `rgba(255, 255, 255, ${0.25 + i * 0.15})`;
        tempCtx.font = `900 ${fontSize}px "Chakra Petch", "Play", "Rajdhani", "Share Tech Mono", sans-serif`;
        // 添加轻微偏移制造立体感
        tempCtx.fillText(text, tempCanvas.width / 2 + i * 1.2, tempCanvas.height / 3 + i * 1.2);
      }
      
      // 最终绘制实心文字
      tempCtx.shadowBlur = 25;
      tempCtx.fillStyle = 'white';
      tempCtx.strokeStyle = 'rgba(0, 255, 255, 0.95)';
      tempCtx.lineWidth = 3;
      tempCtx.strokeText(text, tempCanvas.width / 2, tempCanvas.height / 3);
      tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 3);
      
      return tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
    };

    // 初始化粒子
    const init = () => {
      particles = [];
      const pixels = getTextPixels();
      const gap = 16; // 减小间隔
      const maxParticles = 2000; // 增加最大粒子数
      
      // 收集所有可能的粒子位置
      const possiblePositions = [];
      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          const index = (y * canvas.width + x) * 4;
          if (pixels[index] > 128) {
            const brightness = pixels[index];
            const isCore = brightness > 200;
            // 增加核心区域权重，确保核心区域有更多粒子
            const weight = isCore ? 5 : (brightness > 160 ? 3 : 1);
            for (let i = 0; i < weight; i++) {
              possiblePositions.push({ x, y, brightness });
            }
          }
        }
      }
      
      // 随机选择位置生成粒子
      const selectedPositions = possiblePositions
        .sort(() => Math.random() - 0.5)
        .slice(0, maxParticles);
      
      selectedPositions.forEach(pos => {
        particles.push(new Particle(pos.x, pos.y));
      });
      
      startTime = Date.now();
    };

    // 粒子类
    class Particle {
      constructor(x, y) {
        this.originX = x;
        this.originY = y;
        this.resetPosition();
        this.size = Math.random() * 1.5 + 1; // 稍微减小粒子大小以适应更多粒子
        this.opacity = Math.random() * 0.3 + 0.3; // 降低基础不透明度
        
        // 根据位置调整颜色
        const distanceToCenter = Math.abs(this.originX - canvas.width/2) + Math.abs(this.originY - canvas.height/3);
        const maxDistance = Math.max(canvas.width/2, canvas.height/3);
        const colorIntensity = 1 - (distanceToCenter / maxDistance);
        
        // 调整颜色亮度
        const colors = colorIntensity > 0.7 ? [
          `hsla(176, 100%, 70%, ${this.opacity * 1.3})`, // 增加核心区域亮度
          `hsla(140, 100%, 70%, ${this.opacity * 1.3})`,
          `hsla(220, 100%, 75%, ${this.opacity * 1.3})`,
        ] : [
          `hsla(176, 100%, 60%, ${this.opacity})`,
          `hsla(140, 100%, 50%, ${this.opacity})`,
          `hsla(220, 100%, 65%, ${this.opacity})`,
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.startTime = Date.now() + Math.random() * 3000; // 减少初始延迟
      }

      resetPosition() {
        const edge = Math.floor(Math.random() * 4);
        switch(edge) {
          case 0: // 上边
            this.x = Math.random() * canvas.width;
            this.y = -20;
            break;
          case 1: // 右边
            this.x = canvas.width + 20;
            this.y = Math.random() * canvas.height;
            break;
          case 2: // 下边
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            break;
          case 3: // 左边
            this.x = -20;
            this.y = Math.random() * canvas.height;
            break;
        }
      }

      easeInOutQuint(t) {
        return t < 0.5 
          ? 16 * t * t * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 5) / 2;
      }

      update() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTime;
        
        if (elapsedTime >= ANIMATION_DURATION) {
          this.resetPosition();
          this.startTime = currentTime + Math.random() * 5000; // 随机延迟重置
          return;
        }

        if (elapsedTime < 0) return; // 等待开始时间

        const progress = elapsedTime / ANIMATION_DURATION;
        const easeProgress = this.easeInOutQuint(progress); // 使用更强的缓动函数

        this.x = this.x + (this.originX - this.x) * easeProgress;
        this.y = this.y + (this.originY - this.y) * easeProgress;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // 动画循环
    const animate = () => {
      ctx.fillStyle = 'rgba(8, 8, 12, 0.1)'; // 更深的背景色
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // 更新渐变背景
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 24, 55, 0.1)');    // 深蓝色
      gradient.addColorStop(0.5, 'rgba(0, 42, 50, 0.1)');  // 深青色
      gradient.addColorStop(1, 'rgba(0, 32, 42, 0.1)');    // 深青蓝色
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: '#080810' }} // 更深的背景色
    />
  );
};

export default ParticleBackground;

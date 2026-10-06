// Canvas starfield you fly through. Stars drift slowly toward the viewer at
// rest; jump() fires a hyperspace burst where they stretch into streaks and
// rush past, then ease back to a drift. A negative direction flies backwards.

type Star = { x: number; y: number; z: number; b: number; violet: boolean };

const IDLE_SPEED = 0.09; // depth units per second: a steady cruise
const JUMP_SPEED = 2.6;
export const JUMP_MS = 1100;
const NEAR = 0.04;

export class Starfield {
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf = 0;
  private last = 0;
  private running = false;
  private jumpStart = -Infinity;
  private dir = 1;
  speed = IDLE_SPEED;
  onFrame?: (speed: number) => void;

  constructor(
    private canvas: HTMLCanvasElement,
    private reduced = false,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.resize();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth * this.dpr;
    this.h = this.canvas.clientHeight * this.dpr;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    const count = Math.round(Math.min(1400, (this.w * this.h) / (this.dpr * this.dpr * 1100)));
    this.stars = Array.from({ length: count }, () => this.spawn(Math.random()));
    if (!this.running) this.draw(0);
  }

  private spawn(z: number): Star {
    return {
      x: (Math.random() * 2 - 1) * 1.4,
      y: (Math.random() * 2 - 1) * 1.4,
      z: Math.max(NEAR, z),
      b: 0.35 + Math.random() * 0.65,
      violet: Math.random() < 0.12,
    };
  }

  jump(direction: 1 | -1) {
    if (this.reduced) return;
    this.dir = direction;
    this.jumpStart = performance.now();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.step(now, dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private step(now: number, dt: number) {
    // Jump profile: fast ramp up, hold, long ease out.
    const t = (now - this.jumpStart) / JUMP_MS;
    let boost = 0;
    if (t >= 0 && t < 1) {
      boost = t < 0.25 ? Math.pow(t / 0.25, 2) : Math.pow(1 - (t - 0.25) / 0.75, 2.2);
    }
    const idle = this.reduced ? 0 : IDLE_SPEED;
    this.speed = idle + boost * JUMP_SPEED * this.dir;
    const dz = this.speed * dt;

    for (const s of this.stars) {
      s.z -= dz;
      if (s.z <= NEAR) Object.assign(s, this.spawn(1));
      else if (s.z > 1) Object.assign(s, this.spawn(NEAR + Math.random() * 0.3));
    }
    this.draw(Math.abs(this.speed));
    this.onFrame?.(this.speed);
  }

  private draw(speed: number) {
    const { ctx, w, h } = this;
    const cx = w / 2;
    const cy = h / 2;
    const f = Math.max(w, h) * 0.5;
    ctx.clearRect(0, 0, w, h);
    // How far back along its path each streak's tail sits.
    const trail = Math.min(0.5, speed * 0.09);
    ctx.lineCap = "round";
    for (const s of this.stars) {
      const sx = cx + (s.x / s.z) * f;
      const sy = cy + (s.y / s.z) * f;
      if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue;
      const depth = 1 - s.z;
      const alpha = Math.min(1, s.b * (0.25 + depth * 1.1));
      const size = (0.4 + depth * 1.8) * this.dpr;
      const color = s.violet ? `rgba(180,168,255,${alpha})` : `rgba(242,243,247,${alpha})`;
      if (trail > 0.01) {
        const tz = Math.min(1, Math.max(NEAR / 2, s.z + trail * this.dirSign()));
        const tx = cx + (s.x / tz) * f;
        const ty = cy + (s.y / tz) * f;
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private dirSign() {
    return this.speed >= 0 ? 1 : -1;
  }
}

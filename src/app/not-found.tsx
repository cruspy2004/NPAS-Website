import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="label text-accent">404&nbsp;&nbsp;/&nbsp;&nbsp;Signal lost</p>
        <h1 className="mt-5 font-display text-5xl font-bold tracking-tight sm:text-7xl">
          Lost in space.
        </h1>
        <p className="mt-5 text-muted">This page drifted out of orbit.</p>
        <div className="mt-8">
          <Button href="/">Back to base</Button>
        </div>
      </div>
    </main>
  );
}

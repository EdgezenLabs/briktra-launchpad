import { useEffect, useState } from "react";

const launchDate = new Date("2026-04-01T00:00:00"); // change launch date

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(
    launchDate.getTime() - new Date().getTime()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(launchDate.getTime() - new Date().getTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const Box = ({ value, label }: { value: number; label: string }) => (
    <div className="relative rounded-3xl border border-primary/40 bg-background/70 px-8 py-7 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* soft glow */}
      <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-xl opacity-40"></div>

      <div className="relative text-center">
        <p className="text-6xl font-bold text-primary tracking-tight">
          {value}
        </p>
        <p className="mt-2 text-sm font-semibold tracking-widest text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );

  return (
  <div className="mt-14 text-center">
    <p className="mb-6 text-sm font-semibold tracking-[0.25em] text-primary">
      APP LAUNCH COUNTDOWN
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      <Box value={days} label="DAYS" />
      <Box value={hours} label="HOURS" />
      <Box value={minutes} label="MINUTES" />
      <Box value={seconds} label="SECONDS" />
    </div>
  </div>
);

}

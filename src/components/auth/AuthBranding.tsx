import { Trophy, Target, Heart, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthBranding() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#090e1a] p-12 text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">GolfCharity</span>
        </Link>

        <div className="mt-24 max-w-md">
          <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-6">
            Play.<br />
            Win.<br />
            <span className="text-emerald-400">Give.</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium leading-relaxed">
            The premium platform where your passion for golf fuels charitable impact and enters you into life-changing prize draws.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4">
        {[
          { icon: Trophy, text: "Monthly prize draws", color: "text-emerald-400" },
          { icon: Target, text: "Track your scores", color: "text-blue-400" },
          { icon: Heart, text: "Support a charity", color: "text-rose-400" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 w-fit">
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-sm font-bold tracking-tight">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

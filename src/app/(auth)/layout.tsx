import AuthBranding from '@/components/auth/AuthBranding';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#070b14]">
      {/* Brand Panel */}
      <AuthBranding />

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        {/* Background blobs for mobile/form side */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 w-full">
            {children}
        </div>
      </div>
    </div>
  );
}

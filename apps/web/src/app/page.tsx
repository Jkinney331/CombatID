import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2563EB]">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">CombatID</span>
        </div>
        <h1 className="text-white text-3xl font-bold mb-2">CombatID</h1>
        <p className="text-white/80 text-lg">
          The Global Fighter Identity & Health Network
        </p>
      </div>

      {/* Portal Selection */}
      <div className="grid gap-4 w-full max-w-md px-6">
        <Link
          href="/fighter"
          className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-8 py-4 rounded-xl text-center font-semibold text-lg hover:from-[#dc2626] hover:to-[#b91c1c] transition-all shadow-lg"
        >
          Fighter Portal
        </Link>
        <Link
          href="/commission"
          className="bg-white text-[#2563EB] px-8 py-4 rounded-xl text-center font-semibold text-lg hover:bg-white/90 transition-colors"
        >
          Commission Portal
        </Link>
        <Link
          href="/promotion"
          className="bg-white/10 text-white border-2 border-white px-8 py-4 rounded-xl text-center font-semibold text-lg hover:bg-white/20 transition-colors"
        >
          Promotion Portal
        </Link>
        <Link
          href="/gym"
          className="bg-white/10 text-white border-2 border-white px-8 py-4 rounded-xl text-center font-semibold text-lg hover:bg-white/20 transition-colors"
        >
          Gym Portal
        </Link>
      </div>

      {/* Footer */}
      <p className="text-white/60 text-sm mt-12">
        Also available on iOS and Android
      </p>
    </div>
  );
}

import { IncentiveCalculator } from "@/components/incentive-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">New Construction Incentive Calculator</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Show your clients how builder incentives can significantly reduce their costs when purchasing a new
            construction home.
          </p>
        </div>
        <IncentiveCalculator />
      </div>
    </main>
  )
}

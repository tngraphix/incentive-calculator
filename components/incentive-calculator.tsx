"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Home, Building, Building2, Hotel, DollarSign, Percent, TrendingDown, ArrowRight } from "lucide-react"
import { ComparisonResults } from "@/components/comparison-results"

// Form schema validation
const formSchema = z.object({
  homePrice: z.coerce.number().min(50000, "Home price must be at least $50,000"),
  homeType: z.string().min(1, "Please select a home type"),
  hoaFee: z.coerce.number().min(0, "HOA fee cannot be negative"),
  cddFee: z.coerce.number().min(0, "CDD fee cannot be negative"),
  interestRate: z.coerce
    .number()
    .min(1, "Interest rate must be at least 1%")
    .max(15, "Interest rate must be less than 15%"),
  loanTerm: z.coerce
    .number()
    .min(5, "Loan term must be at least 5 years")
    .max(30, "Loan term must be 30 years or less"),
  downPaymentPercent: z.coerce
    .number()
    .min(0, "Down payment cannot be negative")
    .max(100, "Down payment cannot exceed 100%"),
  includeTax: z.boolean().default(true),
  taxRate: z.coerce.number().min(0, "Tax rate cannot be negative").max(10, "Tax rate is too high").default(1.2),
  useFlexCash: z.boolean().default(false),
  flexCashAmount: z.coerce.number().min(0, "Flex cash amount cannot be negative").optional(),
  flexCashOption: z.enum(["price_reduction", "rate_buydown"]).default("price_reduction"),
  useRateBuyDown: z.boolean().default(false),
  rateBuyDownAmount: z.coerce
    .number()
    .min(0.1, "Rate buy down must be at least 0.1%")
    .max(5, "Rate buy down cannot exceed 5%")
    .optional(),
  builderPaysHoa: z.boolean().default(false),
  hoaPaymentYears: z.coerce.number().min(1, "Must be at least 1 year").max(10, "Cannot exceed 10 years").default(1),
  otherIncentives: z.boolean().default(false),
  otherIncentivesAmount: z.coerce.number().min(0, "Amount cannot be negative").optional(),
})

type HomeType = {
  value: string
  label: string
  icon: React.ReactNode
}

const homeTypes: HomeType[] = [
  { value: "single-family", label: "Single Family", icon: <Home className="mr-2 h-4 w-4" /> },
  { value: "villa", label: "Villa", icon: <Building className="mr-2 h-4 w-4" /> },
  { value: "townhome", label: "Townhome", icon: <Building2 className="mr-2 h-4 w-4" /> },
  { value: "condo", label: "Condo", icon: <Hotel className="mr-2 h-4 w-4" /> },
]

export function IncentiveCalculator() {
  const [calculationResults, setCalculationResults] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homePrice: 350000,
      homeType: "single-family",
      hoaFee: 150,
      cddFee: 50,
      interestRate: 6.5,
      loanTerm: 30,
      downPaymentPercent: 20,
      includeTax: true,
      taxRate: 1.2,
      useFlexCash: false,
      flexCashAmount: 10000,
      flexCashOption: "price_reduction",
      useRateBuyDown: false,
      rateBuyDownAmount: 1.0,
      builderPaysHoa: false,
      hoaPaymentYears: 1,
      otherIncentives: false,
      otherIncentivesAmount: 5000,
    },
  })

  const watchUseFlexCash = form.watch("useFlexCash")
  const watchUseRateBuyDown = form.watch("useRateBuyDown")
  const watchHomePrice = form.watch("homePrice")
  const watchDownPaymentPercent = form.watch("downPaymentPercent")
  const watchFlexCashOption = form.watch("flexCashOption")
  const watchIncludeTax = form.watch("includeTax")
  const watchBuilderPaysHoa = form.watch("builderPaysHoa")
  const watchOtherIncentives = form.watch("otherIncentives")

  function calculateMortgage(principal: number, interestRate: number, termYears: number): number {
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = termYears * 12

    if (monthlyRate === 0) return principal / numberOfPayments

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    return monthlyPayment
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Calculate down payment and loan amount
    const downPaymentAmount = (values.homePrice * values.downPaymentPercent) / 100
    const loanAmount = values.homePrice - downPaymentAmount

    // Calculate monthly property tax if included
    const monthlyTax = values.includeTax ? (values.homePrice * values.taxRate) / 100 / 12 : 0

    // Calculate monthly payment without incentives
    const baseMonthlyPayment = calculateMortgage(loanAmount, values.interestRate, values.loanTerm)

    // Calculate total monthly payment without incentives
    const baseTotalMonthly = baseMonthlyPayment + values.hoaFee + values.cddFee + monthlyTax

    // Calculate with incentives
    let incentiveLoanAmount = loanAmount
    let incentiveInterestRate = values.interestRate
    let flexCashUsed = 0
    let priceReduction = 0
    let hoaYearsCovered = 0
    let hoaSavings = 0
    let otherIncentiveAmount = 0

    if (values.useFlexCash && values.flexCashAmount) {
      flexCashUsed = values.flexCashAmount

      if (values.flexCashOption === "price_reduction") {
        // Apply flex cash to reduce home price/loan amount
        priceReduction = flexCashUsed
        incentiveLoanAmount = loanAmount - priceReduction
      }
    }

    if (values.useRateBuyDown && values.rateBuyDownAmount) {
      // Apply interest rate buy down
      incentiveInterestRate = values.interestRate - values.rateBuyDownAmount

      // If flex cash is used for rate buydown, don't reduce the loan amount
      if (values.useFlexCash && values.flexCashOption === "rate_buydown") {
        incentiveLoanAmount = loanAmount
      }
    }

    // Calculate builder paying HOA for X years
    if (values.builderPaysHoa && values.hoaPaymentYears > 0) {
      hoaYearsCovered = values.hoaPaymentYears
      hoaSavings = values.hoaFee * 12 * hoaYearsCovered
    }

    // Add other incentives
    if (values.otherIncentives && values.otherIncentivesAmount) {
      otherIncentiveAmount = values.otherIncentivesAmount
      // Apply other incentives to loan amount
      incentiveLoanAmount -= otherIncentiveAmount
    }

    // Calculate monthly tax for incentive scenario (may be different if price is reduced)
    const incentiveMonthlyTax = values.includeTax
      ? ((values.homePrice - priceReduction) * values.taxRate) / 100 / 12
      : 0

    // Calculate monthly payment with incentives
    const incentiveMonthlyPayment = calculateMortgage(incentiveLoanAmount, incentiveInterestRate, values.loanTerm)

    // Calculate effective monthly HOA fee (considering builder paying for X years)
    const effectiveMonthlyHoa = values.builderPaysHoa
      ? 0 // During the covered period, HOA is $0
      : values.hoaFee

    // Calculate total monthly payment with incentives
    const incentiveTotalMonthly = incentiveMonthlyPayment + effectiveMonthlyHoa + values.cddFee + incentiveMonthlyTax

    // Calculate savings
    const monthlySavings = baseTotalMonthly - incentiveTotalMonthly
    const yearlySavings = monthlySavings * 12
    const lifetimeSavings = monthlySavings * values.loanTerm * 12 + hoaSavings

    // Set results
    setCalculationResults({
      withoutIncentives: {
        homePrice: values.homePrice,
        downPayment: downPaymentAmount,
        loanAmount,
        interestRate: values.interestRate,
        monthlyPayment: baseMonthlyPayment,
        monthlyTax,
        totalMonthly: baseTotalMonthly,
      },
      withIncentives: {
        homePrice: values.homePrice - priceReduction,
        downPayment: downPaymentAmount,
        loanAmount: incentiveLoanAmount,
        interestRate: incentiveInterestRate,
        monthlyPayment: incentiveMonthlyPayment,
        monthlyTax: incentiveMonthlyTax,
        totalMonthly: incentiveTotalMonthly,
        flexCashUsed,
        flexCashOption: values.flexCashOption,
        priceReduction,
        rateBuyDown: values.useRateBuyDown ? values.rateBuyDownAmount : 0,
        hoaYearsCovered,
        hoaSavings,
        otherIncentiveAmount,
      },
      savings: {
        monthly: monthlySavings,
        yearly: yearlySavings,
        lifetime: lifetimeSavings,
      },
      inputs: values,
    })
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Home Details & Incentives</CardTitle>
          <CardDescription>Enter the property details and available builder incentives</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="home-details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="home-details">Home Details</TabsTrigger>
                  <TabsTrigger value="incentives">Incentives</TabsTrigger>
                </TabsList>

                <TabsContent value="home-details" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="homePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input type="number" placeholder="350000" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="homeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select home type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {homeTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center">
                                  {type.icon}
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hoaFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HOA Fee (Monthly)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                              <Input type="number" placeholder="150" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cddFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CDD/Other Costs (Monthly)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                              <Input type="number" placeholder="50" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Interest Rate (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input type="number" step="0.125" placeholder="6.5" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loanTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Term (Years)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select term" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 Years</SelectItem>
                              <SelectItem value="20">20 Years</SelectItem>
                              <SelectItem value="30">30 Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="downPaymentPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Down Payment ({field.value}%)</FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={30}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-right">
                            ${((watchHomePrice * watchDownPaymentPercent) / 100).toLocaleString()}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="includeTax"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Include Property Tax</FormLabel>
                          <FormDescription>Include estimated property taxes in the calculation</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchIncludeTax && (
                    <FormField
                      control={form.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Tax Rate (% of home value annually)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                              <Input type="number" step="0.1" placeholder="1.2" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Typical range: 0.5% - 2.5% depending on location</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </TabsContent>

                <TabsContent value="incentives" className="space-y-6 pt-4">
                  <FormField
                    control={form.control}
                    name="useFlexCash"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Flex Cash</FormLabel>
                          <FormDescription>
                            Builder offers cash that can be applied to closing costs or down payment
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchUseFlexCash && (
                    <>
                      <FormField
                        control={form.control}
                        name="flexCashAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Flex Cash Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                <Input type="number" placeholder="10000" className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="flexCashOption"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How to Apply Flex Cash</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="price_reduction">Reduce Home Price</SelectItem>
                                <SelectItem value="rate_buydown">Buy Down Interest Rate</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Choose how the builder's flex cash will be applied</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="useRateBuyDown"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Interest Rate Buy Down</FormLabel>
                          <FormDescription>Builder pays to reduce the interest rate</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchUseRateBuyDown && (
                    <FormField
                      control={form.control}
                      name="rateBuyDownAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate Reduction (%)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <TrendingDown className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                              <Input type="number" step="0.125" placeholder="1.0" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="builderPaysHoa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Builder Pays HOA</FormLabel>
                          <FormDescription>Builder covers HOA fees for a specified period</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchBuilderPaysHoa && (
                    <FormField
                      control={form.control}
                      name="hoaPaymentYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HOA Covered (Years)</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number.parseInt(value))}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select years" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 Year</SelectItem>
                              <SelectItem value="2">2 Years</SelectItem>
                              <SelectItem value="3">3 Years</SelectItem>
                              <SelectItem value="5">5 Years</SelectItem>
                              <SelectItem value="10">10 Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="otherIncentives"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Other Monetary Incentives</FormLabel>
                          <FormDescription>
                            Additional builder incentives (closing costs, upgrades, etc.)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchOtherIncentives && (
                    <FormField
                      control={form.control}
                      name="otherIncentivesAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other Incentives Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                              <Input type="number" placeholder="5000" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </TabsContent>
              </Tabs>

              <Button type="submit" className="w-full">
                Calculate Savings <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ComparisonResults results={calculationResults} />
    </div>
  )
}

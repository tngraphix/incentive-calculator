"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowDown, DollarSign, TrendingDown, Calendar, Calculator } from "lucide-react"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ComparisonResultsProps {
  results: any
}

export function ComparisonResults({ results }: ComparisonResultsProps) {
  const [showMathBreakdown, setShowMathBreakdown] = useState(false)

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparison Results</CardTitle>
          <CardDescription>Enter home details and incentives to see the comparison</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center text-slate-500">
          <ArrowDown className="h-12 w-12 mb-4 text-slate-300" />
          <p>Fill out the form and click Calculate to see your results</p>
        </CardContent>
      </Card>
    )
  }

  const { withoutIncentives, withIncentives, savings, inputs } = results

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyWithCents = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return value.toFixed(3) + "%"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Results</CardTitle>
        <CardDescription>See how builder incentives impact your client's costs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Without Incentives</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Original Price:</span>
                <span className="font-medium">{formatCurrency(withoutIncentives.homePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Down Payment ({inputs.downPaymentPercent}%):</span>
                <span className="font-medium">{formatCurrency(withoutIncentives.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Loan Amount:</span>
                <span className="font-medium">{formatCurrency(withoutIncentives.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Interest Rate:</span>
                <span className="font-medium">{formatPercent(withoutIncentives.interestRate)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Payment:</span>
                <span className="font-medium">{formatCurrencyWithCents(withoutIncentives.monthlyPayment)}</span>
              </div>
              {inputs.includeTax && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Property Tax:</span>
                  <span className="font-medium">{formatCurrencyWithCents(withoutIncentives.monthlyTax)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">HOA Fee:</span>
                <span className="font-medium">{formatCurrencyWithCents(inputs.hoaFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">CDD/Other Costs:</span>
                <span className="font-medium">{formatCurrencyWithCents(inputs.cddFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Total Monthly:</span>
                <span className="font-semibold">{formatCurrencyWithCents(withoutIncentives.totalMonthly)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">With Incentives</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Savings Applied
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Price After Incentives:</span>
                <span className="font-medium">{formatCurrency(withIncentives.homePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Down Payment ({inputs.downPaymentPercent}%):</span>
                <span className="font-medium">{formatCurrency(withIncentives.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Loan Amount:</span>
                <span className="font-medium">{formatCurrency(withIncentives.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Interest Rate:</span>
                <span className="font-medium">{formatPercent(withIncentives.interestRate)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Payment:</span>
                <span className="font-medium">{formatCurrencyWithCents(withIncentives.monthlyPayment)}</span>
              </div>
              {inputs.includeTax && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Property Tax:</span>
                  <span className="font-medium">{formatCurrencyWithCents(withIncentives.monthlyTax)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">HOA Fee:</span>
                <span className="font-medium">
                  {withIncentives.hoaYearsCovered > 0
                    ? `$0 (covered for ${withIncentives.hoaYearsCovered} years)`
                    : formatCurrencyWithCents(inputs.hoaFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">CDD/Other Costs:</span>
                <span className="font-medium">{formatCurrencyWithCents(inputs.cddFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Total Monthly:</span>
                <span className="font-semibold text-green-700">
                  {formatCurrencyWithCents(withIncentives.totalMonthly)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Client Savings Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-700">Monthly</span>
              </div>
              <div className="text-xl font-bold text-green-700">{formatCurrencyWithCents(savings.monthly)}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-700">Yearly</span>
              </div>
              <div className="text-xl font-bold text-green-700">{formatCurrency(savings.yearly)}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-700">Lifetime</span>
              </div>
              <div className="text-xl font-bold text-green-700">{formatCurrency(savings.lifetime)}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Applied Incentives</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incentive Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withIncentives.priceReduction > 0 && (
                <TableRow>
                  <TableCell className="font-medium">Price Reduction</TableCell>
                  <TableCell>{formatCurrency(withIncentives.priceReduction)}</TableCell>
                  <TableCell>Reduced home price and loan amount</TableCell>
                </TableRow>
              )}
              {withIncentives.rateBuyDown > 0 && (
                <TableRow>
                  <TableCell className="font-medium">Rate Buy Down</TableCell>
                  <TableCell>{withIncentives.rateBuyDown.toFixed(3)}%</TableCell>
                  <TableCell>
                    {withIncentives.flexCashOption === "rate_buydown" && withIncentives.flexCashUsed > 0
                      ? `Lower interest rate (using ${formatCurrency(withIncentives.flexCashUsed)} flex cash)`
                      : "Lower interest rate"}
                  </TableCell>
                </TableRow>
              )}
              {withIncentives.hoaYearsCovered > 0 && (
                <TableRow>
                  <TableCell className="font-medium">HOA Coverage</TableCell>
                  <TableCell>{withIncentives.hoaYearsCovered} years</TableCell>
                  <TableCell>
                    Builder pays HOA fees ({formatCurrency(withIncentives.hoaSavings)} total savings)
                  </TableCell>
                </TableRow>
              )}
              {withIncentives.otherIncentiveAmount > 0 && (
                <TableRow>
                  <TableCell className="font-medium">Other Incentives</TableCell>
                  <TableCell>{formatCurrency(withIncentives.otherIncentiveAmount)}</TableCell>
                  <TableCell>Additional savings applied to loan amount</TableCell>
                </TableRow>
              )}
              {withIncentives.priceReduction === 0 &&
                withIncentives.rateBuyDown === 0 &&
                withIncentives.hoaYearsCovered === 0 &&
                withIncentives.otherIncentiveAmount === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-500">
                      No incentives applied
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>

        <Accordion type="single" collapsible className="border rounded-md">
          <AccordionItem value="math-breakdown">
            <AccordionTrigger className="px-4 py-2 hover:bg-slate-50">
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                <span>Detailed Math Breakdown</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2 bg-slate-50">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-md mb-2">Without Incentives Calculation</h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">Step 1: Calculate Down Payment</p>
                    <div className="bg-white p-3 rounded border">
                      <p>Home Price × Down Payment Percentage = Down Payment Amount</p>
                      <p className="mt-1 text-slate-600">
                        {formatCurrency(withoutIncentives.homePrice)} × {inputs.downPaymentPercent}% ={" "}
                        {formatCurrency(withoutIncentives.downPayment)}
                      </p>
                    </div>

                    <p className="font-medium">Step 2: Calculate Loan Amount</p>
                    <div className="bg-white p-3 rounded border">
                      <p>Home Price - Down Payment = Loan Amount</p>
                      <p className="mt-1 text-slate-600">
                        {formatCurrency(withoutIncentives.homePrice)} - {formatCurrency(withoutIncentives.downPayment)}{" "}
                        = {formatCurrency(withoutIncentives.loanAmount)}
                      </p>
                    </div>

                    <p className="font-medium">Step 3: Calculate Monthly Mortgage Payment</p>
                    <div className="bg-white p-3 rounded border">
                      <p>Using the mortgage formula:</p>
                      <p className="mt-1">M = P × [r(1+r)^n] / [(1+r)^n - 1]</p>
                      <p className="mt-1">Where:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600">
                        <li>M = Monthly payment</li>
                        <li>P = Principal (loan amount): {formatCurrency(withoutIncentives.loanAmount)}</li>
                        <li>
                          r = Monthly interest rate: {(withoutIncentives.interestRate / 100 / 12).toFixed(6)} (
                          {withoutIncentives.interestRate}% ÷ 12 months)
                        </li>
                        <li>
                          n = Number of payments: {inputs.loanTerm * 12} ({inputs.loanTerm} years × 12 months)
                        </li>
                      </ul>
                      <p className="mt-2">
                        Result: {formatCurrencyWithCents(withoutIncentives.monthlyPayment)} per month
                      </p>
                    </div>

                    {inputs.includeTax && (
                      <>
                        <p className="font-medium">Step 4: Calculate Monthly Property Tax</p>
                        <div className="bg-white p-3 rounded border">
                          <p>Home Price × Annual Tax Rate ÷ 12 = Monthly Tax</p>
                          <p className="mt-1 text-slate-600">
                            {formatCurrency(withoutIncentives.homePrice)} × {inputs.taxRate}% ÷ 12 ={" "}
                            {formatCurrencyWithCents(withoutIncentives.monthlyTax)}
                          </p>
                        </div>
                      </>
                    )}

                    <p className="font-medium">Step {inputs.includeTax ? "5" : "4"}: Calculate Total Monthly Payment</p>
                    <div className="bg-white p-3 rounded border">
                      <p>
                        Mortgage Payment + HOA Fee + CDD/Other Costs {inputs.includeTax ? "+ Property Tax" : ""} = Total
                        Monthly
                      </p>
                      <p className="mt-1 text-slate-600">
                        {formatCurrencyWithCents(withoutIncentives.monthlyPayment)} +{" "}
                        {formatCurrencyWithCents(inputs.hoaFee)} + {formatCurrencyWithCents(inputs.cddFee)}
                        {inputs.includeTax ? ` + ${formatCurrencyWithCents(withoutIncentives.monthlyTax)}` : ""} ={" "}
                        {formatCurrencyWithCents(withoutIncentives.totalMonthly)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-md mb-2">With Incentives Calculation</h4>
                  <div className="space-y-2 text-sm">
                    {withIncentives.priceReduction > 0 && (
                      <>
                        <p className="font-medium">Step 1: Apply Price Reduction</p>
                        <div className="bg-white p-3 rounded border">
                          <p>Original Price - Flex Cash = Reduced Price</p>
                          <p className="mt-1 text-slate-600">
                            {formatCurrency(withoutIncentives.homePrice)} -{" "}
                            {formatCurrency(withIncentives.priceReduction)} = {formatCurrency(withIncentives.homePrice)}
                          </p>
                        </div>
                      </>
                    )}

                    <p className="font-medium">
                      Step {withIncentives.priceReduction > 0 ? "2" : "1"}: Calculate Down Payment
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <p>Adjusted Home Price × Down Payment Percentage = Down Payment Amount</p>
                      <p className="mt-1 text-slate-600">
                        {formatCurrency(withIncentives.homePrice)} × {inputs.downPaymentPercent}% ={" "}
                        {formatCurrency(withIncentives.downPayment)}
                      </p>
                    </div>

                    <p className="font-medium">
                      Step {withIncentives.priceReduction > 0 ? "3" : "2"}: Calculate Loan Amount
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <p>
                        Adjusted Home Price - Down Payment{" "}
                        {withIncentives.otherIncentiveAmount > 0 ? "- Other Incentives" : ""} = Loan Amount
                      </p>
                      <p className="mt-1 text-slate-600">
                        {formatCurrency(withIncentives.homePrice)} - {formatCurrency(withIncentives.downPayment)}
                        {withIncentives.otherIncentiveAmount > 0
                          ? ` - ${formatCurrency(withIncentives.otherIncentiveAmount)}`
                          : ""}{" "}
                        = {formatCurrency(withIncentives.loanAmount)}
                      </p>
                    </div>

                    {withIncentives.rateBuyDown > 0 && (
                      <>
                        <p className="font-medium">
                          Step {withIncentives.priceReduction > 0 ? "4" : "3"}: Apply Interest Rate Buy Down
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <p>Original Rate - Rate Buy Down = Reduced Rate</p>
                          <p className="mt-1 text-slate-600">
                            {formatPercent(withoutIncentives.interestRate)} - {withIncentives.rateBuyDown.toFixed(3)}% ={" "}
                            {formatPercent(withIncentives.interestRate)}
                          </p>
                        </div>
                      </>
                    )}

                    <p className="font-medium">
                      Step{" "}
                      {withIncentives.priceReduction > 0
                        ? withIncentives.rateBuyDown > 0
                          ? "5"
                          : "4"
                        : withIncentives.rateBuyDown > 0
                          ? "4"
                          : "3"}
                      : Calculate Monthly Mortgage Payment
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <p>Using the mortgage formula with incentives applied:</p>
                      <p className="mt-1">M = P × [r(1+r)^n] / [(1+r)^n - 1]</p>
                      <p className="mt-1">Where:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600">
                        <li>P = Principal (adjusted loan amount): {formatCurrency(withIncentives.loanAmount)}</li>
                        <li>
                          r = Monthly interest rate: {(withIncentives.interestRate / 100 / 12).toFixed(6)} (
                          {withIncentives.interestRate}% ÷ 12 months)
                        </li>
                        <li>
                          n = Number of payments: {inputs.loanTerm * 12} ({inputs.loanTerm} years × 12 months)
                        </li>
                      </ul>
                      <p className="mt-2">Result: {formatCurrencyWithCents(withIncentives.monthlyPayment)} per month</p>
                    </div>

                    {inputs.includeTax && (
                      <>
                        <p className="font-medium">
                          Step{" "}
                          {withIncentives.priceReduction > 0
                            ? withIncentives.rateBuyDown > 0
                              ? "6"
                              : "5"
                            : withIncentives.rateBuyDown > 0
                              ? "5"
                              : "4"}
                          : Calculate Monthly Property Tax
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <p>Adjusted Home Price × Annual Tax Rate ÷ 12 = Monthly Tax</p>
                          <p className="mt-1 text-slate-600">
                            {formatCurrency(withIncentives.homePrice)} × {inputs.taxRate}% ÷ 12 ={" "}
                            {formatCurrencyWithCents(withIncentives.monthlyTax)}
                          </p>
                        </div>
                      </>
                    )}

                    <p className="font-medium">Final Step: Calculate Total Monthly Payment</p>
                    <div className="bg-white p-3 rounded border">
                      <p>
                        Mortgage Payment + {withIncentives.hoaYearsCovered > 0 ? "$0 HOA (covered)" : "HOA Fee"} +
                        CDD/Other Costs {inputs.includeTax ? "+ Property Tax" : ""} = Total Monthly
                      </p>
                      <p className="mt-1 text-slate-600">
                        {formatCurrencyWithCents(withIncentives.monthlyPayment)} +{" "}
                        {withIncentives.hoaYearsCovered > 0 ? "$0.00" : formatCurrencyWithCents(inputs.hoaFee)} +{" "}
                        {formatCurrencyWithCents(inputs.cddFee)}
                        {inputs.includeTax ? ` + ${formatCurrencyWithCents(withIncentives.monthlyTax)}` : ""} ={" "}
                        {formatCurrencyWithCents(withIncentives.totalMonthly)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-md mb-2">Savings Calculation</h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">Monthly Savings</p>
                    <div className="bg-white p-3 rounded border">
                      <p>Without Incentives Monthly - With Incentives Monthly = Monthly Savings</p>
                      <p className="mt-1 text-slate-600">
                        {formatCurrencyWithCents(withoutIncentives.totalMonthly)} -{" "}
                        {formatCurrencyWithCents(withIncentives.totalMonthly)} ={" "}
                        {formatCurrencyWithCents(savings.monthly)}
                      </p>
                    </div>

                    <p className="font-medium">Yearly Savings</p>
                    <div className="bg-white p-3 rounded border">
                      <p>Monthly Savings × 12 = Yearly Savings</p>
                      <p className="mt-1 text-slate-600">
                        {formatCurrencyWithCents(savings.monthly)} × 12 = {formatCurrency(savings.yearly)}
                      </p>
                    </div>

                    <p className="font-medium">Lifetime Savings</p>
                    <div className="bg-white p-3 rounded border">
                      <p>
                        Monthly Savings × Loan Term in Months {withIncentives.hoaSavings > 0 ? "+ HOA Savings" : ""} =
                        Lifetime Savings
                      </p>
                      <p className="mt-1 text-slate-600">
                        {formatCurrencyWithCents(savings.monthly)} × {inputs.loanTerm * 12} months
                        {withIncentives.hoaSavings > 0 ? ` + ${formatCurrency(withIncentives.hoaSavings)}` : ""} ={" "}
                        {formatCurrency(savings.lifetime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

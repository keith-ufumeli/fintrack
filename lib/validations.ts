import { z } from "zod"

// Transaction form validation schema (for form input)
export const transactionFormSchema = z.object({
  type: z.enum(["income", "expense"], {
    message: "Please select a transaction type",
  }),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description must be less than 100 characters")
    .trim(),
})

// Transaction validation schema (for API submission)
export const transactionSchema = transactionFormSchema.extend({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    })
    .transform((val) => Number(val)),
})

// Loan form validation schema (for form input)
export const loanFormSchema = z.object({
  person: z
    .string()
    .min(1, "Person name is required")
    .max(50, "Person name must be less than 50 characters")
    .trim(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  type: z.enum(["lend", "borrow"], {
    message: "Please select a loan type",
  }),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),
})

// Loan validation schema (for API submission)
export const loanSchema = loanFormSchema.extend({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    })
    .transform((val) => Number(val)),
})

// Type inference for TypeScript
export type TransactionFormData = z.infer<typeof transactionFormSchema>
export type TransactionData = z.infer<typeof transactionSchema>
export type LoanFormData = z.infer<typeof loanFormSchema>
export type LoanData = z.infer<typeof loanSchema>

// Common validation schemas that can be reused
export const commonSchemas = {
  positiveNumber: z
    .string()
    .min(1, "This field is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    })
    .transform((val) => Number(val)),
  
  requiredString: (min: number = 1, max: number = 100) =>
    z
      .string()
      .min(min, `Must be at least ${min} character${min > 1 ? 's' : ''}`)
      .max(max, `Must be less than ${max} characters`)
      .trim(),
  
  optionalString: (max: number = 200) =>
    z
      .string()
      .max(max, `Must be less than ${max} characters`)
      .trim()
      .optional()
      .or(z.literal("")),
}

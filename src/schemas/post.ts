import { z } from 'zod'

export const postInputSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(80, 'タイトルは80文字以内で入力してください'),
  body: z
    .string()
    .min(1, '本文は必須です')
    .max(2000, '本文は2000文字以内で入力してください'),
})

export type PostInput = z.infer<typeof postInputSchema>

export const postIdSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const toFieldErrors = (
  error: z.core.$ZodError<unknown>
): Record<string, string> => {
  const out: Record<string, string> = {}
  const flat = z.flattenError(error)
  for (const [key, messages] of Object.entries(flat.fieldErrors)) {
    const msgs = messages as string[] | undefined
    const first = msgs?.[0]
    if (first) out[key] = first
  }
  return out
}

export const recoverInput = (data: unknown): PostInput => {
  const obj = (data ?? {}) as Partial<PostInput>
  return {
    title: typeof obj.title === 'string' ? obj.title : '',
    body: typeof obj.body === 'string' ? obj.body : '',
  }
}

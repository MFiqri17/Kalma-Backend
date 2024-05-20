import { z } from 'zod';

const requiredMessage = 'VALIDATION.REQUIREDMESSAGE';

export const selfScreeningTestSchema = z.object({
  depression_score: z.number({ required_error: requiredMessage }).nonnegative(),
  anxiety_score: z.number({ required_error: requiredMessage }).nonnegative(),
  stress_score: z.number({ required_error: requiredMessage }).nonnegative(),
});

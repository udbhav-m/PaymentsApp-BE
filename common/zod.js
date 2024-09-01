const z = require("zod");

const userZod = z.object({
  firstName: z.string().refine((value) => {
    return value.trim().length > 3;
  }),
  lastName: z.string().refine((value) => {
    return value.trim().length > 0;
  }),
  email: z
    .string()
    .email()
    .refine((value) => {
      return value.trim().length > 3;
    }),
  password: z.string().refine((value) => {
    return value.trim().length > 6;
  }),
  pin: z.number().refine((value) => {
    return value.trim().length == 4;
  }),
});

const loginZod = z.object({
  email: z
    .string()
    .email()
    .min(6)
    .refine((value) => {
      return value.trim().length > 3;
    }),
  password: z
    .string()
    .min(6)
    .refine((value) => {
      return value.trim().length > 6;
    }),
});

const updateZod = z.object({
  firstName: z.string().min(4).optional(),
  lastName: z.string().min(4).optional(),
  password: z.string().min(6).optional(),
});

module.exports = {
  userZod,
  loginZod,
  updateZod,
};

const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const requiredString = (min = 1) => z.string().trim().min(min);

const authSchemas = {
  register: z.object({
    body: z.object({
      name: requiredString(2),
      email: z.email().toLowerCase(),
      password: requiredString(8),
      role: z.enum(['user', 'recruiter', 'admin']).default('user'),
      company: z.string().trim().optional(),
      adminInviteCode: z.string().trim().optional(),
    }),
  }),
  login: z.object({
    body: z.object({
      email: z.email().toLowerCase(),
      password: requiredString(1),
    }),
  }),
};

const jobSchemas = {
  create: z.object({
    body: z.object({
      title: requiredString(3),
      company: requiredString(2),
      location: requiredString(2),
      type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']).default('Full-time'),
      description: requiredString(20),
      requirements: z.array(requiredString(1)).min(1),
      salaryRange: z.string().trim().optional(),
      status: z.enum(['active', 'paused', 'closed']).default('active'),
    }),
  }),
  update: z.object({
    params: z.object({ id: objectId }),
    body: z.object({
      title: requiredString(3).optional(),
      company: requiredString(2).optional(),
      location: requiredString(2).optional(),
      type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']).optional(),
      description: requiredString(20).optional(),
      requirements: z.array(requiredString(1)).min(1).optional(),
      salaryRange: z.string().trim().optional(),
      status: z.enum(['active', 'paused', 'closed']).optional(),
    }),
  }),
  id: z.object({ params: z.object({ id: objectId }) }),
};

const applicationSchemas = {
  apply: z.object({
    body: z.object({
      jobId: objectId,
      coverLetter: z.string().trim().max(1500).optional(),
    }),
  }),
  status: z.object({
    params: z.object({ id: objectId }),
    body: z.object({
      status: z.enum(['reviewing', 'shortlisted', 'rejected', 'hired']),
    }),
  }),
};

const aiSchemas = {
  jobId: z.object({ params: z.object({ jobId: objectId }) }),
  interview: z.object({
    body: z.object({
      jobId: objectId,
      count: z.number().int().min(3).max(10).default(5),
    }),
  }),
};

module.exports = { aiSchemas, applicationSchemas, authSchemas, jobSchemas };

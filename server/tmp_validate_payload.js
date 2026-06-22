const { applicationSchemas } = require('./src/utils/validators');

const bodies = [
  { jobId: '64b6b8c1f5f8a2d9f0ab1234', coverLetter: 'Hello' },
  { jobId: 'invalid-id', coverLetter: 'Hello' },
  { jobId: '64b6b8c1f5f8a2d9f0ab1234', coverLetter: '' },
  { jobId: '64b6b8c1f5f8a2d9f0ab1234' },
  { jobId: '', coverLetter: 'Hello' },
];

for (const body of bodies) {
  const result = applicationSchemas.apply.safeParse({ body, params: {}, query: {} });
  console.log('body:', JSON.stringify(body));
  console.log('success:', result.success);
  if (!result.success) {
    console.log(JSON.stringify(result.error.flatten(), null, 2));
  }
  console.log('---');
}

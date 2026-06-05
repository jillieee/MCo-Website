export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const body = { email, groups: ['189116176018703788'] };
  if (name) body.fields = { name };

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiOGRmYjkxODllNjRlMWMzNjExNDNmNDkwMTE4OTE5ODgyYTM4MjUwNzhmMjFlY2VmZjI2NWYyOWQzMThjZjVlNWRmZjQ2MjJjYTg1OWEyYWIiLCJpYXQiOjE3ODA2OTc0NjMuMTk1NTE4LCJuYmYiOjE3ODA2OTc0NjMuMTk1NTIsImV4cCI6NDkzNjM3MTA2My4xOTExNjUsInN1YiI6IjI0MTY4MDYiLCJzY29wZXMiOltdfQ.EsNE525GOYBcP93tzm5U0oDDv6fUHY3Xjg9e6GUn4vEtARi4SljRn10ETWIVVsZG4EQfVd5WfS0At8dnKL29UPqhKOSgt22R6tnugEyyj-8890KMimPHCbAMpm7uV3Z1WnRtIEw-UFdOQ5x3z1IDBOL1rt5DPsMDsAXl_lmMhfUO_BnCjbrxw8nUfp2dzuVspbElU79649WP8MqLxiAUnS0PzDzeNSJzhycnb6FoQ0sT-RGTopvT0qpck9AwS3NBFOuCoLlwzg3VsPAg37MvIj6n8iHTaG5SqsqZItY-fztxRJp1fNaif4p6fPaC8gjfSH4g9wL-xuBGqMK6BW15cUHDbo0nA0Du7HUIXDatDWhrlccyGt1LUBVnY0PS60n-E2kuk_gdbTdf1-GOdPH4dUGPYWlnpDZf-L0BBGFy2huaM-E4rJQClgRwMSj2Qi7GcV7c0FegObzKOYnyIV-HrFou9gR7Zem5wk4ijTsuJ97sLjN9gjDmZ3uaIY7SaAgXGYa2thZkv7a4zKu7tc9XulJmiW_9TAMg2_N1vXqWAjn0NU_xFfwdKcCJECOcqOo8u5B4caHxOWkg-gas480zvtAyP9DizRAKJYEJJLECvNVrLbZmPqxXc9RZXoRE5CdQnLlv__Pf2v3lok1dGoiNM8Yi-ETXHVIcN3qEAEJPEPk',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log('MailerLite status:', response.status, 'body:', JSON.stringify(data));
  return res.status(response.ok ? 200 : 400).json({ status: response.status, data });
}

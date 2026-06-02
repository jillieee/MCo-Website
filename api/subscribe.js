export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const payload = {
    email,
    reactivate_existing: true,
    send_welcome_email: true,
    utm_source: 'website',
    utm_medium: 'organic',
  };
  if (name) payload.first_name = name;

  const response = await fetch(
    'https://api.beehiiv.com/v2/publications/730eeebc-19b7-4904-b55e-34eba02f85d9/subscriptions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer yHWsSUSlNAYC7lZwu28BG8u7En7k2r0kUmjOr7W87zkTNbVoqr0L1vhX6ad3nyyX',
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();
  return res.status(response.ok ? 200 : 400).json(data);
}

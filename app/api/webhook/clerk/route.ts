import { Webhook } from 'svix';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const { headers } = req;
  const svixId = headers.get('svix-id');
  const svixTimestamp = headers.get('svix-timestamp');
  const svixSignature = headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: Missing required headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any; // Replace WebhookEvent with any or define your own type

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as any; // Replace WebhookEvent with any or define your own type
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Failed to verify webhook', { status: 400 });
  }

  // Proceed with event handling based on evt.type
  const { type, data } = evt;

  try {
    if (type === 'user.created') {
      // Handle user creation event
      const { id, email_addresses, image_url, first_name, last_name, username } = data;

      const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username!,
        firstName: first_name || '',
        lastName: last_name || '',
        photo: image_url,
      };

      // Call your createUser function here
      // await createUser(user);

      // Example response for testing
      return NextResponse.json({ message: 'User created', user });
    } else if (type === 'user.updated') {
      // Handle user update event
      const { id, image_url, first_name, last_name, username } = data;

      const user = {
        firstName: first_name || '',
        lastName: last_name || '',
        username: username!,
        photo: image_url,
      };

      // Call your updateUser function here
      // await updateUser(id, user);

      // Example response for testing
      return NextResponse.json({ message: 'User updated', user });
    } else if (type === 'user.deleted') {
      // Handle user deletion event
      const { id } = data;

      // Call your deleteUser function here
      // await deleteUser(id);

      // Example response for testing
      return NextResponse.json({ message: 'User deleted', userId: id });
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return new Response('Error: Failed to process webhook event', { status: 500 });
  }

  return new Response('Unhandled event type', { status: 200 });
}
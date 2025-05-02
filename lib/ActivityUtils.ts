import { z } from 'zod';

const CreateActivitySchema = z.object({
  userId: z.string().optional(),
  licenseId: z.string().optional(),
  action: z.enum([
    'Account_Login',
    'Account_Logout',
    'License_Login',
    'License_Logout',
    'Scraping_Start',
    'Scraping_Stop',
    'Searching_Product_Start',
    'Searching_Product_Stop',
  ]),
  platform: z.enum(['Website', 'App']),
  details: z.record(z.any()).optional(),
  sessionId: z.string().optional(),
});

const UpdateActivitySchema = z.object({
  details: z.record(z.any()).optional(),
});

export async function createActivity(data: z.infer<typeof CreateActivitySchema>) {
  try {
    const validatedData = CreateActivitySchema.parse(data);
    const response = await fetch('/api/activity', {
      method: 'POST',
      body: JSON.stringify(validatedData),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to create activity');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteActivity(id: string) {
  try {
    const response = await fetch(`/api/activity/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete activity');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateActivity(id: string, data: z.infer<typeof UpdateActivitySchema>) {
  try {
    const validatedData = UpdateActivitySchema.parse(data);
    const response = await fetch(`/api/activity/${id}`, {
      method: 'PUT',
      body: JSON.stringify(validatedData),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to update activity');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

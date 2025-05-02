import { z } from 'zod';

const ActivitySchema = z.object({
  userId: z.string(),
  action: z.string(),
  platform: z.string(),
  details: z.object({ ip: z.string() }),
});

export async function createActivity(data: z.infer<typeof ActivitySchema>) {
  try {
    const validatedData = ActivitySchema.parse(data);
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

export async function updateActivity(id: string, data: Partial<z.infer<typeof ActivitySchema>>) {
  try {
    const validatedData = ActivitySchema.partial().parse(data);
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

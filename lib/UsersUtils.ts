export async function showLicenses(token: string) {
  const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${URL}/api/users/licenses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('showLicenses:', errorData);
      throw new Error(errorData.error || 'Failed to retrieve licenses');
    }

    const data = await response.json();
    console.log('showLicenses:', data);
    return data.licenses;
  } catch (error) {
    console.error('Error retrieving licenses:', error);
    throw error;
  }
}

export async function showLicenses(token: string) {
  const URL = process.env.NEXT_PUBLIC_API_URL || 'https://autolaku.com';
  try {
    const response = await fetch('http://localhost:3000/api/license_list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('TOKEN:', token);
    console.log(`${URL}/api/users/licenses`);
    if (!response.ok) {
      const errorData = await response.json();
      //   console.log('showLicenses:', errorData);
      throw new Error(errorData.error || 'Failed to retrieve licenses');
    }

    const data = await response.json();
    // console.log('showLicenses:', data);
    return data.licenses;
  } catch (error) {
    console.error('Error retrieving licenses:', error);
    throw error;
  }
}

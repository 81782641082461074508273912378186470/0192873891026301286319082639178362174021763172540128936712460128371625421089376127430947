// app/api/downloadLink/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const GITHUB_REPO_URL =
  'https://api.github.com/repos/81782641082461074508273912378186470/09712038126784961276312785617824537450173541237412803187134539487604120378162313018351627351267512/releases/latest';

interface GitHubRelease {
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') || 'windows';

  let fileExtension = '-win-x64.exe';
  if (platform === 'macos') {
    fileExtension = '-mac-arm64.dmg';
  }

  try {
    const response = await axios.get<GitHubRelease>(GITHUB_REPO_URL, {
      headers: {
        'User-Agent': 'Autolaku',
      },
    });
    const release = response.data;

    const asset = release.assets.find(
      (asset) => asset.name.startsWith('Autolaku-') && asset.name.endsWith(fileExtension)
    );

    if (asset) {
      return NextResponse.redirect(asset.browser_download_url);
    } else {
      return NextResponse.json(
        { error: `No matching file found for ${platform} in the latest release.` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching latest release:', error);
    return NextResponse.json({ error: 'Failed to fetch the latest release.' }, { status: 500 });
  }
}

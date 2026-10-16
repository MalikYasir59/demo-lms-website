/**
 * YouTube Utility Module
 * Extracts IDs, validates links, fetches oEmbed metadata, and calculates durations.
 */

export function parseYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex for standard, short, embed, and shorts links
  const regExp =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);

  return match && match[1] ? match[1] : null;
}

export interface YouTubeMeta {
  videoId: string;
  title: string;
  authorName: string;
  thumbnailUrl: string;
  durationSec: number;
}

/**
 * Parses an ISO 8601 duration string (e.g. "PT1H15M30S") to seconds.
 */
function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Fetches video metadata from YouTube via public oEmbed and optional Data API.
 */
export async function fetchYouTubeMeta(videoId: string): Promise<YouTubeMeta> {
  const cleanId = parseYouTubeId(videoId);
  if (!cleanId) {
    throw new Error("Invalid YouTube Video ID or URL");
  }

  // 1. Fetch public oEmbed data (no API key required)
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${cleanId}&format=json`;
  let title = "Trading Lecture";
  let authorName = "Institute of Trading Tricks";
  let thumbnailUrl = `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
  let durationSec = 0;

  try {
    const res = await fetch(oembedUrl, {
      headers: { "User-Agent": "ITT-LMS-Platform/1.0" },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      title = data.title || title;
      authorName = data.author_name || authorName;
      if (data.thumbnail_url) {
        thumbnailUrl = data.thumbnail_url;
      }
    }
  } catch (err) {
    console.warn("[YouTube oEmbed Warning]:", err);
  }

  // 2. If YT_API_KEY is configured, fetch exact duration via YouTube Data API
  const apiKey = process.env.YT_API_KEY;
  if (apiKey) {
    try {
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${cleanId}&part=contentDetails&key=${apiKey}`;
      const apiRes = await fetch(apiUrl);
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        const item = apiData.items?.[0];
        if (item?.contentDetails?.duration) {
          durationSec = parseISO8601Duration(item.contentDetails.duration);
        }
      }
    } catch (err) {
      console.warn("[YouTube Data API Warning]:", err);
    }
  }

  return {
    videoId: cleanId,
    title,
    authorName,
    thumbnailUrl,
    durationSec,
  };
}

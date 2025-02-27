import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
 
type ResponseData = {
  message: string
}
 
export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  const body = await req.json();
  const { youtubeUrl } = body;

  const data = await YoutubeTranscript.fetchTranscript(youtubeUrl);

  // const text = data.map((item: any) => item?.text);
  // save into a file
  // const fs = require('fs');
  // fs.writeFileSync('transcripts.txt', text.join(' '));

  return NextResponse.json({ data })
}

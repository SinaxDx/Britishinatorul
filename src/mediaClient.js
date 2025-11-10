import 'dotenv/config';

// Uses Automatic1111 WebUI API for txt2img.
// https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#api
// Make sure WebUI is launched with --api flag.

const A1111_URL = process.env.AUTOMATIC1111_BASE_URL || 'http://127.0.0.1:7860';

export async function generateImageTxt2Img({
  prompt,
  negativePrompt,
  width,
  height,
  steps,
  cfgScale,
  sampler
}) {
  if (!A1111_URL) {
    return { ok: false, error: 'AUTOMATIC1111_BASE_URL not configured.' };
  }
  if (!prompt || !prompt.trim()) {
    return { ok: false, error: 'Please provide a prompt.' };
  }

  const payload = {
    prompt,
    negative_prompt: negativePrompt || process.env.NEGATIVE_PROMPT || '',
    width: width || parseInt(process.env.IMAGE_WIDTH || '512', 10),
    height: height || parseInt(process.env.IMAGE_HEIGHT || '512', 10),
    steps: steps || parseInt(process.env.IMAGE_STEPS || '25', 10),
    cfg_scale: cfgScale || parseFloat(process.env.IMAGE_CFG || '7'),
    sampler_name: sampler || process.env.IMAGE_SAMPLER || 'Euler a',
    // You can add more A1111 options here as needed
  };

  try {
    const res = await fetch(`${A1111_URL}/sdapi/v1/txt2img`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `A1111 HTTP ${res.status}: ${text.slice(0, 500)}` };
    }
    const data = await res.json();
    const b64 = data?.images?.[0];
    if (!b64) {
      return { ok: false, error: 'No image returned by A1111.' };
    }
    const buf = Buffer.from(b64, 'base64');
    return { ok: true, buffer: buf, mime: 'image/png', filename: 'image.png' };
  } catch (err) {
    return { ok: false, error: `A1111 error: ${err?.message || err}` };
  }
}

// Placeholder for local video generation. Implement your own local pipeline
// and expose a simple HTTP endpoint that returns an MP4 buffer.
export async function generateVideo({ prompt }) {
  const url = process.env.VIDEO_API_URL;
  if (!url) {
    return { ok: false, error: 'VIDEO_API_URL not configured. Provide a local HTTP endpoint that returns MP4.' };
  }
  if (!prompt || !prompt.trim()) {
    return { ok: false, error: 'Please provide a prompt.' };
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Video API HTTP ${res.status}: ${text.slice(0, 500)}` };
    }
    const arrayBuf = await res.arrayBuffer();
    return { ok: true, buffer: Buffer.from(arrayBuf), mime: 'video/mp4', filename: 'video.mp4' };
  } catch (err) {
    return { ok: false, error: `Video API error: ${err?.message || err}` };
  }
}

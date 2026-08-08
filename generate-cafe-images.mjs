import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/home/z/my-project/public/images';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const STYLE = "Premium restaurant photography, warm ambient lighting, atmospheric, dark moody tones, high-end nightlife venue, professional quality, detailed";

// Sizes must be multiples of 32, between 512-2880, max pixels 2^22=4194304
// Valid landscape sizes: 1344x768, 1152x864, 1024x1024
const images = [
  {
    filename: 'hero-about.png',
    size: '1344x768',
    prompt: `Dark atmospheric bar interior with warm amber lighting, cocktail bar counter with bottles backlit, leather bar stools, premium nightlife vibe, intimate moody ambiance. ${STYLE}`
  },
  {
    filename: 'hero-visit.png',
    size: '1344x768',
    prompt: `Elegant restaurant interior with warm ambient lighting, dining tables set with white tablecloths and candles, soft golden light, inviting upscale dining room. ${STYLE}`
  },
  {
    filename: 'hero-whats-on.png',
    size: '1344x768',
    prompt: `Live music stage with warm stage lights, microphone and instruments, intimate venue atmosphere, spotlight glow, red velvet curtains, moody performance space. ${STYLE}`
  },
  {
    filename: 'hero-home.png',
    size: '1344x768',
    prompt: `Outdoor cafe terrace at dusk with string lights and warm golden hour atmosphere, people sitting at tables, ivy on walls, cozy evening ambiance, twilight sky. ${STYLE}`
  },
  {
    filename: 'story-exterior.png',
    size: '1152x864',
    prompt: `Restaurant exterior at evening, warm golden light from windows, inviting entrance with awning, potted plants, elegant facade, dusk sky. ${STYLE}`
  },
  {
    filename: 'experience-stage.png',
    size: '1152x864',
    prompt: `Live music stage close-up, warm amber stage lighting, microphone and guitar on stand, spotlight beams, intimate performance atmosphere. ${STYLE}`
  },
  {
    filename: 'experience-bar.png',
    size: '1152x864',
    prompt: `Craft cocktail bar counter, warm amber lighting, bartender shaking cocktail, premium spirits on backlit shelf, copper bar top, moody ambiance. ${STYLE}`
  },
  {
    filename: 'experience-terrace.png',
    size: '1152x864',
    prompt: `Outdoor terrace seating area, evening ambiance, string lights overhead, comfortable lounge furniture, plants and greenery, warm glow, relaxed atmosphere. ${STYLE}`
  },
  {
    filename: 'experience-crowd.png',
    size: '1152x864',
    prompt: `People enjoying nightlife at a stylish venue, warm atmospheric lighting, guests at tables and bar, laughing and socializing, vibrant yet intimate mood. ${STYLE}`
  },
  {
    filename: 'cta-cocktail.png',
    size: '1024x1024',
    prompt: `Close-up of a craft cocktail on a dark bar counter, warm moody lighting, amber and gold tones, condensation on glass, dramatic bar background. ${STYLE}`
  },
  {
    filename: 'visit-gallery-1.png',
    size: '1152x864',
    prompt: `Restaurant exterior in the evening, warm light spilling from windows, elegant entrance, outdoor seating area, twilight atmosphere. ${STYLE}`
  },
  {
    filename: 'visit-gallery-2.png',
    size: '1152x864',
    prompt: `Bar counter with craft cocktails being prepared, warm amber lighting, premium spirits display, skilled bartender, moody bar atmosphere. ${STYLE}`
  },
  {
    filename: 'visit-gallery-3.png',
    size: '1152x864',
    prompt: `Outdoor terrace seating with string lights and plants, evening ambiance, comfortable seating, warm golden glow, relaxed dining atmosphere. ${STYLE}`
  },
  {
    filename: 'visit-gallery-4.png',
    size: '1152x864',
    prompt: `Elegant dining area interior, warm ambient lighting, set tables with candles, plush seating, sophisticated restaurant atmosphere. ${STYLE}`
  },
  {
    filename: 'event-featured-1.png',
    size: '1344x768',
    prompt: `Live band performing on stage, warm stage lighting, singer with microphone, musicians playing instruments, intimate venue, captivated audience. ${STYLE}`
  },
  {
    filename: 'event-featured-2.png',
    size: '1344x768',
    prompt: `DJ setup with colorful lights and warm ambient glow, turntables and mixer, atmospheric smoke, nightclub vibe, energetic yet intimate atmosphere. ${STYLE}`
  },
  {
    filename: 'about-visit-image.png',
    size: '1152x864',
    prompt: `Night exterior of a stylish restaurant, warm light from entrance, neon sign glow, elegant facade, people arriving, vibrant nightlife scene. ${STYLE}`
  }
];

const DELAY_MS = 5000; // 5 second delay between requests to avoid rate limiting

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateAll() {
  const zai = await ZAI.create();
  const results = [];

  for (let i = 0; i < images.length; i++) {
    const { filename, size, prompt } = images[i];
    const outputPath = path.join(OUTPUT_DIR, filename);

    console.log(`[${i + 1}/${images.length}] Generating ${filename}...`);

    // Add delay between requests (skip for first one)
    if (i > 0) {
      console.log(`  Waiting ${DELAY_MS/1000}s to avoid rate limit...`);
      await delay(DELAY_MS);
    }

    let retries = 3;
    let success = false;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await zai.images.generations.create({
          prompt: prompt,
          size: size
        });

        const imageBase64 = response.data[0].base64;
        const buffer = Buffer.from(imageBase64, 'base64');
        fs.writeFileSync(outputPath, buffer);

        const fileSizeKB = Math.round(buffer.length / 1024);
        console.log(`  ✓ Saved: ${filename} (${fileSizeKB} KB, ${size})`);
        results.push({ filename, size, fileSizeKB, success: true });
        success = true;
        break;
      } catch (error) {
        console.error(`  Attempt ${attempt} failed: ${error.message}`);
        if (attempt < retries) {
          const waitTime = attempt * 10000;
          console.log(`  Retrying in ${waitTime/1000}s...`);
          await delay(waitTime);
        }
      }
    }

    if (!success) {
      console.error(`  ✗ All retries failed for ${filename}`);
      results.push({ filename, size, success: false });
    }
  }

  console.log('\n=== GENERATION SUMMARY ===');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  console.log(`Total: ${results.length} | Success: ${successful.length} | Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed images:');
    failed.forEach(f => console.log(`  - ${f.filename}`));
  }

  console.log('\nSuccessfully generated:');
  successful.forEach(s => console.log(`  ✓ /public/images/${s.filename} (${s.size}, ${s.fileSizeKB} KB)`));
}

generateAll().catch(console.error);

"""
Thirukkural AI - Universal 1,330 Kural Image Generation Pipeline (Python)

Powered by Google Gemini & Imagen 3 API

Usage:
  python generate_kural_images.py --key YOUR_GEMINI_API_KEY
  python generate_kural_images.py --start 1 --end 50
  python generate_kural_images.py --dry-run
"""

import os
import sys
import json
import time
import argparse
import base64
import urllib.request
import urllib.error

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(ROOT_DIR, "public", "kural_images")
METADATA_FILE = os.path.join(OUTPUT_DIR, "metadata.json")
DATA_FILE = os.path.join(ROOT_DIR, "thirukkural.json")

def load_env_key():
    env_path = os.path.join(ROOT_DIR, ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("GEMINI_API_KEY=") or line.startswith("VITE_GEMINI_API_KEY="):
                    return line.split("=", 1)[1].strip().strip("'\"")
    return os.environ.get("GEMINI_API_KEY", "")

def build_prompt(kural):
    num = kural.get("Number", 0)
    translation = kural.get("Translation") or kural.get("explanation") or kural.get("couplet") or ""
    tamil_exp = kural.get("mv") or kural.get("sp") or kural.get("mk") or ""

    theme_style = (
        "classical Tamil Sangam era aesthetics, ancient South Indian atmosphere, "
        "dramatic cinematic lighting, rich oil painting, detailed textures, 8k resolution, atmospheric masterpiece"
    )
    if num <= 380:
        theme_style += ", serene natural landscapes, spiritual grace, warm morning sunlight"
    elif num <= 1080:
        theme_style += ", majestic ancient Tamil royal courts, grand stone architecture, bustling village markets, wise ministers and kings"
    else:
        theme_style += ", poetic romance, moonlit lotus ponds, traditional Sangam beauty, tender emotion, soft twilight colors"

    clean_trans = translation.replace('"', '').replace("'", "").strip()
    return f"A culturally authentic, poetic visual artwork representing Thirukkural Verse #{num}: \"{clean_trans}\". Visual Metaphor: Expressing {tamil_exp[:100]}. Style: {theme_style}. No typography, no modern elements, pure fine art."

def generate_imagen3(api_key, prompt, model_name="imagen-3.0-generate-002"):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:predict?key={api_key}"
    payload = {
        "instances": [{"prompt": prompt}],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "1:1",
            "outputOptions": {"mimeType": "image/jpeg"}
        }
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        predictions = res_data.get("predictions", [])
        if predictions and "bytesBase64Encoded" in predictions[0]:
            return base64.b64decode(predictions[0]["bytesBase64Encoded"])
    raise Exception(f"No image data returned from API: {res_data}")

def main():
    parser = argparse.ArgumentParser(description="Generate 1330 Thirukkural Images via Gemini Imagen 3")
    parser.add_argument("--key", default=load_env_key(), help="Google Gemini API Key")
    parser.add_argument("--start", type=int, default=1, help="Starting Kural number")
    parser.add_argument("--end", type=int, default=1330, help="Ending Kural number")
    parser.add_argument("--delay", type=float, default=3.0, help="Delay in seconds between calls")
    parser.add_argument("--model", default="imagen-3.0-generate-002", help="Imagen 3 model version")
    parser.add_argument("--dry-run", action="store_true", help="Preview prompts without generating")
    parser.add_argument("--force", action="store_true", help="Overwrite existing images")
    args = parser.parse_args()

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    if not os.path.exists(DATA_FILE):
        print(f"❌ Error: {DATA_FILE} not found!")
        sys.exit(1)

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        raw = json.load(f)
        kurals = raw.get("kural", raw)

    if not args.dry_run and not args.key:
        print("❌ Error: Gemini API Key not provided! Set GEMINI_API_KEY in .env or pass with --key")
        sys.exit(1)

    metadata = {}
    if os.path.exists(METADATA_FILE):
        try:
            with open(METADATA_FILE, "r", encoding="utf-8") as f:
                metadata = json.load(f)
        except Exception:
            metadata = {}

    target = [k for k in kurals if args.start <= k.get("Number", 0) <= args.end]
    print(f"🏛️ Starting image pipeline for {len(target)} Kurals (Range: {args.start}-{args.end})...")

    success_count = 0
    skipped_count = 0

    for idx, kural in enumerate(target, 1):
        num = kural["Number"]
        img_path = os.path.join(OUTPUT_DIR, f"{num}.jpg")
        prompt = build_prompt(kural)

        print(f"\n[{idx}/{len(target)}] 📜 Kural #{num}: \"{kural.get('Line1', '')}...\"")
        print(f"🎨 Prompt: {prompt[:100]}...")

        if args.dry_run:
            print(f"   [DRY-RUN] Target file: {img_path}")
            continue

        if os.path.exists(img_path) and not args.force:
            print(f"   ⏭️ Skipped: {num}.jpg already exists.")
            skipped_count += 1
            continue

        retries = 0
        success = False
        while not success and retries < 3:
            try:
                print(f"   ⏳ Generating image with Imagen 3... ", end="", flush=True)
                img_bytes = generate_imagen3(args.key, prompt, args.model)
                with open(img_path, "wb") as f:
                    f.write(img_bytes)
                
                metadata[str(num)] = {
                    "kuralNumber": num,
                    "prompt": prompt,
                    "model": args.model,
                    "file": f"{num}.jpg"
                }
                with open(METADATA_FILE, "w", encoding="utf-8") as f:
                    json.dump(metadata, f, indent=2, ensure_ascii=False)

                print(f"✅ Saved {num}.jpg")
                success_count += 1
                success = True
            except Exception as e:
                retries += 1
                print(f"\n   ⚠️ Attempt {retries} failed: {e}")
                if retries < 3:
                    time.sleep(retries * 5)

        if idx < len(target) and not args.dry_run and success:
            time.sleep(args.delay)

    print(f"\n🎉 Done! Generated: {success_count}, Skipped: {skipped_count}, Total: {len(target)}")

if __name__ == "__main__":
    main()

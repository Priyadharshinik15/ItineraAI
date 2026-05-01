import os, httpx
from dotenv import load_dotenv
load_dotenv()

UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "")
PEXELS_KEY   = os.getenv("PEXELS_API_KEY", "")

async def get_city_images(city: str, count: int = 6) -> list[str]:
    """Returns image URLs for a city. Falls back to Pexels, then static Unsplash."""
    images = []

    # Try Unsplash first
    if UNSPLASH_KEY:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.get(
                    "https://api.unsplash.com/search/photos",
                    params={"query": city, "per_page": count, "orientation": "landscape"},
                    headers={"Authorization": f"Client-ID {UNSPLASH_KEY}"},
                )
                if r.status_code == 200:
                    data = r.json()
                    images = [p["urls"]["regular"] for p in data.get("results", [])]
        except Exception:
            pass

    # Try Pexels
    if not images and PEXELS_KEY:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.get(
                    "https://api.pexels.com/v1/search",
                    params={"query": city, "per_page": count},
                    headers={"Authorization": PEXELS_KEY},
                )
                if r.status_code == 200:
                    data = r.json()
                    images = [p["src"]["large"] for p in data.get("photos", [])]
        except Exception:
            pass

    # Static fallback using Unsplash source (no key needed)
    if not images:
        keywords = [city, f"{city} landmark", f"{city} food", f"{city} street", f"{city} culture", f"{city} travel"]
        images = [
            f"https://source.unsplash.com/800x500/?{kw.replace(' ', '+')}"
            for kw in keywords[:count]
        ]

    return images

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq")
GROQ_API_KEY  = os.getenv("GROQ_API_KEY", "")
OLLAMA_BASE   = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL  = os.getenv("OLLAMA_MODEL", "llama3.2")

LANGUAGE_MAP = {
    "English":"English","Tamil":"Tamil (தமிழ்)","Hindi":"Hindi (हिन्दी)",
    "French":"French (Français)","Spanish":"Spanish (Español)",
    "German":"German (Deutsch)","Italian":"Italian (Italiano)",
    "Portuguese":"Portuguese (Português)","Japanese":"Japanese (日本語)",
    "Korean":"Korean (한국어)","Chinese":"Chinese Simplified (简体中文)",
    "Arabic":"Arabic (العربية)","Russian":"Russian (Русский)",
    "Turkish":"Turkish (Türkçe)","Dutch":"Dutch (Nederlands)",
    "Polish":"Polish (Polski)","Swedish":"Swedish (Svenska)",
    "Greek":"Greek (Ελληνικά)","Indonesian":"Indonesian (Bahasa Indonesia)",
    "Thai":"Thai (ภาษาไทย)",
}

def _build_system():
    return (
        "You are a premium AI Travel Planner. "
        "You write beautifully structured Markdown travel reports. "
        "Always use emojis on headings, bullet points for lists, "
        "and keep the tone professional yet warm. "
        "Never output anything except the requested Markdown report."
    )

def _build_city_prompt(inputs: dict, language: str) -> str:
    lang = LANGUAGE_MAP.get(language, "English")
    return f"""
⚠️ RESPOND ENTIRELY IN {lang}. NO OTHER LANGUAGE.

Generate the CITY OVERVIEW & ACCOMMODATION REPORT for a travel app.

User Inputs:
- Destination: {inputs['destination']}
- Travel Dates: {inputs['date_from']} to {inputs['date_to']}
- Travelers: {inputs['travelers']}
- Budget: {inputs['budget']}
- Travel Style: {inputs['style']}

STRICTLY follow this structure:

# 🌍 Welcome to {inputs['destination']}
Write 3 engaging paragraphs: historical importance, cultural highlights, tourism appeal.

# 🧾 City Overview & Daily Costs
- Daily cost estimate
- Food pricing (budget + mid-range)
- Transport overview
- Walkability

# 🏨 Accommodation Guide

## 💸 Budget Hotels (3 options)
For each:
**Name** | 💰 Price/night | 📍 Location
- Key features (2-3 bullets)
- 🔗 [Search on Google](https://www.google.com/search?q=HOTEL+NAME+{inputs['destination']}+hotel+booking)
- 🖼️ Image: https://source.unsplash.com/600x400/?hotel,budget,{inputs['destination'].replace(' ','+')}

## 💰 Mid-Range Hotels (3 options)
(same format)

## 💎 Luxury Hotels (3 options)
(same format)

# 💰 Budget Analysis
- 🟢 Low Budget: estimated total for {inputs['travelers']} traveler(s)
- 🟡 Medium Budget: estimated total
- 🔴 High Budget: estimated total
- ⭐ Recommended: based on user's {inputs['budget']} preference
- 💵 Total Estimated Trip Cost (all {inputs['travelers']} travelers, all days)

# 🚌 Transportation Guide
- Public transport options
- Ticket prices
- Best ways to get around

# 📄 Visa Requirements
- Visa type needed (for Indian travelers)
- Documents required
- Processing time

# 🌦️ Weather & Packing
- Temperature range during travel dates
- Rain probability
- What to pack

Output ONLY the Markdown. No extra commentary.
"""

def _build_guide_prompt(inputs: dict, language: str) -> str:
    lang = LANGUAGE_MAP.get(language, "English")
    return f"""
⚠️ RESPOND ENTIRELY IN {lang}. NO OTHER LANGUAGE.

Generate the CITY GUIDE & ATTRACTIONS REPORT for a travel app.

User Inputs:
- Destination: {inputs['destination']}
- Travel Dates: {inputs['date_from']} to {inputs['date_to']}
- Travel Style: {inputs['style']}
- Budget: {inputs['budget']}

STRICTLY follow this structure:

# 🗺️ Top Places to Visit in {inputs['destination']}
List 8 must-visit attractions. For each:

## [Number]. Place Name
Short 2-sentence description.
- 🖼️ Image: https://source.unsplash.com/600x400/?{inputs['destination'].replace(' ','+')},landmark,attraction
- 🔗 [Search on Google](https://www.google.com/search?q=PLACE+NAME+{inputs['destination']})
- ⏰ Best time to visit
- 💰 Entry cost (approximate)

# 🍽️ Food & Dining Guide
Top 5 local dishes to try.
Top 3 restaurant recommendations with Google search links.

# 🎉 Events & Festivals During Your Visit ({inputs['date_from']} – {inputs['date_to']})
List any festivals, events, or seasonal activities.

# 🧠 Smart AI Travel Tips
- 5 money-saving tips
- 3 safety tips
- 3 local etiquette tips

Output ONLY the Markdown. No extra commentary.
"""

def _build_plan_prompt(inputs: dict, language: str) -> str:
    lang = LANGUAGE_MAP.get(language, "English")
    return f"""
⚠️ RESPOND ENTIRELY IN {lang}. NO OTHER LANGUAGE.

Generate the PERSONALIZED DAY-BY-DAY TRAVEL PLAN for a travel app.

User Inputs:
- Destination: {inputs['destination']}
- Travel Dates: {inputs['date_from']} to {inputs['date_to']}
- Travelers: {inputs['travelers']}
- Budget: {inputs['budget']}
- Travel Style: {inputs['style']}

STRICTLY follow this structure:

# ✈️ Your {inputs['destination']} Travel Plan
## {inputs['date_from']} → {inputs['date_to']} | {inputs['travelers']} Traveler(s) | {inputs['budget']} Budget | {inputs['style']} Style

Write a day-by-day itinerary for EVERY day of the trip. For each day:

---
## 📅 Day [N] — [Date] — [Theme for the day]

### 🌅 Morning (8:00 AM – 12:00 PM)
- Activity with location and tip

### ☀️ Afternoon (12:00 PM – 6:00 PM)
- Activity + lunch recommendation with Google search link

### 🌙 Evening (6:00 PM – 10:00 PM)
- Activity + dinner recommendation

### 💡 Day Tips
- 1-2 practical tips for the day

---

# 📊 Final Trip Summary
## ✨ Trip Highlights
- Top 5 experiences of the trip

## 💰 Budget Recommendation
- Daily spend breakdown
- Total trip cost estimate

## 🏆 Best Experiences
- 3 must-not-miss moments

Output ONLY the Markdown. No extra commentary.
"""

# async def _call_groq(prompt: str, system: str) -> str:
#     import groq as groq_lib
#     client = groq_lib.Groq(api_key=GROQ_API_KEY)
#     response = client.chat.completions.create(
#         model="llama-3.3-70b-versatile",
#         messages=[
#             {"role": "system", "content": system},
#             {"role": "user", "content": prompt},
#         ],
#         max_tokens=4000,
#         temperature=0.7,
#     )
#     return response.choices[0].message.content
async def _call_groq(prompt: str, system: str) -> str:
    import groq as groq_lib

    client = groq_lib.Groq(api_key=GROQ_API_KEY)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        max_tokens=4000,
        temperature=0.7,
    )

    content = response.choices[0].message.content
    return content if content is not None else ""   # ✅ FIX

# async def _call_ollama(prompt: str, system: str) -> str:
#     async with httpx.AsyncClient(timeout=120) as client:
#         resp = await client.post(
#             f"{OLLAMA_BASE}/api/chat",
#             json={
#                 "model": OLLAMA_MODEL,
#                 "messages": [
#                     {"role": "system", "content": system},
#                     {"role": "user", "content": prompt},
#                 ],
#                 "stream": False,
#             },
#         )
#         resp.raise_for_status()
#         return resp.json()["message"]["content"]
async def _call_ollama(prompt: str, system: str) -> str:
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            f"{OLLAMA_BASE}/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
                "stream": False,
            },
        )
        resp.raise_for_status()

        data = resp.json()

        content = data.get("message", {}).get("content")
        return content if content is not None else ""   # ✅ FIX

async def _call_llm(prompt: str) -> str:
    system = _build_system()
    if LLM_PROVIDER == "ollama":
        return await _call_ollama(prompt, system)
    return await _call_groq(prompt, system)

async def generate_all_reports(inputs: dict, language: str) -> dict:
    city   = await _call_llm(_build_city_prompt(inputs, language))
    guide  = await _call_llm(_build_guide_prompt(inputs, language))
    plan   = await _call_llm(_build_plan_prompt(inputs, language))
    return {"city_report": city, "guide_report": guide, "travel_plan": plan}

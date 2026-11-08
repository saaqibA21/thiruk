"""
Thirukkural AI - Gold Standard Dataset Builder
Generates a multi-task, high-purity instruction dataset for training a world-class Tamil LLM.
"""

import json
import os

PAALS = [
    {"name": "அறத்துப்பால்", "nameEn": "Virtue", "range": (1, 380)},
    {"name": "பொருட்பால்", "nameEn": "Wealth / Polity", "range": (381, 1080)},
    {"name": "காமத்துப்பால்", "nameEn": "Love", "range": (1081, 1330)},
]

ATHIGARAMS_LIST = [
    "கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை", "அறன் வலியுறுத்தல்", "இல் வாழ்க்கை",
    "வாழ்க்கைத் துணைநலம்", "மக்கள் பேறு", "அன்பு உடைமை", "விருந்து ஓம்பல்", "இனியவை கூறல்",
    "செய்ந்நன்றி அறிதல்", "நடுவு நிலைமை", "அடக்கம் உடைமை", "ஒழுக்கம் உடைமை", "பிறன் இல் விழையாமை",
    "பொறை உடைமை", "அழுக்காறாமை", "வெஃகாமை", "புறம் கூறாமை", "பயன் இல சொல்லாமை",
    "தீவினை அச்சம்", "ஒப்புரவு அறிதல்", "ஈகை", "புகழ்", "அருள் உடைமை",
    "புலால் மறுத்தல்", "தவம்", "கூடா ஒழுக்கம்", "கள்ளாமை", "வாய்மை",
    "வெகுளாமை", "இன்னா செய்யாமை", "கொல்லாமை", "நிலையாமை", "துறவு",
    "மெய் உணர்தல்", "அவா அறுத்தல்", "ஊழ்", "இறை மாட்சி", "கல்வி",
    "கல்லாமை", "கேள்வி", "அறிவு உடைமை", "குற்றம் கடிதல்", "பெரியோரைத் துணைக்கோடல்",
    "சிற்றினம் சேராமை", "தெரிந்து செயல் வகை", "வலி அறிதல்", "காலம் அறிதல்", "இடன் அறிதல்",
    "தெரிந்து தெளிதல்", "தெரிந்து வினையாடல்", "சுற்றம் தழால்", "பொச்சாவாமை", "செங்கோன்மை",
    "கொடுங்கோன்மை", "வெருவந்த செய்யாமை", "கண்ணோட்டம்", "ஒற்றாடல்", "ஊக்கம் உடைமை",
    "மடி இன்மை", "ஆள்வினை உடைமை", "இடுக்கண் அழியாமை", "அமைச்சு", "சொல்வன்மை",
    "வினைத் தூய்மை", "வினைத் திட்பம்", "வினை செயல் வகை", "தூது", "மன்னரைச் சேர்ந்து ஒழுகல்",
    "குறிப்பு அறிதல்", "அவை அறிதல்", "அவை அஞ்சாமை", "நாடு", "அரண்",
    "பொருள் செயல் வகை", "படை மாட்சி", "படைச் செருக்கு", "நட்பு", "நட்பு ஆராய்தல்",
    "பழைமை", "தீ நட்பு", "கூடா நட்பு", "பேதைமை", "புல்லறிவாண்மை",
    "இகல்", "பகை மாட்சி", "பகைத் திறம் தெளிதல்", "உட்பகை", "பெரியோரைப் பிழையாமை",
    "பெண்வழிச் சேறல்", "வரைவின் மகளிர்", "கள் உண்ணாமை", "சூது", "மருந்து",
    "குடிமை", "மானம்", "பெருமை", "சான்றாண்மை", "பண்பு உடைமை",
    "நன்றி இல் செல்வம்", "நாண் உடைமை", "குடி செயல் வகை", "உழவு", "நல்குரவு",
    "இரவு", "இரவு அச்சம்", "கயமை", "தகையணங்கு உறுத்தல்", "குறிப்பு அறிதல்",
    "புணர்ச்சி மகிழ்தல்", "நலம் புனைந்து உரைத்தல்", "காதல் சிறப்பு உரைத்தல்", "நாணுத் துறவு உரைத்தல்", "அலர் அறிவுறுத்தல்",
    "பிரிவு ஆற்றாமை", "படர் மெலிந்து இரங்கல்", "கண் விதுப்பு அழிதல்", "பசப்புறு பருவரல்", "தனிப்படர் மிகுதி",
    "நினைந்தவர் புலம்பல்", "கனவு நிலை உரைத்தல்", "பொழுது கண்டு இரங்கல்", "உறுப்பு நலன் அழிதல்", "நெஞ்சொடு கிளத்தல்",
    "நிறை அழிதல்", "அவர் வயின் விதும்பல்", "குறிப்பு அறிவுறுத்தல்", "புணர்ச்சி விதும்பல்", "நெஞ்சொடு புலத்தல்",
    "புலவி", "புலவி நுணுக்கம்", "ஊடல் உவகை"
]

def get_paal(num):
    for p in PAALS:
        if p["range"][0] <= num <= p["range"][1]:
            return p["name"]
    return "அறத்துப்பால்"

def get_athigaram(num):
    idx = (num - 1) // 10
    if 0 <= idx < len(ATHIGARAMS_LIST):
        return idx + 1, ATHIGARAMS_LIST[idx]
    return 1, "கடவுள் வாழ்த்து"

def main():
    with open('public/thirukkural.json', 'r', encoding='utf-8') as f:
        raw = json.load(f)
    
    kurals = raw.get('kural', raw)
    os.makedirs('dataset', exist_ok=True)
    out_path = 'dataset/thirukkural_gold.jsonl'
    
    records = []
    
    for k in kurals:
        num = int(k['Number'])
        line1 = k.get('Line1', '').strip()
        line2 = k.get('Line2', '').strip()
        verse = f"{line1}\n{line2}"
        ch_num, ch_name = get_athigaram(num)
        paal = get_paal(num)
        
        mv = k.get('mv', '').strip()
        sp = k.get('sp', '').strip()
        mk = k.get('mk', '').strip()
        en = k.get('Translation', '').strip()
        
        # Task 1: Strict Verbatim Verse Recitation (Teaches exact couplet)
        records.append({
            "instruction": f"திருக்குறள் எண் {num}-ன் முழுப் பாடல் வரிகளைத் தருக.",
            "input": "",
            "output": f"திருக்குறள் {num} (அதிகாரம் {ch_num}: {ch_name}):\n\n\"{line1}\n{line2}\""
        })
        
        # Task 2: Classical In-depth Commentary (Mu. Varadarajan)
        if mv:
            records.append({
                "instruction": f"குறள் {num}-ன் பொருள் என்ன? விளக்குக.",
                "input": f"குறள்:\n{verse}",
                "output": f"**திருக்குறள் {num}:**\n\"{verse}\"\n\n**அதிகாரம்:** {ch_name} ({paal})\n\n**உரை விளக்கம்:**\n{mv}"
            })
            
        # Task 3: Simple Everyday Life Lesson (Solomon Pappaiah)
        if sp:
            records.append({
                "instruction": f"குறள் {num}-ஐ எளிய தமிழில் மாணவர்களுக்குப் புரியும்படி கூறுக.",
                "input": f"குறள்: {verse}",
                "output": f"**எளிய விளக்கம்:**\n{sp}\n\n**வாழ்வியல் நீதி:** இக்குறள் நமக்கு உணர்த்துவது என்னவென்றால், வாழ்க்கையில் {ch_name} நெறியைக் கடைப்பிடித்து நல்வழியில் வாழ வேண்டும் என்பதாகும்."
            })
            
        # Task 4: Reverse Completion from Line 1
        records.append({
            "instruction": f"'{line1}' என்ற தொடக்கத்தைக் கொண்ட குறளை முழுமையாக்குக.",
            "input": "",
            "output": f"இப்பாடல் **குறள் எண் {num}** ஆகும்.\n\n**முழு குறள்:**\n{line1}\n{line2}\n\n**அதிகாரம்:** {ch_name} ({paal})\n**சுருக்கப் பொருள்:** {mv or sp}"
        })
        
        # Task 5: English Translation & Meaning
        if en:
            records.append({
                "instruction": f"What is the English translation and meaning of Thirukkural {num}?",
                "input": f"Verse:\n{verse}",
                "output": f"**Thirukkural #{num}** (Chapter {ch_num}: {ch_name} - {paal})\n\n**Couplet:**\n\"{verse}\"\n\n**English Translation:**\n{en}"
            })

    # Save to JSONL
    with open(out_path, 'w', encoding='utf-8') as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')
            
    print(f"Generated {len(records)} gold-standard training samples in '{out_path}'!")

if __name__ == '__main__':
    main()

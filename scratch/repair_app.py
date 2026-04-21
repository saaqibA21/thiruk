
import re

file_path = r'c:\Users\SAAQIB\thirukural\src\App.jsx'

# Try different encodings to read the corrupted file
encodings = ['utf-8', 'latin-1', 'cp1252', 'utf-16']
content = None
for enc in encodings:
    try:
        with open(file_path, 'r', encoding=enc) as f:
            content = f.read()
            print(f"Read successful with {enc}")
            break
    except Exception as e:
        print(f"Failed to read with {enc}: {e}")

if content:
    lines = content.splitlines(keepends=True)
    # Look for the start of the corrupted block
    start_idx = -1
    for i, line in enumerate(lines):
        if 'const lastTranslatedRef = useRef' in line:
            start_idx = i + 1
            break

    # Look for the end of the corrupted block (start of handleAsk)
    end_idx = -1
    for i, line in enumerate(lines):
        if 'const handleAsk = async' in line:
            end_idx = i
            break

    if start_idx != -1 and end_idx != -1:
        new_block = """
   useEffect(() => {
      if (!query.trim()) return;

      const hasEnglish = /[a-z]/i.test(query);
      const endsWithBoundary = /[\\s.,!?;]$/.test(query);
      
      if (!hasEnglish || !endsWithBoundary) {
         setIsTranslating(false);
         return;
      }

      const currentQuery = query;
      const timer = setTimeout(async () => {
         if (currentQuery !== query) return;

         setIsTranslating(true);
         try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(query)}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data && data[0]) {
               const translated = data[0].map(x => x[0]).join('');
               if (translated && translated !== query && query === currentQuery) {
                  lastTranslatedRef.current = translated;
                  setQuery(translated);
               }
            }
         } catch (err) {
            console.error("Translation error:", err);
         } finally {
            setIsTranslating(false);
         }
      }, 300);

      return () => clearTimeout(timer);
   }, [query]);

   const ATHIGARAMS = ["கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை", "அறன் வலியுறுத்தல்", "இல்வாழ்க்கை", "வாழ்க்கைத் துணைநலம்", "மக்கட்பேறு", "அன்புடைமை", "விருந்தோம்பல்", "இனியவை கூறல்", "செய்ந்நன்றியறிதல்", "நடுவுநிலைமை", "அடக்கமுடைமை", "ஒழுக்கமுடைமை", "பிறனில் விழையாமை", "பொறையுடைமை", "அழுக்காறாமை", "வெஃகாமை", "புறங்கூறாமை", "பயனில சொல்லாமை", "தீவினையச்சம்", "ஒப்புரவறிதல்", "ஈகை", "புகழ்", "அருளுடைமை", "புலால் மறுத்தல்", "தவம்", "கூடாஒழுக்கம்", "கள்ளாமை", "வாய்மை", "வெகுளாமை", "இன்னா செய்யாமை", "கொல்லாமை", "நிலையாமை", "துறவு", "மெய்யணர்தல்", "அவாவறுத்தல்", "ஊழ்", "இறைமாட்சி", "கல்வி", "கல்லாமை", "கேள்வி", "அறிவுடைமை", "குற்றங்கடிதல்", "பெரியாரைத் துணைக்கோடல்", "சிற்றினம் சேராமை", "தெரிந்துசெயல்வகை", "வலியறிதல்", "காலமறிதல்", "இடனறிதல்", "தெரிந்துதெளிதல்", "தெரிந்துவினையாடல்", "சுற்றந்தழால்", "பொச்சாவாமை", "செங்கோன்மை", "கொடுங்கோன்மை", "வெருவந்த செய்யாமை", "கண்ணோட்டம்", "ஒற்றாடல்", "ஊக்கமுடைமை", "மடியின்மை", "ஆள்வினையுடைமை", "இடுக்கண் அழியாமை", "அமைச்சு", "சொல்வன்மை", "வினைத்திட்பம்", "வினைசெயல்வகை", "தூது", "மன்னரைச் சேர்ந்தொழுதல்", "குறிப்பறிதல்", "அவையறிதல்", "அவையஞ்சாமை", "நாடு", "அரண்", "பொருள்செயல்வகை", "படைமாட்சி", "படைச்செருக்கு", "நட்பு", "நட்பாராய்தல்", "பழைமை", "தீய நட்பு", "கூடா நட்பு", "பேதைமை", "புல்லறிவாண்மை", "இகல்", "பகைமாட்சி", "பகைத்திறந்தெரிதல்", "உட்பகை", "பெரியாரைப் பிழையாமை", "பெண்வழிச் சேறல்", "வரைவின் மகளிர்", "கள்ளுண்ணாமை", "சூது", "மருந்து", "குடிமை", "மானம்பருமை", "சான்றாண்மை", "பண்புடைமை", "நன்றியில் செல்வம்", "நாணுடைமை", "குடிசெயல்வகை", "உழவு", "நல்குரவு", "இரவு", "இரவச்சம்", "கயமை", "தகையணங்குறுத்தல்", "குறிப்பறிதல்", "புணர்ச்சி மகிழ்தல்", "நலம்புனைந்துரைத்தல்", "காதல் சிறப்புரைத்தல்", "நாணுத்துறவுரைத்தல்", "அலரறிவுறுத்தல்", "பிரிவாற்றாமை", "படர்மெலிந்திரங்கல்", "கண்விதுப்பழிதல்", "பசப்புறு பருவரல்", "தனிப்படர் மிகுதி", "நினைந்தவர் புலம்பல்", "கனவுநிலை உரைத்தல்", "பொழுதுகண்டு இரங்கல்", "உறுப்புநலன் அழிதல்", "நெஞ்சொடு கிளத்தல்", "நிறையழிதல்", "அவர்வயின் விதும்பல்", "குறிப்பறிவுறுத்தல்", "புணர்ச்சி விதும்பல்", "நெஞ்சொடு புலத்தல்", "புலவி", "புலவி நுணுக்கம்", "ஊடலுவகை"];
"""
        final_lines = lines[:start_idx] + [new_block + "\n"] + lines[end_idx:]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(final_lines)
        print("Repair successful and saved as UTF-8.")
    else:
        print(f"Failed to find markers: start={start_idx}, end={end_idx}")
else:
    print("Could not read file with any encoding.")

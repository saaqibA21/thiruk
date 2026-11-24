/**
 * Curated kid-friendly question bank for Kids Mode games (Kural Jump & Quick Quiz)
 * 50 interactive, educational questions in Tamil & English with hints and explanations.
 */

export const KURAL_JUMP_QUESTIONS = [
  // --- Section 1: Core Thirukkural Facts & History (1-10) ---
  {
    id: 1,
    questionTa: "திருக்குறளை இயற்றிய உலகப் பொதுமறைப் புலவர் யார்?",
    questionEn: "Who composed the sacred and universal Thirukkural?",
    optionsTa: ["திருவள்ளுவர்", "கம்பர்", "பாரதியார்"],
    optionsEn: ["Thiruvalluvar", "Kambar", "Bharathiyar"],
    correctIndex: 0,
    hintTa: "அவர் கையில் ஓலைச்சுவடியும் எழுத்தாணியும் ஏந்தியவர்!",
    hintEn: "He is depicted holding a palm-leaf scroll and stylus!"
  },
  {
    id: 2,
    questionTa: "திருக்குறளில் மொத்தம் எத்தனை அதிகாரங்கள் உள்ளன?",
    questionEn: "How many chapters (Athigarams) are in Thirukkural?",
    optionsTa: ["133 அதிகாரங்கள்", "100 அதிகாரங்கள்", "1,330 அதிகாரங்கள்"],
    optionsEn: ["133 Chapters", "100 Chapters", "1,330 Chapters"],
    correctIndex: 0,
    hintTa: "கன்னியாகுமரி திருவள்ளுவர் சிலை இந்த எண்ணிக்கையிலான அடி உயரம் கொண்டது!",
    hintEn: "The Kanyakumari statue is exactly this many feet tall!"
  },
  {
    id: 3,
    questionTa: "திருக்குறளில் மொத்தம் எத்தனை குறட்பாக்கள் உள்ளன?",
    questionEn: "How many total couplets (Kurals) are in Thirukkural?",
    optionsTa: ["1,330 குறள்கள்", "1,000 குறள்கள்", "500 குறள்கள்"],
    optionsEn: ["1,330 Kurals", "1,000 Kurals", "500 Kurals"],
    correctIndex: 0,
    hintTa: "133 அதிகாரங்கள் × 10 குறள்கள் = 1,330!",
    hintEn: "133 chapters × 10 kurals = 1,330!"
  },
  {
    id: 4,
    questionTa: "திருக்குறளின் முதல் குறள் எந்த எழுத்தில் தொடங்குகிறது?",
    questionEn: "Which Tamil letter begins the very first Kural?",
    optionsTa: ["'அ'", "'க'", "'இ'"],
    optionsEn: ["'A' (அ)", "'Ka' (க)", "'I' (இ)"],
    correctIndex: 0,
    hintTa: "'அகர முதல எழுத்தெல்லாம்...'",
    hintEn: "'Agara mudhala ezhuththellaam...'"
  },
  {
    id: 5,
    questionTa: "திருக்குறள் மனித வாழ்வை எத்தனை பால்களாகப் பிரிக்கிறது?",
    questionEn: "Into how many sections (Paals) is Thirukkural divided?",
    optionsTa: ["3 பால்கள்", "4 பால்கள்", "7 பால்கள்"],
    optionsEn: ["3 Sections (Paals)", "4 Sections", "7 Sections"],
    correctIndex: 0,
    hintTa: "அறத்துப்பால், பொருட்பால், காமத்துப்பால் என மூன்று!",
    hintEn: "Virtue, Wealth, and Love (Aram, Porul, Inbam)!"
  },
  {
    id: 6,
    questionTa: "ஒரு திருக்குறளில் மொத்தம் எத்தனை அடிகள் (வரிகள்) உள்ளன?",
    questionEn: "How many lines does a Thirukkural couplet have?",
    optionsTa: ["2 அடிகள்", "4 அடிகள்", "3 அடிகள்"],
    optionsEn: ["2 Lines", "4 Lines", "3 Lines"],
    correctIndex: 0,
    hintTa: "முதல் வரி 4 சீர்கள், இரண்டாம் வரி 3 சீர்கள் என இரண்டு அடிகள்!",
    hintEn: "It is a short 2-line venba couplet!"
  },
  {
    id: 7,
    questionTa: "ஒரு திருக்குறளில் மொத்தம் எத்தனை சீர்கள் (சொற்கள்) உள்ளன?",
    questionEn: "How many words/metres (Seers) are in a single Kural?",
    optionsTa: ["7 சீர்கள் (4 + 3)", "8 சீர்கள் (4 + 4)", "6 சீர்கள் (3 + 3)"],
    optionsEn: ["7 Words (4 + 3)", "8 Words", "6 Words"],
    correctIndex: 0,
    hintTa: "முதல் வரியில் 4 சீர்கள், இரண்டாம் வரியில் 3 சீர்கள்!",
    hintEn: "4 words in the top line, 3 words in the bottom line!"
  },
  {
    id: 8,
    questionTa: "திருக்குறளுக்கு வழங்கும் வேறு சிறப்புப் பெயர் என்ன?",
    questionEn: "What is another revered title given to Thirukkural?",
    optionsTa: ["உலகப் பொதுமறை", "நாலடியார்", "சிலப்பதிகாரம்"],
    optionsEn: ["Ulaga Podhumarai (Universal Veda)", "Naaladiyaar", "Silappathikaaram"],
    correctIndex: 0,
    hintTa: "எல்லா நாட்டு மக்களுக்கும் பொதுவான அறம் கூறுவதால் இந்தப் பெயர்!",
    hintEn: "Because it teaches timeless morals common to all humanity!"
  },
  {
    id: 9,
    questionTa: "கன்னியாகுமரி கடலில் உள்ள திருவள்ளுவர் சிலை எத்தனை அடி உயரம் உள்ளது?",
    questionEn: "How many feet tall is the Thiruvalluvar Statue at Kanyakumari?",
    optionsTa: ["133 அடி", "100 அடி", "150 அடி"],
    optionsEn: ["133 Feet", "100 Feet", "150 Feet"],
    correctIndex: 0,
    hintTa: "133 அதிகாரங்களைக் குறிக்கும் வண்ணம் 133 அடியாக அமைக்கப்பட்டது!",
    hintEn: "A foot for every single one of the 133 chapters!"
  },
  {
    id: 10,
    questionTa: "திருக்குறளின் இறுதி குறள் (1330) எந்த எழுத்தில் முடிகிறது?",
    questionEn: "Which Tamil letter ends the very last Kural (1330)?",
    optionsTa: ["'ன்'", "'ம்'", "'ள்'"],
    optionsEn: ["'N' (ன்)", "'M' (ம்)", "'L' (ள்)"],
    correctIndex: 0,
    hintTa: "'அ'வில் தொடங்கி 'ன்'னில் முடிவது தமிழ் எழுத்துக்களின் அமைப்பைக் குறிக்கும்!",
    hintEn: "Starting with 'A' and ending with 'N' spans the Tamil alphabet!"
  },

  // --- Section 2: Kadavul Vaazhthu & Nature/Rain (11-18) ---
  {
    id: 11,
    questionTa: "திருக்குறளின் முதல் அதிகாரம் எது?",
    questionEn: "What is the first chapter of Thirukkural?",
    optionsTa: ["கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை"],
    optionsEn: ["Kadavul Vaazhthu (Praise of God)", "Vaan Sirappu (Glory of Rain)", "Neethaar Perumai"],
    correctIndex: 0,
    hintTa: "அகர முதல எழுத்தெல்லாம்... என தொடங்கும் அதிகாரம்!",
    hintEn: "The opening chapter that starts with Kural 1!"
  },
  {
    id: 12,
    questionTa: "விடுபட்ட சொல் என்ன? 'அகர முதல எழுத்தெல்லாம் ஆதி ________ முதற்றே உலகு'",
    questionEn: "Fill in the blank: 'Agara mudhala ezhuththellaam aadhi ________ mudhatre ulagu'",
    optionsTa: ["பகவன்", "மன்னன்", "மாதவன்"],
    optionsEn: ["Bhagavan", "Mannan", "Madhavan"],
    correctIndex: 0,
    hintTa: "எழுத்துக்களுக்கு 'அ' முதல், உலகிற்கு இறைவன் முதல்!",
    hintEn: "As letter A is first of letters, God is first of the universe!"
  },
  {
    id: 13,
    questionTa: "மழையின் சிறப்பைப் போற்றும் திருக்குறள் அதிகாரம் எது?",
    questionEn: "Which chapter praises the importance of rain for all life?",
    optionsTa: ["வான் சிறப்பு", "நீர்வளம்", "இயற்கை வாழ்த்து"],
    optionsEn: ["Vaan Sirappu (Glory of Rain)", "Neervalam", "Iyarkai Vaazhthu"],
    correctIndex: 0,
    hintTa: "அதிகாரம் எண் 2!",
    hintEn: "Chapter 2 of Thirukkural!"
  },
  {
    id: 14,
    questionTa: "விடுபட்ட சொல் என்ன? 'துப்பார்க்குத் துப்பாய துப்பாக்கித் துப்பார்க்குத் ________ தூஉம் மழை'",
    questionEn: "Fill in the blank: '...thuppaarkkuth ________ thoo-um mazhai'",
    optionsTa: ["துப்பாய", "அன்பாய", "இனிய"],
    optionsEn: ["Thuppaaya (Beneficent)", "Anbaaya (Loving)", "Iniya (Sweet)"],
    correctIndex: 0,
    hintTa: "உணவும் நீரளிக்கும் மழையின் நாக்குப்புரள் குறள்!",
    hintEn: "The famous rhythmic tongue-twister verse praising rain!"
  },
  {
    id: 15,
    questionTa: "மழை பெய்யாவிட்டால் பெரிய கடலுக்கும் என்ன நிகழும் என்று வள்ளுவர் கூறுகிறார்?",
    questionEn: "According to Thiruvalluvar, what happens even to the vast ocean if rain fails?",
    optionsTa: ["தன் வளம் குன்றும்", "அலைகள் அதிகமாகும்", "சூடாகிவிடும்"],
    optionsEn: ["Its richness diminishes", "Waves grow larger", "It heats up"],
    correctIndex: 0,
    hintTa: "'நெடுங்கடலும் தன்நீர்மை குன்றும் தடிந்தெழிலி தான்நல்கா தாகி விடின்'!",
    hintEn: "Even the vast ocean's riches diminish if rain clouds fail to give!"
  },
  {
    id: 16,
    questionTa: "விடுபட்ட சொல் என்ன? 'கற்றதனால் ஆய பயன்கொல் வாலறிவன் ________ தொழாஅர் எனின்'",
    questionEn: "Fill in the blank: '...vaalarivan ________ thozhaar enin'",
    optionsTa: ["நற்றாள்", "பொற்றாள்", "முற்றாள்"],
    optionsEn: ["Natraal (Good feet)", "Potraal (Golden feet)", "Mutraal"],
    correctIndex: 0,
    hintTa: "தூய அறிவுடைய இறைவனின் திருவடிகளை வணங்குவதே கற்றதன் பயன்!",
    hintEn: "Worshiping the feet of the all-wise is the true fruit of learning!"
  },
  {
    id: 17,
    questionTa: "உலகில் உணவுப் பொருள்களை விளைவிக்க இன்றியமையாதது எது?",
    questionEn: "What is essential for growing food crops in the world?",
    optionsTa: ["மழை நீர்", "மின்சாரம்", "காற்று மட்டும்"],
    optionsEn: ["Rain water", "Electricity", "Wind alone"],
    correctIndex: 0,
    hintTa: "வானிலிருந்து பொழியும் அமுதம்!",
    hintEn: "The nectar that showers down from the sky!"
  },
  {
    id: 18,
    questionTa: "விடுபட்ட சொல் என்ன? 'விண்இன்று பொய்ப்பின் விரிநீர் வியனுலகத்து ________ ஈண்டு தட்டலும் அரிது'",
    questionEn: "Fill in the blank: '...virineer viyanulagaththu ________ eendu thattalum aridhu'",
    optionsTa: ["உண்ணீர்", "புல்நீர்", "செந்நீர்"],
    optionsEn: ["Unneer (Drinking water)", "Pulneer", "Senneer"],
    correctIndex: 0,
    hintTa: "மழை பொய்த்தால் பசியும் தாகமும் உலகை வாட்டும்!",
    hintEn: "If rain fails, even drinking water becomes scarce!"
  },

  // --- Section 3: Love, Kindness & Sweet Words (19-27) ---
  {
    id: 19,
    questionTa: "விடுபட்ட சொல் என்ன? 'அன்பிலார் எல்லாம் தமக்குரியர் அன்புடையார் ________ உரியர் பிறர்க்கு'",
    questionEn: "Fill in the blank: 'Anbilaar ellaam... Anbudaiyaar ________ uriyar pirarkku'",
    optionsTa: ["என்பும்", "பொருளும்", "நாடும்"],
    optionsEn: ["Enbum (Even bones/body)", "Porulum (Wealth)", "Naadum (Land)"],
    correctIndex: 0,
    hintTa: "அன்புடையவர்கள் தம் உடம்பையும் பிறருக்காகக் கொடுப்பர்!",
    hintEn: "Loving people even give their own bones/self for others!"
  },
  {
    id: 20,
    questionTa: "இனிய சொல் இருக்கும்போது கசப்பான சொல் பேசுவது எதற்கு சமம்?",
    questionEn: "Speaking harsh words when sweet words exist is like doing what?",
    optionsTa: ["கனி இருக்கும்போது காய் தின்பது", "பூ இருக்கும்போது முள் தொடுவது", "பால் இருக்கும்போது கஞ்சி குடிப்பது"],
    optionsEn: ["Eating unripe fruit when ripe is available", "Touching thorns when flowers exist", "Drinking gruel when milk is there"],
    correctIndex: 0,
    hintTa: "'இனிய உளவாக இன்னாத கூறல் கனிஇருப்பக் காய்கவர்ந் தற்று'!",
    hintEn: "Like picking bitter raw fruit when sweet ripe fruit is ready!"
  },
  {
    id: 21,
    questionTa: "தீயினால் சுட்ட புண்ணை விட ஆறாத வடு எது?",
    questionEn: "Which wound leaves an unhealable scar deeper than a burn from fire?",
    optionsTa: ["நாவினால் சுட்ட கொடிய சொல்", "கத்தியால் வெட்டிய காயம்", "முள்ளால் குத்திய புண்"],
    optionsEn: ["Cruel words spoken by the tongue", "A cut from a blade", "A thorn prick"],
    correctIndex: 0,
    hintTa: "'தீயினாற் சுட்டபுண் உள்ளாறும் ஆறாதே நாவினாற் சுட்ட வடு'!",
    hintEn: "A burn from fire will heal inside, but the scar of a harsh tongue never fades!"
  },
  {
    id: 22,
    questionTa: "முகர்ந்தாலே வாடிவிடும் மிக மென்மையான மலர் எது என்று வள்ளுவர் குறிப்பிடுகிறார்?",
    questionEn: "Which delicate flower fades simply upon being smelled, according to Valluvar?",
    optionsTa: ["அனிச்ச மலர்", "தாமரை மலர்", "மல்லிகை மலர்"],
    optionsEn: ["Anicham Flower", "Lotus Flower", "Jasmine Flower"],
    correctIndex: 0,
    hintTa: "'மோப்பக் குழையும் அனிச்சம் முகந்திரிந்து நோக்கக் குழையும் விருந்து'!",
    hintEn: "The Anicham flower withers when smelled, just as a guest withers at a cold glance!"
  },
  {
    id: 23,
    questionTa: "நமக்குத் தீங்கு செய்தவருக்கு நாம் செய்ய வேண்டிய சிறந்த தண்டனை என்ன?",
    questionEn: "What is the noblest response to those who do us harm?",
    optionsTa: ["அவர் வெட்கப்படும்படி நன்மை செய்தல்", "பதிலுக்குத் தீங்கு செய்தல்", "கோபப்பட்டு சண்டையிடுதல்"],
    optionsEn: ["Do good to make them feel ashamed", "Do harm in return", "Get angry and fight"],
    correctIndex: 0,
    hintTa: "'இன்னாசெய்தாரை ஒறுத்தல் அவர்நாண நன்னயம் செய்து விடல்'!",
    hintEn: "Overcome harm with kindness so their own conscience awakens!"
  },
  {
    id: 24,
    questionTa: "விடுபட்ட சொல் என்ன? 'அன்பின் வழியது உயர்நிலை அஃதிலார்க்கு ________ தோல் போர்த்த உடம்பு'",
    questionEn: "Fill in the blank: '...enbu thol portha ________'",
    optionsTa: ["என்புதோல்", "பொன்நகை", "பட்டுத்துணி"],
    optionsEn: ["Enbuthol (Bones & skin)", "Ponnagai", "Pattuthuni"],
    correctIndex: 0,
    hintTa: "அன்பில்லாத உடல் எலும்பின் மேல் தோல் போர்த்திய கூடு மட்டுமே!",
    hintEn: "Without love, a human body is merely skin stretched over bone!"
  },
  {
    id: 25,
    questionTa: "விடுபட்ட சொல் என்ன? 'பணிவுடையன் ________ ஆதல் ஒருவற்கு அணியல்ல மற்றுப் பிற'",
    questionEn: "Fill in the blank: 'Panivudaiyan ________ aadhal oruvatku...'",
    optionsTa: ["இன்சொலன்", "செல்வந்தன்", "வீரன்"],
    optionsEn: ["Insolan (Sweet-spoken)", "Selvandhan", "Veeran"],
    correctIndex: 0,
    hintTa: "பணிவும் இனிய சொல்லுமே ஒரு மனிதனுக்கு உண்மையான அணிகலன்!",
    hintEn: "Humility and sweet words are a person's true ornaments!"
  },
  {
    id: 26,
    questionTa: "தக்க சமயத்தில் செய்த உதவி அளவால் சிறியதாக இருந்தாலும் எதை விடப் பெரியது?",
    questionEn: "Even if small, help done in times of desperate need is greater than what?",
    optionsTa: ["உலகை விடப் பெரியது", "மலையை விடப் பெரியது", "கடலை விடப் பெரியது"],
    optionsEn: ["Greater than the whole world (Gnaalam)", "Bigger than a mountain", "Wider than the sea"],
    correctIndex: 0,
    hintTa: "'காலத்தினாற் செய்த நன்றி சிறிதுஎனினும் ஞாலத்தின் மாணப் பெரிது'!",
    hintEn: "A timely favor, though small in size, is vaster than the earth!"
  },
  {
    id: 27,
    questionTa: "உடலின் புறத்தூய்மை நீரால் ஏற்படும்; உள்ளத்தின் அகத்தூய்மை எதனால் ஏற்படும்?",
    questionEn: "Outer body is cleaned by water; by what is inner purity revealed?",
    optionsTa: ["வாய்மையால் (உண்மையால்)", "விலையுயர்ந்த ஆடைகளால்", "நறுமணப் பூக்களால்"],
    optionsEn: ["Truthfulness (Vaaimai)", "Costly clothes", "Fragrant flowers"],
    correctIndex: 0,
    hintTa: "'புறந்தூய்மை நீரான் அமையும் அகந்தூய்மை வாய்மையால் காணப்படும்'!",
    hintEn: "Outward purity comes from water; inward purity shines from truthfulness!"
  },

  // --- Section 4: Animals, Birds & Nature Metaphors (28-33) ---
  {
    id: 28,
    questionTa: "தான் பெற்ற உணவை மறைக்காமல் தன் இனத்தை அழைத்து உண்ணும் பறவை எது?",
    questionEn: "Which bird shares its food by calling out to its entire flock?",
    optionsTa: ["காகம் (காக்கை)", "மயில்", "கிளி"],
    optionsEn: ["Crow (Kaakkai)", "Peacock", "Parrot"],
    correctIndex: 0,
    hintTa: "'காக்கை கரவா கரைந்துண்ணும் ஆக்கமும் அன்னநீ ரார்க்கே உள'!",
    hintEn: "The crow conceals not its food, but calls its kin to share!"
  },
  {
    id: 29,
    questionTa: "தன் ஐந்து உறுப்புகளையும் ஆபத்தின் போது உள்ளிழுத்துக் கொள்ளும் விலங்கு எது?",
    questionEn: "Which creature withdraws all five limbs into its shell for self-control?",
    optionsTa: ["ஆமை", "யானை", "முயல்"],
    optionsEn: ["Tortoise (Aamai)", "Elephant", "Rabbit"],
    correctIndex: 0,
    hintTa: "'ஒருமையுள் ஆமைபோல் ஐந்தடக்கல் ஆற்றின் எழுமையும் ஏமாப் புடைத்து'!",
    hintEn: "Like a tortoise drawing in its five limbs, guard your senses!"
  },
  {
    id: 30,
    questionTa: "மணலில் தோண்டத் தோண்ட ஊற்றுநீர் பெருகுவது போல, படிக்கப் படிக்கப் பெருகுவது எது?",
    questionEn: "Just as water wells up the deeper you dig sand, what increases the more you study?",
    optionsTa: ["அறிவு", "செல்வம்", "வயது"],
    optionsEn: ["Wisdom (Arivu)", "Wealth", "Age"],
    correctIndex: 0,
    hintTa: "'தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக் கற்றனைத் தூறும் அறிவு'!",
    hintEn: "The deeper you dig, the more water springs; the more you study, the more wisdom flows!"
  },
  {
    id: 31,
    questionTa: "தாமரை மலரின் தண்டு நீர் உயரத்திற்கு ஏற்ப வளர்வது போல, மனிதனின் உயர்வு எதைச் சார்ந்தது?",
    questionEn: "As a lotus stem rises with water depth, on what does a human's greatness depend?",
    optionsTa: ["மன ஊக்கம் (எண்ணத்தின் உறுதி)", "உடலின் உயரம்", "வீட்டின் அழகு"],
    optionsEn: ["Inner zeal / ambition (Ookkam)", "Physical height", "House decoration"],
    correctIndex: 0,
    hintTa: "'வெள்ளத் தனைய மலர்நீட்டம் மாந்தர்தம் உள்ளத் தனையது உயர்வு'!",
    hintEn: "A lotus stem grows as deep as the water; a person rises as high as their resolve!"
  },
  {
    id: 32,
    questionTa: "உடலின் ஆடை நழுவும் போது உடனே காக்கும் கையைப் போல இருக்க வேண்டியது எது?",
    questionEn: "Like a reflex hand pulling up slipping clothes, what should come to our rescue in distress?",
    optionsTa: ["உண்மையான நட்பு", "பணம்", "புகழ்"],
    optionsEn: ["True friendship (Natpu)", "Money", "Fame"],
    correctIndex: 0,
    hintTa: "'உடுக்கை இழந்தவன் கைபோல ஆங்கே இடுக்கண் களைவதாம் நட்பு'!",
    hintEn: "True friendship instantly removes grief, just like a hand catching slipping clothes!"
  },
  {
    id: 33,
    questionTa: "உழவுத் தொழிலின் சிறப்பைப் போற்றும் திருவள்ளுவரின் குறள் தொடக்கம் எது?",
    questionEn: "How does Valluvar's famous verse in praise of farmers begin?",
    optionsTa: ["சுழன்றும்ஏர்ப் பின்னது உலகம்", "மழைநீர் இன்றி வாழாது", "வானம் பார்த்த பூமி"],
    optionsEn: ["Suzhandrum erp pinnadhu ulagam", "Mazhai neer indri", "Vaanam paartha"],
    correctIndex: 0,
    hintTa: "உலகம் பல தொழில்களில் சுழன்றாலும் உழவரின் ஏருக்குப் பின்னேதான் இயங்குகிறது!",
    hintEn: "Though the world turns in many crafts, it must follow behind the farmer's plough!"
  },

  // --- Section 5: Learning, Education & Effort (34-42) ---
  {
    id: 34,
    questionTa: "விடுபட்ட சொல் என்ன? 'கற்க கசடறக் கற்பவை கற்றபின் நிற்க அதற்குத் ________'",
    questionEn: "Fill in the blank: 'Katka kasadarak karpavai katrapin nirka adharkkuth ________'",
    optionsTa: ["தக", "நிறை", "பயன்"],
    optionsEn: ["Thaga (In accordance)", "Nirai", "Payan"],
    correctIndex: 0,
    hintTa: "கற்ற கல்வியின்படி ஒழுக்கத்தோடு வாழ வேண்டும்!",
    hintEn: "Learn faultlessly, and then live in true accordance with that learning!"
  },
  {
    id: 35,
    questionTa: "மனிதர்களுக்கு இரண்டு அழகிய கண்களைப் போன்றது என்று வள்ளுவர் எவற்றைக் கூறுகிறார்?",
    questionEn: "Which two disciplines does Valluvar call the living eyes of humanity?",
    optionsTa: ["எண்ணும் எழுத்தும் (கணிதமும் மொழியும்)", "பணமும் நகையும்", "வீடும் நிலமும்"],
    optionsEn: ["Numbers and Letters (Math & Language)", "Money & Jewels", "House & Land"],
    correctIndex: 0,
    hintTa: "'எண்ணென்ப ஏனை எழுத்தென்ப இவ்விரண்டும் கண்ணென்ப வாழும் உயிர்க்கு'!",
    hintEn: "Numbers and letters are said to be the two eyes of human beings!"
  },
  {
    id: 36,
    questionTa: "விதியே தடுத்தாலும், ஒருவன் மெய்வருந்தச் செய்யும் உழைப்பு எதைத் தரும்?",
    questionEn: "Even if fate opposes, what does tireless bodily effort guarantee?",
    optionsTa: ["உழைப்புக்குரிய பலன் கூலியாகக் கிடைக்கும்", "தோல்வி மட்டுமே கிடைக்கும்", "பயன் ஒன்றும் இல்லை"],
    optionsEn: ["Reward for one's honest sweat", "Only defeat", "No benefit"],
    correctIndex: 0,
    hintTa: "'தெய்வத்தான் ஆகா தெனினும் முயற்சிதன் மெய்வருத்தக் கூலி தரும்'!",
    hintEn: "Though divine destiny fail, persistent labor pays its wages!"
  },
  {
    id: 37,
    questionTa: "எப்பொருள் யார் யார் வாய்க் கேட்டாலும் ஒருவன் செய்ய வேண்டிய அறிவுசார் செயல் என்ன?",
    questionEn: "Whoever speaks whatever words, what is the duty of true wisdom?",
    optionsTa: ["அவற்றின் உண்மைப் பொருளை ஆராய்ந்து அறிதல்", "அப்படியே கண்மூடித்தனமாக நம்புதல்", "கேட்டவுடன் சண்டையிடுதல்"],
    optionsEn: ["Discern the underlying truth (Meipporul)", "Blindly believe it", "Fight immediately"],
    correctIndex: 0,
    hintTa: "'எப்பொருள் யார்யார்வாய்க் கேட்பினும் அப்பொருள் மெய்ப்பொருள் காண்ப தறிவு'!",
    hintEn: "To perceive the truth in whatever anyone says is true wisdom!"
  },
  {
    id: 38,
    questionTa: "ஒருவன் எப்போதும் எப்படிப்பட்ட எண்ணங்களையே எண்ண வேண்டும்?",
    questionEn: "What kind of thoughts should a noble mind always cultivate?",
    optionsTa: ["உயர்வான நற்சிந்தனைகள்", "எளிதான சிந்தனைகள்", "பிறரை வீழ்த்தும் சிந்தனைகள்"],
    optionsEn: ["High and lofty aspirations", "Lazy thoughts", "Harmful thoughts"],
    correctIndex: 0,
    hintTa: "'உள்ளுவ தெல்லாம் உயர்வுள்ளல் மற்றது தள்ளினும் தள்ளாமை நீர்த்து'!",
    hintEn: "Let all your thoughts be lofty; even if thwarted, your spirit remains high!"
  },
  {
    id: 39,
    questionTa: "தந்தை தன் மகனுக்குச் செய்யும் சிறந்த உதவி எது என்று வள்ளுவர் கூறுகிறார்?",
    questionEn: "What is the best duty a father can do for his child?",
    optionsTa: ["அறிஞர்கள் அவையில் முந்தி இருக்கச் செய்தல்", "நிறைய பணம் சேர்த்து வைத்தல்", "பெரிய மாளிகை கட்டித் தருதல்"],
    optionsEn: ["Make them stand foremost among scholars", "Gather huge wealth", "Build a palace"],
    correctIndex: 0,
    hintTa: "'தந்தை மகற்குஆற்றும் நன்றி அவையத்து முந்தி இருப்பச் செயல்'!",
    hintEn: "To ensure the child sits foremost in the assembly of learned scholars!"
  },
  {
    id: 40,
    questionTa: "மகன் தன் தந்தைக்குச் செய்ய வேண்டிய பெருமைமிகு கைம்மாறு என்ன?",
    questionEn: "What is the proudest tribute a child can render to their parents?",
    optionsTa: ["'இவனைப் பெற என்ன தவம் செய்தாரோ' என்று உலகம் புகழ வாழ்வது", "அடிக்கடி பரிசுப் பொருள்கள் தருவது", "பெயரைச் சொல்லிப் பேசுவது"],
    optionsEn: ["Living so people say 'What penance did the father do to get this child!'", "Giving gifts", "Naming them"],
    correctIndex: 0,
    hintTa: "'மகன் தந்தைக்கு ஆற்றும் உதவி இவன்தந்தை என்னோற்றான் கொல்எனும் சொல்'!",
    hintEn: "Conducting yourself so people praise your parents' devotion!"
  },
  {
    id: 41,
    questionTa: "ஒரு மனிதனுக்கு உயிரை விட மேலானதாகப் போற்றிக் காக்கப்பட வேண்டியது எது?",
    questionEn: "What should be protected even more dearly than one's own life?",
    optionsTa: ["நல் ஒழுக்கம்", "விலையுயர்ந்த ஆடை", "பொன் பொருள்"],
    optionsEn: ["Good Conduct / Character (Ozhukkam)", "Expensive dress", "Gold and jewels"],
    correctIndex: 0,
    hintTa: "'ஒழுக்கம் விழுப்பம் தரலான் ஒழுக்கம் உயிரினும் ஓம்பப் படும்'!",
    hintEn: "Character gives dignity; therefore guard conduct more than life itself!"
  },
  {
    id: 42,
    questionTa: "சென்னை நகரில் 1330 குறள்களும் செதுக்கப்பட்ட பிரம்மாண்ட கல் தேர் உள்ள இடம் எது?",
    questionEn: "Where in Chennai is the grand stone chariot memorial with all 1330 Kurals carved?",
    optionsTa: ["வள்ளுவர் கோட்டம்", "மெரினா கடற்கரை", "சென்ட்ரல் ரயில் நிலையம்"],
    optionsEn: ["Valluvar Kottam", "Marina Beach", "Central Station"],
    correctIndex: 0,
    hintTa: "நுங்கம்பாக்கத்தில் அமைந்துள்ள திருவள்ளுவர் நினைவகம்!",
    hintEn: "The famous monument located in Nungambakkam, Chennai!"
  },

  // --- Section 6: Wisdom Puzzles & Kural Fill-in-the-Blanks (43-50) ---
  {
    id: 43,
    questionTa: "விடுபட்ட சொல் என்ன? 'தீயினாற் சுட்டபுண் உள்ளாறும் ஆறாதே ________ சுட்ட வடு'",
    questionEn: "Fill in the blank: 'Theeyinaat suttapun ullaarum aaraadhe ________ sutta vadu'",
    optionsTa: ["நாவினாற்", "கையினாற்", "தீயினாற்"],
    optionsEn: ["Naavinaal (By the tongue)", "Kaiyinaal", "Theeyinaal"],
    correctIndex: 0,
    hintTa: "கொடிய சொற்களைப் பேசும் நாக்கு!",
    hintEn: "The sharp and bitter tongue that hurts feelings!"
  },
  {
    id: 44,
    questionTa: "விடுபட்ட சொல் என்ன? 'எப்பொருள் எத்தன்மைத் தாயினும் அப்பொருள் ________ காண்ப தறிவு'",
    questionEn: "Fill in the blank: '...apporul ________ kaanba dharivu'",
    optionsTa: ["மெய்ப்பொருள்", "பொய்ப்பொருள்", "நுண்பொருள்"],
    optionsEn: ["Meipporul (True essence)", "Poypporul", "Nunporul"],
    correctIndex: 0,
    hintTa: "எதன் தோற்றத்தைக் கண்டும் ஏமாறாமல் உண்மையை உணர்வதே அறிவு!",
    hintEn: "To see the true underlying reality behind any appearance!"
  },
  {
    id: 45,
    questionTa: "விடுபட்ட சொல் என்ன? 'வாய்மை எனப்படுவது யாதெனின் யாதொன்றும் ________ இலாத சொலல்'",
    questionEn: "Fill in the blank: 'Vaaimai enappaduvadhu yaadhenin yaadhandrum ________ ilaadha solal'",
    optionsTa: ["தீமை", "நன்மை", "உண்மை"],
    optionsEn: ["Theemai (Harm/Evil)", "Nanmai", "Unmai"],
    correctIndex: 0,
    hintTa: "எவருக்கும் சிறிதும் துன்பம் தராத சொற்களைப் பேசுவதே வாய்மை!",
    hintEn: "Truth is speaking words that cause no harm to any living creature!"
  },
  {
    id: 46,
    questionTa: "விடுபட்ட சொல் என்ன? 'செயற்கரிய செய்வார் பெரியர் சிறியர் செயற்கரிய ________ தார்'",
    questionEn: "Fill in the blank: 'Seyarkariya seyvaar periyar siriyar seyarkariya ________ dhaar'",
    optionsTa: ["செய்கலா", "செய்கின்ற", "சொல்கின்ற"],
    optionsEn: ["Seygalaa (Those who cannot)", "Seygindra", "Solgindra"],
    correctIndex: 0,
    hintTa: "அரிய கடினமான செயல்களைச் சாதித்துக் காட்டுபவரே பெரியோர்!",
    hintEn: "Those who achieve great and difficult feats are noble!"
  },
  {
    id: 47,
    questionTa: "விடுபட்ட சொல் என்ன? 'அழுக்காறு எனாஒரு பாவி திருச்செற்றுத் ________ உய்த்து விடும்'",
    questionEn: "Fill in the blank: 'Azhukkaarru enaa-oru paavi... ________ uyththu vidum'",
    optionsTa: ["தீயுழி", "நல்வழி", "வான்வழி"],
    optionsEn: ["Theeyuzhi (Into misery)", "Nalvazhi", "Vaanvazhi"],
    correctIndex: 0,
    hintTa: "பொறாமை என்னும் தீய குணம் ஒருவனை அழிவுப்பாதைக்கு இழுத்துச் செல்லும்!",
    hintEn: "Envy is a destructive monster that drags one down!"
  },
  {
    id: 48,
    questionTa: "ஒரு வணிகன் செய்யும் வியாபாரத்தில் சிறந்த தர்மம் எது என்று வள்ளுவர் கூறுகிறார்?",
    questionEn: "What is the highest moral principle for a merchant in business?",
    optionsTa: ["பிறர் பொருளையும் தன் பொருள் போலக் காத்து நேர்மையாகச் செய்தல்", "அதிக லாபம் சம்பாதிப்பது", "தரம் குறைந்த பொருளை விற்பது"],
    optionsEn: ["Treating others' goods like one's own with fair justice", "Max profit", "Selling cheap goods"],
    correctIndex: 0,
    hintTa: "'வாணிகம் செய்வார்க்கு வாணிகம் பேணிப் பிறவும் தமபோல் செயின்'!",
    hintEn: "Just trade means guarding another's interest as carefully as one's own!"
  },
  {
    id: 49,
    questionTa: "விடுபட்ட சொல் என்ன? 'காலம் கருதி இருப்பர் கலங்காது ஞாலம் ________ பவர்'",
    questionEn: "Fill in the blank: '...gnaalam ________ bavar'",
    optionsTa: ["கருது", "மறக்", "வெறுப்"],
    optionsEn: ["Karudhu (Those who seek to win the world)", "Marak", "Verup"],
    correctIndex: 0,
    hintTa: "பெரிய இலக்கை அடைய நினைப்பவர் தகுந்த காலம் வரும் வரை பொறுமையோடு காத்திருப்பர்!",
    hintEn: "Those who seek great victories wait patiently for the right time!"
  },
  {
    id: 50,
    questionTa: "விடுபட்ட சொல் என்ன? 'இடன்அறிந்து என்செயினும் செய்வற்க களம்அறிந்து ________ எறியா வழி'",
    questionEn: "Fill in the blank: '...veriyaa vazhi'",
    optionsTa: ["வெஞ்ஞமன்", "மன்னவன்", "படைவீரன்"],
    optionsEn: ["Venjnaman (Fierce conflict)", "Mannavan", "Padaiveeran"],
    correctIndex: 0,
    hintTa: "இடத்தின் தன்மையை அறிந்து திட்டமிட்டுச் செயல்பட வேண்டும்!",
    hintEn: "Always understand the proper place and ground before taking action!"
  }
];

/**
 * Returns a randomized question with dynamically shuffled option positions
 * so the correct answer is NOT always in the same slot.
 */
export const getRandomQuestion = (excludeIds = []) => {
  const pool = KURAL_JUMP_QUESTIONS.filter(q => !excludeIds.includes(q.id));
  const base = pool.length > 0 
    ? pool[Math.floor(Math.random() * pool.length)]
    : KURAL_JUMP_QUESTIONS[Math.floor(Math.random() * KURAL_JUMP_QUESTIONS.length)];
  
  // Shuffle option indices [0, 1, 2] to randomize button order
  const indices = [0, 1, 2].sort(() => Math.random() - 0.5);
  const newCorrectIndex = indices.indexOf(base.correctIndex);

  return {
    ...base,
    optionsTa: indices.map(i => base.optionsTa[i]),
    optionsEn: indices.map(i => base.optionsEn[i]),
    correctIndex: newCorrectIndex
  };
};

/**
 * Returns a set of distinct, randomized questions for a multi-round quiz session.
 */
export const getQuizSet = (count = 5) => {
  const shuffled = [...KURAL_JUMP_QUESTIONS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, KURAL_JUMP_QUESTIONS.length));

  return selected.map(base => {
    const indices = [0, 1, 2].sort(() => Math.random() - 0.5);
    const newCorrectIndex = indices.indexOf(base.correctIndex);
    return {
      ...base,
      optionsTa: indices.map(i => base.optionsTa[i]),
      optionsEn: indices.map(i => base.optionsEn[i]),
      correctIndex: newCorrectIndex
    };
  });
};

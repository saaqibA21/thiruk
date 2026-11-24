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
  },
  {
    id: 51,
    questionTa: "தன் மகனைப் பலர் புகழும் சான்றோன் எனக் கேட்கும்போது ஒரு தாய்க்கு ஏற்படும் உணர்வு என்ன?",
    questionEn: "What does a mother feel when she hears people praise her child as noble and wise?",
    optionsTa: ["அவனைப் பெற்றெடுத்த போது அடைந்த மகிழ்ச்சியை விடப் பெருமகிழ்ச்சி", "பொறாமை உணர்வு", "வருத்தம்"],
    optionsEn: ["Greater joy than the day she gave birth", "Envy", "Worry"],
    correctIndex: 0,
    hintTa: "ஈன்ற பொழுதின் பெரிதுவக்கும் தன்மகனைச் சான்றோன் எனக்கேட்ட தாய்!",
    hintEn: "A mother rejoices more on hearing her child praised than on the day of birth!"
  },
  {
    id: 52,
    questionTa: "புல்லாங்குழலும் வீணையும் தரும் இசையை விட இனிமையானது எது என்று வள்ளுவர் கூறுகிறார்?",
    questionEn: "What sound does Valluvar say is even sweeter than the flute or the lute (Veena)?",
    optionsTa: ["தன் குழந்தைகளின் மழலைச் சொல்", "பறவைகளின் சத்தம்", "கடல் அலை ஓசை"],
    optionsEn: ["The sweet lisping chatter of one's own children", "Birdsong", "Sound of waves"],
    correctIndex: 0,
    hintTa: "குழலினிது யாழினிது என்பதம் மக்கள் மழலைச்சொல் கேளாதவர்!",
    hintEn: "'Sweet is the flute, sweet the lute,' say those who haven't heard children's talk!"
  },
  {
    id: 53,
    questionTa: "இல்லற வாழ்க்கையின் மிக முக்கியமான நோக்கம் என்ன என்று வள்ளுவர் கூறுகிறார்?",
    questionEn: "What is the primary noble duty of running a household according to Valluvar?",
    optionsTa: ["விருந்தினரை உபசரித்து உதவி செய்தல்", "பணம் சேர்ப்பது மட்டும்", "பெரிய மாளிகையில் வாழ்வது"],
    optionsEn: ["Welcoming and serving guests with kindness", "Hoarding money", "Living in a palace"],
    correctIndex: 0,
    hintTa: "இருந்தோம்பி இல்வாழ்வ தெல்லாம் விருந்தோம்பி வேளாண்மை செய்தற் பொருட்டு!",
    hintEn: "The purpose of a home is to lovingly receive guests and help others!"
  },
  {
    id: 54,
    questionTa: "தன்னைத் தோண்டுபவரையும் விழாமல் தாங்கும் பூமியைப் போல நாம் எதைக் கடைப்பிடிக்க வேண்டும்?",
    questionEn: "Like the earth bearing even those who dig into it, what supreme virtue should we practice?",
    optionsTa: ["தம்மை இகழ்பவரையும் பொறுத்துக் கொள்ளும் பொறுமை", "பதிலுக்குப் பழிவாங்குவது", "கோபப்படுவது"],
    optionsEn: ["Patience to forgive those who insult us (Porumai)", "Taking revenge", "Getting furious"],
    correctIndex: 0,
    hintTa: "அகழ்வாரைத் தாங்கும் நிலம்போலத் தம்மை இகழ்வார்ப் பொறுத்தல் தலை!",
    hintEn: "Patience that bears insults, just as mother earth supports those who dig her!"
  },
  {
    id: 55,
    questionTa: "ஒருவன் எதைக் காக்காவிட்டாலும் எதை மட்டும் கட்டாயம் அடக்கிக் காக்க வேண்டும்?",
    questionEn: "Even if unable to guard anything else, what must a wise person strictly guard?",
    optionsTa: ["தன் நாவை (பேச்சை)", "தன் பணத்தை", "தன் வீட்டை"],
    optionsEn: ["One's tongue / speech", "Money", "House"],
    correctIndex: 0,
    hintTa: "யாகாவா ராயினும் நாகாக்க காவாக்கால் சோகாப்பர் சொல்லிழுக்குப் பட்டு!",
    hintEn: "Whatever you fail to guard, guard your tongue; otherwise words will cause sorrow!"
  },
  {
    id: 56,
    questionTa: "பயனற்ற சொற்களைப் பேசுபவரை வள்ளுவர் எவ்வாறு குறிப்பிடுகிறார்?",
    questionEn: "How does Valluvar describe someone who utters meaningless, empty words?",
    optionsTa: ["மனிதர்களில் பதர் போன்றவர்", "அறிவாளி", "மாவீரர்"],
    optionsEn: ["Chaff among humans (Padhar)", "A wise person", "A great hero"],
    correctIndex: 0,
    hintTa: "பயனில்சொல் பாராட்டுவானை மகன்எனல் மக்கட் பதடி எனல்!",
    hintEn: "Call not that person human who prattles useless words; call them chaff!"
  },
  {
    id: 57,
    questionTa: "விடுபட்ட சொல் என்ன? 'சொல்லுக சொல்லிற் பயனுடைய சொல்லற்க சொல்லிற் ________ சொல்'",
    questionEn: "Fill in the blank: '...sollarka sollir ________ sol'",
    optionsTa: ["பயனிலா", "இனிய", "வலிய"],
    optionsEn: ["Payanilaa (Fruitless words)", "Iniya", "Valiya"],
    correctIndex: 0,
    hintTa: "பயன் தரும் சொற்களைப் பேச வேண்டும், பயனற்ற வெற்றுச் சொற்களைப் பேசக்கூடாது!",
    hintEn: "Speak words that bear good fruit; never utter empty, useless words!"
  },
  {
    id: 58,
    questionTa: "உயர் குடிப்பிறந்தவர்களுக்கு அழகு தருவது எது?",
    questionEn: "What is the true crowning jewel for someone of noble character?",
    optionsTa: ["எல்லோரிடமும் பணிவுடன் அடங்கி நடப்பது", "அகம்பாவம் காட்டுவது", "விலையுயர்ந்த உடைகள் அணிவது"],
    optionsEn: ["Practicing humility toward everyone", "Showing arrogance", "Wearing expensive silk"],
    correctIndex: 0,
    hintTa: "பணியுமாம் என்றும் பெருமை சிறுமை அணியுமாம் தன்னை வியந்து!",
    hintEn: "True greatness is humble; pettiness boasts and admires itself!"
  },
  {
    id: 59,
    questionTa: "ஒரு மனிதன் செய்யத்தகாத இழிவான காரியங்களைச் செய்ய வெட்கப்படும் பண்பு எது?",
    questionEn: "What is the noble feeling of shrinking in shame from doing dishonorable deeds?",
    optionsTa: ["நாணம் / நாணுடைமை", "கோழைத்தனம்", "சோம்பல்"],
    optionsEn: ["Moral shame (Naanudaimai)", "Cowardice", "Laziness"],
    correctIndex: 0,
    hintTa: "தவறான காரியங்களைச் செய்ய அஞ்சுவதே சான்றோரின் நற்பண்பு!",
    hintEn: "Shrinking from unethical deeds is the hallmark of true dignity!"
  },
  {
    id: 60,
    questionTa: "கைம்மாறு கருதாமல் செய்யப்படும் உதவிக்கு ஈடாக எதைச் சொல்ல முடியாது?",
    questionEn: "What can never match the worth of help given without expecting anything in return?",
    optionsTa: ["வானகமும் வையகமும்", "ஒரு மூட்டை தங்கம்", "பெரிய கோட்டை"],
    optionsEn: ["Both heaven and earth together", "A bag of gold", "A large castle"],
    correctIndex: 0,
    hintTa: "செய்யாமல் செய்த உதவிக்கு வையகமும் வானகமும் ஆற்றல் அரிது!",
    hintEn: "Help rendered without previous obligation exceeds the worth of earth and heaven!"
  },
  {
    id: 61,
    questionTa: "ஒருவனுக்கு எப்போதும் அழியாத உண்மையான மிகச்சிறந்த செல்வம் எது?",
    questionEn: "What is the single imperishable, true wealth of every human being?",
    optionsTa: ["கல்விச் செல்வம்", "பொன் நகை", "பண மூட்டைகள்"],
    optionsEn: ["Wealth of Education (Kalvi)", "Gold jewelry", "Bags of cash"],
    correctIndex: 0,
    hintTa: "கேடில் விழுச்செல்வம் கல்வி ஒருவற்கு மாடல்ல மற்றை யவை!",
    hintEn: "Education is the indestructible treasure; all other possessions are not true wealth!"
  },
  {
    id: 62,
    questionTa: "ஒரு பிறவியில் ஒருவன் கற்றுக்கொண்ட கல்வி எத்தனை பிறவிகளுக்கும் அவனுக்குத் துணையாக வரும்?",
    questionEn: "According to traditional verse, how many future lives does learning protect a person?",
    optionsTa: ["ஏழு பிறவிகளுக்கும்", "ஒரு பிறவிக்கு மட்டும்", "பத்து பிறவிகளுக்கு"],
    optionsEn: ["Across seven lifetimes (Ezhumai)", "Only one lifetime", "Ten lifetimes"],
    correctIndex: 0,
    hintTa: "ஒருமைக்கண் தான் கற்ற கல்வி ஒருவற்கு எழுமையும் ஏமாப் புடைத்து!",
    hintEn: "The wisdom a person learns in one birth protects them for seven generations!"
  },
  {
    id: 63,
    questionTa: "கற்றறிந்த மேதைக்கு எந்த நாடு மற்றும் ஊர் தன்னுடையதாக இருக்கும்?",
    questionEn: "For an educated scholar, which land and town belongs to them?",
    optionsTa: ["செல்லும் இடமெல்லாம் சொந்த நாடாகவும் ஊராகவும் அமையும்", "தான் பிறந்த ஊர் மட்டுமே", "அண்டை நாடு மட்டுமே"],
    optionsEn: ["Every land and town wherever they go", "Only birth town", "Only neighboring land"],
    correctIndex: 0,
    hintTa: "யாதானும் நாடாமல் ஊராமால் என்னொருவன் சாந்துணையும் கல்லாத வாறு!",
    hintEn: "Since every land is their own to a scholar, why should anyone stop learning until death?"
  },
  {
    id: 64,
    questionTa: "கற்றறிந்த நல்லறிஞர்களோடு ஒப்பிடும்போது கல்லாத மூடர்கள் எதற்கு ஒப்பாவார்கள்?",
    questionEn: "Compared to learned noble scholars, uneducated ignorant people are like what?",
    optionsTa: ["மனிதர்களோடு விலங்குகள் போன்றவர்கள்", "வானத்து விண்மீன்கள்", "கடல் மீன்கள்"],
    optionsEn: ["Like beasts compared to human beings", "Stars in the sky", "Fish in the sea"],
    correctIndex: 0,
    hintTa: "விலங்கொடு மக்கள் அனையர் இலங்குநூல் கற்றாரோடு ஏனைய வர்!",
    hintEn: "As beasts stand to humans, so stand the illiterate to the learned!"
  },
  {
    id: 65,
    questionTa: "செல்வங்கள் எல்லாவற்றிலும் தலைசிறந்த தலையான செல்வம் எது என்று வள்ளுவர் கூறுகிறார்?",
    questionEn: "Which wealth does Valluvar declare to be the supreme foremost of all treasures?",
    optionsTa: ["செவிச்செல்வம் (நல்லறிஞர்களின் அறிவுரையைக் கேட்டறிதல்)", "தங்கச் செல்வம்", "நிலச் செல்வம்"],
    optionsEn: ["Listening to wisdom (Sevichchelvam)", "Gold treasure", "Real estate"],
    correctIndex: 0,
    hintTa: "செல்வத்துள் செல்வம் செவிச்செல்வம் அச்செல்வம் செல்வத்துள் எல்லாம் தலை!",
    hintEn: "The wealth of listening to wise instruction is the chief of all riches!"
  },
  {
    id: 66,
    questionTa: "செவிக்கு நல்ல அறிவுணவு கிடைக்காத நேரத்தில் எதற்கு உணவு தரலாம் என்று வள்ளுவர் நகைச்சுவையுடன் கூறுகிறார்?",
    questionEn: "When food for the ears (wisdom) is lacking, to what can a little food be given?",
    optionsTa: ["வயிற்றுக்கு (உடலுக்கு)", "கண்களுக்கு", "கைகளுக்கு"],
    optionsEn: ["To the stomach (food to eat)", "To the eyes", "To the hands"],
    correctIndex: 0,
    hintTa: "செவிக்குணவு இல்லாத போழ்து சிறிது வயிற்றுக்கும் ஈயப் படும்!",
    hintEn: "When there is no food for the ear, then let a little be given to the stomach!"
  },
  {
    id: 67,
    questionTa: "அழிவு வரும் முன்பே ஒரு மனிதனைக் காத்துக்கொள்ளும் வலுவான கருவி எது?",
    questionEn: "What is the ultimate indestructible fortress that protects a person from ruin?",
    optionsTa: ["நுண்ணறிவு", "இரும்பு வாள்", "கற்கோட்டை"],
    optionsEn: ["True wisdom (Arivu)", "An iron sword", "A stone fort"],
    correctIndex: 0,
    hintTa: "அறிவற்றம் காக்கும் கருவி செறிவார்க்கும் உள்ளழிக்க லாகா அரண்!",
    hintEn: "Wisdom is an inner defense against ruin, an unbreachable fortress!"
  },
  {
    id: 68,
    questionTa: "எத்தனை நூல்களைக் கற்றிருந்தாலும், உலகத்தாரோடு ஒத்து வாழத் தெரியாதவர் யார்?",
    questionEn: "However many books one has read, one who cannot live in harmony with the good world is considered what?",
    optionsTa: ["அறிவில்லாத மூடரே", "அறிவாளி", "தலைவர்"],
    optionsEn: ["An ignorant fool", "A genius", "A ruler"],
    correctIndex: 0,
    hintTa: "உலகத்தோடு ஒட்ட ஒழுகல் பலகற்றும் கல்லார் அறிவிலா தார்!",
    hintEn: "Those who know not how to harmonize with society are ignorant, despite all books!"
  },
  {
    id: 69,
    questionTa: "விடுபட்ட சொல் என்ன? 'தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக் ________ தூறும் அறிவு'",
    questionEn: "Fill in the blank: '...maandharkkuk ________ thoorum arivu'",
    optionsTa: ["கற்றனைத்", "பெற்றனைத்", "நின்றனைத்"],
    optionsEn: ["Katranaith (As much as studied)", "Petranaith", "Nintranaith"],
    correctIndex: 0,
    hintTa: "எவ்வளவு கற்கிறோமோ அவ்வளவு அறிவு பெருகும்!",
    hintEn: "In proportion to the effort of study, wisdom wells up in the mind!"
  },
  {
    id: 70,
    questionTa: "தன் கற்றறிவை அவையில் மற்றவர்கள் விரும்பிக் கேட்கும்படி பேசுவது எதனால் முடியும்?",
    questionEn: "What enables a speaker to explain complex wisdom so all listeners grasp it easily?",
    optionsTa: ["சொல்வன்மை (அழகிய பேச்சுத்திறன்)", "அதிகமாக சத்தமிடுவது", "விரைவாகப் பேசுவது"],
    optionsEn: ["Eloquence / Art of Speech (Solvanmai)", "Shouting loudly", "Talking fast"],
    correctIndex: 0,
    hintTa: "கேட்டார்ப் பிணிக்கும் தகையவாய்க் கேளாரும் வேட்ப மொழிவதாம் சொல்!",
    hintEn: "Eloquent speech captivates listeners and makes even neutrals desire to hear!"
  },
  {
    id: 71,
    questionTa: "தகுந்த காலம் வரும் வரை அமைதியாகக் காத்திருப்பதற்கு எந்தப் பறவையை வள்ளுவர் உவமையாகக் கூறுகிறார்?",
    questionEn: "Which bird does Valluvar use as a metaphor for patiently waiting for the right moment?",
    optionsTa: ["கொக்கு (மீன் வரும் வரை ஒற்றைக்காலில் நிற்கும் கொக்கு)", "கிளி", "கழுகு"],
    optionsEn: ["The Heron / Stork (standing still till the right fish comes)", "Parrot", "Eagle"],
    correctIndex: 0,
    hintTa: "கொக்கொக்க கூம்பும் பருவத்து மற்றதன் குத்தொக்க சீர்த்த இடத்து!",
    hintEn: "Like a stork, keep still till the right season; strike swiftly when the moment comes!"
  },
  {
    id: 72,
    questionTa: "எடை குறைவான மயிலிறகே ஆனாலும், வண்டியில் அளவுக்கு அதிகமாக ஏற்றினால் என்ன நிகழும்?",
    questionEn: "Though peacock feathers are very light, what happens if overloaded beyond the cart's limit?",
    optionsTa: ["வண்டியின் அச்சு முறிந்துவிடும்", "வண்டி வேகமாக ஓடும்", "மயில் பறந்துவிடும்"],
    optionsEn: ["The cart's axle will snap", "Cart runs faster", "Peacock flies"],
    correctIndex: 0,
    hintTa: "பீலிபெய் சாகாடும் அச்சுஇறும் அப்பண்டம் சால மிகுத்துப் பெயின்!",
    hintEn: "Even an overload of feather quills will snap a sturdy axle!"
  },
  {
    id: 73,
    questionTa: "ஆழமான தண்ணீரில் இருக்கும்போது எந்த விலங்கு மற்ற வலிமையான விலங்குகளையும் வெல்லும்?",
    questionEn: "In deep water, which creature can conquer even the mightiest land animals?",
    optionsTa: ["முதலை", "யானை", "மான்"],
    optionsEn: ["Crocodile (Mudhalai)", "Elephant", "Deer"],
    correctIndex: 0,
    hintTa: "நெடும்புனலுள் வெல்லும் முதலை புனலின்நீன் பின்னைப் பிற!",
    hintEn: "A crocodile conquers all in deep waters, but out of water, others conquer it!"
  },
  {
    id: 74,
    questionTa: "ஆழ்கடலில் ஓடும் பெரிய கப்பலால் எங்கு ஓட முடியாது?",
    questionEn: "A huge ship that sails easily over the ocean cannot travel where?",
    optionsTa: ["தரை நிலத்தில் ஓட முடியாது", "ஆற்றில்", "துறைமுகத்தில்"],
    optionsEn: ["Cannot run on dry land", "In a river", "In a port"],
    correctIndex: 0,
    hintTa: "கடலோடா கால்வல் நெடுந்தேர் கடலோடும் நாவாயும் ஓடா நிலத்து!",
    hintEn: "A strong-wheeled chariot cannot sail the sea; a sea-going ship cannot roll on land!"
  },
  {
    id: 75,
    questionTa: "பகல் நேரத்தில் ஆந்தையை வென்றுவிடும் வலிமை குறைந்த பறவை எது?",
    questionEn: "Which bird, though smaller, can defeat a nocturnal owl in broad daylight?",
    optionsTa: ["காகம் (காக்கை)", "சிட்டுக்குருவி", "புறா"],
    optionsEn: ["The Crow (Kaakkai)", "Sparrow", "Pigeon"],
    correctIndex: 0,
    hintTa: "பகல்வெல்லும் கூகையைக் காக்கை இகல்வெல்லும் வேந்தர்க்கு வேண்டும் பொழுது!",
    hintEn: "A crow defeats an owl by day; time and place decide victory in battle!"
  },
  {
    id: 76,
    questionTa: "அம்பு நேராக இருந்தாலும் கொடியது; யாழின் தண்டு வளைந்திருந்தாலும் இனிய இசை தருவது போல மனிதர்களை எதை வைத்து அளக்க வேண்டும்?",
    questionEn: "Straight arrow kills; curved lute makes music. By what should humans be judged?",
    optionsTa: ["அவர்களின் புறத்தோற்றத்தை அல்ல, நற்செயல்களைக் கொண்டே அளக்க வேண்டும்", "அவர்களின் அழகை வைத்து", "அவர்களின் உயரத்தை வைத்து"],
    optionsEn: ["By their actions, not their external appearance", "By their beauty", "By their height"],
    correctIndex: 0,
    hintTa: "கணைகொடிது யாழ்கோடு செவ்விதுஆங்கு அன்ன வினைபடு பாலால் கொளல்!",
    hintEn: "Judge people not by their straight or bent looks, but by the fruit of their deeds!"
  },
  {
    id: 77,
    questionTa: "முள்மரம் இளங்கன்றாக இருக்கும்போதே வெட்டிவிட வேண்டும்; முதிர்ந்துவிட்டால் என்ன கடினமாகும்?",
    questionEn: "A thorny tree should be cut down while young; what happens once it grows mature?",
    optionsTa: ["வெட்டுபவரின் கையையே கிழித்துவிடும்", "இனிப்பான காய் தரும்", "மலர் பூக்காது"],
    optionsEn: ["It will tear and injure the hand that tries to fell it", "Yields fruit", "No flowers"],
    correctIndex: 0,
    hintTa: "இளைதாக முள்மரம் கொல்க களையுநர் கைகொல்லும் காழ்த்த இடத்து!",
    hintEn: "Cut thorny problems while they are small; overgrown, they will wound your hands!"
  },
  {
    id: 78,
    questionTa: "துன்பம் வரும்போது கலங்காமல் ஒருவன் செய்ய வேண்டிய புன்னகைச் செயல் என்ன?",
    questionEn: "When unexpected troubles strike, what cheerful attitude should you adopt?",
    optionsTa: ["சிரித்து மகிழ்ந்து மன உறுதியோடு எதிர்கொள்ளுதல்", "அழுது முடங்கிவிடுதல்", "மற்றவர்கள் மேல் பழியைப் போடுதல்"],
    optionsEn: ["Face it with a courageous smile (Naguga)", "Cry and give up", "Blame others"],
    correctIndex: 0,
    hintTa: "இடுக்கண் வருங்கால் நகுக அதனை அடுத்துஊர்வது அஃதொப்பது இல்!",
    hintEn: "Laugh when grief comes; nothing conquers hardship like courageous good cheer!"
  },
  {
    id: 79,
    questionTa: "ஒரு செயலைத் தொடங்குவதற்கு முன்பே எதைச் செய்ய வேண்டும் என்று வள்ளுவர் எச்சரிக்கிறார்?",
    questionEn: "What must you do before starting any major venture, according to Valluvar?",
    optionsTa: ["நன்றாக ஆராய்ந்து திட்டமிடுதல்", "யோசிக்காமல் உடனே குதிப்பது", "பிறர் தொடங்குவதற்காகக் காத்திருப்பது"],
    optionsEn: ["Deeply weigh and think beforehand (Enni thuniga)", "Jump in blindly", "Wait for someone else"],
    correctIndex: 0,
    hintTa: "எண்ணித் துணிக கருமம் துணிந்தபின் எண்ணுவம் என்பது இழுக்கு!",
    hintEn: "Think deeply before taking action; to say 'we will think after starting' is folly!"
  },
  {
    id: 80,
    questionTa: "துன்பம் வரும் முன்பே காத்துக் கொள்ளாதவனின் வாழ்க்கை எதைப் போல அழியும்?",
    questionEn: "Like what does a person's life perish if they fail to guard against trouble before it strikes?",
    optionsTa: ["நெருப்பின் முன் வைத்த வைக்கோல் போர் போல", "மழையில் நனைந்த காகிதம்", "காற்றில் ஆடும் இலை"],
    optionsEn: ["Like a haystack set before an open spark", "Paper in rain", "Leaf in wind"],
    correctIndex: 0,
    hintTa: "வருமுன்னர்க் காவாதான் வாழ்க்கை எரிமுன்னர் வைத்தூறு போலக் கெடும்!",
    hintEn: "One who foresees not peril burns away like a stack of straw before fire!"
  },
  {
    id: 81,
    questionTa: "நல்ல நூல்களைப் படிக்கப் படிக்க இன்பம் பெருகுவது போல எவருடைய நட்பு நாளுக்கு நாள் இனிக்கும்?",
    questionEn: "Just as studying great classics yields deeper joy with reading, whose friendship grows sweeter?",
    optionsTa: ["நற்பண்புடைய பெரியோர்களின் நட்பு", "பணக்காரர்களின் நட்பு", "முகஸ்துதி பேசுவோரின் நட்பு"],
    optionsEn: ["Friendship with people of noble character", "Wealthy friends", "Flatterers"],
    correctIndex: 0,
    hintTa: "நவில்தொறும் நூல்நயம் போலும் பயில்தொறும் பண்புடை யாளர் தொடர்பு!",
    hintEn: "As fine poetry gives fresh delight upon each reading, so does fellowship with the good!"
  },
  {
    id: 82,
    questionTa: "முகத்தில் மட்டும் சிரித்துப் பேசிவிட்டு உள்ளத்தில் வஞ்சகம் வைப்பது உண்மையான நட்பா?",
    questionEn: "Is a friend who merely smiles on the face while harboring malice inside a true friend?",
    optionsTa: ["இல்லை, நெஞ்சார அன்புகூர்ந்து பழகுவதே உண்மையான நட்பு", "ஆம், அதுவே நட்பு", "சந்தேகமே இல்லை"],
    optionsEn: ["No, true friendship springs warmly from the heart (Aganaga natpu)", "Yes, face smile is enough", "No doubt"],
    correctIndex: 0,
    hintTa: "முகநக நட்பது நட்பன்று நெஞ்சத்து அகநக நட்பது நட்பு!",
    hintEn: "Smiling face alone is not friendship; love radiating from the heart is true friendship!"
  },
  {
    id: 83,
    questionTa: "நிலத்தின் தன்மைக்கு ஏற்ப தண்ணீர் மாறுவது போல, மனிதனின் அறிவு எதைச் சார்ந்து மாறும்?",
    questionEn: "As water takes the taste and mineral of the soil it flows on, what shapes human character?",
    optionsTa: ["அவன் பழகும் நண்பர்களின் சேர்க்கைச் சார்ந்து", "அவன் சாப்பிடும் உணவைச் சார்ந்து", "அவன் உடுத்தும் ஆடையைச் சார்ந்து"],
    optionsEn: ["The company and circle of friends one keeps (Inam)", "The food eaten", "The clothes worn"],
    correctIndex: 0,
    hintTa: "நிலத்தியல்பால் நீர்திரிந் தற்றாகும் மாந்தர்க்கு இனத்தியல்ப தாகும் அறிவு!",
    hintEn: "Water turns to the quality of the soil; a person's nature turns to the quality of their company!"
  },
  {
    id: 84,
    questionTa: "பிறரை அழவைத்து அநியாயமாகச் சம்பாதித்த செல்வம் எவ்வாறு போகும் என்று வள்ளுவர் எச்சரிக்கிறார்?",
    questionEn: "What happens to unjust riches gained by bringing tears to innocent people?",
    optionsTa: ["அழுதே அழியும்படி நம்மை விட்டுப் போய்விடும்", "என்றென்றும் நிலைத்து நிற்கும்", "இருமடங்காகும்"],
    optionsEn: ["It will vanish amidst tears and sorrow", "Stays forever", "Doubles"],
    correctIndex: 0,
    hintTa: "அழக்கொண்ட எல்லாம் அழப்போம் இழப்பினும் பிற்பயக்கும் நற்பா லவை!",
    hintEn: "Wealth won through others' tears perishes in tears; righteous wealth endures!"
  },
  {
    id: 85,
    questionTa: "ஒரு நாட்டின் சிறந்த அரசன் அல்லது தலைவனுக்குத் தேவையான நான்கு நற்குணங்கள் என்ன?",
    questionEn: "Which four virtues define an exemplary monarch or ethical leader?",
    optionsTa: ["அஞ்சாமை, ஈகை, அறிவு, ஊக்கம்", "கோபம், பிடிவாதம், பேராசை, கர்வம்", "அதிகப் பணம், ஆடம்பரம், வேட்டை, தூக்கம்"],
    optionsEn: ["Courage, Generosity, Wisdom, and Zeal", "Anger and greed", "Luxury and laziness"],
    correctIndex: 0,
    hintTa: "அஞ்சாமை ஈகை அறிவுஊக்கம் இந்நான்கும் எஞ்சாமை வேந்தற்கு இயல்பு!",
    hintEn: "Courage, liberality, discernment, and untiring energy: these four grace a ruler!"
  },
  {
    id: 86,
    questionTa: "தூங்குவது போன்றது மரணம்; தூங்கி விழிப்பது போன்றது எது என்று வள்ளுவர் மெய்யியல் கூறுகிறார்?",
    questionEn: "Falling asleep is like dying; waking up from sleep is like what, in Valluvar's philosophy?",
    optionsTa: ["புதிய பிறவி எடுப்பது போன்றது", "கனவு காண்பது போன்றது", "களைப்படைவது போன்றது"],
    optionsEn: ["Like taking a fresh new birth / awakening", "Like daydreaming", "Getting tired"],
    correctIndex: 0,
    hintTa: "உறங்கு வதுபோலும் சாக்காடு உறங்கி விழிப்பது போலும் பிறப்பு!",
    hintEn: "Death is like sinking into deep slumber; birth is like waking in the morning!"
  },
  {
    id: 87,
    questionTa: "உலகில் பிறப்பவர்கள் எதோடு தோன்ற வேண்டும் என்று வள்ளுவர் கூறுகிறார்?",
    questionEn: "When people are born into this world, with what dignity should they live?",
    optionsTa: ["நற்புகழோடு வாழ வேண்டும்", "செருக்கோடு வாழ வேண்டும்", "அமைதியாக ஒளிந்து வாழ வேண்டும்"],
    optionsEn: ["Live with shining good fame / legacy (Pugazh)", "With pride", "In hiding"],
    correctIndex: 0,
    hintTa: "தோன்றின் புகழொடு தோன்றுக அஃதிலார் தோன்றலின் தோன்றாமை நன்று!",
    hintEn: "If you appear in this world, shine with noble renown; otherwise not being born is better!"
  },
  {
    id: 88,
    questionTa: "திருவள்ளுவர் பிறந்த ஊராகத் தொன்றுதொட்டு போற்றப்படும் சென்னை நகர்ப் பகுதி எது?",
    questionEn: "Which historic locality in Chennai is traditionally venerated as Thiruvalluvar's birthplace?",
    optionsTa: ["மயிலாப்பூர் (மயிலை)", "தாம்பரம்", "கிண்டி"],
    optionsEn: ["Mylapore (Mayilai)", "Tambaram", "Guindy"],
    correctIndex: 0,
    hintTa: "மயிலாப்பூரில் பழம்பெரும் திருவள்ளுவர் திருக்கோயில் அமைந்துள்ளது!",
    hintEn: "Mylapore, home to the ancient Thiruvalluvar temple!"
  },
  {
    id: 89,
    questionTa: "திருவள்ளுவரின் வாழ்க்கைத் துணைவியாரின் (மனைவியின்) பெயர் என்ன?",
    questionEn: "What is the traditional name of Thiruvalluvar's devoted wife?",
    optionsTa: ["வாசுகி அம்மையார்", "கண்ணகி", "மாதவி"],
    optionsEn: ["Vasuki Ammaiyaar", "Kannagi", "Madhavi"],
    correctIndex: 0,
    hintTa: "வள்ளுவரின் அன்பான இல்லத்தரசி!",
    hintEn: "The revered household partner of the great poet!"
  },
  {
    id: 90,
    questionTa: "தமிழ்நாட்டில் அதிகாரப்பூர்வமாகப் பயன்படுத்தப்படும் 'திருவள்ளுவர் ஆண்டு' தொடங்கும் மாதம் எது?",
    questionEn: "In which auspicious Tamil month does the official 'Thiruvalluvar Year' begin?",
    optionsTa: ["தை மாதம் (தை 2 திருவள்ளுவர் நாள்)", "சித்திரை மாதம்", "மார்கழி மாதம்"],
    optionsEn: ["Thai Month (Thai 2nd is Thiruvalluvar Day)", "Chithirai", "Margazhi"],
    correctIndex: 0,
    hintTa: "பொங்கல் திருநாளுக்கு அடுத்த நாள் திருவள்ளுவர் திருநாளாகக் கொண்டாடப்படுகிறது!",
    hintEn: "The day following Pongal festival is celebrated across Tamil Nadu as Thiruvalluvar Day!"
  },
  {
    id: 91,
    questionTa: "விடுபட்ட சொல் என்ன? 'நன்றி மறப்பது நன்றன்று நன்றல்லது அன்றே ________ நன்று'",
    questionEn: "Fill in the blank: 'Nanri marappadhu nandrandru nandralladhu andrey ________ nandru'",
    optionsTa: ["மறப்பது", "நினைப்பது", "பேசுவது"],
    optionsEn: ["Marappadhu (Forgetting)", "Ninaippadhu", "Pesuuvadhu"],
    correctIndex: 0,
    hintTa: "பிறர் செய்த நன்மையை மறக்கக் கூடாது; அவர் செய்த தீங்கை உடனே மறந்துவிட வேண்டும்!",
    hintEn: "It is not good to forget a benefit; it is best to forget an injury on the very same day!"
  },
  {
    id: 92,
    questionTa: "விடுபட்ட சொல் என்ன? 'காலத்தினாற் செய்த நன்றி சிறிதுஎனினும் ________ மாணப் பெரிது'",
    questionEn: "Fill in the blank: '...siridhu-eninum ________ maanak karudhu'",
    optionsTa: ["ஞாலத்தின்", "வானத்தின்", "கடலின்"],
    optionsEn: ["Gnaalaththin (The whole universe)", "Vaanaththin", "Kadalin"],
    correctIndex: 0,
    hintTa: "ஞாலம் என்றால் உலகம் என்று பொருள்!",
    hintEn: "'Gnaalam' is the classical Tamil word for the entire earth/universe!"
  },
  {
    id: 93,
    questionTa: "எந்த ஒரு உயிரையும் கொல்லாமல் காக்கும் பேரறத்திற்கு வள்ளுவர் தரும் முதன்மை என்ன?",
    questionEn: "What supremacy does Valluvar assign to non-violence and not taking any life (Kollaamai)?",
    optionsTa: ["அறங்கள் அனைத்திலும் தலையாய பேரறம்", "ஒரு சாதாரண நற்செயல்", "அவசியமில்லை"],
    optionsEn: ["The supreme foremost virtue of all dharmas", "An ordinary deed", "Optional"],
    correctIndex: 0,
    hintTa: "தன்னுன் பெருக்கற்குத் தான்பிறிது ஊனுண்பான் எங்ஙனம் ஆளும் அருள்!",
    hintEn: "Non-harm and universal compassion to all breathing creatures is the crest of virtue!"
  },
  {
    id: 94,
    questionTa: "விடுபட்ட சொல் என்ன? 'ஒழுக்கம் விழுப்பம் தரலான் ஒழுக்கம் ________ ஓம்பப் படும்'",
    questionEn: "Fill in the blank: '...ozhukkam ________ oambap padum'",
    optionsTa: ["உயிரினும்", "பொன்னினும்", "மண்ணினும்"],
    optionsEn: ["Uyirinum (More than life itself)", "Ponninum", "Manninum"],
    correctIndex: 0,
    hintTa: "ஒழுக்கம் நன்மைகளைத் தருவதால் உயிரை விட மேலாகப் போற்ற வேண்டும்!",
    hintEn: "Good conduct yields excellence; cherish it more tenderly than life itself!"
  },
  {
    id: 95,
    questionTa: "விடுபட்ட சொல் என்ன? 'உள்ளத்தால் உள்ளலும் தீதே பிறன்பொருளைக் ________ திருடுவேன் எனல்'",
    questionEn: "Fill in the blank: '...piranporulaik ________ thiruduven enal'",
    optionsTa: ["கள்ளத்தால்", "அன்பினால்", "நேர்மையால்"],
    optionsEn: ["Kallaththaal (By deceit)", "Anbinaal", "Nermaiyaal"],
    correctIndex: 0,
    hintTa: "பிறர் பொருளைத் திருட நினைப்பது கூட உள்ளத்தால் செய்யும் குற்றமாகும்!",
    hintEn: "Even wishing in secret to steal another's property is an inward sin!"
  },
  {
    id: 96,
    questionTa: "விடுபட்ட சொல் என்ன? 'மழித்தலும் நீட்டலும் வேண்டா உலகம் ________ ஒழித்து விடின்'",
    questionEn: "Fill in the blank: '...ulagam ________ ozhiththu vidin'",
    optionsTa: ["பழித்தது", "புகழ்ந்தது", "விரும்பியது"],
    optionsEn: ["Pazhiththadhu (Things condemned by the wise)", "Pugazhndhadhu", "Virumbiyadhu"],
    correctIndex: 0,
    hintTa: "தலைமுடியை மொட்டையடிப்பதோ சடை வளர்ப்பதோ முக்கியமில்லை; உலகம் பழிக்கும் தீயதை விலக்க வேண்டும்!",
    hintEn: "Shaving or growing matted hair is unneeded, if you discard deeds condemned by the world!"
  },
  {
    id: 97,
    questionTa: "விடுபட்ட சொல் என்ன? 'அகழ்வாரைத் தாங்கும் நிலம்போலத் தம்மை ________ பொறுத்தல் தலை'",
    questionEn: "Fill in the blank: '...thammai ________ poruththal thalai'",
    optionsTa: ["இகழ்வார்ப்", "புகழ்வார்ப்", "மறைப்பார்ப்ப்"],
    optionsEn: ["Igazhvaarp (Those who mock and insult)", "Pugazhvaarp", "Maraippaarp"],
    correctIndex: 0,
    hintTa: "நமக்குக் கேலி பேசி இழிப்பவரையும் பொறுத்துக் கொள்வதே மேன்மையானது!",
    hintEn: "To endure with grace those who revile and mock you is supreme nobility!"
  },
  {
    id: 98,
    questionTa: "விடுபட்ட சொல் என்ன? 'மருந்தென வேண்டாவாம் யாக்கைக்கு அருந்தியது ________ போற்றி உணின்'",
    questionEn: "Fill in the blank: '...arundhiyadhu ________ potri unin'",
    optionsTa: ["அற்றது", "பெற்றது", "சுவைத்தது"],
    optionsEn: ["Atradhu (Properly digested)", "Petradhu", "Suvaiththadhu"],
    correctIndex: 0,
    hintTa: "முன் உண்ட உணவு நன்றாகச் செரித்த பின் அளவோடு உண்டால் மருந்து தேவையில்லை!",
    hintEn: "No medicine is needed if you eat only after previous food is well digested!"
  },
  {
    id: 99,
    questionTa: "விடுபட்ட சொல் என்ன? 'சுழன்றும்ஏர்ப் பின்னது உலகம் அதனால் உழந்தும் ________ தலை'",
    questionEn: "Fill in the blank: '...uzhandhum ________ thalai'",
    optionsTa: ["உழவே", "வணிகமே", "கல்வியே"],
    optionsEn: ["Uzhavey (Farming / agriculture)", "Vanigamey", "Kalviyey"],
    correctIndex: 0,
    hintTa: "கடினமாக உழைத்தாலும் உழவுத் தொழிலே உலகிற்கு முதன்மையான தலைசிறந்த தொழில்!",
    hintEn: "Though labor be hard, agriculture is foremost because all life depends on food!"
  },
  {
    id: 100,
    questionTa: "திருக்குறள் கற்பதன் மூலம் குழந்தைகளுக்குக் கிடைக்கும் மிகப்பெரிய பரிசு என்ன?",
    questionEn: "What is the greatest lifetime treasure children receive by learning Thirukkural?",
    optionsTa: ["நேர்மை, அன்பு, தன்னம்பிக்கை மற்றும் சிறந்த ஒழுக்க நெறிமுறை", "அதிகமான பொம்மைகள்", "வீடியோ கேம்கள் மட்டும்"],
    optionsEn: ["Honesty, Kindness, Self-Confidence, and Lifelong Moral Character", "More toys", "Only video games"],
    correctIndex: 0,
    hintTa: "திருக்குறள் வாழ்நாள் முழுவதும் நல்ல மனிதனாக வாழ வழிகாட்டும் கலங்கரை விளக்கம்!",
    hintEn: "Thirukkural is a beacon of light that guides you to live as a noble human being forever!"
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

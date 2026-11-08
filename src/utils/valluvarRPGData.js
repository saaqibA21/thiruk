/**
 * வள்ளுவர் வழி (Valluvar's Path / Moral Dilemma RPG)
 * Scenarios, Roles, Choice Consequences, and Guiding Thirukkurals
 */

export const RPG_ROLES = [
  {
    id: 'all',
    name: 'முழு வாழ்வியல் பயணம் (Grand Saga)',
    nameEn: 'The Complete Chronicle',
    title: 'வாழ்வியல் ஆய்வாளர் (Seeker of Truth)',
    icon: '🧭',
    color: '#8b5cf6',
    description: 'அரசன், அமைச்சர், வணிகன், குடிமகன் என அனைத்து நிலைகளிலும் தோன்றும் வாழ்வியல் அறச் சோதனைகளை எதிர்கொள்ளுங்கள்.'
  },
  {
    id: 'king',
    name: 'அரசன் (The Monarch)',
    nameEn: 'The Ruler',
    title: 'செங்கோல் வேந்தன் (King of Justice)',
    icon: '👑',
    color: '#f59e0b',
    description: 'நீதி வழுவாத செங்கோல் ஆட்சி, நாட்டின் பாதுகாப்பு, கருவூல வளம் மற்றும் குடிமக்கள் நலம் ஆகியவற்றை சமன் செய்யும் சவால்.'
  },
  {
    id: 'minister',
    name: 'அமைச்சர் (The Chief Counselor)',
    nameEn: 'The Wise Minister',
    title: 'இடிக்குந்துணை மந்திரி (Fearless Counselor)',
    icon: '📜',
    color: '#3b82f6',
    description: 'மன்னனுக்கு அஞ்சாமல் கசப்பான உண்மைகளை இடித்துரைத்து, சூழ்ச்சிகளை முறியடித்து நாட்டைக் காக்கும் நுண்ணறிவுப் பொறுப்பு.'
  },
  {
    id: 'merchant',
    name: 'வணிகன் (The Merchant)',
    nameEn: 'The Trade Master',
    title: 'நேர்மை வணிகச் செம்மல் (Righteous Merchant)',
    icon: '⚖️',
    color: '#10b981',
    description: 'கடன், பஞ்சம், லாப வெறி, கடற்பயணம் போன்ற சோதனைகளில் பேராசைக்கு இடம் கொடாமல் நேர்மையான வாணிகம் செய்யும் பாதை.'
  },
  {
    id: 'citizen',
    name: 'குடிமகன் / மாணவன் (The Citizen & Scholar)',
    nameEn: 'The Citizen & Student',
    title: 'சான்றோன் (Noble Householder & Scholar)',
    icon: '🏡',
    color: '#ec4899',
    description: 'நட்பு, நன்றியுணர்வு, விருந்தோம்பல், கள்ளாமை போன்ற அன்றாட வாழ்வின் கடுமையான தார்மீகத் தேர்வுகளை வெல்லும் பயணம்.'
  }
];

export const RPG_SCENARIOS = [
  // --- KING SCENARIOS ---
  {
    id: 'king_treason_general',
    roleId: 'king',
    roleName: 'மன்னன் (The King)',
    title: 'தளபதியின் குற்றமும் செங்கோலின் சோதனையும்',
    titleEn: 'The General’s Crime and Royal Sceptre',
    location: 'பாண்டிய நாட்டின் அரசவை (Royal Court)',
    situation: `போர்க்களத்தில் உங்கள் உயிரைக் காப்பாற்றிய உங்களின் முதன்மைப் படைத்தளபதி, எதிரி நாட்டு வணிகர்களிடம் ரகசியமாகப் பெரும் லஞ்சம் பெற்றுக் கொண்டதை உங்கள் உளவாளிகள் நிரூபித்துள்ளனர். 

தற்போது அண்டை நாட்டுப் படையெடுப்பு அச்சம் நிலவுகிறது. தளபதியைத் தண்டித்தால் படைவீரர்களின் மன உறுதி சரியலாம்; தண்டிக்காமல் விட்டால் அரசவையில் ஊழல் புற்றுநோய் போலப் பரவும். உங்கள் முடிவு என்ன?`,
    situationEn: `Your trusted army commander, who saved your life in war, has been caught taking massive bribes from foreign merchants. An enemy invasion looms. Punishing him risks army morale; pardoning him breeds corruption in your court. What will you do?`,
    choices: [
      {
        id: 'A',
        text: 'சுயநலமும் சலுகையும் இன்றி முறைப்படி தளபதியின் பதவியைப் பறித்து சட்டப்படி சிறையிலிடு.',
        textEn: 'Strip his rank and punish him strictly according to the law without favoritism.',
        outcome: `நீங்கள் நீதியை நிலைநாட்டினீர்கள்! மக்கள் உங்கள் நேர்மையை வியந்து போற்றினர். படை வீரர்கள் தற்காலிக அதிர்ச்சி அடைந்தாலும், உங்கள் மீதான மதிப்பு பன்மடங்கு உயர்ந்தது.`,
        outcomeEn: `You upheld unbending justice! The people cheered your impartiality and morale rebounded around righteous leadership.`,
        statImpact: { aram: +18, porul: -5, inbam: +5 },
        kuralNumber: 561,
        kural: {
          Number: 561,
          Line1: "தக்காங்கு நாடித் தலைச்செல்லா வண்ணத்தால்",
          Line2: "ஒத்தாங்கு ஒறுப்பது வேந்து.",
          mv: "செய்யப்பட்ட குற்றத்தை தக்கவாறு ஆராய்ந்து, மீண்டும் அக்குற்றம் செய்யாதவாறு குற்றத்திற்கு ஏற்ப தண்டிப்பவனே சிறந்த அரசன்.",
          trans: "Investigate impartially and punish fittingly, so the crime is never repeated."
        },
        valluvarAdvice: "அரசனின் கடமை எவருக்கும் சலுகை காட்டாமல் குற்றத்தின் உண்மைத் தன்மையை நடுநிலையோடு ஆராய்ந்து தண்டனை வழங்குவதே ஆகும்."
      },
      {
        id: 'B',
        text: 'தளபதியிடம் ரகசியமாகப் பெரும் அபராதம் வசூலித்து அரசு கருவூலத்தில் சேர்த்து, போர்ப் பணிக்கு அனுப்பு.',
        textEn: 'Privately fine him a heavy amount to fill the war chest and send him to the border.',
        outcome: `கருவூலம் நிரம்பியது; ஆனால் தளபதிக்கு தன் மீதான அச்சம் போனது. மற்ற அதிகாரிகளும் லஞ்சம் கொடுத்தால் அபராதத்தோடு தப்பித்துக் கொள்ளலாம் என்று எண்ணத் தொடங்கினர்.`,
        outcomeEn: `The treasury gained gold, but court officials realized bribes could simply be paid off with fines. Corruption took root.`,
        statImpact: { aram: -15, porul: +20, inbam: -8 },
        kuralNumber: 553,
        kural: {
          Number: 553,
          Line1: "வேலொடு நின்றான் இடுவென் றதுபோலும்",
          Line2: "கோலொடு நின்றான் இரவு.",
          mv: "ஆட்சியதிகாரம் உடையவன் தன் குடிமக்களிடம் முறையற்ற வழிகளில் பொருள் கேட்பது, வழிப்பறி திருடன் ஆயுதத்தைக் காட்டி மிரட்டுவதைப் போன்றதாகும்.",
          trans: "A ruler extracting unjust wealth with authority is like a robber brandishing a spear."
        },
        valluvarAdvice: "முறையற்ற வழியில் ஈட்டும் செல்வம் அரசை அழிவுப் பாதைக்கே இட்டுச் செல்லும்."
      },
      {
        id: 'C',
        text: 'அவர் உயிரைக் காப்பாற்றிய நன்றிக்காக குற்றத்தை முற்றிலும் மன்னித்து அந்தரங்கமாக எச்சரி.',
        textEn: 'Forgive him completely in private gratitude for saving your life, giving only a whisper warning.',
        outcome: `தளபதி நன்றி பாராட்டினாலும், அரசவை நீதி கேலிக் கூத்தானது. உளவுத் துறைக்கு உங்கள் மீது நம்பிக்கை குன்றியது.`,
        outcomeEn: `The general was grateful, but justice in the palace turned into a joke. The integrity of your realm weakened.`,
        statImpact: { aram: -20, porul: -10, inbam: +8 },
        kuralNumber: 543,
        kural: {
          Number: 543,
          Line1: "அந்தணர் நூற்கும் அறத்திற்கும் ஆதியாய்",
          Line2: "நின்றது மன்னவன் கோல்.",
          mv: "நீதிநூல்களுக்கும் உலக அறநெறிகளுக்கும் ஆதாரமாக நிலைபெற்று நிற்பது மன்னவனின் நேர்மையான செங்கோல் ஆட்சியே.",
          trans: "The righteous sceptre of the monarch is the anchor of all sacred laws and virtue."
        },
        valluvarAdvice: "தனிப்பட்ட பாசமோ நன்றியோ அரச நீதியை ஒருபோதும் திசைதிருப்பக் கூடாது."
      }
    ]
  },

  {
    id: 'king_drought_famine',
    roleId: 'king',
    roleName: 'மன்னன் (The King)',
    title: 'பஞ்சத்தின் கோரமும் அரண்மனை சேமிப்பும்',
    titleEn: 'Famine and the Royal Grain Reserves',
    location: 'சோழ நாட்டுத் தலைநகரம் (Chola Capital)',
    situation: `பருவமழை பொய்த்ததால் நாட்டில் வரலாறு காணாத வறட்சி ஏற்பட்டுள்ளது. விவசாயிகளின் பயிர்கள் கருகிவிட்டன. அரண்மனையின் தானியக் களஞ்சியத்தில் அடுத்த போருக்கு என சேமித்து வைக்கப்பட்ட உணவு தானியங்கள் மட்டுமே உள்ளன.

தளபதிகள் கூறுகிறார்கள்: "தானியத்தைத் திறந்தால் அண்டை நாட்டுப் படை தாக்கும்போது நமது சேனைகள் பசியால் அழியும்!" விவசாயிகள் அரண்மனை வாயிலில் கஞ்சி கேட்டு அழுகின்றனர். என்ன செய்வீர்கள்?`,
    situationEn: `Severe drought has struck. The only grain remaining is locked in the royal silos, reserved for the army in case of war. Generals advise keeping it; hungry citizens weep outside the gates. What will you do?`,
    choices: [
      {
        id: 'A',
        text: 'அரண்மனை களஞ்சியங்களை உடனடியாகத் திறந்து மக்களுக்கு இலவச தானிய விநியோகம் செய்.',
        textEn: 'Throw open the royal silos immediately and distribute food to the starving populace.',
        outcome: `ஆயிரக்கணக்கான குடிமக்கள் உயிர் பிழைத்தனர்! உங்கள் நாட்டின் மீதான மக்களின் பக்தி மலையளவு உயர்ந்தது. ஒற்றுமையே உங்களின் மிகப்பெரிய பாதுகாப்பு கவசமானது.`,
        outcomeEn: `Thousands of lives were saved! The citizens' undying love and loyalty became an unbreakable shield for the realm.`,
        statImpact: { aram: +22, porul: -18, inbam: +15 },
        kuralNumber: 545,
        kural: {
          Number: 545,
          Line1: "இயல்புளிக் கோலோச்சும் மன்னவன் நாட்ட",
          Line2: "பெயலும் விளையுளும் தொக்கு.",
          mv: "அறநெறி முறைப்படி செங்கோல் செலுத்தும் மன்னனின் நாட்டில், பருவமழையும் தவறாமல் பொழியும்; விளைச்சலும் குறைவின்றி பெருகும்.",
          trans: "In the land of the monarch who rules justly, timely rains fall and crops flourish in bounty."
        },
        valluvarAdvice: "குடிமக்களைக் காக்கும் மன்னனின் ஆட்சியே நாட்டின் உண்மையான பலமாகும்."
      },
      {
        id: 'B',
        text: 'தானியத்தைப் பூட்டியே வை; அண்டை நாட்டின் மீது உடனடியாகப் படையெடுத்து அவர்கள் உணவைக் கவர்ந்து வா.',
        textEn: 'Keep the grain locked for war, and aggressively invade a neighboring kingdom to plunder their food.',
        outcome: `போரில் பல வீரர்கள் மடிந்தனர்; வெற்றி பெற்றாலும் பழிச்சொல்லும் பகைமையும் சுற்றிலும் சூழ்ந்தது. அறம் முற்றாக வீழ்ந்தது.`,
        outcomeEn: `Many soldiers died in battle; despite victory, dishonor and bitter hatred surrounded your throne.`,
        statImpact: { aram: -25, porul: +15, inbam: -20 },
        kuralNumber: 551,
        kural: {
          Number: 551,
          Line1: "கொலைமேற்கொண் டாரிற் கொடிதே அலைமேற்கொண்டு",
          Line2: "அல்லவை செய்தொழுகும் வேந்து.",
          mv: "குடிமக்களை கொடுமைப்படுத்தி முறைகேடான செயல்களைச் செய்து ஆட்சி நடத்தும் அரசன், கொலைகாரர்களை விடக் கொடியவன் ஆவான்.",
          trans: "A ruler who tyrannizes and oppresses his people is crueler than a murderer."
        },
        valluvarAdvice: "குடிமக்களைத் துயரத்தில் ஆழ்த்தி நடத்தும் அராஜகம் பேரழிவிலேயே முடியும்."
      },
      {
        id: 'C',
        text: 'பணக்கார வணிகர்களிடம் கட்டாயக் கடன் வாங்கி தானியங்களை இறக்குமதி செய்; களஞ்சியத்தைத் தொடாதே.',
        textEn: 'Compel merchants to grant forced loans to import grain while protecting the royal fortress cache.',
        outcome: `உணவு கிடைத்தது, ஆனால் வணிகர்கள் அதிருப்தி அடைந்து வர்த்தகத்தை முடக்கினர். பொருளாதாரம் தள்ளாடியது.`,
        outcomeEn: `Grain arrived, but infuriated merchants stalled trade in protest. The commercial economy suffered.`,
        statImpact: { aram: +5, porul: -12, inbam: -5 },
        kuralNumber: 544,
        kural: {
          Number: 544,
          Line1: "குடிதழீஇக் கோலோச்சும் மாநில மன்னன்",
          Line2: "அடிதழீஇ நிற்கும் உலகு.",
          mv: "குடிமக்களை அரவணைத்து அன்போடு செங்கோல் செலுத்தும் பேரரசரின் திருவடிகளை உலகம் போற்றி வணங்கும்.",
          trans: "The world embraces the feet of the emperor who governs by embracing his people with love."
        },
        valluvarAdvice: "குடிமக்களின் நம்பிக்கையும் நல்வாழ்வுமே அரசாட்சியின் அஸ்திவாரம்."
      }
    ]
  },

  // --- MINISTER SCENARIOS ---
  {
    id: 'minister_rash_war',
    roleId: 'minister',
    roleName: 'அமைச்சர் (The Minister)',
    title: 'மன்னரின் பேராசையும் அமைச்சரின் துணிவும்',
    titleEn: 'The King’s Reckless War and Counselor’s Courage',
    location: 'சேர நாட்டு மந்திராலோசனை சபை (Ministerial Council)',
    situation: `இளம் மன்னர் தனது புகழை உலகறியச் செய்வதற்காக, கடல் கடந்து அமைதியாக வாழும் இலங்கை நாட்டின் மீது மாபெரும் கடற்படை தாக்குதல் நடத்தத் துடிக்கிறார். 

நாட்டு கருவூலத்தில் போதிய நிதியில்லை; இந்நடவடிக்கை ஆயிரக்கணக்கான அப்பாவி வீரர்களையும் குடும்பங்களையும் பலிவாங்கும். "போரை எதிர்த்துப் பேசுபவன் ராஜதுரோகி!" என்று மன்னர் சபையில் முழங்குகிறார். அமைச்சராக உங்கள் பங்கு என்ன?`,
    situationEn: `The vainglorious young King wants to launch a reckless overseas invasion to boost his personal ego. It will bankrupt the nation and kill thousands. The King warns: "Anyone opposing this war is a traitor!" How will you advise him?`,
    choices: [
      {
        id: 'A',
        text: 'மன்னரின் சினம் கண்டு அஞ்சாமல், போரின் பேரழிவுகளையும் கருவூல நிலையையும் துணிந்து எடுத்துரை.',
        textEn: 'Fear not the King’s fury; stand up and boldly speak the uncomfortable truth about war destruction.',
        outcome: `மன்னர் தொடக்கத்தில் சீறினாலும், உங்கள் அசைக்க முடியாத புள்ளிவிவரங்களையும் அறவுரையையும் கேட்டு அமைதியடைந்தார். நாடு மாபெரும் அனாவசியப் போரிலிருந்து தப்பியது.`,
        outcomeEn: `Though angry at first, the King was moved by your unflinching logic and ethical clarity. The realm was saved from disaster.`,
        statImpact: { aram: +20, porul: +10, inbam: +10 },
        kuralNumber: 448,
        kural: {
          Number: 448,
          Line1: "இடிக்குந் துணையாரை ஆள்வாரை யாரே",
          Line2: "கெடுக்குந் தகைமை யவர்.",
          mv: "குற்றம் கண்டபோது கடிந்துரைத்து நல்வழி காட்டும் அறிஞர்களின் துணையைப் பெற்றுள்ள ஆட்சியாளரை எவராலும் அழிக்க முடியாது.",
          trans: "Who can destroy the monarch who is guided by fearless counselors who reprimand him when he errs?"
        },
        valluvarAdvice: "அமைச்சரின் தலையாய தர்மம் மன்னனின் சினத்திற்கு அஞ்சாமல் நல்வழியை இடித்துரைப்பதே ஆகும்."
      },
      {
        id: 'B',
        text: 'மன்னரைப் புகழ்ந்து போரை ஆதரி; அதே சமயம் போர்த் தளவாட ஒப்பந்தங்களில் உங்களுக்கு வேண்டப்பட்டோருக்கு பங்கு கொடு.',
        textEn: 'Flatter the King, cheer for the war, and allocate ship-building contracts to your own family cronies.',
        outcome: `நீங்கள் செல்வந்தர் ஆனீர்கள்; ஆனால் போரில் சேர நாடு படுதோல்வி அடைந்தது. பல்லாயிரம் தாய்மார்களின் கண்ணீர் சாபமாக மாறியது.`,
        outcomeEn: `You became wealthy through corrupt war contracts, but the navy suffered catastrophic defeat. Thousands perished.`,
        statImpact: { aram: -30, porul: +25, inbam: -25 },
        kuralNumber: 639,
        kural: {
          Number: 639,
          Line1: "பழுதெண்ணும் மந்திரியின் பக்கத்துள் தெவ்வர்",
          Line2: "எழுபது கோடி உறும்.",
          mv: "மன்னனுக்குக் கேடு விளைவிக்கும் தீய ஆலோசனைகளைத் தரும் அமைச்சனை அருகில் வைத்திருப்பதை விட, எழுபது கோடி பகைவர்கள் பக்கத்தில் இருப்பது மேலாகும்.",
          trans: "Seventy crore enemies are safer than a treacherous minister plotting deceit next to the king."
        },
        valluvarAdvice: "சுயநலத்திற்காக மன்னனைத் தவறான வழியில் செலுத்தும் அமைச்சர் மிகப்பெரிய துரோகி ஆவார்."
      },
      {
        id: 'C',
        text: 'மௌனமாக இருந்து நோய்வாய்ப்பட்டதாக விடுமுறை எடுத்து ஒதுங்கிக் கொள்.',
        textEn: 'Remain silent and take medical leave to stay safe from the King’s wrath.',
        outcome: `நீங்கள் உங்கள் பதவியைக் காப்பாற்றினீர்கள்; ஆனால் உங்கள் மௌனத்தால் நாடு இருளில் தள்ளப்பட்டது. சான்றோர் உங்களை கோழை என்று தூற்றினர்.`,
        outcomeEn: `You kept your job, but your cowardice allowed the nation to walk blindly into doom. True scholars shunned you.`,
        statImpact: { aram: -10, porul: 0, inbam: -10 },
        kuralNumber: 638,
        kural: {
          Number: 638,
          Line1: "அறனறிந்து ஆன்றமைந்த சொல்லானுக்கு எஞ்ஞான்றும்",
          Line2: "திறனறிந்தான் தேர்ச்சி துணை.",
          mv: "அறநெறியை உணர்ந்து, சூழ்நிலைக்கு ஏற்ப பக்குவமாகப் பேசும் அமைச்சரின் ஆற்றலே மன்னனுக்கு எப்போதும் உற்ற துணையாக விளங்கும்.",
          trans: "The minister who knows righteous duty and speaks mature words is an indispensable ally to kings."
        },
        valluvarAdvice: "அநீதி நடக்கும் போது வாய்மூடி இருப்பது அநீதிக்குத் துணை போவதற்குச் சமம்."
      }
    ]
  },

  // --- MERCHANT SCENARIOS ---
  {
    id: 'merchant_grain_hoarding',
    roleId: 'merchant',
    roleName: 'வணிகன் (The Merchant)',
    title: 'பஞ்ச கால தானியப் பதுக்கலும் தராசின் நேர்மையும்',
    titleEn: 'Famine Hoarding and the Scale of Honesty',
    location: 'பூம்புகார் துறைமுக நகரம் (Poompuhar Port)',
    situation: `தென்னகமெங்கும் கடுமையான பஞ்சம். உங்கள் பண்டகசாலையில் கடந்த ஆண்டு கொள்முதல் செய்த ஆயிரம் மூட்டை நெல் இருப்பு உள்ளது. 

நகரத்தின் பிற பெருவணிகர்கள் அனைவரும் தானியங்களை நிலவறைகளில் பதுக்கிவிட்டு, அடுத்த வாரம் விலையை நான்கு மடங்காக உயர்த்தத் திட்டமிட்டுள்ளனர். "நீயும் பதுக்கு; ஒரே வாரத்தில் மன்னரை விட பெரும் செல்வந்தன் ஆகலாம்!" என்று அவர்கள் அழைக்கிறார்கள். உங்கள் தராசு எதை நோக்கி சாய்கிறது?`,
    situationEn: `Severe famine grips the land. Your warehouse holds 1,000 bags of paddy. Other merchants are hiding their grains to quadruple prices next week. They invite you to hoard too. What will your scale weigh?`,
    choices: [
      {
        id: 'A',
        text: 'பண்டகசாலையை உடனே திறந்து, சாதாரண நியாய விலையிலேயே மக்களுக்கு தானியத்தை விற்று பசியைத் தீர்.',
        textEn: 'Sell your grain immediately at ordinary, fair prices to feed the starving public.',
        outcome: `மக்கள் பசி தீர்ந்து உங்களைத் தெய்வமாக வாழ்த்தினர்! உங்கள் கடையின் நன்மதிப்பு நாடெங்கும் பரவி, வணிகப் பெருந்தகை என்ற அழியாத புகழைப் பெற்றீர்கள்.`,
        outcomeEn: `You quenched their hunger! Blessings poured upon you, establishing an untouchable golden reputation for honest business.`,
        statImpact: { aram: +24, porul: +5, inbam: +18 },
        kuralNumber: 120,
        kural: {
          Number: 120,
          Line1: "வாணிகம் செய்வார்க்கு வாணிகம் பேணிப்",
          Line2: "பிறவும் தமபோல் செயின்.",
          mv: "பிறர் பொருளையும் தமக்கே உரிய பொருள் போலப் பாதுகாத்து நேர்மையாகச் செயல்படுவதே சிறந்த வணிகர்களுக்குரிய வாணிக நெறியாகும்.",
          trans: "True commerce flourishes when a trader guards others' interests just as their own."
        },
        valluvarAdvice: "பிறர் துன்பத்தில் லாபம் தேடாமல், நியாயமான தர்மத்துடன் வர்த்தகம் செய்வதே நீடித்த செல்வத்திற்கு வித்தாகும்."
      },
      {
        id: 'B',
        text: 'தானியத்தைப் பதுக்கி வைத்து அடுத்த மாதம் நான்கு மடங்கு அதிக விலைக்கு விற்று கொழுத்த லாபம் ஈட்டு.',
        textEn: 'Hoard the entire stock and sell next month at 400% inflated prices for enormous windfall profits.',
        outcome: `நீங்கள் பெரும் செல்வந்தர் ஆனீர்கள்; ஆனால் ஏழைக் குழந்தைகளின் பட்டினிச் சாவு உங்கள் வீட்டு வாயிலிலேயே நிகழ்ந்தது. மக்கள் உங்களை "ரத்தக் காட்டேரி" என சபித்தனர்.`,
        outcomeEn: `You became insanely rich in gold, but starvation deaths stained your conscience forever. Society despised you.`,
        statImpact: { aram: -32, porul: +35, inbam: -20 },
        kuralNumber: 113,
        kural: {
          Number: 113,
          Line1: "தக்கார் தகவிலர் என்பது அவரவர்",
          Line2: "எச்சத்தாற் காணப் படும்.",
          mv: "ஒருவர் நேர்மையானவரா அல்லது நடுவுநிலைமை தவறியவரா என்பது, அவருக்குப் பின்னால் அவர் விட்டுச் செல்லும் புகழினாலும் பழியினாலும் தெரிந்துவிடும்.",
          trans: "Whether one was righteous or unrighteous will be revealed by the legacy they leave behind."
        },
        valluvarAdvice: "அறமற்ற வழியில் சேர்க்கும் செல்வமானது இறுதியில் தீராத பழியையும் அவமானத்தையும் மட்டுமே தரும்."
      },
      {
        id: 'C',
        text: 'பாதி தானியத்தை மட்டும் அதிக விலைக்கு விற்றுவிட்டு, மீதியை ஏழைகளுக்குத் தானமாக வழங்கிப் பெயர் வாங்கு.',
        textEn: 'Sell half at inflated prices and donate the other half as ostentatious charity for social prestige.',
        outcome: `பணமும் கிடைத்தது, பெயரும் கிடைத்தது; ஆனால் உங்கள் உள்ளத்து உண்மை மனசாட்சிக்குத் தெரிந்து குற்ற உணர்வு வாட்டியது.`,
        outcomeEn: `You made money and won superficial praise, but deep down, your inner conscience knew the hypocrisy.`,
        statImpact: { aram: -5, porul: +15, inbam: +2 },
        kuralNumber: 282,
        kural: {
          Number: 282,
          Line1: "உள்ளத்தால் உள்ளலும் தீதே பிறன்பொருளைக்",
          Line2: "கள்ளத்தால் கள்வேம் எனல்.",
          mv: "அடுத்தவர் பொருளை ஏமாற்றி அபகரிக்கலாம் என்று மனதில் நினைத்துப் பார்ப்பது கூட மிகப்பெரிய தீமையாகும்.",
          trans: "Even the very thought in the heart to covet another's goods by deceit is an evil deed."
        },
        valluvarAdvice: "போலி தர்மத்தால் மனசாட்சியின் கறையை ஒருபோதும் மறைக்க முடியாது."
      }
    ]
  },

  {
    id: 'merchant_ocean_shipwreck',
    roleId: 'merchant',
    roleName: 'வணிகன் (The Merchant)',
    title: 'புயலில் சிக்கிய கப்பலும் மாலுமிகளின் உயிரும்',
    titleEn: 'The Storm-Tossed Ship and Sailor Lives',
    location: 'வங்கக் கடலின் நடுக்கடல் (Bay of Bengal Voyage)',
    situation: `சீனாவிற்கு விலையுயர்ந்த வாசனைப் பொருட்களையும் பட்டுக்களையும் ஏற்றிச் சென்ற உங்கள் வணிகக் கப்பல் கொடூரமான புயலில் சிக்கியது. கப்பல் அடிப்புறத்தில் ஓட்டை விழுந்து மூழ்கத் தொடங்குகிறது. 

தலைமை மாலுமி கூறுகிறார்: "ஐயா! கப்பலில் உள்ள அனைத்து சரக்கு மூட்டைகளையும் உடனடியாக கடலில் எறிந்தால் மட்டுமே மாலுமிகளின் 50 உயிர்களையும் காக்க முடியும். சரக்கை விடாவிட்டால் நாம் அனைவரும் மூழ்கிவிடுவோம்!" அந்த சரக்கு உங்கள் வாழ்நாள் உழைப்பு. என்ன முடிவு எடுப்பீர்கள்?`,
    situationEn: `Your spice merchant ship is sinking in a hurricane. The captain warns: "We must throw all our priceless silk and spices into the sea to save the 50 crew members!" That cargo is your entire life's fortune. What will you do?`,
    choices: [
      {
        id: 'A',
        text: 'ஒரு கணம் கூட தாமதிக்காமல் சரக்குகளைக் கடலில் எறிந்து அனைத்து மனித உயிர்களையும் காப்பாற்று.',
        textEn: 'Without a moment’s hesitation, jettison all cargo to save every single human soul aboard.',
        outcome: `பொருள் அழிந்தது; ஆனால் 50 மாலுமிகளும் குடும்பங்களும் கண்ணீருடன் உங்கள் காலில் விழுந்து வாழ்த்தினர். உங்கள் விடாமுயற்சியால் மீண்டும் உழைத்து இரண்டு ஆண்டுகளில் புதிய கப்பலை வாங்கினீர்கள்!`,
        outcomeEn: `Goods were lost, but 50 souls survived to kiss your hands in tears. Your resilient perseverance rebuilt a whole new fleet!`,
        statImpact: { aram: +25, porul: -20, inbam: +20 },
        kuralNumber: 616,
        kural: {
          Number: 616,
          Line1: "முயற்சி திருவினை ஆக்கும் முயற்றின்மை",
          Line2: "இன்மை புகுத்தி விடும்.",
          mv: "விடாமுயற்சியானது ஒருவனுக்குச் செல்வத்தைப் பெருக்கும்; முயற்சியில்லாமல் சோம்பி இருப்பது வறுமையையே கொண்டு வந்து சேர்க்கும்.",
          trans: "Resolute effort creates boundless wealth, while lack of effort brings only ruin."
        },
        valluvarAdvice: "உயிரை விடப் பொருள் பெரிதல்ல; மனித நேயமும் தளராத முயற்சியும் இழந்த செல்வத்தை மீட்டுத் தரும்."
      },
      {
        id: 'B',
        text: 'சரக்கைக் காப்பாற்ற முயற்சி செய்து மாலுமிகளை அவசர அவசரமாகத் தண்ணீரை வெளியேற்ற உத்தரவிடு.',
        textEn: 'Refuse to ditch the cargo; force exhausted sailors to furiously bail water until the end.',
        outcome: `கப்பல் பாரம் தாங்காமல் மூழ்கியது. நீங்கள் அதிர்ஷ்டவசமாக மரக்கட்டையைப் பிடித்துத் தப்பினாலும், 30 மாலுமிகள் சடலமாக மிதந்தனர். வாழ்நாள் பழி உங்களைச் சுட்டது.`,
        outcomeEn: `The ship sank under excessive weight. You miraculously washed ashore, but 30 drowned corpses haunted your dreams forever.`,
        statImpact: { aram: -35, porul: -40, inbam: -30 },
        kuralNumber: 327,
        kural: {
          Number: 327,
          Line1: "தன்ஊன் பெருக்கற்குத் தான்பிறிது ஊன்உண்பான்",
          Line2: "எங்ஙனம் ஆளும் அருள்.",
          mv: "தன் உடலை வளர்ப்பதற்காக மற்றோர் உயிரின் உடலைத் தின்பவன், எவ்வாறு பிற உயிர்களிடத்தில் அன்பும் கருணையும் உடையவனாக இருக்க முடியும்?",
          trans: "How can one possess compassion when they sacrifice another living being for selfish gain?"
        },
        valluvarAdvice: "செல்வ வெறியினால் மனித உயிர்களைப் பலியிடுபவன் அறவழியில் மீள முடியாத படுகுழியில் வீழ்வான்."
      },
      {
        id: 'C',
        text: 'விலையுயர்ந்த தங்கப் பெட்டகங்களை மட்டும் சிறு படகில் ஏற்றிவிட்டு மாலுமிகளை அவர்களின் தலைவிதிக்கு விடு.',
        textEn: 'Load only the gold chests onto the lone rescue lifeboat and abandon the sailors to their fate.',
        outcome: `நீங்கள் தங்கத்தோடு தப்பினீர்கள்; ஆனால் கரைக்கு வந்ததும் உங்கள் கொடூரம் ஊரெல்லாம் பரவியது. எந்த நாவிடனும் இனி உங்கள் கப்பலில் ஏற மறுத்துவிட்டான்.`,
        outcomeEn: `You escaped with gold chests, but news of your betrayal spread across every port. No sailor ever agreed to work for you again.`,
        statImpact: { aram: -40, porul: +10, inbam: -35 },
        kuralNumber: 110,
        kural: {
          Number: 110,
          Line1: "எந்நன்றி கொன்றார்க்கும் உய்வுண்டாம் உய்வில்லை",
          Line2: "செய்ந்நன்றி கொன்ற மகற்கு.",
          mv: "எந்தப் பெரிய அறத்தை அழித்தவருக்கும் பிராயச்சித்தம் உண்டு; ஆனால் தனக்கு உதவி செய்தவரின் நன்றியை மறந்த மனிதனுக்கு விமோசனமே கிடையாது.",
          trans: "There is redemption for any transgression, but none for the ungrateful who betray their benefactors."
        },
        valluvarAdvice: "உனக்காக உழைத்த மாலுமிகளுக்குச் செய்யும் துரோகம் ஈடேறாத பெரும்பாவமாகும்."
      }
    ]
  },

  // --- CITIZEN & SCHOLAR SCENARIOS ---
  {
    id: 'student_cheating_friend',
    roleId: 'citizen',
    roleName: 'மாணவன் (The Student)',
    title: 'நட்பின் சோதனையும் திருடப்பட்ட தேர்வு ஏடுகளும்',
    titleEn: 'The Test of Friendship and Stolen Exam Scrolls',
    location: 'மதுரை தமிழ்ச் சங்கப் பாடசாலை (Madurai Sangam Academy)',
    situation: `நாளைய தினம் பாண்டிய மன்னரின் அரசவைக் கவிஞர் தேர்வு நடைபெற உள்ளது. வெல்பவருக்குப் பொற்கிழியும் தலைமை ஆசிரியர் பதவியும் கிடைக்கும். 

உங்கள் உயிர் நண்பன் இரவு நேரத்தில் உங்கள் குடிலுக்கு ஓடி வருகிறான். அவன் கையில் தலைமைப் புலவரின் அறையிலிருந்து திருடப்பட்ட தேர்வு வினா ஏடுகள் உள்ளன. "நண்பா! நாம் இருவரும் இதைப் படித்து மன்னரிடம் முதல் இரண்டு இடங்களைப் பெறுவோம்! என்னை மறுக்காதே!" என்று அவன் கெஞ்சுகிறான். என்ன செய்வீர்கள்?`,
    situationEn: `Tomorrow is the royal scholarship exam. Your childhood best friend sneaks into your hut with the stolen exam questions, begging you to study together and share the royal glory. What will you do?`,
    choices: [
      {
        id: 'A',
        text: 'திருட்டு ஏடுகளைத் தொட மறுத்து, நண்பனுக்கும் நல்புத்தி கூறி ஏடுகளை உரிய இடத்தில் திருப்பிக் கொடுக்கச் சொல்.',
        textEn: 'Refuse the stolen questions firmly; counsel your friend to return them and rely on honest study.',
        outcome: `நண்பன் மனம் திருந்தி ஏடுகளைத் திருப்பிக் கொடுத்தான். மறுநாள் உங்கள் சொந்த அறிவால் பரீட்சை எழுதி இரண்டாம் இடம் பெற்றாலும், மன அமைதியும் மெய்யறிவும் உங்களுக்குக் கிடைத்தது!`,
        outcomeEn: `Your friend broke into tears of remorse and returned the scrolls. You passed by honest merit, earning deep self-respect.`,
        statImpact: { aram: +22, porul: +5, inbam: +15 },
        kuralNumber: 454,
        kural: {
          Number: 454,
          Line1: "மனத்தானாம் மாந்தர்க்கு உணர்ச்சி இனத்தானாம்",
          Line2: "இன்னான் எனப்படும் சொல்.",
          mv: "ஒருவனுக்கு இயல்பான அறிவு மனதால் ஏற்படுவதாகும்; ஆனால் இன்ன மனிதன் என்ற உலக மதிப்பும் புகழும் அவன் சேரும் நல்நட்பினாலேயே உருவாகும்.",
          trans: "A person's inner purity arises from the mind, but their honor is shaped by their company."
        },
        valluvarAdvice: "உண்மையான நண்பன் என்பவன் தவறு செய்யும் போது கடிந்துரைத்து நல்வழியில் திருத்துபவனே ஆவான்."
      },
      {
        id: 'B',
        text: 'நண்பனோடு சேர்ந்து திருட்டு ஏடுகளைப் படித்து மன்னரிடம் முதல் பரிசுப் பொற்கிழியை வெல்.',
        textEn: 'Study the leaked scrolls together and win the prestigious first prize and gold chest.',
        outcome: `நீங்கள் முதல் பரிசு பெற்றீர்கள்; ஆனால் தலைமைப் புலவர் விடைத்தாளின் ஒற்றுமையைக் கண்டு சந்தேகமடைந்தார். பயமும் நடுக்கமும் உங்கள் நிம்மதியைப் பறித்தது.`,
        outcomeEn: `You won the gold, but living with perpetual dread of exposure turned every waking moment into bitter anxiety.`,
        statImpact: { aram: -30, porul: +25, inbam: -20 },
        kuralNumber: 287,
        kural: {
          Number: 287,
          Line1: "களவின்கண் கன்றிய காதல் விழுமத்தின்",
          Line2: "வீழ்வும் விழுமம் தரும்.",
          mv: "பிறர் பொருளைத் திருடுவதில் உள்ள அளவுகடந்த ஆசையானது, ஒருவனை மீள முடியாத பெருந்துன்பத்தில் ஆழ்த்தி அவமானத்தைத் தரும்.",
          trans: "The feverish lust for stolen advantage plunges a person into irreversible misery and shame."
        },
        valluvarAdvice: "வஞ்சக வழியில் பெறும் கல்வி அல்லது பட்டம் ஒருபோதும் உண்மையான பெருமையைத் தராது."
      },
      {
        id: 'C',
        text: 'நீ படிக்காதே; ஆனால் நண்பனை உடனடியாக தலைமைப் புலவரிடம் காட்டிக் கொடுத்து தனியே பாராட்டுப் பெற முயற்சி செய்.',
        textEn: 'Do not read the scrolls, but betray your friend to the headmaster for personal brownie points.',
        outcome: `நண்பன் சிறை சென்றான்; நீங்கள் பரிசு பெற்றாலும் "நண்பனைக் காட்டிக் கொடுத்த துரோகி" என்று சக மாணவர்கள் உங்களைப் புறக்கணித்தனர்.`,
        outcomeEn: `Your friend was jailed; you got the reward, but your classmates forever ostracized you as a backstabbing informant.`,
        statImpact: { aram: -12, porul: +10, inbam: -22 },
        kuralNumber: 792,
        kural: {
          Number: 792,
          Line1: "நட்பென்பது நட்டபின் தேர்வன்று நாடோறும்",
          Line2: "ஒட்ட ஒழுகு பவர்க்கு.",
          mv: "நட்பு என்பது சேர்ந்த பிறகு ஆராய்வது அன்று; ஒருவரை நண்பராக ஏற்றுக் கொண்டபின் அவருடன் குற்றங்களைக் கடிந்து நல்வழியில் ஒன்றி வாழ்வதாகும்.",
          trans: "Friendship is not to be examined after alliance; it is to gently guide and accompany them on the virtuous path."
        },
        valluvarAdvice: "நண்பனை நல்வழிப்படுத்த முயலாமல் சுயலாபத்திற்காக பலிகடா ஆக்குவது நற்பண்பல்ல."
      }
    ]
  },

  {
    id: 'householder_hospitality_storm',
    roleId: 'citizen',
    roleName: 'இல்லறத்தான் (The Householder)',
    title: 'மழையிரவின் விருந்தினரும் குடும்பத்தின் சேமிப்பும்',
    titleEn: 'The Rainstorm Guest and Family Hearth',
    location: 'கொங்கு நாட்டு சிற்றூர் இல்லம் (Kongu Village)',
    situation: `உங்கள் வீட்டில் உங்கள் குழந்தையின் பிறந்தநாளுக்காகச் சிறிதளவு பலகாரங்களும் உணவும் சமைத்து வைக்கப்பட்டுள்ளது. கடுமையான புயல் மழையில் நனைந்தபடி, கந்தல் ஆடைகளுடன் ஒரு முதிய வழிப்போக்கர் நடுங்கியபடி உங்கள் கதவைத் தட்டுகிறார்.

அவர் மிகவும் பசியோடு இருக்கிறார். உங்கள் குடும்பத்தின் கையில் அடுத்த மூன்று நாட்களுக்கு வேறு உணவில்லை. உணவு கொடுத்தால் உங்கள் குடும்பம் பட்டினி கிடக்க வேண்டும்; விரட்டினால் அந்த முதியவர் மழையில் உயிரிழக்கக் கூடும். உங்கள் இல்லற தர்மம் என்ன கூறுகிறது?`,
    situationEn: `You cooked a modest meal for your child's birthday. A drenched, starving elderly traveler knocks on your door in a howling storm. Giving your food means your family will fast tomorrow. Turning him away means he may freeze to death. What will you do?`,
    choices: [
      {
        id: 'A',
        text: 'முதியவரை இன்முகத்துடன் வரவேற்று, உங்கள் உணவைப் பகிர்ந்து அளித்து வீட்டில் அடைக்கலம் கொடு.',
        textEn: 'Welcome the elder with radiant warmth, share your humble feast, and give him shelter.',
        outcome: `முதியவர் கண்கலங்கி உங்கள் குழந்தையை மனமார வாழ்த்தினார். மறுநாள் காலை மழை நின்றதும் ஊர் மக்கள் உங்கள் விருந்தோம்பலைக் கேள்விப்பட்டு பலமடங்கு தானியங்களை அன்பளிப்பாகக் கொண்டு வந்து குவித்தனர்!`,
        outcomeEn: `The elder blessed your child with tearful gratitude. Next morning, villagers heard of your generosity and brought gifts of grain!`,
        statImpact: { aram: +26, porul: -5, inbam: +24 },
        kuralNumber: 81,
        kural: {
          Number: 81,
          Line1: "இருந்தோம்பி இல்வாழ்வ தெல்லாம் விருந்தோம்பி",
          Line2: "வேளாண்மை செய்தற் பொருட்டு.",
          mv: "வீட்டில் இருந்து பொருளைச் சேமித்து இல்லறம் நடத்துவதெல்லாம், வரும் விருந்தினரைப் போற்றி அவர்களுக்கு உதவி செய்யும் மேலான கடமைக்கே ஆகும்.",
          trans: "All the wealth and domestic life of a householder exist solely to extend generous hospitality to guests."
        },
        valluvarAdvice: "இல்லறத்தின் தலையாய சிறப்பே விருந்தோம்பலும் ஈகையுமே ஆகும்."
      },
      {
        id: 'B',
        text: 'கதவைத் திறக்காமல் வீட்டில் யாருமில்லை என்பது போல விளக்கை அணைத்துவிட்டு உறங்கு.',
        textEn: 'Keep the doors bolted, turn off the clay lamp, and pretend nobody is home.',
        outcome: `உங்கள் உணவு மிச்சமானது; ஆனால் காலையில் கதவைத் திறந்தபோது முதியவர் உங்கள் வாசற்படியிலேயே குளிரில் விறைத்து இறந்து கிடந்தார். குடும்பத்தின் மகிழ்ச்சி சாம்பலானது.`,
        outcomeEn: `Your grain was saved, but next morning you found the traveler frozen to death on your doorstep. Lifelong remorse darkened your home.`,
        statImpact: { aram: -35, porul: +5, inbam: -35 },
        kuralNumber: 86,
        kural: {
          Number: 86,
          Line1: "செல்விருந்து ஓம்பி வருவிருந்து பார்த்திருப்பான்",
          Line2: "நல்விருந்து வானத் தவர்க்கு.",
          mv: "வந்த விருந்தினரைப் பேணி உபசரித்து, இனி வரும் விருந்தினரை ஆவலோடு எதிர்நோக்கி வாழும் இல்லறத்தான், வானுலகத் தேவர்க்கும் சிறந்த விருந்தினனாவான்.",
          trans: "He who honors the departing guest and eagerly awaits the next is welcomed as a noble guest by the gods."
        },
        valluvarAdvice: "வாசலில் வந்த விருந்தினரை விரட்டுவது இல்லறத்தின் புண்ணியத்தை அடியோடு அழித்துவிடும்."
      },
      {
        id: 'C',
        text: 'பழைய காய்ந்த ரொட்டித் துண்டை வாசலில் வீசிவிட்டு, சத்திரத்திற்குப் போகும்படி விரட்டு.',
        textEn: 'Toss a dry stale scrap of crust out the window and tell him to walk to the town rest-house.',
        outcome: `முதியவர் அவமானப்பட்டு கண்ணீருடன் நகர்ந்தார். உங்கள் குழந்தையும் உங்கள் ஈவிரக்கமற்ற குணத்தைக் கண்டு மனவருத்தம் அடைந்தது.`,
        outcomeEn: `The humiliated traveler limped away in tears. Even your child looked at you with disappointment.`,
        statImpact: { aram: -18, porul: 0, inbam: -15 },
        kuralNumber: 90,
        kural: {
          Number: 90,
          Line1: "மோப்பக் குழையும் அனிச்சம் முகந்திரிந்து",
          Line2: "நோக்கக் குழையும் விருந்து.",
          mv: "அனிச்ச மலர் முகர்ந்து பார்த்தவுடனே வாடிவிடும்; அதுபோல நாம் முகம் மலராமல் வேறுபட்டுப் பார்த்தவுடனேயே விருந்தினர் மனம் வாடிவிடும்.",
          trans: "The delicate Anicha flower withers upon smelling; a guest's heart withers at a welcoming glance withheld."
        },
        valluvarAdvice: "முகம் சுளித்துச் செய்யும் உதவி எவ்வித நன்மையையும் தராது; இன்முகமே விருந்தோம்பலின் உயிர்நாடி."
      }
    ]
  },

  {
    id: 'citizen_village_judge',
    roleId: 'citizen',
    roleName: 'நடுவர் (The Village Arbitrator)',
    title: 'நிலத் தகராறும் சகோதர பாசமும்',
    titleEn: 'The Land Dispute and Brotherly Affection',
    location: 'தொண்டை நாட்டு கிராமப் பஞ்சாயத்து (Village Assembly)',
    situation: `கிராம சபையின் நடுவராக நீங்கள் அமர்ந்துள்ளீர்கள். உங்கள் உடன் பிறந்த பாசமிகு சொந்தத் தம்பிக்கும், நிலமற்ற ஏழை விவசாயி ஒருவருக்கும் இடையே பல தலைமுறை எல்லைக் கல் தகராறு. 

பழைய ஓலைச்சுவடிகளை ஆய்வு செய்ததில், அந்த வளமான வயல் நிலம் ஏழை விவசாயிக்கே சொந்தமானது என்பது அசைக்க முடியாதபடி தெளிவாகிறது. ஆனால் தம்பிக்கு ஆதரவாகத் தீர்ப்பளிக்காவிட்டால் குடும்பமே உங்களைப் புறக்கணிக்கும். உங்கள் தீர்ப்பு யாது?`,
    situationEn: `As village arbitrator, you preside over a land boundary dispute between your beloved younger brother and a poor tenant farmer. The palm-leaf deeds prove beyond doubt the land belongs to the tenant. But ruling against your brother will outrage your entire clan. How do you rule?`,
    choices: [
      {
        id: 'A',
        text: 'சகோதர பாசத்தை ஒதுக்கிவிட்டு, உண்மையான ஆவணங்களின்படி ஏழை விவசாயிக்கே நிலத்தை வழங்கித் தீர்ப்பளி.',
        textEn: 'Put family sentiment aside and fearlessly award the land to the poor farmer per the truth.',
        outcome: `சபையிலுள்ள சான்றோர்கள் அனைவரும் எழுந்து நின்று உங்கள் நடுவுநிலைமையை வணங்கினர்! உங்கள் தம்பி சிறிது காலத்திற்குப் பின் தன் தவறை உணர்ந்து உங்களை வழிகாட்டியாக ஏற்றான்.`,
        outcomeEn: `The assembly elders rose in standing ovation to honor your integrity! Over time, even your brother realized your noble stance.`,
        statImpact: { aram: +25, porul: -10, inbam: +15 },
        kuralNumber: 118,
        kural: {
          Number: 118,
          Line1: "சமன்செய்து சீர்தூக்கும் கோல்போல் அமைந்தொருபால்",
          Line2: "கோடாமை சான்றோர்க்கு அணி.",
          mv: "முன்பே சமமாக நின்று, எடையை உள்ளபடி நிறுத்துக் காட்டும் துலாக்கோல் போல, எந்தப் பக்கமும் சாயாமல் நடுவுநிலைமை காப்பதே சான்றோர்க்கு அழகாகும்.",
          trans: "Like the poised scale that weighs accurately without leaning, unbending impartiality is the crown of the wise."
        },
        valluvarAdvice: "நீதி வழங்கும் இடத்தில் சொந்த பந்தம், சுயநலம் ஆகியவற்றுக்கு இடம் கொடுக்காமல் நடுவுநிலைமை காப்பதே சான்றாண்மை."
      },
      {
        id: 'B',
        text: 'தம்பியின் குடும்ப வலிமையைப் பாதுகாக்க, ஏழை விவசாயியை மிரட்டி நிலத்தை தம்பி பெயரிலேயே மாற்று.',
        textEn: 'Pressure the tenant farmer to surrender and award the land to your brother.',
        outcome: `குடும்பம் மகிழ்ந்தது; ஆனால் ஊர் மக்கள் உங்களுக்கு "நீதி விற்ற அநீதியாளர்" என்று பட்டம் சூட்டினர். சபையின் நடுவர் பதவியிலிருந்து அவமானத்தோடு நீக்கப்பட்டீர்கள்.`,
        outcomeEn: `Your clan celebrated, but villagers branded you an unjust judge. You were permanently stripped of public office in disgrace.`,
        statImpact: { aram: -32, porul: +15, inbam: -20 },
        kuralNumber: 119,
        kural: {
          Number: 119,
          Line1: "சொற்கோட்டம் இல்லது செப்பம் ஒருதலையா",
          Line2: "உட்கோட்டம் இன்மை பெறின்.",
          mv: "ஒருவனின் உள்ளத்தில் எந்த ஒரு பக்கமும் சாயாத நடுவுநிலைமை இருக்குமானால், அவனது சொல்லிலும் நடுவுநிலை வழுவாத நேர்மை வெளிப்படும்.",
          trans: "Fairness of speech will surely result if the heart is free from partiality."
        },
        valluvarAdvice: "அநீதியான தீர்ப்பு தலைமுறைகளுக்கும் மாறாத பழியையே குடும்பத்திற்குச் சேர்க்கும்."
      },
      {
        id: 'C',
        text: 'தீர்ப்பு கூறாமல் வழக்கை பல ஆண்டுகள் ஒத்திப்போட்டு பஞ்சாயத்தை விட்டு விலகு.',
        textEn: 'Postpone the verdict indefinitely and abandon the bench to avoid displeasing anyone.',
        outcome: `வழக்கு இழுத்தடித்ததில் ஏழை விவசாயி வாடி வதங்கினான்; உங்கள் இயலாமையைக் கண்டு மக்கள் ஏளனம் செய்தனர்.`,
        outcomeEn: `The farmer slowly withered under endless delay; people laughed at your cowardice to confront truth.`,
        statImpact: { aram: -15, porul: -5, inbam: -10 },
        kuralNumber: 114,
        kural: {
          Number: 114,
          Line1: "தக்கார் தகவிலர் என்பது அவரவர்",
          Line2: "எச்சத்தாற் காணப் படும்.",
          mv: "ஒருவர் நடுவுநிலைமை உடையவரா அல்லது தகுதியற்றவரா என்பது அவர் விட்டுச் செல்லும் அழியாத நற்செயல்களாலேயே அறியப்படும்.",
          trans: "The virtue or unworthiness of individuals is proven by the legacy they leave behind."
        },
        valluvarAdvice: "கடமையிலிருந்து தப்பியோடும் கோழைத்தனம் நீதியைக் கொலை செய்வதற்கு நிகராகும்."
      }
    ]
  }
];

export const getMoralTitles = (aram, porul, inbam) => {
  if (aram >= 80 && porul >= 55 && inbam >= 55) {
    return {
      title: 'பொன்முடி ஞான வேந்தன் (The Golden Philosopher Ruler)',
      badge: '👑',
      verdictTa: 'அறம், பொருள், இன்பம் ஆகிய மூன்றையும் சமநிலையில் போற்றி ஆட்சி செய்த உத்தம சான்றோர்! உங்கள் புகழ் அழியாமல் நிற்கும்.',
      verdictEn: 'The supreme embodiment of Thirukkural! You achieved the harmonious pinnacle of virtue, wealth, and joy without compromising truth.',
      classColor: 'gold'
    };
  }
  if (aram >= 75 && porul < 45) {
    return {
      title: 'அறநெறித் தியாகச் செம்மல் (The Saintly Ascetic of Truth)',
      badge: '🕊️',
      verdictTa: 'பொருளையும் செல்வத்தையும் விட அறத்தையும் மனிதநேயத்தையும் பெரிதாக மதித்த உயர்ந்த உள்ளம்!',
      verdictEn: 'A noble soul who placed moral conscience above worldly gold. A true disciple of Valluvar’s Arathuppaal.',
      classColor: 'purple'
    };
  }
  if (porul >= 75 && aram < 40) {
    return {
      title: 'பேராசைப் பெருவணிகன் / கொடுங்கோலன் (The Wealthy Tyrant)',
      badge: '⚠️',
      verdictTa: 'செல்வமும் அதிகாரமும் குவிந்தது; ஆனால் மனசாட்சியும் மக்கள் அன்பும் நழுவிவிட்டன. முறையற்ற செல்வம் நிலைக்காது என்று வள்ளுவர் எச்சரிக்கிறார்!',
      verdictEn: 'You amassed immense gold, but sacrificed honor and ethics. Valluvar warns: ill-gotten wealth brings sudden ruin.',
      classColor: 'red'
    };
  }
  if (inbam >= 75 && aram < 40) {
    return {
      title: 'சுயநல இன்ப நாடி (The Carefree Hedonist)',
      badge: '🎭',
      verdictTa: 'கவலைகளின்றி வாழ்ந்தாலும், சமூகப் பொறுப்பும் பிறருக்கு உதவும் தர்மமும் மறக்கப்பட்டது.',
      verdictEn: 'You sought ease and avoided hardships, but shrank away from the noble obligations of a principled citizen.',
      classColor: 'amber'
    };
  }
  if (aram >= 60 && porul >= 45 && inbam >= 45) {
    return {
      title: 'செங்கோல் சான்றோர் (The Balanced Exemplar)',
      badge: '⚖️',
      verdictTa: 'வள்ளுவர் காட்டிய நடுவுநிலைமையோடு உலக வாழ்வைச் சிறப்பாக வழிநடத்திய மாமனிதர்!',
      verdictEn: 'A master of balance! You navigated complex worldly storms with an impartial heart and wise foresight.',
      classColor: 'emerald'
    };
  }
  return {
    title: 'வாழ்வியல் யாத்ரீகர் (The Life Pilgrim)',
    badge: '🌿',
    verdictTa: 'வாழ்வின் கடினமான சோதனைகளைக் கடந்து படிப்பினைகளைப் பெற்ற பயணி. மேலும் வள்ளுவர் வழியில் பயணத்தைத் தொடருங்கள்!',
    verdictEn: 'An earnest pilgrim learning the deep lessons of existence. Continue walking with Valluvar as your compass.',
    classColor: 'blue'
  };
};

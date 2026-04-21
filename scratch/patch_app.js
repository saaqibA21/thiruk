import fs from 'fs';

const path = 'c:/Users/SAAQIB/thirukural/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `onKeyPress={async (e) => {
                                        if (e.key === 'Enter') {
                                           let currentQuery = query.trim();
                                           const hasEnglish = /[a-zA-Z]/.test(currentQuery);
                                           setIsTranslating(true);
                                           if (hasEnglish) {
                                              try {
                                                 const url = \`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=\${encodeURIComponent(currentQuery)}\`;
                                                 const res = await fetch(url);
                                                 const data = await res.json();
                                                 if (data && data[0]) {
                                                    const translated = data[0].map(x => x[0]).join('');
                                                    if (translated) currentQuery = translated;
                                                 }
                                              } catch (err) {}
                                           }
                                           if (aiEngine && currentQuery.length > 3) {
                                               const formed = await aiEngine.refineQuery(currentQuery);
                                               if (formed) currentQuery = formed;
                                           }
                                           setQuery(currentQuery);
                                           setIsTranslating(false);
                                           handleAsk(currentQuery);
                                        }
                                     }}`;

// Use a regex that is less sensitive to exact whitespace
const regex = /onKeyPress=\{async \(e\) => \{\s+if \(e\.key === 'Enter'\) \{[\s\S]+?\}\s+\}\}/;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content);
    console.log("Success with Regex");
} else {
    console.log("Regex failed");
}

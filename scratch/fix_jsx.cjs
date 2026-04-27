const fs = require('fs');
const path = 'c:/Users/SAAQIB/thirukural_pro/src/App.jsx';
let content = fs.readFileSync(path, 'utf8').split('\n');

const replacement = `                                              {m.sources.slice(0, m.showMore ? m.sources.length : 5).map((s, idx) => (
                                                 <div key={idx} className="kural-card-wrapper">
                                                    <div className="kural-card-score">Score: {s.score?.toLocaleString()} | Match: {s.matchedUniqueWords || 0}</div>
                                                    <KuralCard 
                                                       kural={s} 
                                                       highlight={m.searchTerms}
                                                       onSelect={() => setSelectedKural(s)} 
                                                    />
                                                 </div>
                                              ))}`;

// Line 294 is index 293. Line 305 is index 304.
content.splice(293, 12, replacement);

fs.writeFileSync(path, content.join('\n'), 'utf8');

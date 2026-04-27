import sys

path = r'c:\Users\SAAQIB\thirukural_pro\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Target block starts at line 294 (index 293)
# Ends at line 305 (index 304)
# We want to replace it with a clean version.

replacement = """                                              {m.sources.slice(0, m.showMore ? m.sources.length : 5).map((s, idx) => (
                                                 <div key={idx} className="kural-card-wrapper">
                                                    <div className="kural-card-score">Score: {s.score?.toLocaleString()} | Match: {s.matchedUniqueWords || 0}</div>
                                                    <KuralCard 
                                                       kural={s} 
                                                       highlight={m.searchTerms}
                                                       onSelect={() => setSelectedKural(s)} 
                                                    />
                                                 </div>
                                              ))}\n"""

lines[293:305] = [replacement]

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

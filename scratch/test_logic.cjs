const fs = require('fs');
const path = require('path');

// Mock data and simplified classes for testing the specific logic we changed
const dataset = JSON.parse(fs.readFileSync('c:/Users/SAAQIB/thirukural/thirukkural.json', 'utf8')).kural;

class MockKuralAI {
    constructor(dataset) {
        this.dataset = dataset;
    }

    async search(query) {
        // Copied logic from ai-engine.js for validation
        const cleanQuery = query.toLowerCase().trim().normalize('NFC');
        const terms = cleanQuery.split(/\s+/).filter(t => t.length >= 1);
        
        const endKeywords = ['முடியும்', 'mudiyum', 'ending', 'ends with'].map(s => s.normalize('NFC'));
        const startKeywords = ['தொடங்கும்', 'starting', 'starts with'].map(s => s.normalize('NFC'));
        
        const isEndsWithQuery = endKeywords.some(kw => cleanQuery.includes(kw));
        const isStartsWithQuery = startKeywords.some(kw => cleanQuery.includes(kw));
        const isStructuralQuery = isEndsWithQuery || isStartsWithQuery;
        
        const stopWords = [...endKeywords, ...startKeywords, 'குறள்', 'என', 'என்று', 'எண்று'];
        const searchTerms = terms.filter(t => !stopWords.includes(t));

        let startMatchCount = 0;
        let endMatchCount = 0;

        const results = this.dataset.map(k => {
            let score = 0;
            const l1 = k.Line1.toLowerCase().normalize('NFC');
            const l2 = k.Line2.toLowerCase().normalize('NFC');
            const cleanL1 = l1.replace(/[.,!?;:"]/g, '');
            const cleanL2 = l2.replace(/[.,!?;:"]/g, '');
            const wordsL1 = cleanL1.trim().split(/\s+/);
            const wordsL2 = cleanL2.trim().split(/\s+/);

            searchTerms.forEach(targetWord => {
                const firstWord = wordsL1[0] || "";
                const lastWord = wordsL2[wordsL2.length - 1] || "";
                if (firstWord === targetWord || cleanL1.startsWith(targetWord)) startMatchCount++;
                if (lastWord === targetWord || cleanL2.endsWith(targetWord)) endMatchCount++;
            });
            return k;
        });

        return { metadata: { isStructuralQuery, isStartsWithQuery, isEndsWithQuery, startMatchCount, endMatchCount }, searchTerms };
    }

    fallback(question, matchesCount, searchTerms, metadata) {
        const target = searchTerms.join(', ') || question;
        if (metadata.isStructuralQuery) {
            const hasRequestedMatch = (metadata.isStartsWithQuery && metadata.startMatchCount > 0) || 
                                      (metadata.isEndsWithQuery && metadata.endMatchCount > 0);
            if (hasRequestedMatch) {
                return `நிச்சயமாக, உங்கள் தேடலுக்குத் துல்லியமாகப் பொருந்தும் ${matchesCount} குறள்கள் இதோ:`;
            } else {
                let msg = `மன்னிக்கவும், நீங்கள் குறிப்பிட்டபடி ${metadata.isStartsWithQuery ? 'தொடங்கும்' : 'முடியும்'} குறள் எதுவும் இல்லை. `;
                if (metadata.startMatchCount > 0 || metadata.endMatchCount > 0) {
                    msg += `ஆனால் "${target}" என்ற சொல்லைக் கொண்ட ${matchesCount} குறள்கள் இதோ (இதில் ${metadata.startMatchCount} தொடக்கத்திலும், ${metadata.endMatchCount} இறுதியிலும் வரும் குறள்கள் அடங்கும்):`;
                }
                return msg;
            }
        }
        let genericMsg = `"${target}" என்ற சொல்லைக் கொண்ட ${matchesCount} குறள்கள் கண்டறியப்பட்டுள்ளன. `;
        if (metadata.startMatchCount > 0 || metadata.endMatchCount > 0) {
            genericMsg += `(இதில் ${metadata.startMatchCount} ஒரு வரியின் தொடக்கத்திலும், ${metadata.endMatchCount} வரியின் இறுதியிலும் அமைகின்றன.)`;
        }
        return genericMsg;
    }
}

async function test() {
    const ai = new MockKuralAI(dataset);
    
    console.log("Test 1: User types only 'படும்'");
    const res1 = await ai.search("படும்");
    console.log(ai.fallback("படும்", 229, res1.searchTerms, res1.metadata));
    
    console.log("\nTest 2: User asks for starting with 'படும்' (but it only ends with it)");
    const res2 = await ai.search("படும் தொடங்கும் குறள்");
    console.log(ai.fallback("படும் தொடங்கும் குறள்", 229, res2.searchTerms, res2.metadata));
}

test();

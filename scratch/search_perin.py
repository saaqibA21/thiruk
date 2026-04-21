import json

file_path = r'c:\Users\SAAQIB\thirukural\thirukkural.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

kurals = data.get('kural', [])
results = []
target = 'பெறின்'

for kural in kurals:
    line2 = kural.get('Line2', '')
    # Remove common punctuation at the end
    clean_line2 = line2.strip(' .!?,')
    if clean_line2.endswith(target):
        results.append(kural)

print(f"Found {len(results)} matches.")
for r in results:
    print(f"Kural {r['Number']}:")
    print(r['Line1'])
    print(r['Line2'])
    print(f"Explanation: {r['mk']}") # Using mk (Mu. Karunanidhi) or sp (Solomon Pappaiah) for meaningful explanation
    print("-" * 20)

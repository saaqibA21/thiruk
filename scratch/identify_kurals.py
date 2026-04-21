
import json
import re

file_path = r'c:\Users\SAAQIB\thirukural\public\thirukkural.json'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

positions = [50466, 166619, 480781, 483864, 775865, 866234, 892009, 929313, 958339, 958414, 975031, 986319, 1138950, 1163215, 1215321, 1347809]

with open('scratch/kural_id_report.txt', 'w', encoding='utf-8') as f:
    for pos in positions:
        # Look backwards for "Number":
        # We need to find the "Number" associated with the CURRENT object.
        # It's better to find the last { and then the Number: within it.
        obj_start = content.rfind('{', 0, pos)
        chunk = content[obj_start:pos]
        match = re.search(r'"Number":\s*(\d+)', chunk)
        number = match.group(1) if match else "Unknown"
        
        char = content[pos]
        hex_code = hex(ord(char))
        context = content[max(0, pos-20):min(len(content), pos+20)].replace('\n', ' ')
        
        f.write(f"Kural {number} (Pos {pos}): {context}\n")

print("Report written to scratch/kural_id_report.txt")

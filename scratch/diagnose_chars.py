import sys

with open(r'c:\Users\SAAQIB\thirukural\thirukkural.json', 'r', encoding='utf-8') as f:
    content = f.read()

target = "தடை"
import unicodedata
target_nfc = unicodedata.normalize('NFC', target)
target_nfd = unicodedata.normalize('NFD', target)

print(f"Target NFC: {[hex(ord(c)) for c in target_nfc]}")
print(f"Target NFD: {[hex(ord(c)) for c in target_nfd]}")

found_nfc = target_nfc in content
found_nfd = target_nfd in content

print(f"Found NFC: {found_nfc}")
print(f"Found NFD: {found_nfd}")

# Find occurrences and show surrounding characters
if found_nfc:
    idx = content.find(target_nfc)
    print(f"Occurrence at {idx}: {content[idx-10:idx+20]!r}")

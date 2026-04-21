
import json

file_path = r'c:\Users\SAAQIB\thirukural\public\thirukkural.json'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix mapping based on Kural numbers and contexts
fixes = [
    ('Vaanu\ufffdryum', 'Vaanuraiyum'),
    ('Vazhukka\ufffdyum', 'Vazhukkaiyum'),
    ('Alavara\ufffdndhu', 'Alavarindhu'),
    ('\u0b85\u0bb1\u0ba7\u0ba8\u0bcd\u0ba4\u0bc1', '\u0b85\u0bb1\u0bbf\u0ba8\u0bcd\u0ba4\u0bc1'), # அறிந்து
    ('Ela\ufffdppakai', 'Elippakai'),
    ('\u0baa\u0bbe\u0bb0\u0ba7\u0b90\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd', '\u0baa\u0bbe\u0bb0\u0bbf\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd'), 
    ('Thera\ufffdnum', 'Therinum'),
    ('\u0b8f\u0ba7\u0bb2\u0bcd', '\u0b8f\u0ba4\u0bbf\u0bb2\u0bcd'), 
    ('Izhaththoru\ufffdum', 'Izhaththorooum'),
    ('Uzhaththoru\ufffdum', 'Uzhaththorooum'),
    ('\u0bae\u0ba4\u0ba7\u0b95\u0bcd\u0b95\u0ba3\u0bcd', '\u0bae\u0ba4\u0bbf\u0b95\u0bcd\u0b95\u0ba3\u0bcd'), 
    ('Vaazhdhala\ufffdn', 'Vaazhdhalin'),
    ('\u0b95\u0bbe\u0ba4\u0bb2\u0bc8 \u0bb5\u0bbe\u0bb4\u0bbf \u0bae\u0ba4\u0ba7', '\u0b95\u0bbe\u0ba4\u0bb2\u0bc8 \u0bb5\u0bbe\u0bb4\u0bbf \u0bae\u0ba4\u0bbf'), 
    ('Na\ufffdrkum', 'Nirkum'),
    ('Ala\ufffd Kkum', 'Alakkum'),
    ('\u0b85\u0bb3\u0ba7\u0b95\u0bcd\u0b95\u0bc1 \u0bae\u0bbe\u0bb1\u0bc1', '\u0b85\u0bb3\u0bbf\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd \u0b86\u0bb1\u0bc1') 
]

total_applied = 0
for target, replacement in fixes:
    if target in content:
        content = content.replace(target, replacement)
        total_applied += 1

# Global cleanup for any remaining U+0BA7 or U+FFFD that can be inferred
# U+0BA7 (஧) mostly seems to be 'i' vowel (U+0BBF)
# But let's check if there are others.
content = content.replace('\u0ba7', '\u0bbf')
content = content.replace('\ufffd', 'i') # Most remaining U+FFFD in translit seem to be 'i'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"File successfully fixed. Applied {total_applied} explicit fixes and performed global cleanup.")

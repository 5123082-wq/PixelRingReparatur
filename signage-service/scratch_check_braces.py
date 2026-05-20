import sys

def check_braces(filename):
    with open(filename, 'r', errors='ignore') as f:
        code = f.read()

    stack = []
    in_string = None
    in_comment = False
    escape = False
    idx = 0
    n = len(code)

    while idx < n:
        char = code[idx]
        if escape:
            escape = False
            idx += 1
            continue
        
        # Check comments
        if in_comment:
            if in_comment == 'line' and char == '\n':
                in_comment = False
            elif in_comment == 'block' and char == '/' and idx > 0 and code[idx-1] == '*':
                in_comment = False
            idx += 1
            continue

        # Check strings
        if in_string:
            if char == '\\':
                escape = True
            elif char == in_string:
                in_string = None
            idx += 1
            continue

        # Start of comment
        if char == '/' and idx + 1 < n:
            if code[idx+1] == '/':
                in_comment = 'line'
                idx += 2
                continue
            elif code[idx+1] == '*':
                in_comment = 'block'
                idx += 2
                continue

        # Start of string
        if char in ["'", '"', '`']:
            in_string = char
            idx += 1
            continue

        if char == '{':
            lno = code[:idx].count('\n') + 1
            stack.append(('{', lno, code[max(0, idx-40):idx+40].replace('\n', ' ')))
        elif char == '}':
            if stack:
                stack.pop()
            else:
                lno = code[:idx].count('\n') + 1
                snippet = code[max(0, idx-40):idx+40].replace('\n', ' ')
                print(f'Mismatched closing brace }} at line {lno}: {snippet}')
        idx += 1

    for item, lno, snippet in stack:
        print(f'Unclosed opening brace {item} from line {lno}: {snippet}')

if __name__ == '__main__':
    check_braces('src/components/sections/BusinessShowcase.tsx')

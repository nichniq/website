export default
`This file describes how to read files of my special note-taking syntax. You read
them top to bottom. If you encounter a block of text like this, it's just
plaintext. As soon as you encounter an empty line, you move onto the next block.

- This is a list block
- Lists items each start with a dash
- Plaintext and lists are primitives
- Everything else is blocks

{{ list
    - Block content starts with {{ and a noun
    - The noun describes what kind of block it is
    - Content in blocks is indented and parsed according to the block type
    - Blocks and with {{
}}

{{ text
    This block and the list block are redundant because you could describe their
    content without the full block syntax. However, it illustrates that lists
    and text are parsed the same as their primitive versions. There's another
    common redundancy that helps with brevity.
}}

{{ : -> list }}
{{ * -> keyword }}

{{ :
    - You might call them nicknames, pointers, aliases, shorthands, synonyms
    - In this case, {{ A -> B }}, A is another way of saying B
    - They can be any length, but single-character shorthands are special
    - They can be used for {* inline blocks}
    - Nicknames are limited to their same file
}}

Files aim to be self-descriptive. Each file grows its own minimum language, fit
exactly to describe itself.`;

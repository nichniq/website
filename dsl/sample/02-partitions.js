export default
`[ [
  ["raw_text","This file describes how to read files of my special note-taking syntax. You read"],
  ["raw_text","them top to bottom. If you encounter a block of text like this, it's just"],
  ["raw_text","plaintext. As soon as you encounter an empty line, you move onto the next block."]
],[
  ["line_item","- This is a list block"],
  ["line_item","- Lists items each start with a dash"],
  ["line_item","- Plaintext and lists are primitives"],
  ["line_item","- Everything else is blocks"]
],[
  ["open_block","{{ list"],
  ["indented","    - Block content starts with {{ and a noun"],
  ["indented","    - The noun describes what kind of block it is"],
  ["indented","    - Content in blocks is indented and parsed according to the block type"],
  ["indented","    - Blocks and with {{"],
  ["close_block","}}"]
],[
  ["open_block","{{ text"],
  ["indented","    This block and the list block are redundant because you could describe their"],
  ["indented","    content without the full block syntax. However, it illustrates that lists"],
  ["indented","    and text are parsed the same as their primitive versions. There's another"],
  ["indented","    common redundancy that helps with brevity."],
  ["empty_line",""],
  ["indented","    An empty line within a block."],
  ["close_block","}}"]
],[
  ["full_block","{{ : -> list }}"]
],[
  ["full_block","{{ * -> keyword }}"]
],[
  ["open_block","{{ :"],
  ["indented","    - You might call them nicknames, pointers, aliases, shorthands, synonyms"],
  ["indented","    - In this case, {{ A -> B }}, A is another way of saying B"],
  ["indented","    - They can be any length, but single-character shorthands are special"],
  ["indented","    - They can be used for {* inline blocks}"],
  ["indented","    - Nicknames are limited to their same file"],
  ["close_block","}}"]
],[
  ["raw_text","Files aim to be self-descriptive. Each file grows its own minimum language, fit"],
  ["raw_text","exactly to describe itself."]
] ]`;

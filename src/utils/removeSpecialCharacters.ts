function removeSpecialCharacters(input: string): string {
  // Use a regular expression to remove square brackets and their contents
  return input.replace(/\[.*?\]/g, '').trim();
}

export default removeSpecialCharacters;

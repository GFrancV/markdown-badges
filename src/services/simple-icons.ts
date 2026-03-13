export async function getIcons(): Promise<SimpleIcon[]> {
  const req = await fetch(
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/data/simple-icons.json",
  );
  const data = await req.json();

  return data;
}

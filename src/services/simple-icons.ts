export async function getIcons(signal?: AbortSignal): Promise<SimpleIcon[]> {
  const req = await fetch(
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/data/simple-icons.json",
    { signal },
  );
  const data = await req.json();

  return data;
}

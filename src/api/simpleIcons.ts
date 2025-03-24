export interface SimpleIcon {
  title: string;
  hex: string;
  source: string;
  aliases?: Aliases;
  license?: License;
  guidelines?: string;
}

interface Aliases {
  aka: string[];
}

interface License {
  type: string;
}

export const getIcons = async (): Promise<SimpleIcon[]> => {
  const req = await fetch(
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/_data/simple-icons.json"
  );  
  const data = await req.json();

  return data;
};

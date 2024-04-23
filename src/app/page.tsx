import { Searchbar } from "@/components/searchbar";

export default function Home() {
  return (
    <main className="w-full h-screen grid place-items-center">
      <Searchbar className="max-w-[600px]" />
    </main>
  );
}

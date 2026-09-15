import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />

      <section
        id="benefits"
        className="min-h-screen bg-[#f2eee5] px-6 py-32 text-[#17201d]"
      >
        <h2 className="font-serif text-6xl tracking-tight md:text-8xl">
          You don’t have to carry it all.
        </h2>
      </section>
    </main>
  );
}
import { Calculator } from '@/components/calculator';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground font-body">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#00FF0033_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <main className="container mx-auto flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 bg-gradient-to-r from-primary via-[#98FF98] to-primary bg-clip-text text-center text-5xl font-bold text-transparent md:text-6xl font-headline">
          MathMaster
        </h1>
        <p className="mb-8 max-w-2xl text-center text-lg text-muted-foreground">
          A simple arithmetic calculator for performing basic math operations. Powered by AI to generate practice problems from your history.
        </p>
        <Calculator />
      </main>
    </div>
  );
}

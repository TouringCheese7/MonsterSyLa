import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {

  return (
    <div className="min-h-screen bg-main text-white flex flex-col">

      <Header />

      <main className="max-w-6xl mx-auto py-10 px-4 w-full space-y-12 flex-1">
        {children}
      </main>

      <Footer />

    </div>
  );
}
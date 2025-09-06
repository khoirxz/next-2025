import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Auth() {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 max-w-xl mx-auto py-4 px-3 md:px-0">
        <h1>Login</h1>
      </div>
      <Footer />
    </div>
  );
}

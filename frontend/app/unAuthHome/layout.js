import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function HomeLayout({ children }) {
  return (
    <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
      <Navbar />
      {children}
    </div>
  );
}

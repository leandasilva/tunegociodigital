import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/fefre" className="text-white text-xl font-bold ml-6">TuNegDigital</Link>
        <div className="flex space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">Contactos</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;






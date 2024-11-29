import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
<<<<<<< HEAD
        <Link href="/fefre" className="text-white text-xl font-bold ml-6">TuNegDigital</Link>
=======
        <Link href="/" className="text-white text-xl font-bold ml-6">TuNegDigital</Link>
>>>>>>> 8ba14bf5873ef3221771cc66118aed462918f01d
        <div className="flex space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">Contactos</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;






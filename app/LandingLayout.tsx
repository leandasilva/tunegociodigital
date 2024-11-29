import React from 'react';

interface Props {
  children: React.ReactNode;
}

const LandingLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <header>
        {/* Agrega tu barra de navegación específica para la landing */}
        <nav>
          <h1>Landing Page Header</h1>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        {/* Pie de página */}
        <p>Landing Page Footer</p>
      </footer>
    </div>
  );
};

export default LandingLayout;

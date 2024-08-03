'use client'

import Accordion from '@/app/ui/accordion';

const items = [
  {
    title: 'Pregunta 1',
   content: 'Un texto expositivo es un tipo de texto informativo que presenta de manera objetiva hechos, ideas o conceptos para informar a un público no especializado sobre temas de interés general. Los textos expositivos tienen una clara intención pedagógica y son fundamentales en el proceso de construcción del conocimiento.',
  },
  {
    title: 'Pregunta 2',
    content: 'Un texto expositivo es un tipo de texto informativo que presenta de manera objetiva hechos, ideas o conceptos para informar a un público no especializado sobre temas de interés general. Los textos expositivos tienen una clara intención pedagógica y son fundamentales en el proceso de construcción del conocimiento.',
  },
  {
    title: 'Pregunta 3',
    content: 'Un texto expositivo es un tipo de texto informativo que presenta de manera objetiva hechos, ideas o conceptos para informar a un público no especializado sobre temas de interés general. Los textos expositivos tienen una clara intención pedagógica y son fundamentales en el proceso de construcción del conocimiento.',
  },
];

const Instructivo = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Instructivo</h1>
      <Accordion items={items} />
    </div>
  );
};

export default Instructivo;

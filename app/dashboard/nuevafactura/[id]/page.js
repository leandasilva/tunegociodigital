"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation,useQuery, gql } from '@apollo/client';
import { useState,useEffect} from 'react';
import { lusitana } from '@/app/ui/fonts';


const NUEVA_FACTURA = gql`
mutation NuevaFactura($input: FacturaInput) {
    nuevaFactura(input: $input) {
      id
      numero
      empresa
      total
      creado
      user
    }
  }
`;

const NuevaFactura = ({params}) => {

   // State para el mensaje
   const [mensaje, guardarMensaje] = useState(null)

  const empresa = params.id;

    // Routing
    const router = useRouter()

    const [nuevaFactura] = useMutation(NUEVA_FACTURA);

    

  const formik = useFormik({
    initialValues: {
      numero: '',
      empresa: empresa,
      total: 0,
    },
    validationSchema: Yup.object({
            numero: Yup.string() 
                        .required('El numero de la factura es obligatorio')       
        }), 
    onSubmit: async values => {
      try {
      const {data} = await nuevaFactura({ variables: { input: values } });

                // Usuario creado correctamente
              guardarMensaje(`Se creo correctamente la Factura N°${data.nuevaFactura.numero} `);

                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/dashboard/facturas')
                }, 3000);

        
      } catch (error) {
        guardarMensaje(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
      }
    },
  });


  const mostrarMensaje = () => {
    return(
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
            <p>{mensaje}</p>
        </div>
    )
}

const handleClick = () => {
  // Volver atrás
  router.push('/dashboard/proveedores');
};

  console.log(mensaje)
  return (
   <>   
      {mensaje && mostrarMensaje() }

        <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">
                <form
                    className="bg-white rounded-lg shadow-md px-8 pb-8 mb-4"
                    onSubmit={formik.handleSubmit}
                >
                  <div className="border-b border-stroke mb-5 px-6.5 py-4 dark:border-strokedark">
                        <h3 className={`${lusitana.className} text-center text-2xl `}>
                        Crear Nueva Factura
                        </h3>
                  </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero">
                           Factura
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="numero"
                            type="text"
                            placeholder="Numero de Factura"
                            value={formik.values.numero}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                     { formik.touched.numero && formik.errors.numero ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.numero}</p>
                                </div>
                            ) : null  }


                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                           Empresa
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="empresa"
                            type="text"
                            placeholder="Empresa de factura"
                            value={formik.values.empresa}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total">
                           Total
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="total"
                            type="Number"
                            placeholder="Total de factura"
                            value={formik.values.total}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>


                    <input
                        type="submit"
                        className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase  font-bold hover:cursor-pointer hover:bg-gray-900"
                        value="Crear Factura"
                    />
                    <input onClick={handleClick}  className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:cursor-pointer hover:bg-gray-900"
                                        value="Cancelar"
                                        type='button'
                                    />

                </form>
            </div>
        </div>
      </>
  );
};

export default NuevaFactura;






  
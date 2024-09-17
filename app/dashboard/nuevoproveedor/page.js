"use client"

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';

const NUEVO_PROVEEDOR = gql`
mutation NuevoProveedor($input: ProveedorInput) {
    nuevoProveedor(input: $input) {
      id
      empresa
      cuit
      monto
      telefono
      creado
      user
    }
  }
`;


const OBTENER_PROVEEDOR = gql`
query ObtenerProveedores {
    obtenerProveedores {
      id
      empresa
      cuit
      monto
      telefono
      creado
      user
    }
  }
`;

const NuevoProveedor = () => {

    const router = useRouter();

    // Mensaje de alerta
    const [mensaje, guardarMensaje] = useState(null);


    // Mutation para crear nuevos clientes
    const [ nuevoProveedor ] = useMutation(NUEVO_PROVEEDOR , {
        update(cache, { data: { nuevoProveedor } } ) {
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerProveedores } = cache.readQuery({ query: OBTENER_PROVEEDOR  });

            // Reescribimos el cache ( el cache nunca se debe modificar )
           cache.writeQuery({
               query: OBTENER_PROVEEDOR,
              data: {
                   obtenerProveedores : [...obtenerProveedores, nuevoProveedor ]
              }
           })
        }
    });


    const formik = useFormik({
        initialValues: {
            empresa: '',
            cuit:'',
            monto: 0,
            telefono: '',
        },
        validationSchema: Yup.object({
            empresa: Yup.string()
              .required('La empresa es requerida')
              .test(
                'no-espacios',
                'El nombre de la empresa no puede contener espacios',
                value => !/\s/.test(value)
              ),
          }),
        onSubmit: async values => {
            try {
                const {data} = await nuevoProveedor({ variables: { input: values } });
                console.log(data.nuevoProveedor);
                
                // Usuario creado correctamente
              guardarMensaje(`Se creo correctamente el Proveedor: ${data.nuevoProveedor.empresa} `);

              setTimeout(() => {
                  guardarMensaje(null);
                  router.push('/dashboard/proveedores')
              }, 3000);

            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
            }
        }
    })

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
                                    Nuevo Proveedor
                                    </h3>
                        </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                    Empresa
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="empresa"
                                    type="text"
                                    placeholder="Empresa del proveedor sin espacio..."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.empresa}
                                />
                            </div>

                            { formik.touched.empresa && formik.errors.empresa ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.empresa}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuit">
                                        Cuit
                                </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cuit"
                                        type="tel"
                                        placeholder="Cuit del proveedor"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.cuit}
                                    />
                            </div>


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="monto">
                                    Saldo
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="monto"
                                    type="Number"
                                    placeholder="Saldo del proveedor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.saldo}
                                />
                            </div>


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                        Teléfono
                                </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="telefono"
                                        type="tel"
                                        placeholder="Teléfono del cliente"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.telefono}
                                    />
                            </div>
                        
        
                            <input
                                type="submit"
                                className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:cursor-pointer hover:bg-gray-900"
                                value="Registrar Proveedor"
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
}
 
export default NuevoProveedor;
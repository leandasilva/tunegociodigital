'use client'

import React, { useState } from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';

const NUEVO_CLIENTE = gql`
mutation NuevoCliente($input: ClienteInput) {
    nuevoCliente(input: $input) {
      id
      razonsocial
      domicilio
      email
      telefono
      dni
      total
      totalGral
      estado
      creado
      user
    }
  }
`;


const OBTENER_CLIENTES_USUARIO = gql`
query ObtenerClientesUsuario {
    obtenerClientesUsuario {
      id
      razonsocial
      domicilio
      email
      estado
      dni
      telefono
      total
      totalGral
      creado
      user
    }
  }
`;

const NuevoCliente = () => {

    const router = useRouter();

    // Mensaje de alerta
    const [mensaje, guardarMensaje] = useState(null);


    // Mutation para crear nuevos clientes
    const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE , {
        update(cache, { data: { nuevoCliente } } ) {
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerClientesUsuario } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO  });

            // Reescribimos el cache ( el cache nunca se debe modificar )
           cache.writeQuery({
               query: OBTENER_CLIENTES_USUARIO,
              data: {
                   obtenerClientesUsuario : [...obtenerClientesUsuario, nuevoCliente ]
              }
           })
        }
    });


    const formik = useFormik({
        initialValues: {
            razonsocial: '',
            domicilio: '',
            email: '',
            telefono: '',
            dni:'',
            estado:'ACTIVO'
        },
        validationSchema: Yup.object({
            razonsocial: Yup.string() 
                        .required('El nombre del cliente es obligatorio')       
        }), 
        onSubmit: async values => {
            try {
                const {data} = await nuevoCliente({ variables: { input: values } });
                console.log(data.nuevoCliente);
                
                // Usuario creado correctamente
              guardarMensaje(`Se creo correctamente el Cliente: ${data.nuevoCliente.razonsocial} `);

              setTimeout(() => {
                  guardarMensaje(null);
                  router.push('/dashboard/clientes')
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
        router.push('/dashboard/clientes');
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
                                    Nuevo Cliente
                                    </h3>
                        </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="razonsocial">
                                    Razon Social
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="razonsocial"
                                    type="text"
                                    placeholder="RazonSocial del Cliente"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.razonsocial}
                                />
                            </div>

                            { formik.touched.razonsocial && formik.errors.razonsocial ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.razonsocial}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="domicilio">
                                    Domicilio
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="domicilio"
                                    type="text"
                                    placeholder="Domicilio del Cliente"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.domicilio}
                                />
                            </div>


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email Cliente"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
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

                            { formik.touched.telefono && formik.errors.telefono ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.telefono}</p>
                                </div>
                            ) : null  }


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dni">
                                    Dni
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="dni"
                                    type="text"
                                    placeholder="Dni del Cliente"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dni}
                                />
                            </div>

                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                                        Estado
                                </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="estado"
                                        type="text"
                                        placeholder="Estado del cliente"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.estado}
                                    />
                            </div>

        
                            <input
                                type="submit"
                                className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:cursor-pointer hover:bg-gray-900"
                                value="Registrar Cliente"
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
 
export default NuevoCliente;
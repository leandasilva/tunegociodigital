'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { lusitana } from '@/app/ui/fonts';

const OBTENER_CAJEROS = gql`
query ObtenerCajeros {
    obtenerCajeros {
      id
      nombre
      email
      empresa
      estado
      admin
      user
    }
  }
  `;

const NUEVO_CAJERO = gql`
mutation NuevoCajero($input: CajeroInput) {
    nuevoCajero(input: $input) {
      id
      nombre
      email
      empresa
      password
      entrada
      salida
      estado
      admin
      user
    }
  }
`

const NuevoCajero = ({params}) => {

   // State para el mensaje
   const [mensaje, guardarMensaje] = useState(null)

  const user = params.id;
    // Routing
    const router = useRouter()

    const [nuevoCajero] = useMutation(NUEVO_CAJERO,{
        update(cache, { data: { nuevoCajero } } ) {
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerCajeros } = cache.readQuery({ query: OBTENER_CAJEROS  });

            // Reescribimos el cache ( el cache nunca se debe modificar )
           cache.writeQuery({
               query: OBTENER_CAJEROS,
              data: {
                   obtenerCajeros : [...obtenerCajeros, nuevoCajero ]
              }
           })
        }
    });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      email: '',
      empresa:'',
      password: '',
      estado:'',
      user: user
    },
    validationSchema: Yup.object({
                nombre: Yup.string()
                .required('El Nombre es Obligatorio'), 
                email: Yup.string()
                .email('El email no es válido')
                .required('El email es obligatorio'),
                 password: Yup.string()
                .required('El password no puede ir vacio')
                .min(6, 'El password debe ser de al menos 6 caracteres')
    }),
    onSubmit: async values => {
      try {
      const {data} = await nuevoCajero({ variables: { input: values } });

                // Usuario creado correctamente
              guardarMensaje(`Se creo correctamente el Cajero: ${data.nuevoCajero.nombre}`);

                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/dashboard/cajeros')
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
  router.push('/dashboard/usuarios');
};


  return (
   <>   
      {mensaje && mostrarMensaje() }
      
        <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">
                <form
                    className="bg-white rounded-lg shadow-md px-8  pb-8 mb-4"
                    onSubmit={formik.handleSubmit}
                >

                    <div className="border-b border-stroke mb-5 px-6.5 py-4 dark:border-strokedark">
                        <h3 className={`${lusitana.className} text-center text-2xl `}>
                            Crear Nuevo Cajero
                        </h3>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                            Nombre
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="nombre"
                            type="text"
                            placeholder="Nombre Cajero"
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    { formik.touched.nombre && formik.errors.nombre ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.nombre}</p>
                        </div>
                    ) : null  }


                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email Cajero"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                    </div>

                    { formik.touched.email && formik.errors.email ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.email}</p>
                        </div>
                    ) : null  }


                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                           Empresa
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="empresa"
                            type="text"
                            placeholder="Empresa Cajero"
                            value={formik.values.empresa}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    { formik.touched.empresa && formik.errors.empresa ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.empresa}</p>
                        </div>
                    ) : null  }


                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password Cajero"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                    </div>

                    { formik.touched.password && formik.errors.password ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.password}</p>
                        </div>
                    ) : null  }

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                            Estado
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="estado"
                            type="text"
                            placeholder="Estado Cajero"
                            value={formik.values.estado}
                            onChange={formik.handleChange}
                        />
                    </div>

                    { formik.touched.estado && formik.errors.estado ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.estado}</p>
                        </div>
                    ) : null  }


                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user">
                            Usuario
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="estado"
                            type="text"
                            placeholder="Usuario del Cajero"
                            value={formik.values.user}
                            onChange={formik.handleChange}
                        />
                    </div>

                    { formik.touched.user && formik.errors.user ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.user}</p>
                        </div>
                    ) : null  }

                    <input
                        type="submit"
                        className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase  font-bold hover:cursor-pointer hover:bg-gray-900"
                        value="Crear Cuenta"
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

export default NuevoCajero;






  
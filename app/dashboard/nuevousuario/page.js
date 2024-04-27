'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { lusitana } from '@/app/ui/fonts';

const OBTENER_USUARIO = gql`
query obtenerUsuarios {
    obtenerUsuarios {
        id
        nombre
        apellido
        email
        telefono
        empresa
        estado
        admin
    }
  }
  `;

const NUEVO_USUARIO = gql`
mutation NuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
      telefono
      empresa
      password
    }
  }
`

const NuevoUsuario = () => {

   // State para el mensaje
   const [mensaje, guardarMensaje] = useState(null)


    // Routing
    const router = useRouter()

    const [nuevoUsuario] = useMutation(NUEVO_USUARIO, {
        update(cache, { data: { nuevoUsuario } } ) {
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerUsuarios } = cache.readQuery({ query: OBTENER_USUARIO  });

            // Reescribimos el cache ( el cache nunca se debe modificar )
           cache.writeQuery({
               query: OBTENER_USUARIO,
              data: {
                   obtenerUsuarios : [...obtenerUsuarios, nuevoUsuario ]
              }
           })
        }
    }
    );

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono:'',
      empresa:'',
      password: ''
    },
    validationSchema: Yup.object({
                nombre: Yup.string()
                .required('El Nombre es Obligatorio'), 
                apellido: Yup.string()
                .required('El Apellido es obligatorio'),
                email: Yup.string()
                .email('El email no es válido')
                .required('El email es obligatorio'),
                 password: Yup.string()
                .required('El password no puede ir vacio')
                .min(6, 'El password debe ser de al menos 6 caracteres')
    }),
    onSubmit: async values => {
      try {
      const {data} = await nuevoUsuario({ variables: { input: values } });

                // Usuario creado correctamente
              guardarMensaje(`Se creo correctamente el Usuario: ${data.nuevoUsuario.nombre}`);

                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/dashboard/usuarios')
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
                    className="bg-white rounded-lg shadow-md px-8 pb-8 mb-4"
                    onSubmit={formik.handleSubmit}
                >
                    <div className="border-b border-stroke mb-5 px-6.5 py-4 dark:border-strokedark">
                        <h3 className={`${lusitana.className} text-center text-2xl `}>
                            Crear Nuevo Usuario
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
                            placeholder="Nombre Usuario"
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                            Apellido
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="apellido"
                            type="text"
                            placeholder="Apellido Usuario"
                            value={formik.values.apellido}
                            onChange={formik.handleChange}
                        />
                    </div>

                    { formik.touched.apellido && formik.errors.apellido ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.apellido}</p>
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
                            placeholder="Email Usuario"
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                 Teléfono
                        </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="telefono"
                                    type="tel"
                                    placeholder="Teléfono Usuario"
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                           Empresa
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="empresa"
                            type="text"
                            placeholder="Empresa Usuario"
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
                            placeholder="Password Usuario"
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
                            placeholder="Estado Usuario"
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

                    <input
                        type="submit"
                        className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:cursor-pointer hover:bg-gray-900"
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

export default NuevoUsuario;






  
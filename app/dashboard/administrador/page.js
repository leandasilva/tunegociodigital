'use client'

import React,{useState,useEffect} from 'react';
import { useRouter } from 'next/navigation'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { lusitana } from '@/app/ui/fonts';

const OBTENER_ADMINISTRADOR = gql`
query ObtenerAdministradorLogueado {
    obtenerAdministradorLogueado {
      id
      nombre
      email
      dni
    }
  }
`;



const Administrador = () => {
    // obtener el ID actual
    const router = useRouter();
    //console.log('ID:', id);
        // Consultar para obtener el cliente

    const { data, loading, error } = useQuery(OBTENER_ADMINISTRADOR);



    // Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string() 
                    .required('El nombre del administrador es obligatorio'),
        email: Yup.string()
                    .email('Email no válido') 
                    .required('El email del administrador es obligatorio')
    });

    if(loading) return 'Cargando...';

    // console.log(data.obtenerCliente)

    const {  obtenerAdministradorLogueado} = data;


    return (
        <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">

                <Formik
                    validationSchema={schemaValidacion}
                    enableReinitialize
                    initialValues={obtenerAdministradorLogueado}
                    onSubmit={(values, actions) => {
                        // Aquí puedes manejar la lógica de envío del formulario
                        console.log(values);
                        actions.setSubmitting(false);
                    }}
                >
                    {props => (
                        <form
                            className="rounded-lg bg-white shadow-md px-8 pb-8 mb-4"
                            onSubmit={props.handleSubmit}
                        >

                                <div className="border-b border-stroke mb-5 px-6.5 py-4 dark:border-strokedark">
                                    <h3 className={`${lusitana.className} text-center text-2xl `}>
                                    Datos del Administrador
                                    </h3>
                                </div>

                            <div className={`${lusitana.className} mb-4`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre Admin"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.nombre}
                                />
                                {props.touched.nombre && props.errors.nombre && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.nombre}</p>
                                    </div>
                                )}
                            </div>

                            <div className={`${lusitana.className} mb-4`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email Admin"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.email}
                                />
                                {props.touched.email && props.errors.email && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.email}</p>
                                    </div>
                                )}
                            </div>

                            <div className={`${lusitana.className} mb-4`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dni">
                                    DNI
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="dni"
                                    type="text"
                                    placeholder="DNI Admin"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.dni}
                                />
                                {props.touched.dni && props.errors.dni && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.dni}</p>
                                    </div>
                                )}
                            </div>

                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
  }
 
export default Administrador;


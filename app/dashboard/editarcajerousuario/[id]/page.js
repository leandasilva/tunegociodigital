"use client"

import React,{useState} from 'react';
import { useRouter } from 'next/navigation'
import { useQuery, gql, useMutation} from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2';
import { lusitana } from '@/app/ui/fonts';

const OBTENER_CAJERO = gql`
query ObtenerCajeroUser($id: ID!) {
    obtenerCajeroUser(id: $id) {
      id
      entrada
      salida
      estado
      admin
      user
    }
  }
  `;

  const ACTUALIZAR_CAJERO = gql`
  mutation ActualizarUsuarioCajero($id: ID!, $input: CajeroInp) {
    actualizarUsuarioCajero(id: $id, input: $input) {
      id
      nombre
      entrada
      empresa
      email
      admin
      estado
      salida
    }
  }
  `;


const EditarCajeroUsuario = ({params}) => {
    // obtener el ID actual
    const router = useRouter();
    const id = params.id;
    //console.log('ID:', id);
        // Consultar para obtener el cliente

    const { data, loading, error } = useQuery(OBTENER_CAJERO, {
        variables: {
            id
        }
    });



        // mutation para actualizar cliente
        const [ actualizarUsuarioCajero ] = useMutation( ACTUALIZAR_CAJERO);

    if(loading) return 'Cargando...';

    // console.log(data.obtenerCliente)

    const { obtenerCajeroUser} = data;



    // Modifica el cliente en la BD
    const actualizarInfoCajero = async valores => {

        const { entrada,salida, estado,user } = valores;

       
        try {
            const { data} = await actualizarUsuarioCajero({
                variables: {
                    id,
                    input: {
                        entrada,
                        salida,
                        estado,
                        user        
                    }
                }
            });
  
            // Mostrar Alerta
            Swal.fire(
                'Actualizado',
                'El cajero se actualizó correctamente',
                'success'
            )

            // Redireccionar
            router.push('/dashboard/cajerosporusuario');
        } catch (error) {
            console.log(error);
        }
    }

    const handleClick = () => {
        // Volver atrás
        router.push('/dashboard/cajerosporusuario');
      };
      

    return ( 
        <>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        // validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerCajeroUser  }
                        onSubmit={ ( valores ) => {
                            actualizarInfoCajero(valores)
                        }}
                    >

                    {props => {
                    // console.log(props);
                    return (
                            <form
                                className="bg-white rounded-lg shadow-md px-8 pb-8 mb-4"
                                onSubmit={props.handleSubmit}
                            >
                               <div className="border-b border-stroke mb-5 px-6.5 py-4 dark:border-strokedark">
                                    <h3 className={`${lusitana.className} text-center text-2xl `}>
                                        Editar Cajero
                                    </h3>
                                </div>


                                    {/* <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                            Nombre
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="nombre"
                                            type="text"
                                            placeholder="Nombre Usuario"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.nombre}
                                        />
                                    </div>

                                    { props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        />
                                    </div>

                                    { props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
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
                                            placeholder="Empresa Usuario"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.empresa}
                                        />
                                    </div>

                                    { props.touched.empresa && props.errors.empresa ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                    ) : null  } */}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="entrada">
                                            Horario de entrada
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="entrada"
                                            type="text"
                                            placeholder="Entrada Cajero..."
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.entrada}
                                        />
                                    </div>

                                  
                                    { props.touched.entrada && props.errors.entrada ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.entrada}</p>
                                        </div>
                                    ) : null  } 


                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salida">
                                           Horario de salida
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="salida"
                                            type="text"
                                            placeholder="Salida cajero..."
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.salida}
                                        />
                                    </div>

                                    { props.touched.salida && props.errors.salida ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.salida}</p>
                                        </div>
                                    ) : null  } 


                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                                            Estado
                                        </label>

                                         <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="estado"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.estado}
                                        >
                                            <option value="ACTIVO">ACTIVO</option>
                                            <option value="INACTIVO">INACTIVO</option>
                                        </select> 
                                    </div>

                                    { props.touched.estado && props.errors.estado ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.estado}</p>
                                        </div>
                                    ) : null  } 




                                    <input
                                        type="submit"
                                        className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:cursor-pointer hover:bg-gray-900"
                                        value="Editar Cajero"
                                    /> 
                                    <input onClick={handleClick}  className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:cursor-pointer hover:bg-gray-900"
                                        value="Cancelar"
                                        type='button'
                                    />
                            </form>      
                        )
                    }}
                    </Formik> 
                </div>
            </div>
        </>
     );

  }
 
export default EditarCajeroUsuario;
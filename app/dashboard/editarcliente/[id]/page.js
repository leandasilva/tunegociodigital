"use client"

import React from 'react';
import { useRouter } from 'next/navigation'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2';
import { lusitana } from '@/app/ui/fonts';

const ACTUALIZAR_CLIENTE = gql`
mutation ActualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      id
      razonsocial
      domicilio
      email
      telefono
      dni
      totalGral
      estado
      user
    }
  }
`;

const OBTENER_CLIENTE = gql`
query ObtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      id
      razonsocial
      domicilio
      email
      dni
      totalGral
      estado
      user
    }
  }
`;


const OBTENER_CLIENTE_USUARIO = gql`
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


const EditarCliente = ({params}) => {
    // obtener el ID actual
    const router = useRouter();
    const id = params.id;
    //console.log('ID:', id);
      
        // Consultar para obtener el cliente

    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });



        // mutation para actualizar cliente
        const [ actualizarCliente ] = useMutation( ACTUALIZAR_CLIENTE);
        //     ,{
        //     update(cache, { data: { actualizarCliente } } ) {
        //         // Obtener el objeto de cache que deseamos actualizar
        //         const { obtenerClientesUsuario } = cache.readQuery({ query: OBTENER_CLIENTE_USUARIO  });
    
        //         // Reescribimos el cache ( el cache nunca se debe modificar )
        //        cache.writeQuery({
        //            query: OBTENER_CLIENTE_USUARIO,
        //           data: {
        //                obtenerClientesUsuario : [...obtenerClientesUsuario, actualizarCliente ]
        //           }
        //        })
        //     }
        // });

    // Schema de validacion
    const schemaValidacion = Yup.object({
        razonsocial: Yup.string() 
                    .required('La razon social del cliente es obligatorio'),
        totalGral: Yup.string()
                    .required('El total del cliente es obligatorio')
    });

    if(loading) return 'Cargando...';

    // console.log(data.obtenerCliente)

    const { obtenerCliente } = data;
 

    // Modifica el cliente en la BD
    const actualizarInfoCliente = async valores => {

        const {razonsocial,domicilio,email,telefono,dni,totalGral,estado,user } = valores;

       
        try {
            const { data} = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        razonsocial,
                        domicilio,
                        email, 
                        telefono,
                        dni,
                        totalGral,
                        estado,
                        user
                    }
                }
            });

            console.log(data);
  
            // Mostrar Alerta
            Swal.fire(
                'Actualizado',
                'El cliente se actualizó correctamente',
                'success'
            )

            // Redireccionar
            router.push('/dashboard/clientes');
        } catch (error) {
            console.log(error);
        }
    }


    const handleClick = () => {
        // Volver atrás
        router.push('/dashboard/clientes');
      };
      
    return ( 
        <>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerCliente  }
                        onSubmit={ ( valores ) => {
                            actualizarInfoCliente(valores)
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
                                    Editar Cliente
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.razonsocial}
                                        />
                                    </div>

                                    { props.touched.razonsocial && props.errors.razonsocial ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.razonsocial}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.domicilio}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                           Correo
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="email"
                                            type="text"
                                            placeholder="Correo del Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
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
                                            placeholder="Teléfono Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.telefono}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dni">
                                           Dni
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="dni"
                                            type="text"
                                            placeholder="Dni del Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.dni}
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalGral">
                                          Saldo
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="totalGral"
                                            type="number"
                                            placeholder="Total del Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.totalGral}
                                        />
                                    </div>

                                    { props.touched.totalGral && props.errors.totalGral ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.totalGral}</p>
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


                                    <input
                                        type="submit"
                                        className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold  hover:cursor-pointer hover:bg-gray-900"
                                        value="Editar Cliente"
                                    /> 
                                    <input onClick={handleClick}  className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold  hover:cursor-pointer hover:bg-gray-900"
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
 
export default EditarCliente;
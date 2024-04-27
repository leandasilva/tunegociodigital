'use client'

import React,{useState,useEffect} from 'react';
import { useRouter } from 'next/navigation'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2';
import { lusitana } from '@/app/ui/fonts';

const OBTENER_USUARIO = gql`
query ObtenerUsuario($id: ID!) {
    obtenerUsuario(id: $id) {
      id
      nombre
      apellido
      email
      telefono
      empresa
      password
      estado
      admin
    }
  }
`;

const ACTUALIZAR_USUARIO = gql`
mutation ActualizarUsuario($id: ID!, $input: UsuarioInput) {
    actualizarUsuario(id: $id, input: $input) {
      id
      nombre
      apellido
      email
      telefono
      empresa
      password
      estado
    }
  }
`;


const OBTENER_USUARIOS = gql`
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


const EditarUsuario = ({params}) => {
    // obtener el ID actual
    const router = useRouter();
    const id = params.id;
    //console.log('ID:', id);
        // Consultar para obtener el cliente

    const { data, loading, error } = useQuery(OBTENER_USUARIO, {
        variables: {
            id
        }
    });



        // mutation para actualizar cliente
        const [ actualizarUsuario ] = useMutation( ACTUALIZAR_USUARIO);

    // Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string() 
                    .required('El nombre del cliente es obligatorio'),
        apellido: Yup.string() 
                    .required('El apellido del cliente es obligatorio'),
        empresa: Yup.string() 
                    .required('El campo empresa  es obligatorio'),
        email: Yup.string()
                    .email('Email no válido') 
                    .required('El email del cliente es obligatorio')
    });

    if(loading) return 'Cargando...';

    // console.log(data.obtenerCliente)

    const { obtenerUsuario } = data;



    // Modifica el cliente en la BD
    const actualizarInfoUsuario = async valores => {

        const { nombre, apellido,email, empresa, telefono,password, estado } = valores;

       
        try {
            const { data} = await actualizarUsuario({
                variables: {
                    id,
                    input: {
                        nombre, 
                        apellido,
                        email, 
                        telefono,
                        empresa,
                        password,
                        estado        
                    }
                }
            });

            console.log(data);
  
            // Mostrar Alerta
            Swal.fire(
                'Actualizado',
                'El usuario se actualizó correctamente',
                'success'
            )

            // Redireccionar
            router.push('/dashboard/usuarios');
        } catch (error) {
            console.log(error);
        }
    }


    const handleClick = () => {
        // Volver atrás
        router.push('/dashboard/usuarios');
      };
      

    return ( 
        <>
            {/* <h1 className={`${lusitana.className} text-center text-2xl  mt-5`}>Editar Usuario</h1> */}

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerUsuario  }
                        onSubmit={ ( valores ) => {
                            actualizarInfoUsuario(valores)
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
                                <h3 className={`${lusitana.className} text-center text-2xl`}>
                                    Editar Usuario
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                            Apellido
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="apellido"
                                            type="text"
                                            placeholder="Apellido Usuario"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.apellido}
                                        />
                                    </div>

                                    { props.touched.apellido && props.errors.apellido ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.apellido}</p>
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                            Teléfono
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="telefono"
                                            type="tel"
                                            placeholder="Teléfono Usuario"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.telefono}
                                        />
                                    </div>



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
                                        value="Editar Usuario"
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
 
export default EditarUsuario;
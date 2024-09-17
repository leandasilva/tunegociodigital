"use client"

import React from 'react';
import { useRouter } from 'next/navigation'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2';
import { lusitana } from '@/app/ui/fonts';

const ACTUALIZAR_PROVEEDOR = gql`
mutation ActualizarProveedor($id: ID!, $input: ProveedorInput) {
    actualizarProveedor(id: $id, input: $input) {
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
query ObtenerProveedor($id: ID!) {
    obtenerProveedor(id: $id) {
      id
      empresa
      cuit
      monto
      telefono
      user
      creado
    }
  }
`;



const EditarProveedor = ({params}) => {
    // obtener el ID actual
    const router = useRouter();
    const id = params.id;
    //console.log('ID:', id);
      
        // Consultar para obtener el cliente

    const { data, loading, error } = useQuery(OBTENER_PROVEEDOR, {
        variables: {
            id
        }
    });



        // mutation para actualizar cliente
        const [ actualizarProveedor ] = useMutation( ACTUALIZAR_PROVEEDOR);

    // Schema de validacion
    const schemaValidacion = Yup.object({
        empresa: Yup.string() 
                    .required('La empresa del es obligatorio')
                    .test(
                        'no-espacios',
                        'El nombre de la empresa no puede contener espacios',
                        value => !/\s/.test(value)),
                      })

    if(loading) return 'Cargando...';

    // console.log(data.obtenerCliente)

    const { obtenerProveedor } = data;
 

    // Modifica el cliente en la BD
    const actualizarInfoProveedor = async valores => {

        const {empresa,cuit,monto,telefono } = valores;

       
        try {
            const { data} = await actualizarProveedor({
                variables: {
                    id,
                    input: {
                        empresa,
                        cuit,
                        monto,
                        telefono
                    }
                }
            });

  
            // Mostrar Alerta
            Swal.fire(
                'Actualizado',
                'El proveedor se actualizó correctamente',
                'success'
            )

            // Redireccionar
            router.push('/dashboard/proveedores');
        } catch (error) {
            console.log(error);
        }
    }


    const handleClick = () => {
        // Volver atrás
        router.push('/dashboard/proveedores');
      };
      
    return ( 
        <>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerProveedor  }
                        onSubmit={ ( valores ) => {
                            actualizarInfoProveedor(valores)
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
                                    Editar Proveedor
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
                                            placeholder="Empresa del proveedor"
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuit">
                                            Cuit
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="cuit"
                                            type="tel"
                                            placeholder="Cuit proveedor..."
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.cuit}
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.monto}
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

                                    <input
                                        type="submit"
                                        className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold  hover:cursor-pointer hover:bg-gray-900"
                                        value="Editar Proveedor"
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
 
export default EditarProveedor;
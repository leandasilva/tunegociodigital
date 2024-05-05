'use client'

import React from 'react';
import { useRouter } from 'next/navigation'
import { gql, useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { lusitana } from '@/app/ui/fonts';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            id
            nombre
            precio
            existencia
            codigo
            estado
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
            actualizarProducto(id:$id, input:$input) {
                id
                nombre
                existencia
                precio
                codigo
                estado
            }
    }
`;


const OBTENER_PRODUCTOS = gql`
query ObtenerProductosUsuario {
    obtenerProductosUsuario {
      id
      nombre
      precio
      existencia
      codigo
      estado
      creado
      user
    }
  }
`;

const EditarProducto = ({params}) => {
    const router = useRouter();
    const id = params.id;
    // console.log(id)

    // Consultar para obtener el producto
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    // Mutation para modificar el producto
    const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO);

    // Obtener la fecha actual
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const yyyy = today.getFullYear();
    const fechaActual = `${dd}/${mm}/${yyyy}`;

    // Schema de validación
    const schemaValidacion = Yup.object({
        nombre: Yup.string() 
                    .required('El nombre del producto es obligatorio'), 
        existencia: Yup.number()
                    .required('Agrega la cantidad disponible')
                    .positive('No se aceptan números negativos')
                    .integer('La existencia deben ser números enteros'),
        precio: Yup.number()
                    .required('El precio es obligatorio')
                    .positive('No se aceptan números negativos')
    });


    // console.log(data)
    // console.log(loading)
    // console.log(error)

    if(loading) return 'Cargando...';

    if(!data) { 
        return 'Acción no permitida';
    }

    const actualizarInfoProducto = async valores => {
        // console.log(valores);
        const { nombre, existencia, precio, codigo,estado ,creado} = valores;
        try {
            const {data} =  await actualizarProducto({
                variables: {
                    id, 
                    input: {
                        nombre,
                        existencia,
                        precio,
                        codigo,
                        estado,
                        creado:fechaActual
                    }
                }
            });
            // console.log(data);

            // Redirgir hacia productos
            router.push('/dashboard/productos')


            // Mostrar una alerta
            Swal.fire(
                'Actualizado',
                'El producto se actualizó correctamente',
                'success'
            )
            
        } catch (error) {
            console.log(error);
        }
    }

    const { obtenerProducto } = data;
    
    const handleClick = () => {
    // Volver atrás
    router.push('/dashboard/productos');
    };

    return ( 
        <>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik 
                        enableReinitialize
                        initialValues={obtenerProducto}
                        validationSchema={ schemaValidacion }
                        onSubmit={ valores => {
                            actualizarInfoProducto(valores)
                        }} 
                    >

                        {props => {
                            return (


                    <form
                        className="bg-white rounded-lg shadow-md px-8 pb-8 mb-4"
                        onSubmit={props.handleSubmit}
                    >
                        <div className="border-b border-stroke mb-5 px-6.5 py-4 dark:border-strokedark">
                            <h3 className={`${lusitana.className} text-center text-2xl `}>
                            Editar Producto
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
                                    placeholder="Nombre Producto"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                    Cantidad Disponible
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="existencia"
                                    type="number"
                                    placeholder="Cantidad Disponible"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.existencia}
                                />
                            </div>

                            { props.touched.existencia && props.errors.existencia ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.existencia}</p>
                                </div>
                            ) : null  } 

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Precio
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="precio"
                                    type="number"
                                    placeholder="Precio Producto"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.precio}
                                />
                            </div>

                            { props.touched.precio && props.errors.precio ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.precio}</p>
                                </div>
                            ) : null  } 

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Codigo
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="codigo"
                                    type="string"
                                    placeholder="Codigo Producto"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.codigo}
                                />
                            </div>

                            { props.touched.codigo && props.errors.codigo ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.codigo}</p>
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
                                value="Guardar Cambios"
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
 
export default EditarProducto;
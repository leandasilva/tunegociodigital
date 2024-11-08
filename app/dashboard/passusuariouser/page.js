"use client";

import React, { useState } from "react";
import { gql, useMutation, useQuery } from '@apollo/client';
import { lusitana } from '@/app/ui/fonts';
import { Button } from "@/app/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const MODIFICAR_PASS = gql`
  mutation ModificarPasswordUsuario($email: String!, $newPassword: String!) {
    modificarPasswordUsuario(email: $email, newPassword: $newPassword)
  }
`;

const OBTENER_USUARIO = gql`
  query ObtenerUsuarioLogueado {
    obtenerUsuarioLogueado {
      email
    }
  }
`;

const ModificarPassUsuario = () => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [modificarPasswordUsuario] = useMutation(MODIFICAR_PASS);
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(OBTENER_USUARIO);

  const [mensaje, guardarMensaje] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await modificarPasswordUsuario({
        variables: {
          email: usersData.obtenerUsuarioLogueado.email,
          newPassword,
        },
      });
      guardarMensaje('Contraseña modificado exitosamente');
      setTimeout(() => {
        guardarMensaje(null);
      }, 2000);
    } catch (error) {
      guardarMensaje('Hubo un error al modificar la contraseña.');
      setTimeout(() => {
        guardarMensaje(null);
      }, 2000);
    }
  };

  if (usersLoading) return <p>Loading...</p>;
  if (usersError) return <p>Error...</p>;

  const toggleMostrarPassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  const mostrarMensaje = () => (
    <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
      <p>{mensaje}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-lg">
      <h1 className={`${lusitana.className} text-2xl text-gray-800 font-light mt-5 mb-5 text-center`}>Modificar Contraseña Usuario</h1>
      {mensaje && mostrarMensaje()}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            placeholder="Nueva Contraseña"
            id="password"
            type={mostrarPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={toggleMostrarPassword}
          >
            {mostrarPassword ? (
              <FontAwesomeIcon icon={faEyeSlash} className="h-6 w-6 text-gray-400" />
            ) : (
              <FontAwesomeIcon icon={faEye} className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </div>
        <Button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Modificar Contraseña
        </Button>
      </form>
    </div>
  );
};

export default ModificarPassUsuario;

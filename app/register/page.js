"use client"
import { useState,useEffect } from 'react';
import { auth,firestore } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { toast } from 'react-hot-toast';
import { AvatarGenerator } from 'random-avatar-generator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function page() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const router = useRouter();

  const generateRandomAvatar = () => {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
  };

  const handleRefreshAvatar = () => {
    setAvatarUrl(generateRandomAvatar());
  };

  useEffect (() => {
    setAvatarUrl(generateRandomAvatar());
  }
  ,[]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Correo electrónico no válido';
    }
    if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        // Registrar usuario con autenticación de Firebase
        const userCredential = await createUserWithEmailAndPassword(auth,email, password);
        const user = userCredential.user;

         // Ahora puedes usar el UID del usuario como ID de documento
         const docRef = doc(firestore, 'users', user.uid);
         await setDoc(docRef, {
           name,
           email:email,
           avatarUrl,
           status:'online',
         });
        
         router.push('/');
         setErrors({});
      }
    } catch (error) {
      // Manejar errores de registro
      console.error('Error al registrar el usuario:', error.message);
      toast.error(error.message);
      setErrors({});
    }
    setLoading(false);
    
  };
  console.log(avatarUrl)
  return (
    <div className="flex justify-center items-center h-screen font-primary p-10 m-2">

      {/*form*/}
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl shadow-lg p-10">
    
        <h1 className='font-secondary text-xl text-center font-semibold text-[#0b3a65ff]'>Chat experimental</h1>

        {/* Mostrar el avatar y el botón de actualización */}
        <div className="flex items-center space-y-2 justify-between border border-gray-200 p-2">
          <img src={avatarUrl} alt="Avatar" className=" rounded-full h-20 w-20" />
          <button type="button" className="btn btn-outline" onClick={handleRefreshAvatar}>
            New Avatar
          </button>
        </div>

        
        {/*nombre*/}
        <div>
          <label className="label">
            <span className="text-base label-text">Nombre</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="w-full input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
           {errors.name && <span className="text-red-500">{errors.name}</span>}
        </div>
        
         {/*email*/}
        <div>
          <label className="label">
            <span className="text-base label-text">Email</span>
          </label>
          <input
            type="text"
            placeholder="Email"
            className="w-full input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
           {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

         {/*contraseña*/}
        <div>
          <label className="label">
            <span className="text-base label-text">Contraseña</span>
          </label>
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="text-red-500">{errors.password}</span>}
        </div>

        {/*Confirmarcion*/}
        <div>
          <label className="label">
            <span className="text-base label-text">Confirmar Contraseña</span>
          </label>
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            className="w-full input input-bordered"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword}</span>
          )}
        </div>

        <div>
          <button type='submit' className="btn btn-block bg-[#000000] text-white">
            {
              loading? <span className="loading loading-spinner loading-sm"></span> : 'Registrarse'
            }
          </button>
        </div>

        <span>
          Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 hover:underline">
            logeate
          </Link>
        </span>
      
      </form>

    </div>
  )
}

export default page
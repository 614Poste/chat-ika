"use client"
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Correo electrónico no válido';
    }
    if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        // registar usuario en firebase
        const userCredential = await signInWithEmailAndPassword(auth,email, password);
        const user = userCredential.user;
        if(user){
          router.push('/');
        }
        
        setErrors({});
      }
    } catch (error) {
      // catchea error al iniciar sesion
      console.error('Error al iniciar sesion:', error.message);
      toast.error(error.message);
      setErrors({});
    }
    setLoading(false);
    
  };
 
  return (
    <div className="flex justify-center items-center h-screen font-primary p-10 m-2">

      {/*form*/}
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl shadow-lg p-10">
    
        <h1 className='font-secondary text-xl text-center font-semibold text-[#ffffff]'>Ikachat</h1>

      
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

         {/*password*/}
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

        

        <div>
          <button type='submit' className="btn btn-block bg-[#000000] text-white">
            {
              loading? <span className="loading loading-spinner loading-sm"></span> : 'Iniciar sesión'
            }
          </button>
        </div>

         <span>
           ¿No tienes una cuenta?{' '}
           <Link href="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
            Regístrate
          </Link>
        </span>
      
      </form>

    </div>
  )
}

export default page
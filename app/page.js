'use client'
import React,{useEffect,useState} from 'react';
import { app,firestore } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Users from './components/Users';
import ChatRoom from './components/ChatRoom';

function page() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  useEffect(() => {
    // 
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = ({ id: docSnap.id, ...docSnap.data() })
            setUser(data);
        } else {
          console.log('no hay documento');
        }
      } else {
        setUser(null);
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]); 

  if(user == null) return (<div className='text-4xl'>cargando...</div>);

 
  return (
    <div className="flex h-screen">
      {/* Left side users */}
      <div className="flex-shrink-0 w-3/12">
        <Users userData={user} setSelectedChatroom={setSelectedChatroom}/>
      </div>

      {/* Right side chat room */}
      <div className="flex-grow w-9/12">
        {
          selectedChatroom ? (<>
          <ChatRoom user={user} selectedChatroom={selectedChatroom}/>
          </>):(<>
          <div className="flex items-center justify-center h-full">
            <div className="text-2xl text-gray-400">Selecciona una sala</div>
          </div>
          </>)
        }
        
      </div>
    </div>
  )
}

export default page
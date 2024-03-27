import React,{useState,useEffect,useRef} from 'react';
import MessageCard from './MessageCard';
import MessageInput from './MessageInput';
import { addDoc, collection,doc, serverTimestamp,onSnapshot,query,where,orderBy,updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

function ChatRoom({ user ,selectedChatroom}) {
  const me = selectedChatroom?.myData
  const other = selectedChatroom?.otherData
  const chatRoomId = selectedChatroom?.id

  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Desplazarse hacia abajo cuando cambian los mensajes
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

//tomar mensajes 
useEffect(() => {
  if(!chatRoomId) return;
  const unsubscribe = onSnapshot(
    query(collection(firestore, 'messages'),where("chatRoomId","==",chatRoomId),orderBy('time', 'asc')),
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //console.log(messages);
      setMessages(messages);
    }
  );

  return unsubscribe;
}, [chatRoomId]);

//enviar mensajes a la base de datos
 const sendMessage = async () => {
    const messagesCollection = collection(firestore, 'messages');
    // Check if the message is not empty
  if (message == '' && image == '') {
    return;
  }

  try {
    // Agregar un nuevo mensaje a Firestore
    const newMessage = {
      chatRoomId:chatRoomId,
      sender: me.id,
      content: message,
      time: serverTimestamp(),
      image: image,
    };

    await addDoc(messagesCollection, newMessage);
    setMessage('');
    setImage('');
    //enviar a la sala de chat por id de sala de chat y actualizar el último mensaje
    const chatroomRef = doc(firestore, 'chatrooms', chatRoomId);
    await updateDoc(chatroomRef, { lastMessage: message ? message : "Image" });

    // Limpiar el campo de entrada después de enviar el mensaje
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
  }

  // Desplazarse hacia abajo después de enviar un mensaje
  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }
    
}


  return (
    <div className='flex bg-gray-800 flex-col h-screen'>
      {/* Contenedor de mensajes con desbordamiento y desplazamiento */}
      <div ref={messagesContainerRef} className='flex-1 overflow-y-auto p-10'>
        {messages?.map((message) => (
          <MessageCard key={message.id} message={message} me={me} other={other}/>
        ))}
      </div>

      {/* caja de entrada en la parte inferior */}
      <MessageInput sendMessage={sendMessage} message={message} setMessage={setMessage} image={image} setImage={setImage}/>
    </div>
  );
}

export default ChatRoom;

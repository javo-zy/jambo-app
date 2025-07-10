// src/app/chat/[id]/page.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation'; // Importamos useRouter
import type { User } from '@supabase/supabase-js';

type Message = {
  id: string;
  created_at: string;
  content: string;
  sender_id: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const { id: conversation_id } = useParams();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter(); // Inicializamos el router

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = useCallback(async (currentUser: User | null) => {
    if (!currentUser || !conversation_id) return;
    
    const { data, error } = await supabase
      .rpc('get_messages_for_conversation', {
        p_conversation_id: conversation_id,
        p_user_id: currentUser.id
      });
    
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  }, [conversation_id]);

  useEffect(() => {
    const setupChat = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      await fetchMessages(currentUser);
    };

    setupChat();
  }, [conversation_id, fetchMessages]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newMessage.trim() === '' || !user || !conversation_id) return;

    const content = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase
      .from('messages')
      .insert({
        content: content,
        sender_id: user.id,
        conversation_id: conversation_id as string,
      });
    
    if (error) {
      console.error('Error sending message:', error);
      setNewMessage(content); // Devolvemos el mensaje al input si hay un error
    } else {
      // --- ESTA ES LA LÍNEA CLAVE DE LA SOLUCIÓN ---
      // En lugar de esperar la notificación, forzamos una recarga de los datos de la página.
      router.refresh();
    }
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', maxWidth: '800px', margin: 'auto', border: '1px solid #ddd' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map(message => (
          <div key={message.id} style={{
            display: 'flex',
            justifyContent: message.sender_id === user.id ? 'flex-end' : 'flex-start',
            marginBottom: '10px'
          }}>
            <div style={{
              background: message.sender_id === user.id ? '#007bff' : '#e9e9eb',
              color: message.sender_id === user.id ? 'white' : 'black',
              padding: '10px 15px',
              borderRadius: '20px',
              maxWidth: '70%'
            }}>
              <p style={{ margin: 0 }}>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ flexGrow: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '20px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>
    </div>
  );
}

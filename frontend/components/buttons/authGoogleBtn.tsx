"use client"
import { useState } from 'react';

export default function GoogleAuthButton() {
  const [authWindow, setAuthWindow] = useState<any>(null);

  const handleGoogleAuth = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const newWindow = window.open(
      'http://localhost:3333/api/auth/google',
      'Google Auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    setAuthWindow(newWindow);

    // const checkWindow = setInterval(() => {
    //   if (newWindow.closed) {
    //     clearInterval(checkWindow);
    //     // Тут можна додати логіку для обробки успішної аутентифікації
    //     // Наприклад, оновити стан користувача або перенаправити на іншу сторінку
    //   }
    // }, 500);
  };

  return (
    <button onClick={handleGoogleAuth}>
      Увійти через Google
    </button>
  );
}
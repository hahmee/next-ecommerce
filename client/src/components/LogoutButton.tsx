"use client"

import {useQueryClient} from "@tanstack/react-query";


export default function LogoutButton() {
  const queryClient = useQueryClient();

  const onLogout = () => {
   
  };


  return (
    <button onClick={onLogout}>
      로그아웃
    </button>
  )
}